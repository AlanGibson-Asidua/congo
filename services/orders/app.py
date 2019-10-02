import requests

from flask import Flask, request, json, jsonify, abort, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin


app = Flask(__name__)
CORS(app)


# MySQL connection configuration
# Should probably be derived from environment variables...
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://congo:congo123@mysql/congo"
db = SQLAlchemy(app)


#
# Model classes to make database access nicer
#
class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id         = db.Column(db.Integer,  primary_key=True)
    order_date = db.Column(db.DateTime, nullable=False, server_default=func.current_timestamp())
    total      = db.Column(db.Numeric,  nullable=False)

    line_items = relationship("OrderLineItem")

    def __init__(self, total):
        self.total = total


class OrderLineItem(db.Model, SerializerMixin):
    __tablename__ = 'order_line_items'

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))

    product_id = db.Column(db.Integer, nullable=False)
    quantity   = db.Column(db.Integer, nullable=False)
    
    product_name     = db.Column(db.String(255), nullable=False)
    product_category = db.Column(db.String(255), nullable=True, server_default='')
    product_brand    = db.Column(db.String(255), nullable=True, server_default='')
    product_price    = db.Column(db.Numeric,     nullable=False)

    def __init__(self, product_id, quantity, product_name, product_category, product_brand, product_price):
        self.product_id       = product_id
        self.quantity         = quantity
        self.product_name     = product_name
        self.product_category = product_category
        self.product_brand    = product_brand
        self.product_price    = product_price


#
# GET /orders
# Returns the current list of orders
#
@app.route("/orders")
def items():
    orders = Order.query.order_by(Order.order_date.desc()).all()
    result = [order.to_dict() for order in orders]
    return jsonify(result)


#
# POST /orders
# Adds an order
#
@app.route("/orders", methods=['POST'])
def add():
    json = request.json

    if json is None:
        abort(make_response(jsonify(message="No data supplied"), 400))
    
    order = Order(0)

    for item in json:
        product_id = item["product_id"]
        quantity = item["quantity"]
        
        # Get product info
        r = requests.get(f'http://products.congo.com:5000/products/{product_id}')
        if r.status_code == requests.codes.ok:
            product = r.json()

            line_item = OrderLineItem(
                product_id, 
                quantity,
                product['product_name'],
                product['category'],
                product['brand'],
                product['price']
            )

            order.line_items.append(line_item)
            order.total += line_item.quantity * line_item.product_price

    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict())


#
# GET /orders/id
# Returns the details of a single order
#
@app.route("/orders/<int:id>")
def get(id):
    order = Order.query.get(id)

    if order is None:
        abort(make_response(jsonify(message="Order not found"), 404))

    return jsonify(order.to_dict())


#
# Sets up the database before the first API call is made
#
@app.before_first_request
def setup_database():
    db.create_all()