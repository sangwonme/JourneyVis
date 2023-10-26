document.addEventListener('click', function(event) {
  // Identify the clicked element
  let clickedElement = event.target;
  console.log("clicked!")

  // Find the ancestor div with the specific class
  let ancestor = clickedElement.closest('div.gs_r.gs_or.gs_scl');
  if (ancestor) {
    let titleText = ancestor.querySelector('h3 > a').textContent;
    if (titleText) {
      console.log(titleText);
    }
  }
}, true);
