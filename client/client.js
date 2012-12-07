Meteor.subscribe("auctions");

Template.auction_list.all = function () {
  return Auctions.find({});
};
Template.auction_list.show = function () {
  return Session.get( "auction-page" );
};

Template.auction_page.auction = function() {
  var auction = Auctions.findOne({ _id: Session.get( "auction-id" ) });
  console.log( auction );
  return auction;
}

Template.auction_page.show = function() {
  return Session.get( "auction-id" );
}

window.onhashchange = function() {
  Session.set( "auction-page", location.hash.match(/auctions/) );
  var idMatch = location.hash.match(/auction-([\w-]+)/);
  Session.set( "auction-id", idMatch && idMatch[1] );
};
