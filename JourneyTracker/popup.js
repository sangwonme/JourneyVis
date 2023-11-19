document.getElementById("resetBtn").addEventListener("click", function() {
  chrome.storage.local.set({ searchLogs: [] });
});

document.getElementById("exportBtn").addEventListener("click", function() {
  chrome.storage.local.get({ searchLogs: [] }, function (result) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "\"logtype\","
      csvContent += "\"title\","
      csvContent += "\"query\","
      csvContent += "\"startYear\","
      csvContent += "\"endYear\","
      csvContent += "\"citedBy\","
      csvContent += "\"authorID\","
      csvContent += "\"cluster\","
      csvContent += "\"url\","
      csvContent += "\"Timestamp\"\r\n"; // CSV Header
      result.searchLogs.forEach(function(log) {
          let row = `"${escapeCSV(log.logtype)}",`
                   + `"${escapeCSV(log.title)}",`
                   + `"${escapeCSV(log.query)}",`
                   + `"${escapeCSV(log.yearStart)}",`
                   + `"${escapeCSV(log.yearEnd)}",`
                   + `"${escapeCSV(log.citedBy)}",`
                   + `"${escapeCSV(log.authorID)}",`
                   + `"${escapeCSV(log.cluster)}",`
                   + `"${escapeCSV(log.url)}",`
                   + `"${escapeCSV(log.timestamp)}"`;
          csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "search_logs.csv");
      document.body.appendChild(link);
      link.click();
  });
});

function escapeCSV(text) {
  // Check if text is null or undefined
  if (text === null || text === undefined) {
      return '';
  }
  // Convert text to string in case it's not and escape double quotes
  return String(text).replace(/"/g, '""');
}
