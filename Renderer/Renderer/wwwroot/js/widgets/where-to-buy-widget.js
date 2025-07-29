document.addEventListener("DOMContentLoaded", function () {
    // Element References
    const tabLinks = document.querySelectorAll("#regionTabs .nav-link");
    const subRegionFilter = document.getElementById("subRegionFilter");
    const mobileTabLinks = document.querySelectorAll("#mobileRegionTabs .nav-link");
    const mobileSubRegionFilter = document.querySelectorAll(".mobile-subregion-tabs .subregion-nav-link");
    const contentContainer = document.getElementById("dynamicContent");
    
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

    // Async Fetch Handlers
    async function updateUrlAndFetch(region = null, subregion = null, clearSubregion = false) {
        const url = new URL(window.location.href);
        if (region !== null) url.searchParams.set("region", region);
        if (clearSubregion) url.searchParams.delete("subregion");
        else if (subregion !== null) url.searchParams.set("subregion", subregion);

        history.pushState({}, "", url);

        const tbody = contentContainer.querySelector("tbody");
        tbody
            ? (tbody.innerHTML = ` <div class="skeleton-wrapper">
                <div class="skeleton-content">
                    <div class="skeleton-line shimmer"></div>
                    <div class="skeleton-line shimmer"></div>
                </div>
            </div>`)
            : (contentContainer.innerHTML = `<div class="skeleton-wrapper">
                <div class="skeleton-content">
                    <div class="skeleton-line shimmer"></div>
                    <div class="skeleton-line shimmer"></div>
                </div>
            </div>`);

        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const newContent = doc.querySelector("#dynamicContent");
            if (newContent) {
                setTimeout(() => {
                    contentContainer.innerHTML = newContent.innerHTML;
                }, 1500);
               // contentContainer.innerHTML = newContent.innerHTML;
            }

            const newSubRegionFilter = doc.querySelector("#subRegionFilter");
            if (newSubRegionFilter && clearSubregion) {
                subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
                subRegionFilter.value = "";
            }

            bindDrawerEvents();
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    async function updateUrlAndFetchMobileDevice(region = null, subregion = null, clearSubregion = false) {
        const url = new URL(window.location.href);
        if (region !== null) url.searchParams.set("region", region);
        if (clearSubregion) url.searchParams.delete("subregion");
        else if (subregion !== null) url.searchParams.set("subregion", subregion);

        history.pushState({}, "", url);

        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const newContent = doc.querySelector("#dynamicContent");
            if (newContent) {
                contentContainer.innerHTML = newContent.innerHTML;
            }

            const newMobileTbody = doc.querySelector(".mobile-content-tbody");
            const mobileTbody = document.querySelector(".mobile-content-tbody");
            mobileTbody.innerHTML = `<tr> <div class="skeleton-wrapper">
                <div class="skeleton-content">
                    <div class="skeleton-line shimmer"></div>
                    <div class="skeleton-line shimmer"></div>
                </div>
            </div>
            </tr>`;
            if (newMobileTbody && mobileTbody) {
               mobileTbody.innerHTML = newMobileTbody.innerHTML;
            }

            const newMobileDrawerBreadcrumb = doc.querySelector(".mobile-drawer-breadcrumb");
            const mobileDrawerBreadcrumb = document.querySelector(".mobile-drawer-breadcrumb");
            if (newMobileDrawerBreadcrumb && mobileDrawerBreadcrumb) {
                mobileDrawerBreadcrumb.innerHTML = newMobileDrawerBreadcrumb.innerHTML;
            }

            const newSubRegionFilter = doc.querySelector("#subRegionFilter");
            if (newSubRegionFilter && clearSubregion) {
                subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
                subRegionFilter.value = "";
            }
            if (newSubRegionFilter && !clearSubregion) {
                subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
                subRegionFilter.value = subregion;
            }

            bindDrawerEvents();
        } catch (err) {
            console.error("Mobile fetch error:", err);
        }
    }

    // Desktop Interactions
    tabLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedRegion = this.getAttribute("data-region");
            const currentRegion = new URL(window.location.href).searchParams.get("region");
            if (currentRegion === selectedRegion) return;

            tabLinks.forEach(l => l.classList.remove("tab-active"));
            this.classList.add("tab-active");

            updateUrlAndFetch(selectedRegion, null, true);
        });
    });

    subRegionFilter.addEventListener("change", function () {
        const selectedSubregion = this.value;
        const currentSubregion = new URL(window.location.href).searchParams.get("subregion") || "";
        if (currentSubregion === selectedSubregion) return;
        updateUrlAndFetch(null, selectedSubregion, false);
    });

    // Mobile Interactions
    mobileTabLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedRegion = this.getAttribute("data-region");
            const currentRegion = new URL(window.location.href).searchParams.get("region");
            if (currentRegion === selectedRegion) return;

            updateUrlAndFetchMobileDevice(selectedRegion, null, true);
        });
    });

    mobileSubRegionFilter.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedSubregion = this.getAttribute("data-region");
            const faqItem = this.closest('.faq-item');
            const parentRegion = faqItem.querySelector('.faq-question')?.getAttribute('data-region');
            if (!parentRegion) return;

            updateUrlAndFetchMobileDevice(parentRegion, selectedSubregion, false);
        });
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

    // Responsive Resize Handling
    let lastIsMobile = window.innerWidth <= 576;

    async function fetchOnResize() {
        try {
            const res = await fetch(window.location.href);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const newBreadcrumb = doc.querySelector(".mobile-drawer-breadcrumb");
            const currentBreadcrumb = document.querySelector(".mobile-drawer-breadcrumb");
            if (newBreadcrumb && currentBreadcrumb) {
                currentBreadcrumb.innerHTML = newBreadcrumb.innerHTML;
            }

            const newMobileTbody = doc.querySelector(".mobile-content-tbody");
            const mobileTbody = document.querySelector(".mobile-content-tbody");
            if (newMobileTbody && mobileTbody) {
                mobileTbody.innerHTML = newMobileTbody.innerHTML;
            }

            bindDrawerEvents();
        } catch (err) {
            console.error("Resize fetch error:", err);
        }
    }

    window.addEventListener("resize", () => {
        const isMobileNow = window.innerWidth <= 576;

        if (lastIsMobile && !isMobileNow) {
            const regionFromUrl = new URL(window.location.href).searchParams.get("region");
            document.querySelectorAll("#regionTabs .nav-link").forEach(link => {
                link.classList.remove("tab-active");
                if (link.getAttribute("data-region") === regionFromUrl) {
                    link.classList.add("tab-active");
                }
            });
        }

        if (!lastIsMobile && isMobileNow) {
            const regionFromUrl = new URL(window.location.href).searchParams.get("region");
            bindDrawerEvents();

            document.querySelectorAll("#mobileRegionTabs .nav-link").forEach(link => {
                link.classList.remove("tab-active");
                if (link.getAttribute("data-region") === regionFromUrl) {
                    link.classList.add("tab-active");
                }
            });

            fetchOnResize();
        }

        lastIsMobile = isMobileNow;
    });

    // Init
    updateInitialUrl();
    bindDrawerEvents();
});












