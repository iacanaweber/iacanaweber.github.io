#!/usr/bin/env python3
"""
Gerador de desafios para o Trabalho Prático de Logaritmo Discreto (CSS 98G08-04).

Produz dois arquivos no diretório pai (Discrete_Logarithm_Lab/):
  - desafios.txt   (entregue ao aluno; sem segredos)
  - gabarito.txt   (uso interno do professor; com a, b, K_ab, ordem(alpha), fat(p-1))

Cenários (23 total): 2 cenários por tamanho de p (um NIST FFC seguro + um
ANTI-NIST com p-1 smooth) para 11 tamanhos (32 a 1024 bits), mais C0 (16 bits,
EXEMPLO RESOLVIDO no enunciado). A ordem dos tipos dentro de cada par alterna
deliberadamente para nao revelar o padrao ao aluno.

A geração dos seguros segue NIST SP 800-56A Rev. 3 / FIPS 186-4 §A.2:
  - q primo de N bits
  - p = q*j + 1 primo de L bits
  - g = h^((p-1)/q) mod p, com h aleatório em (1, p-1), até g > 1
  - validacao: q | (p-1), g != 1, g^q == 1 (mod p)

Os ANTI-NIST violam o padrão de propósito (p-1 com fatores pequenos):
  - p-1 = 2 * prod(primos aleatorios <= 2^smooth_bits)
  - g de ordem maxima (p-1): testar g^((p-1)/q_i) != 1 para cada fator primo q_i

Uso:
    python3 gerar_desafios.py [--seed SEED]
"""

import argparse
import random
import sys
import time
from pathlib import Path

try:
    from sympy import isprime, nextprime, randprime
except ImportError:
    print("ERRO: este script requer sympy. Instale com: pip install sympy", file=sys.stderr)
    sys.exit(1)


# ---------- NIST FFC (seguro) ----------

