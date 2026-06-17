"""Gera o gráfico do Paradoxo do Aniversário usado nos slides de Funções Hash.

P(n) = 1 - prod_{i=0}^{n-1} (365 - i) / 365  (probabilidade de ao menos uma
coincidência de aniversário entre n pessoas, ignorando anos bissextos).

Saída: ../img/birthday_paradox.png
"""

import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

N_MAX = 80

n = np.arange(1, N_MAX + 1)
# P(n) acumulada: produto dos termos (365 - i)/365 para i = 0..n-1
p_sem_colisao = np.cumprod((365 - (n - 1)) / 365.0)
p_colisao = 1.0 - p_sem_colisao

fig, ax = plt.subplots(figsize=(8, 5))

ax.plot(n, p_colisao, color="#1f4e9c", linewidth=2.5, zorder=3)
ax.fill_between(n, p_colisao, color="#1f4e9c", alpha=0.10, zorder=2)

# Destaques: 23 pessoas -> ~50,7% e 70 pessoas -> ~99,9%
p23 = p_colisao[23 - 1]
p70 = p_colisao[70 - 1]

ax.axhline(0.5, color="gray", linestyle="--", linewidth=1, zorder=1)
ax.vlines(23, 0, p23, color="#c0392b", linestyle=":", linewidth=1.5, zorder=2)
ax.plot([23], [p23], "o", color="#c0392b", markersize=8, zorder=4)
ax.plot([70], [p70], "o", color="#c0392b", markersize=8, zorder=4)

ax.annotate(
    f"23 pessoas → {p23 * 100:.1f}%",
    xy=(23, p23),
    xytext=(30, 0.38),
    fontsize=12,
    fontweight="bold",
    color="#c0392b",
    arrowprops=dict(arrowstyle="->", color="#c0392b", lw=1.5),
)
ax.annotate(
    f"70 pessoas → {p70 * 100:.1f}%",
    xy=(70, p70),
    xytext=(48, 0.80),
    fontsize=12,
    fontweight="bold",
    color="#c0392b",
    arrowprops=dict(arrowstyle="->", color="#c0392b", lw=1.5),
)
ax.text(2, 0.52, "50%", fontsize=10, color="gray")

ax.set_xlabel("Número de pessoas na sala ($n$)", fontsize=12)
ax.set_ylabel("Probabilidade de $\\geq$ 1 colisão", fontsize=12)
ax.set_title(
    "Paradoxo do Aniversário: probabilidade de dois aniversários iguais",
    fontsize=12,
)
ax.set_xlim(0, N_MAX)
ax.set_ylim(0, 1.02)
ax.set_xticks(np.arange(0, N_MAX + 1, 10))
ax.set_yticks(np.arange(0, 1.01, 0.1))
ax.yaxis.set_major_formatter(lambda y, _: f"{y * 100:.0f}%")
ax.grid(True, alpha=0.3)

fig.tight_layout()

out = os.path.join(os.path.dirname(__file__), "..", "img", "birthday_paradox.png")
fig.savefig(out, dpi=200)
print(f"salvo em {os.path.abspath(out)}  (P(23)={p23:.4f}, P(70)={p70:.6f})")
