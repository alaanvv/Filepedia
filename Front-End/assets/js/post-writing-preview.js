const [title, text, author, timestamp] = [sessionStorage.getItem('preview-title'), sessionStorage.getItem('preview-text')]

createComponent(document.querySelector('.content'), 'post', { title, text })