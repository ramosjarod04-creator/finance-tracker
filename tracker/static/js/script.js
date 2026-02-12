// ============================================
// FINANCE TRACKER - JAVASCRIPT (PESO VERSION)
// static/js/script.js
// ============================================

// ATOMS - Basic Functional Units
// ============================================

function autoDismissMessages() {
    const messages = document.querySelectorAll('.alert');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
}

function confirmDelete(event) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        event.preventDefault();
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// UPDATED: Format as Philippine Peso
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount).replace('PHP', '₱');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// ============================================
// MOLECULES - Combined Functionality
// ============================================

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.classList.contains('confirm-form')) {
                return;
            }
            
            if (!validateForm(this)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
}

function initDeleteConfirmations() {
    const deleteLinks = document.querySelectorAll('a[href*="/delete/"]');
    
    deleteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this transaction?')) {
                e.preventDefault();
            }
        });
    });
}

function initResponsiveNav() {
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && window.innerWidth < 768) {
        const menuToggle = document.createElement('button');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        if (window.innerWidth < 768) {
            menuToggle.style.display = 'block';
            navMenu.style.display = 'none';
        }
        
        menuToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'none' ? 'flex' : 'none';
        });
        
        document.querySelector('.nav-brand').appendChild(menuToggle);
    }
}

// UPDATED: Real-time amount calculation with Peso
function initAmountCalculator() {
    const amountInput = document.querySelector('input[name="amount"]');
    const typeSelect = document.querySelector('select[name="transaction_type"]');
    
    if (amountInput && typeSelect) {
        function updateAmountDisplay() {
            const amount = parseFloat(amountInput.value) || 0;
            const type = typeSelect.value;
            const prefix = type === 'income' ? '+' : '-';
            
            let preview = document.querySelector('.amount-preview');
            if (!preview) {
                preview = document.createElement('div');
                preview.classList.add('amount-preview');
                preview.style.cssText = `
                    margin-top: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                `;
                amountInput.parentElement.appendChild(preview);
            }
            
            preview.textContent = `${prefix}${formatCurrency(amount)}`;
            preview.style.color = type === 'income' ? '#10b981' : '#ef4444';
        }
        
        amountInput.addEventListener('input', updateAmountDisplay);
        typeSelect.addEventListener('change', updateAmountDisplay);
        
        updateAmountDisplay();
    }
}

function initFilterPersistence() {
    const filterForm = document.querySelector('.filter-form');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function() {
            const formData = new FormData(this);
            const filters = {};
            
            formData.forEach((value, key) => {
                if (value) filters[key] = value;
            });
            
            localStorage.setItem('transactionFilters', JSON.stringify(filters));
        });
        
        const savedFilters = localStorage.getItem('transactionFilters');
        if (savedFilters) {
            const filters = JSON.parse(savedFilters);
            
            Object.keys(filters).forEach(key => {
                const input = filterForm.querySelector(`[name="${key}"]`);
                if (input) input.value = filters[key];
            });
        }
    }
}

function initTableSearch() {
    const searchInput = document.querySelector('input[name="search"]');
    const table = document.querySelector('.data-table tbody');
    
    if (searchInput && table) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                const rows = table.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }, 300);
        });
    }
}

// ============================================
// ORGANISMS - Complex Interactions
// ============================================

function animateDashboardStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isPeso = finalValue.includes('₱');
        
        if (isPeso) {
            const numValue = parseFloat(finalValue.replace(/[₱,]/g, ''));
            let currentValue = 0;
            const increment = numValue / 50;
            const duration = 1000;
            const stepTime = duration / 50;
            
            stat.textContent = '₱0.00';
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numValue) {
                    currentValue = numValue;
                    clearInterval(timer);
                }
                stat.textContent = formatCurrency(currentValue);
            }, stepTime);
        }
    });
}

function enhanceTransactionForm() {
    const categorySelect = document.querySelector('select[name="category"]');
    const typeSelect = document.querySelector('select[name="transaction_type"]');
    
    if (categorySelect && typeSelect) {
        typeSelect.addEventListener('change', function() {
            const type = this.value;
            const incomeCategories = ['salary', 'business', 'investment', 'other'];
            const expenseCategories = ['food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'other'];
            
            const relevantCategories = type === 'income' ? incomeCategories : expenseCategories;
            
            Array.from(categorySelect.options).forEach(option => {
                if (option.value && !relevantCategories.includes(option.value)) {
                    option.style.color = '#9ca3af';
                } else {
                    option.style.color = '';
                }
            });
        });
    }
}

function initializeApp() {
    autoDismissMessages();
    initFormValidation();
    initDeleteConfirmations();
    initResponsiveNav();
    initAmountCalculator();
    initFilterPersistence();
    initTableSearch();
    
    if (document.querySelector('.dashboard')) {
        animateDashboardStats();
    }
    
    if (document.querySelector('.transaction-form')) {
        enhanceTransactionForm();
    }
    
    console.log('Finance Tracker initialized successfully! ₱');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// EVENT LISTENERS
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.addEventListener('resize', debounce(function() {
    initResponsiveNav();
}, 250));

document.addEventListener('input', function(e) {
    if (e.target.matches('input, select, textarea')) {
        e.target.classList.remove('error');
    }
});

document.addEventListener('submit', function(e) {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn && !submitBtn.classList.contains('loading')) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 3000);
    }
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const createBtn = document.querySelector('a[href*="create"]');
        if (createBtn) window.location.href = createBtn.href;
    }
    
    if (e.key === 'Escape') {
        const backBtn = document.querySelector('.btn-outline');
        if (backBtn && backBtn.textContent.includes('Back')) {
            backBtn.click();
        }
    }
});

console.log('Finance Tracker JS loaded! Press Ctrl+N for new transaction.');