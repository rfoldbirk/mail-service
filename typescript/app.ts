console.clear()
console.log("Mail-Service v2.0.0")

/*

# Alt hvad programmet skal kunne gøre:

    - [ ] smide web-requests videre til et andet script som så kan bestemme hvad der skal ske. Jeg tænker vi kalder vi filen: 'requestHandler.ts'

    - [ ] Vi skal også lave en funktion, som sender en mail afsted ud fra indhold.
        - Den skal returner true, hvis alt går godt, men hvis den ikke får nok argumenter, 
          den returnere false, og så en grund.

    - [ ] Vi 'render' alt på client siden, med undtagelsen af det vi sender afsted i mails, det betyder.

*/

import { load } from "./load"
const { fs, bodyParser, cookieParser, http, https, privateKey, certificate, credentials, app }: any = load()


app.use(function(req: any, res: any) {

    var {url, method, body, cookies} = req

    // der skal tjekkes om brugeren er logget ind.
    // der skal tjekkes om brugeren bare har mistet deres cookies.

	res.send('default')
})