//document.addEventListener("DOMContentLoaded", function () {
//    // Element References
//    const tabLinks = document.querySelectorAll("#regionTabs .nav-link");
//    const subRegionFilter = document.getElementById("subRegionFilter");
//    const mobileTabLinks = document.querySelectorAll("#mobileRegionTabs .nav-link");
//    const mobileSubRegionFilter = document.querySelectorAll(".mobile-subregion-tabs .subregion-nav-link");
//    const contentContainer = document.getElementById("dynamicContent");
//    const toggleButtons = document.querySelectorAll(".faq-toggle");
//    const body = document.body;

//    // Drawer Controls: Binds open/close logic dynamically
//    function bindDrawerEvents() {
//        const openBtn = document.getElementById("openDrawerBtn");
//        const closeBtn = document.getElementById("closeDrawerBtn");
//        const overlay = document.getElementById("drawerOverlay");
//        const panel = document.getElementById("drawerPanel");


//        document.addEventListener("click", function (e) {
//            if (e.target.id === "openDrawerBtn") {
//                const overlay = document.getElementById("drawerOverlay");
//                const panel = document.getElementById("drawerPanel");
//                if (overlay && panel) {
//                    body.classList.add('drawer-open');
//                    overlay.classList.add("show");
//                    panel.classList.add("open");
//                }
//            }

//            if (e.target.id === "closeDrawerBtn" || e.target.id === "drawerOverlay") {
//                const overlay = document.getElementById("drawerOverlay");
//                const panel = document.getElementById("drawerPanel");
//                if (overlay && panel) {
//                    body.classList.remove('drawer-open');
//                    overlay.classList.remove("show");
//                    panel.classList.remove("open");
//                }
//            }
//        });
//        //function closeDrawer() {
//        //    overlay.classList.remove("show");
//        //    panel.classList.remove("open");
//        //}

