/**
 * Minimarket Frontend Application
 * Architecture: Vanilla JS + REST API Integration
 * Language Rules: English Code / Internationalization Support (ES - EN)
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Configurations
    const API_BASE_URL = '/api/products';
    
    // Pagination & Infinite Scroll State
    let allProducts = [];
    let filteredProducts = [];
    let currentPage = 1;
    const itemsPerPage = 8;
    let isLoading = false;
    let hasMoreData = true;

    // Internationalization Translations Dictionary
    const translations = {
        es: {
            catalogTitle: "Productos Populares",
            searchPlaceholder: "Buscar productos...",
            noProducts: "No se encontraron productos.",
            descriptionLabel: "Descripción",
            currencySymbol: "$",
            fromPrefix: "Precio: ",
            seeMore: "... ver más",
            seeLess: "ver menos"
        },
        en: {
            catalogTitle: "Popular Products",
            searchPlaceholder: "Search products...",
            noProducts: "No products found.",
            descriptionLabel: "Description",
            currencySymbol: "$",
            fromPrefix: "Price: ",
            seeMore: "... see more",
            seeLess: "see less"
        }
    };

    let currentLanguage = 'es'; // Default Language for Ecuador

    // DOM Elements Reference
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const langSelect = document.getElementById('langSelect');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const emptyState = document.getElementById('emptyState');
    const productModal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Modal Details Elements
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');

    /**
     * Initialize Application Data and Event Listeners
     */
    async function initApp() {
        setupEventListeners();
        await fetchAllProducts();
    }

    /**
     * Attach Global Event Listeners
     */
    function setupEventListeners() {
        // Real-Time Search Event with Debounce
        searchInput.addEventListener('input', handleSearchInput);
        
        // Clear Search Button Event
        clearSearchBtn.addEventListener('click', clearSearch);

        // Language Selector Switcher
        langSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            applyTranslations();
            renderProductGrid(true);
        });

        // Infinite Scroll Listener
        window.addEventListener('scroll', handleInfiniteScroll);

        // Modal Dismissal Listeners
        closeModalBtn.addEventListener('click', closeModal);
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !productModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    /**
     * Fetch All Products from Spring Boot REST API
     */
    async function fetchAllProducts() {
        try {
            showSpinner(true);
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            allProducts = await response.json();
            filteredProducts = [...allProducts];
            
            renderProductGrid(true);
        } catch (error) {
            console.error('Failed to fetch products from backend:', error);
            showEmptyState(true);
        } finally {
            showSpinner(false);
        }
    }

    /**
     * Handle Instant Search Input (Filtering)
     */
    function handleSearchInput(e) {
        const query = e.target.value.toLowerCase().trim();

        if (query.length > 0) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }

        // Instant In-Memory Filter
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            (product.description && product.description.toLowerCase().includes(query))
        );

        // Reset Pagination State and Re-render
        currentPage = 1;
        hasMoreData = true;
        renderProductGrid(true);
    }

    /**
     * Reset Search Input State
     */
    function clearSearch() {
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        filteredProducts = [...allProducts];
        currentPage = 1;
        hasMoreData = true;
        renderProductGrid(true);
    }

    /**
     * Truncate long descriptions and append "... see more" link
     * @param {string} description - Raw description text
     * @param {number} maxLength - Character threshold limit
     * @returns {string} Formatted HTML string
     */
    function formatShortDescription(description, maxLength = 60) {
        if (!description) return '';
        if (description.length <= maxLength) {
            return description;
        }

        const truncatedText = description.substring(0, maxLength).trim();
        const seeMoreText = translations[currentLanguage].seeMore;

        return `${truncatedText} <span class="text-emerald-600 font-semibold cursor-pointer hover:underline">${seeMoreText}</span>`;
    }

    /**
     * Render Product Cards into Responsive Grid with Pagination/Infinite Load
     * @param {boolean} resetGrid - If true, clears grid before rendering
     */
    function renderProductGrid(resetGrid = false) {
        if (resetGrid) {
            productGrid.innerHTML = '';
        }

        if (filteredProducts.length === 0) {
            showEmptyState(true);
            return;
        }

        showEmptyState(false);

        // Calculate Slice Range for Incremental Loading
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        const pageItems = filteredProducts.slice(startIndex, endIndex);

        if (endIndex >= filteredProducts.length) {
            hasMoreData = false;
        }

        // Generate Product Card Nodes
        pageItems.forEach(product => {
            const cardElement = createProductCardElement(product);
            productGrid.appendChild(cardElement);
        });
    }

    /**
     * Construct DOM Element for Individual Product Card
     * @param {Object} product - Product Data Entity
     */
    function createProductCardElement(product) {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer flex flex-col justify-between shadow-sm';
        
        // Handle Fallback Image
        const imagePath = product.imageUrl ? product.imageUrl : '/data_minimarket/placeholder.jpg';
        const formattedDescription = formatShortDescription(product.description);

        card.innerHTML = `
            <div class="w-full bg-gray-50 rounded-xl overflow-hidden mb-3 p-2 flex items-center justify-center">
                <img src="${imagePath}" alt="${product.name}" loading="lazy" class="w-full h-36 object-contain" onError="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image';">
            </div>
            <div class="flex flex-col flex-grow">
                <h3 class="font-bold text-gray-900 text-sm line-clamp-1">${product.name}</h3>
                <p class="text-xs text-gray-500 mt-1 mb-2 leading-relaxed">${formattedDescription}</p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                <div>
                    <span class="text-[10px] uppercase font-semibold text-gray-400 block">${translations[currentLanguage].fromPrefix}</span>
                    <span class="text-base font-extrabold text-emerald-600">${translations[currentLanguage].currencySymbol}${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <button class="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-plus text-xs"></i>
                </button>
            </div>
        `;

        // Attach Click Listener to Open Modal
        card.addEventListener('click', () => openProductModal(product));

        return card;
    }

    /**
     * Handle Infinite Scroll Pagination Event
     */
    function handleInfiniteScroll() {
        if (isLoading || !hasMoreData) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 300;

        if (scrollPosition >= threshold) {
            isLoading = true;
            showSpinner(true);

            setTimeout(() => {
                currentPage++;
                renderProductGrid(false);
                isLoading = false;
                showSpinner(false);
            }, 400); // Small artificial delay for visual feedback
        }
    }

    /**
     * Open Modal and Display Full Product Information
     * @param {Object} product 
     */
    function openProductModal(product) {
        modalImg.src = product.imageUrl || 'https://via.placeholder.com/300?text=No+Image';
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `${translations[currentLanguage].currencySymbol}${parseFloat(product.price).toFixed(2)}`;
        modalDescription.textContent = product.description || 'No detailed description available for this product.';

        // Show Modal Container
        productModal.classList.remove('hidden');
        setTimeout(() => {
            productModal.classList.add('show');
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    /**
     * Close Detail Modal
     */
    function closeModal() {
        productModal.classList.remove('show');
        setTimeout(() => {
            productModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 200);
    }

    /**
     * Toggle Loading Spinner Visibility
     */
    function showSpinner(visible) {
        if (visible) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }

    /**
     * Toggle Empty State Display
     */
    function showEmptyState(visible) {
        if (visible) {
            emptyState.classList.remove('hidden');
            productGrid.innerHTML = '';
        } else {
            emptyState.classList.add('hidden');
        }
    }

    /**
     * Apply Dynamic Translations based on Selected Language
     */
    function applyTranslations() {
        const langData = translations[currentLanguage];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.textContent = langData[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                el.placeholder = langData[key];
            }
        });
    }

    // Initialize App
    initApp();
});