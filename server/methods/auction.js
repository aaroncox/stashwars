Meteor.methods({
  SaveAuction: function(options) {
    var id        = options.id;
    var $set      = options.$set;
    var auction   = Auctions.findOne({_id: id});
    
    if (!auction)
      throw new Meteor.Error(404, "Auction not found.");
    if (!Meteor.userId())
      throw new Meteor.Error(409, "You need to be logged in.");
    if (this.userId != auction.owner)
      throw new Meteor.Error(409, "You can only edit auctions you own.");
    
    var validationResult = validateAuction($set);
    if (validationResult !== true)
      throw new Meteor.Error(409, validationResult);

    Auctions.update( id, { $set: $set } );
  },
  createAuction: function(options) {

    if (!Meteor.userId())
      throw new Meteor.Error(409, "You need to be logged in.");
    if (_.find(["title", "duration", "increment", "minbid"], function(p){return !_.has(options, p);}))
      throw new Meteor.Error(409, "You need to fill out all fields.");
    if (options.title.length < 4)
      throw new Meteor.Error(409, "Title needs to be at least 4 letters.");
    var validationResult = validateAuction(options);
    if (validationResult !== true)
      throw new Meteor.Error(409, validationResult);

    return Auctions.insert({
      owner:      this.userId,
      ownerName:  Meteor.user().username,
      title:      options.title,
      price:      0,
      bids:       0,
      items:      [],
      minbid:     options.minbid,
      duration:   options.duration,
      increment:  options.increment,
      status:     "editing",
      createdAt:  new Date().getTime()
    });
  }
});


/**
 * Validates an auction's options
 * @param {Object} options An object with fields: duration, increment, minbid.
 * @return {Mixed} Returns true on success, otherwise an error string is returned
 */
function validateAuction(options) {
  if (typeof options.duration != "undefined" && !_.find(global.auctionDurations, function(d){return d.value == options.duration;}))
    return "Wrong duration.";
  if (typeof options.increment != "undefined" && !_.find(global.bidIncrements, function(b){return b.value == options.increment;}))
    return "Wrong increment.";
  if (typeof options.minbid != "undefined" && !isPositiveInteger(options.minbid))
    return "Min Bid has to be a positive integer.";
  return true;
}

/**
 * Test for a positive integer
 * @param  {Number} n 
 * @return {Boolean}
 */
function isPositiveInteger(n) {
    return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}