# DINEIX — versão estática (HTML/CSS/JS puro)

Conversão do site (antes Vite + React + FastAPI + MongoDB) para HTML, CSS e
JavaScript puros — sem build, sem servidor, sem banco de dados. Mesma
estrutura, mesmas seções, mesmo texto e as mesmas interações.

## Arquivos

- `index.html` — toda a estrutura da página (header, hero, portfólio,
  serviços, calculadora de orçamento, processo, contato, rodapé e os dois
  modais: detalhe do projeto e experiência guiada)
- `styles.css` — todo o visual (cores, tipografia, layout, responsivo)
- `script.js` — toda a interatividade:
  - menu mobile
  - alternância de tema claro/escuro
  - animação de revelar ao rolar a página
  - filtro de categorias do portfólio
  - modal de detalhe do projeto (abre ao clicar num card)
  - modal de "experiência guiada" (3 perguntas)
  - calculadora de investimento (slider + escolha de estilo)
  - formulário de contato (mostra uma notificação — não envia e-mail de verdade)
  - notificações (toasts) no canto da tela

## Como rodar

Não precisa de nada instalado. Basta abrir `index.html` no navegador, ou
subir os 3 arquivos em qualquer hospedagem estática (Hostinger, GitHub Pages,
Netlify, Vercel etc.) — são só arquivos, sem servidor por trás.

## O que ficou de fora

- O backend (FastAPI) e o banco de dados (MongoDB) não são mais necessários:
  nenhuma funcionalidade real da página dependia deles (o formulário de
  contato já era só uma simulação com notificação, não enviava nada).
- Se um dia você quiser que o formulário de contato envie e-mails de
  verdade, dá pra ligar `script.js` a um serviço tipo Formspree ou EmailJS
  sem precisar reintroduzir um backend próprio.
