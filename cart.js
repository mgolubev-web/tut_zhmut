// cart.js

// Инициализация корзины
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли уже корзина в localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Обработчики для кнопок "В корзину"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            addToCart(productId);
        }
    });
});

// Функция добавления в корзину
function addToCart(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products[productId];
            if (!product) throw new Error('Product not found');
            
            const cart = JSON.parse(localStorage.getItem('cart'));
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} добавлен в корзину`);
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showError('Не удалось добавить товар в корзину');
        });
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}