"""Reticulado (lattice) 2D: intuição do Problema do Vetor Mais Curto (SVP).

Mostra um mesmo reticulado gerado por duas bases:
  - uma base "boa" (vetores curtos e quase ortogonais);
  - uma base "ruim" (vetores longos e oblíquos).
Ambas geram exatamente os mesmos pontos, mas encontrar o vetor mais curto é
fácil com a base boa e difícil com a base ruim --- a essência da dureza dos
reticulados usada pela criptografia baseada em reticulados (LWE, Kyber/ML-KEM).

Saída: ../img/lattice_svp.png
"""

import os

import numpy as np

from _estilo import ACCENT, GRID, NEUTRAL, PRIMARY, SECONDARY, aplicar_estilo, limpar_eixos
import matplotlib.pyplot as plt

aplicar_estilo()

# Base "boa": vetores curtos e ORTOGONAIS (b1.b2 = 0), |b1| = |b2| = sqrt(5)
b1 = np.array([2, 1])
b2 = np.array([-1, 2])
# Base "ruim" do MESMO reticulado (mesma célula fundamental, |det| = 5):
#   c1 = 3*b1 + b2 = (5, 5);  c2 = 2*b1 + b2 = (3, 4)
c1 = 3 * b1 + b2
c2 = 2 * b1 + b2

# Pontos do reticulado
pts = []
R = 7
for i in range(-R, R + 1):
    for j in range(-R, R + 1):
        p = i * b1 + j * b2
        if abs(p[0]) <= 6.4 and abs(p[1]) <= 6.4:
            pts.append(p)
pts = np.array(pts)

fig, axes = plt.subplots(1, 2, figsize=(10.5, 5.2))

for ax, (base, cor, titulo, nomes) in zip(
    axes,
    [
        ((b1, b2), SECONDARY, "Base \"boa\": vetores curtos e ortogonais",
         (r"$\mathbf{b}_1$", r"$\mathbf{b}_2$")),
        ((c1, c2), ACCENT, "Base \"ruim\": vetores longos e oblíquos",
         (r"$\mathbf{c}_1$", r"$\mathbf{c}_2$")),
    ],
):
    ax.scatter(pts[:, 0], pts[:, 1], s=26, color=PRIMARY, zorder=3,
               edgecolors="white", linewidths=0.6)
    ax.scatter([0], [0], s=70, color=NEUTRAL, zorder=5, marker="s")

    v, w = base
    for vec, nome in zip((v, w), nomes):
        ax.annotate("", xy=vec, xytext=(0, 0),
                    arrowprops=dict(arrowstyle="-|>", color=cor, lw=2.6,
                                    mutation_scale=20), zorder=6)
        ax.text(vec[0] * 1.08 + 0.15, vec[1] * 1.08, nome, color=cor,
                fontsize=14, fontweight="bold", zorder=7)

    # Vetor mais curto (SVP): b1, comprimento sqrt(5) ~ 2.24
    ax.annotate("", xy=b1, xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color="#111111", lw=1.4,
                                linestyle=(0, (4, 2)), mutation_scale=14), zorder=8)
    ax.plot([b1[0]], [b1[1]], "o", color="#111111", ms=6, zorder=9)

    ax.set_xlim(-6.6, 6.6)
    ax.set_ylim(-6.6, 6.6)
    ax.set_aspect("equal")
    ax.set_title(titulo, fontsize=12)
    ax.axhline(0, color=GRID, lw=1)
    ax.axvline(0, color=GRID, lw=1)
    ax.set_xticks(range(-6, 7, 2))
    ax.set_yticks(range(-6, 7, 2))
    limpar_eixos(ax, manter=())

# Anotação do vetor mais curto no primeiro painel
axes[0].annotate("vetor mais curto\n(SVP)", xy=tuple(b1), xytext=(2.7, -3.4),
                 fontsize=11, fontweight="bold", color="#111111", ha="center",
                 arrowprops=dict(arrowstyle="->", color="#111111", lw=1.4))

fig.suptitle("Reticulado 2D: as duas bases geram os MESMOS pontos, "
             "mas achar o vetor mais curto é fácil só com a base boa",
             fontsize=12.5, color=PRIMARY, y=1.02, fontweight="bold")
fig.tight_layout()

out = os.path.join(os.path.dirname(__file__), "..", "img", "lattice_svp.png")
fig.savefig(out, dpi=200, bbox_inches="tight")
print(f"salvo em {os.path.abspath(out)}")
