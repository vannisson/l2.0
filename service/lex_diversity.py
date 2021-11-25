from basic_metrics import BasicMetrics
from lexical_diversity import lex_div as ld

class LexicalDiversity(object):

    @staticmethod
    def ttr(text):
        types = BasicMetrics.types(text)
        tokens = BasicMetrics.tokens(text)
        
        return types*100/tokens

    @staticmethod
    def hdd_ld(text):
        tokens = BasicMetrics.trueTokens(text)
        return ld.hdd(tokens)*100

    @staticmethod
    def mtld_ld(text):
        tokens = BasicMetrics.trueTokens(text)
        return ld.mtld(tokens)

