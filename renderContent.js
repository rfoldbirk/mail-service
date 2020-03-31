function renderContent(req, res, title, content, user) {
    let d = new Date()
    let h = d.getHours()

    let theme = (h >= 6 && h < 18) ? 'theme-light':'theme-dark'

    try {
        let newTheme = req.session._ctx.headers.cookie.split('theme=')[1]

        if (newTheme.includes(';')) 
            newTheme = newTheme.split(';')[0]

        if (newTheme == 'dark' || newTheme == 'light') 
            theme = 'theme-'+newTheme

    } catch (err) {
        // ignorer
    }

    

    
    let loggedin = (req.user) ? true:false
    res.render('default', { url: req.url, theme: theme, loggedin: loggedin, title: title, content: content, user: req.user })
}

module.exports = renderContent