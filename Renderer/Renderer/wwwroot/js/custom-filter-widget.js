document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.getElementById('filterSelect');
    const contentContainer = document.getElementById('filteredContent');
    const regionItems = document.querySelectorAll('#regionList .region-item');

    function updateUrl(filterValue) {
        const url = new URL(window.location);
        if (filterValue) {
            url.searchParams.set('filter', filterValue);
        } else {
            url.searchParams.delete('filter');
        }
        window.history.pushState({}, '', url);
    }

    function setActiveRegion(region) {
        regionItems.forEach(item => {
            if (item.dataset.region === region) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function loadFilteredContent(filterValue) {
        updateUrl(filterValue);
        
        fetch(`/CustomFilterWidget?filter=${encodeURIComponent(filterValue || '')}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading filtered content:', error);
        });
    }

    // Handle dropdown change
    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            const selected = this.value;
            setActiveRegion(selected);
            loadFilteredContent(selected);
        });
    }

    // Handle region clicks
    regionItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedRegion = item.dataset.region;
            
            if (filterSelect) {
                filterSelect.value = selectedRegion;
            }
            setActiveRegion(selectedRegion);
            loadFilteredContent(selectedRegion);
        });
    });

    // Initial load
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter') || 'UK';
    
    if (filterSelect) {
        filterSelect.value = filter;
    }
    setActiveRegion(filter);
    loadFilteredContent(filter);
});