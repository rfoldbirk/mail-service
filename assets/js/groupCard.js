const groups = document.getElementById('server_groups').value

try {
    const G = JSON.parse(groups)
    

} catch (err) {
    // så er der ikke nogen grupper
    let div = createCard('I begyndelsen var der stille...', 0, 'Hvad med at oprette en ny gruppe?!', true)
    
    
    div.querySelector('h6').remove()
    div.querySelector('p').style['margin-top'] = '32px'
    div.querySelector('button').innerText = "Opret gruppe"
    div.querySelector('a').remove()
}


function createCard(titel, medlemmer, beskrivelse) {
    const father = document.getElementById('CardHolder')
    if (!father || !titel || !beskrivelse) return

    let outerDiv = document.createElement('div')
    outerDiv.classList = "card"
    outerDiv.style['width'] = "18rem"

    let innerDiv = document.createElement('div')
    innerDiv.classList = "card-body shadow"

    let h5 = document.createElement('h5')
    h5.classList = "card-title"
    h5.innerText = titel

    
    let h6 = document.createElement('h6')
    h6.classList = "card-subtitle mb-2 text-muted"
    let ending = (medlemmer != 1 ) ? 'medlemmer' : 'medlem'
    h6.innerText = medlemmer + ' ' + ending


    let p = document.createElement('p')
    p.classList = "card-text"
    p.innerText = beskrivelse

    let btn = document.createElement('button')
    btn.type = "button"
    btn.classList = "btn btn-outline-success"
    btn.innerText = titel
    btn['data-toggle'] = "modal"
    btn['data-target'] = "#exampleModal"
    btn['data-whatever'] = "23x12379nx" // TODO: tilføj gruppe id
    btn.innerText = "Tilføj person"

    let a = document.createElement('a')
    a.classList = 'btn btn-outline-primary'
    a.style['float'] = 'right'
    a.href = '#'
    a.innerText = 'Rediger'

    // appending

    innerDiv.appendChild(h5)
    innerDiv.appendChild(h6)
    innerDiv.appendChild(p)
    innerDiv.appendChild(btn)
    innerDiv.appendChild(a)

    outerDiv.appendChild(innerDiv)
    father.appendChild(outerDiv)

    return outerDiv
}