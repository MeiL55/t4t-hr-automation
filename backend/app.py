from flask import Flask
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from routes.auth import auth_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(debug=True)
