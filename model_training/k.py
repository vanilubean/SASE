## PREDICT THE SASE SCORES

from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Split data: 80% training, 20% testing
X_train, X_test, y_train, y_test = train_test_split(X_math, y_math, test_size=0.2, random_state=42)

# Create and train the model
math_model = LinearRegression()
math_model.fit(X_train, y_train)

# Make predictions
y_pred = math_model.predict(X_test)

print("Predicted SASE Math scores:", y_pred)
print("Actual SASE Math scores:", y_test.values)