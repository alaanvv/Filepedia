// DOM
const postsContainer = document.querySelector('.posts')
const searchInput = document.querySelector('.search-area input')
const searchBtn = document.querySelector('.search-area .btn')
const userPostsCheckbox = document.querySelector('.user-posts-checkbox')

document.querySelector('.user-posts-checkbox')

// MySql Params
const username = localStorage.getItem('logged')
const limit = 5
let offset = 0
let searching = ''
let user_filter = false

// Flags
let fetching = false
let loadedSomething = false // Used to check when to show a "No posts" message
let ended = false

function applyParams() {
  if (searchInput.value === searching && userPostsCheckbox.checked === user_filter) return

  offset = 0
  loadedSomething = false
  ended = false
  postsContainer.innerText = ''

  searching = searchInput.value
  user_filter = userPostsCheckbox.checked
  
  loadPosts()
}
function loadPosts() {
  if (fetching || ended) return
  fetching = true

  // Loading message
  const message = document.createElement('p')
  message.classList.add('post-list-message')
  message.innerText = 'Loading...'
  postsContainer.append(message)

  _fetch('get-posts', { searching, username: user_filter ? username : '', limit, offset })
    .then(res => {
      fetching = false

      if (!res.posts) {
        if (!loadedSomething) message.innerText = 'No posts'
        else message.remove()
        return ended = true
      }

      // Only reach here if some post exist
      message.remove()
      loadedSomething = true

      res.posts.map(post => createComponent(postsContainer, 'post-preview', {
        id: post[0],
        title: post[1],
        subtitle: post[2],
        author: post[4],
        timestamp: post[5]
      }))
    })

  // Increase offset so it will not load the same things next
  offset += limit
}
// Imediatelly loads some posts and let the rest for a interval and when user scroll to bottom
loadPosts()
const loadMore = setInterval(e => {if (ended) return clearInterval(loadMore); loadPosts()}, 5e3)
window.onscroll = e => { if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) loadPosts() }

// User panel
searchBtn.onclick = applyParams
userPostsCheckbox.onclick = applyParams