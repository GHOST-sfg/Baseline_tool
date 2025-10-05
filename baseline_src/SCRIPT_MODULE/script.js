// script.js - Feature Compatibility Checker for Dev Sahayak

class FeatureCompatManager {
    constructor(data) {
        this.features = data;
        this.filteredFeatures = [...data];
        this.currentSort = { field: 'id', direction: 'asc' };
        this.searchInput = document.querySelector('.checker-input');
        this.checkButton = document.querySelector('.checker-btn');
        this.resultsGrid = document.querySelector('.results-grid');
        this.resultsSection = document.querySelector('.results-section');
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Hide results section initially
        this.hideResultsSection();
        
        // Check for stored search query from home page
        this.checkForHomePageSearch();
    }

    // Check for stored search query from home page
   // Check for stored search query from home page
checkForHomePageSearch() {
    const storedSearchQuery = localStorage.getItem('searchQuery');
    if (storedSearchQuery && this.searchInput) {
        // Set the search input value
        this.searchInput.value = storedSearchQuery;
        // Trigger the search after a short delay
        setTimeout(() => {
            this.searchFeature();
            // Clear the stored query so it doesn't run again
            localStorage.removeItem('searchQuery');
            
            // Check if we should scroll to results (from home page)
            const shouldScroll = localStorage.getItem('shouldScrollToResults');
            if (shouldScroll === 'true') {
                setTimeout(() => {
                    this.scrollToResults();
                }, 600);
                localStorage.removeItem('shouldScrollToResults');
            }
        }, 500);
    }
}

