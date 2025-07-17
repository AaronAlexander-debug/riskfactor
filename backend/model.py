import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error

df = pd.read_csv('datasets/disasterinfo.csv')
df['quake_risk_score'] = np.log1p(df["total_quakes"]) + df["max_mag"] * 1.5

X = df[['total_quakes', 'avg_mag', 'max_mag', 'severe_quakes']]
y = df['quake_risk_score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
rmse = root_mean_squared_error(y_test, preds)
print(f"Test RMSE: {rmse:.3f}")

df['predicted_score'] = model.predict(X)

min_pred = df['predicted_score'].min()
max_pred = df['predicted_score'].max()

df['scaled_score'] = 1 + 9 * ((df['predicted_score'] - min_pred) / (max_pred - min_pred))
df['scaled_score'] = df['scaled_score'].round(1)

df.to_csv('datasets/disasterinfo_with_predictions.csv', index=False)