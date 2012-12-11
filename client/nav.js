Template.nav.nav_links = function() {
	var links = [
		{ name: "Auctions", href: "/auctions", active: "", templ: "auction_list" },
		{ name: "Bids", href: "/bids", active: "", templ: "bids_page" },
	];
	for (var i in links){
		var link = links[i];
		if (Session.equals("currentpage", link.templ))
			link.active = "active";
	}
	var auction = Template.auction_page.auction();
	if (auction){
		links.push({name: auction.title, href: "/auction/"+auction._id, active: "active" });
	}
	return links;
}

Template.nav.auction = function() {
	Session.get("page");
	return Template.auction_page.auction();
};

Template.home.events({
	'click .create': openCreateDialog
});

//User Account Dropdown menu overrides and setups
Template._loginButtonsLoggedInDropdownActions.rendered = function(){
	//Move all this to a template if it gets too bloated here.
	var $ = jQuery;
	var createAuctionButton = $('<div id="create-auction" class="login-button">Create Auction</div>');
	$("#login-buttons-open-change-password").before(createAuctionButton);
	var userProfileButton = $('<div class="login-button" id="user-profile">My Profile</div>');
	createAuctionButton.before(userProfileButton);
}
Template._loginButtonsLoggedInDropdownActions.events = {
  'click #create-auction': function (event) {
		openCreateDialog();
		Accounts._loginButtonsSession.closeDropdown();
	},
	'click #user-profile': function (event) {
		Meteor.Router.navigate("profile", {trigger: true});
	}
}