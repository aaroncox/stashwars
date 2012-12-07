Meteor.publish("auctions", function () {
	return Auctions.find();
});

Meteor.publish("auction-bids", function( auctionId ) {
	return Bids.find({ auction: auctionId }, {limit: 20, sort: {time: -1}});
});

Meteor.methods({
	bid: function(options) {
		var query = {
					_id: options.auction
				},
				value = parseFloat( options.value ),
				auction = Auctions.findOne(query),
				timestamp = new Date().getTime();
		// Require that the Auction exists
		if(!auction) {
			throw new Meteor.Error(404, "Auction not found");
		}
		// Require that the User be logged in to bid.
		if(!this.userId) {
			throw new Meteor.Error(500, "You must be logged in to bid on auctions.");
		}
		if ( value > auction.price ) {
			Auctions.update( query, {
				$set: {
					price: value,
					highestBidder: Meteor.user().username,
					last_bid: timestamp
				},
				$inc: {
					bids: 1
				}
			});
		} else {
			throw new Meteor.Error(409, "Bid not high enough", { auction: auction, bid: options });
		}
		return Bids.insert({
			auction: options.auction,
			owner: this.userId,
			ownerName: Meteor.user().username,
			value: value,
			time: timestamp
		});
	}
})
