 

function runCausalDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources, callback) {


  async.waterfall([
    // first, add terms generated through EDDiE API
    function(callback) {
      runJuicer(queryExpandedTerms, 'causal', operator, time, sources, function (err, results){
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

    var causalTermsOverallValues = [];
    for (var key in resultObjects) {
      // if (typeof resultObjects[key] !== 'undefined' && resultObjects[key].overallNum > queryTermsThreshold) {
        var resultObject2 = searchCausalArticleLevel1(articles[key], resultObjects[key].queryPercentage, resultObjects[key].titleOverallNum, resultObjects[key].bodyOverallNum);
        // if (typeof resultObject2 !== 'undefined') {
          if (resultObject2.queryPercentage > THRESHOLD_QUERY_PERCENTAGE) {
            causalTermsOverallValues.push(resultObject2.overallNum);
            resultsMap.push(resultObject2);
          }
        // }
      // }
    }

    var normalized = normalizeToRange(causalTermsOverallValues, 0, 100);

    for (k = 0; k < resultsMap.length; k++) {
      // resultsMap[k].dimensionPercentage = Math.round(normalized[k] * 10) / 10;
      resultsMap[k].dimensionPercentage = normalized[k];
      var temp = resultsMap[k].dimensionPercentage + resultsMap[k].queryPercentage;
      // resultsMap[k].overallPercentage = Math.round(temp/2 * 10) / 10;
      resultsMap[k].overallPercentage = temp/2;
    }
    var arr = getSortedArrayPercentage(resultsMap, THRESHOLD_CAUSAL_PERCENTAGE, 'dimension');

    console.log('arr.length:' + arr.length);
    callback(null, arr);
  });

}


function searchCausalArticleLevel1(candidate, queryPercentage, titleOverallNum, bodyOverallNum){
  var entities = [];
  var overallNum = 0;
  var lengthBooster = BOOSTER_ARTICLE_LENGTH_DEFAULT;
  var wordsInDoc = countWords(candidate.body);
  if (wordsInDoc >= THRESHOLD_ARTICLE_LENGTH) {
    if (wordsInDoc >= 600 && wordsInDoc < 700) lengthBooster = BOOSTER_ARTICLE_LENGTH_600_699;
    else if (wordsInDoc >= 700 && wordsInDoc < 800) lengthBooster = BOOSTER_ARTICLE_LENGTH_700_799;
    else if (wordsInDoc >= 800 && wordsInDoc < 900) lengthBooster = BOOSTER_ARTICLE_LENGTH_800_899;
    else if (wordsInDoc >= 900 && wordsInDoc < 1000) lengthBooster = BOOSTER_ARTICLE_LENGTH_900_999;
    else if (wordsInDoc >= 1000 && wordsInDoc < 1500) lengthBooster = BOOSTER_ARTICLE_LENGTH_OVER1000;
    else if (wordsInDoc >= 1500 && wordsInDoc < 2000) lengthBooster = BOOSTER_ARTICLE_LENGTH_OVER1500;
    else if (wordsInDoc >= 2000) lengthBooster = BOOSTER_ARTICLE_LENGTH_OVER2000;
    else lengthBooster = BOOSTER_ARTICLE_LENGTH_DEFAULT;

    // check terms with actual terms
    for (j = 0; j < CAUSAL_TERMS.length; j++) {
      var termName = CAUSAL_TERMS[j][0];
      var termBooster = CAUSAL_TERMS[j][1];
      var indices = getIndicesOf(termName, candidate.body, true);
      if (indices.length > 0) {
        var termOverallNum = indices.length * termBooster;
        var termsOccurencesItem = {
          entityUnit: termName,
          overallNum: termOverallNum
        };
        entities.push(termsOccurencesItem);
        overallNum += termsOccurencesItem.overallNum;
      }
    }


    // // check terms with actual terms
    // for (j = 0; j < CAUSAL_DATA_ARRAY[0][1].length; j++) {
    //   var indices = getIndicesOf(CAUSAL_DATA_ARRAY[0][1][j], candidate.body, false);
    //   if (indices.length > 0) {
    //     var termsOccurencesItem = {
    //       entityUnit: CAUSAL_DATA_ARRAY[0][1][j],
    //       overallNum: indices.length
    //     };
    //     entities.push(termsOccurencesItem);
    //     overallNum += termsOccurencesItem.overallNum;
    //   }
    // }

    // // check terms
    // var termsOccurences = searchArticleLevel2b(candidate.body, 0, CAUSAL_DATA_ARRAY);
    // if (termsOccurences > 0) {
    //   var termsOccurencesItem = {
    //     entityUnit: 'Terms',
    //     overallNum: termsOccurences
    //   };
    //   entities.push(termsOccurencesItem);
    //   overallNum += termsOccurencesItem.overallNum;
    // }

    // // check dates
    // var datesOccurences = checkExpInString(candidate.body, allRegexDates);
    // if (datesOccurences > 0) {
    //   var datesOccurencesItem = {
    //     entityUnit: 'Dates',
    //     overallNum: datesOccurences
    //   };
    //   entities.push(datesOccurencesItem);
    //   overallNum += datesOccurencesItem.overallNum;
    // }

    // // check dates
    // var datesOccurences = searchArticleLevel2RegEx(candidate.body, allRegexDatesArray);
    // if (datesOccurences > 0) {
    //   var datesOccurencesItem = {
    //     entityUnit: 'Dates',
    //     overallNum: datesOccurences
    //   };
    //   entities.push(datesOccurencesItem);
    //   overallNum += datesOccurencesItem.overallNum;
    // }


    // // check time periods
    // var timePeriodOccurences = checkExpInString(candidate.body, allRegexTimePeriods);
    // if (timePeriodOccurences > 0) {
    //   var timePeriodOccurencesItem = {
    //     entityUnit: 'TimePeriods',
    //     overallNum: timePeriodOccurences
    //   };
    //   entities.push(timePeriodOccurencesItem);
    //   overallNum += timePeriodOccurencesItem.overallNum;
    // }

    // // check time periods
    // var timePeriodOccurences = searchArticleLevel2RegEx(candidate.body, allRegexTimePeriodsArray);
    // if (timePeriodOccurences > 0) {
    //   var timePeriodOccurencesItem = {
    //     entityUnit: 'TimePeriods',
    //     overallNum: timePeriodOccurences
    //   };
    //   entities.push(timePeriodOccurencesItem);
    //   overallNum += timePeriodOccurencesItem.overallNum;
    // }

    // only add the lengthBooster if there is any match for causal terms and other rules
    if (overallNum > 0)
      overallNum += lengthBooster;
  }
  var resultWithNum = {
    article: candidate,
    entities: entities,
    overallNum: overallNum,
    dimensionPercentage: 0,
    queryPercentage: queryPercentage,
    overallPercentage: 0,
    lengthBooster: lengthBooster,
    titleOverallNum: titleOverallNum,
    bodyOverallNum: bodyOverallNum
  };
  return resultWithNum;
}
 
