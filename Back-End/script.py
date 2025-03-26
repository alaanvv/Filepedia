# Import
from flask import Flask
from flask_cors import CORS
from router import Router
from dotenv import load_dotenv
import os

load_dotenv()

# App
app = Flask('Filepedia')
CORS(app)
Router(app)

app.run(debug=False, host='0.0.0.0', port=int(os.getenv('PORT')))
