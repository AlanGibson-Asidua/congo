import requests

from flask import Flask, request, json, jsonify, abort, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin


app = Flask(__name__)
CORS(app)


# MySQL connection configuration
# Should probably be derived from environment variables...
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://congo:congo123@mysql/congo"
db = SQLAlchemy(app)


#
# A model class to make database access nicer
#
class BasketItem(db.Model, SerializerMixin):
    __tablename__ = 'basket_items'

    id         = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    quantity   = db.Column(db.Integer, nullable=False)

    def __init__(self, product_id, quantity):
        self.product_id = product_id
        self.quantity   = quantity


#
# GET /basket/items
# Returns the current list of items in the basket
#
@app.route("/basket/items")
def items():
    items = BasketItem.query.all()
    result = [item.to_dict() for item in items]
    return jsonify(result)


#
# POST /basket/items
# Adds an item to the basket
#
@app.route("/basket/items", methods=['POST'])
def add():
    product_id = request.json["product_id"]

    # Check that the product exists?
    url = f'http://products.congo.com:5000/products/{product_id}'
    r = requests.get(url)
    
    product_exists = r.status_code == requests.codes.ok

    item = _find_basket_item(product_id)

    if product_exists and (item is None):
        # Add product to basket
        item = BasketItem(product_id, 1)
        db.session.add(item)
    elif product_exists:
        # Increment the quantity for a product already in the basket
        item.quantity += 1
    elif not(item is None):
        # Remove a product that is in the basket but no longer exists!
        db.session.delete(item)
    
    db.session.commit()
    
    return jsonify(item.to_dict())


#
# DELETE /basket/items/x
# Deletes a single item from the basket
#
@app.route("/basket/items/<int:id>", methods=['DELETE'])
def delete(id):
    item = BasketItem.query.get(id)
    
    if item is None:
        abort(make_response(jsonify(message="Product not found"), 404))
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify(deleted=id)


#
# POST /bask/submit
#
@app.route("/basket/submit", methods=['POST'])
def submit():
    items = BasketItem.query.all()
    data = list(map(lambda item: { 'product_id': item.product_id , 'quantity': item.quantity }, items))

    url = f'http://orders.congo.com:5000/orders'
    r = requests.post(url, json = data)

    BasketItem.query.delete()
    db.session.commit()

    return jsonify([])


#
# Returns a specific item from the basket based on product id
#
def _find_basket_item(product_id):
    return BasketItem.query.filter_by(product_id=product_id).first()


#
# Sets up the database before the first API call is made
#
@app.before_first_request
def setup_database():
    db.create_all()
