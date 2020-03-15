window.addEventListener('load', () => {
    try {
        let pathName = '..' + window.location.pathname
        let element = document.querySelector(`a[href='${pathName}']`)

        element.classList += ' active'
    } catch (err) {
        // ignorer
    }
})