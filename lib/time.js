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
        Session.set( "timeDiff", response.time - ( response.pong + (pong/2 | 0)) );
        if ( callback ) {
          callback( null, Meteor.time() );
        }
      }
    });
  };

  sync();
  Meteor.time = function() {
    var context = Meteor.deps.Context.current;
    if ( context ) {
      Meteor.setTimeout( _.bind( context.invalidate, context ), 1000 );
    }
    return Date.now() + Session.get( "timeDiff" );
  };
  Meteor.timeAsync = function( callback ) {
    if ( Meteor.time.sync ) {
      callback( null, Meteor.time() );
    } else {
      sync( callback );
    }
  };

  Handlebars.registerHelper("timeago", function( timeThen ) {
    if ( !timeThen ) {
      return "";
    }
    var temp,
      timeNow = Meteor.time(),
      diff = timeNow - timeThen,
      future = diff < 0,
      then = new Date( timeThen ),
      result = "<span class='timeago' title='" + then.toISOString() + "'>",
      parts = [];

    if ( future ) {
      diff *= -1;
    }
    diff = diff / 1000 | 0;
    temp = diff % 60;
    if ( temp ) {
      parts.unshift( temp + "s" );
    }
    diff = diff / 60 | 0;
    temp = diff % 60;
    if ( temp ) {
      parts.unshift( temp + "m" );
    }
    diff = diff / 60 | 0;
    temp = diff % 24;
    if ( temp ) {
      parts.unshift( temp + "h" );
    }
    diff = diff / 24 | 0;
    if ( diff > 30 ) {
      result += then.toLocaleString();
    } else {
      if ( diff ) {
        parts.unshift( diff + "d" );
      }
      result += parts.slice(0,2).join(" ");
      result += future ? " from now": " ago";
    }
    result += "</span>";
    return new Handlebars.SafeString(result);
  });
}
