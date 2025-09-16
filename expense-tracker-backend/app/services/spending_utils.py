def detect_unusual_spending(amounts, threshold_factor=1.5):
    """Detects unusually high spendings compared to average"""
    if len(amounts) < 2:
        return None
    avg = sum(amounts) / len(amounts)
    spikes = [amt for amt in amounts if amt > avg * threshold_factor]
    return spikes