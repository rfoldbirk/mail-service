console.clear()
console.log('Mail Service: up & running')

var fs = require('fs')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var http = require('http')
var https = require('https')
var privateKey  = fs.readFileSync(__dirname + '/server_stuff/junk/certificate.key', 'utf8')
var certificate = fs.readFileSync(__dirname + '/server_stuff/junk/certificate.crt', 'utf8')


// HTTP(s) Server
var credentials = {key: privateKey, cert: certificate}
var express = require('express')
var app = express()


// Mail
const sgMail = require('@sendgrid/mail')
const api_key = JSON.parse(fs.readFileSync(__dirname + '/server_stuff/api_key.json'))
sgMail.setApiKey(api_key)


const cookieman	= require('./server_stuff/cookieman') // working fine
const usragent	= require('./server_stuff/usragent') // pretty half-baked
// const mailman = require('./mailman') // not made yet


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());


app.use(function(req, res) {

	// if (req.url != '/')
	// 	console.table([req.url, req.method])

	// post requests here
	if (req.method != 'GET') {

		if (req.url == '/attempt_newmail') {
			//let response = usragent.login(req.body)

			let confirmed_login = usragent.login(req.cookies, true)

			if (!confirmed_login.res) {
				// send a login version of the page
				send_login_page(res, req)
				return true
			}

			let to = usragent.getFromStorage(req.cookies, 'mailing_list').storage

			if (req.body.stm == 'on')
				to = usragent.getEmail(req.cookies)

			sendMail(to, req.body.subject, req.body.content, req)

			// make cookie
			// send specific site, which has the desired cookie, and also.

			send_specific_stuff(res, req, '<h5>Mailen er på vej!</h5>')
		}

		if (req.url == '/new_subscription') {
			let tres = usragent.add_to_storage_lists(req.cookies, req.body)
			send_list_html(res, req)
		}

		return
	}

	// get script or css
	let list = ['scripts', 'css']
	for (var i = 0; i < list.length; i++) {
		if (req.url.includes( list[i] + '/') ) { // example: includes ( 'scripts/' )
			let file_name = req.url.split('/')
			res.sendFile(__dirname + '/public/' + file_name[file_name.length-1])
			return // to avoid the server from trying to send the index.html file
		}
	}

	// after this point it is purely GET requests


	// request the page /newmail
	// with psw restriction

	if (req.url.includes('/unsubscribe?') || req.url.includes('/unsubscribe_me?')) {
		let key = req.url.split('?')[1]

		usragent.remove_storage_units(key)

		if (req.url.includes('/unsubscribe?')) {
			send_list_html(res, req)
		} else {
			res.send('Øv bøv, men nu får du ikke flere emails fra mig')
		}
		return true
	}

	if (req.url == '/list') {
		send_list_html(res, req)
		return true
	}

	if (req.url == '/newmail') {
		let login_response = usragent.login(req.cookies)

		if (login_response.res == false) { 
			// send a login version of the page
			send_login_page(res, req)
			return true
		}


		res.clearCookie('psw') // deleting the psw cookie, as soon as it is used.
		res.cookie('cookie', login_response.cookie) // sets cookie

		// stuff to post
		//let new_stuff = '<form onmouseenter="store_my_soul()" action="attempt_newmail" method="POST"><h1>Skriv din mail</h1>Emne: <input type="text" name="subject"><br><p>Tekst:</p><textarea hidden="true" id="txa" class="ta" name="txt">hej</textarea><div onkeyup="key(event)" contenteditable="true" class="ta" id="mail-txt" style="border: 1px solid; border-color: red;" name="example">Skriv noget</div><input type="submit"></form><script>var mail_txt = "";function store_my_soul() {mail_txt = document.getElementById("mail-txt");};function key(event) {/* isTrusted, key, code, location, ctrlKey*/let txa = document.getElementById("txa");txa.value = mail_txt.innerHTML;}</script>'

		let new_stuff = fs.readFileSync(__dirname + '/kinda_public/new_mail.html', 'utf8')
		// send away!
		let special_res = send_specific_stuff(res, req, new_stuff)

		if (special_res)
			return // så serveren ikke sender standard versionen :)
	}

	send_specific_stuff(res, req, false)
});


function send_login_page(res, req) {
	// send a login version of the page
	let new_stuff = fs.readFileSync(__dirname + '/kinda_public/login.html', 'utf8')
	// send away!
	let special_res = send_specific_stuff(res, req, new_stuff)
	return true
}


