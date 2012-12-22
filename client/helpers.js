/*
* Generic Heplers go here
*/

//Convenient helper for selecting default option
Handlebars.registerHelper('selected', function(val, option) {
	return val == option ? ' selected' : '';
});
//Useful for checking session variables in templates
Handlebars.registerHelper('if_session', function(name, options) {
	if (Session.get(name))
		return options.fn(Session.get(name));
	return "";
});
Handlebars.registerHelper("global", function(name) {
	return global[name];
});
Handlebars.registerHelper("itemCount", function(auction, filter) {
	if(!auction || !auction.items) {
		return 0;
	}
	return _.reduce(auction.items, function(memo, item) {
		if(filter && item.item.quality !== filter) {
			return memo;
		}
		return memo + item.quantity;
	}, 0);
});
