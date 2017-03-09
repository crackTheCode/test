 
function calculateQueryRelevanceScores(results, queryTermsHashtable) {
  var resultObjects = [];
  var queryTermsOverallValues = [];
  for (var key in results) {
    var resultObject = searchLevelQueryTerms(results[key], queryTermsHashtable);
    // console.log('resultObject.article.title:' + resultObject.article.title);
    // console.log('resultObject.overallNum:' + resultObject.overallNum);
    resultObjects.push(resultObject);
    queryTermsOverallValues.push(resultObject.overallNum);
  }

  var normalized = normalizeToRange(queryTermsOverallValues, 0, 100);

  for (k = 0; k < resultObjects.length; k++) {
    resultObjects[k].queryPercentage = Math.round(normalized[k] * 10) / 10;
  }
  // var queryTermsThreshold = getAvg(queryTermsOverallValues);
  // return [resultObjects, queryTermsThreshold];
  return resultObjects;
}

function searchLevelQueryTerms(candidate, queryTermsHashtable){
  var titleOverallNum = 0, bodyOverallNum = 0;
  // boolean to check whether all original terms are present in the either TITLE or BODY of the document.
  // initialise with true and check in for loop if all exist, if any of the terms are missing the bool becomes false
  var foundAllOriginalTermsInTitle = true;
  var foundAllOriginalTermsInBody = true;

  var ratiosMap = {};
  var totalHitsInBodyCounter = 0;
  var reduceBodyNum = false;

  // var numberOfWords = countWords(candidate.body);

  // find original query terms in TITLE
  for (i = 0; i < queryTermsHashtable[0].length; i++) {
    var indices = getIndicesOf(' ' + queryTermsHashtable[0][i], candidate.title, false);
    // if original term missing in the title then assign foundAllOriginalTermsInTitle as false
    if (indices.length === 0) foundAllOriginalTermsInTitle = false;
    titleOverallNum += indices.length*MULTIPLIER_TITLE_ORIGINAL_TERMS;
  }
  //all original terms are present in the body
  if (foundAllOriginalTermsInTitle)
    titleOverallNum += BOOSTER_TITLE_ALL_ORIGINAL_TERMS;

  // find original query terms in BODY
  for (i = 0; i < queryTermsHashtable[0].length; i++) {
    // Define original query term with word boundaries
    var regex = new RegExp('\\b' + queryTermsHashtable[0][i] + '\\b', 'gi');
    var indices = getIndicesOfRegExp(regex, candidate.body);
    // var indices = getIndicesOf(' ' + queryTermsHashtable[0][i], candidate.body, false);
    // if original term missing in the body then assign foundAllOriginalTermsInBody as false
    if (indices.length === 0) foundAllOriginalTermsInBody = false;
    bodyOverallNum += indices.length*MULTIPLIER_BODY_ORIGINAL_TERMS;
    totalHitsInBodyCounter += indices.length;
    ratiosMap[queryTermsHashtable[0][i]] = indices.length;
  }

  for (var key in ratiosMap) {
    var ratio = ratiosMap[key]/totalHitsInBodyCounter;
    if (ratio < THRESHOLD_RATIO_TERMS) {
      reduceBodyNum = true;
    }

  }


  //all original terms are present in the body
  if (foundAllOriginalTermsInBody)
    bodyOverallNum += BOOSTER_BODY_ALL_ORIGINAL_TERMS;

  // do we have expanded terms? If yes then find them
  if (queryTermsHashtable[1].length > 0) {
    // find expanded terms in TITLE
    for (i = 0; i < queryTermsHashtable[1].length; i++) {
      var indices = getIndicesOf(' ' + queryTermsHashtable[1][i], candidate.title, false);
      titleOverallNum += indices.length*MULTIPLIER_TITLE_EXPANDED_TERMS;
    }
    // find expanded terms in BODY
    for (i = 0; i < queryTermsHashtable[1].length; i++) {
      var indices = getIndicesOf(' ' + queryTermsHashtable[1][i], candidate.body, false);
      bodyOverallNum += indices.length*MULTIPLIER_BODY_EXPANDED_TERMS;
    }
  }

  if (reduceBodyNum)
    bodyOverallNum = bodyOverallNum*REDUCER_RATIO_TERMS;


  var overallNum = titleOverallNum + bodyOverallNum;

//    Logger.log('result: ' + candidate.title);
//    Logger.log('conceptObjects overall: ' + overallNum);
  var resultWithNum = {
    article: candidate,
    titleOverallNum: titleOverallNum,
    bodyOverallNum: bodyOverallNum,
    overallNum: overallNum,
    queryPercentage: 0
  };

  return resultWithNum;
}

