import random
import csv
import string
from pathlib import Path

# Define templates for transaction descriptions, including 'income' category
templates = {
    "income": {
        "salary": [
            "{prefix} {type} from {source}",
            "{type} {action} for {period}",
            "{source} {type} deposit",
            "{type} payment {noise}",
            "{prefix} {type} to account"
        ],
        "investment": [
            "{type} {action} from {source}",
            "{action} {type} on {investment_type}",
            "received {type} from {source}",
            "{type} earnings {noise}",
            "{source} {type} payout"
        ],
        "gift": [
            "{type} {action} from {source}",
            "{source} sent {type} for {occasion}",
            "received {type} for {occasion}",
            "{type} from {source} {noise}",
            "{prefix} {type} received"
        ],
        "freelance": [
            "{type} {action} for {project}",
            "{action} {type} from {client}",
            "{client} paid {type} {noise}",
            "{type} work {action} {period}",
            "{type} invoice {noise}"
        ],
        "rental": [
            "{type} {action} from {tenant}",
            "{action} {type} for {property}",
            "received {type} payment from {source}",
            "{type} income from {property} {noise}",
            "{prefix} {type} deposit"
        ],
        "income": [
            "{prefix} {type} from {source}",
            "received {type} {action} {noise}",
            "{type} {action} for {reason}",
            "{source} {type} deposit {noise}",
            "{type} credited to account {noise}"
        ]
    },
    "expense": {
        "food": [
            "{action} at {merchant} for {type}",
            "{type} {action} at {place}",
            "paid for {type} at {merchant} {noise}",
            "{type} purchase at {source}",
            "{action} {type} {noise}"
        ],
        "transport": [
            "{type} {action} to {destination}",
            "{action} {type} ticket {noise}",
            "paid for {type} at {source}",
            "{type} cost for {destination}",
            "{merchant} {type} {noise}"
        ],
        "bills": [
            "{type} bill {action} to {source}",
            "{action} {type} payment",
            "paid {type} bill for {utility}",
            "{type} payment {noise}",
            "{prefix} {type} bill"
        ],
        "entertainment": [
            "{action} {type} at {merchant}",
            "{type} {action} for {event}",
            "paid for {type} at {place} {noise}",
            "{type} subscription {noise}",
            "{merchant} {type} purchase"
        ],
        "housing": [
            "{type} {action} for {property}",
            "{action} {type} payment to {source}",
            "paid {type} to {merchant}",
            "{type} expense {noise}",
            "{prefix} {type} payment"
        ],
        "healthcare": [
            "{type} {action} at {place}",
            "{action} for {type} service {noise}",
            "paid {type} bill at {source}",
            "{type} expense for {service}",
            "{merchant} {type} {noise}"
        ],
        "education": [
            "{type} {action} for {course}",
            "{action} {type} fees at {source}",
            "paid for {type} at {place}",
            "{type} purchase {noise}",
            "{prefix} {type} fees"
        ]
    }
}

