import requests
import string

from functools import reduce
from flask import Flask, request, json, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


#
# GET /recommendations
# Returns the current list of recommendations
#
@app.route("/recommendations")
def recommendations():
    items = _get_basket_items()
    products = _get_products()
    basket_product_ids = _get_basket_product_ids(items)
    search_terms = _get_search_terms(products, basket_product_ids)
    recommendations = _get_matching_products(products, search_terms, basket_product_ids)
    return jsonify(recommendations)


#
# Gets the products that are currently in the catalogue
#
def _get_products():
    r = requests.get('http://products.congo.com:5000/products')
    if r.status_code == requests.codes.ok:
        return r.json()
    else:
        return []


#
# Gets the current contents of the customer's basket
#
def _get_basket_items():
    r = requests.get('http://basket.congo.com:5000/basket/items')
    if r.status_code == requests.codes.ok:
        return r.json()
    else:
        return []


#
# Extracts the product ids of the basket items
#
def _get_basket_product_ids(items):
    return list(map(lambda x: x['product_id'], items))


#
# Extracts a list of words to use for searching for similar products
#
def _get_search_terms(products, ids):
    # Get the subset of products that are also in the basket
    products_in_basket = list(filter(lambda x: x['id'] in ids, products))
    
    # Generate a list of all the words in the descriptions of those products
    # Removing punctuation and converting to lower case in the process
    terms = list(
        reduce(
            lambda result, product: result + _get_words_from_string(product['description']), 
            products_in_basket, 
            []
        )
    )

    # Remove duplicates
    terms = list(dict.fromkeys(terms))

    # Remove short words that are probably not helpful
    terms = list(filter(lambda x: len(x) > 4, terms))
    
    # Just take the first 20 words
    return terms[:20]


#
# Extracts a list of words from a string
# + Only uses the first 150 characters
# + Removes punctuation
# + Converts all to lowercase
#
def _get_words_from_string(the_string):
    return the_string[0:150].translate(
        the_string.maketrans('', '', string.punctuation)
        ).lower().split()


#
# Finds products that match the search terms 
# (ignoring a list of products supplied)
#
def _get_matching_products(products, terms, ids_to_ignore):
    products_not_in_basket = list(filter(lambda x: x['id'] not in ids_to_ignore, products))
    return list(
        filter(
            lambda product: _intersects(
                _get_words_from_string(product['description']), 
                terms
            ), 
            products_not_in_basket
        )
    )


#
# Decides if the given lists have an intersection
#
def _intersects(list_1, list_2):
    temp = set(list_2)
    results = [value for value in list_1 if value in temp]
    return len(results) > 0
