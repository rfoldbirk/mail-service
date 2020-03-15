window.addEventListener('load', () => {
    let emails = JSON.parse(document.getElementById('hidden-emails').innerText)

    let div = document.getElementById('emails')
    let selector = document.getElementById('email')

    let i = 0

    for (const elem of emails) {
        let email = elem.value
        let verified = elem.verified

        let new_btn = document.createElement('button')
        new_btn.classList = 'dropdown-item'
        if (!verified) new_btn.classList += ' disabled'

        new_btn.type = 'button'
        new_btn.innerText = email
        new_btn.value = i

        new_btn.onclick = (elem) => {
            selector.innerText = new_btn.innerText
            selector.value = new_btn.value
        }

        if (i == 0) {
            selector.innerText = new_btn.innerText
            selector.value = new_btn.value
        }
        
        div.appendChild(new_btn)

        i ++
    }
})