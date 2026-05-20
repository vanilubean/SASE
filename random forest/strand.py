# ============================================
# CREATE SEPARATE JSON FILES FOR EACH STRAND
# ============================================

def create_js_model(model, features, max_score):
    if model is None or not features:
        return None
    
    baseline = float(model.predict([[85]*len(features)])[0])
    
    adjustments = []
    for i in range(len(features)):
        test_input = [[85]*len(features)]
        test_input[0][i] = 95
        delta = float(model.predict(test_input)[0] - baseline)
        adjustments.append(delta / 10)
    
    return {
        'features': features,
        'adjustments': adjustments,
        'baseline': baseline,
        'max_score': max_score
    }

for strand, models in strand_models.items():
    # Calculate R² scores for this strand
    r2_scores = {}
    
    if models['math'] and models['math_features']:
        X = pivot_df[pivot_df['STRAND'] == strand][models['math_features']]
        y = pivot_df[pivot_df['STRAND'] == strand]['SASE_MATH']
        if len(X) > 0:
            r2_scores['math'] = float(models['math'].score(X, y))
    
    if models['language'] and models['lang_features']:
        X = pivot_df[pivot_df['STRAND'] == strand][models['lang_features']]
        y = pivot_df[pivot_df['STRAND'] == strand]['SASE_LANGUAGE']
        if len(X) > 0:
            r2_scores['language'] = float(models['language'].score(X, y))
    
    if models['science'] and models['science_features']:
        X = pivot_df[pivot_df['STRAND'] == strand][models['science_features']]
        y = pivot_df[pivot_df['STRAND'] == strand]['SASE_SCIENCE']
        if len(X) > 0:
            r2_scores['science'] = float(models['science'].score(X, y))
    
    if models['aptitude'] and models['aptitude_features']:
        X = pivot_df[pivot_df['STRAND'] == strand][models['aptitude_features']]
        y = pivot_df[pivot_df['STRAND'] == strand]['SASE_APTITUDE']
        if len(X) > 0:
            r2_scores['aptitude'] = float(models['aptitude'].score(X, y))
    
    js_model = {
        'strand': strand,
        'math': create_js_model(models['math'], models['math_features'], 40),
        'language': create_js_model(models['language'], models['lang_features'], 80),
        'science': create_js_model(models['science'], models['science_features'], 30),
        'aptitude': create_js_model(models['aptitude'], models['aptitude_features'], 30),
        'trained_on': len(pivot_df[pivot_df['STRAND'] == strand]),
        'r2_scores': r2_scores
    }
    
    # Remove None values (models that couldn't be trained)
    js_model = {k: v for k, v in js_model.items() if v is not None}
    
    filename = f'sase_model_{strand.lower()}.json'
    with open(filename, 'w') as f:
        json.dump(js_model, f, indent=2)
    
    print(f"✅ Saved {filename}")
    print(f"   Trained on {js_model['trained_on']} students")
    print(f"   R² scores: {r2_scores}")
    
    # Download each file
    from google.colab import files
    files.download(filename)