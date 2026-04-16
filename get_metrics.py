import os
import re
import string
import urllib.request
import zipfile
from collections import Counter
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
zip_path = "smsspamcollection.zip"
extract_path = "smsspamcollection"

if not os.path.exists(zip_path):
    urllib.request.urlretrieve(url, zip_path)

with zipfile.ZipFile(zip_path, 'r') as z:
    z.extractall(extract_path)

df = pd.read_csv(os.path.join(extract_path, 'SMSSpamCollection'),
                 sep='\t', header=None, names=['label', 'text'],
                 encoding='utf-8')

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['clean_text'] = df['text'].apply(preprocess_text)
df['label_enc'] = (df['label'] == 'spam').astype(int)

MAX_SEQ_LEN = 50
VOCAB_SIZE = 5000
PAD_TOKEN = '<PAD>'
UNK_TOKEN = '<UNK>'

all_words = [word for text in df['clean_text'] for word in text.split()]
word_freq = Counter(all_words)
most_common = word_freq.most_common(VOCAB_SIZE - 2)

word2idx = {PAD_TOKEN: 0, UNK_TOKEN: 1}
for idx, (word, _) in enumerate(most_common, start=2):
    word2idx[word] = idx

def encode_text(text: str, word2idx: dict, max_len: int) -> list:
    tokens = text.split()[:max_len]
    encoded = [word2idx.get(tok, word2idx[UNK_TOKEN]) for tok in tokens]
    encoded += [word2idx[PAD_TOKEN]] * (max_len - len(encoded))
    return encoded

df['encoded'] = df['clean_text'].apply(lambda t: encode_text(t, word2idx, MAX_SEQ_LEN))

X = np.array(df['encoded'].tolist())
y = df['label_enc'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED, stratify=y)

class SMSDataset(Dataset):
    def __init__(self, sequences, labels):
        self.sequences = torch.tensor(sequences, dtype=torch.long)
        self.labels    = torch.tensor(labels,    dtype=torch.long)
    def __len__(self):
        return len(self.labels)
    def __getitem__(self, idx):
        return self.sequences[idx], self.labels[idx]

BATCH_SIZE = 64
train_dataset = SMSDataset(X_train, y_train)
test_dataset  = SMSDataset(X_test,  y_test)
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader  = DataLoader(test_dataset,  batch_size=BATCH_SIZE, shuffle=False)

class TextCNN(nn.Module):
    def __init__(self, vocab_size, embed_dim, num_filters, kernel_sizes, num_classes, dropout=0.5, pad_idx=0):
        super(TextCNN, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=pad_idx)
        self.convolutions = nn.ModuleList([
            nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=k)
            for k in kernel_sizes
        ])
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(num_filters * len(kernel_sizes), num_classes)

    def forward(self, x):
        embedded = self.embedding(x)
        embedded = embedded.permute(0, 2, 1)
        pooled = []
        for conv in self.convolutions:
            c = torch.relu(conv(embedded))
            c = c.max(dim=2).values
            pooled.append(c)
        cat = torch.cat(pooled, dim=1)
        cat = self.dropout(cat)
        out = self.fc(cat)
        return out

model = TextCNN(vocab_size=len(word2idx), embed_dim=64, num_filters=128, kernel_sizes=[2, 3, 4], num_classes=2, dropout=0.5).to(DEVICE)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-3)

EPOCHS = 10
for epoch in range(1, EPOCHS + 1):
    model.train()
    for sequences, labels in train_loader:
        sequences, labels = sequences.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(sequences)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

def evaluate(model, loader, device):
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for sequences, labels in loader:
            sequences = sequences.to(device)
            outputs   = model(sequences)
            preds     = outputs.argmax(dim=1).cpu().numpy()
            all_preds.extend(preds)
            all_labels.extend(labels.numpy())
    return np.array(all_preds), np.array(all_labels)

cnn_preds, true_labels = evaluate(model, test_loader, DEVICE)
print("ACC:", accuracy_score(true_labels, cnn_preds))
print("PREC:", precision_score(true_labels, cnn_preds, zero_division=0))
print("REC:", recall_score(true_labels, cnn_preds, zero_division=0))
print("F1:", f1_score(true_labels, cnn_preds, zero_division=0))
