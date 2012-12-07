Meteor.publish("auctions", function () {
  return Auctions.find();
});

Meteor.publish("auction-bids", function( auctionId ) {
  return Bids.find({ auction: auctionId });
});