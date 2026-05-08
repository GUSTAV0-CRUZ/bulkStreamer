# 📦 Bulk Streamer (Processador Massivo de Dados)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-Advanced-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-TypeScript-E0234E?logo=nestjs&logoColor=white)

Uma aplicação backend focada em alta performance para o processamento de arquivos gigantes (na casa dos Gigabytes), utilizando baixo consumo de memória e a API nativa de Streams do ecossistema Node.js.

## 🛑 O Problema

Em aplicações corporativas reais (como transações bancárias, migração de dados ou sincronização de estoques), é comum precisarmos processar arquivos CSV/TXT com milhões de linhas. 

A abordagem tradicional de upload e leitura carrega o arquivo inteiro na memória RAM. No Node.js, isso gera dois problemas fatais:
1. **Estouro de Memória:** O motor V8 tem limites rígidos de memória, fazendo a aplicação falhar (Out of Memory).
2. **Bloqueio do Event Loop:** Processar milhares de dados de forma síncrona trava a thread principal, fazendo com que o sistema congele e pare de responder a outros processos.

## 🎯 Objetivo e Solução

O objetivo deste projeto é atuar como um robusto pipeline **ETL (Extract, Transform, Load)** que consegue processar arquivos infinitamente grandes mantendo o consumo de RAM estável (geralmente abaixo de 100MB).

Para resolver o gargalo de infraestrutura, a arquitetura utiliza a abordagem "gota a gota":
- **Read Streams:** Para ler e fatiar o arquivo sob demanda.
- **Transform Streams:** Para higienizar, validar ou formatar os dados em tempo real (on-the-fly).
- **Write Streams:** Para despejar os dados processados no destino final, descartando da memória o que já foi operado.

## 🧠 Conceitos e Desafios Técnicos Explorados

- Arquitetura de Pipelines e Streams no Node.js
- Manipulação assíncrona de I/O (Input/Output)
- Controle de Backpressure (evitar que a leitura afogue o processamento e a escrita)
- Gerenciamento de memória e Event Loop

## 🛠️ Tecnologias Utilizadas

- **TypeScript**
- **NestJS** (Base estrutural)
- **Node.js APIs Nativas** (`fs`, `stream`)
