 

function runVisualisationDimension(queryExpandedTerms, operator, callback) {

  runGoogleCustomSearch(queryExpandedTerms, operator, 'infographic', 1, function (err, results){
    if (err) return callback(err);
    var visualisations = results.items;
    // console.log('ramifications.length:' + ramifications.length);
    return callback  && callback(null, visualisations);
  });


    // var visualisations = runGoogleCustomSearch(queryExpandedTerms, operator, 'infographic', 1);
    //
    // if (typeof visualisations.items === 'undefined') {
    //     throw 'Your search did not match any visualisations. Try different, more general, or fewer keywords';
    // } else {
    //
    //     // for (var c in allCartoons) {
    //     //  Logger.log(allCartoons[c].src);
    //     //  Logger.log(allCartoons[c].url);
    //     //  Logger.log(allCartoons[c].author);
    //     //  Logger.log(allCartoons[c].title);
    //     // }
    //     return visualisations.items;
    // }



}
 
