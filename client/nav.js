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

Template._loginButtonsLoggedInDropdownActions.rendered = function(){
	var $ = jQuery;
	var ele = $('<div class="login-button">Create Auction</div>');
	$("#login-buttons-open-change-password").before(ele);
	ele.click(function(){
		openCreateDialog();
		Accounts._loginButtonsSession.closeDropdown();
	});
}