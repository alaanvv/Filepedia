const form = document.querySelector('form')

function sendData(endpoint) {
  const [username, password] = desestructureForm(form, ['username', 'password'])
  if (!username || !password) return showErrorMessage('Fill all fields')

  _fetch(endpoint, {username, password})
    .then(res => {
      if (!res.status) showErrorMessage(res.error)
      else {
        localStorage.setItem('logged', username)
        window.location.href = '/index.html'
      }
    })

  form.reset()
}

form.addEventListener('submit', e => { e.preventDefault() })