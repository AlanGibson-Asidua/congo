import os

from flask import Flask, json, jsonify, abort, make_response
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


#
# GET /products
# Returns the current list of products
#
@app.route("/products")
def products():
    products = _load_products()
    return jsonify(products)


#
# GET /products/id
# Returns a single product based on its id
#
@app.route("/products/<int:id>")
def product(id):
    products = _load_products()
    product = next((product for product in products if product["id"] == id), False)
    if product:
        return jsonify(product)
    else:
        abort(make_response(jsonify(message="Product not found"), 404))


#
# Loads the products from file
#
def _load_products():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    filename = os.path.join(SITE_ROOT, 'products.json')
    with open(filename) as json_file:
        products = json.load(json_file)
    return products

