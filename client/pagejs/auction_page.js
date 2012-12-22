Template.auction_page_bid_info.bids = function() {
	var bids = Bids.find({ auction: Session.get( "auction-id" ) }, { sort: { value: -1, time: 1 } });
	return bids;
};

function auction() {
	var result = Auctions.findOne({
		_id: Session.get( "auction-id" )
	});
	return result;
}

Template.auction_page_bid_info.auction = auction;
Template.auction_page.auction = auction;

Template.auction_page.show = function() {
	return ( Session.get("currentpage") === "auction" ) && Session.get( "auction-id" );
};

Template.auction_page.error = function() {
	return Session.get( "auction_page_bid_error" );
};

Template.auction_page.highestBidder = function() {
	var current = auction();
	if(!current || !Meteor.user()) {
		return;
	}
	if(current.highestBidderId == Meteor.user()._id) {
		var bid = Bids.findOne(current.bidId, {maxValue: 1});
		return bid && bid.maxValue;		
	}
};

Template.create_dialog.auctionDurations = function () {
  return global.auctionDurations;
};

Template.create_dialog.bidIncrements = function () {
  return global.bidIncrements;
};

Template.auction_page.events({
	'submit .bid': function ( event, template ) {
		var input = template.find("input[name='bid']"),
			value = input.value;
		if ( value.match(/\D/) ) {
			input.value = value.replace(/\D/g,"");
			Session.set( "auction_page_bid_error", "Only numbers are allowed in bids, I removed the rest" );
		} else {
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
		}
		event.preventDefault();
	}
});
