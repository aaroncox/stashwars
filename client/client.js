Meteor.subscribe("auctions");

Template.auction_list.all = function () {
	return Auctions.find({});
};
