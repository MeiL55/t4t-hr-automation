from flask import Flask
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from routes.auth import auth_bp
from routes.apply import user_bp
from routes.resume import resume_bp
from routes.hr import hr_dashboard_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(resume_bp)
app.register_blueprint(hr_dashboard_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    app.run(host="0.0.0.0", port=port, debug=False)
