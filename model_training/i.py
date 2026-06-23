## JDHFSHSKSHSS TABLE

import pandas as pd

# Load the dataset
df = pd.read_csv('training_data_final.csv')

# Pivot: each student becomes one row, subjects become columns
pivot_df = df.pivot_table(
    index=['STUDENT_NAME', 'STRAND', 'SASE_MATH', 'SASE_LANGUAGE', 'SASE_SCIENCE', 'SASE_APTITUDE'],
    columns='SUBJECT',
    values='GRADE'
).reset_index()

# Fill missing grades with 85 (average)
pivot_df = pivot_df.fillna(85)

print(pivot_df.head())