# Security Middleware - Auto-block SQLi/XSS attempts (Django style)

from django.http import HttpResponseForbidden
import logging

logger = logging.getLogger(__name__)

def detect_malicious_activity(request):
    # Placeholder for real detection logic
    suspicious_patterns = ['<script>', 'union select', 'drop table', '--']
    query = request.GET.urlencode().lower()
    for pattern in suspicious_patterns:
        if pattern in query:
            return True
    return False

class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if detect_malicious_activity(request):
            logger.warning(f"Blocked malicious request from {request.META.get('REMOTE_ADDR')}")
            return HttpResponseForbidden("Blocked by AI Security")
        response = self.get_response(request)
        return response