function searchLevelQueryTerms_Match(candidate, queryTermsHashtable){
  var titleOverallNum = 0, bodyOverallNum = 0;

  // Logger.log('queryTermsHashtable.original: ' + queryTermsHashtable.original);
  // Logger.log('queryTermsHashtable.expanded: ' + queryTermsHashtable.expanded);

//  Logger.log('content: ' + candidate.title);

  // var numberOfWords = countWords(candidate.body);

  var num_matchesTitleOriginal = candidate.title.match(new RegExp(queryTermsHashtable.original,"gi"));
  if (num_matchesTitleOriginal != null && num_matchesTitleOriginal.length > 0) {
//    Logger.log('num_matchesTitleOriginal.length: ' + num_matchesTitleOriginal.length);
    titleOverallNum = titleOverallNum + num_matchesTitleOriginal.length*MULTIPLIER_TITLE_ORIGINAL_TERMS;
  }
  if (isEmptyOrSpaces(queryTermsHashtable.expanded.trim())) {}
  else {
    var num_matchesTitleExpanded = candidate.title.match(new RegExp(queryTermsHashtable.expanded,"gi"));
    if (num_matchesTitleExpanded != null && num_matchesTitleExpanded.length > 0) {
      //    Logger.log('num_matchesTitleExpanded.length: ' + num_matchesTitleExpanded.length);
      titleOverallNum = titleOverallNum + num_matchesTitleExpanded.length*MULTIPLIER_TITLE_EXPANDED_TERMS;
    }
  }

  var num_matchesBodyOriginal = candidate.body.match(new RegExp(queryTermsHashtable.original,"gi"));
  if (num_matchesBodyOriginal != null && num_matchesBodyOriginal.length > 0) {
//    Logger.log('num_matchesBodyOriginal.length: ' + num_matchesBodyOriginal.length);
    // bodyOverallNum = bodyOverallNum + ((num_matchesBodyOriginal.length/numberOfWords)*100)*MULTIPLIER_BODY_ORIGINAL_TERMS;
    bodyOverallNum = bodyOverallNum + num_matchesBodyOriginal.length*MULTIPLIER_BODY_ORIGINAL_TERMS;
  }
  if (isEmptyOrSpaces(queryTermsHashtable.expanded.trim())) {}
  else {
    var num_matchesBodyExpanded = candidate.body.match(new RegExp(queryTermsHashtable.expanded,"gi"));
    if (num_matchesBodyExpanded != null && num_matchesBodyExpanded.length > 0) {
//      Logger.log('num_matchesBodyExpanded.length: ' + num_matchesBodyExpanded.length);
      // bodyOverallNum = bodyOverallNum + ((num_matchesBodyExpanded.length/numberOfWords)*100)*MULTIPLIER_BODY_EXPANDED_TERMS;
      bodyOverallNum = bodyOverallNum + num_matchesBodyExpanded.length*MULTIPLIER_BODY_EXPANDED_TERMS;
    }
  }

  var overallNum = titleOverallNum + bodyOverallNum;

//    Logger.log('result: ' + candidate.title);
//    Logger.log('conceptObjects overall: ' + overallNum);
  var resultWithNum = {
    article: candidate,
    overallNum: overallNum,
    queryPercentage: 0
  };

  return resultWithNum;
}
 
