Handlebars.registerHelper("key_value", function(obj, fn) {
    var buffer = "",
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            buffer += fn({key: key, value: obj[key]});
        }
    }

    return buffer;
});

Template.item_select.items = function() {
	return _.map(itemData, function(item) {
		return {
			slug: item.slug,
			name: item.name
		};
	});
};