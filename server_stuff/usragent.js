const fs = require('fs')
const cookie_length = 30

usragent = {}

usragent.save = {
	users: [],
	waiting_zone: []
}
usragent.reload = false

usragent.dir = __dirname + "/usragent"
usragent.path_usrs = usragent.dir + "/users.json"
usragent.path_waiting_zone = usragent.dir + "/waiting_zone.json"

usragent.remove_storage_units = function(key) {
	for (const e in usragent.save.users) {
		for (const i in usragent.save.users[e].storage.cookie_list) {
			if (usragent.save.users[e].storage.cookie_list[i] == key) {
				usragent.save.users[e].storage.cookie_list.splice(i, 1)
				usragent.save.users[e].storage.name_list.splice(i, 1)
				usragent.save.users[e].storage.mailing_list.splice(i, 1)
				usragent.store()
				cookieman.delete(key)
				return true
			}
		}
	}

	return false
}

usragent.add_to_storage_lists = function(cookies, body) {
	let tkeylengt = 15 // key length, used when unsubscribing

	let try_logon = usragent.login(cookies, true)

	if (!try_logon.res)
		return false

	let usr = usragent.findUser(cookies)
	if (!usr.res)
		return false

	let obj = retrieve(body, ['name', 'email'])

	// list:
	// list = [ name, email]
	for (const i in usr.user.storage.mailing_list) {
		if (obj.email.toLowerCase() == usr.user.storage.mailing_list[i].toLowerCase()) {
			return false
		}
	}

	usr.user.storage.mailing_list.push(obj.email)
	usr.user.storage.name_list.push(obj.name)
	usr.user.storage.cookie_list.push(cookieman.new(tkeylengt))
	usragent.store()
	return true

}

usragent.login = function(body, no_new_cookie) {
	let obj = retrieve(body, ['usr', 'psw', 'cookie'])

	let al = [usragent.save.users, usragent.save.waiting_zone] // a_list

	// check cookie & psw credentials
	let exists = cookieman.exists(obj.cookie)


	// try to log in the normal way!
	// and get a cookie!
	for (const e in al) { // loop through both lists
		for (const i in al[e]) { // loops through one of the two lists contents
			// checks whether the username match when made lower case
			if (al[e][i].usr.toLowerCase() == obj.usr.toLowerCase()) {
				// checks whether the username match (psw should not be made lower case)

				// basically I just check the password
				// new if the cookies match and that the already stored cookie is not equal to 'nil'
				if (al[e][i].psw == obj.psw || (exists && al[e][i].cookie == obj.cookie && al[e][i].cookie != 'nil')) {

					// yeah logged in, now we bake a cookie...
					if (!no_new_cookie) {
						let freshly_baked_cookie = cookieman.new(cookie_length)
						cookieman.delete(al[e][i].cookie)
						al[e][i].cookie = freshly_baked_cookie // now we store the cookie
						usragent.store() // aaaand save!
					}

					return {res: true, cookie: al[e][i].cookie}
					// we return a response: true, and our newly baked cookie
				}
			}
		}
	}

	return {res: false, why: 'usr or psw, did not match'}
}


usragent.getEmail = function(body) {
	let obj = retrieve(body, ['usr'])

	let usr = usragent.findUser(body)

	if (usr.res)
		return usr.user.mail

	return false
}

usragent.getName = function(body) {
	let obj = retrieve(body, ['usr'])

	let usr = usragent.findUser(body)

	if (usr.res)
		return usr.user.fullname

	return false
}


usragent.getFullname = function(body) {
	let obj = retrieve(body, ['usr'])

	let usr = usragent.findUser(body)

	if (usr.res)
		return usr.user.fullname

	return false
}



usragent.findUser = function(body) {
	let obj = retrieve(body, ['usr'])

	for (const i in usragent.save.users) {
		if (usragent.save.users[i].usr.toLowerCase() == obj.usr.toLowerCase()) {
			// username match!
			return {res: true, user: usragent.save.users[i]}
		}
	}

	return {res: false, why: "didn't find an user"}
}


usragent.getPrivilege = function(body) {
	let obj = retrieve(body, ['usr'])

	for (const i in usragent.save.users) {
		if (usragent.save.users[i].usr.toLowerCase() == obj.usr.toLowerCase()) {
			// username match!
			return {res: true, privilege: usragent.save.users[i].privilege}
		}
	}
}


