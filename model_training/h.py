## CROS VAL SCORE

from sklearn.model_selection import cross_val_score
import numpy as np

print("=" * 50)
print("5-FOLD CROSS-VALIDATION RESULTS")
print("=" * 50)

# Math model
cv_scores_math = cross_val_score(math_model, X_math, y_math, cv=5)
print(f"\nMath CV R² scores: {cv_scores_math}")
print(f"Mean CV R²: {cv_scores_math.mean():.3f} (+/- {cv_scores_math.std():.3f})")

# Language model
cv_scores_lang = cross_val_score(lang_model, X_lang, y_lang, cv=5)
print(f"\nLanguage CV R² scores: {cv_scores_lang}")
print(f"Mean CV R²: {cv_scores_lang.mean():.3f} (+/- {cv_scores_lang.std():.3f})")

# Science model
cv_scores_sci = cross_val_score(sci_model, X_sci, y_sci, cv=5)
print(f"\nScience CV R² scores: {cv_scores_sci}")
print(f"Mean CV R²: {cv_scores_sci.mean():.3f} (+/- {cv_scores_sci.std():.3f})")

# Aptitude model
cv_scores_apt = cross_val_score(apt_model, X_apt, y_apt, cv=5)
print(f"\nAptitude CV R² scores: {cv_scores_apt}")
print(f"Mean CV R²: {cv_scores_apt.mean():.3f} (+/- {cv_scores_apt.std():.3f})")

# Summary table
print("\n" + "=" * 50)
print("SUMMARY FOR THESIS TABLE")
print("=" * 50)
print(f"Math:        Mean R² = {cv_scores_math.mean():.3f} (±{cv_scores_math.std():.3f})")
print(f"Language:    Mean R² = {cv_scores_lang.mean():.3f} (±{cv_scores_lang.std():.3f})")
print(f"Science:     Mean R² = {cv_scores_sci.mean():.3f} (±{cv_scores_sci.std():.3f})")
print(f"Aptitude:    Mean R² = {cv_scores_apt.mean():.3f} (±{cv_scores_apt.std():.3f})")