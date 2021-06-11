const ul = document.querySelector('#entries')

document.addEventListener('click', event => {
  switch (event.target.id) {
    case "next":
      next()
      break
  }
})

let theIndex = 1

async function getData(theIndex) {
  ul.innerHTML = ""
  document.querySelector('#page-number').innerHTML = theIndex

  const responseFlow = await fetch(`http://localhost:8698/users?page=${theIndex}&limit=5`)
  const data = await responseFlow.json()

  const output = data.output

  output.forEach(entry => {
    const li = document.createElement('li')
    const p = document.createElement('p')
    p.innerHTML = entry.name

    li.append(p)
    ul.append(li)
  })
}

getData(theIndex)

function next() {
  theIndex++
  getData(theIndex)
}