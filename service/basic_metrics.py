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
    def occurrences(text):
        text = text.replace(".",'')
        text = text.replace(",",'')
        text = text.replace(":",'')
        text = text.lower()
        result = re.split("[^a-zA-z0-9]+", text)
        
        if (result[-1] == ''):
            result.pop()
        
        return result
    
    @staticmethod
    def tokens(text):
        words = BasicMetrics.occurrences(text)
        
        return len(words)

    @staticmethod
    def types(text):
        words = BasicMetrics.occurrences(text)
        diff_words = Counter(words)

        return len(diff_words.items())