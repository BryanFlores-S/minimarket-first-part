/**
 * Minimarket Frontend Application
 * Architecture: Traditional Spring MVC + Thymeleaf Integration (No REST API / No Fetch)
 * Responsibilities: Real-time search filter, DOM modal management, form binding.
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initialize Client-side Functionalities
 */
function initApp() {
    setupEventListeners();
}

/**
 * Setup Event Listeners for UI Controls
 */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
        searchInput.addEventListener('input', handleRealTimeSearch);
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearchInput);
    }

    // Dismiss modals when ESC key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeCrudModal();
        }
    });
}

/**
 * Perform Client-side Real-time Search Filtering over Rendered Product Cards
 */
function handleRealTimeSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const productCards = document.querySelectorAll('.product-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', query.length === 0);
    }

    productCards.forEach(card => {
        const title = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
        const description = card.getAttribute('data-description') ? card.getAttribute('data-description').toLowerCase() : '';

        if (title.includes(query) || description.includes(query)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    if (emptyState) {
        emptyState.classList.toggle('hidden', visibleCount > 0);
    }
}

/**
 * Clear Search Field and Reset Visibility
 */
function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const productCards = document.querySelectorAll('.product-card');
    const emptyState = document.getElementById('emptyState');

    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');

    productCards.forEach(card => card.classList.remove('hidden'));
    if (emptyState) emptyState.classList.add('hidden');
}

/**
 * Open Detail Modal Window with Selected Product Information
 */
window.openProductModalFromCard = function(element) {
    const productModal = document.getElementById('productModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');

    const name = element.getAttribute('data-name');
    const price = element.getAttribute('data-price');
    const image = element.getAttribute('data-image');
    const description = element.getAttribute('data-description');

    if (modalImg) modalImg.src = image || '/data_minimarket/placeholder.jpg';
    if (modalTitle) modalTitle.textContent = name;
    if (modalPrice) modalPrice.textContent = `$${parseFloat(price).toFixed(2)}`;
    if (modalDescription) modalDescription.textContent = description || 'Sin descripción disponible.';

    if (productModal) {
        productModal.classList.remove('hidden');
        setTimeout(() => productModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Close Product Detail Modal Window
 */
window.closeProductModal = function() {
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.classList.remove('show');
        setTimeout(() => {
            productModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 200);
    }
};

/**
 * Open CRUD Management Modal Window
 */
window.openCrudModal = function() {
    const crudModal = document.getElementById('crudModal');
    const crudModalContent = document.getElementById('crudModalContent');

    if (crudModal && crudModalContent) {
        crudModal.classList.remove('hidden');
        setTimeout(() => crudModalContent.classList.remove('scale-95', 'opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Close CRUD Management Modal Window
 */
window.closeCrudModal = function() {
    const crudModal = document.getElementById('crudModal');
    const crudModalContent = document.getElementById('crudModalContent');

    if (crudModalContent) crudModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        if (crudModal) crudModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetCrudForm();
    }, 200);
};

/**
 * Populate Form Fields for Product Editing (MVC Action)
 */
window.populateEditForm = function(id, name, price, imageUrl, description) {
    const productIdInput = document.getElementById('productId');
    const formNameInput = document.getElementById('formName');
    const formPriceInput = document.getElementById('formPrice');
    const formImageInput = document.getElementById('formImage');
    const formDescriptionInput = document.getElementById('formDescription');

    if (productIdInput) productIdInput.value = id;
    if (formNameInput) formNameInput.value = name;
    if (formPriceInput) formPriceInput.value = price;
    if (formImageInput) formImageInput.value = imageUrl;
    if (formDescriptionInput) formDescriptionInput.value = description;
};

/**
 * Reset CRUD Form Inputs
 */
window.resetCrudForm = function() {
    const productIdInput = document.getElementById('productId');
    const productForm = document.getElementById('productForm');

    if (productIdInput) productIdInput.value = '';
    if (productForm) productForm.reset();
};