// Data loader for different pages
document.addEventListener('DOMContentLoaded', function() {
    // Load data based on current page
    const path = window.location.pathname;

    if (path.includes('catalog.html') || path.endsWith('/') || path === '/index.html') {
        loadCatalogData();
    } else if (path.includes('authors.html')) {
        loadAuthorsData();
    } else if (path.includes('articles.html')) {
        loadArticlesData();
    } else if (path.includes('book.html')) {
        loadBookDetail();
    } else if (path.includes('author.html')) {
        loadAuthorDetail();
    } else if (path.includes('article.html')) {
        loadArticleDetail();
    }
});

// Load catalog data (for home page and catalog page)
async function loadCatalogData() {
    try {
        // Load featured books for home page
        const featuredResponse = await fetch('../data/recomendados.json');
        const featuredBooks = await featuredResponse.json();

        // Load new arrivals
        const newArrivalsResponse = await fetch('../data/livros.json');
        const allBooks = await newArrivalsResponse.json();
        const newArrivals = allBooks.slice(0, 8); // First 8 as new arrivals

        // Load categories
        const categoriesResponse = await fetch('../data/categorias.json');
        const categories = await categoriesResponse.json();

        // Load featured authors
        const authorsResponse = await fetch('../data/autores.json');
        const allAuthors = await authorsResponse.json();
        const featuredAuthors = allAuthors.slice(0, 6); // First 6 as featured

        // Populate home page sections
        if (featuredBooks.length > 0) {
            populateFeaturedBooks(featuredBooks);
        }

        if (newArrivals.length > 0) {
            populateNewArrivals(newArrivals);
        }

        if (categories.length > 0) {
            populateCategories(categories);
        }

        if (featuredAuthors.length > 0) {
            populateFeaturedAuthors(featuredAuthors);
        }

        // Update statistics
        updateStatistics(allBooks.length, allAuthors.length, categories.length, 0); // Articles count would come from artigos.json

    } catch (error) {
        console.error('Error loading catalog data:', error);
        loadFallbackCatalogData();
    }
}

// Load authors data
async function loadAuthorsData() {
    try {
        const response = await fetch('../data/autores.json');
        const authors = await response.json();
        populateAuthorsList(authors);
    } catch (error) {
        console.error('Error loading authors data:', error);
        loadFallbackAuthorsData();
    }
}

// Load articles data
async function loadArticlesData() {
    try {
        const response = await fetch('../data/artigos.json');
        const articles = await response.json();
        populateArticlesList(articles);
    } catch (error) {
        console.error('Error loading articles data:', error);
        loadFallbackArticlesData();
    }
}

// Load book detail
async function loadBookDetail() {
    try {
        // In a real implementation, we would get the book ID from URL parameters
        // For now, we'll load a sample book
        const response = await fetch('../data/livros.json');
        const books = await response.json();
        if (books.length > 0) {
            populateBookDetail(books[0]); // Show first book as example
        }
    } catch (error) {
        console.error('Error loading book detail:', error);
        loadFallbackBookDetail();
    }
}

// Load author detail
async function loadAuthorDetail() {
    try {
        const response = await fetch('../data/autores.json');
        const authors = await response.json();
        if (authors.length > 0) {
            populateAuthorDetail(authors[0]); // Show first author as example
        }
    } catch (error) {
        console.error('Error loading author detail:', error);
        loadFallbackAuthorDetail();
    }
}

// Load article detail
async function loadArticleDetail() {
    try {
        const response = await fetch('../data/artigos.json');
        const articles = await response.json();
        if (articles.length > 0) {
            populateArticleDetail(articles[0]); // Show first article as example
        }
    } catch (error) {
        console.error('Error loading article detail:', error);
        loadFallbackArticleDetail();
    }
}

// Populate featured books on home page
function populateFeaturedBooks(books) {
    const grid = document.getElementById('featuredBooksGrid');
    if (!grid) return;

    grid.innerHTML = '';
    books.slice(0, 4).forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
}

// Populate new arrivals on home page
function populateNewArrivals(books) {
    const grid = document.getElementById('newArrivalsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    books.slice(0, 4).forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
}

// Populate categories on home page
function populateCategories(categories) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    categories.slice(0, 6).forEach(category => {
        const categoryCard = createCategoryCard(category);
        grid.appendChild(categoryCard);
    });
}

