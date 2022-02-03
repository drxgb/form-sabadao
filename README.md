# Formulário do SABADÃO DO CENOURÃO

O código apresentado neste repositório mostra como você pode automatizar o seu formulário Google, vinculando-se à sua planilha Google, inserindo todas as entradas enviadas ao formulário. Embora o Google Formulário já possui um sistema que faz esse vínculo, a necessidade deste sistema foi para resolver o retrabalho para definir a formatação dos estados das respostas enviadas ao formulário.

## Como aplicar o script?

Você precisa colocar este script em seu Google Apps Script e alterar o seu `appscript.json` para autorizar as APIs do Google Formulário e Planilhas em sua aplicação. Adicionar este array em seu JSON:

```
"oauthScopes": [
    "https://www.googleapis.com/auth/forms.currentonly",
    "https://www.googleapis.com/auth/forms",
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/spreadsheets"
  ],
```

No arquivo `index.js`, nas duas primeiras linhas, você precisa colocar os IDs do seu formulário e da sua planilha, respectivamente.

```
// Coloque o ID do seu formulário Google no argumento
const form = FormApp.openById('');

// Coloque o ID da sua planilha Google no argumento
const spreadSheet = SpreadsheetApp.openById('');
```

Em seguida, você precisa criar um acionador. Insira um gatilho na função `onSubmit()` toda vez que o formulário receber uma nova resposta.