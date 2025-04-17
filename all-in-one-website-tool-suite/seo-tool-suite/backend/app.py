from flask import Flask, request, jsonify, Blueprint, redirect, url_for, session
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "supersecretkey")
CORS(app)

# OAuth 2.0 Setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'openid email profile'},
)

# Modular Blueprints for SEO tool components
keyword_research_bp = Blueprint('keyword_research', __name__)
site_audit_bp = Blueprint('site_audit', __name__)

# Mock data for keyword research
keywords_db = {
    "seo": {"search_volume": 10000, "difficulty": 45, "trend": "up"},
    "keyword research": {"search_volume": 5000, "difficulty": 30, "trend": "stable"},
    "backlink analysis": {"search_volume": 3000, "difficulty": 50, "trend": "up"},
}

@keyword_research_bp.route('/keyword-research', methods=['GET'])
def keyword_research():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = []
    for kw, data in keywords_db.items():
        if query in kw:
            results.append({"keyword": kw, **data})

    return jsonify({"results": results})

@site_audit_bp.route('/site-audit', methods=['POST'])
def site_audit():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    audit_result = {
        "url": url,
        "issues": [
            {"type": "broken_link", "count": 3},
            {"type": "duplicate_content", "count": 1},
            {"type": "missing_alt_tags", "count": 5},
        ],
        "score": 75,
        "recommendations": [
            "Fix broken links",
            "Remove duplicate content",
            "Add alt tags to images",
        ],
    }
    return jsonify(audit_result)

# OAuth routes
@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    session['user'] = user_info
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

# Register blueprints with URL prefix for modularity
app.register_blueprint(keyword_research_bp, url_prefix='/api')
app.register_blueprint(site_audit_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
