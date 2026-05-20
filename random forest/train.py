# ============================================
# TRAIN MODELS BY STRAND
# ============================================

# Get unique strands
strands = pivot_df['STRAND'].unique()
print(f"Strands found: {strands}")

# Dictionary to store models per strand
strand_models = {}

for strand in strands:
    print(f"\n{'='*50}")
    print(f"Training models for {strand} strand")
    print('='*50)
    
    # Filter data for this strand
    strand_df = pivot_df[pivot_df['STRAND'] == strand]
    print(f"Students in {strand}: {len(strand_df)}")
    
    if len(strand_df) < 3:
        print(f"⚠️ Not enough students for {strand} (need 3+), skipping")
        continue
    
    # MATH MODEL for this strand
    math_features = [s for s in math_subjects if s in strand_df.columns]
    if math_features and len(strand_df) >= 3:
        X_math = strand_df[math_features]
        y_math = strand_df['SASE_MATH']
        math_model = RandomForestRegressor(n_estimators=50, random_state=42)
        math_model.fit(X_math, y_math)
        print(f"  Math R²: {math_model.score(X_math, y_math):.3f}")
    else:
        math_model = None
        print(f"  Math: No features found")
    
    # LANGUAGE MODEL for this strand
    lang_features = [s for s in lang_subjects if s in strand_df.columns]
    if lang_features and len(strand_df) >= 3:
        X_lang = strand_df[lang_features]
        y_lang = strand_df['SASE_LANGUAGE']
        lang_model = RandomForestRegressor(n_estimators=50, random_state=42)
        lang_model.fit(X_lang, y_lang)
        print(f"  Language R²: {lang_model.score(X_lang, y_lang):.3f}")
    else:
        lang_model = None
        print(f"  Language: No features found")
    
    # SCIENCE MODEL for this strand
    science_features = [s for s in science_subjects if s in strand_df.columns]
    if science_features and len(strand_df) >= 3:
        X_sci = strand_df[science_features]
        y_sci = strand_df['SASE_SCIENCE']
        sci_model = RandomForestRegressor(n_estimators=50, random_state=42)
        sci_model.fit(X_sci, y_sci)
        print(f"  Science R²: {sci_model.score(X_sci, y_sci):.3f}")
    else:
        sci_model = None
        print(f"  Science: No features found")
    
    # APTITUDE MODEL for this strand
    aptitude_features = [s for s in aptitude_subjects if s in strand_df.columns]
    if aptitude_features and len(strand_df) >= 3:
        X_apt = strand_df[aptitude_features]
        y_apt = strand_df['SASE_APTITUDE']
        apt_model = RandomForestRegressor(n_estimators=50, random_state=42)
        apt_model.fit(X_apt, y_apt)
        print(f"  Aptitude R²: {apt_model.score(X_apt, y_apt):.3f}")
    else:
        apt_model = None
        print(f"  Aptitude: No features found")
    
    # Store models for this strand
    strand_models[strand] = {
        'math': math_model,
        'language': lang_model,
        'science': sci_model,
        'aptitude': apt_model,
        'math_features': math_features,
        'lang_features': lang_features,
        'science_features': science_features,
        'aptitude_features': aptitude_features
    }