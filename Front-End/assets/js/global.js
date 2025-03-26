// Send request to the Flask app
function _fetch(endpoint, body) {
  return fetch(`https://filepedia.onrender.com//${endpoint}`, {
    method: 'POST',
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify(body)
  })
    .then(res => res.text())
    .then(json => JSON.parse(json))
}

// Send not logged user to account page
if (document.body.hasAttribute('requires-login') && !localStorage.getItem('logged')) window.location.href = './account.html'

// Account
function exitAccount() {
  localStorage.removeItem('logged')
  window.location.href = './account.html'
}

// Replace components
function replaceComponents() {
  return new Promise(resolve => {
    const componentRoots = document.querySelectorAll('*[component]')
    
    for (let componentRoot of componentRoots) {
      const componentName = componentRoot.getAttribute('component')
      const componentArgs = JSON.parse(componentRoot.getAttribute('args')) || {}
      
      fetch(`components/${componentName}.html`)
      .then(res => res.text())
      .then(html => {
        let match = true
        while (match) {
          match = html.match(/\${(.*?)}/)
          if (match) {
            if (componentArgs[match[1]]) html = html.replaceAll(`\${${match[1]}}`, componentArgs[match[1]])
            else html = html.replaceAll(`\${${match[1]}}`, '')
          }
        }
        
        // It's throwing an error but working pretty well
        try { componentRoot.outerHTML = html }
        catch {}

        resolve()
      })
    }
  })
}
replaceComponents()
  .then(e => { // Global codes that requires a component loaded
    const usernameDOM = document.querySelector('.account-name')
    if (usernameDOM) usernameDOM.innerText = localStorage.getItem('logged')
  })

function createComponent(inside, name, args) {
  return new Promise(resolve => {
    const component = document.createElement('div')
    component.setAttribute('component', name)
    component.setAttribute('args', JSON.stringify(args))
    inside.appendChild(component)
    
    replaceComponents()
      .then(() => { resolve() })
  })
}

// Show errors on the element with a class error
function showErrorMessage(err) {
  const errMessage = document.querySelector('.error')
  errMessage.innerText = err
}

// Desestructure form for attribution via desestructuring
function desestructureForm(form, keys) {
  const data = new FormData(form)
  const values = []

  for (let key of keys) values.push(data.get(key))
  return values
}
