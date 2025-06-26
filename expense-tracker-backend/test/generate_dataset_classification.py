import csv
import random
from pathlib import Path
from datetime import datetime, timedelta

# Define templates for transaction descriptions
templates = {
    "income": {
        "salary": [
            "{prefix} {type} {action} from {source}",
            "{type} {action} for {period}",
            "{source} {type} {action}",
            "{type} {action} {noise}",
            "{prefix} {type} {noise}"
        ],
        "investment": [
            "{type} {action} from {source}",
            "{action} {type} on {source}",
            "received {type} {action}",
            "{type} from {source} {noise}",
            "{action} {type} {noise}"
        ],
        "gift": [
            "{type} {action} from {source}",
            "{source} {type} {action}",
            "received {type} for {occasion}",
            "{type} {noise} {action}",
            "{type} for {occasion} {noise}"
        ],
        "freelance": [
            "{type} {action} for {project}",
            "{action} {type} from {source}",
            "{source} paid {type} {noise}",
            "{type} work {action}",
            "{type} {action} {noise}"
        ],
        "rental": [
            "{type} {action} from {source}",
            "{action} {type} for {property}",
            "received {type} payment {noise}",
            "{type} income from {source}",
            "{prefix} {type} {noise}"
        ]
    },
    "expense": {
        "food": [
            "{action} at {source} {type}",
            "{type} {action} at {place}",
            "paid for {type} at {source}",
            "{type} purchase {noise}",
            "{action} {type} {noise}"
        ],
        "transport": [
            "{type} {action} for {destination}",
            "{action} {type} ticket",
            "paid for {type} to {destination}",
            "{type} {action} {noise}",
            "{type} cost {noise}"
        ],
        "bills": [
            "{type} bill {action}",
            "{action} {type} payment",
            "paid {type} bill for {source}",
            "{type} payment {noise}",
            "{type} bill {noise}"
        ],
        "entertainment": [
            "{action} {type} at {source}",
            "{type} {action} for {event}",
            "paid for {type} at {place}",
            "{type} expense {noise}",
            "{type} {action} {noise}"
        ],
        "housing": [
            "{type} {action} for {property}",
            "{action} {type} payment",
            "paid {type} to {source}",
            "{type} {noise} {action}",
            "{prefix} {type} payment"
        ],
        "healthcare": [
            "{type} {action} at {place}",
            "{action} for {type} service",
            "paid {type} bill {noise}",
            "{type} expense at {source}",
            "{type} {noise} {action}"
        ],
        "education": [
            "{type} {action} for {course}",
            "{action} {type} fees",
            "paid for {type} at {source}",
            "{type} {noise} payment",
            "{type} fees {noise}"
        ]
    }
}

# Word variations with noise (typos, synonyms, ambiguous terms)
word_variations = {
    "prefix": ["monthly", "weekly", "annual", "biweekly", "quarterly", "one-time", "regular", ""],
    "type": {
        "salary": ["salary", "paycheck", "wages", "income", "sallary", "payycheck", "slary", "wage"],
        "investment": ["dividend", "profit", "return", "interest", "divdend", "proffit", "intrest"],
        "gift": ["gift", "cash gift", "present", "donation", "gfit", "pressent", "cashgft"],
        "freelance": ["freelance", "contract", "gig", "side job", "freelence", "contarct", "frrelance"],
        "rental": ["rent", "rental", "lease", "tenancy", "rentel", "leese", "rnt"],
        "food": ["groceries", "dinner", "lunch", "food", "meal", "grocerries", "foood", "meel"],
        "transport": ["bus", "train", "taxi", "fuel", "transport", "buss", "taxxi", "fule"],
        "bills": ["electricity", "water", "internet", "phone", "utility", "electricty", "utilty", "phne"],
        "entertainment": ["movie", "concert", "event", "show", "game", "moovie", "conert", "evnt"],
        "housing": ["rent", "mortgage", "apartment", "housing", "morgage", "appartment", "mortgag"],
        "healthcare": ["doctor", "hospital", "pharmacy", "medical", "medcal", "hospitl", "pharmcy"],
        "education": ["tuition", "course", "books", "school", "tution", "cours", "shcool"]
    },
    "action": ["deposit", "payment", "received", "paid", "sent", "payed", "recieved", "deopsit"],
    "source": ["employer", "bank", "investment firm", "friend", "family", "company", "store", 
               "restaurant", "utility company", "cinema", "landlord", "school", "hospital", 
               "empoyer", "resturant", "compny"],
    "period": ["this month", "this week", "June", "Q2", "today", "last month", ""],
    "occasion": ["birthday", "holiday", "wedding", "celebration", "bday", "hollday", "weddng"],
    "place": ["supermarket", "restaurant", "cafe", "market", "theater", "pharmacy", "clinic", 
              "university", "supermrket", "restaurent", "univrsity"],
    "destination": ["work", "city", "home", "airport", "downtown", "station", ""],
    "event": ["movie night", "concert", "festival", "game night", "festval", "movie nite", ""],
    "project": ["client project", "consulting", "design work", "coding", "projet", "consultng"],
    "property": ["apartment", "house", "condo", "property", "appartment", "huse"],
    "course": ["math class", "programming course", "literature", "science", "progrraming", "litreture"],
    "noise": ["", "quick", "urgent", "bill", "payment", "!!", "online", "for groceries", "monthly", 
              "cash", "via app", "transfer", "trasnfer", "urgent!!", "fast", "now", "to friend", 
              "misc", "for utilities", "regular"]
}

