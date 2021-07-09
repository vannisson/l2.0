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


#csv_filepath = os.path.join(os.path.join(app.config['UPLOAD_FOLDER'], session_id), 'productions.csv')
csv_filepath = 'productions.csv'

# Session config
#source_path = Path(Path(os.getcwd()))
#app.config['UPLOAD_FOLDER'] = os.path.join(str(source_path), 'Uploads')
#SESSION_TYPE = 'filesystem'
#app.config.from_object(__name__)
#Session(app)

# API Config
api = Api(app = app, 
		  version = "0.1", 
		  title = "Lexicanalytics Web", 
		  description = "Relevant lexical info from texts, e. g. Lexical Diversity, Lexical Density, Words Frequencies.")

analyze_ns = api.namespace('analyze', description='Gets text and analyses.')
prod_info_ns = api.namespace('prod_info', description='Returns production info.')
stats_ns = api.namespace('stats', description='Returns productions basic stats info.')
delete_texts_ns = api.namespace('delete', description='Delete all the texts.')

analyze_model = api.model('Analyze params', 
				  {'text': fields.String(required = True, 
				  							   description="Text", 
    					  				 	   help="Text can not be blank")})

prod_info_model = api.model('Production Info params', 
				  {'production': fields.String(required = True, 
				  							   description="Production id", 
    					  				 	   help="Production can not be blank")}) 

pos_tagger = joblib.load('pkl/POS_tagger_brill.pkl')

# Render html
@app.route('/index', methods=['POST', 'GET'])
def display_index():
    #user_id = request.cookies
    #session_id = request.cookies['session']
    #files = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], session_id))
    #print('user:', user_id)

	num_prod = 0
	if (os.path.exists(csv_filepath)):
		productions = pd.read_csv(csv_filepath)
		num_prod = len(productions)
	
	return render_template('index.html', num_prod=num_prod)

@app.route('/results', methods=['POST'])
def show_results():
	if (os.path.exists(csv_filepath)):
		productions = pd.read_csv(csv_filepath)

		num_prod = len(productions)

		return render_template('results.html', num_prod=num_prod)
	else:
		return render_template('error.html')

@app.route('/about_project', methods=['GET'])
def show_about_project():
		return render_template('about_project.html')

@app.route('/about_people', methods=['GET'])
def show_about_people():
		return render_template('about_people.html')

# API request reponses
@analyze_ns.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@api.expect(analyze_model)		
	def post(self):
		try: 
			formData = request.json
			text = str(formData['text']).lstrip()
			# Processing
			n_lines = BasicMetrics.n_lines(text)
			n_words = BasicMetrics.tokens(text)
			types = BasicMetrics.types(text)
			frequencies = dict(BasicMetrics.frequencies(text))
			lexicalDiversity = LexicalDiversity.ttr(text)
			lexicalDensity = LexicalDensity.hallidayDel(text)
			pos = dict(pos_tagger.tag(word_tokenize(text.lower())))
			
			pos_subs, pos_verbs, pos_adj, pos_adv = LexicalDensity.count_lexical_items(pos, frequencies)
			pos_pro, pos_art, pos_others = LexicalDensity.count_non_lexical_items(pos, frequencies)
			

			# Add analysis to database
			new_row = {'text': text, 'n_lines': n_lines, 'n_words': n_words, 'types': types, 'frequencies': str(frequencies), 'lexicalDiversity': lexicalDiversity, 'lexicalDensity': lexicalDensity, 'pos': str(pos), 'pos_subs': pos_subs, 'pos_verbs': pos_verbs, 'pos_adj': pos_adj, 'pos_adv': pos_adv, 'pos_pro': pos_pro, 'pos_art': pos_art, 'pos_others': pos_others}
			if (os.path.exists(csv_filepath)):
				productions = pd.read_csv(csv_filepath)
				productions = productions.append(new_row, ignore_index=True)
			else:
				productions = pd.DataFrame(data=new_row, index=[0], columns=['text', 'n_lines', 'n_words', 'types', 'frequencies', 'lexicalDiversity', 'lexicalDensity', 'pos', 'pos_subs', 'pos_verbs', 'pos_adj', 'pos_adv', 'pos_pro', 'pos_art', 'pos_others'])

			print(productions)
			
			productions.to_csv(csv_filepath, index=False, header=True)

			# Response
			response = '{"statusCode": 200, "status": "Query made"}'
			response = Response(json.dumps(json.loads(response), ensure_ascii=False), mimetype='application/json')
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make analysis",
				"error": str(error)
			})

@stats_ns.route("/")
class MainClass(Resource):
	
	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	def get(self):
		productions = pd.read_csv(csv_filepath)

		response = jsonify({
				"statusCode": 200,
				"n_words": productions['n_words'].to_list(),
				"types": productions['types'].to_list(),
				"lexicalDensity": productions['lexicalDensity'].to_list(),
				"lexicalDiversity": productions['lexicalDiversity'].to_list(),
				"pos_subs": productions['pos_subs'].to_list(),
				"pos_verbs": productions['pos_verbs'].to_list(),
				"pos_adj": productions['pos_adj'].to_list(),
				"pos_adv": productions['pos_adv'].to_list(),
				"pos_pro": productions['pos_pro'].to_list(),
				"pos_art": productions['pos_art'].to_list(),
				"pos_others": productions['pos_others'].to_list()
			})
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

# API request reponses
@prod_info_ns.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@api.expect(prod_info_model)		
	def post(self):
		try: 
			formData = request.json
			prod_idx = formData['production']

			# Getting from database
			productions = pd.read_csv(csv_filepath)
			production = productions.iloc[int(prod_idx)]

			# data transform on frequencies and pos to ensure dict
			frequencies = production['frequencies'].replace("'", "\"")
			frequencies = json.loads(frequencies)
			frequencies = json.dumps(frequencies, ensure_ascii=False)

			pos = production['pos'].replace("'", "\"")
			pos = json.loads(pos)
			pos = json.dumps(pos, ensure_ascii=False)

			# Response
			response = '{"statusCode": 200, "status": "Query made", "pos": ' + pos \
				+ ', "dil": ' + str(production['lexicalDiversity']) \
					+  ', "del": ' + str(production['lexicalDensity']) + \
						', "n_lines": ' + str(production['n_lines']) + \
							', "n_words": ' + str(production['n_words']) + \
								', "types": ' + str(production['types']) + \
									', "frequencies": ' + frequencies + \
										', "text": ' + json.dumps(production['text'], ensure_ascii=False) + '}'
			response = Response(json.dumps(json.loads(response), ensure_ascii=False), mimetype='application/json')
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})

@delete_texts_ns.route("/")
class MainClass(Resource):
	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	def post(self):
		try: 
			if (os.path.exists(csv_filepath)):
				os.remove(csv_filepath)
			response = '{"statusCode": 200, "status": "Query made"}'
			response = Response(json.dumps(json.loads(response), ensure_ascii=False), mimetype='application/json')
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
	
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
		})