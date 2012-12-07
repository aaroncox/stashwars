Template.auction_page.bids = function() {
	var bids = Bids.find({ auction: Session.get( "auction-id" ) });
	return bids;
};

Template.auction_page.auction = function() {
	var auction = Auctions.findOne({ _id: Session.get( "auction-id" ) });
	return auction;
};

Template.auction_page.show = function() {
	return Session.get( "auction-id" );
};

Template.auction_page.error = function() {
	return Session.get( "auction_page_bid_error" );
};

Template.auction_page.events({
	'submit .bid': function ( event, template ) {
		var input = template.find("input[name='bid']"),
			value = input.value;
		if ( value.match(/\D/) ) {
			Session.set( "auction_page_bid_error", "Only numbers are allowed in bids" );
		}
		Meteor.call("bid", {
			value: value,
			auction: Session.get( "auction-id" )
		}, function (error, auction) {
			if ( error ) {
				Session.set( "auction_page_bid_error", error.reason );
			} else {
				Session.set( "auction_page_bid_error", false );
				input.value = "";
			}
			console.log("bidresult", error, auction);
		});
		event.preventDefault();
	}
});
