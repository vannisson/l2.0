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
        pos_tagger = joblib.load('pkl/POS_tagger_brill.pkl')
        pos = pos_tagger.tag(word_tokenize(text))
        lexitems = 0

        for item in pos:
            if (item[1] == 'ADJ') or (item[1] == 'VAUX') or (item[1] == 'N') or \
                (item[1] == 'NPROP') or (item[1] == 'V') or (item[1] == 'ADV') or \
                    (item[1] == 'ADV-KS') or (item[1] == 'ADV-KS-REL'):
                lexitems += 1

        tokens = BasicMetrics.tokens(text)

        return lexitems*100/tokens

    @staticmethod
    def count_lexical_items(pos_dict, freq_dict):
        pos_subs = 0
        pos_verbs = 0
        pos_adj = 0
        pos_adv = 0

        for wd in freq_dict:
            if (pos_dict[wd] == 'N' or pos_dict[wd] == 'NPROP'):
                pos_subs += freq_dict[wd]
            elif (pos_dict[wd] == 'V' or pos_dict[wd] == 'VAUX'):
                pos_verbs += freq_dict[wd]
            elif (pos_dict[wd] == 'ADJ'):
                pos_adj += freq_dict[wd]
            elif (pos_dict[wd] == 'ADV' or pos_dict[wd] == 'ADV-KS' or pos_dict[wd] == 'ADV-KS-REL'):
                pos_adv += freq_dict[wd]

        return pos_subs, pos_verbs, pos_adj, pos_adv

    @staticmethod
    def count_non_lexical_items(pos_dict,freq_dict):
        pos_pro = 0
        pos_art = 0
        pos_others = 0

        for wd in freq_dict:
            if (pos_dict[wd] != 'N' and pos_dict[wd] != 'NPROP' and pos_dict[wd] != 'V' and pos_dict[wd] != 'VAUX' and pos_dict[wd] != 'ADJ' and pos_dict[wd] != 'ADV' and pos_dict[wd] != 'ADV-KS' and pos_dict[wd] != 'ADV-KS-REL'):
                if (pos_dict[wd] == 'PROADJ' or pos_dict[wd] == 'PROPESS' or pos_dict[wd] == 'PROSUB' or pos_dict[wd] == 'PRO-KS' or pos_dict[wd] == 'PRO-KS-REL'):
                    pos_pro += freq_dict[wd]
                elif (pos_dict[wd] == 'ART'):
                    pos_art += freq_dict[wd]
                else:
                    pos_others += freq_dict[wd]
        print("done:" ,pos_pro,pos_art,pos_others)
        return pos_pro, pos_art, pos_others
