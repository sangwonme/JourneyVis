chrome.webNavigation.onCommitted.addListener(
    function(details) {
        if (details.url.includes("https://scholar.google.")) {
            let url = new URL(details.url);
            let query = url.searchParams.get("q");
            let yearStart = url.searchParams.get("as_ylo");
            let yearEnd = url.searchParams.get("as_yhi");
            let citedBy = url.searchParams.get("cites");
            let cluster = url.searchParams.get("cluster");
            let authorID = url.searchParams.get("user");

            if(query || citedBy || authorID){
                // Store data in chrome local storage
                chrome.storage.local.get({ searchLogs: [] }, function (result) {
                    let searchLogs = result.searchLogs;
                    let searchAction = {
                        logtype: "action",
                        title: '',
                        query: query,
                        yearStart: yearStart,
                        yearEnd: yearEnd,
                        citedBy: citedBy,
                        cluster: cluster,
                        authorID: authorID,
                        url: details.url,
                        timestamp: new Date().toISOString()
                    };
                    searchLogs.push(searchAction);
                    chrome.storage.local.set({ searchLogs: searchLogs });
                });
            }

        }
    },
    {urls: [
        "https://scholar.google.com/*", 
        "https://scholar.google.co.kr/*"
    ]}
);