// Populate featured authors on home page
function populateFeaturedAuthors(authors) {
    const grid = document.getElementById('featuredAuthorsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    authors.slice(0, 4).forEach(author => {
        const authorCard = createAuthorCard(author);
        grid.appendChild(authorCard);
    });
}

// Populate authors list on authors page
function populateAuthorsList(authors) {
    const grid = document.getElementById('authorsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    authors.forEach(author => {
        const authorCard = createAuthorCard(author, true); // Full card for authors page
        grid.appendChild(authorCard);
    });

    // Show message if no authors
    if (authors.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum autor encontrado.</p>';
    }
}

// Populate articles list on articles page
function populateArticlesList(articles) {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        grid.appendChild(articleCard);
    });

    // Show message if no articles
    if (articles.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum artigo encontrado.</p>';
    }
}

// Populate book detail page
function populateBookDetail(book) {
    const detailContainer = document.getElementById('bookDetail');
    if (!detailContainer) return;

    detailContainer.innerHTML = createBookDetailTemplate(book);
}

// Populate author detail page
function populateAuthorDetail(author) {
    const detailContainer = document.getElementById('authorDetail');
    if (!detailContainer) return;

    detailContainer.innerHTML = createAuthorDetailTemplate(author);
}

// Populate article detail page
function populateArticleDetail(article) {
    const detailContainer = document.getElementById('articleDetail');
    if (!detailContainer) return;

    detailContainer.innerHTML = createArticleDetailTemplate(article);
}

// Update statistics
function updateStatistics(bookCount, authorCount, categoryCount, articleCount) {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = bookCount.toLocaleString('pt-BR');
        stats[1].textContent = authorCount.toLocaleString('pt-BR');
        stats[2].textContent = categoryCount.toLocaleString('pt-BR');
        stats[3].textContent = articleCount.toLocaleString('pt-BR');
    }
}

// Create book card element
function createBookCard(book, showDetails = false) {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
        <div class="book-cover">
            ${book.capa ? `<img src="../${book.capa}" alt="Capa de ${book.titulo}" loading="lazy">` : '<div class="book-cover-placeholder">Sem capa</div>'}
        </div>
        <div class="book-info">
            <h3>${book.titulo}</h3>
            <p class="book-author">${book.autor}</p>
            ${showDetails ? `
                <p class="book-category">${book.categoria}</p>
                <p class="book-year"><strong>Ano:</strong> ${book.ano}</p>
                <p class="book-pages"><strong>Páginas:</strong> ${book.paginas}</p>
                <p class="book-publisher"><strong>Editora:</strong> ${book.editora}</p>
            ` : ''}
            ${!showDetails && book.ano ? `<div class="book-meta"><span class="book-year">${book.ano}</span><span class="book-pages">${book.paginas} pgs</span></div>` : ''}
        </div>
    `;

    // Add click listener for detail page (if not on detail page already)
    if (!showDetails && !window.location.pathname.includes('book.html')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            // In a real implementation, we would navigate to book.html?id=${book.id}
            // For demo, we'll just show an alert
            alert(`Visualizando detalhes do livro: ${book.titulo}`);
        });
    }

    return card;
}

// Create category card element
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
        <div class="category-icon">${category.icone || '📚'}</div>
        <h3>${category.nome}</h3>
        <p>${category.livros_count} livros</p>
    `;

    return card;
}

// Create author card element
function createAuthorCard(author, isListPage = false) {
    const card = document.createElement('div');
    card.className = 'author-card';

    card.innerHTML = `
        <div class="author-avatar">
            ${author.foto ? `<img src="../${author.foto}" alt="Foto de ${author.nome}" loading="lazy">` : '<div class="author-avatar-placeholder">Sem foto</div>'}
        </div>
        <h3>${author.nome}</h3>
        ${!isListPage ? `<p class="author-bio">${author.biografia.substring(0, 100)}...</p>` : ''}
        <p class="author-stats">${author.livros_count || 0} livros</p>
    `;

    return card;
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    card.innerHTML = `
        ${article.imagem_destaque ? `<img src="../${article.imagem_destaque}" alt="${article.titulo}" loading="lazy">` : '<div class="article-placeholder">Sem imagem</div>'}
        <div class="article-info">
            <h3>${article.titulo}</h3>
            <p class="article-author">${article.autor}</p>
            <p class="article-date">${formatDate(article.data)}</p>
            <p class="article-excerpt">${article.resumo || article.conteudo.substring(0, 100) + '...'}</p>
            <span class="article-category">${article.categoria}</span>
        </div>
    `;

    return card;
}

