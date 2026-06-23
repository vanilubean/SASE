# COMPLETE AI TRAINING DEMO

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. LOAD DATA
df = pd.read_csv('training_data_final.csv')

print("Original columns:", df.columns.tolist())
print(f"Total rows: {len(df)}")
print(f"Unique students: {df['STUDENT_NAME'].nunique()}")

# 2. PIVOT (one row per student)
# Keep the SASE columns as part of the index so they don't become subject columns
pivot_df = df.pivot_table(
    index=['STUDENT_NAME', 'STRAND', 'SASE_MATH', 'SASE_LANGUAGE', 'SASE_SCIENCE', 'SASE_APTITUDE'],
    columns='SUBJECT',
    values='GRADE'
).reset_index()

# Fill missing grades with 85 (average)
pivot_df = pivot_df.fillna(85)

print(f"\nPivoted data shape: {pivot_df.shape}")
print(f"Columns: {pivot_df.columns.tolist()[:10]}...")  # First 10 columns

# 3. SELECT FEATURES FOR MATH MODEL (only use subjects that exist in your data)
math_features = ['General Mathematics', 'Statistics and Probability', 'Basic Calculus']

# Check which features actually exist in the pivoted data
existing_features = [f for f in math_features if f in pivot_df.columns]
print(f"\nMath features found: {existing_features}")

# If some features are missing, add them as empty (will be filled with 85)
for f in math_features:
    if f not in pivot_df.columns:
        pivot_df[f] = 85
        print(f"Added missing feature: {f} (default 85)")

# 4. PREPARE FEATURES AND TARGET
X = pivot_df[math_features]  # Features (grades)
y = pivot_df['SASE_MATH']    # Target (SASE Math score)

print(f"\nFeatures (X) shape: {X.shape}")
print(f"Target (y) shape: {y.shape}")

# 5. TRAIN MODEL
model = LinearRegression()
model.fit(X, y)

# 6. PREDICT AND EVALUATE
y_pred = model.predict(X)

mae = mean_absolute_error(y, y_pred)
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)

print(f"Math Model Results:")
print(f"   MAE: {mae:.3f}")
print(f"   MSE: {mse:.3f}")
print(f"   R²:  {r2:.3f}")

# 7. SHOW WHAT THE AI LEARNED
print(f"What the AI learned:")
print(f"   SASE_MATH = {model.intercept_:.2f}", end="")
for i, feat in enumerate(math_features):
    print(f" + ({model.coef_[i]:.2f} × {feat})", end="")
print()