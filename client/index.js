Template.index.show = function () {
	var page = Session.get( "currentpage" );
	return page === "index";
};
