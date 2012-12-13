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
		if(this.userId === auction.owner) {
			throw new Meteor.Error(409, "You can't bid on your own auctions");
		}
		if(this.userId === auction.highestBidderId) {
			throw new Meteor.Error(409, "You can't outbid yourself");
		}
		if ( value > auction.price ) {
			var inc = 5,
					minPrice = auction.price + inc;
			// Our bid isn't high enough for the increment value, throw an error.
			if( minPrice > value ) {
				throw new Meteor.Error(409, "Your bid is not high enough, the bid increment is set to " + inc + ", you must bid atleast " + (auction.price + inc) + ".");
			}
			// Find the last bid that was on the auction
			var	lastBid = Bids.findOne({ _id: auction.bidId });
			// If our new bid is LESS THAN the last bidders maxBid, update the auction and throw.
			if( lastBid && value <= lastBid.maxValue ) {
				Bids.update( { _id: auction.bidId }, {
					$set: {
						value: value
					}
				});
				Auctions.update( query, {
					$set: {
						price: value,
						last_bid: timestamp
					},
					$inc: {
						bids: 1
					}
				});
				throw new Meteor.Error(409, "Your bid was automatically outbid.");
			}
			// If we had a last bid, jump over it by the inc
			if(lastBid && lastBid.maxValue) {
				minPrice = lastBid.maxValue + inc;				
			} else {
				// Otherwise start with default value
				minPrice = 5;		// TODO - This should be the starting value of the auction probably
			}
			// Create the Bid
			var bid = Bids.insert({
				auction: options.auction,
				owner: this.userId,
				ownerName: Meteor.user().username,
				value: minPrice,
				maxValue: value,
				time: timestamp
			});
			// Update the Auction
			Auctions.update( query, {
				$set: {
					price: minPrice,
					bidId: bid,
					highestBidder: Meteor.user().username,
					highestBidderId: Meteor.user()._id,
					last_bid: timestamp
				},
				$inc: {
					bids: 1
				}
			});
		} else {
			throw new Meteor.Error(409, "Bid not high enough", { auction: auction, bid: options });
		}
	}
});