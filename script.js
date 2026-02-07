document.addEventListener('DOMContentLoaded', () => {
    const fontsGrid = document.getElementById('fontsGrid');
    const fontSearch = document.getElementById('fontSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const previewTextInput = document.getElementById('previewTextInput');
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const langBtns = document.querySelectorAll('.lang-btn');

    const translations = {
        ar: {
            title: 'خطوط تيفيناغ',
            subtitle: 'مجموعة شاملة من خطوط الأمازيغية للمصممين والمطورين',
            searchPlaceholder: 'ابحث عن خط...',
            allCategories: 'جميع الفئات',
            previewPlaceholder: 'نص المعاينة...',
            loading: 'جاري تحميل الخطوط...',
            loadMore: 'تحميل المزيد',
            download: 'تحميل',
            footerText: '© 2026 Unicode Fonts For Amazigh Tifinagh. جميع الحقوق محفوظة.',
            noFonts: 'لم يتم العثور على خطوط تطابق بحثك.',
            error: 'حدث خطأ أثناء تحميل البيانات.',
            filtering: 'جاري التصفية...'
        },
        en: {
            title: 'Tifinagh Fonts',
            subtitle: 'A comprehensive collection of Amazigh fonts for designers and developers',
            searchPlaceholder: 'Search for a font...',
            allCategories: 'All Categories',
            previewPlaceholder: 'Preview text...',
            loading: 'Loading fonts...',
            loadMore: 'Load More',
            download: 'Download',
            footerText: '© 2026 Unicode Fonts For Amazigh Tifinagh. All rights reserved.',
            noFonts: 'No fonts found matching your search.',
            error: 'An error occurred while loading data.',
            filtering: 'Filtering...'
        },
        fr: {
            title: 'Polices Tifinagh',
            subtitle: 'Une collection complète de polices amazighes pour les designers et développeurs',
            searchPlaceholder: 'Rechercher une police...',
            allCategories: 'Toutes les catégories',
            previewPlaceholder: 'Texte d\'aperçu...',
            loading: 'Chargement des polices...',
            loadMore: 'Charger plus',
            download: 'Télécharger',
            footerText: '© 2026 Unicode Fonts For Amazigh Tifinagh. Tous droits réservés.',
            noFonts: 'Aucune police trouvée correspondant à votre recherche.',
            error: 'Une erreur est survenue lors du chargement des données.',
            filtering: 'Filtrage...'
        },
        zgh: {
            title: 'ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⵉⴼⵉⵏⴰⵖ',
            subtitle: 'ⵜⴰⴳⵔⵓⵎⵎⴰ ⵜⴰⵎⴰⵜⴰⵢⵜ ⵏ ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⵎⴰⵣⵉⵖⵜ',
            searchPlaceholder: 'ⵔⵣⵓ ⴼ ⵓⵙⴽⴽⵉⵍ...',
            allCategories: 'ⵎⴰⵕⵕⴰ ⵜⵉⴳⵔⵓⵎⵎⵉⵡⵉⵏ',
            previewPlaceholder: 'ⴰⴹⵕⵉⵚ ⵏ ⵓⵙⴼⵙⵔ...',
            loading: 'ⴰⵣⴷⴰⵢ ⵏ ⵉⵙⴽⴽⵉⵍⵏ...',
            loadMore: 'ⴰⵣⴷⴰⵢ ⵢⴰⴹⵏ',
            download: 'ⴰⴳⴰⵎ',
            footerText: '© 2026 Unicode Fonts For Amazigh Tifinagh. ⵎⴰⵕⵕⴰ ⵉⵣⵔⴼⴰⵏ ⵓⴳⴳⵉⵏ.',
            noFonts: 'ⵓⵔ ⵏⵓⴼⵉ ⴰⵎⵢⴰⵏ ⵏ ⵓⵙⴽⴽⵉⵍ.',
            error: 'ⵜⵍⵍⴰ ⵜⴳⵓⵔⵉ ⴳ ⵓⵣⴷⴰⵢ ⵏ ⵉⵙⴼⴽⴰ.',
            filtering: 'ⴰⵣⵔⴰⵔ...'
        }
    };

    let currentLang = 'zgh';
    let allFonts = [];
    let filteredFonts = [];
    let displayedCount = 0;
    const batchSize = 20;

    // Initialize language
    setLanguage(currentLang);

    // Load fonts data
    fetch('fonts.json')
        .then(response => response.json())
        .then(data => {
            allFonts = data;
            filteredFonts = allFonts;
            
            populateCategories();
            renderNextBatch();
            
            if (filteredFonts.length > batchSize) {
                loadMoreContainer.style.display = 'block';
            }
        })
        .catch(err => {
            console.error('Error loading fonts:', err);
            fontsGrid.innerHTML = `<div class="loading">${translations[currentLang].error}</div>`;
        });

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        
        // Update active button
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update UI text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = translations[lang][key] || el.textContent;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = translations[lang][key] || el.placeholder;
        });

        // Refresh existing cards translation if any
        document.querySelectorAll('.btn-download span.dl-text').forEach(el => {
            el.textContent = translations[lang].download;
        });
    }

    function populateCategories() {
        const categories = [...new Set(allFonts.map(f => f.category))].sort();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    function renderNextBatch(limit = batchSize) {
        const nextBatch = filteredFonts.slice(displayedCount, displayedCount + limit);
        if (nextBatch.length === 0) {
            if (displayedCount === 0) {
                fontsGrid.innerHTML = `<div class="loading">${translations[currentLang].noFonts}</div>`;
            }
            loadMoreContainer.style.display = 'none';
            return;
        }

        if (displayedCount === 0) fontsGrid.innerHTML = '';

        nextBatch.forEach(font => {
            const fontId = `font-${Math.random().toString(36).substr(2, 9)}`;
            loadFont(fontId, font.file);
            
            const card = document.createElement('div');
            card.className = 'font-card';
            card.innerHTML = `
                <div class="font-info">
                    <span class="font-name">${font.name}</span>
                    <span class="font-category">${font.category}</span>
                </div>
                <div class="font-preview">
                    <div class="font-preview-text" style="font-family: '${fontId}'; font-size: ${fontSizeRange.value}px;">
                        ${previewTextInput.value || 'ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ ⴳ ⵓⵏⴰⵎⴽ'}
                    </div>
                </div>
                <div class="font-actions">
                    <a href="${font.file}" class="btn-download" download>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span class="dl-text">${translations[currentLang].download}</span>
                    </a>
                </div>
            `;
            fontsGrid.appendChild(card);
        });

        displayedCount += nextBatch.length;
        
        if (displayedCount >= filteredFonts.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    function loadFont(name, url) {
        const newFont = new FontFace(name, `url('${encodeURI(url)}')`);
        newFont.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        }).catch(err => {
            console.warn(`Failed to load font ${name}:`, err);
        });
    }

    // Event Listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    fontSearch.addEventListener('input', debounce(filterFonts, 300));
    categoryFilter.addEventListener('change', filterFonts);
    
    previewTextInput.addEventListener('input', () => {
        const text = previewTextInput.value || 'ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ ⴳ ⵓⵏⴰⵎⴽ';
        document.querySelectorAll('.font-preview-text').forEach(el => {
            el.textContent = text;
        });
    });

    fontSizeRange.addEventListener('input', () => {
        const size = fontSizeRange.value;
        fontSizeValue.textContent = `${size}px`;
        document.querySelectorAll('.font-preview-text').forEach(el => {
            el.style.fontSize = `${size}px`;
        });
    });

    loadMoreBtn.addEventListener('click', () => renderNextBatch());

    function filterFonts() {
        const searchTerm = fontSearch.value.toLowerCase();
        const category = categoryFilter.value;
        
        filteredFonts = allFonts.filter(f => {
            const matchesSearch = f.name.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || f.category === category;
            return matchesSearch && matchesCategory;
        });

        displayedCount = 0;
        fontsGrid.innerHTML = `<div class="loading">${translations[currentLang].filtering}</div>`;
        renderNextBatch();
    }

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
});
