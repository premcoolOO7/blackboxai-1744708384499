from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import path
from django.core.management import execute_from_command_line
from django.conf import settings
from django.core.wsgi import get_wsgi_application
import sys
import os
import json

# Minimal Django settings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
settings.configure(
    DEBUG=True,
    ROOT_URLCONF=__name__,
    SECRET_KEY='your-secret-key',
    ALLOWED_HOSTS=['*'],
    MIDDLEWARE=[
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
    ],
)

application = get_wsgi_application()

# In-memory ledger for demo
ledger_entries = []

@csrf_exempt
def ledger_view(request):
    if request.method == 'GET':
        return JsonResponse({'entries': ledger_entries})
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            account = data.get('account')
            amount = data.get('amount')
            entry_type = data.get('type')
            if account and amount and entry_type in ['DEBIT', 'CREDIT']:
                ledger_entries.append({'account': account, 'amount': amount, 'type': entry_type})
                return JsonResponse({'status': 'success', 'entry': ledger_entries[-1]})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid data'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def plaid_transactions(request):
    # Placeholder for Plaid transactions API
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            access_token = data.get('access_token')
            # Here you would call the Plaid API using the access_token
            # For demo, return dummy transactions
            transactions = [
                {'date': '2024-01-01', 'name': 'Coffee Shop', 'amount': 4.5},
                {'date': '2024-01-02', 'name': 'Grocery Store', 'amount': 76.2},
            ]
            return JsonResponse({'transactions': transactions})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

urlpatterns = [
    path('api/ledger/', ledger_view),
    path('api/plaid/transactions/', plaid_transactions),
]

if __name__ == '__main__':
    execute_from_command_line(sys.argv)