//        //closeBtn.addEventListener("click", closeDrawer);
//        //overlay.addEventListener("click", closeDrawer);
//    }

//    // URL Management
//    function updateInitialUrl() {
//        const url = new URL(window.location.href);
//        const currentRegion = url.searchParams.get("region");

//        if (!currentRegion) {
//            const activeTab = document.querySelector("#regionTabs .nav-link.tab-active");
//            if (activeTab) {
//                const firstRegion = activeTab.getAttribute("data-region");
//                url.searchParams.set("region", firstRegion);
//                history.replaceState({}, "", url);
//            }
//        }
//    }

//    function updateUrlAndFetch(region = null, subregion = null, clearSubregion = false) {
//        const url = new URL(window.location.href);
//        if (region !== null) url.searchParams.set("region", region);
//        if (clearSubregion) url.searchParams.delete("subregion");
//        else if (subregion !== null) url.searchParams.set("subregion", subregion);

//        history.pushState({}, "", url);

//        const tbody = contentContainer.querySelector("tbody");
//        if (tbody) {
//            tbody.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>Loading...</td></tr>";
//        } else {
//            contentContainer.innerHTML = "<p>Loading...</p>";
//        }

//        fetch(url)
//            .then(res => res.text())
//            .then(html => {
//                const parser = new DOMParser();
//                const doc = parser.parseFromString(html, "text/html");

//                const newContent = doc.querySelector("#dynamicContent");
//                if (newContent) {
//                    contentContainer.innerHTML = newContent.innerHTML;
//                }

//                const newSubRegionFilter = doc.querySelector("#subRegionFilter");
//                if (newSubRegionFilter && clearSubregion) {
//                    subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
//                    subRegionFilter.value = "";
//                }

//                // Rebind drawer events if any parts are replaced
//                bindDrawerEvents();
//            });
//    }

//    function updateUrlAndFetchMobileDevice(region = null, subregion = null, clearSubregion = false) {
//        const url = new URL(window.location.href);
//        if (region !== null) url.searchParams.set("region", region);
//        if (clearSubregion) url.searchParams.delete("subregion");
//        else if (subregion !== null) url.searchParams.set("subregion", subregion);

//        history.pushState({}, "", url);

//        const tbody = contentContainer.querySelector("tbody");
//        if (tbody) {
//            tbody.innerHTML = "<tr><td colspan='4' style='text-align: center; padding: 20px;'>Loading...</td></tr>";
//        } else {
//            contentContainer.innerHTML = "<p>Loading...</p>";
//        }

//        fetch(url)
//            .then(res => res.text())
//            .then(html => {
//                const parser = new DOMParser();
//                const doc = parser.parseFromString(html, "text/html");

//                const newContent = doc.querySelector("#dynamicContent");
//                if (newContent) {
//                    contentContainer.innerHTML = newContent.innerHTML;
//                }

//                const newMobileTbody = doc.querySelector(".mobile-content-tbody");
//                const mobileTbody = document.querySelector(".mobile-content-tbody");
//                if (newMobileTbody && mobileTbody) {
//                    mobileTbody.innerHTML = newMobileTbody.innerHTML;
//                }

//                const newMobileDrawerBreadcrumb = doc.querySelector(".mobile-drawer-breadcrumb");
//                const mobileDrawerBreadcrumb = document.querySelector(".mobile-drawer-breadcrumb");
//                if (newMobileDrawerBreadcrumb && mobileDrawerBreadcrumb) {
//                    mobileDrawerBreadcrumb.innerHTML = newMobileDrawerBreadcrumb.innerHTML;
//                }

//                const subRegionFilter = document.querySelector("#subRegionFilter");
//                const newSubRegionFilter = doc.querySelector("#subRegionFilter");

//                if (newSubRegionFilter && subRegionFilter && clearSubregion) {
//                    subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
//                    subRegionFilter.value = "";
//                }
//                if (subRegionFilter && newSubRegionFilter && !clearSubregion) {
//                    subRegionFilter.innerHTML = newSubRegionFilter.innerHTML;
//                    subRegionFilter.value = subregion;
//                }

//                bindDrawerEvents();
//            });
//    }

//    // Desktop Event Bindings
//    tabLinks.forEach(link => {
//        link.addEventListener("click", function (e) {
//            e.preventDefault();
//            const selectedRegion = this.getAttribute("data-region");
//            const currentRegion = new URL(window.location.href).searchParams.get("region");
//            if (currentRegion === selectedRegion) return;

