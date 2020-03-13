let dirname: string

export function init_requestHandler(set_dirname: string) {
    dirname = set_dirname
}



export function api(req: any, res: any) {
 
    res.send('Det blev håndteret')
    return true
}