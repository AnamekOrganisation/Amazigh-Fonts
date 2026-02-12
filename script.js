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
    const toggleFavsBtn = document.getElementById('toggleFavsBtn');
    const favCountEl = document.getElementById('favCount');
    const charMapModal = document.getElementById('charMapModal');
    const charGrid = document.getElementById('charGrid');
    const modalFontName = document.getElementById('modalFontName');
    const closeModal = document.querySelector('.close-modal');
    const toast = document.getElementById('toast');

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
            filtering: 'جاري التصفية...',
            copyCSS: 'نسخ CSS',
            charMap: 'خريطة الحروف',
            showFavorites: 'المفضلة فقط',
            copied: 'تم نسخ الكود بنجاح!'
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
            filtering: 'Filtering...',
            copyCSS: 'Copy CSS',
            charMap: 'Glyphs',
            showFavorites: 'Favorites Only',
            copied: 'CSS copied to clipboard!'
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
            filtering: 'Filtrage...',
            copyCSS: 'Copier CSS',
            charMap: 'Glyphes',
            showFavorites: 'Favoris uniquement',
            copied: 'CSS copié !'
        },
      
        zgh: {
            title: 'ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⵉⴼⵉⵏⴰⵖ',
            subtitle: 'ⵜⴰⴳⵔⵓⵎⵎⴰ ⵜⴰⵎⴰⵜⴰⵢⵜ ⵏ ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⵎⴰⵣⵉⵖⵜ',
            searchPlaceholder: 'ⵔⵣⵓ ⵅⴼ ⵓⵙⴽⴽⵉⵍ...',
            allCategories: 'ⵎⴰⵕⵕⴰ ⵉⵙⵎⵉⵍⵏ',
            previewPlaceholder: 'ⴰⴹⵕⵉⵚ ⵏ ⵓⵙⴽⵏ...',
            loading: 'ⵥⵕ ⵓⴳⴳⴰⵔ ⵏ ⵉⵙⴽⴽⵉⵍⵏ...',
            loadMore: 'ًⵥⵕ ⵓⴳⴳⴰⵔ',
            download: 'ⴰⴳⵎ',
            footerText: '© 2026 Unicode Fonts For Amazigh Tifinagh. All rights reserved.',
            noFonts: 'ⵓⵔ ⵏⵓⴼⵉ ⴰⵙⴽⴽⵉⵍ ⴰⴷ.',
            error: 'ⵉⵍⵍⴰ ⵓⵣⴳⵍ ⴳ ⵡⴰⴳⴰⵎ ⵏ ⵓⵙⴽⴽⵉⵍ .',
            filtering: 'ⴰⵙⵜⴰⵢ...',
            copyCSS: 'ⵙⵙⵏⵖⵍ CSS',
            charMap: 'ⵉⵙⴽⴽⵉⵍⵏ',
            showFavorites: 'ⵙⴽⵏ ⵉⵙⵎⵢⴰⴼⴰⵏ',
            copied: 'CSS ⵉⵜⵜⵓⵙⵙⵏⵖⵍ!'
        }
    };

    let currentLang = 'zgh';
    let allFonts = [];
    let filteredFonts = [];
    let favorites = JSON.parse(localStorage.getItem('tifinaghFavs') || '[]');
    let displayedCount = 0;
    const batchSize = 24;

    // Tifinagh character ranges
    const tifinaghChars = [];
    for (let i = 0x2D30; i <= 0x2D67; i++) tifinaghChars.push(String.fromCharCode(i));
    for (let i = 0x2D6F; i <= 0x2D7F; i++) tifinaghChars.push(String.fromCharCode(i));

    // Initialize language & UI
    setLanguage(currentLang);
    updateFavCount();

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
        
        langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = translations[lang][key] || el.textContent;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = translations[lang][key] || el.placeholder;
        });

        // Update titles
        if (toggleFavsBtn) toggleFavsBtn.title = translations[lang].showFavorites;

        // Update cards dynamic text
        document.querySelectorAll('.btn-download span.dl-text').forEach(el => el.textContent = translations[lang].download);
        document.querySelectorAll('.btn-copy-css span').forEach(el => el.textContent = translations[lang].copyCSS);
        document.querySelectorAll('.btn-char-map span').forEach(el => el.textContent = translations[lang].charMap);
    }

    function updateFavCount() {
        if (favCountEl) favCountEl.textContent = favorites.length;
    }

    function toggleFavorite(fontFile, btn) {
        const index = favorites.indexOf(fontFile);
        if (index === -1) {
            favorites.push(fontFile);
            btn.classList.add('active');
        } else {
            favorites.splice(index, 1);
            btn.classList.remove('active');
            if (toggleFavsBtn.classList.contains('active')) filterFonts();
        }
        updateFavCount();
        localStorage.setItem('tifinaghFavs', JSON.stringify(favorites));
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(translations[currentLang].copied);
        });
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    }

    function openCharMap(fontName, fontId) {
        modalFontName.textContent = fontName;
        charGrid.innerHTML = '';
        charGrid.style.fontFamily = `'${fontId}'`;
        
        tifinaghChars.forEach(char => {
            const div = document.createElement('div');
            div.className = 'char-item';
            div.textContent = char;
            div.title = `U+${char.charCodeAt(0).toString(16).toUpperCase()}`;
            charGrid.appendChild(div);
        });
        
        charMapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
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
            const fontId = `f-${Math.random().toString(36).substr(2, 5)}`;
            loadFont(fontId, font.file);
            
            const isFav = favorites.includes(font.file);
            
            const card = document.createElement('div');
            card.className = 'font-card';
            card.innerHTML = `
                <div class="font-info">
                    <div class="font-meta">
                        <span class="font-name">${font.name}</span>
                        <span class="font-category">${font.category}</span>
                    </div>
                    <button class="btn-fav ${isFav ? 'active' : ''}" title="Favorite">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                </div>
                <div class="font-preview">
                    <div class="font-preview-text" style="font-family: '${fontId}'; font-size: ${fontSizeRange.value}px;">
                        ${previewTextInput.value || 'ⴰⵣⵓⵍ ⵉⵎⴰⵣⵉⵖⵏ'}
                    </div>
                </div>
                <div class="font-actions">
                    <button class="btn-action btn-char-map" title="${translations[currentLang].charMap}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
                        <span>${translations[currentLang].charMap}</span>
                    </button>
                    <button class="btn-action btn-copy-css" title="${translations[currentLang].copyCSS}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        <span>${translations[currentLang].copyCSS}</span>
                    </button>
                    <a href="${font.file}" class="btn-action btn-download" download>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span class="dl-text">${translations[currentLang].download}</span>
                    </a>
                </div>
            `;

            // Card Events
            card.querySelector('.btn-fav').onclick = (e) => toggleFavorite(font.file, e.currentTarget);
            card.querySelector('.btn-char-map').onclick = () => openCharMap(font.name, fontId);
            card.querySelector('.btn-copy-css').onclick = () => {
                const basename = font.file.split('/').pop();
                const css = `@font-face {\n  font-family: '${font.name}';\n  src: url('${window.location.origin + window.location.pathname}fonts/${basename}');\n}`;
                copyToClipboard(css);
            };

            fontsGrid.appendChild(card);
        });

        displayedCount += nextBatch.length;
        loadMoreContainer.style.display = displayedCount >= filteredFonts.length ? 'none' : 'block';
    }

    function loadFont(name, url) {
        const newFont = new FontFace(name, `url('${encodeURI(url)}')`);
        newFont.load().then(loaded => document.fonts.add(loaded)).catch(err => console.warn(`Failed: ${name}`, err));
    }

    // Global Events
    langBtns.forEach(btn => btn.onclick = () => setLanguage(btn.dataset.lang));
    fontSearch.oninput = debounce(filterFonts, 300);
    categoryFilter.onchange = filterFonts;
    
    toggleFavsBtn.onclick = () => {
        toggleFavsBtn.classList.toggle('active');
        filterFonts();
    };

    previewTextInput.oninput = () => {
        const text = previewTextInput.value || 'ⴰⵣⵓⵍ ⵉⵎⴰⵣⵉⵖⵏ';
        document.querySelectorAll('.font-preview-text').forEach(el => el.textContent = text);
    };

    fontSizeRange.oninput = () => {
        const size = fontSizeRange.value;
        fontSizeValue.textContent = `${size}px`;
        document.querySelectorAll('.font-preview-text').forEach(el => el.style.fontSize = `${size}px`);
    };

    loadMoreBtn.onclick = () => renderNextBatch();
    closeModal.onclick = () => {
        charMapModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    window.onclick = (e) => {
        if (e.target === charMapModal) {
            charMapModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Back to Top logic
    const backToTopBtn = document.getElementById('backToTop');
    window.onscroll = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };
    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function filterFonts() {
        const searchTerm = fontSearch.value.toLowerCase();
        const cat = categoryFilter.value;
        const favOnly = toggleFavsBtn.classList.contains('active');
        
        filteredFonts = allFonts.filter(f => {
            const matchesSearch = f.name.toLowerCase().includes(searchTerm);
            const matchesCat = cat === 'all' || f.category === cat;
            const matchesFav = !favOnly || favorites.includes(f.file);
            return matchesSearch && matchesCat && matchesFav;
        });

        displayedCount = 0;
        fontsGrid.innerHTML = `<div class="loading">${translations[currentLang].filtering}</div>`;
        renderNextBatch();
    }

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
});
