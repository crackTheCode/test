 

function runRamificationDimension(queryExpandedTerms, operator, callback) {

  if (TWITTER) {
    runTwitterSearch(queryExpandedTerms, operator, function (err, tweets){
      if (err) return callback(err);
      var ramifications = tweets;
      // console.log('ramifications.length:' + ramifications.length);
      return callback  && callback(null, ramifications);
    });
  } else {
    // ramification call to API once implemented
  }

    // var ramifications = [];
    // if (TWITTER) {
    //     // var url = 'http://cruise.imuresearch.eu/ui/service/tweets?query=%22mexican%20wall%22&name=trump&lang=en';
    //     var json = runTwitterSearch(queryExpandedTerms, operator);
    //     var tweets = json.hits;
    //     ramifications = tweets;
    // } else {
    //
    // }
    //
    // if (ramifications.length === 0) {
    //     throw 'Your search did not match any articles. Try different, more general, or fewer keywords';
    // } else {
    //
    //     // for (var c in allCartoons) {
    //     //  Logger.log(allCartoons[c].src);
    //     //  Logger.log(allCartoons[c].url);
    //     //  Logger.log(allCartoons[c].author);
    //     //  Logger.log(allCartoons[c].title);
    //     // }
    //     return ramifications;
    // }



}

 