function sendMail(to, subject, html_msg, req) {

	if (subject == "") {
		return false
	}

	let t = typeof to
	let one_player_mode = false
	if (t == 'string') {
		to = [to]
		one_player_mode = true
	}


	let my_email = usragent.getEmail(req.cookies)
	let my_name = usragent.getName(req.cookies)

	let name_list = usragent.getFromStorage(req.cookies, 'name_list').storage
	let cookie_list = usragent.getFromStorage(req.cookies, 'cookie_list').storage

	for (const i in to) { // a loop for every receiver
		console.log(' ')

		let first_name
		let last_name

		let target = to[i]

		try {
			first_name = name_list[i].split(' ')[0] || ""
			last_name = name_list[i].split(' ')[1] || ""
		} catch (poop) {
			first_name = ''
			last_name = ''
		}

		let unsub_key = cookie_list[i]

		// personalization area :D

		// unsub html
		let unsub = fs.readFileSync(__dirname + '/kinda_public/unsubscribe.html', 'utf8')
		unsub = unsub.split('/*KEY*/')[0] + unsub_key + unsub.split('/*KEY*/')[2]


		// first_name & last_name -----------------------------------
		let mini_list = {
			sub_names: ['-navn-', '-efternavn-'],
			sub_var: [first_name, last_name],
			items: [subject, html_msg]
		}

		if (one_player_mode) {
			try {
				mini_list.sub_var = [my_name.split(' ')[0] || "",my_name.split(' ')[1] || ""]
			} catch (poop) {
				console.log('whoops : one_player_mode')
			}
		}

		for (const e in mini_list.items) {
			let item = mini_list.items[e]

			for (const a in mini_list.sub_names) {
				let len = mini_list.items[e].split(mini_list.sub_names[a]).length - 1

				for (let o = 0; o < len; o++) {
					mini_list.items[e] = mini_list.items[e].replace(mini_list.sub_names[a], mini_list.sub_var[a])
				}
			}
		}
		// -------------------------------------------

		// ... is now over !

		// the message should now be ready... i hope

		const msg = {
			to: target,
			from: 'rasmusfoldberg@gmail.com',
			subject: mini_list.items[0],
			text: 'Der ser ud til at din browser ikke understøtter HTML',
			html: mini_list.items[1] + unsub,
		}

		console.log(mini_list.items[1] + unsub)

		// sgMail.send(msg)
	}

}


function send_list_html(res, req) {
	let try_login = usragent.login(req.cookies, true)

	if (!try_login.res) {
		send_login_page(res, req)
		return
	}

	let m_list = usragent.getFromStorage(req.cookies, 'mailing_list')
	let n_list = usragent.getFromStorage(req.cookies, 'name_list')
	let c_list = usragent.getFromStorage(req.cookies, 'cookie_list')

	/* the process

	1. send the two arrays the html file √
	2. js file on the html file formats the variables in form of a table

	*/

	let new_stuff = fs.readFileSync(__dirname + '/kinda_public/list.html', 'utf8')

	// makes the mail array
	let lengthy_str_mail = ""
	for (const i in m_list.storage) {
		lengthy_str_mail += "'" + m_list.storage[i] + "'"
		if (i < m_list.storage.length-1)
			lengthy_str_mail += ", "
	}

	// makes the name array
	let lengthy_str_name = ""
	for (const i in n_list.storage) {
		lengthy_str_name += "'" + n_list.storage[i] + "'"
		if (i < n_list.storage.length-1)
			lengthy_str_name += ", "
	}

	// makes the cookie array
	let lengthy_str_cookie = ""
	for (const i in c_list.storage) {
		lengthy_str_cookie += "'" + c_list.storage[i] + "'"
		if (i < c_list.storage.length-1)
			lengthy_str_cookie += ", "
	}

	new_stuff = new_stuff.split("/*EMAIL*/")[0] + lengthy_str_mail + new_stuff.split("/*EMAIL*/")[2]
	new_stuff = new_stuff.split("/*NAME*/")[0] + lengthy_str_name + new_stuff.split("/*NAME*/")[2]
	new_stuff = new_stuff.split("/*COOKIE*/")[0] + lengthy_str_cookie + new_stuff.split("/*COOKIE*/")[2]


	send_specific_stuff(res, req, new_stuff)
}


function send_specific_stuff(res, req, stuff) {

	let name

	try {
		name = ', ' + usragent.findUser(req.cookies).user.fullname
	} catch (poop) {
		name = ""
	}

	try {
		let html_file = fs.readFileSync(__dirname + '/public/index.html', 'utf8')
		let output = html_file
		if (stuff != false)
			output = html_file.split('<!--INSERT-->')[0] + stuff + html_file.split('<!--INSERT-->')[2]

		let with_name = output.split('<!--NAME-->')[0] + name + output.split('<!--NAME-->')[2]
		res.send(with_name)
	}
	catch (poop) {
		console.error(poop)
		return false
	}
	
	return true
}

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(80);