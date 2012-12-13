Meteor.publish("auctions", function () {
	return Auctions.find();
});

Meteor.publish("auction-bids", function( auctionId ) {
	return Bids.find({ auction: auctionId }, {limit: 20, sort: {time: -1}});
});

Meteor.publish("bids-recent", function( auctionId ) {
	return Bids.find({}, {limit: 20, sort: {time: -1}});
});

Accounts.validateNewUser(function (user) {
  if (user.username && user.username.length >= 3 && user.username.length <= 16)
    return true;
  throw new Meteor.Error(403, "Username length must be between 3 to 16 characters");
});
