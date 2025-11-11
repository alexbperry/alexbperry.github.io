import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl

months = ["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"]
avg_temp = np.array([54, 45, 42, 47, 55, 63, 70, 73, 68, 60, 51, 45])
snowfall = np.array([3.0, 7.9, 6.1, 5.8, 3.4, 1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0])
lodging_cost = np.array([0.6, 0.9, 1.0, 0.9, 0.7, 0.5, 0.4, 0.3, 0.3, 0.3, 0.4, 0.5])
crowd = np.array([0.5, 0.9, 0.85, 0.7, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.3, 0.4])

df = pd.DataFrame({
    "Month": months,
    "AvgTemp": avg_temp,
    "Snowfall_in": snowfall,
    "LodgingCost": lodging_cost,
    "Crowd": crowd
})

def norm(x):
    rng = x.max() - x.min()
    return (x - x.min()) / rng if rng != 0 else np.zeros_like(x)

def coldness_from_temp(t):
    return norm(t.max() - t)

cold = coldness_from_temp(df["AvgTemp"].values)
snow_norm = norm(df["Snowfall_in"].values)

df["SnowConditionIndex"] = 0.7 * snow_norm + 0.3 * cold
lodging_norm = norm(df["LodgingCost"].values)
crowd_norm = norm(df["Crowd"].values)

df["PowderScore"] = (
    0.6 * df["SnowConditionIndex"] +
    0.25 * (1 - lodging_norm) +
    0.15 * (1 - crowd_norm)
)

df = df.round(3)

best_idx = df["PowderScore"].idxmax()
best_row = df.loc[best_idx]
best_month = best_row["Month"]
best_score = best_row["PowderScore"]
best_snow = best_row["Snowfall_in"]

caption = (
    f"Best time to go: {best_month} (Powder Score {best_score:.2f}). "
    f"Good snow (~{best_snow:.1f} in) with relatively lower cost & crowds. "
    f"Boone, NC seasonal patterns; visualization by Alexandra Perry."
)

fig, ax = plt.subplots(figsize=(12, 7))
plt.subplots_adjust(right=0.83, top=0.88, bottom=0.17)

bg_path = "snow_background.png"
if os.path.exists(bg_path):
    try:
        img = plt.imread(bg_path)
        ax.imshow(img, extent=[-0.5, len(df)-0.5, 0, 1],
            aspect='auto', alpha=0.2, zorder=0)
    except Exception:
        pass

cmap = plt.cm.Blues
normer = mpl.colors.Normalize(vmin=df["PowderScore"].min(), vmax=df["PowderScore"].max())
bar_colors = cmap(normer(df["PowderScore"].values))
bars = ax.bar(df["Month"], df["PowderScore"], color=bar_colors,
            edgecolor='black', linewidth=0.8, zorder=2)

ax2 = ax.twinx()
ax2.plot(df["Month"], df["Snowfall_in"], marker="o", color="dimgray",
        linewidth=2.5, zorder=3, label="Snowfall (inches)")

ax.set_ylabel("Powder Score (blue bars)", color="#1565c0", fontsize=11, weight="bold")
ax2.set_ylabel("Snowfall (gray line, inches)", color="dimgray", fontsize=11, weight="bold")

bars_proxy = mpl.patches.Patch(color=plt.cm.Blues(0.7), label="Powder Score (bars)")
line_proxy, = ax2.plot([], [], color="dimgray", marker="o", label="Snowfall (line)")
legend = ax.legend(handles=[bars_proxy, line_proxy],
                loc="upper left", bbox_to_anchor=(1.02, 0.88),
                frameon=True, fancybox=True, framealpha=0.9,
                fontsize=10, edgecolor="gray", title="Legend")
legend.get_title().set_fontsize(10)
legend.get_title().set_weight("bold")

ax.set_title("Best Months for Snowboarding in NC Mountains", fontsize=16, weight="bold", pad=10)
fig.suptitle("Balances snow conditions (snow + cold), affordability, and crowd size",
            y=0.96, fontsize=10, color="dimgray")
ax.set_xlabel("Month")
ax.set_ylim(0, 1.02)
ax.set_xlim(-0.6, len(df)-0.4)

ax.grid(axis='y', linestyle='--', alpha=0.35)
for spine in ['top', 'right']:
    ax.spines[spine].set_visible(False)

maxv = df["PowderScore"].max()
for rect, v in zip(bars, df["PowderScore"]):
    x = rect.get_x() + rect.get_width() / 2.0
    if v >= 0.82 * maxv:
        ax.text(x, v - 0.035, f"{v:.2f}", ha="center", va="top",
                fontsize=9, color="white", fontweight="bold", clip_on=True)
    else:
        ax.text(x, v + 0.015, f"{v:.2f}", ha="center", va="bottom",
                fontsize=9, color="black", clip_on=True)

ax.annotate(
    f"Peak: {best_month}",
    xy=(best_idx, best_score),
    xytext=(0, 16),
    textcoords="offset points",
    ha="center", va="bottom",
    arrowprops=dict(arrowstyle="->", lw=1.4, color="#0d47a1",
                    shrinkA=5, shrinkB=5, connectionstyle="arc3,rad=0.15"),
    fontsize=11, weight="bold", color="#0d47a1"
)

fig.text(0.5, 0.06, caption, ha="center", fontsize=9.5, color="dimgray")

plt.show()
