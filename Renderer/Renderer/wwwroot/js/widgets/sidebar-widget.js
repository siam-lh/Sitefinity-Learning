document.addEventListener("DOMContentLoaded", function () {
    // Element References
   
    const skealitonLoader = document.getElementById("skeletonLoader");
    const dynamicContentList = document.getElementById("dynamicList");
    const toggleButtons = document.querySelectorAll(".faq-toggle");

    const body = document.body;

    // Drawer Controls
    function bindDrawerEvents() {
        document.addEventListener("click", function (e) {
            const overlay = document.getElementById("drawerOverlay");
            const panel = document.getElementById("drawerPanel");

            if (e.target.id === "openDrawerBtn") {
                body.classList.add("drawer-open");
                overlay?.classList.add("show");
                panel?.classList.add("open");
            }

            if (e.target.id === "closeDrawerBtn" || e.target.id === "drawerOverlay") {
                body.classList.remove("drawer-open");
                overlay?.classList.remove("show");
                panel?.classList.remove("open");
            }
        });
    }

    // Initial URL Setup
    function updateInitialUrl() {
        const url = new URL(window.location.href);
        const currentRegion = url.searchParams.get("region");

        if (!currentRegion) {
            const activeTab = document.querySelector("#regionTabs .nav-link.tab-active");
            if (activeTab) {
                const firstRegion = activeTab.getAttribute("data-region");
                url.searchParams.set("region", firstRegion);
                history.replaceState({}, "", url);
            }
        }
    }

    async function updateUrlAndFetch(region = null, subregion = null, clearSubregion = false, newRequest = false) {
        const url = new URL(window.location.href);
        if (region !== null) url.searchParams.set("region", region);
        if (clearSubregion) url.searchParams.delete("subregion");
        else if (subregion !== null) url.searchParams.set("subregion", subregion);
        history.pushState({}, "", url);

        dynamicContentList.style.display = "none";
        skealitonLoader.style.display = "block";

        try {
            const headers = newRequest ? {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "text/html"
            } : {};
            const res = await fetch(url, { headers });
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const newContent = doc.querySelector(".responsive-table");
            const newSubRegionFilter = doc.querySelector(".filter-portion");
            const newMobileBreadcrumb = doc.querySelector(".mobile-drawer-breadcrumb");
            const newSidebarTab = doc.getElementById("regionTabs");
            // Update Table Content
            if (dynamicContentList && newContent) {
                setTimeout(() => {
                    skealitonLoader.style.display = "none";
                    const oldTable = dynamicContentList.firstElementChild;
                    if (oldTable) {
                        dynamicContentList.replaceChild(newContent, oldTable);
                    }
                    dynamicContentList.style.display = "block";
                }, 1500);
            }

            // Update Subregion Filter
            if (newSubRegionFilter) {
                const currentFilter = document.querySelector(".filter-portion");
                if (currentFilter) {
                    currentFilter.replaceWith(newSubRegionFilter);
                }
            }
            // Update Sidebar tabs
            if (newSidebarTab) {
                const currentSideBar = document.getElementById("regionTabs");
                if (currentSideBar) {
                    currentSideBar.replaceWith(newSidebarTab);
                }
            }
            // Update Mobile Breadcrumb
            if (newMobileBreadcrumb) {
                const currentBreadcrumb = document.querySelector(".mobile-drawer-breadcrumb");
                if (currentBreadcrumb) {
                    currentBreadcrumb.replaceWith(newMobileBreadcrumb);
                }
            }

        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // Desktop Interactions

    // Region Tab click
    document.addEventListener("click", function (e) {
        const target = e.target;

        // Only handle clicks on region tab links inside #regionTabs
        if (target && target.matches("#regionTabs .nav-link")) {
            e.preventDefault();
            const selectedRegion = target.getAttribute("data-region");
            const currentRegion = new URL(window.location.href).searchParams.get("region");
            if (currentRegion === selectedRegion) return;

            // Remove 'tab-active' from all region tabs
            const allTabs = document.querySelectorAll("#regionTabs .nav-link");
            allTabs.forEach(link => link.classList.remove("tab-active"));

            // Add 'tab-active' to the clicked one
            target.classList.add("tab-active");

            // Trigger region change fetch
            updateUrlAndFetch(selectedRegion, null, true, true);
        }
    });
    // Sub Region drop down click
    document.addEventListener("change", function (e) {
        const target = e.target;
        if (target && target.id === "subRegionFilter") {
            const selectedSubregion = target.value;
            const currentSubregion = new URL(window.location.href).searchParams.get("subregion") || "";
            if (currentSubregion === selectedSubregion) return;
            updateUrlAndFetch(null, selectedSubregion, false, true);
        }
    });

    // Mobile Interactions

    // Region Tab click
    document.addEventListener("click", function (e) {
        const target = e.target;

        // Match only mobile region tab links inside #mobileRegionTabs
        if (target && target.matches("#mobileRegionTabs .nav-link")) {
            e.preventDefault();

            const selectedRegion = target.getAttribute("data-region");
            const currentRegion = new URL(window.location.href).searchParams.get("region");
            if (currentRegion === selectedRegion) return;

            updateUrlAndFetch(selectedRegion, null, true, true);
        }
    });

    //Sub Region Tab click
    document.addEventListener("click", function (e) {
        const target = e.target;

        // Match only mobile subregion links
        if (target && target.matches(".mobile-subregion-tabs .subregion-nav-link")) {
            e.preventDefault();

            const selectedSubregion = target.getAttribute("data-region");

            const faqItem = target.closest(".faq-item");
            const parentRegion = faqItem?.querySelector(".faq-question")?.getAttribute("data-region");

            if (!parentRegion) return;

            updateUrlAndFetch(parentRegion, selectedSubregion, false, true);
        }
    });

    // Back/Forward Support
    window.addEventListener("popstate", function () {
        location.reload();
    });

    // Accordion Toggle
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const answer = this.closest(".faq-item").querySelector(".faq-answer");
            const header = this.closest(".faq-item").querySelector(".faq-header");
            const isOpen = answer.style.display === "block";

            answer.style.display = isOpen ? "none" : "block";
            header.style.backgroundColor = isOpen ? "" : "#c8102e";
            header.style.color = isOpen ? "" : "#fff";
            this.style.color = isOpen ? "" : "#fff";
            this.textContent = isOpen ? "+" : "−";
        });
    });
    updateInitialUrl();
    bindDrawerEvents();
});
