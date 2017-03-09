 

function runQuantitativeDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources, callback) {

  async.waterfall([
    // first, add terms generated through EDDiE API
    function(callback) {
      runJuicer(queryExpandedTerms, 'evidence', operator, time, sources, function (err, results){
        if (err) return callback(err);
        var articles = results;
        console.log('articles.length:' + articles.length);
        callback(null, articles);
      });
    },
    // then, add name entities using Mango API
    function(articles, callback) {
      var resultObjects = calculateQueryRelevanceScores(articles, queryTermsHashtable);
      callback(null, articles, resultObjects);
    }
  ],
  // finally, create keywords for each retrieved term
  function(err, articles, resultObjects) {
    var resultsMap = [];
    var resultsSortedMap = [];

    var quantitativeTermsOverallValues = [];
    for (var key in resultObjects) {
      if (resultObjects[key].queryPercentage > THRESHOLD_QUERY_PERCENTAGE) {
        var resultObject2 = searchQuantitativeArticleLevel1(articles[key]);
        if (typeof resultObject2 !== 'undefined' && resultObject2.entities.length > 0) {
          quantitativeTermsOverallValues.push(resultObject2.overallNum);
          resultsMap.push(resultObject2);
        }
      }
    }

    var quantitativeThreshold = 0;
    if (typeof quantitativeTermsOverallValues !== 'undefined' && quantitativeTermsOverallValues.length > 0)
      quantitativeThreshold = getAvg(quantitativeTermsOverallValues);

    //    var arr = getSortedQueryArray(resultsMap, quantitativeThreshold);
    var arr = getSortedArray(resultsMap, quantitativeThreshold);
    console.log('arr.length:' + arr.length);
    callback(null, arr);
  });


}

function searchQuantitativeArticleLevel1(candidate) {
  var entities = [];
  var overallNum = 0;
  for (i = 0; i < EVIDENCE_DATA_ARRAY.length; i++) {
    var entityUnit = EVIDENCE_DATA_ARRAY[i][0];
    var termsOccurences = searchArticleLevel2b(candidate.body, i, EVIDENCE_DATA_ARRAY);
    if (termsOccurences > 0) {
      var termsOccurencesItem = {
        entityUnit: entityUnit,
        overallNum: termsOccurences
      };
      entities.push(termsOccurencesItem);
      overallNum += termsOccurencesItem.overallNum;
    }
  }

  var resultWithNum = {
    article: candidate,
    entities: entities,
    overallNum: overallNum
  };
  return resultWithNum;
}

 
