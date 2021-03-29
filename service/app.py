from flask import Flask, request, jsonify, make_response, Response
from flask_restplus import Api, Resource, fields

from sklearn.feature_extraction.text import TfidfVectorizer

import numpy as np
import pandas as pd
import json

import joblib
from nltk import word_tokenize

from basic_metrics import BasicMetrics
from lexical_diversity import LexicalDiversity
from lexical_density import LexicalDensity

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "0.1", 
		  title = "Lexicanalytics Web", 
		  description = "Relevant lexical info from texts, e. g. Lexical Diversity, Lexical Density, Words Frequencies.")

name_space = app.namespace('analyze', description='Gets text and returns info.')

model = app.model('Analyze params', 
				  {'text': fields.String(required = True, 
				  							   description="Text", 
    					  				 	   help="Text can not be blank")})
				

pos_tagger = joblib.load('pkl/POS_tagger_brill.pkl')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(model)		
	def post(self):
		try: 
			formData = request.json
			text = formData['text']
			# Processing
			n_lines = BasicMetrics.n_lines(text)
			n_words = BasicMetrics.tokens(text)
			types = BasicMetrics.types(text)
			frequencies = dict(BasicMetrics.frequencies(text))
			lexicalDiversity = LexicalDiversity.ttr(text)
			lexicalDensity = LexicalDensity.ureDel(text)
			pos = dict(pos_tagger.tag(word_tokenize(text)))

			# Response
			response = '{"statusCode": 200, "status": "Query made", "pos": ' + json.dumps(pos, ensure_ascii=False) \
				+ ', "dil": ' + str(lexicalDiversity) \
					+  ', "del": ' + str(lexicalDensity) + \
						', "n_lines": ' + str(n_lines) + \
							', "n_words": ' + str(n_words) + \
								', "types": ' + str(types) + \
									', "frequencies": ' + json.dumps(frequencies, ensure_ascii=False) + '}'
			response = Response(json.dumps(json.loads(response), ensure_ascii=False), mimetype='application/json')
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})