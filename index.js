/**
 * Stores gitignore files in a KV store for 
 */

const remoteHost = "https://api.github.com/"
const remoteUrl = remoteHost + "repos/github/gitignore/contents"

const contentHost = "https://raw.githubusercontent.com/"
const contentUrl = contentHost + "github/gitignore/master"

const setCache = async (key, data) => await GITIGNORES.put(key, data, {expirationTtl: 60 * 60})
const getCache = async key => await GITIGNORES.get(key)

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const json = await response.json()
    return JSON.stringify(json.filter(file => file.path.endsWith(".gitignore")))
  }
  else {
    return response.text()
  }
}

function getFileUrl (path) {
  if(path === '/') {
    return remoteUrl
  } else if (path.endsWith('.gitignore')) {
    return contentUrl + path
  }
}
 
 async function handleRequest(request) {
  const requestUrl = new URL(request.url)
  const url = getFileUrl(requestUrl.pathname)

  if(url) {
    let response 
    
    const requestHeaders = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "User-Agent": "gitignore-fetch",
        "Authorization": `token ${OAUTH_TOKEN}`
      }
    }

    const cache = await getCache(requestUrl.pathname)
    if (!cache) {
      console.log("Filling cache")
      const data = await fetch(url, requestHeaders)
      response = await gatherResponse(data)
      await setCache(requestUrl.pathname, JSON.stringify(response))
    } else {
      console.log("Using cache")
      response = JSON.parse(cache)
    }
    
    return new Response(response, requestHeaders)
  } else {
    return new Response("404: Not Found", {status: 404})
  }  
}
 
addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})