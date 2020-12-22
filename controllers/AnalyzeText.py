# ====================================== A N A L Y Z E ===============================================

from collections import Counter

def analyze_lines(text):
    # This count the number of lines
    lines = 1
    for char in text:
        if char == '\n':
            lines += 1
    return lines

def analyze_words(text):
    # This use Counter from Python Collections to count each time a word appears
    text = text.lower().replace(',','').split()
    times = Counter(text)
    
    return times
