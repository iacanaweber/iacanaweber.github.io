"""Prazos de migração pós-quântica por potência/bloco (Gantt comparativo).

Baseado nos roteiros públicos: NSA CNSA 2.0 (EUA), roadmap coordenado da UE +
BSI (Alemanha) e ANSSI (França), NCSC (Reino Unido), ICCS/OSCCA (China) e
TC26 (Rússia). Barras tracejadas indicam horizontes ainda incertos/não fixados.

Saída: ../img/global_pqc_timeline.png
"""

import os

from _estilo import ACCENT, NEUTRAL, ORANGE, PRIMARY, PRIMARY_D, PURPLE, SECONDARY, aplicar_estilo, limpar_eixos
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

aplicar_estilo()

# Cada potência: (nome, cor, início, fim, incerto?, [(ano, rótulo)])
paises = [
    ("EUA — NSA CNSA 2.0", PRIMARY, 2025, 2035, False,
     [(2030, "assinatura\nsw/firmware"), (2033, "maioria\ndos sistemas"), (2035, "todos\nos NSS")]),
    ("UE — BSI / ANSSI", SECONDARY, 2025, 2035, False,
     [(2027, "cert. ANSSI"), (2030, "alto risco /\nKRITIS"), (2035, "risco médio")]),
    ("Reino Unido — NCSC", ORANGE, 2028, 2035, False,
     [(2028, "inventário"), (2031, "alta\nprioridade"), (2035, "migração\ncompleta")]),
    ("China — ICCS / OSCCA", ACCENT, 2025, 2031, True,
     [(2025, "chamada\nprópria"), (2028, "padrões\n(previsto)")]),
    ("Rússia — TC26", PURPLE, 2025, 2032, True,
     [(2025, "avaliação\n(GOST-PQ)"), (2031, "padrões\n(previsto)")]),
]

fig, ax = plt.subplots(figsize=(11.5, 5.3))

alturas = list(range(len(paises)))[::-1]
for y, (nome, cor, ini, fim, incerto, marcos) in zip(alturas, paises):
    ax.barh(y, fim - ini, left=ini, height=0.46, color=cor, alpha=0.30,
            zorder=2, edgecolor=cor, linewidth=1.4,
            linestyle="--" if incerto else "-")
    for ano, rot in marcos:
        ax.plot([ano], [y], "o", ms=10, color=cor, zorder=5,
                markeredgecolor="white", markeredgewidth=1.4)
        ax.text(ano, y + 0.33, rot, ha="center", va="bottom", fontsize=8,
                color=NEUTRAL, linespacing=0.95)

ax.set_yticks(alturas)
ax.set_yticklabels([p[0] for p in paises], fontsize=11, fontweight="bold")

# Linha "hoje"
ax.axvline(2026, color="#111111", lw=1.6, linestyle=":", zorder=4)
ax.text(2026, len(paises) - 0.35, "hoje (2026)", rotation=90, va="top", ha="right",
        fontsize=9, color="#111111", fontweight="bold")

ax.set_xlim(2024.3, 2036)
ax.set_ylim(-0.7, len(paises) - 0.2)
ax.set_xticks(range(2025, 2036, 1))
ax.set_xlabel("Ano", fontsize=11)
ax.grid(axis="y", visible=False)
ax.grid(axis="x", alpha=0.5)
limpar_eixos(ax, manter=("bottom",))

leg = [Patch(facecolor="#999999", edgecolor="#555555", alpha=0.3, label="horizonte definido"),
       Patch(facecolor="#999999", edgecolor="#555555", alpha=0.3, linestyle="--",
             label="horizonte incerto/previsto")]
ax.legend(handles=leg, loc="lower right", fontsize=9, framealpha=0.9)

ax.set_title("Prazos de migração pós-quântica: convergência em ~2030–2035, "
             "mas padrões e filosofias divergentes", fontsize=12.5, color=PRIMARY,
             fontweight="bold", pad=12)
fig.tight_layout()

out = os.path.join(os.path.dirname(__file__), "..", "img", "global_pqc_timeline.png")
fig.savefig(out, dpi=200, bbox_inches="tight")
print(f"salvo em {os.path.abspath(out)}")
