"""Estilo compartilhado das figuras da aula de Criptografia Pós-Quântica.

Paleta e ajustes de matplotlib para um acabamento profissional e consistente
com as demais figuras do repositório (ver Funções_Hash/scripts/birthday_paradox.py).
"""

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Paleta (mesma linguagem visual dos outros decks de CSS)
PRIMARY = "#0B5FA5"     # azul principal
PRIMARY_D = "#08406e"   # azul escuro
ACCENT = "#C0392B"      # vermelho (destaque/alerta)
SECONDARY = "#2F855A"   # verde
ORANGE = "#D97706"      # laranja
PURPLE = "#6B46C1"      # roxo
GRID = "#D1D5DB"        # cinza claro (grade)
NEUTRAL = "#374151"     # cinza escuro (texto/eixos)
BG = "#FFFFFF"


def aplicar_estilo():
    plt.rcParams.update(
        {
            "font.family": "sans-serif",
            "font.sans-serif": ["DejaVu Sans"],
            "font.size": 12,
            "axes.edgecolor": NEUTRAL,
            "axes.labelcolor": NEUTRAL,
            "axes.titlecolor": PRIMARY_D,
            "axes.titlesize": 13,
            "axes.titleweight": "bold",
            "xtick.color": NEUTRAL,
            "ytick.color": NEUTRAL,
            "text.color": NEUTRAL,
            "axes.grid": True,
            "grid.color": GRID,
            "grid.linewidth": 0.8,
            "grid.alpha": 0.7,
            "figure.facecolor": BG,
            "axes.facecolor": BG,
            "savefig.facecolor": BG,
        }
    )


def limpar_eixos(ax, manter=("left", "bottom")):
    """Remove spines não desejadas para um visual mais leve."""
    for lado in ("top", "right", "left", "bottom"):
        ax.spines[lado].set_visible(lado in manter)