usragent.upgrade = function(body) {
	let obj = retrieve(body, ['usr', 'psw', 'cookie', 'uusr'])

	let login_res = usragent.login(body, true)

	if (!login_res.res)
		return {res: false, why: 'username is not in users section'}

	let confirmed_privilege;

	try {
		confirmed_privilege = usragent.getPrivilege(body).privilege.includes('upgrade:1')
	} catch (poop) {
		//console.log('privilege requirement not met')
	}

	if (!confirmed_privilege)
		return {res: false, why: 'need upgrade:1 privilege'}

	for (const i in usragent.save.waiting_zone) {
		if (usragent.save.waiting_zone[i].usr.toLowerCase() == obj.uusr.toLowerCase()) {
			// the username match, and we should now move the user to the activated session.
			usragent.save.waiting_zone[i].activated = true // first we activate the user
			let copy = usragent.save.waiting_zone[i] // make a copy
			usragent.save.waiting_zone.splice(i, 1) // remove from the waiting zone
			usragent.save.users.push(copy) // push the copy to the user section
			return true
		}
	}

	return {res: false, why: 'nope'}
}



usragent.getFromStorage = function(body, item) {
	let user = usragent.findUser(body)
	if (user.res) {
		return {res: true, storage: user.user.storage[item]}
	}

	return {res: false, why: "?"}
}


usragent.create = function(body) {
	let table = ['fullname', 'usr', 'mail']
	let obj = retrieve(body, table)


	for (const i in usragent.save.users) {
		for (const e in table) {
			// check if fullname, username or mail already exists
			if (obj[table[e]].toLowerCase() == usragent.save.users[i][table[e]].toLowerCase())
				return {res: false, why: '?'}
		}
	}

	// basically the same thing, just checking the waiting zone
	for (const i in usragent.save.waiting_zone) {
		for (const e in table) {
			if (obj[table[e]].toLowerCase() == usragent.save.waiting_zone[i][table[e]].toLowerCase())
				return {res: false, why: '?'}
		}
	}

	// by now it should be fine, so we create the account and push the newly created account to the waiting zone
	let generated_psw = cookieman.new(5, 'zaqwsxdecfrv13579')

	let new_usr = {
		fullname: obj.fullname,
		usr: obj.usr,
		psw: generated_psw,
		cookie: 'nil',
		mail: obj.mail,
		activated: false,
		permissions: [],
		storage: {
			mailing_list: [],
			name_list: [],
			cookie_list: [],
			sent: [],
			unsubscribed: []
		}
	}

	usragent.save.waiting_zone.push(new_usr)
	usragent.store()
	return {res: true, psw: generated_psw}
}


// save & load
usragent.store = function() {
	fs.writeFileSync(usragent.path_usrs, JSON.stringify(usragent.save.users))
	fs.writeFileSync(usragent.path_waiting_zone, JSON.stringify(usragent.save.waiting_zone))
}

usragent.reload = function() {
	if (JSON.parse(fs.readFileSync(usragent.dir + '/reload.json')).reload)
		usragent.load()
}

usragent.load = function() {

	// makes the usragent folder, if it doesn't exists yet
	if (!fs.existsSync(usragent.dir))
		fs.mkdirSync(usragent.dir)

	// makes the reload file
	if (!fs.existsSync(usragent.dir + '/reload.json')) {
		fs.writeFileSync(usragent.dir + '/reload.json', JSON.stringify({reload: 'false'}))
	}

	// makes the user json file
	if (!fs.existsSync(usragent.path_usrs)) {
		fs.writeFileSync(usragent.path_usrs, JSON.stringify(usragent.save.users))
	} else {
		// and if the file does exists, it will load the file
		usragent.save.users = JSON.parse(fs.readFileSync(usragent.path_usrs))
	}

	// makes the waiting zone json file
	if (!fs.existsSync(usragent.path_waiting_zone)) {
		fs.writeFileSync(usragent.path_waiting_zone, JSON.stringify(usragent.save.waiting_zone))
	} else {
		// and if the file does exists, it will load the file
		usragent.save.waiting_zone = JSON.parse(fs.readFileSync(usragent.path_waiting_zone))
	}

	usragent.store()
}
usragent.load()

function make_package(id, value) {
	if (id == null || value == null)
		return {res: false, why: '?'}

	if (id.length != value.length)
		return {res: false, why: '?'}

	let str = '{'

	for (var i = 0; i < id.length; i++) {
		str += '"'+String(id[i]) + '": "' + String(value[i]) + '"'
		if (i != id.length - 1)
			str += ", "
	}

	str += "}"

	return JSON.parse(str)
}

function retrieve(information, wish) {
	let bag = []
	for (i in wish)
		information[wish[i]] ? bag.push(information[wish[i]]) : bag.push('undefined')

	return make_package(wish, bag)
}

module.exports = usragent