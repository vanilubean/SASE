##  MATH MODEL EXAMPLE

math_features = ['General Mathematics', 'Statistics and Probability', 'Basic Calculus', 'Pre Calculus']

X_math = pivot_df[math_features]  # Features (grades)
y_math = pivot_df['SASE_MATH']    # Target (SASE Math score)

print("Features (X_math):")
print(X_math.head())
print("\nTarget (y_math):")
print(y_math.head())
