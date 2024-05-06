from flask import Flask

# This import is importing all of the Flask Configurations deffined in config.py
from config import *

app = Flask(__name__)

@app.route('/')
def hello_geek():
    return '<h1>Hellow from Vault 36<h1>'

if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=3001)
