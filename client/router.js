var StashWarsRouter = Backbone.Router.extend({
	routes: {
		"": "index",
		"auction/:auction_id": "auction",
		"auctions": "auctionIndex"
	},
	index: function() {
		Session.set("page", "home");
		Session.set("auction-page", false);
		Session.set("auction-id", false);
	},
	auctionIndex: function() {
		Session.set("page", "auction_list");
		Session.set("auction-page", true);
		Session.set("auction-id", false);
	},
	auction: function( auction_id ) {
		Session.set("page", "auction_page");
		Session.set("auction-page", false);
		Session.set("auction-id", auction_id );
	}
});

Meteor.Router = new StashWarsRouter();

jQuery( document ).on( "click", "a.local", function( event ) {
	Meteor.Router.navigate( this.pathname, { trigger: true });
	event.preventDefault();
});
Meteor.startup(function () {
	var test = Backbone.history.start({ pushState: true });
});

//Routing with HandleBars Partials
Handlebars.registerHelper("page_view", function() {
	var page = Session.get("page");
	if (Template[page])
		return Template[page]({});
	return "";
});
