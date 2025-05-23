// Основные функции инициализации
async function loadComponents() {
    try {
        // Загружаем шапку
        const headerResponse = await fetch('header.html');
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();
        
        // Загружаем подвал
        const footerResponse = await fetch('footer.html');
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();
        
        // Загружаем продукты
        const productsResponse = await fetch('products.json');
        const products = await productsResponse.json();
        renderProducts(products);
        
        // Инициализируем функционал
        initCart();
        initSearch();
        initAuth();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError('Не удалось загрузить страницу');
    }
}

// Инициализация корзины
function initCart() {
    updateCartCount();
    
    // Обработчик для кнопок "В корзину"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            e.preventDefault();
            addToCart(e.target.closest('.product-card'));
        }
    });
}

// Добавление товара в корзину
function addToCart(productCard) {
    if (!AuthService.isAuthenticated()) {
        showNotification('Для добавления в корзину войдите в систему', 'error');
        loadAuthModal();
        return;
    }

    const product = {
        id: productCard.dataset.id,
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        image: productCard.querySelector('img').src
    };
    
    CartService.addProduct(product);
    showNotification(`${product.name} добавлен в корзину`);
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = Object.keys(CartService.getCart()).length;
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// Инициализация поиска (упрощенная версия)
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        // Здесь будет логика поиска
    });
}

// Инициализация авторизации
function initAuth() {
    const user = AuthService.getCurrentUser();
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user?.name || 'Гость';
    }
}

// Загрузка модального окна авторизации
async function loadAuthModal() {
    try {
        const modalHtml = await fetch('auth-modal.html');
        document.getElementById('auth-modal-placeholder').innerHTML = await modalHtml.text();
        initAuthModal();
    } catch (error) {
        console.error('Ошибка загрузки модального окна:', error);
    }
}

// Инициализация модального окна
function initAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    
    // Здесь будет логика работы модального окна
}

// Рендер продуктов
function renderProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = Object.entries(products)
        .slice(0, 6)
        .map(([id, product]) => `
            <div class="product-card" data-id="${id}">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <h3>${product.name}</h3>
                <p class="price">${product.price} ₽</p>
                <button class="btn btn-add-to-cart">В корзину</button>
            </div>
        `).join('');
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', loadComponents);