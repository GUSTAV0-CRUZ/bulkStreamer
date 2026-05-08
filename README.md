# 📦 Bulk Streamer (Processador Massivo de Dados)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 🛑 O Problema

Em aplicações corporativas reais (como integrações bancárias, migração de dados ou sincronização de estoques), é muito comum a necessidade de processar arquivos massivos contendo milhões de registros.

A abordagem ingênua e tradicional consiste em carregar o arquivo inteiro na memória do servidor de uma só vez para depois processá-lo. Independentemente da linguagem de programação utilizada, essa prática gera problemas críticos de infraestrutura:

1. **Estouro de Memória:** Servidores possuem limites físicos de RAM. Tentar alocar um arquivo de múltiplos Gigabytes na memória fatalmente causará a quebra (*crash*) da aplicação.
2. **Degradação de Performance e Bloqueio:** Processar milhões de dados simultaneamente monopoliza os recursos de CPU e bloqueia as *threads* de execução, fazendo com que o sistema como um todo sofra lentidão ou pare de responder a outros usuários.
3. **Falta de Resiliência:** Se houver uma falha estrutural no meio do lote, todo o processamento é perdido e o sistema precisa recomeçar do zero.
## 🏗️ Arquitetura e Modelagem de Domínio

Para resolver esse gargalo, a solução foi desenhada com foco em **Eficiência de Memória** e **Isolamento Arquitetural**. O fluxo processa os dados de forma assíncrona ("gota a gota"), enquanto o Domínio da aplicação garante as regras de negócio de forma totalmente isolada da infraestrutura de leitura de arquivos.

![Diagrama de Requisitos e Domínio](./docs/images/diagrama.png) ```