from sklearn.linear_model import LinearRegression

# MATH MODEL
math_features = [s for s in math_subjects if s in pivot_df.columns]
X_math = pivot_df[math_features].fillna(85)
y_math = pivot_df['SASE_MATH']

math_model = LinearRegression()  # ← Changed from RandomForest
math_model.fit(X_math, y_math)

print(f"Math R²: {math_model.score(X_math, y_math):.3f}")

# LANGUAGE MODEL
lang_features = [s for s in lang_subjects if s in pivot_df.columns]
X_lang = pivot_df[lang_features].fillna(85)
y_lang = pivot_df['SASE_LANGUAGE']

lang_model = LinearRegression()  # ← Changed
lang_model.fit(X_lang, y_lang)

print(f"Language R²: {lang_model.score(X_lang, y_lang):.3f}")

# SCIENCE MODEL
science_features = [s for s in science_subjects if s in pivot_df.columns]
X_sci = pivot_df[science_features].fillna(85)
y_sci = pivot_df['SASE_SCIENCE']

sci_model = LinearRegression()  # ← Changed
sci_model.fit(X_sci, y_sci)

print(f"Science R²: {sci_model.score(X_sci, y_sci):.3f}")

# APTITUDE MODEL
apt_features = [s for s in aptitude_subjects if s in pivot_df.columns]
X_apt = pivot_df[apt_features].fillna(85)
y_apt = pivot_df['SASE_APTITUDE']

apt_model = LinearRegression()  # ← Changed
apt_model.fit(X_apt, y_apt)

print(f"Aptitude R²: {apt_model.score(X_apt, y_apt):.3f}")