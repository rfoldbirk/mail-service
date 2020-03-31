function toggleLight() {
    let body = document.querySelector('body')
    let theme = body.classList[0]

    var link  = document.querySelector('#smooth-transition')
    link.disabled = false

    setTimeout(function () {
        let btn = document.querySelector('.turnOffLight')

        let newTheme = 'theme-'
    
        if (theme == 'theme-light') {
            newTheme += 'dark'
            btn.innerHTML = 'Tænd for lyset'
        } else {
            newTheme += 'light'
            btn.innerHTML = 'Sluk for lyset'
        }
    
        document.cookie = "theme=  expires = Thu, 01 Jan 1970 00:00:00 GMT"
        
        let str = newTheme.replace('-', '=')
        document.cookie = str+"; path=/ "
    
        body.classList = newTheme

        setTimeout(function () {
        
            link.disabled = true
        }, 300)

    }, 300)

    
}