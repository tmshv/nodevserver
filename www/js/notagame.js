function saveNotagameLogin(username){
	if(username) $.cookie("notagame_login", username, {expires: 100});
	console.log("notagame_login saved (%s)", username);
}

function saveDebuggerLayout (struct) {
	$.cookie("notagame_debugger_layout", struct, {expires: 100});
	console.log("notagame_debugger_layout saved");
}