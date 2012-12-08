Session.set("addItemError", null);

Template.auction_editor.isOwner = function() {
	console.log(Session.get( "auction-id" ));
	var result = Auctions.findOne({
		_id: Session.get( "auction-id" )
	});
	console.log(result);
	console.log(Template.auction_page.auction());
	console.log(this.userId);
	return (Template.auction_page.auction() && this.userId == Template.auction_page.auction().owner);
};

Template.auction_editor.itemError = function () {
  return Session.get("addItemError");
};


Template.auction_editor.events = {
	'submit': function(e) {
		return e.preventDefault();
	},
  'click #save': function (event) {
	},
  'click #start': function (event) {
	},
  'click #add': function (event, template) {
		var item = template.find("#item").value,
				quantity = parseInt(template.find("#quantity").value);
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