// Search functionality
let allBooks = [];
let allAuthors = [];
let allArticles = [];

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load data for search
    loadSearchData();
});

// Load data for search functionality
async function loadSearchData() {
    try {
        // Load books data
        const booksResponse = await fetch('../data/livros.json');
        allBooks = await booksResponse.json();

        // Load authors data
        const authorsResponse = await fetch('../data/autores.json');
        allAuthors = await authorsResponse.json();

        // Load articles data
        const articlesResponse = await fetch('../data/artigos.json');
        allArticles = await articlesResponse.json();

        console.log('Search data loaded successfully');
    } catch (error) {
        console.error('Error loading search data:', error);
        // Provide fallback data for demonstration
        loadFallbackData();
    }
}

// Perform search
function performSearch(searchTerm) {
    if (!searchTerm) {
        clearSearchResults();
        return;
    }

    const results = {
        books: searchBooks(searchTerm),
        authors: searchAuthors(searchTerm),
        articles: searchArticles(searchTerm)
    };

    displaySearchResults(results, searchTerm);
}

// Search books
function searchBooks(searchTerm) {
    return allBooks.filter(book => {
        const searchableText = `
            ${book.titulo || ''}
            ${book.autor || ''}
            ${book.categoria || ''}
            ${book.descricao || ''}
            ${book.editora || ''}
        `.toLowerCase();

        return searchableText.includes(searchTerm);
    });
}

// Search authors
function searchAuthors(searchTerm) {
    return allAuthors.filter(author => {
        const searchableText = `
            ${author.nome || ''}
            ${author.biografia || ''}
        `.toLowerCase();

        return searchableText.includes(searchTerm);
    });
}

// Search articles
function searchArticles(searchTerm) {
    return allArticles.filter(article => {
        const searchableText = `
            ${article.titulo || ''}
            ${article.autor || ''}
            ${article.categoria || ''}
            ${article.conteudo || ''}
            ${article.resumo || ''}
        `.toLowerCase();

        return searchableText.includes(searchTerm);
    });
}

// Display search results
function displaySearchResults(results, searchTerm) {
    const searchHints = document.querySelector('.search-hints');
    if (!searchHints) return;

    // Clear previous results
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';

    // Results header
    const totalResults = results.books.length + results.authors.length + results.articles.length;
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-header';
    resultsHeader.innerHTML = `
        <h3>Resultados da busca por "<span class="search-term">${escapeHtml(searchTerm)}</span>"</h3>
        <p class="search-count">${totalResults} resultado${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''}</p>
    `;
    resultsContainer.appendChild(resultsHeader);

    // If no results
    if (totalResults === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.innerHTML = `
            <p>Nenhum resultado encontrado para "<span class="search-term">${escapeHtml(searchTerm)}</span>"</p>
            <p>Tente outros termos ou verifique a digitação.</p>
        `;
        resultsContainer.appendChild(noResults);
    } else {
        // Books results
        if (results.books.length > 0) {
            const booksSection = createSearchSection('Livros', results.books, 'book');
            resultsContainer.appendChild(booksSection);
        }

        // Authors results
        if (results.authors.length > 0) {
            const authorsSection = createSearchSection('Autores', results.authors, 'author');
            resultsContainer.appendChild(authorsSection);
        }

        // Articles results
        if (results.articles.length > 0) {
            const articlesSection = createSearchSection('Artigos', results.articles, 'article');
            resultsContainer.appendChild(articlesSection);
        }
    }

    // Insert results after search input
    searchHints.parentNode.insertBefore(resultsContainer, searchHints.nextSibling);
}

// Create search section for a result type
function createSearchSection(title, items, type) {
    const section = document.createElement('div');
    section.className = 'search-section';

    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    const itemsGrid = document.createElement('div');
    itemsGrid.className = 'search-items-grid';

    items.slice(0, 5).forEach(item => { // Limit to 5 items per type
        const itemElement = createSearchItem(item, type);
        itemsGrid.appendChild(itemElement);
    });

    // Show "view all" link if there are more results
    if (items.length > 5) {
        const viewAll = document.createElement('a');
        viewAll.href = `#`; // Will be implemented based on type
        viewAll.className = 'search-view-all';
        viewAll.textContent = `Ver todos os ${items.length} ${title.toLowerCase()}`;
        section.appendChild(viewAll);
    }

    section.appendChild(itemsGrid);
    return section;
}

