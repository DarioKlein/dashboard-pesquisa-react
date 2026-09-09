# CardioBench

Dashboard React para análise de classificadores aplicados à predição de doença cardíaca. A interface mantém duas etapas experimentais separadas, preservando as unidades de agregação e as limitações metodológicas de cada análise.

![Prévia do CardioBench](public/og.png)

## Etapas experimentais

### 1. Etapa exploratória

- Bases Cleveland e Kaggle.
- Validação cruzada estratificada com 5 partições e 3 repetições.
- Comparação descritiva de quatro algoritmos.
- Resumos agregados por 3 repetições OOF.
- Matriz de confusão média, estabilidade por repetição e configuração selecionada.
- Resultados sujeitos a otimismo de seleção, pois seleção e resumo usam as mesmas avaliações.

### 2. Avaliação complementar — Cleveland

- Somente a base Cleveland, com os mesmos 303 registros da etapa exploratória.
- Validação cruzada aninhada com 5 partições externas, 3 repetições e 3 partições internas.
- Seleção de hiperparâmetros nos dados internos e avaliação em testes externos reservados.
- Resumos agregados por 15 folds externos, apresentados como média ± desvio-padrão.
- 909 predições OOF no total: 303 registros × 3 repetições.
- Matrizes de confusão exatas por repetição (R1, R2 e R3), cada uma somando 303 observações.
- Frequência das configurações selecionadas nos 15 treinamentos externos.
- Tempos separados em seleção, reajuste, predição e total por fold externo.
- Comparações pareadas de MCC com correção para reamostragem e ajuste de Holm.

A avaliação complementar não é validação em uma população externa independente. A base Kaggle permanece apenas na etapa exploratória por viabilidade computacional.

## Algoritmos

- Árvore de Decisão
- Naive Bayes
- Random Forest
- SVM linear

## Métricas

O MCC é a medida principal e aparece selecionado por padrão. A acurácia continua disponível como medida complementar.

| Métrica | Apresentação | Melhor direção |
| --- | --- | --- |
| Acurácia, sensibilidade, especificidade, precisão, F1, ROC-AUC e acurácia balanceada | Percentual | Maior |
| MCC | Coeficiente de −1 a 1 | Maior |
| Brier score | Escala numérica observada | Menor |
| Log loss | Escala numérica observada, sem limite superior fixo em 1 | Menor |
| Tempos | Segundos com escala log10 no gráfico | Menor |

Os cartões e destaques identificam a maior ou menor **média observada** conforme a métrica. Eles não indicam superioridade global nem diferença estatisticamente significativa.

## Inferência da etapa complementar

A seção inferencial usa exclusivamente os arquivos exportados pelo experimento complementar:

- `mcc_comparacoes_pareadas.csv`;
- `mcc_decisao_global.csv`;
- `validacao_resultados.csv`.

São exibidas seis comparações bilaterais de MCC, com 14 graus de liberdade e p-valor ajustado por Holm. A decisão usa o valor integral exportado, não o número arredondado na tela. Nos resultados atuais, nenhuma das seis comparações é significativa a 5%; portanto, a hipótese nula não foi rejeitada. Isso não demonstra equivalência entre os modelos.

Se os arquivos estiverem ausentes, incompletos ou marcados como inválidos, o dashboard informa que a análise está indisponível e não produz conclusão inferencial.

## Estrutura dos dados

```text
data/
├── results-clevand/             # etapa exploratória · Cleveland
├── results-kaggle/              # etapa exploratória · Kaggle
└── results-clevand-additional/  # validação aninhada · Cleveland
```

Na etapa exploratória, o dashboard lê os arquivos de resumo, ranking e resultados por repetição. Na etapa complementar, lê os resumos do modelo, resultados por fold externo, resultados OOF por repetição, frequências e configurações selecionadas. As duas etapas são normalizadas separadamente em `src/data/results.ts` e nunca são combinadas em uma média global.

## Arquitetura

O projeto é organizado por responsabilidade:

- `components/`: componentes React agrupados por funcionalidade;
- `data/`: catálogo do domínio, tipos, parser CSV e carregamento dos resultados;
- `lib/`: cálculos, formatação, escalas e validações reutilizáveis;
- `styles/`: tokens visuais e folhas de estilo por contexto;
- `App.tsx`: estado da tela e composição das seções.

Os componentes não leem CSVs diretamente. A camada de dados normaliza as exportações, enquanto a camada `lib` concentra regras reutilizáveis em módulos de seleção, formatação, escalas, configurações e validação inferencial.

## Funcionalidades

- Alternância explícita entre as duas etapas.
- Comparação algoritmo por algoritmo e seleção de métrica.
- Escalas coerentes com cada tipo de medida.
- Barras de desvio-padrão para métricas preditivas.
- Perfil detalhado por classificador.
- Matrizes de confusão e séries de estabilidade.
- Tabela das dez métricas preditivas.
- Custo computacional separado na etapa complementar.
- Tabela inferencial com os seis pares e decisão global.
- Relatório imprimível com identificação da etapa, base e unidade de resumo.
- Layout responsivo para computadores, tablets e celulares.

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS responsivo
- ESLint

Não há API ou banco de dados em execução. Os CSVs locais são incorporados e processados durante a compilação.

## Como executar

Pré-requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

O Vite informa o endereço local, normalmente `http://localhost:5173`.

Comandos adicionais:

```bash
npm run lint      # análise estática
npm run build     # compilação de produção em dist/
npm run preview   # prévia local da compilação
```

## Estrutura do projeto

```text
dashboard-pesquisa/
├── data/
├── public/
├── src/
│   ├── components/
│   │   ├── comparison/
│   │   ├── inference/
│   │   ├── layout/
│   │   ├── methodology/
│   │   ├── metrics/
│   │   ├── models/
│   │   ├── summary/
│   │   └── ui/
│   ├── data/
│   │   ├── catalog.ts
│   │   ├── csv.ts
│   │   ├── results.ts
│   │   └── types.ts
│   ├── lib/
│   │   ├── chart.ts
│   │   ├── configuration.ts
│   │   ├── formatters.ts
│   │   ├── inference.ts
│   │   ├── selectors.ts
│   │   └── dashboard.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── layout.css
│   │   ├── comparison.css
│   │   └── ...
│   ├── App.tsx       # estado e composição da tela
│   ├── index.css     # reset e estilos globais
│   └── main.tsx      # inicialização do React
├── index.html
├── package.json
└── vite.config.ts
```

## Aviso

O CardioBench tem finalidade acadêmica. Os resultados não constituem diagnóstico médico e não devem ser usados isoladamente em decisões clínicas.