def gen_safe_nist(L, N, rng, max_tries=200_000):
    """Gera (p, q, g) seguindo NIST FFC: q primo de N bits, p = q*j+1 primo de L bits,
    g gerador do subgrupo de ordem q."""
    if N >= L:
        # Caso degenerado para tamanhos minusculos: usar primo seguro p = 2q+1.
        for _ in range(max_tries):
            q = randprime(2**(L-2), 2**(L-1))
            p = 2*q + 1
            if isprime(p):
                break
        else:
            raise RuntimeError(f"Falha ao gerar safe prime ({L},{N})")
        # g de ordem q: h^((p-1)/q) = h^2 mod p
        while True:
            h = rng.randrange(2, p-1)
            g = pow(h, 2, p)
            if g > 1:
                break
        return p, q, g

    # NIST FFC padrao
    for _ in range(max_tries):
        q = randprime(2**(N-1), 2**N)
        # p = q*j + 1 ; queremos p de L bits, entao j ~ 2^(L-N)
        j_low = (2**(L-1)) // q + 1
        j_high = (2**L) // q
        if j_low > j_high:
            continue
        # Iterar j ate p ser primo
        j = rng.randrange(j_low, j_high+1)
        # j precisa ser par (porque p = q*j + 1 precisa ser impar e q eh impar)
        if j % 2 == 1:
            j += 1
        for _ in range(20000):
            p = q*j + 1
            if p.bit_length() != L:
                break
            if isprime(p):
                # achou
                while True:
                    h = rng.randrange(2, p-1)
                    g = pow(h, (p-1)//q, p)
                    if g > 1:
                        break
                return p, q, g
            j += 2
    raise RuntimeError(f"Falha ao gerar NIST FFC ({L},{N})")


# ---------- ANTI-NIST (p-1 smooth) ----------

def gen_smooth(L, factor_bits, rng, max_S_tries=2000):
    """Gera (p, alpha, fatoracao) com p primo de L bits e p-1 = S*k onde:
      - S = produto de primos de aprox. factor_bits bits cada (smooth)
      - k = inteiro com fatores primos <= 2^factor_bits (preserva smoothness)
    alpha tem ordem maxima (p-1).

    Estrategia: aterrissar S em ~L - k_max_bits bits para dar amplo espaco a k
    (assim ha ~2^k_max_bits candidatos de k para teste de primalidade). Se um
    fator adicional fizesse S exceder o teto, esse fator eh descartado e um
    fator menor (proporcional ao espaco restante) eh usado como "afinacao".
    """
    from sympy import factorint

    target_low = 2**(L-1)
    target_high = 2**L
    # k pode ter ate k_max_bits (limita o numero de tentativas a 2^k_max_bits)
    k_max_bits = min(factor_bits, 16)
    # Alvo desejado para S: deixa k_max_bits bits livres para k
    S_aim_bits = L - k_max_bits
    # Teto absoluto: nao deixa k cair abaixo de ~4 candidatos
    S_top_bits = L - 2

    for s_trial in range(max_S_tries):
        factors = []
        S = 1
        # Fase grossa: adiciona fatores cheios ate ficar a um fator do alvo
        while S.bit_length() + factor_bits < S_aim_bits:
            f = randprime(2**(factor_bits-1), 2**factor_bits)
            factors.append(f)
            S *= f
        # Fase fina: ajusta com fatores menores ate atingir [S_aim_bits, S_top_bits]
        attempts = 0
        while S.bit_length() < S_aim_bits and attempts < 200:
            attempts += 1
            # Quantos bits ainda cabem antes do teto
            room = S_top_bits - S.bit_length()
            if room < 2:
                break
            # Tamanho do fator: o maior possivel que NAO exceda o teto
            fb = min(factor_bits, room)
            if fb < 2:
                break
            f = randprime(2**(fb-1), 2**fb)
            if S * f > 2**S_top_bits:
                continue
            factors.append(f)
            S *= f
        if S.bit_length() < S_aim_bits or S.bit_length() > S_top_bits:
            continue

        # k deve estar em [k_low, k_high] tal que k*S+1 tenha L bits
        k_low = max(2, (target_low - 1) // S + 1)
        k_high = (target_high - 2) // S
        k_high = min(k_high, 2**k_max_bits)
        if k_low > k_high:
            continue

        # Iterar k procurando primo
        for k in range(k_low, k_high + 1):
            cand = k * S + 1
            if cand.bit_length() != L:
                continue
            # Verificar smoothness de k (seus fatores primos <= 2^factor_bits)
            if k.bit_length() > factor_bits:
                continue
            if not isprime(cand):
                continue
            # achou primo. Confirmar fatoracao smooth de k
            k_facs = factorint(k)
            if k_facs and max(k_facs.keys()).bit_length() > factor_bits:
                continue
            all_factors = list(factors) + list(k_facs.keys())
            unique_factors = sorted(set(all_factors))
            # Buscar gerador alpha de ordem (p-1)
            for _ in range(10_000):
                alpha = rng.randrange(2, cand - 1)
                if all(pow(alpha, (cand - 1) // q, cand) != 1 for q in unique_factors):
                    assert pow(alpha, cand - 1, cand) == 1
                    return cand, alpha, all_factors
    raise RuntimeError(f"Falha ao gerar smooth prime ({L} bits, fatores ~{factor_bits} bits)")


# ---------- Cenários ----------

SCENARIOS = [
    # (id, bits_p, tipo, params)
    ("C0",   16,  "safe",   {"L": 16,   "N": 15}),
    ("C1",   32,  "smooth", {"L": 32,   "factor_bits": 7}),
    ("C2",   32,  "safe",   {"L": 32,   "N": 31}),
    ("C3",   40,  "safe",   {"L": 40,   "N": 39}),
    ("C4",   40,  "smooth", {"L": 40,   "factor_bits": 8}),
    ("C5",   48,  "smooth", {"L": 48,   "factor_bits": 9}),
    ("C6",   48,  "safe",   {"L": 48,   "N": 47}),
    ("C7",   64,  "smooth", {"L": 64,   "factor_bits": 10}),
    ("C8",   64,  "safe",   {"L": 64,   "N": 63}),
    ("C9",   80,  "safe",   {"L": 80,   "N": 79}),
    ("C10",  80,  "smooth", {"L": 80,   "factor_bits": 11}),
    ("C11",  96,  "smooth", {"L": 96,   "factor_bits": 12}),
    ("C12",  96,  "safe",   {"L": 96,   "N": 95}),
    ("C13", 112,  "safe",   {"L": 112,  "N": 111}),
    ("C14", 112,  "smooth", {"L": 112,  "factor_bits": 14}),
    ("C15", 128,  "safe",   {"L": 128,  "N": 127}),
    ("C16", 128,  "smooth", {"L": 128,  "factor_bits": 16}),
    ("C17", 256,  "smooth", {"L": 256,  "factor_bits": 20}),
    ("C18", 256,  "safe",   {"L": 256,  "N": 224}),
    ("C19", 512,  "smooth", {"L": 512,  "factor_bits": 24}),
    ("C20", 512,  "safe",   {"L": 512,  "N": 224}),
    ("C21", 1024, "safe",   {"L": 1024, "N": 256}),
    ("C22", 1024, "smooth", {"L": 1024, "factor_bits": 30}),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=20260522,
                        help="seed para reprodutibilidade")
    parser.add_argument("--skip", type=str, default="",
                        help="ids de cenarios a pular, separados por virgula (ex: C7,C8)")
    args = parser.parse_args()
    rng = random.Random(args.seed)
    skip = {s.strip() for s in args.skip.split(",") if s.strip()}

    out_dir = Path(__file__).resolve().parent.parent
    desafios_path = out_dir / "desafios.txt"
    gabarito_path = out_dir / "gabarito.txt"

    results = []
    for cid, bits_p, tipo, params in SCENARIOS:
        if cid in skip:
            print(f"[{cid}] pulado", file=sys.stderr)
            continue
        t0 = time.time()
        print(f"[{cid}] gerando ({bits_p} bits, {tipo})...", file=sys.stderr, flush=True)
        if tipo == "safe":
            p, q, alpha = gen_safe_nist(rng=rng, **params)
            ord_alpha = q
            fat_pm1 = None  # nao guardamos a fatoracao completa para os seguros
        else:
            p, alpha, factors = gen_smooth(rng=rng, **params)
            ord_alpha = p - 1
            fat_pm1 = sorted(set(factors))
            q = None

        # Segredos a, b in [1, ord_alpha-1]
        a = rng.randrange(2, ord_alpha)
        b = rng.randrange(2, ord_alpha)
        A = pow(alpha, a, p)
        B = pow(alpha, b, p)
        K_ab = pow(alpha, (a*b) % ord_alpha, p)

        # Sanity checks
        assert pow(B, a, p) == K_ab, f"{cid}: B^a != K_ab"
        assert pow(A, b, p) == K_ab, f"{cid}: A^b != K_ab"
        if tipo == "safe":
            assert pow(alpha, q, p) == 1, f"{cid}: ord(alpha) != q"
            assert alpha != 1
        else:
            assert pow(alpha, p-1, p) == 1
            for f in fat_pm1:
                assert pow(alpha, (p-1)//f, p) != 1, f"{cid}: ord(alpha) divide (p-1)/{f}"

        results.append({
            "id": cid,
            "bits_p": bits_p,
            "tipo": tipo,
            "p": p,
            "alpha": alpha,
            "A": A,
            "B": B,
            "a": a,
            "b": b,
            "K_ab": K_ab,
            "ord_alpha": ord_alpha,
            "q": q,
            "fat_pm1": fat_pm1,
        })
        dt = time.time() - t0
        print(f"[{cid}] OK em {dt:.1f}s", file=sys.stderr)

    # Escrever desafios.txt
    with desafios_path.open("w") as f:
        f.write("# Trabalho Pratico --- Logaritmo Discreto (CSS 98G08-04)\n")
        f.write("# Prof. Iacana Ianiski Weber\n")
        f.write("#\n")
        f.write("# Para cada cenario Ci, encontre K_ab = alpha^(a*b) mod p\n")
        f.write("# sabendo que A = alpha^a mod p e B = alpha^b mod p.\n")
        f.write("# Reporte K_ab em decimal no arquivo solucao.txt.\n")
        f.write("#\n")
        f.write("# Atencao: o tamanho de p NAO determina sozinho a dificuldade.\n")
        f.write("# Antes de atacar, fatore p-1 e calcule a ordem de alpha.\n")
        f.write("#\n")
        for r in results:
            f.write(f"\n[{r['id']}]  bits={r['bits_p']}")
            if r["id"] == "C0":
                f.write("  (EXEMPLO RESOLVIDO)")
            f.write("\n")
            f.write(f"p     = {r['p']}\n")
            f.write(f"alpha = {r['alpha']}\n")
            f.write(f"A     = {r['A']}\n")
            f.write(f"B     = {r['B']}\n")
            if r["id"] == "C0":
                f.write("# Solucao revelada (sanity check para validar sua implementacao):\n")
                f.write(f"a     = {r['a']}\n")
                f.write(f"b     = {r['b']}\n")
                f.write(f"K_ab  = {r['K_ab']}\n")

    # Escrever gabarito.txt (uso interno)
    with gabarito_path.open("w") as f:
        f.write("# GABARITO --- Trabalho Pratico Logaritmo Discreto (CSS 98G08-04)\n")
        f.write("# USO INTERNO DO PROFESSOR -- NAO DISTRIBUIR\n")
        f.write(f"# Gerado com seed={args.seed}\n#\n")
        for r in results:
            f.write(f"\n[{r['id']}]  bits={r['bits_p']}  tipo={r['tipo']}\n")
            f.write(f"p         = {r['p']}\n")
            f.write(f"alpha     = {r['alpha']}\n")
            f.write(f"A         = {r['A']}\n")
            f.write(f"B         = {r['B']}\n")
            f.write(f"a         = {r['a']}\n")
            f.write(f"b         = {r['b']}\n")
            f.write(f"K_ab      = {r['K_ab']}\n")
            f.write(f"ord_alpha = {r['ord_alpha']}\n")
            if r["q"] is not None:
                f.write(f"q         = {r['q']}    # NIST FFC: subgrupo de ordem prima\n")
            if r["fat_pm1"] is not None:
                f.write(f"fat(p-1)  = {r['fat_pm1']}\n")

    print(f"\nGerado: {desafios_path}", file=sys.stderr)
    print(f"Gerado: {gabarito_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
