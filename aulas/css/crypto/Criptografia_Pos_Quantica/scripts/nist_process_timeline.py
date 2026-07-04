"""Linha do tempo do processo de padronização de PQC do NIST (2016--2025).

Marcos oficiais do NIST PQC Standardization Project.
Saída: ../img/nist_process_timeline.png
"""

import os

from _estilo import ACCENT, NEUTRAL, PRIMARY, PRIMARY_D, SECONDARY, aplicar_estilo, limpar_eixos
import matplotlib.pyplot as plt

aplicar_estilo()

# (ano_posição, rótulo curto, descrição, acima?)
marcos = [
    (2016.9, "2016", "Chamada pública\nde propostas", True),
    (2017.9, "2017", "82 submissões\n(69 aceitas)", False),
    (2019.0, "2019", "2ª rodada\n(26 candidatos)", True),
    (2020.6, "2020", "3ª rodada\n(7 finalistas)", False),
    (2022.6, "2022", "Seleção: Kyber,\nDilithium, Falcon,\nSPHINCS+", True),
    (2024.62, "ago/2024", "FIPS 203, 204, 205\n(ML-KEM, ML-DSA,\nSLH-DSA)", False),
    (2025.2, "mar/2025", "HQC: 4º KEM\n(baseado em código)", True),
]

fig, ax = plt.subplots(figsize=(11.5, 4.4))

x0, x1 = 2016.2, 2025.8
ax.plot([x0, x1], [0, 0], color=PRIMARY, lw=3, zorder=2, solid_capstyle="round")
# seta final
ax.annotate("", xy=(x1 + 0.15, 0), xytext=(x1, 0),
            arrowprops=dict(arrowstyle="-|>", color=PRIMARY, lw=3, mutation_scale=22))

for x, ano, desc, acima in marcos:
    destaque = "FIPS" in desc or "HQC" in desc
    cor = ACCENT if "FIPS" in desc else (SECONDARY if "HQC" in desc else PRIMARY_D)
    ax.plot([x], [0], "o", ms=13 if destaque else 10, color=cor, zorder=4,
            markeredgecolor="white", markeredgewidth=1.5)
    dy = 1.0 if acima else -1.0
    va = "bottom" if acima else "top"
    ax.plot([x, x], [0, dy * 0.28], color=NEUTRAL, lw=1, zorder=3)
    ax.text(x, dy * 0.42, ano, ha="center", va=va, fontsize=11, fontweight="bold",
            color=cor)
    ax.text(x, dy * (0.95 if acima else 0.78), desc, ha="center", va=va,
            fontsize=9, color=NEUTRAL)

ax.set_xlim(x0 - 0.3, x1 + 0.6)
ax.set_ylim(-2.2, 2.2)
ax.axis("off")
ax.set_title("NIST PQC: um processo público e competitivo de ~8 anos "
             "(2016 → 2024/2025)", fontsize=13, color=PRIMARY, fontweight="bold",
             pad=14)
fig.tight_layout()

out = os.path.join(os.path.dirname(__file__), "..", "img", "nist_process_timeline.png")
fig.savefig(out, dpi=200, bbox_inches="tight")
print(f"salvo em {os.path.abspath(out)}")
