Template.index.show = function () {
	var page = Session.get( "currentpage" );
	console.log( page );
	return page === "index";
};
