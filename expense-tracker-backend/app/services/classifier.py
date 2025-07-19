# import math
# from collections import defaultdict
# import re
# import csv
# from pathlib import Path

# class NaiveBayesClassifier:
#     def __init__(self):
#         self.word_probs = defaultdict(lambda: defaultdict(float))
#         self.class_counts = defaultdict(int)
#         self.category_counts = defaultdict(lambda: defaultdict(int))
#         self.total_docs = 0
#         self.vocab = set()
#         self.classes = ['income', 'expense']
#         self.categories = {
#             'income': ['salary', 'investment', 'gift', 'freelance', 'rental','income'],
#             'expense': ['food', 'transport', 'bills', 'entertainment', 'housing', 'healthcare', 'education']
#         }

#     def preprocess(self, text):
#         text = text.lower()
#         words = re.findall(r'\w+', text)
#         return words

#     def train(self, transactions):
#         for text, cls, category in transactions:
#             if cls not in self.classes or category not in self.categories[cls]:
#                 continue
#             self.class_counts[cls] += 1
#             self.category_counts[cls][category] += 1
#             self.total_docs += 1
#             words = self.preprocess(text)
#             for word in words:
#                 self.vocab.add(word)
#                 self.word_probs[cls][word] += 1
#                 self.word_probs[f"{cls}_{category}"][word] += 1

#         vocab_size = len(self.vocab)
#         for cls in self.classes:
#             for word in self.vocab:
#                 self.word_probs[cls][word] = (self.word_probs[cls][word] + 1) / (
#                     sum(self.word_probs[cls].values()) + vocab_size)
#                 for category in self.categories[cls]:
#                     self.word_probs[f"{cls}_{category}"][word] = (
#                         self.word_probs[f"{cls}_{category}"][word] + 1) / (
#                         sum(self.word_probs[f"{cls}_{category}"].values()) + vocab_size)

#     def classify(self, text):
#         words = self.preprocess(text)
#         class_scores = {}
#         for cls in self.classes:
#             prior = math.log(self.class_counts[cls] / self.total_docs if self.total_docs > 0 else 1)
#             likelihood = 0
#             for word in words:
#                 if word in self.vocab:
#                     likelihood += math.log(self.word_probs[cls][word])
#             class_scores[cls] = prior + likelihood

#         predicted_class = max(class_scores, key=class_scores.get)
#         category_scores = {}
#         for category in self.categories[predicted_class]:
#             prior = math.log(self.category_counts[predicted_class][category] /
#                            self.class_counts[predicted_class]
#                            if self.class_counts[predicted_class] > 0 else 1)
#             likelihood = 0
#             for word in words:
#                 if word in self.vocab:
#                     likelihood += math.log(self.word_probs[f"{predicted_class}_{category}"][word])
#             category_scores[category] = prior + likelihood

#         predicted_category = max(category_scores, key=category_scores.get)
#         return predicted_class, predicted_category, class_scores, category_scores

#     def load_training_data(self, file_path):
#         with open(file_path, 'r', encoding='utf-8') as f:
#             reader = csv.DictReader(f)
#             transactions = [(row['description'], row['class'], row['category']) for row in reader]
#         self.train(transactions)








import math
from collections import defaultdict
import re
import csv
from pathlib import Path

class NaiveBayesClassifier:
    def __init__(self):
        self.word_probs = defaultdict(lambda: defaultdict(float))
        self.class_counts = defaultdict(int)
        self.category_counts = defaultdict(lambda: defaultdict(int))
        self.total_docs = 0
        self.vocab = set()
        self.classes = ['income', 'expense']
        self.categories = {
            'income': ['salary', 'investment', 'gift', 'freelance', 'rental', 'income'],
            'expense': ['food', 'transport', 'bills', 'entertainment', 'housing', 'healthcare', 'education']
        }

    def preprocess(self, text):
        text = text.lower()
        words = re.findall(r'\w+', text)
        return words

    def train(self, transactions):
        for text, cls, category in transactions:
            if cls not in self.classes or category not in self.categories[cls]:
                continue
            self.class_counts[cls] += 1
            self.category_counts[cls][category] += 1
            self.total_docs += 1
            words = self.preprocess(text)
            for word in words:
                self.vocab.add(word)
                self.word_probs[cls][word] += 1
                self.word_probs[f"{cls}_{category}"][word] += 1

        vocab_size = len(self.vocab)
        for cls in self.classes:
            for word in self.vocab:
                self.word_probs[cls][word] = (self.word_probs[cls][word] + 1) / (
                    sum(self.word_probs[cls].values()) + vocab_size)
                for category in self.categories[cls]:
                    self.word_probs[f"{cls}_{category}"][word] = (
                        self.word_probs[f"{cls}_{category}"][word] + 1) / (
                        sum(self.word_probs[f"{cls}_{category}"].values()) + vocab_size)

    def classify(self, text):
        words = self.preprocess(text)
        class_scores = {}
        for cls in self.classes:
            prior = math.log(self.class_counts[cls] / self.total_docs if self.total_docs > 0 else 1)
            likelihood = 0
            for word in words:
                if word in self.vocab:
                    likelihood += math.log(self.word_probs[cls][word])
            class_scores[cls] = prior + likelihood

        predicted_class = max(class_scores, key=class_scores.get)
        category_scores = {}
        for category in self.categories[predicted_class]:
            prior = math.log(self.category_counts[predicted_class][category] /
                           self.class_counts[predicted_class]
                           if self.class_counts[predicted_class] > 0 else 1)
            likelihood = 0
            for word in words:
                if word in self.vocab:
                    likelihood += math.log(self.word_probs[f"{predicted_class}_{category}"][word])
            category_scores[category] = prior + likelihood

        predicted_category = max(category_scores, key=category_scores.get)
        return predicted_class, predicted_category, class_scores, category_scores

    def load_training_data(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            transactions = [(row['description'], row['class'], row['category']) for row in reader]
        self.train(transactions)

    def predict_category(self, description, transaction_type):
        if transaction_type not in self.classes:
            return f"Error: Invalid transaction type. Must be one of {self.classes}"
        
        words = self.preprocess(description)
        category_scores = {}
        for category in self.categories[transaction_type]:
            prior = math.log(self.category_counts[transaction_type][category] /
                           self.class_counts[transaction_type]
                           if self.class_counts[transaction_type] > 0 else 1)
            likelihood = 0
            for word in words:
                if word in self.vocab:
                    likelihood += math.log(self.word_probs[f"{transaction_type}_{category}"][word])
            category_scores[category] = prior + likelihood

        if not category_scores or not any(self.word_probs[f"{transaction_type}_{cat}"] for cat in self.categories[transaction_type]):
            return {
                'description': description,
                'transaction_type': transaction_type,
                'predicted_category': 'uncategorized',
                'category_probabilities': {}
            }

        predicted_category = max(category_scores, key=category_scores.get)
        max_score = category_scores[predicted_category]
        total_prob = sum(math.exp(score) for score in category_scores.values())
        probabilities = {cat: math.exp(score) / total_prob if total_prob > 0 else 0 for cat, score in category_scores.items()}

        # Set a threshold for confidence (e.g., 0.1 for normalized probability)
        if probabilities[predicted_category] < 0.1:
            predicted_category = 'uncategorized'
            probabilities = {}

        return {
            'description': description,
            'transaction_type': transaction_type,
            'predicted_category': predicted_category,
            'category_probabilities': probabilities
        }