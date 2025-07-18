import json
import matplotlib.pyplot as plt
import numpy as np

with open("../../json/raw/TRAIN_betas_cohensD_20000.json", "r") as f:
    data = json.load(f)

values = list(data.values())

bin_width = 0.01
bins = np.arange(0, 2 + bin_width, bin_width)

plt.figure(figsize=(8, 5))
plt.hist(values, bins=bins, edgecolor='blue', color='blue')
plt.xlim(0, 2)

plt.title("Distribution of Cohen's D of CpG Sites")
plt.xlabel("Value")
plt.ylabel("Frequency")

plt.savefig("histogram_1.png", dpi=300, bbox_inches='tight')

plt.show()