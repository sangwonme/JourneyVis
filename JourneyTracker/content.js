const searchContainerTag = 'div.gs_r.gs_or.gs_scl'
const searchTitle = 'h3.gs_rt > a'
const authorsearchContainerTag = 'tr.gsc_a_tr'
const authorsearchTitle = 'td.gsc_a_t > a'

document.addEventListener('click', function(event) {
  let clickedElement = event.target;

  if (clickedElement.tagName === 'A') {
      event.preventDefault();
      console.log(clickedElement);

      console.log(clickedElement.closest(searchContainerTag))
      console.log(clickedElement.closest(authorsearchContainerTag))

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
        console.log('write!')
        chrome.storage.local.get({ searchLogs: [] }, function (result) {
          let searchLogs = result.searchLogs;
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
          searchLogs.push(searchAction);
          chrome.storage.local.set({ searchLogs: searchLogs });
          console.log(searchLogs[length(searchAction)])
        })
      }

      setTimeout(function() {
          window.location.href = clickedElement.href;
      }, 500); // Delay in milliseconds
  }
});
