# Import
from flask import Flask
from flask_cors import CORS
from router import Router

# App
app = Flask('Filepedia')
CORS(app)
Router(app)

app.run(port=666)
