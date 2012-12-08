Meteor.autosubscribe(function() {
  if ( Session.get("currentpage") === "bidsPage" ) {
    Meteor.subscribe("bids-recent");
  }
});
Template.bids_page.show = function() {
	return Session.get("currentpage") === "bidsPage";
};
Template.bids_page.bids = function() {
	return Bids.find({}, {sort: {time: -1}});
};
Template.bids_page.auctionTitle = function(auction) {
	return Auctions.findOne( auction ).title;
};