// Create book detail template
function createBookDetailTemplate(book) {
    return `
        <div class="book-detail">
            <div class="book-detail-header">
                <div class="book-detail-cover">
                    ${book.capa ? `<img src="../${book.capa}" alt="Capa de ${book.titulo}">` : '<div class="book-detail-placeholder">Sem capa disponível</div>'}
                </div>
                <div class="book-detail-info">
                    <h1>${book.titulo}</h1>
                    <p class="book-detail-author">por ${book.autor}</p>
                    <div class="book-detail-meta">
                        <span><strong>Ano:</strong> ${book.ano}</span>
                        <span><strong>Páginas:</strong> ${book.paginas}</span>
                        <span><strong>Categoria:</strong> ${book.categoria}</span>
                        <span><strong>Editora:</strong> ${book.editora}</span>
                    </div>
                </div>
            </div>

            <div class="book-detail-description">
                <h2>Sobre o livro</h2>
                <p>${book.descricao}</p>
            </div>

            <div class="book-detail-author-bio">
                <h2>Sobre o autor</h2>
                <p>${book.autor_bio || 'Biografia não disponível.'}</p>
            </div>

            <div class="book-detail-related">
                <h2>Livros relacionados</h2>
                <div class="related-books-grid">
                    <!-- Related books would be loaded here -->
                    <p>Livros relacionados serão exibidos aqui.</p>
                </div>
            </div>
        </div>
    `;
}

// Create author detail template
function createAuthorDetailTemplate(author) {
    return `
        <div class="author-detail">
            <div class="author-detail-header">
                <div class="author-detail-avatar">
                    ${author.foto ? `<img src="../${author.foto}" alt="Foto de ${author.nome}">` : '<div class="author-detail-placeholder">Sem foto disponível</div>'}
                </div>
                <div class="author-detail-info">
                    <h1>${author.nome}</h1>
                    <p class="author-detail-bio">${author.biografia}</p>
                    <p class="author-detail-stats"><strong>${author.livros_count || 0}</strong> livros no acervo</p>
                </div>
            </div>

            <div class="author-detail-books">
                <h2>Obras do autor</h2>
                <div class="author-books-grid">
                    <!-- Author's books would be loaded here -->
                    <p>Obras deste autor serão exibidas aqui.</p>
                </div>
            </div>
        </div>
    `;
}

// Create article detail template
function createArticleDetailTemplate(article) {
    return `
        <div class="article-detail">
            <div class="article-detail-header">
                ${article.imagem_destaque ? `<img src="../${article.imagem_destaque}" alt="${article.titulo}" class="article-detail-image">` : '<div class="article-detail-placeholder">Sem imagem disponível</div>'}
                <div class="article-detail-info">
                    <h1>${article.titulo}</h1>
                    <p class="article-detail-author">por ${article.autor}</p>
                    <p class="article-detail-date">${formatDate(article.data)}</p>
                    <span class="article-detail-category">${article.categoria}</span>
                    <p class="article-detail-reading-time">${article.tempo_leitura || '5 min read'}</p>
                </div>
            </div>

            <div class="article-detail-content">
                <h2>Resumo</h2>
                <p>${article.resumo}</p>

                <h2>Conteúdo</h2>
                <div class="article-detail-body">
                    ${article.conteudo}
                </div>
            </div>

            <div class="article-detail-related">
                <h2>Artigos relacionados</h2>
                <div class="related-articles-grid">
                    <!-- Related articles would be loaded here -->
                    <p>Artigos relacionados serão exibidos aqui.</p>
                </div>
            </div>
        </div>
    `;
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Fallback data loading functions (similar to search.js)
function loadFallbackCatalogData() {
    console.log('Using fallback catalog data');
    // Would implement fallback data similar to search.js
}

function loadFallbackAuthorsData() {
    console.log('Using fallback authors data');
}

function loadFallbackArticlesData() {
    console.log('Using fallback articles data');
}

function loadFallbackBookDetail() {
    console.log('Using fallback book detail');
}

function loadFallbackAuthorDetail() {
    console.log('Using fallback author detail');
}

function loadFallbackArticleDetail() {
    console.log('Using fallback article detail');
}