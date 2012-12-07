var timeDiff = 0,
  lastSync = false;

if ( Meteor.isServer ) {
  Meteor.methods({
    getServerTime: function( clientTime ) {
      return {
        pong: clientTime,
        time: +new Date()
      };
    }
  });
  Meteor.time = function() {
    return +new Date();
  };
  Meteor.time.sync = true;
} else {
  var sync = function( callback ) {
    var requestTime = Date.now();
    Meteor.call( "getServerTime", requestTime, function( error, response ) {
      Meteor.setTimeout( sync, error ? 2000 : 30000 );
      if ( error ) {
        console.log( "Error syncing time" );
        if ( callback ) {
          callback( error );
        }
      } else {
        Meteor.time.sync = true;
        var pong = Date.now() - response.pong;
        // just to be inaccurate on purpose, lets assume half our time was request
        timeDiff = response.time - ( response.pong + (pong/2 | 0));
        if ( callback ) {
          callback( null, Meteor.time() );
        }
      }
    });
  };

  sync();
  Meteor.time = function() {
    return Date.now() + timeDiff;
  };
  Meteor.timeAsync = function( callback ) {
    if ( Meteor.time.sync ) {
      callback( null, Meteor.time() );
    } else {
      sync( callback );
    }
  };
}
