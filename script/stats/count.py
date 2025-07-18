import json
import numpy as np
import pandas as pd

with open("../../json/raw/TRAIN_betas_cohensD_20000.json", "r") as f:
    data = json.load(f)

values = list(data.values())

split_bins = [0, 0.2, 0.5, 0.8, 1.2, 2.0, np.inf]
labels = [
    "0.0-0.2",
    "0.2-0.5",
    "0.5-0.8",
    "0.8-1.2",
    "1.2-2.0",
    "2.0+"
]

binned = pd.cut(values, bins=split_bins, labels=labels, right=False)
counts = binned.value_counts().sort_index()

for label, count in counts.items():
    print(f"{label}: {count}")

print(max(values))