//            tabLinks.forEach(l => l.classList.remove("tab-active"));
//            this.classList.add("tab-active");

//            updateUrlAndFetch(selectedRegion, null, true);
//        });
//    });

//    subRegionFilter.addEventListener("change", function () {
//        const selectedSubregion = this.value;
//        const currentSubregion = new URL(window.location.href).searchParams.get("subregion") || "";
//        if (currentSubregion === selectedSubregion) return;

//        updateUrlAndFetch(null, selectedSubregion, false);
//    });

//    // Mobile Event Bindings
//    mobileTabLinks.forEach(link => {
//        link.addEventListener("click", function (e) {
//            e.preventDefault();
//            const selectedRegion = this.getAttribute("data-region");
//            const currentRegion = new URL(window.location.href).searchParams.get("region");
//            if (currentRegion === selectedRegion) return;

//            updateUrlAndFetchMobileDevice(selectedRegion, null, true);
//        });
//    });

//    mobileSubRegionFilter.forEach(link => {
//        link.addEventListener("click", function (e) {
//            e.preventDefault();
//            const selectedSubregion = this.getAttribute("data-region");
//            const faqItem = this.closest('.faq-item');
//            const parentRegionLink = faqItem.querySelector('.faq-question');
//            const parentRegion = parentRegionLink.getAttribute('data-region');

//            updateUrlAndFetchMobileDevice(parentRegion, selectedSubregion, false);
//        });
//    });

//    // Back/Forward Navigation
//    window.addEventListener("popstate", function () {
//        location.reload();
//    });

//    // Accordion Toggle
//    toggleButtons.forEach(button => {
//        button.addEventListener("click", function () {
//            const answer = this.closest(".faq-item").querySelector(".faq-answer");
//            const isOpen = answer.style.display === "block";
//            const header = this.closest(".faq-item").querySelector(".faq-header");

//            answer.style.display = isOpen ? "none" : "block";
//            header.style.backgroundColor = isOpen ? "" : "#c8102e";
//            header.style.color = isOpen ? "" : "#fff";
//            this.style.color = isOpen ? "" : "#fff";
//            this.textContent = isOpen ? "+" : "−";
//        });
//    });

//    // Responsive Resize Handling
//    let lastIsMobile = window.innerWidth <= 576;

//    window.addEventListener("resize", () => {
//        const isMobileNow = window.innerWidth <= 576;
//        if (lastIsMobile && !isMobileNow) {
//            const regionFromUrl = new URL(window.location.href).searchParams.get("region");
//            document.querySelectorAll("#regionTabs .nav-link").forEach(link => {
//                link.classList.remove("tab-active");
//                if (link.getAttribute("data-region") === regionFromUrl) {
//                    link.classList.add("tab-active");
//                }
//            });
//        }

//        if (!lastIsMobile && isMobileNow) {
//            const regionFromUrl = new URL(window.location.href).searchParams.get("region");
//            bindDrawerEvents();
//            document.querySelectorAll("#mobileRegionTabs .nav-link").forEach(link => {
//                link.classList.remove("tab-active");
//                if (link.getAttribute("data-region") === regionFromUrl) {
//                    link.classList.add("tab-active");
//                }
//            });

//            fetch(window.location.href)
//                .then(res => res.text())
//                .then(html => {
//                    const parser = new DOMParser();
//                    const doc = parser.parseFromString(html, "text/html");

//                    const newBreadcrumb = doc.querySelector(".mobile-drawer-breadcrumb");
//                    const currentBreadcrumb = document.querySelector(".mobile-drawer-breadcrumb");
//                    if (newBreadcrumb && currentBreadcrumb) {
//                        currentBreadcrumb.innerHTML = newBreadcrumb.innerHTML;
//                    }

//                    const newMobileTbody = doc.querySelector(".mobile-content-tbody");
//                    const mobileTbody = document.querySelector(".mobile-content-tbody");
//                    if (newMobileTbody && mobileTbody) {
//                        mobileTbody.innerHTML = newMobileTbody.innerHTML;
//                    }

//                    // 💡 Fix: Rebind drawer events after DOM update
//                    bindDrawerEvents();
//                });
//        }

//        lastIsMobile = isMobileNow;
//    });

//    // Init
//    updateInitialUrl();
//    bindDrawerEvents();
//});










