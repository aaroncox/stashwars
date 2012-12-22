Meteor.methods({
  SaveAuction: function(options) {
    var id = options.id;
    var $set = options.$set;
    var auction = Auctions.findOne({_id: id});

    if (!auction)
      throw new Meteor.Error(404, "Auction not found.");
    if (this.userId != auction.owner)
      throw new Meteor.Error(409, "You can only edit auctions you own.");
    Auctions.update( id, { $set: $set } );
  }
});