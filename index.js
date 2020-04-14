addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  if (response.ok) {
    let json = await response.json();
    let variants = json.variants;
    let variant = Math.random() < 0.5 ? 'variant1' : 'variant2';
    let url = variant == 'variant1' ? variants[0] : variants[1];

    let varResponse = await fetch(url);
    if (varResponse.ok) {
      let text = await varResponse.text();
      return new Response(text, {
        headers: { 'content-type': 'text/html' },
      });
    }
  } else {
    return new Response('No response', {
      headers: { 'content-type': 'text/plain' },
    })
  }

}