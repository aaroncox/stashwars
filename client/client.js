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


///////////////////////////////////////////////////////////////////////////////
// Create Auction Dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.events({
	'click input.create': function () {
		openCreateDialog();
	}
});

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
		// Pull out our field values
    var title = template.find(".title").value,
				duration = template.find(".duration").value;
		// Ensure the Title Length
    if(!title.length) {
	    Session.set("createError",
                  "Your auction needs a title.");
		}
		// Ensure the Duration
		if(duration < 15) {
	    Session.set("createError",
                  "The duration must be greater than 15 minutes.");			
		}
		if(duration > 60) {
	    Session.set("createError",
                  "The duration must be less than 60 minutes.");			
		}
		// Ensure we have no errors before save
		if(!Session.get("createError")) {
      Meteor.call('createAuction', {
        title: title,
				duration: duration,
      }, function (error, auction) {
        if (!error) {
          Session.set("selected_auction_id", auction);
        }
      });
      Session.set("showCreateDialog", false);
    } else {
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};