# ============================================
# CREATE SINGLE JSON FILE (using Linear Regression models)
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

# Create ONE JSON file for ALL strands (since you trained on all students)
js_model = {
    'math': create_js_model(math_model, math_features, 40),
    'language': create_js_model(lang_model, lang_features, 80),
    'science': create_js_model(sci_model, science_features, 30),
    'aptitude': create_js_model(apt_model, apt_features, 30),
    'trained_on': len(pivot_df),
    'r2_scores': {
        'math': float(r2_score(y_math, math_model.predict(X_math))),
        'language': float(r2_score(y_lang, lang_model.predict(X_lang))),
        'science': float(r2_score(y_sci, sci_model.predict(X_sci))),
        'aptitude': float(r2_score(y_apt, apt_model.predict(X_apt)))
    }
}

# Save to file
filename = 'sase_model.json'
with open(filename, 'w') as f:
    json.dump(js_model, f, indent=2)

print(f"✅ Saved {filename}")
print(f"📊 Trained on {len(pivot_df)} students")
print(f"\n📈 R² scores:")
print(f"   Math: {js_model['r2_scores']['math']:.3f}")
print(f"   Language: {js_model['r2_scores']['language']:.3f}")
print(f"   Science: {js_model['r2_scores']['science']:.3f}")
print(f"   Aptitude: {js_model['r2_scores']['aptitude']:.3f}")

# Download
from google.colab import files
files.download('sase_model.json')