from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from io import StringIO

app = Flask(__name__)
CORS(app)

@app.route('/servertest', methods=['GET'])
def get_data():
    # Example data
    data = {
        'items': [
            {'id': 1, 'name': 'Item 1'},
            {'id': 2, 'name': 'Item 2'}
        ]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
