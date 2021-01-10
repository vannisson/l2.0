from basic_metrics import BasicMetrics

class LexicalDiversity(object):

    @staticmethod
    def ttr(text):
        types = BasicMetrics.types(text)
        tokens = BasicMetrics.tokens(text)
        
        return types*100/tokens

    @staticmethod
    def vocD(text):
        pass
