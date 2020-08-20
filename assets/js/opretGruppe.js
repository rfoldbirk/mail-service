const IP = 'http://localhost'

window.addEventListener('load', (event) => {
    let opret = document.getElementById('opretGruppeBtn')
    let gni = document.getElementById('gruppeNavnInput')

    console.log('hey')

    opret.addEventListener('click', (event) => {
        let name = document.getElementById('gruppeNavnInput')

        fixSpaces('gruppeNavnInput')

        let content = {
            name: name.value,
            desc: "Bare en beskrivelse",
            afmeldelse: true
        }

        
        const data = { 
            gname: name.value,
            beskrivelse: document.getElementById('gruppeBeskInput').value,
            afmeldelse: true
        }

        fetch('/api/opretGruppe', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                setTimeout(500, feedback(data))
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        
    })

    gni.addEventListener('keydown', (event) => {
        fixSpaces('gruppeNavnInput')
    })
})

function feedback(data) {
    let name = document.getElementById('gruppeNavnInput')
    console.log(data)
    if (!data.res) {
        if (data.why == 'gname:exists') {
            wrongInput(name, true)
        }
    }
}


let btnState = false
let texts = ['Opret gruppe', 'Opretter...']
function oBtnSwitch(state) {
    btnState = state || !btnState

    let btn = document.getElementById('opretGruppeBtn')
    let spin = btn.querySelector('span')
    let text = btn.querySelectorAll('span')[1]

    text.innerText = texts[Number(!btnState)]
    btn.disabled = !btnState
    spin.hidden = btnState
}

function wrongInput(object, valid) {
    if (!object) return

    let classname = (valid) ? ' is-valid':' is-invalid'
    
    let alreadyInvalid = false
    for (x of object.classList) {
        if (x == 'is-invalid')
            alreadyInvalid = true
    }
    if (!alreadyInvalid) {
        object.classList += ' is-invalid'
    }
}

function fixSpaces(id) {
    // fjernelse af mellemrum før ord

    let name = document.getElementById(id)
    let nameV = name.value

    let nameArr = nameV.split('')
    let nameRV = ''
    let excludeSpaces = true

    for (x of nameArr) {
        if (x == ' ' && excludeSpaces) {
            // ingenting
        } else {
            // bogstav
            excludeSpaces = false
            nameRV += x
        }
    }

    name.value = nameRV
}