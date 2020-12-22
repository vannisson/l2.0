import sys

from controllers.AnalyzeText import analyze_lines
from controllers.AnalyzeText import analyze_words

from controllers.DataInfo import search
from controllers.DataInfo import show_words

from controllers.TextInput import add_texts 
from controllers.TextInput import clear_all
from controllers.TextInput import clear_text

colecao_textos = []
texto_teste = input("Digite o texto aqui: ")

add_texts(texto_teste,colecao_textos)
linhas = analyze_lines(texto_teste)
vezes = analyze_words(texto_teste)
different = len(vezes)

temp = None
while temp != "5":
    temp = input("========= O que você deseja fazer? =========\n1 - Realizar análise\n2 - Adicionar outro texto \n3 - Procurar uma palavra \n5 - Sair\n\n")

    if temp == "1":
        show_words(vezes,linhas)

    elif temp == "2":
        add_texts(input("Digite o texto aqui: "),colecao_textos)

    elif temp == "3":
        search(input("Qual palavra deseja buscar?"),vezes)

