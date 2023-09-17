function validateUrl(urll) {
  // Create a regular expression to match a valid URL
  const url = new URL(urll.value);

  // Check if the URL is valid
  if (urll.protocol === 'http:' || urll.protocol === 'https:') {
    // The URL is valid
    return true;
  } else {
    return false;    // The URL is invalid
  }
}
let input = document.querySelector("input")

input.addEventListener('blur', () => {

  const url = input.value;

  //regular expression = regex
  // Get the URL from the input box
  // Validate the URL
  const isValidUrl = validateUrl(url);

  // If the URL is not valid, show an error message
  if (!isValidUrl) {
    alert('The URL you entered is not valid.');
    input.value = ''
  }
});
// let submit = document.querySelector("#submit")
// let result = document.querySelector(".result")
// const widget = document.querySelector('.widget');

const API_PASSWORD = 'fa89da7b78c8e95b';
const API_LOGIN_ID = 'khushipal1470@gmail.com';
const encodedCredentials = btoa(`${API_LOGIN_ID}:${API_PASSWORD}`);

const submitButton = document.querySelector('#submit');

submitButton.addEventListener('click', async () => {
  const url = input.value;

  // Create a loader element
  const loader = document.querySelector('#loader');
  loader.style.display = 'block';

  // Call the two APIs in parallel
  const [onPageData, screenshotData] = await Promise.all([
    fetch('https://api.dataforseo.com/v3/on_page/instant_pages', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          url,
          enable_javascript: true,
          custom_js: 'meta = {}; meta.url = document.URL; meta;',
        },
      ]),
    }),
    fetch('https://api.dataforseo.com/v3/on_page/page_screenshot', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          url,
          enable_javascript: true,
          custom_js: 'meta = {}; meta.url = document.URL; meta;',
        },
      ]),
    }),
  ]);

  // Hide the loader element
  loader.style.display = 'none';

  // Parse the JSON responses
  const onPageDataJson = await onPageData.json();
  const screenshotDataJson = await screenshotData.json();
  console.log(onPageDataJson);
  console.log(screenshotDataJson);
  // Get the page score and H2 tags
  const pageScore = onPageDataJson.tasks[0].result[0].items[0].onpage_score;

  const headingTags = onPageDataJson.tasks[0].result[0].items[0].meta.htags
  const metas = onPageDataJson.tasks[0].result[0].items[0].meta

  function displayHeadingTags(obj) {
    // Get a list of all the properties in the object.
    const propertyNames = Object.keys(obj);
  
    // Iterate over the list of properties and display the heading tags and their values in the UI.
    let headingTagsHtml = '';
    for (const propertyName of propertyNames) {
      
      if (propertyName.startsWith("h")) {
        headingTagsHtml += `<h2>#${obj[propertyName].length} ${propertyName} tags:</h2>`;
        for (const value of obj[propertyName]) {
          headingTagsHtml += `<h4>${value}</h4>`;
        }
      }
    }
  
    // Return the HTML for the heading tags.
    return headingTagsHtml;
  }

  // Get the page screenshot URL
  const screenshotUrl = screenshotDataJson.tasks[0].result[0].items[0].image;

  // Display the data on the UI
  const resultDiv = document.querySelector('.result');


  // Add the list element to the result div
  resultDiv.innerHTML = `
  <h1 class="title">${metas.title}</h2>
  <h2 class="score">Page Score: ${pageScore}</h2>

  <div class="links">
  <div><h2>Internal Links : ${metas.internal_links_count}</h2></div>
  <div><h2>External Links : ${metas.external_links_count}</h2></div>
  <div><h2>Images: ${metas.images_count}</h2></div>
  </div>
  <h1 class="heading">Heading Tags</h1>
  <div class="htags">
 
  ${displayHeadingTags(headingTags)}
    </div>
    <h1 class="fhead">Live Website</h1>
    <iframe src=${screenshotUrl} style="height: 400px; width: 100%;"/>
  `;
});
