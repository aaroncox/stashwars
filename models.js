Auctions = new Meteor.Collection("auctions");
Bids = new Meteor.Collection("bids");

// Auctions.allow({
//   insert: function(userId, auction) {
//     return false;
//   },
//  update: function(userId, auctions, fields, modifier) {
//    return _.all(auctions, function(auction) {
//      if(userId !== auction.owner) {
//        return false; // You're not the owner
//      }
//      var allowed = ['title'];
//      if(_.difference(fields, allowed).length) {
//        return false; // Not allowed to edit those fields
//      }
//      return true;
//    });
//  },
//  remove: function(userId, auctions) {
//    return false;
//  }
// });

Meteor.methods({
  bid: function(options) {
    var query = {
          _id: options.auction
        },
        value = parseFloat( options.value ),
        auction = Auctions.findOne(query);
    if(!auction) {
      throw new Meteor.Error(404, "Auction not found");
    }
    if ( value > auction.price ) {
      Auctions.update( query, { $set: { price: value } } );
    } else {
      throw new Meteor.Error(409,"Bid not high enough", {auction: auction, bid: options });
    }
    return Bids.insert({
      auction: options.auction,
      owner: this.userId,
      value: value
    });
  },
	createAuction: function(options) {
		return Auctions.insert({
			owner: this.userId,
			title: options.title,
			price: 0,
			duration: options.duration
		});
	}
});
