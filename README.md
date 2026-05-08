# 📦 Bulk Streamer (Processador Massivo de Dados)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 🛑 O Problema

Em aplicações corporativas reais (como transações bancárias ou sincronização de estoques), é comum precisarmos processar arquivos CSV/TXT gigantescos, com milhões de linhas. 

A abordagem tradicional de leitura carrega o arquivo inteiro na memória RAM de uma só vez. No ecossistema Node.js, isso gera dois problemas fatais:
1. **Estouro de Memória:** O motor V8 atinge seu limite de RAM, fazendo a aplicação falhar com o erro *Out of Memory*.
2. **Bloqueio do Event Loop:** Processar milhões de dados de forma síncrona trava a thread principal, fazendo com que o sistema congele e pare de responder a outros usuários.

## 🏗️ Arquitetura e Modelagem de Domínio

Para resolver esse gargalo, a solução foi desenhada com foco em **Eficiência de Memória** e **Isolamento Arquitetural**. O fluxo processa os dados de forma assíncrona ("gota a gota"), enquanto o Domínio da aplicação garante as regras de negócio de forma totalmente isolada da infraestrutura de leitura de arquivos.

![Diagrama de Requisitos e Domínio](./docs/images/diagrama.png) ```