// Create search item element
function createSearchItem(item, type) {
    const itemElement = document.createElement('div');
    itemElement.className = `search-item search-item-${type}`;

    switch(type) {
        case 'book':
            itemElement.innerHTML = `
                ${item.capa ? `<img src="../${item.capa}" alt="Capa de ${item.titulo}" class="search-item-image">` : '<div class="search-item-placeholder">Sem capa</div>'}
                <div class="search-item-info">
                    <h4>${escapeHtml(item.titulo)}</h4>
                    <p class="search-item-author">${escapeHtml(item.autor)}</p>
                    ${item.ano ? `<p class="search-item-year">${item.ano}</p>` : ''}
                </div>
            `;
            break;

        case 'author':
            itemElement.innerHTML = `
                ${item.foto ? `<img src="../${item.foto}" alt="Foto de ${item.nome}" class="search-item-image">` : '<div class="search-item-placeholder">Sem foto</div>'}
                <div class="search-item-info">
                    <h4>${escapeHtml(item.nome)}</h4>
                    <p class="search-item-bio">${escapeHtml(item.biografia.substring(0, 100))}...</p>
                </div>
            `;
            break;

        case 'article':
            itemElement.innerHTML = `
                ${item.imagem_destaque ? `<img src="../${item.imagem_destaque}" alt="${item.titulo}" class="search-item-image">` : '<div class="search-item-placeholder">Sem imagem</div>'}
                <div class="search-item-info">
                    <h4>${escapeHtml(item.titulo)}</h4>
                    <p class="search-item-author">${escapeHtml(item.autor)}</p>
                    ${item.data ? `<p class="search-item-date">${formatDate(item.data)}</p>` : ''}
                </div>
            `;
            break;
    }

    return itemElement;
}

// Clear search results
function clearSearchResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }

    const searchHints = document.querySelector('.search-hints');
    if (searchHints) {
        searchHints.innerHTML = '<p>Digite para buscar no acervo</p>';
    }
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Load fallback data for demonstration
function loadFallbackData() {
    // This would be replaced with actual data loading in production
    console.log('Using fallback data for search');

    // Sample books data
    allBooks = [
        {
            id: 1,
            titulo: "Mere Cristianismo",
            autor: "C.S. Lewis",
            ano: 1952,
            categoria: "Teologia",
            editora: "Editora Cultura Cristã",
            paginas: 224,
            descricao: "Uma das obras mais importantes de C.S. Lewis sobre o cristianismo básico.",
            capa: "assets/images/livros/mere-cristianismo.jpg"
        },
        {
            id: 2,
            titulo: "O Purpose Driven Life",
            autor: "Rick Warren",
            ano: 2002,
            categoria: "Vida Cristã",
            editora: "Editora Mundo Cristão",
            paginas: 336,
            descricao: "Um guia de 40 dias para descobrir o propósito de Deus para sua vida.",
            capa: "assets/images/livros/purpose-driven-life.jpg"
        }
    ];

    // Sample authors data
    allAuthors = [
        {
            id: 1,
            nome: "C.S. Lewis",
            biografia: "Clive Staples Lewis foi um escritor irlandês e estudioso de literatura, conhecido por suas obras de ficção cristã e apologética.",
            foto: "assets/images/autores/cs-lewis.jpg"
        },
        {
            id: 2,
            nome: "Rick Warren",
            biografia: "Rick Warren é um pastor cristão americano, autor e fundador da Saddleback Church.",
            foto: "assets/images/autores/rick-warren.jpg"
        }
    ];

    // Sample articles data
    allArticles = [
        {
            id: 1,
            titulo: "Por que ler C.S. Lewis?",
            autor: "João Silva",
            data: "2026-01-15",
            categoria: "Teologia",
            resumo: "Uma introdução às obras de C.S. Lewis e seu impacto na teologia contemporânea.",
            imagem_destaque: "assets/images/artigos/cs-lewis.jpg"
        },
        {
            id: 2,
            titulo: "Como iniciar uma biblioteca cristã?",
            autor: "Maria Oliveira",
            data: "2026-02-01",
            categoria: "Ministério",
            resumo: "Dicas práticas para começar uma biblioteca cristã em sua comunidade ou igreja.",
            imagem_destaque: "assets/images/artigos/biblioteca-crista.jpg"
        }
    ];
}