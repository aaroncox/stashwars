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

///////////////////////////////////////////////////////////////////////////////
// Create Auction Dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
  // jQuery(Template.create_dialog.find(".modal")).removeClass("disabled");
};

Template.create_dialog.show = function () {
  return Session.get("showCreateDialog");
};

jQuery( document ).on( "keydown", function( event ) {
  if (event.which === 27) {
    Session.set("showCreateDialog", false);
  }
});

Template.create_dialog.events({
  'click .save': function (event, template) {
    // Pull out our field values
    if ( template.find(".modal.disabled") ) {
      return;
    }
    Session.set("createError", null);
    var title = template.find(".title").value,
        duration = template.find(".duration").value;
    // Ensure the Title Length
    if(!title.trim().length) {
      Session.set("createError",
                  "Your auction needs a title.");
    }
    // Ensure the Title is atleast 4 characters
    if(title.trim().length < 4) {
      Session.set("createError",
                  "Your auction title should be atleast 4 characters");
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
      jQuery(template.find(".modal")).addClass("disabled");
      Meteor.call('createAuction', {
        title: title,
        duration: duration
      }, function (error, auction) {
        jQuery(template.find(".modal")).removeClass("disabled");
        if (error) {
          Session.set("createError", "There was an error creating this auction: " + error);
        } else {
          Meteor.Router.navigate("auction/" + auction,{trigger:true});
          Session.set("showCreateDialog", false);
        }
      });
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.create_dialog.error = function () {
  return Session.get("createError");
};
