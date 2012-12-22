var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.create_dialog.show = function () {
  return Session.get("showCreateDialog");
};

jQuery( document ).on( "keydown", function( event ) {
  if (event.which === 27) {
    Session.set("showCreateDialog", false);
  }
});

Template.create_dialog.events({
  'submit': function(event) {
    return event.preventDefault();
  },
  'click .save': function (event, template) {
    var data = {
      title:    template.find("#title").value,
      duration: template.find("#duration").value,
      increment: template.find("#increment").value,
      minbid:   template.find("#minbid").value,
    };
    
    Meteor.call('createAuction', data, function (error, auction) {
      Session.set("errorMsg", null);
      if (error) {
        Session.set("errorMsg", error.reason);
      }else{
        Meteor.Router.navigate("auction/" + auction,{trigger:true});
        Session.set("showCreateDialog", false);
      }
    });

    return event.preventDefault();
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});