# Updated word variations with 'income' category
word_variations = {
    "prefix": ["monthly", "weekly", "annual", "biweekly", "quarterly", "one-time", "regular", "direct", 
               "recurring", "semi-monthly", "fortnightly", "adhoc", "scheduled", ""],
    "type": {
        "salary": ["salary", "paycheck", "wages", "payroll", "stipend", "earnings", "income", 
                   "sallary", "payycheck", "slary", "wagez", "payrol", "stipnd", "earnnigs"],
        "investment": ["dividend", "profit", "return", "interest", "capital gain", "yield", "payout", 
                       "divdend", "proffit", "intrest", "returns", "invesment", "yeild", "cap gain"],
        "gift": ["gift", "cash gift", "present", "donation", "contribution", "tip", "gratuity", 
                 "gfit", "pressent", "cashgft", "givt", "donatin", "grattuity"],
        "freelance": ["freelance", "contract", "gig", "consulting", "side hustle", "project pay", 
                      "freelence", "contarct", "frrelance", "gigwork", "consullting", "sidejob"],
        "rental": ["rent", "rental", "lease", "tenancy", "rental income", "property income", 
                   "rentel", "leese", "rnt", "rentl", "tennacy", "proprty inc"],
        "income": ["income", "revenue", "funds", "cashback", "bonus", "refund", "misc income", 
                   "inccome", "revenu", "fundz", "cashbak", "bonuss", "refnd", "gained", "got"],
        "food": ["groceries", "food", "meal", "dinner", "lunch", "snacks", "takeout", "dining", 
                 "grocerries", "foood", "meel", "snak", "takeot", "dinning"],
        "transport": ["transport", "bus", "train", "taxi", "fuel", "fare", "petrol", "gas", 
                      "bike maintenance", "car repair", "diesel", "transit", "buss", "taxxi", 
                      "fule", "petrrol", "desel", "transsit", "bike maintaince"],
        "bills": ["utility", "electricity", "water", "internet", "phone", "cable", "gas bill", 
                  "subscription", "electricty", "utilty", "phne", "intenet", "cabl", "utillity","buy","expense"],
        "entertainment": ["entertainment", "movie", "concert", "show", "game", "streaming", 
                          "event ticket", "fun", "moovie", "conert", "evnt", "streming", "tickt"],
        "housing": ["housing", "rent", "mortgage", "apartment", "home maintenance", "property tax", 
                    "morgage", "appartment", "mortgag", "home maint", "proprty tax"],
        "healthcare": ["healthcare", "medical", "doctor", "pharmacy", "hospital", "medication", 
                       "health check", "medcal", "pharmcy", "heathcare", "hospitl", "medicatin"],
        "education": ["education", "tuition", "course", "school", "textbooks", "training", "seminar", 
                      "tution", "cours", "shcool", "textboks", "traning", "sminar"]
    },
    "action": ["deposit", "payment", "received", "paid", "sent", "transferred", "credited", "debited", 
               "direct deposit", "wire", "payed", "recieved", "deopsit", "tranfered", "creddited"],
    "source": ["employer", "bank", "Acme Corp", "friend", "family", "PayPal", "Venmo", "Zelle", 
               "Walmart", "Amazon", "Comcast", "Landlord Inc", "State University", "City Hospital", 
               "client", "rental agency", "empoyer", "resturant", "compny", "clint"],
    "merchant": ["Walmart", "Target", "Starbucks", "Uber", "Lyft", "Netflix", "Amazon", "Whole Foods", 
                 "Local Grocery", "Cinema 8", "Health Clinic", "Bookstore", "Kroger", "Safeway", 
                 "AMC Theater", "CVS", "Wallmart", "Targt", "Starbcks", "Whol Foods", "Krogr"],
    "period": ["this month", "this week", "January", "February", "Q1", "Q2", "today", "last month", 
               "2025", "yesterday", "this quarter", "last week", ""],
    "occasion": ["birthday", "Christmas", "wedding", "graduation", "anniversary", "holiday", 
                 "celebration", "bday", "hollday", "weddng", "aniversary", "celebation"],
    "place": ["supermarket", "restaurant", "cafe", "theater", "pharmacy", "clinic", "university", 
              "grocery store", "mall", "hospital", "supermrket", "restaurent", "univrsity", "clinik"],
    "destination": ["work", "city", "home", "airport", "downtown", "station", "mall", "school", 
                    "park", "office", ""],
    "event": ["movie night", "concert", "festival", "game night", "play", "show", "party", 
              "festval", "movie nite", "conert", "partty", ""],
    "project": ["web design", "consulting", "coding project", "marketing", "writing", "graphic design", 
                "software dev", "projet", "consultng", "desgin", "writng"],
    "property": ["apartment", "house", "condo", "rental property", "flat", "townhouse", 
                 "appartment", "huse", "condoo", "twnhouse"],
    "course": ["math", "programming", "literature", "science course", "history", "business", 
               "progrraming", "litreture", "sci course", "buisness"],
    "utility": ["electric", "water", "internet", "gas", "phone", "cable", "heating", 
                "electrc", "intrnet", "heatting"],
    "service": ["checkup", "prescription", "therapy", "dental", "surgery", "consultation", 
                "presciption", "therpy", "consulttion"],
    "reason": ["refund", "bonus", "cashback", "award", "rebate", "miscellaneous", "settlement", 
               "refnd", "bonuss", "cashbak", "miscellaneus"],
    "noise": ["", "quick", "urgent", "online", "via app", "transfer", "trasnfer", "!!", "fast", "now", 
              "misc", "regular", "for utilities", "to friend", "ID123", "ID456", "$50.99", "USD 100", 
              "priority", "pending", "processed", "via bank", "for stuff", "general", "other", "cash"]
}

