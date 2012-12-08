var StashWarsRouter = Backbone.Router.extend({
	routes: {
		"": "index",
		"auction/:auction_id": "auction",
		"auctions": "auctionIndex",
		"bids": "bidsPage"
	},
	index: function() {
		Session.set("currentpage", "home");
		Session.set("auction-id", false);
	},
	auctionIndex: function() {
		Session.set("currentpage", "auction_list");
		Session.set("auction-id", false);
	},
	auction: function( auction_id ) {
		Session.set("currentpage", "auction_page");
		Session.set("auction-id", auction_id );
		Session.set("auction_page_bid_error", false);
	},
	bidsPage: function() {
		Session.set("currentpage", "bids_page");
		Session.set("auction-id", false);
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
	var page = Session.get("currentpage");
	if (Template[page])
		return Template[page]({});
	return "";
});