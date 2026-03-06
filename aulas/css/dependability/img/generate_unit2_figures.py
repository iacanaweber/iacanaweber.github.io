#!/usr/bin/env python3
"""Generate didactic figures for Unit 2 (probabilistic reliability basics)."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


PRIMARY = "#0B5FA5"
SECONDARY = "#2F855A"
ACCENT = "#D94841"
GRID = "#D1D5DB"
NEUTRAL = "#374151"
BG = "#F8FAFC"

OUT_DIR = Path("aulas/dependability/img")


def _style_axes(ax):
    ax.set_facecolor(BG)
    ax.grid(True, color=GRID, alpha=0.7, linewidth=0.8)
    ax.minorticks_on()
    ax.grid(which="minor", color=GRID, alpha=0.45, linewidth=0.5, linestyle=":")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(NEUTRAL)
        ax.spines[side].set_linewidth(1.0)


def fig_ttf_samples():
    np.random.seed(7)
    samples = np.random.exponential(scale=500, size=600)
    samples = samples[samples < 2200]

    fig, ax = plt.subplots(figsize=(10.5, 5.8), constrained_layout=True)
    _style_axes(ax)
    ax.hist(samples, bins=28, color=PRIMARY, alpha=0.85, edgecolor="white")

    for x, label in [(80, "80h"), (130, "130h"), (210, "210h")]:
        ax.axvline(x, color=ACCENT, linestyle=(0, (5, 4)), linewidth=1.8)
        ax.text(x + 10, ax.get_ylim()[1] * 0.88, label, color=ACCENT, fontsize=11, weight="bold")

    ax.set_title("TTF: tempos de falha variam entre itens", fontsize=18, weight="bold")
    ax.set_xlabel("Tempo ate falha (h)", fontsize=12)
    ax.set_ylabel("Quantidade de itens", fontsize=12)
    fig.savefig(OUT_DIR / "unit2_ttf_samples.png", dpi=250)
    plt.close(fig)


def fig_ttf_samples_wide():
    np.random.seed(7)
    samples = np.random.exponential(scale=500, size=900)
    samples = samples[samples < 2200]

    fig, ax = plt.subplots(figsize=(16.0, 2.9), constrained_layout=True)
    _style_axes(ax)
    ax.hist(samples, bins=34, color=PRIMARY, alpha=0.88, edgecolor="white")

    for x, label in [(80, "80h"), (130, "130h"), (210, "210h")]:
        ax.axvline(x, color=ACCENT, linestyle=(0, (5, 4)), linewidth=1.8)
        ax.text(x + 10, ax.get_ylim()[1] * 0.82, label, color=ACCENT, fontsize=11.5, weight="bold")

    ax.set_title("TTF: distribuição de tempos até falha", fontsize=17, weight="bold")
    ax.set_xlabel("Tempo até falha (h)", fontsize=12)
    ax.set_ylabel("Quantidade de itens", fontsize=12)
    fig.savefig(OUT_DIR / "unit2_ttf_samples_wide.png", dpi=260)
    plt.close(fig)


def fig_cdf_reliability():
    t = np.linspace(0, 1600, 1000)
    mtbf = 500.0
    r = np.exp(-t / mtbf)
    f = 1 - r

    fig, ax = plt.subplots(figsize=(10.8, 6.0), constrained_layout=True)
    _style_axes(ax)
    ax.plot(t, f, color=ACCENT, linewidth=3.0, label=r"$F(t)=P(T\leq t)$")
    ax.plot(t, r, color=PRIMARY, linewidth=3.0, label=r"$R(t)=P(T>t)=1-F(t)$")

    t_mark = 100
    f_mark = 1 - np.exp(-t_mark / mtbf)
    r_mark = np.exp(-t_mark / mtbf)
    ax.scatter([t_mark, t_mark], [f_mark, r_mark], s=70, color=[ACCENT, PRIMARY], zorder=5)
    ax.text(t_mark + 35, f_mark + 0.04, rf"$F(100)={f_mark:.2f}$", fontsize=11, color=ACCENT)
    ax.text(t_mark + 35, r_mark - 0.09, rf"$R(100)={r_mark:.2f}$", fontsize=11, color=PRIMARY)

    ax.set_title("Relacao entre acumulada de falha e confiabilidade", fontsize=18, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=12)
    ax.set_ylabel("Probabilidade", fontsize=12)
    ax.set_xlim(0, 1600)
    ax.set_ylim(0, 1.02)
    ax.legend(loc="center right", frameon=True)
    fig.savefig(OUT_DIR / "unit2_cdf_reliability.png", dpi=250)
    plt.close(fig)


def fig_cdf_reliability_wide():
    t = np.linspace(0, 1600, 1000)
    mtbf = 500.0
    r = np.exp(-t / mtbf)
    f = 1 - r

    fig, ax = plt.subplots(figsize=(16.0, 2.9), constrained_layout=True)
    _style_axes(ax)
    ax.plot(t, f, color=ACCENT, linewidth=3.0, label=r"$F(t)=P(T\leq t)$")
    ax.plot(t, r, color=PRIMARY, linewidth=3.0, label=r"$R(t)=P(T>t)=1-F(t)$")

    t_mark = 100
    f_mark = 1 - np.exp(-t_mark / mtbf)
    r_mark = np.exp(-t_mark / mtbf)
    ax.scatter([t_mark, t_mark], [f_mark, r_mark], s=66, color=[ACCENT, PRIMARY], zorder=5)
    ax.text(t_mark + 30, f_mark + 0.04, rf"$F(100)={f_mark:.2f}$", fontsize=11, color=ACCENT)
    ax.text(t_mark + 30, r_mark - 0.09, rf"$R(100)={r_mark:.2f}$", fontsize=11, color=PRIMARY)

    ax.set_title("Relação entre acumulada de falha e confiabilidade", fontsize=16, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=12)
    ax.set_ylabel("Probabilidade", fontsize=12)
    ax.set_xlim(0, 1600)
    ax.set_ylim(0, 1.02)
    ax.legend(loc="center right", frameon=True, fontsize=10.5)
    fig.savefig(OUT_DIR / "unit2_cdf_reliability_wide.png", dpi=260)
    plt.close(fig)


def fig_density():
    t = np.linspace(0, 1600, 1000)
    mtbf = 500.0
    lam = 1 / mtbf
    density = lam * np.exp(-lam * t)

    fig, ax = plt.subplots(figsize=(10.5, 5.8), constrained_layout=True)
    _style_axes(ax)
    ax.plot(t, density, color=SECONDARY, linewidth=3)

    t1, t2 = 200, 500
    mask = (t >= t1) & (t <= t2)
    ax.fill_between(t[mask], density[mask], color=SECONDARY, alpha=0.25)
    ax.text(530, density.max() * 0.62, "Area \u2248 probabilidade\nentre 200h e 500h", fontsize=11, color=NEUTRAL)

    ax.set_title("Densidade f(t): onde a chance de falha se concentra", fontsize=18, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=12)
    ax.set_ylabel("f(t)", fontsize=12)
    ax.set_xlim(0, 1600)
    fig.savefig(OUT_DIR / "unit2_density.png", dpi=250)
    plt.close(fig)


def fig_density_wide():
    t = np.linspace(0, 1600, 1000)
    mtbf = 500.0
    lam = 1 / mtbf
    density = lam * np.exp(-lam * t)

    fig, ax = plt.subplots(figsize=(16.0, 2.9), constrained_layout=True)
    _style_axes(ax)
    ax.plot(t, density, color=SECONDARY, linewidth=3)

    t1, t2 = 200, 500
    mask = (t >= t1) & (t <= t2)
    ax.fill_between(t[mask], density[mask], color=SECONDARY, alpha=0.25)
    ax.text(540, density.max() * 0.58, "Área ≈ probabilidade\nentre 200h e 500h", fontsize=10.5, color=NEUTRAL)

    ax.set_title("Densidade f(t): onde a chance de falha se concentra", fontsize=15.5, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=11.5)
    ax.set_ylabel("f(t)", fontsize=11.5)
    ax.set_xlim(0, 1600)
    fig.savefig(OUT_DIR / "unit2_density_wide.png", dpi=260)
    plt.close(fig)


def fig_mtbf_comparison():
    t = np.linspace(0, 2000, 1100)
    mtbfs = [200, 500, 1000]
    colors = [ACCENT, PRIMARY, SECONDARY]

    fig, ax = plt.subplots(figsize=(10.8, 6.0), constrained_layout=True)
    _style_axes(ax)

    for mtbf, color in zip(mtbfs, colors):
        ax.plot(t, np.exp(-t / mtbf), linewidth=3, color=color, label=rf"MTBF = {mtbf}h")

    ax.set_title("Impacto do MTBF na curva de confiabilidade", fontsize=18, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=12)
    ax.set_ylabel("R(t)", fontsize=12)
    ax.set_xlim(0, 2000)
    ax.set_ylim(0, 1.02)
    ax.legend(loc="upper right", frameon=True)
    fig.savefig(OUT_DIR / "unit2_mtbf_comparison.png", dpi=250)
    plt.close(fig)


def fig_mtbf_comparison_wide():
    t = np.linspace(0, 2000, 1100)
    mtbfs = [200, 500, 1000]
    colors = [ACCENT, PRIMARY, SECONDARY]

    fig, ax = plt.subplots(figsize=(16.0, 2.9), constrained_layout=True)
    _style_axes(ax)

    for mtbf, color in zip(mtbfs, colors):
        ax.plot(t, np.exp(-t / mtbf), linewidth=3, color=color, label=rf"MTBF = {mtbf}h")

    ax.set_title("Impacto do MTBF na curva de confiabilidade", fontsize=15.5, weight="bold")
    ax.set_xlabel("Tempo t (h)", fontsize=11.5)
    ax.set_ylabel("R(t)", fontsize=11.5)
    ax.set_xlim(0, 2000)
    ax.set_ylim(0, 1.02)
    ax.legend(loc="upper right", frameon=True, fontsize=10.2)
    fig.savefig(OUT_DIR / "unit2_mtbf_comparison_wide.png", dpi=260)
    plt.close(fig)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fig_ttf_samples()
    fig_ttf_samples_wide()
    fig_cdf_reliability()
    fig_cdf_reliability_wide()
    fig_density()
    fig_density_wide()
    fig_mtbf_comparison()
    fig_mtbf_comparison_wide()


if __name__ == "__main__":
    main()
