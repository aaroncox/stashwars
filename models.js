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

//TODO: move this somewhere else
Meteor.methods({
	addItem: function(options) {
		return Auctions.update( options.auction._id, { 
			$push: {
				items: {
					item: options.item,
					quantity: options.quantity
				}
			}
		});
	}
});
