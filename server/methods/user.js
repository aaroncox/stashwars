Meteor.methods({
	SaveUserProfile: function(options) {
		var possibleRegions = global.regions;
		if (!_.contains(possibleRegions, options.region))
			throw new Meteor.Error(409, "Wrong Region.");
		if (!/^[a-z]{2,16}#[0-9]{2,5}$/gi.test(options.battletag))
			throw new Meteor.Error(409, "Invalid BattleTag.");
		return Meteor.users.update( Meteor.userId(), { 
			$set: {
				profile: {
					region: options.region,
					battletag: options.battletag
				}
			}
		});
	}
});