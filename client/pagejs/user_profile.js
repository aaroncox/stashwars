Meteor.subscribe("my-auctions");

Template.user_profile.regions = function () {
	return [ "Americas", "Europe", "Asia" ];
}

Template.user_profile.myAuctions = function() {
	return Auctions.find({ owner: Meteor.userId() }, { sort: { createdAt: -1 } });
}

Template.user_profile.events = {
	'submit': function(event) {
		return event.preventDefault();
	},
	'click #save': function (event, template) {
		var region = template.find("#region").value,
			battletag = template.find("#battletag").value;
		Meteor.call('SaveUserProfile', {
			region: region,
			battletag: battletag
		}, function (error, auction) {
			Session.set("errorMsg", null);
			Session.set("successMsg", null);
			if (error) {
				Session.set("errorMsg", error.reason);
			} else {
				Session.set("successMsg", "Saved!");
			}
		});
	}
}

Template.user_profile.rendered = function(){
	jQuery(this.find(".alert-error")).delay(3000).fadeOut();
	jQuery(this.find(".alert-success")).delay(1500).fadeOut();
};