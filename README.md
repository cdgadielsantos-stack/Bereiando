# Bereiando - Catálogo Digital Cristão

Bereiando é um projeto de uma igreja local voltado à disseminação da leitura cristã. Funciona como um catálogo digital do acervo de livros recebidos por doação.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- JSON (para armazenamento de dados)

Não utiliza frameworks, bibliotecas ou backend - tudo funciona abrindo o `index.html` em qualquer navegador moderno ou com Live Server.

## Estrutura do Projeto

```
bereiando/
├── index.html                # Página inicial
├── pages/
│   ├── catalog.html          # Catálogo de livros
│   ├── authors.html          # Lista de autores
│   ├── articles.html         # Artigos e estudos
│   ├── book.html             # Detalhes de um livro
│   ├── author.html           # Detalhes de um autor
│   └── article.html          # Detalhes de um artigo
├── assets/
│   ├── css/
│   │   └── style.css         # Estilos principais
│   ├── js/
│   │   ├── main.js           # Funcionalidades principais
│   │   ├── search.js         # Sistema de busca
│   │   ├── data-loader.js    # Carregamento de dados JSON
│   │   └── components.js     # Componentes reutilizáveis
│   ├── images/
│   │   ├── livros/           # Capas dos livros
│   │   ├── autores/          # Fotos dos autores
│   │   └── artigos/          # Imagens em destaque dos artigos
│   └── logo/                 # Logotipo e favicon
├── data/
│   ├── livros.json           # Dados dos livros
│   ├── autores.json          # Dados dos autores
│   ├── categorias.json       # Dados das categorias
│   ├── artigos.json          # Dados dos artigos
│   └── recomendados.json     # Livros recomendados (home page)
└── README.md                 # Este arquivo
```

## Como Executar

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
   - Ou use uma extensão como Live Server no VSCode para melhor experiência
3. Navegue pelo site usando o menu superior

## Como Adicionar Conteúdo

### Livros
1. Edite o arquivo `data/livros.json`
2. Adicione um objeto seguindo o formato existente:
   ```json
   {
     "id": 15,
     "titulo": "Novo Livro",
     "autor": "Nome do Autor",
     "ano": 2023,
     "categoria": "Teologia",
     "editora": "Nome da Editora",
     "paginas": 250,
     "descricao": "Descrição do livro",
     "capa": "assets/images/livros/nome-da-imagem.jpg",
     "autor_bio": "Breve biografia do autor (opcional)",
     "relacionados": [1, 2, 3] // IDs de livros relacionados (opcional)
   }
   ```
3. Salve o arquivo e coloque a imagem da capa em `assets/images/livros/`

### Autores
1. Edite o arquivo `data/autores.json`
2. Adicione um objeto seguindo o formato existente:
   ```json
   {
     "id": 12,
     "nome": "Nome do Autor",
     "biografia": "Biografia detalhada do autor",
     "foto": "assets/images/autores/nome-da-foto.jpg",
     "livros_count": 5
   }
   ```
3. Salve o arquivo e coloque a foto em `assets/images/autores/`

### Artigos
1. Edite o arquivo `data/artigos.json`
2. Adicione um objeto seguindo o formato existente:
   ```json
   {
     "id": 6,
     "titulo": "Novo Artigo",
     "autor": "Nome do Autor",
     "data": "2026-10-15",
     "categoria": "Teologia",
     "resumo": "Resumo do artigo",
     "conteudo": "<p>Conteúdo completo do artigo em HTML</p>",
     "imagem_destaque": "assets/images/artigos/nome-da-imagem.jpg",
     "tempo_leitura": "8 min read"
   }
   ```
3. Salve o arquivo e coloque a imagem em `assets/images/artigos/`

### Categorias
1. Edite o arquivo `data/categorias.json`
2. Adicione ou modifique categorias conforme necessário

## Como Alterar a Logo

1. Substitua o arquivo `assets/logo/bereiando-logo.png` pela nova logo
2. Atualize o favicon em `assets/logo/favicon.ico` se desejar
3. O sistema já está configurado para usar esses arquivos automaticamente

## Como Alterar as Cores do Sistema

As cores estão definidas no arquivo `assets/css/style.css` na seção `:root`:

```css
:root {
    /* Color Palette */
    --primary: #F97316;           /* Cor principal */
    --primary-hover: #EA580C;     /* Cor principal no hover */
    --secondary: #FDBA74;         /* Cor de apoio */
    --background-main: #FFFDF7;   /* Fundo principal */
    --background-secondary: #F8F5EE; /* Fundo secundário */
    --text-dark: #1F2937;         /* Texto escuro */
    --text-light: #6B7280;        /* Texto claro */
    --institutional: #1E3A5F;     /* Cor institucional */
    --white: #FFFFFF;             /* Branco */
    /* ... outras variáveis ... */
}
```

Para alterar as cores, modifique os valores das variáveis CSS acima.

## Funcionalidades

- Busca em tempo real por livros, autores e artigos
- Filtros por categoria, autor e ano de publicação
- Ordenação por título (A-Z/Z-A) e ano (mais antigos/mais recentes)
- Design responsivo (mobile-first)
- Acessibilidade (navegação por teclado, aria-labels, contraste adequado)
- Lazy loading de imagens
- Transições suaves e microinterações
- Páginas de detalhe para livros, autores e artigos
- Seção de artigos e estudos
- Estatísticas do acervo
- Versículo destacado na homepage (Atos 17:11)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md para detalhes.

© 2026 Bereiando. Todos os direitos reservados.