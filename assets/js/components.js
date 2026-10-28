// Reusable components and UI enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();

    // Initialize mobile menu (if we had one)
    initMobileMenu();

    // Add animation observers
    initAnimationObservers();
});

// Tooltip initialization
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');

            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
            tooltip.style.left = `${rect.left + window.scrollX}px`;

            document.body.appendChild(tooltip);

            // Hide on mouse leave
            const hideTooltip = () => {
                tooltip.remove();
                element.removeEventListener('mouseleave', hideTooltip);
            };

            element.addEventListener('mouseleave', hideTooltip);
        });
    });
}

// Mobile menu initialization (placeholder for future implementation)
function initMobileMenu() {
    // This would be implemented if we add a mobile menu later
    console.log('Mobile menu initialized');
}

// Animation observers for fade-in effects
function initAnimationObservers() {
    const animateElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Uncomment if you want to animate only once
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animate-in');
        });
    }
}

// Filter functionality for catalog page
class BookFilter {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentFilters = {
            category: '',
            author: '',
            yearMin: '',
            yearMax: '',
            sort: 'title-asc'
        };
    }

    async loadBooks() {
        try {
            const response = await fetch('../data/livros.json');
            this.books = await response.json();
            this.filteredBooks = [...this.books];
            return this.books;
        } catch (error) {
            console.error('Error loading books:', error);
            return this.loadFallbackBooks();
        }
    }

    loadFallbackBooks() {
        // Fallback data
        this.books = [
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
            },
            {
                id: 3,
                titulo: "A Cabana",
                autor: "William P. Young",
                ano: 2007,
                categoria: "Ficção Cristã",
                editora: "Editora Arxe",
                paginas: 256,
                descricao: "Uma história emocionante sobre dor, perda e redenção.",
                capa: "assets/images/livros/a-cabana.jpg"
            }
        ];
        this.filteredBooks = [...this.books];
        return this.books;
    }

    applyFilters() {
        let filtered = [...this.books];

        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(book =>
                book.categoria.toLowerCase() === this.currentFilters.category.toLowerCase()
            );
        }

        // Author filter
        if (this.currentFilters.author) {
            filtered = filtered.filter(book =>
                book.autor.toLowerCase().includes(this.currentFilters.author.toLowerCase())
            );
        }

        // Year range filter
        if (this.currentFilters.yearMin) {
            const minYear = parseInt(this.currentFilters.yearMin);
            if (!isNaN(minYear)) {
                filtered = filtered.filter(book => book.ano >= minYear);
            }
        }

        if (this.currentFilters.yearMax) {
            const maxYear = parseInt(this.currentFilters.yearMax);
            if (!isNaN(maxYear)) {
                filtered = filtered.filter(book => book.ano <= maxYear);
            }
        }

        // Apply sorting
        filtered = this.sortBooks(filtered, this.currentFilters.sort);

        this.filteredBooks = filtered;
        return filtered;
    }

    sortBooks(books, sortBy) {
        switch(sortBy) {
            case 'title-asc':
                return [...books].sort((a, b) => a.titulo.localeCompare(b.titulo));
            case 'title-desc':
                return [...books].sort((a, b) => b.titulo.localeCompare(a.titulo));
            case 'year-asc':
                return [...books].sort((a, b) => a.ano - b.ano);
            case 'year-desc':
                return [...books].sort((a, b) => b.ano - a.ano);
            default:
                return [...books];
        }
    }

    setFilter(filterType, value) {
        this.currentFilters[filterType] = value;
        return this.applyFilters();
    }

    getFilteredBooks() {
        return [...this.filteredBooks];
    }
}

// Initialize filter on catalog page
function initCatalogFilter() {
    if (window.location.pathname.includes('catalog.html')) {
        const filter = new BookFilter();

        // Load books and initialize UI
        filter.loadBooks().then(books => {
            renderBooksGrid(books);
            setupFilterControls(filter);
        });
    }
}

// Render books grid
function renderBooksGrid(books) {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;

    if (books.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum livro encontrado com os filtros aplicados.</p>';
        return;
    }

    grid.innerHTML = '';
    books.forEach(book => {
        const bookCard = createBookCardForCatalog(book);
        grid.appendChild(bookCard);
    });
}

// Create book card for catalog page
function createBookCardForCatalog(book) {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
        <div class="book-cover">
            ${book.capa ? `<img src="../${book.capa}" alt="Capa de ${book.titulo}" loading="lazy">` : '<div class="book-cover-placeholder">Sem capa</div>'}
        </div>
        <div class="book-info">
            <h3>${book.titulo}</h3>
            <p class="book-author">${book.autor}</p>
            <div class="book-meta">
                <span class="book-year">${book.ano}</span>
                <span class="book-pages">${book.paginas} pgs</span>
            </div>
        </div>
    `;

    // Make card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
        // Navigate to book detail page
        window.location.href = `book.html?id=${book.id}`;
    });

    return card;
}

// Setup filter controls
function setupFilterControls(filter) {
    // Category filter
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            filter.setFilter('category', this.value);
            renderBooksGrid(filter.getFilteredBooks());
        });
    }

    // Author filter
    const authorInput = document.getElementById('authorFilter');
    if (authorInput) {
        authorInput.addEventListener('input', function() {
            filter.setFilter('author', this.value);
            renderBooksGrid(filter.getFilteredBooks());
        });
    }

    // Year filters
    const yearMinInput = document.getElementById('yearMinFilter');
    const yearMaxInput = document.getElementById('yearMaxFilter');

    if (yearMinInput) {
        yearMinInput.addEventListener('change', function() {
            filter.setFilter('yearMin', this.value);
            renderBooksGrid(filter.getFilteredBooks());
        });
    }

    if (yearMaxInput) {
        yearMaxInput.addEventListener('change', function() {
            filter.setFilter('yearMax', this.value);
            renderBooksGrid(filter.getFilteredBooks());
        });
    }

    // Sort filter
    const sortSelect = document.getElementById('sortFilter');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filter.setFilter('sort', this.value);
            renderBooksGrid(filter.getFilteredBooks());
        });
    }

    // Reset button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset all filter controls
            if (categorySelect) categorySelect.value = '';
            if (authorInput) authorInput.value = '';
            if (yearMinInput) yearMinInput.value = '';
            if (yearMaxInput) yearMaxInput.value = '';
            if (sortSelect) sortSelect.value = 'title-asc';

            // Reset filter object
            filter.currentFilters = {
                category: '',
                author: '',
                yearMin: '',
                yearMax: '',
                sort: 'title-asc'
            };

            // Re-render with all books
            filter.loadBooks().then(books => {
                renderBooksGrid(books);
            });
        });
    }
}

// Initialize catalog filter when DOM is loaded
document.addEventListener('DOMContentLoaded', initCatalogFilter);

// Utility function to create loading skeleton
function createLoadingSkeleton() {
    return `
        <div class="loading-skeleton">
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
        </div>
    `;
}