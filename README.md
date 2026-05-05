# 📦 Bulk Streamer (Processador Massivo de Dados)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-Advanced-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-TypeScript-E0234E?logo=nestjs&logoColor=white)

Um microsserviço focado em alta performance para o processamento de arquivos gigantes (na casa dos Gigabytes), utilizando baixo consumo de memória e paralelismo real no ecossistema Node.js.

## 🛑 O Problema

Em aplicações corporativas reais (como transações bancárias, migração de dados ou sincronização de estoques), é comum precisarmos processar arquivos CSV/TXT com milhões de linhas. 

A abordagem tradicional de upload e leitura carrega o arquivo inteiro na memória RAM. No Node.js, isso gera dois problemas fatais:
1. **Estouro de Memória:** O motor V8 tem limites rígidos de memória, fazendo a aplicação "crashar" (Out of Memory).
2. **Bloqueio do Event Loop:** Processar milhares de dados de forma síncrona trava a thread principal, fazendo com que a API pare de responder a todos os outros usuários.

## 🎯 Objetivo e Solução

O objetivo deste projeto é resolver esse gargalo clássico de infraestrutura. A aplicação atua como um pipeline de dados que consegue processar arquivos infinitamente grandes mantendo o consumo de RAM estável (abaixo de 100MB).

Para isso, a arquitetura utiliza:
- **Streams:** Para ler e fatiar o arquivo sob demanda (gota a gota), descartando da memória o que já foi lido.
- **Worker Threads:** Para retirar o processamento pesado da thread principal e distribuir as linhas do arquivo em processamento paralelo nos outros núcleos do servidor.

## 🧠 Conceitos e Desafios Técnicos Explorados

- Arquitetura de Pipelines e Streams no Node.js
- Multithreading em JavaScript (Worker Threads)
- Controle de Backpressure (evitar que a leitura afogue o processamento)
- Processamento e inserção em lotes (Batch Processing)

## 🛠️ Tecnologias Utilizadas

- **TypeScript**
- **NestJS**
- **Node.js API Nativa**