def add_noise(description):
    """Add random noise to description (typos, casing, punctuation, ambiguous terms)."""
    if random.random() < 0.4:  # 40% chance to add noise
        # Random casing
        if random.random() < 0.5:
            description = description.upper() if random.random() < 0.5 else description.title()
        # Add random punctuation
        if random.random() < 0.4:
            description += random.choice(["!", "!!", "...", "."])
        # Simulate typo by swapping characters
        if random.random() < 0.3 and len(description) > 5:
            pos = random.randint(1, len(description) - 2)
            description = description[:pos] + description[pos + 1] + description[pos] + description[pos + 2:]
        # Insert ambiguous term
        if random.random() < 0.2:
            ambiguous_term = random.choice(["bill", "payment", "cash", "for groceries", "to friend"])
            description = f"{description} {ambiguous_term}"
    return description.strip()

def generate_description(class_type, category):
    """Generate a random transaction description with potential noise."""
    template = random.choice(templates[class_type][category])
    description = template
    for placeholder in ["prefix", "type", "action", "source", "period", "occasion", "place", 
                        "destination", "event", "project", "property", "course", "noise"]:
        if f"{{{placeholder}}}" in description:
            if placeholder == "type":
                value = random.choice(word_variations["type"][category])
            else:
                value = random.choice(word_variations.get(placeholder, [""]))
            description = description.replace(f"{{{placeholder}}}", value)
    description = description.strip()
    description = add_noise(description)
    return description

def generate_dataset(num_transactions=500):
    """Generate a synthetic dataset of transactions with noise."""
    transactions = []
    classes = ["income", "expense"]
    categories = {
        "income": ["salary", "investment", "gift", "freelance", "rental"],
        "expense": ["food", "transport", "bills", "entertainment", "housing", "healthcare", "education"]
    }

    for _ in range(num_transactions):
        class_type = random.choice(classes)
        category = random.choice(categories[class_type])
        description = generate_description(class_type, category)
        amount = round(random.uniform(50.0, 15000.0), 2) if class_type == "income" else round(random.uniform(5.0, 3000.0), 2)
        # Vary created_at within the last 30 days
        days_ago = random.randint(0, 30)
        created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
        transactions.append({
            "description": description,
            "class": class_type,
            "category": category,
            "amount": amount,
            "created_at": created_at
        })

    return transactions

def save_dataset(transactions, output_path):
    """Save the dataset to a CSV file."""
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["description", "class", "category", "amount", "created_at"])
        writer.writeheader()
        for transaction in transactions:
            writer.writerow(transaction)

def main():
    output_path = "dataset/training_data.csv"
    transactions = generate_dataset(500)
    save_dataset(transactions, output_path)
    print(f"Generated dataset with {len(transactions)} transactions and saved to {output_path}")

if __name__ == "__main__":
    main()