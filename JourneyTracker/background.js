chrome.webNavigation.onCommitted.addListener(
    function(details) {
        // Check if the URL is a Google Scholar search query
        if (details.url.includes("https://scholar.google.")) {
            let url = new URL(details.url);
            let searchTerm = url.searchParams.get("q");
            let searchYearStart = url.searchParams.get("as_ylo");
            let searchYearEnd = url.searchParams.get("as_yhi");
            if (searchTerm) {
                console.log("Google Scholar Search Term:", searchTerm);
            }
            if (searchYearEnd) {
                console.log("Google Scholar Search Year:", searchYearStart + "~" + searchYearEnd);
            }
            else if (searchYearStart) {
                console.log("Google Scholar Search Year:", searchYearStart);
            }

            // TODO : save to DB

        }
    },
    {urls: [
        "https://scholar.google.com/*",
    ]}
);
