Template.nav.nav_links = function() {
	return [];
}

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
		elem.closest("li").toggleClass("active", elem.attr("data-templ") === Session.get("currentpage"));
	});
};

Template.home.events({
	'click .create': openCreateDialog
});
