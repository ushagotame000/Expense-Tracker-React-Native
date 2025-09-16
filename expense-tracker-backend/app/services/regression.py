def linear_regression_predict(x_values, y_values, future_x):
    """Simple linear regression without external libraries"""
    n = len(x_values)
    mean_x = sum(x_values) / n
    mean_y = sum(y_values) / n

    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_values, y_values))
    denominator = sum((x - mean_x) ** 2 for x in x_values)

    slope = numerator / denominator if denominator != 0 else 0
    intercept = mean_y - slope * mean_x

    return slope * future_x + intercept