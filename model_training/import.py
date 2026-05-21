import pandas as pd
import numpy as np
import json
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split
import joblib

# Load your data (long format)
df = pd.read_csv('training_data_final.csv')

print("Original data shape:", df.shape)
print(f"Number of students: {df['STUDENT_NAME'].nunique()}")
print(f"Columns: {df.columns.tolist()}")

# Pivot: each student becomes one row, subjects become columns
pivot_df = df.pivot_table(
    index=['STUDENT_NAME', 'STRAND', 'SASE_MATH', 'SASE_LANGUAGE', 'SASE_SCIENCE', 'SASE_APTITUDE'],
    columns='SUBJECT',
    values='GRADE'
).reset_index()

# Fill missing grades with 85
pivot_df = pivot_df.fillna(85)

print(f"\nPivoted data shape: {pivot_df.shape}")