def add_noise(description):
    """Add realistic noise to description (typos, casing, punctuation, numbers, ambiguous terms)."""
    if random.random() < 0.5:  # 50% chance to add noise
        # Random casing
        case = random.choice(["lower", "upper", "title", "mixed"])
        if case == "lower":
            description = description.lower()
        elif case == "upper":
            description = description.upper()
        elif case == "title":
            description = description.title()
        else:  # mixed
            description = ''.join(random.choice([c.upper(), c.lower()]) for c in description)
        
        # Add typo (swap, insert, or delete character)
        if random.random() < 0.4 and len(description) > 5:
            action = random.choice(["swap", "insert", "delete"])
            pos = random.randint(1, len(description) - 2)
            if action == "swap" and pos < len(description) - 1:
                chars = list(description)
                chars[pos], chars[pos + 1] = chars[pos + 1], chars[pos]
                description = ''.join(chars)
            elif action == "insert":
                description = description[:pos] + random.choice(string.ascii_lowercase) + description[pos:]
            elif action == "delete":
                description = description[:pos] + description[pos + 1:]
        
        # Add punctuation or numbers
        if random.random() < 0.4:
            additions = ["!", "!!", "...", f" #{random.randint(100, 999)}", f" ${random.uniform(10, 1000):.2f}", 
                         f" USD {random.randint(10, 500)}", f" Ref{random.randint(1000, 9999)}"]
            description += random.choice(additions)
        
        # Insert ambiguous term
        if random.random() < 0.3:
            ambiguous_terms = ["misc", "payment", "cash", "for stuff", "to friend", "general", "other", "pending", 
                               "processed", "transaction"]
            description = f"{description} {random.choice(ambiguous_terms)}"

    return description.strip()

def generate_description(class_type, category):
    """Generate a random transaction description with potential noise."""
    if class_type not in templates or category not in templates[class_type]:
        raise KeyError(f"Invalid class_type '{class_type}' or category '{category}' not found in templates")
    template = random.choice(templates[class_type][category])
    description = template
    for placeholder in ["prefix", "type", "action", "source", "merchant", "period", "occasion", "place", 
                        "destination", "event", "project", "property", "course", "utility", "service", "reason", "noise"]:
        if f"{{{placeholder}}}" in description:
            if placeholder == "type":
                value = random.choice(word_variations["type"][category])
            else:
                value = random.choice(word_variations.get(placeholder, [""]))
            description = description.replace(f"{{{placeholder}}}", value)
    description = description.strip()
    description = add_noise(description)
    return description

def generate_dataset(num_transactions=2000):
    """Generate a synthetic dataset of transactions with noise."""
    transactions = []
    classes = ["income", "expense"]
    categories = {
        "income": ["salary", "investment", "gift", "freelance", "rental", "income"],
        "expense": ["food", "transport", "bills", "entertainment", "housing", "healthcare", "education"]
    }
    entries_per_category = num_transactions // (len(categories["income"]) + len(categories["expense"]))

    # Generate balanced entries for each category
    for class_type in classes:
        for category in categories[class_type]:
            for _ in range(entries_per_category):
                description = generate_description(class_type, category)
                transactions.append({
                    "description": description,
                    "class": class_type,
                    "category": category
                })

    # Add ambiguous entries (10% of total)
    ambiguous_count = num_transactions // 10
    ambiguous_words = ["stuff", "miscellaneous", "payment", "random", "general", "thing", "other", "cash", 
                       "transaction", "pending"]
    for _ in range(ambiguous_count):
        class_type = random.choice(classes)
        category = random.choice(categories[class_type])
        # Generate description with ambiguous words
        description = ' '.join(random.sample(ambiguous_words, random.randint(1, 3)))
        # Optionally append a template-based description
        if random.random() < 0.5:
            description += ' ' + generate_description(class_type, category)
        transactions.append({
            "description": description,
            "class": class_type,
            "category": category
        })

    # Shuffle transactions
    random.shuffle(transactions)
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
    transactions = generate_dataset(2000)
    save_dataset(transactions, output_path)
    print(f"Generated dataset with {len(transactions)} transactions and saved to {output_path}")


if __name__ == "__main__":
    main()