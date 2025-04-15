from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data for keyword research
keywords_db = {
    "seo": {"search_volume": 10000, "difficulty": 45, "trend": "up"},
    "keyword research": {"search_volume": 5000, "difficulty": 30, "trend": "stable"},
    "backlink analysis": {"search_volume": 3000, "difficulty": 50, "trend": "up"},
}

@app.route('/api/keyword-research', methods=['GET'])
def keyword_research():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Simple mock search: return keywords containing the query substring
    results = []
    for kw, data in keywords_db.items():
        if query in kw:
            results.append({"keyword": kw, **data})

    return jsonify({"results": results})

@app.route('/api/site-audit', methods=['POST'])
def site_audit():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    # Mock audit result
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

if __name__ == '__main__':
    app.run(debug=True)
