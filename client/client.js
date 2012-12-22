Meteor.subscribe("auctions");

Meteor.autosubscribe(function() {
  var auctionId = Session.get("auction-id");
  if ( auctionId ) {
    Meteor.subscribe("auction-bids", auctionId);
  }
});

// Configured Accounts UI to ask for Username, Email and Password
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Accounts.config({
  sendVerificationEmail: true
});

Handlebars.registerHelper("money", function( value ) {
  var parsed = parseFloat(value).toFixed(0),
    len = parsed.length - 3;
  for ( ; len > 0; len -= 3) {
    parsed = parsed.substr( 0, len ) + "," + parsed.substr( len );
  }
  return parsed;
});

Handlebars.registerHelper("username", function( id ) {
  var user = Meteor.users.findOne(id);
  return user ? user.username : null;
});

Template.auction_list.all = function () {
  return Auctions.find({});
};
