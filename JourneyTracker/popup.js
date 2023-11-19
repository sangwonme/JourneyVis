document.getElementById("resetBtn").addEventListener("click", function() {
  chrome.storage.local.set({ searchLogs: [] });
});


document.getElementById("exportBtn").addEventListener("click", function() {
  chrome.storage.local.get({ searchLogs: [] }, function (result) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "logtype,"
      csvContent += "title,"
      csvContent += "query,"
      csvContent += "startYear,"
      csvContent += "endYear,"
      csvContent += "citedBy,"
      csvContent += "authorID,"
      csvContent += "cluster,"
      csvContent += "url,"
      csvContent += "Timestamp\r\n"; // CSV Header
      result.searchLogs.forEach(function(log) {
          let row = `${log.logtype},${log.title},${log.query},${log.yearStart},${log.yearEnd},${log.citedBy},${log.authorID},${log.cluster},${log.url},${log.timestamp}`;
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
