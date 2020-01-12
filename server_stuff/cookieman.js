cookieman = {}
cookieman.cookies = []
cookieman.dir = __dirname + "/cookieman"
cookieman.file_path = cookieman.dir + "/cookies.json"
cookieman.max_iteration = 50

const fs = require("fs")

cookieman.exists = function(cookie) {
	for (const i in cookieman.cookies)
		if (cookieman.cookies[i] == cookie) return true

	return false 
}

cookieman.delete = function(cookie) {
	if (cookie == '!all!') // delete; save
		cookieman.cookies = []; cookieman.save()

	for (const i in cookieman.cookies) // find cookie; delete cookie; save array
		if (cookieman.cookies[i] == cookie) {cookieman.cookies.splice(i, 1); cookieman.save(); return true}

	return false
}

cookieman.is_original = function(cookie) {
	for (const i in cookieman.cookies)
		if (cookieman.cookies[i] == cookie) return false

	return true
}

cookieman.new = function(length, symbols_to_use, iteration) {
	if (iteration == undefined) iteration = 0; iteration ++ 
	// keeps automatic count of how many things there are.

	// makes sure that the program, doesn't get stuck trying to figure out a combination.
	if (iteration > cookieman.max_iteration) return false // shouldn't really ever occur.

	var cooking_cookie = ""
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	
	if (symbols_to_use != undefined) {
		possible = symbols_to_use
	}

	for (var i = 0; i < length; i++)
		cooking_cookie += possible.charAt(Math.floor(Math.random() * possible.length))

	let res = cookieman.is_original(cooking_cookie)
	if (res != true)
		return cookieman.new(length, symbols_to_use, iteration) // repeat

	// push cookie & save
	cookieman.cookies.push(cooking_cookie) 	// push
	cookieman.save() 						// save
	return cooking_cookie 					// return
}



cookieman.save = function() {
	fs.writeFileSync(cookieman.file_path, JSON.stringify({cookies: cookieman.cookies}))

}

cookieman.load = function() {
	if (!fs.existsSync(cookieman.dir))
		fs.mkdirSync(cookieman.dir)

	if (!fs.existsSync(cookieman.file_path))
		fs.writeFileSync(cookieman.file_path, JSON.stringify({cookies: []}))

	cookieman.cookies = JSON.parse(fs.readFileSync(cookieman.file_path)).cookies
}

cookieman.load()

module.exports = cookieman