    // Hide results section
    hideResultsSection() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
    }

    // Show results section
    showResultsSection() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
        }
    }

    // Scroll to results section
    scrollToResults() {
        if (this.resultsSection) {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Setup event listeners
    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            if (e.key === 'Enter') {
                this.searchFeature();
            }
        });

        this.checkButton.addEventListener('click', () => {
            this.searchFeature();
        });

        // Add click listeners for search examples
        document.querySelectorAll('.search-examples strong').forEach(example => {
            example.addEventListener('click', () => {
                this.searchInput.value = example.textContent;
                this.searchFeature();
            });
        });
    }

    // Search for features
    searchFeature() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            this.showNotification('Please enter a feature name to search', 'warning');
            this.hideResultsSection(); // Hide results if empty search
            return;
        }

        this.filteredFeatures = this.features.filter(feature => 
            feature.name.toLowerCase().includes(searchTerm) ||
            feature.description.toLowerCase().includes(searchTerm) ||
            feature.category.toLowerCase().includes(searchTerm)
        );

        if (this.filteredFeatures.length === 0) {
            this.showNotification(`No features found for "${searchTerm}"`, 'error');
            this.hideResultsSection(); // Hide results if no matches
        } else {
            // Show results section
            this.showResultsSection();
            
            // Scroll to results after a short delay to ensure they're rendered
            setTimeout(() => {
                this.scrollToResults();
            }, 100);
            
            // Check if search is for a category
            const isCategorySearch = this.isCategorySearch(searchTerm);
            
            if (isCategorySearch) {
                this.displayCategoryResults(searchTerm);
            } else {
                this.displaySingleFeatureResult(searchTerm);
            }
        }
    }

    // Check if search term is a category
    isCategorySearch(searchTerm) {
        const categories = ['css', 'javascript', 'html', 'api'];
        return categories.includes(searchTerm);
    }

    // Display 12 cards for category search
    displayCategoryResults(category) {
        const resultsTitle = document.querySelector('.results-title');
        resultsTitle.textContent = `${category.toUpperCase()} Features`;
        
        this.resultsGrid.innerHTML = '';
        this.resultsGrid.style.display = 'block';
        this.resultsGrid.style.minHeight = 'auto';
        
        // Get top 12 features for this category
        const categoryFeatures = this.features
            .filter(feature => feature.category === category)
            .slice(0, 12);
        
        if (categoryFeatures.length === 0) {
            this.showNotification(`No ${category} features found`, 'error');
            this.hideResultsSection();
            return;
        }
        
        // Display as 4 rows of 3 cards each
        const rows = [];
        for (let i = 0; i < categoryFeatures.length; i += 3) {
            rows.push(categoryFeatures.slice(i, i + 3));
        }
        
        rows.forEach((rowFeatures, index) => {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'category-row';
            rowContainer.innerHTML = `
                <div class="category-cards">
                    ${rowFeatures.map(feature => this.createResultCardHTML(feature)).join('')}
                </div>
            `;
            this.resultsGrid.appendChild(rowContainer);
        });

        // Add animation
        setTimeout(() => {
            document.querySelectorAll('.result-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('animate-in');
            });
        }, 100);
    }

    // Display 1 card for feature name search
    displaySingleFeatureResult(searchTerm) {
        const resultsTitle = document.querySelector('.results-title');
        resultsTitle.textContent = `Feature: "${searchTerm}"`;
        
        this.resultsGrid.innerHTML = '';
        
        // Find the best matching feature
        const bestMatch = this.findBestFeatureMatch(searchTerm);
        
        if (bestMatch) {
            const card = this.createResultCard(bestMatch);
            this.resultsGrid.appendChild(card);
            
            // Center the single card
            this.resultsGrid.style.display = 'flex';
            this.resultsGrid.style.justifyContent = 'center';
            this.resultsGrid.style.alignItems = 'center';
            this.resultsGrid.style.minHeight = '300px';
            
            // Add animation
            setTimeout(() => {
                card.style.animationDelay = '0.1s';
                card.classList.add('animate-in');
            }, 100);
        } else {
            this.showNotification(`No exact match found for "${searchTerm}"`, 'warning');
            this.hideResultsSection();
        }
    }

    // Find best feature match for name search
    findBestFeatureMatch(searchTerm) {
        // First, try exact name match
        const exactMatch = this.filteredFeatures.find(feature => 
            feature.name.toLowerCase() === searchTerm
        );
        if (exactMatch) return exactMatch;

        // Then try starts with
        const startsWithMatch = this.filteredFeatures.find(feature => 
            feature.name.toLowerCase().startsWith(searchTerm)
        );
        if (startsWithMatch) return startsWithMatch;

        // Then return first match
        return this.filteredFeatures[0];
    }

    // Create result card HTML element
    createResultCard(feature) {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const supportStatus = this.getSupportStatus(feature);
        const statusClass = this.getStatusClass(supportStatus);
        const statusText = this.getStatusText(supportStatus);
        const icon = this.getStatusIcon(supportStatus);

        card.innerHTML = `
            <div class="result-icon">${icon}</div>
            <div class="result-status ${statusClass}">${statusText}</div>
            <h3 class="result-title">${feature.name}</h3>
            <p class="result-description">${feature.description}</p>
            
            <div class="browser-support">
                ${this.createBrowserSupportHTML(feature.support_status)}
            </div>
            
            <div class="card-actions">
                <button class="action-btn" onclick="featureManager.showFeatureDetails(${feature.id})">
                    Check Details
                </button>
                <button class="action-btn secondary" onclick="featureManager.viewDocumentation('${feature.name}')">
                    View Documentation
                </button>
            </div>
        `;

        return card;
    }

    // Create result card HTML string
    createResultCardHTML(feature) {
        const supportStatus = this.getSupportStatus(feature);
        const statusClass = this.getStatusClass(supportStatus);
        const statusText = this.getStatusText(supportStatus);
        const icon = this.getStatusIcon(supportStatus);

        return `
            <div class="result-card" data-category="${feature.category}">
                <div class="result-icon">${icon}</div>
                <div class="result-status ${statusClass}">${statusText}</div>
                <h3 class="result-title">${feature.name}</h3>
                <p class="result-description">${feature.description}</p>
                
                <div class="browser-support">
                    ${this.createBrowserSupportHTML(feature.support_status)}
                </div>
                
                <div class="card-actions">
                    <button class="action-btn" onclick="featureManager.showFeatureDetails(${feature.id})">
                        Check Details
                    </button>
                    <button class="action-btn secondary" onclick="featureManager.viewDocumentation('${feature.name}')">
                        View Documentation
                    </button>
                </div>
            </div>
        `;
    }

    // Create browser support HTML
    createBrowserSupportHTML(supportStatus) {
        const browsers = [
            { name: 'Chrome', key: 'chrome', icon: '🌐' },
            { name: 'Firefox', key: 'firefox', icon: '🦊' },
            { name: 'Safari', key: 'safari', icon: '🍎' },
            { name: 'Edge', key: 'edge', icon: '🔵' }
        ];

        return browsers.map(browser => {
            const support = supportStatus[browser.key];
            const isSupported = support.category === 'widely_available';
            const version = support.version || 'Not supported';
            
            return `
                <div class="browser ${!isSupported ? 'not-supported' : ''}">
                    <span class="browser-icon">${browser.icon}</span>
                    <div class="browser-name">${browser.name}</div>
                    <div class="browser-version">${version}</div>
                </div>
            `;
        }).join('');
    }

    // Get support status for a feature
    getSupportStatus(feature) {
        const browsers = ['chrome', 'firefox', 'safari', 'edge'];
        const supportedBrowsers = browsers.filter(browser => 
            feature.support_status[browser].category === 'widely_available'
        ).length;

        if (supportedBrowsers === browsers.length) {
            return 'fully-supported';
        } else if (supportedBrowsers > 0) {
            return 'partially-supported';
        } else {
            return 'not-supported';
        }
    }

    // Get status class for styling
    getStatusClass(status) {
        const classes = {
            'fully-supported': 'status-available',
            'partially-supported': 'status-limited',
            'not-supported': 'status-not-supported'
        };
        return classes[status] || 'status-unknown';
    }

    // Get status text
    getStatusText(status) {
        const texts = {
            'fully-supported': 'Widely Available',
            'partially-supported': 'Limited Support',
            'not-supported': 'Not Supported'
        };
        return texts[status] || 'Unknown';
    }

    // Get status icon
    getStatusIcon(status) {
        const icons = {
            'fully-supported': '✅',
            'partially-supported': '⚠️',
            'not-supported': '❌'
        };
        return icons[status] || '❓';
    }

    // Show feature details (modal or page)
    showFeatureDetails(featureId) {
        const feature = this.features.find(f => f.id === featureId);
        if (!feature) return;

        this.showFeatureModal(feature);
    }

    // Show feature modal
    showFeatureModal(feature) {
        const modal = document.createElement('div');
        modal.className = 'feature-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const supportStatus = this.getSupportStatus(feature);
        const statusClass = this.getStatusClass(supportStatus);
        const statusText = this.getStatusText(supportStatus);
        const icon = this.getStatusIcon(supportStatus);

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2 style="margin: 0;">${feature.name}</h2>
                    <button onclick="this.closest('.feature-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                    ">×</button>
                </div>
                
                <div class="result-status ${statusClass}" style="margin-bottom: 1rem;">${icon} ${statusText}</div>
                
                <p><strong>Category:</strong> ${feature.category.toUpperCase()}</p>
                <p><strong>Description:</strong> ${feature.description}</p>
                
                <h3>Browser Support Details</h3>
                <div class="browser-support-detailed">
                    ${this.createDetailedBrowserSupport(feature.support_status)}
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="action-btn" onclick="featureManager.viewDocumentation('${feature.name}')">
                        View Documentation
                    </button>
                    <button class="action-btn secondary" onclick="this.closest('.feature-modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Create detailed browser support
    createDetailedBrowserSupport(supportStatus) {
        const browsers = [
            { name: 'Chrome', key: 'chrome' },
            { name: 'Firefox', key: 'firefox' },
            { name: 'Safari', key: 'safari' },
            { name: 'Edge', key: 'edge' }
        ];

        return browsers.map(browser => {
            const support = supportStatus[browser.key];
            return `
                <div class="browser-detail" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    border-bottom: 1px solid #eee;
                ">
                    <span><strong>${browser.name}</strong></span>
                    <span>${support.version || 'Not supported'}</span>
                    <span style="color: ${support.category === 'widely_available' ? 'green' : 'orange'}">
                        ${support.notes}
                    </span>
                </div>
            `;
        }).join('');
    }

    // View documentation (external link)
    viewDocumentation(featureName) {
        const docLinks = {
            'mdn': `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(featureName)}`,
            'webdev': `https://web.dev/search/?q=${encodeURIComponent(featureName)}`,
            'caniuse': `https://caniuse.com/?search=${encodeURIComponent(featureName)}`
        };

        window.open(docLinks.mdn, '_blank');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4CAF50'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetch('feature_compat.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load feature_compat.json');
        return response.json();
    })
    .then(data => {
        window.featureManager = new FeatureCompatManager(data);

        // Add CSS for animations and layout
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .result-card.animate-in {
                animation: fadeInUp 0.5s ease forwards;
            }
            .category-row {
                margin-bottom: 2rem;
            }
            .category-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
            }
            @media (max-width: 768px) {
                .category-cards {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    })
    .catch(error => console.error('Error loading JSON:', error));
});

// Additional CSS
const additionalCSS = `
.feature-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 4px;
    z-index: 1001;
    animation: slideIn 0.3s ease;
}

.notification-error { background: #f44336; color: white; }
.notification-warning { background: #ff9800; color: white; }
.notification-info { background: #4CAF50; color: white; }

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.search-examples strong {
    cursor: pointer;
    text-decoration: underline;
}

.search-examples strong:hover {
    color: #007bff;
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);