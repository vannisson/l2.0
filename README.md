# Lexicanalytics Web
Lexicanalytics is a web plataform to support linguistics and education researchers/professionals on extracting relevant lexical info from texts, e. g. Lexical Diversity, Lexical Density, Words Frequencies.

## What is underneath?
While the previous version of Lexicanalytics was developed in Java, this one is a web service running over a **flask** backend server and **react-components/nodejs** client-side frontend.

## How to make it work?
This project is encapsulated in docker containers and run with docker-compose. To run locally, one just needs to clone this repository, build the images using:

`$ docker-compose build`

having created the images, run the servers using:

`$ docker-compose up`
