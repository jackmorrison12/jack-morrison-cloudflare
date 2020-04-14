addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {Request} request
 */
async function handleRequest(request) {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  if (response.ok) {
    let json = await response.json();
    let variants = json.variants;

    const cookie = request.headers.get('cookie');
    let variant = ''

    // Find cookie if it exists, otherwise create it
    if (cookie && cookie.includes(`jack=variant1`)) {
      variant = "variant1"
    } else if (cookie && cookie.includes(`jack=variant2`)) {
      variant = "variant2"
    } else {
      variant = Math.random() < 0.5 ? 'variant1' : 'variant2';
    }

    let url = variant == 'variant1' ? variants[0] : variants[1];
    let varResponse = await fetch(url);

    if (varResponse.ok) {
      let text = await varResponse.text();

      // Set the cookie to persist for a day from last site load
      response =  new Response(text, {
        headers: { 'content-type': 'text/html' , 'Set-Cookie': `jack=${variant}; Max-Age=86400;`},
      });

      return new HTMLRewriter().on('*', new ElementHandler(variant)).transform(response);
    }

  } else {
    return new Response('No variants returned', {
      headers: { 'content-type': 'text/plain' },
    })
  }

}

// Create an element handler to personalise site, depending on value of 'variant'
class ElementHandler {

  constructor(variant) {
    this.variant = variant
  }

  element(element) {
    if (element.tagName == 'title') {
      this.variant == 'variant1' ? element.setInnerContent('Jack\'s Personal Webpage') : element.setInnerContent('Jack\'s Github');
    }

    if (element.tagName == 'h1' && element.getAttribute('id') == 'title') {
      this.variant == 'variant1' ? element.setInnerContent('Jack\'s Personal Webpage') : element.setInnerContent('Jack\'s Github');
    }

    if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
      this.variant == 'variant1' ? element.setInnerContent('Follow the link to find lots of interesting information on my projects!') : element.setInnerContent('Follow the link to see the code powering all of my projects!');
    }

    if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
      this.variant == 'variant1' ? element.setInnerContent('Go to jackmorrison.xyz') && element.setAttribute('href','https://jackmorrison.xyz') : element.setInnerContent('Go to GitHub') && element.setAttribute('href','http://github.com/jackmorrison12/');
    }
    
  }
}