Session.set("addItemError", null);

Template.auction_page.isOwner = 
Template.auction_editor.isOwner = function() {
	return (Template.auction_page.auction() && Meteor.userId() == Template.auction_page.auction().owner);
};

Template.auction_editor.isEditable = function() {
  var auction = Template.auction_page.auction();
  return auction.bids === 0;
};

Template.auction_editor.itemError = function () {
  return Session.get("addItemError");
};

function getAuction() {
	var result = Auctions.findOne({
		_id: Session.get( "auction-id" )
	});
	return result;
}

function updateProperty(prop, value) {
	var auction = getAuction(),
			id = auction && auction._id,
			$set = {};
	if(!auction || auction[prop] === value) {
		return;
	}
	$set[prop] = value;
	Auctions.update( id, { $set: $set } );
}

function updateEvent(event) {
	var element = jQuery(event.target),
			value = parseFloat(element.val()),
			prop = event.target.name;
	updateProperty(prop, value);
}

Template.auction_itemlist.auction = getAuction;

Template.auction_editor.events = {
	'submit': function(e) {
		return e.preventDefault();
	},
	'change .auction_property': updateEvent,
	'keyup .auction_property': _.debounce(updateEvent, 1500),
  'click #save': function (event) {
	},
  'click #start': function (event) {
	},
  'click #add': function (event, template) {
		var itemSlug = template.find("#item").value,
				quantity = parseInt(template.find("#quantity").value),
        item = _.find(itemData, function(i){ return i.slug == itemSlug; });
    // Ensure an item is selected
    if(!item) {
      Session.set("addItemError",
                  "No item selected");
    }
		// Ensure we have no errors before save
    if(!Session.get("addItemError")) {
      Meteor.call('addItem', {
        item: item,
        quantity: quantity,
				auction: Template.auction_page.auction()
      }, function (error, auction) {
        if (error) {
          Session.set("addItemError", "There was an error adding an item: " + error);
        } else {
					Session.set("addItemError", false);
				}
      });
    }
    
	}
}