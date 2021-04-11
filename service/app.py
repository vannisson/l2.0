from flask import Flask, request, jsonify, make_response, Response, request, render_template
from flask_restplus import Api, Resource, fields
from flask_session import Session

from sklearn.feature_extraction.text import TfidfVectorizer

import numpy as np
import pandas as pd
import json
import os
from pathlib import Path

import joblib
from nltk import word_tokenize

from basic_metrics import BasicMetrics
from lexical_diversity import LexicalDiversity
from lexical_density import LexicalDensity

app = Flask(__name__)

# Session config
source_path = Path(Path(os.getcwd()))
app.config['UPLOAD_FOLDER'] = os.path.join(str(source_path), 'Uploads')
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

# API Config
api = Api(app = app, 
		  version = "0.1", 
		  title = "Lexicanalytics Web", 
		  description = "Relevant lexical info from texts, e. g. Lexical Diversity, Lexical Density, Words Frequencies.")

name_space = api.namespace('analyze', description='Gets text and returns info.')

model = api.model('Analyze params', 
				  {'text': fields.String(required = True, 
				  							   description="Text", 
    					  				 	   help="Text can not be blank")})
				
pos_tagger = joblib.load('pkl/POS_tagger_brill.pkl')

# Render html
@app.route('/index', methods=['POST', 'GET'])
def display_index():
    #user_id = request.cookies
    #session_id = request.cookies['session']
    #files = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], session_id))
    #print('user:', user_id)
    return render_template('index.html')

# API request reponses
@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@api.expect(model)		
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
			pos = dict(pos_tagger.tag(word_tokenize(text.lower())))

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