//Convenient helper for selecting default option
Handlebars.registerHelper('selected', function(val, option) {
	return val == option ? ' selected' : '';
});
//Useful for checking sesstion variables in templates
Handlebars.registerHelper('if_session', function(name, options) {
	if (Session.get(name))
		return options.fn(Session.get(name));
	return "";
});