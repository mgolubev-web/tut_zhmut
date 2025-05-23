class SearchService {
    constructor() {
        this.searchData = [];
        this.initSearchData();
    }

    async initSearchData() {
        try {
            const response = await fetch('products.json');
            const products = await response.json();
            this.searchData = Object.values(products).map(product => ({
                title: product.name,
                url: `product.html?id=${product.id}`,
                description: product.description?.substring(0, 100) + '...' || '',
                image: product.image
            }));
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (!query.trim()) {
            resultsContainer.style.display = 'none';
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        this.displayResults(results, resultsContainer);
    }

    displayResults(results, container) {
        container.innerHTML = results.length ? 
            results.slice(0, 5).map(item => `
                <div class="search-result-item">
                    <a href="${item.url}">
                        <div class="search-result-content">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="search-result-image">` : ''}
                            <div>
                                <h4>${item.title}</h4>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `).join('') :
            '<div class="no-results">Ничего не найдено</div>';

        container.style.display = 'block';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const searchService = new SearchService();
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (!searchInput || !searchButton) return;

    searchInput.addEventListener('input', (e) => {
        searchService.performSearch(e.target.value);
    });

    searchButton.addEventListener('click', () => {
        searchService.performSearch(searchInput.value);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            const results = document.getElementById('search-results');
            if (results) results.style.display = 'none';
        }
    });
});