 

function runQuirkyDimension(queryTermsHashtable, callback) {

  var queryTermsOriginal = queryTermsHashtable[0];

  var runCartoons = function (list, id, callback) {
    runCartoonMovement(list[id], function (err, cartoons) {
      if (err) return callback(err);
      callback(null, cartoons);
    });
  }
  async.times(queryTermsOriginal.length, function(n, next) {
    runCartoons(queryTermsOriginal, n, function(err, cartoons) {
        next(err, cartoons);
    });
  }, function(err, allCartoons) {
    if (err) return callback(err);
    var quirkyResults = _.uniq(_.flatten(allCartoons), 'src');
    // console.log('quirkyResults.length: ' + quirkyResults.length);
    // if (quirkyResults.length === 0) quirkyResults = [];
    return callback && callback(null, quirkyResults);
  });


}

 
