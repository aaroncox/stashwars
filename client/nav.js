Template.nav.auction = function() {
	Session.get("page");
	return Template.auction_page.auction();
};

Template.nav.rendered = function() {
	jQuery("a.local").each(function(){
		var elem = jQuery(this),
			linkPath = this.pathname.replace(/^\//,""),
			locationPath = location.pathname.replace(/^\//,""),
			locationHash = location.hash.replace(/^#/,"");
		if ( !locationPath.length ) {
			locationPath = locationHash;
		}
		elem.closest("li").toggleClass("active", linkPath === locationPath);
	});
};

Template.nav.events({
	'click .create': openCreateDialog
});
