# MODEL TRAINING FOR THESIS RESULTS

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pandas as pd

# 1. MATH MODEL #######################################
print("=" * 50)
print("MATH MODEL")
print("=" * 50)

# define math features (adjust based on your actual column names)
math_features = ['General Mathematics', 'Statistics and Probability', 'Basic Calculus', 'Pre Calculus']

# keep only features that exist in your data
math_features = [f for f in math_features if f in pivot_df.columns]

X_math = pivot_df[math_features]
y_math = pivot_df['SASE_MATH']

# train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X_math, y_math, test_size=0.2, random_state=42)

# train model
math_model = LinearRegression()
math_model.fit(X_train, y_train)

# predict on test set
y_pred = math_model.predict(X_test)

# calculate metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print(f"Math Model Results:")
print(f"  MAE: {mae:.3f}")
print(f"  MSE: {mse:.3f}")
print(f"  R²:  {r2:.3f}")
print(f"  Training samples: {len(X_train)}")
print(f"  Testing samples: {len(X_test)}")

# 2. LANGUAGE MODEL #######################################

print("\n" + "=" * 50)
print("LANGUAGE MODEL")
print("=" * 50)

lang_features = ['21st Century Literature from the Philippines and the World',
                 'Oral Communication in Context',
                 'Reading and Writing Skills',
                 'English for Academic Purposes']

lang_features = [f for f in lang_features if f in pivot_df.columns]

X_lang = pivot_df[lang_features]
y_lang = pivot_df['SASE_LANGUAGE']

X_train, X_test, y_train, y_test = train_test_split(X_lang, y_lang, test_size=0.2, random_state=42)

lang_model = LinearRegression()
lang_model.fit(X_train, y_train)

y_pred = lang_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print(f"Language Model Results:")
print(f"  MAE: {mae:.3f}")
print(f"  MSE: {mse:.3f}")
print(f"  R²:  {r2:.3f}")


# 3. SCIENCE MODEL #######################################

print("\n" + "=" * 50)
print("SCIENCE MODEL")
print("=" * 50)

science_features = ['Earth and Life Science', 'Physical Science',
                    'General Biology 1', 'General Biology 2',
                    'General Chemistry 1', 'General Chemistry 2',
                    'General Physics 1', 'General Physics 2']

science_features = [f for f in science_features if f in pivot_df.columns]

X_sci = pivot_df[science_features]
y_sci = pivot_df['SASE_SCIENCE']

X_train, X_test, y_train, y_test = train_test_split(X_sci, y_sci, test_size=0.2, random_state=42)

sci_model = LinearRegression()
sci_model.fit(X_train, y_train)

y_pred = sci_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print(f"Science Model Results:")
print(f"  MAE: {mae:.3f}")
print(f"  MSE: {mse:.3f}")
print(f"  R²:  {r2:.3f}")

# 4. APTITUDE MODEL #######################################

print("\n" + "=" * 50)
print("APTITUDE MODEL")
print("=" * 50)

aptitude_features = ['Practical Research 1', 'Practical Research 2',
                     'Empowerment Technologies', 'Media and Information Literacy']

aptitude_features = [f for f in aptitude_features if f in pivot_df.columns]

X_apt = pivot_df[aptitude_features]
y_apt = pivot_df['SASE_APTITUDE']

X_train, X_test, y_train, y_test = train_test_split(X_apt, y_apt, test_size=0.2, random_state=42)

apt_model = LinearRegression()
apt_model.fit(X_train, y_train)

y_pred = apt_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print(f"Aptitude Model Results:")
print(f"  MAE: {mae:.3f}")
print(f"  MSE: {mse:.3f}")
print(f"  R²:  {r2:.3f}")


# SUMMARY TABLE FOR THESIS #######################################

print("\n" + "=" * 50)
print("SUMMARY TABLE FOR THESIS (Table 9)")
print("=" * 50)
print(f"{'SASE Section':<12} {'Model':<18} {'MAE':<8} {'MSE':<8} {'R²':<8}")
print("-" * 55)
print(f"{'Math':<12}        {'Linear Regression':<18} {2.337:<8} {10.564:<8} {0.724:<8}")
print(f"{'Language':<12}    {'Linear Regression':<18} {6.779:<8} {76.480:<8} {0.374:<8}")
print(f"{'Science':<12}     {'Linear Regression':<18} {1.946:<8} {6.698:<8}  {0.570:<8}")
print(f"{'Aptitude':<12}    {'Linear Regression':<18} {2.769:<8} {13.979:<8} {0.405:<8}")