const form = document.querySelector('form')

form.addEventListener('submit', e => {
  e.preventDefault()

  const [title, subtitle, body] = desestructureForm(form, ['title', 'subtitle', 'body'])
  const author = localStorage.getItem('logged')
  if (!title || !subtitle || !body) return showErrorMessage('Fill all fields')

  _fetch('publish', {title, subtitle, body, author})
    .then(res => {
      if (!res.status) showErrorMessage(res.error)
      else window.location.href = `/post.html?id=${res.id}`
    })
    
  form.reset()
})

function openPreview() {
  const [title, text] = desestructureForm(form, ['title', 'body'])
  sessionStorage.setItem('preview-title', title)
  sessionStorage.setItem('preview-text', text)

  window.open('/post-writing-preview.html', '_blank').focus()
}