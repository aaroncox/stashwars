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

Bids.allow({
	insert: function(userId, bid) {
		return userId && bid.owner === userId;
	}
});

Meteor.methods({
	createAuction: function(options) {
		return Auctions.insert({
			owner: this.userId,
			title: options.title,
			duration: options.duration,
		});
	}
});