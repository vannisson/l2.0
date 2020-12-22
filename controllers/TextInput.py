# ====================================== A D D  T E X T ===============================================

def add_texts(text,collection):
    # This add a text an
    collection.append(text)
    clear_text(text)
    return collection, text

def clear_text(text):
    # This clear the text to write a new one
    text = ''
    return text

def clear_all(collection):
    # This clear all the texts added to collection
    collection = []
    return collection
