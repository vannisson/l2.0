import re
from collections import Counter

class BasicMetrics(object):
    
    @staticmethod
    def n_lines(text):
        lines = 1
        for char in text:
            if char == '\n':
                lines += 1
        return lines
    
    @staticmethod
    def wordsList(text):
        text = text.replace(".",'')
        text = text.replace(",",'')
        text = text.replace(":",'')
        text = text.lower()
        result = re.split("[^\w]+", text)
        
        if (result[-1] == ''):
            result.pop()
        
        return result
    
    @staticmethod
    def tokens(text):
        words = BasicMetrics.wordsList(text)
        
        return len(words)

    @staticmethod
    def types(text):        
        return len(BasicMetrics.frequencies(text))

    
    @staticmethod
    def frequencies(text):
        words = BasicMetrics.wordsList(text)
        return Counter(words)