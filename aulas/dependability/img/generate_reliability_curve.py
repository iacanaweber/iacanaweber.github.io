#!/usr/bin/env python3
"""Generate a professional reliability curve chart for Beamer slides.

Default chart: R(t) = exp(-t/500), with highlighted points at 100h and 500h.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


PRIMARY = "#0B5FA5"
ACCENT = "#D94841"
NEUTRAL = "#4B5563"
GRID = "#D1D5DB"
BG = "#F8FAFC"


def reliability(t: np.ndarray, mtbf: float) -> np.ndarray:
    return np.exp(-t / mtbf)


def build_plot(mtbf: float, tmax: float, output: Path, dpi: int, fig_width: float, fig_height: float) -> None:
    t = np.linspace(0.0, tmax, 1200)
    r = reliability(t, mtbf)

    fig, ax = plt.subplots(figsize=(fig_width, fig_height), constrained_layout=True)
    fig.patch.set_facecolor("white")
    ax.set_facecolor(BG)

    ax.plot(
        t,
        r,
        color=PRIMARY,
        linewidth=3.2,
        label=rf"$R(t)=e^{{-t/{mtbf:.0f}}}$",
        zorder=3,
    )

    marks = [100.0, 500.0]
    labels = ["100h", "500h"]
    for tx, lbl in zip(marks, labels):
        if tx > tmax:
            continue
        ry = math.exp(-tx / mtbf)
        ax.scatter([tx], [ry], s=92, color=ACCENT, edgecolor="white", linewidth=1.2, zorder=5)
        ax.axvline(tx, color=NEUTRAL, linestyle=(0, (6, 4)), linewidth=1.4, alpha=0.85, zorder=2)
        ax.axhline(ry, color=NEUTRAL, linestyle=(0, (2, 4)), linewidth=1.1, alpha=0.65, zorder=2)
        ax.annotate(
            rf"{lbl}: $R({int(tx)})={ry:.4f}$",
            xy=(tx, ry),
            xytext=(12, 18 if tx < 300 else -26),
            textcoords="offset points",
            fontsize=11.5,
            color="#111827",
            bbox={"boxstyle": "round,pad=0.3", "facecolor": "white", "edgecolor": GRID, "alpha": 0.98},
            arrowprops={"arrowstyle": "->", "color": NEUTRAL, "linewidth": 1.2},
            zorder=6,
        )

    ax.set_title("Confiabilidade no Modelo Exponencial", fontsize=20, weight="bold", pad=14)
    ax.text(
        0.01,
        1.02,
        rf"MTBF = {mtbf:.0f} h",
        transform=ax.transAxes,
        fontsize=12,
        color=NEUTRAL,
        va="bottom",
    )

    ax.set_xlabel("Tempo t (horas)", fontsize=13)
    ax.set_ylabel("R(t) = P(T > t)", fontsize=13)
    ax.set_xlim(0, tmax)
    ax.set_ylim(0, 1.02)

    xtick_step = 100 if tmax <= 1000 else 200
    ax.set_xticks(np.arange(0, tmax + 1e-9, xtick_step))
    ax.set_yticks(np.linspace(0, 1.0, 11))

    ax.grid(True, linestyle="-", linewidth=0.8, color=GRID, alpha=0.7)
    ax.minorticks_on()
    ax.grid(which="minor", linestyle=":", linewidth=0.55, color=GRID, alpha=0.5)

    ax.legend(loc="upper right", frameon=True, facecolor="white", edgecolor=GRID, fontsize=11.5)

    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    for spine in ("left", "bottom"):
        ax.spines[spine].set_color(NEUTRAL)
        ax.spines[spine].set_linewidth(1.1)

    output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output, dpi=dpi)
    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a reliability curve chart for slides.")
    parser.add_argument("--mtbf", type=float, default=500.0, help="MTBF in hours (default: 500).")
    parser.add_argument("--tmax", type=float, default=1000.0, help="Maximum time on x-axis in hours (default: 1000).")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("aulas/dependability/img/reliability_curve_mtbf500.png"),
        help="Output image path.",
    )
    parser.add_argument("--dpi", type=int, default=300, help="Output DPI (default: 300).")
    parser.add_argument("--fig-width", type=float, default=11.5, help="Figure width in inches.")
    parser.add_argument("--fig-height", type=float, default=6.5, help="Figure height in inches.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.mtbf <= 0:
        raise SystemExit("--mtbf must be > 0")
    if args.tmax <= 0:
        raise SystemExit("--tmax must be > 0")
    build_plot(
        mtbf=args.mtbf,
        tmax=args.tmax,
        output=args.output,
        dpi=args.dpi,
        fig_width=args.fig_width,
        fig_height=args.fig_height,
    )


if __name__ == "__main__":
    main()
