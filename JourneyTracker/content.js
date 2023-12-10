const searchContainerTag = 'div.gs_r.gs_or.gs_scl'
const searchTitle = 'h3.gs_rt > a'
const authorsearchContainerTag = 'tr.gsc_a_tr'
const authorsearchTitle = 'td.gsc_a_t > a'

document.addEventListener('click', function(event) {
  let clickedElement = event.target;

  if (clickedElement.tagName === 'A' || clickedElement.tagName === 'B') {
      event.preventDefault();

      let href = ''
      if (clickedElement.tagName === 'A'){
        href = clickedElement.href;
      }
      else{
        href = clickedElement.closest('a').href
      }

      let titleText = ''
      if(clickedElement.closest(searchContainerTag)){
        let con = clickedElement.closest(searchContainerTag)
        titleText = con.querySelector(searchTitle).textContent;
      }
      else if(clickedElement.closest(authorsearchContainerTag)){
        let con = clickedElement.closest(authorsearchContainerTag)
        titleText = con.querySelector(authorsearchTitle).textContent;
      }

      console.log(titleText)
      if(titleText != ''){
        chrome.storage.local.get('searchLogs', function (result) {
          let searchAction = {
            logtype: "paper",
            title: titleText,
            query: '',
            yearStart: '',
            yearEnd: '',
            citedBy: '',
            cluster: '',
            authorID: '',
            timestamp: new Date().toISOString()
          };
          console.log(result)
          let searchLogs = result.searchLogs;
          searchLogs.push(searchAction);
          chrome.storage.local.set({ searchLogs: searchLogs });
          console.log('write!')
          console.log(searchLogs[length(searchAction)])
        })
      }

      setTimeout(function() {
          window.location.href = href;
      }, 500); // Delay in milliseconds
  }
});
