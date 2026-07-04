"""Comparação de tamanhos: criptografia clássica vs. pós-quântica.

Barras horizontais em ESCALA LOGARÍTMICA (bytes) comparando o tamanho da
chave pública e do texto cifrado / assinatura de esquemas clássicos (RSA, ECC)
e pós-quânticos padronizados pelo NIST.

Fonte dos tamanhos: especificações NIST FIPS 203/204/205 e das submissões
(Classic McEliece, HQC, Falcon). Valores em bytes.

Saída: ../img/pqc_sizes.png
"""

import os

import numpy as np

from _estilo import ACCENT, PRIMARY, SECONDARY, aplicar_estilo, limpar_eixos
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

aplicar_estilo()

# (rótulo, chave_pública_bytes, segundo_valor_bytes)  -- 2º valor = ct (KEM) ou assinatura
kem = [
    ("ECDH P-256", 64, 64),
    ("RSA-3072", 384, 384),
    ("ML-KEM-768\n(Kyber)", 1184, 1088),
    ("HQC-128", 2249, 4497),
    ("Classic McEliece\n(mceliece6688128)", 1044992, 208),
]
sig = [
    ("ECDSA P-256", 64, 64),
    ("RSA-3072", 384, 384),
    ("Falcon-512", 897, 666),
    ("ML-DSA-65\n(Dilithium)", 1952, 3309),
    ("SLH-DSA-128f\n(SPHINCS+)", 32, 17088),
]


def fmt_bytes(n):
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f} MB"
    if n >= 1000:
        return f"{n/1000:.1f} kB"
    return f"{n} B"


def painel(ax, dados, titulo, rot2):
    rot = [d[0] for d in dados]
    pk = np.array([d[1] for d in dados], dtype=float)
    v2 = np.array([d[2] for d in dados], dtype=float)
    y = np.arange(len(dados))
    h = 0.38
    b1 = ax.barh(y + h / 2, pk, height=h, color=PRIMARY, label="Chave pública",
                 zorder=3)
    b2 = ax.barh(y - h / 2, v2, height=h, color=ACCENT, label=rot2, zorder=3)
    ax.set_xscale("log")
    ax.set_xlim(10, 3_000_000)
    ax.set_yticks(y)
    ax.set_yticklabels(rot, fontsize=9.5)
    ax.set_title(titulo, fontsize=12)
    ax.xaxis.set_major_formatter(FuncFormatter(lambda x, _: fmt_bytes(int(x))))
    ax.set_xlabel("bytes (escala log)", fontsize=10)
    ax.grid(axis="y", visible=False)
    for bars in (b1, b2):
        for r in bars:
            w = r.get_width()
            ax.text(w * 1.15, r.get_y() + r.get_height() / 2, fmt_bytes(int(w)),
                    va="center", ha="left", fontsize=8, color="#222222")
    limpar_eixos(ax, manter=("bottom",))
    ax.legend(loc="lower right", fontsize=9, framealpha=0.9)


fig, axes = plt.subplots(1, 2, figsize=(11.5, 5.4))
painel(axes[0], kem, "Cifragem / Encapsulamento de Chave (KEM)", "Texto cifrado")
painel(axes[1], sig, "Assinaturas Digitais", "Assinatura")

fig.suptitle("Preço da resistência quântica: chaves e saídas MUITO maiores "
             "(escala logarítmica)", fontsize=13, color=PRIMARY, fontweight="bold",
             y=1.03)
fig.tight_layout()

out = os.path.join(os.path.dirname(__file__), "..", "img", "pqc_sizes.png")
fig.savefig(out, dpi=200, bbox_inches="tight")
print(f"salvo em {os.path.abspath(out)}")
