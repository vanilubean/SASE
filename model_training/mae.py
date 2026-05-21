from sklearn.metrics import mean_absolute_error, mean_squared_error

# After training your models
print(f"Math - MAE: {mean_absolute_error(y_math, math_model.predict(X_math)):.3f}")
print(f"Math - MSE: {mean_squared_error(y_math, math_model.predict(X_math)):.3f}")

print(f"Language - MAE: {mean_absolute_error(y_lang, lang_model.predict(X_lang)):.3f}")
print(f"Language - MSE: {mean_squared_error(y_lang, lang_model.predict(X_lang)):.3f}")

print(f"Science - MAE: {mean_absolute_error(y_sci, sci_model.predict(X_sci)):.3f}")
print(f"Science - MSE: {mean_squared_error(y_sci, sci_model.predict(X_sci)):.3f}")

print(f"Aptitude - MAE: {mean_absolute_error(y_apt, apt_model.predict(X_apt)):.3f}")
print(f"Aptitude - MSE: {mean_squared_error(y_apt, apt_model.predict(X_apt)):.3f}")
