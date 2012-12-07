Meteor.publish("auctions", function () {
  return Auctions.find();
});