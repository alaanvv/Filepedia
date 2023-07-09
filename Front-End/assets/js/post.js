_fetch('post', {id: new URLSearchParams(window.location.search).get('id')})
  .then(res => {
    const [id, title, text, author, timestamp] = [res.post[0], res.post[1], res.post[3], res.post[4], res.post[5]]
    
    createComponent(document.querySelector('.content'), 'post', {title, text, footer: `${author} - ${timestamp}`})
      .then(() => {
        if (author === localStorage.getItem('logged')) {
          const deleteBtn = document.querySelector('.delete')
          deleteBtn.innerText = ' (Delete Post)'
          deleteBtn.onclick = () => {
            _fetch('delete-post', {id})
              .then(() => { window.location.href = '/' })
          }
        }
      })
  })