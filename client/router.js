var StashWarsRouter = Backbone.Router.extend({
	routes: {
		"": "index",
		"auction/:auction_id": "auction",
		"auctions": "auctionIndex"
	},
	index: function() {
		Session.set("currentpage", "index");
		Session.set("auction-id", false);
	},
	auctionIndex: function() {
		Session.set("currentpage", "auctionIndex");
		Session.set("auction-id", false);
	},
	auction: function( auction_id ) {
		Session.set("currentpage", "auction");
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


