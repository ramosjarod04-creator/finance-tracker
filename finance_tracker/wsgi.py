import os
from django.core.wsgi import get_wsgi_application

# Ensure this matches your project folder name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_tracker.settings')

application = get_wsgi_application()

# Vercel looks for the variable 'app'
app = application