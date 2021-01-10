import joblib
from nltk import word_tokenize

from basic_metrics import BasicMetrics

class LexicalDensity(object):

    @staticmethod
    def ureDel(text):
        pos_tagger = joblib.load('pkl/POS_tagger_brill.pkl')
        pos = pos_tagger.tag(word_tokenize(text))
        lexitems = 0

        for item in pos:
            if (item[1] == 'ADJ') or (item[1] == 'VAUX') or (item[1] == 'N') or \
                (item[1] == 'NPROP') or (item[1] == 'V'):
                lexitems += 1

        tokens = BasicMetrics.tokens(text)

        return lexitems*100/tokens

    @staticmethod
    def hallidayDel(text):
        pass