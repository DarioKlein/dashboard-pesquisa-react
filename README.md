# CardioBench

Dashboard interativo para análise e comparação de algoritmos de aprendizado de máquina aplicados à predição de doença cardíaca.

O projeto apresenta os resultados experimentais obtidos nas bases **Cleveland** e **Kaggle**, permitindo comparar o desempenho, a estabilidade, os erros de classificação e as melhores configurações de quatro algoritmos.

![Prévia do CardioBench](public/og.png)

## Funcionalidades

- Comparação direta entre as bases Cleveland e Kaggle.
- Filtro para visualizar uma base isoladamente ou ambas em conjunto.
- Seleção da métrica utilizada no gráfico principal.
- Análise individual de cada algoritmo.
- Exibição de médias e desvios-padrão das repetições.
- Matrizes de confusão médias.
- Visualização da estabilidade entre as repetições.
- Identificação da melhor configuração de hiperparâmetros.
- Tabela comparativa com destaque para o melhor resultado de cada métrica.
- Geração de uma versão imprimível por meio da opção **Exportar relatório**.
- Interface responsiva para computadores, tablets e dispositivos móveis.

## Algoritmos avaliados

- Árvore de Decisão
- Naive Bayes
- Random Forest
- Support Vector Machine — SVM

## Bases de dados

| Base      | Registros | Característica no dashboard                                                      |
| --------- | --------: | -------------------------------------------------------------------------------- |
| Cleveland |       303 | Base clínica menor, com maior desempenho médio dos modelos                       |
| Kaggle    |    68.610 | Base de maior escala, utilizada para avaliar generalização e custo computacional |

Os resultados apresentados correspondem à média de **três repetições** do processo de validação cruzada.

> A pasta do projeto utiliza o nome histórico `results-clevand` para armazenar os resultados da base Cleveland.

## Métricas apresentadas

| Métrica             | Interpretação                                                                        |
| ------------------- | ------------------------------------------------------------------------------------ |
| Acurácia            | Proporção total de classificações corretas                                           |
| Sensibilidade       | Capacidade de identificar corretamente pacientes com doença                          |
| Especificidade      | Capacidade de identificar corretamente pacientes sem doença                          |
| Precisão            | Proporção de predições positivas que realmente representam doença                    |
| F1-score            | Média harmônica entre precisão e sensibilidade                                       |
| MCC                 | Coeficiente de correlação de Matthews, adequado para avaliar classificações binárias |
| ROC-AUC             | Capacidade do modelo de separar as duas classes em diferentes limiares               |
| Brier score         | Qualidade e calibração das probabilidades previstas; valores menores são melhores    |
| Log loss            | Penalização de previsões probabilísticas incorretas; valores menores são melhores    |
| Acurácia balanceada | Média entre sensibilidade e especificidade                                           |
| Tempo de execução   | Custo computacional médio do treinamento e da avaliação                              |

O símbolo `±` exibido no dashboard representa o **desvio-padrão** entre as repetições.

## Principais resultados

- Na base **Cleveland**, o Naive Bayes apresentou a maior acurácia média: **83,6%**.
- Na base **Kaggle**, o Random Forest apresentou a maior acurácia média: **73,0%**.
- O maior ROC-AUC geral foi obtido pelo Naive Bayes no Cleveland: **90,6%**.
- O algoritmo vencedor muda entre as bases, reforçando que o desempenho depende das características e da escala do conjunto de dados.
- O SVM apresentou custo computacional elevado na base Kaggle quando comparado aos demais algoritmos.

Esses resultados são descritivos e representam exclusivamente os experimentos armazenados na pasta `data`.

## Estrutura dos resultados

Cada combinação de base e algoritmo contém cinco arquivos CSV:

| Arquivo                             | Conteúdo                                                 |
| ----------------------------------- | -------------------------------------------------------- |
| `*_cv_resumo_modelo.csv`            | Média e desvio-padrão das métricas do modelo selecionado |
| `*_cv_resultados_repeticoes.csv`    | Resultado da melhor configuração em cada repetição       |
| `*_cv_resultados_configuracoes.csv` | Resultados de todas as configurações avaliadas           |
| `*_cv_ranking_configuracoes.csv`    | Ranking agregado das configurações de hiperparâmetros    |
| `*_cv_predicoes_oof.csv`            | Predições out-of-fold por registro                       |

O dashboard carrega os arquivos de resumo, ranking e repetições. Os arquivos de predições individuais permanecem disponíveis para análises posteriores, mas não são incluídos no bundle da aplicação.

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS responsivo
- ESLint

Não é utilizada uma API ou um banco de dados durante a execução. Os dados são processados a partir dos arquivos CSV no momento da compilação.

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

### Compilação para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist`.

### Visualizar a compilação

```bash
npm run preview
```

### Verificação de qualidade

```bash
npm run lint
```

## Estrutura do projeto

```text
dashboard-pesquisa/
├── data/
│   ├── results-clevand/
│   └── results-kaggle/
├── public/
├── src/
│   ├── App.tsx       # Componentes e interface do dashboard
│   ├── App.css       # Layout e estilos dos componentes
│   ├── data.ts       # Leitura, normalização e tipagem dos CSVs
│   ├── index.css     # Estilos globais
│   └── main.tsx      # Inicialização da aplicação React
├── index.html
├── package.json
└── vite.config.ts
```

## Observações metodológicas

- As médias e os desvios-padrão são lidos diretamente dos resultados experimentais.
- A melhor configuração de cada algoritmo corresponde à primeira posição do respectivo arquivo de ranking.
- As matrizes de confusão apresentam a média arredondada das três repetições.
- Para acurácia, sensibilidade, especificidade, precisão, F1, MCC e ROC-AUC, valores maiores são melhores.
- Para Brier score, Log loss e tempo de execução, valores menores são melhores.
- Comparações entre Cleveland e Kaggle devem considerar a diferença expressiva de tamanho e distribuição entre as bases.

## Aviso

Este dashboard possui finalidade acadêmica e exploratória. Seus resultados não devem ser interpretados como diagnóstico médico nem utilizados isoladamente em decisões clínicas.
