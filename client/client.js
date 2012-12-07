Meteor.subscribe("auctions");

Handlebars.registerHelper("money", function( value ) {
  var parsed = parseFloat(value).toFixed(0),
    len = parsed.length - 3;
  for ( ; len > 0; len -= 3) {
    parsed = parsed.substr( 0, len ) + "," + parsed.substr( len );
  }
  return parsed;
});

Template.auction_list.all = function () {
  return Auctions.find({});
};

Template.auction_list.show = function () {
  return Session.get( "auction-page" );
};

Template.auction_page.bids = function() {
  var bids = Bids.find({ auction: Session.get( "auction-id" ) });
  return bids;
};

Template.auction_page.auction = function() {
  var auction = Auctions.findOne({ _id: Session.get( "auction-id" ) });
  console.log( auction );
  return auction;
};

Template.nav.auction = function() {
  Session.get("auction-page");
  return Template.auction_page.auction();
};

Template.auction_page.show = function() {
  return Session.get( "auction-id" );
};

Template.auction_page.events({
  'click .bid': function(event, template) {
    var value = template.find("input[name='bid']").value;
    Meteor.call("bid", {
      value: value,
      auction: Session.get( "auction-id" )
    }, function (error, auction) {
      console.log("bidresult", error, auction);
    });
  }
});

var bidSubscribe;

window.onhashchange = function() {
  Session.set( "auction-page", location.hash.match(/auctions/) );

  var idMatch = location.hash.match(/auction-([\w-]+)/),
    auctionId = idMatch && idMatch[1];
  if (Session.get("auction-id") !== auctionId || auctionId && !bidSubscribe) {
    if (bidSubscribe) {
      bidSubscribe.stop();
      bidSubscribe = null;
    }
    if (auctionId) {
      bidSubscribe = Meteor.subscribe( "auction-bids", auctionId );
    }
  }
  Session.set( "auction-id", auctionId );
};
window.onhashchange();

Template.nav.rendered = function() {
  jQuery(".nav a").each(function(){
    var elem = jQuery(this);
    elem.closest("li").toggleClass("active", this.hash == location.hash);
  });
}

Template.page.rendered = function() {
  if (!this.onlyonce) {
    this.onlyonce = true;
    window.onhashchange();
  }
};


///////////////////////////////////////////////////////////////////////////////
// Create Auction Dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
  // jQuery(Template.create_dialog.find(".modal")).removeClass("disabled");
};

Template.nav.events({
  'click .create': openCreateDialog
});

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
      jQuery(template.find(".modal")).addClass("disabled");
      Meteor.call('createAuction', {
        title: title,
        duration: duration
      }, function (error, auction) {
        jQuery(template.find(".modal")).removeClass("disabled");
        if (error) {
          Session.set("createError", "There was an error creating this auction: " + error);
        } else {
          window.location = "#auction-" + auction;
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
