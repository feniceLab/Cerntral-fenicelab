# fonts/ — Fontes auto-hospedadas

Setup pronto para servir as fontes da Fenice **localmente** (produção/offline), em vez do CDN do Google. O `fonts.css` já tem todos os `@font-face` com os nomes de família corretos (Fraunces, Inter, JetBrains Mono) — **só faltam os arquivos `.woff2`** nesta pasta.

> ⚠️ **Por que os binários não vêm prontos:** não consigo baixar arquivos de fonte binários neste ambiente. Tudo está cabeado; é um passo de "arrastar e soltar" pra você ou pro Claude Code. Enquanto não fizer isso, mantenha o `@import` do Google que já está em `colors_and_type.css` (funciona online).

## Famílias e pesos usados
| Família | Pesos | Licença |
|---|---|---|
| **Fraunces** | 400, 600, 900, *900 italic* | SIL OFL 1.1 (livre p/ auto-hospedar) |
| **Inter** | 400, 500, 600, 700, 800 | SIL OFL 1.1 |
| **JetBrains Mono** | 400, 600 | SIL OFL 1.1 |

## Como obter os `.woff2` (jeito fácil)
1. Acesse o **google-webfonts-helper**: <https://gwfh.mranftl.com/fonts>
2. Busque cada família (Fraunces, Inter, JetBrains Mono), selecione os pesos da tabela acima, charset **latin** (+ latin-ext se quiser acentos raros), formato **woff2**.
3. Baixe e renomeie os arquivos exatamente como o `fonts.css` espera:
   ```
   fraunces-400.woff2   fraunces-600.woff2   fraunces-900.woff2   fraunces-900-italic.woff2
   inter-400.woff2  inter-500.woff2  inter-600.woff2  inter-700.woff2  inter-800.woff2
   jetbrainsmono-400.woff2   jetbrainsmono-600.woff2
   ```
4. Solte todos aqui em `fonts/`.

> Fraunces é uma fonte variável — o gwfh entrega instâncias estáticas nos pesos pedidos, que é o que o `fonts.css` referencia.

## Como ativar
No HTML, troque a fonte do Google pelo arquivo local:
```html
<!-- antes (CDN, em colors_and_type.css via @import) -->
<!-- depois: -->
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="colors_and_type.css">
```
Ou, para auto-hospedar de vez, remova a linha `@import url('https://fonts.googleapis.com…')` do topo de `colors_and_type.css` e passe a incluir `fonts/fonts.css` antes dele. Os nomes de família não mudam — nada mais no CSS precisa ser tocado.

## Fallbacks (já no CSS)
Se um peso faltar, a stack degrada com elegância: Fraunces → Georgia/serif · Inter → system-ui/sans-serif · JetBrains Mono → ui-monospace.
