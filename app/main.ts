
import { load } from "./modules/load"
const { fs, app, dirname }: any = load('Serveren kører!')

import { api, init_requestHandler } from "./modules/requestHandler"
init_requestHandler(dirname)


app.use(function(req: any, res: any) {
    const { url, method, body, cookies } = req
    

    let divideBySlash: string[] = url.split('/')
    let autoForward: string[] = ['css', 'js']


    switch (divideBySlash[1].toLowerCase()) {
        case 'api':
            api(req, res)
            break
    
        default:
            if (autoForward.includes(divideBySlash[1].toLowerCase())) {
                // * hvis nu url enten starter med en /css eller en /js
                // * så bliver man autoforwardet

                // tjek om mappen findes
                for (const elem of autoForward) {
                    if (!fs.existsSync(dirname + '/public/' + elem))
                        continue // mappen eksisterer ikke

                    let filetype: string = ''
                    if (url.split('.')[url.split('.').length - 1] != elem)
                        filetype = '.' + elem

                    let filepath: string = dirname + '/public' + url + filetype

                    if (!fs.existsSync(filepath))
                        continue

                    res.sendFile(filepath)
                    return true
                }
            }

            res.send('Default Response')
            break
    }

    
})