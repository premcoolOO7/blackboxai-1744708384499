# Plaid Bank Sync (Python)

import os
from plaid import Client
from datetime import datetime, timedelta

PLAID_CLIENT_ID = os.environ.get("PLAID_CLIENT_ID")
PLAID_SECRET = os.environ.get("PLAID_SECRET")
PLAID_ENV = os.environ.get("PLAID_ENV", "sandbox")

client = Client(client_id=PLAID_CLIENT_ID, secret=PLAID_SECRET, environment=PLAID_ENV)

def get_transactions(access_token, start_date=None, end_date=None):
    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    try:
        response = client.Transactions.get(access_token, start_date, end_date)
        return response['transactions']
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return []
