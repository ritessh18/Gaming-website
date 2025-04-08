// hamburger and dropdown list
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const dropdowns = document.querySelectorAll(".dropdown > a");

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Handle dropdown clicks
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent link navigation
            
            const dropdownContent = dropdown.nextElementSibling;

            // Close other dropdowns before opening the clicked one
            document.querySelectorAll(".dropdown-content").forEach(content => {
                if (content !== dropdownContent) {
                    content.classList.remove("show");
                }
            });

            // Toggle visibility of the clicked dropdown
            dropdownContent.classList.toggle("show");
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown-content").forEach(content => {
                content.classList.remove("show");
            });
        }
    });
});



// search bar function
function searchFunction() {
    const input = document.getElementById('search').value.toLowerCase().trim();
    const body = document.body;
    const popup = document.getElementById("popup-box");

    // Clear previous highlights
    const highlighted = document.querySelectorAll(".highlighted-search");
    highlighted.forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });

    if (input === "") return;

    let matchCount = 0;
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            return node.parentNode.tagName !== "SCRIPT" &&
                   node.parentNode.tagName !== "STYLE" &&
                   node.nodeValue.toLowerCase().includes(input)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        }
    });

    let firstMatch = null;

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue;
        const lower = text.toLowerCase();

        if (lower.includes(input)) {
            matchCount++;

            const index = lower.indexOf(input);
            const before = document.createTextNode(text.slice(0, index));
            const match = document.createElement("mark");
            match.textContent = text.slice(index, index + input.length);
            match.className = "highlighted-search";
            const after = document.createTextNode(text.slice(index + input.length));

            const parent = node.parentNode;
            parent.replaceChild(after, node);
            parent.insertBefore(match, after);
            parent.insertBefore(before, match);

            // If match is inside dropdown-content, show it
            const dropdownContent = match.closest(".dropdown-content");
            if (dropdownContent) {
                dropdownContent.classList.add("show");
            }

            if (!firstMatch) firstMatch = match;
        }
    }

    if (matchCount === 0) {
        popup.textContent = "No results found.";
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 2500);
    } else {
        firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

