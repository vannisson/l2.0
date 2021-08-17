from basic_metrics import BasicMetrics
#from lexical_diversity import lex_div as ld

class LexicalDiversity(object):

    @staticmethod
    def ttr(text):
        types = BasicMetrics.types(text)
        tokens = BasicMetrics.tokens(text)
        
        return types*100/tokens

    @staticmethod
    def vocD(text):
        pass

    @staticmethod
    def mtld(text):
        pass

