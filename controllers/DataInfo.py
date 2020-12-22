# ====================================== D A T A   I N F O ===============================================

def show_words(times,lines):
    # This display the words in alphabetical order
    dict_items = times.items()
    sorted_items = sorted(dict_items)
    print("=======================================")
    print(f'O texto possui {lines} linhas.')
    for each in sorted_items:
        print(f'{each[0]} = {each[1]} times')

def search(term,times):
    # This search for some specific word after the analyze
    if term in times:
        print(f'{term} = {times[term]}')
    else:
        print("Word not found")
