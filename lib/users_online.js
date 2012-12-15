if( Meteor.isServer ) {
	Meteor.methods({
		userActivity: function() {
			var user = Meteor.user();
			if(!user) {
				return;
			}
			Meteor.users.update( user._id, { $set: { 'profile.lastActive': +new Date() } } );
		},
		countActiveUsers: function() {
			return Meteor.users.find({ 'profile.lastActive': { $gt: +new Date() - 60000 } }).count();
		}
	});
} else {
	var userActivity = function() {
		if(Meteor.user()) {
			Meteor.call("userActivity");
		}
		Meteor.call("countActiveUsers", function(err, res) {
			Session.set("users_online", res);
		});
	};
	Meteor.startup(userActivity);
	Meteor.setInterval(userActivity, 30000);

	Handlebars.registerHelper("users_online", function() {
		return Session.get("users_online");
	});
}

