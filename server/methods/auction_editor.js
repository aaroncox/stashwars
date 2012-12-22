Meteor.methods({
  SaveAuction: function(options) {
    var id = options.id;
    var $set = options.$set;
    var auction = Auctions.findOne({_id: id});
    
    if (!auction)
      throw new Meteor.Error(404, "Auction not found.");
    if (this.userId != auction.owner)
      throw new Meteor.Error(409, "You can only edit auctions you own.");
    if (typeof $set.duration != "undefined" && !_.find(global.auctionDurations, function(d){return d.value == $set.duration;}))
      throw new Meteor.Error(409, "Wrong duration.");
    if (typeof $set.increment != "undefined" && !_.find(global.bidIncrements, function(b){return b.value == $set.increment;}))
      throw new Meteor.Error(409, "Wrong increment.");
    if (typeof $set.minbid != "undefined" && !isPositiveInteger($set.minbid))
      throw new Meteor.Error(409, "Min Bid has to be a positive integer.");
    Auctions.update( id, { $set: $set } );
  }
});

function isPositiveInteger(n) {
    return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}