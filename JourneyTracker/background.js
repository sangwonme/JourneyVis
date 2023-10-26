chrome.webNavigation.onCommitted.addListener(
    function(details) {
        // Check if the URL is a Google Scholar search query
        if (details.url.includes("https://scholar.google.")) {
            let url = new URL(details.url);
            let searchTerm = url.searchParams.get("q");
            if (searchTerm) {
                console.log("Google Scholar Search Term:", searchTerm);
                // Store or use the searchTerm as required
            }
        }
    },
    {urls: [
        "https://scholar.google.com/*",
    ]}
);
