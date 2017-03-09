 

function runIndividualsDimension(queryExpandedTerms, queryTermsHashtable, queryKeywordTags, operator, time, sources, callback) {

  async.waterfall([
    // first, add terms generated through EDDiE API
    function(callback) {
      runJuicer(queryExpandedTerms, 'individual', operator, time, sources, function (err, results){
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
    },
    // then, add name entities using Mango API
    function(articles, resultObjects, callback) {
      var resultsMap = {};
      var personsMap = {};
      var personsCountMap = {};
      var personsOverallCountMap = {};
      var personsSortedOverallCountMap = [];
      var tweetsArray = [];
      var personsResultsMap = {};
      var personsTweetsMap = {};
      var personDbpediaMap = {};


      for (var t in resultObjects) {
        if (resultObjects[t].queryPercentage > THRESHOLD_QUERY_PERCENTAGE_INDIVIDUALS) {
          resultsMap[articles[t].id] = resultObjects[t];
          // are there concepts in the article that have person as a type?
          var found = findPersons(articles[t]);
          // yes, there is at least one person concept
          if (found) {
            personsMap = extractPersonsFromText(articles[t]);
            if (typeof personsMap !== 'undefined') {
              personsCountMap = countPersons(personsMap);

              for (var key in personsCountMap) {
                if (key in personsOverallCountMap) {
                  personsOverallCountMap[key] = personsOverallCountMap[key] + personsCountMap[key];
                }
                else {
                  personsOverallCountMap[key] = personsCountMap[key];
                }
              }

              // dbpedia entries
              var resultDbpedia = extractDbpedia(articles[t],personDbpediaMap);
              personDbpediaMap = resultDbpedia;
            }
          }
        }
      }
      //    for (var key in personsOverallCountMap) {
      //      console.log('personsOverallCountMap key: ' + key + '-- value: ' + personsOverallCountMap[key]);
      //    }

      //    personsSortedOverallCountMap = getSortedKeys(personsOverallCountMap);

      personsSortedOverallCountMap = getNosortedKeys(personsOverallCountMap);

      //    for (var key in personsSortedOverallCountMap) {
      //      console.log('personsSortedOverallCountMap key: ' + key + '-- value: ' + personsSortedOverallCountMap[key]);
      //    }

      for (var key in personsSortedOverallCountMap) {
        var resultObjects = searchIndividualsArticleLevel1(personsSortedOverallCountMap[key][0],resultsMap);
        // console.log('key: ' + personsSortedOverallCountMap[key]);
        if (typeof resultObjects !== 'undefined' && resultObjects.length > 0) {
          for (i = 0; i < resultObjects.length; i++) {
            personsResultsMap[personsSortedOverallCountMap[key][0]] = resultObjects;
          }
        }
      }

      //    for (var key in personsResultsMap) {
      //      console.log('personsResultsMap key: ' + key + '-- value: ' + personsResultsMap[key][0].title);
      //    }

      // string to collect all names to search in wikipedia
      // but we can't use more than 20, because of exlimit.
      var allNamesArr = {};
      var allNames = '';
      var countArr = 0, countNames = 0;

      for (var key in personsResultsMap) {

        var parts = key.split('/');
        var name = parts[parts.length-1];
        console.log('name: ' + name);
        countNames = countNames + 1;
        if (countNames < 20) {
          if (allNames === '') {
            allNames = decodeURI(name).replace(/ /g, '_');
            allNamesArr[countArr] = allNames;
          }
          else {
            allNames += "|" + decodeURI(name).replace(/ /g, '_');
            allNamesArr[countArr] = allNames;
          }
        }
        else {
          countNames = 0;
          countArr = countArr + 1;
          allNames = decodeURI(name).replace(/ /g, '_');
          allNamesArr[countArr] = allNames;
        }

        // var tweets = runTwitter(name + 'x~' + queryKeywordTags, 'AND', 4);
        // if (typeof tweets !== 'undefined' && tweets.length > 0) {
        //   for (i = 0; i < tweets.length; i++) {
        //     //          console.log('resultObject: ' + tweets[i].id);
        //     tweetsArray.push(tweets[i]);
        //   }
        // }
        // personsTweetsMap[key] = tweetsArray;
        // tweetsArray = [];
      }
      personsResultsMap['Other human angles'] = getGenericPrompt();
      callback(null, personsResultsMap, personsTweetsMap, personDbpediaMap, allNamesArr);
    },
    function (personsResultsMap, personsTweetsMap, personDbpediaMap, allNamesArr, waterFallCallback) {
      var personWikipediaMap = {};


      var runWikis = function (list, key, callback) {
        runWikipedia(list[key], function (err, pages) {
          if (err) callback(err);
          console.log('pages.length: ' + pages.length);
          callback(null, pages);
        });
      }
      console.log('allNamesArr.length: ' + Object.keys(allNamesArr).length);
      async.times(Object.keys(allNamesArr).length, function(n, next) {
        runWikis(allNamesArr, n, function(err, pages) {
            next(err, pages);
        });
      }, function(err, allPages) {
        if (err) callback(err);
        var wikis = _.uniq(_.flatten(allPages), 'title');
        console.log('wikis.length: ' + wikis.length);
        for (i = 0; i < wikis.length; i++) {
          if (wikis[i].title.trim() !== '') {
            console.log('wiki title: ' + decodeURI(wikis[i].title) );
            // console.log('wiki extract: ' + wikis[i].extract );
            personWikipediaMap[wikis[i].title] = wikis[i];
          }
        }
        waterFallCallback(null, personsResultsMap, personsTweetsMap, personDbpediaMap, personWikipediaMap);
      });
    }
  ],
  // finally, create keywords for each retrieved term
  function(err, personsResultsMap, personsTweetsMap, personDbpediaMap, personWikipediaMap) {

      //  for (var key in personWikipediaMap) {
      //    console.log('personWikipediaMap key: ' + key + '-- value: ' + personWikipediaMap[key]);
      //  }
    
    callback(null, [personsResultsMap,personsTweetsMap,personDbpediaMap,personWikipediaMap]);
  });

}

function searchIndividualsArticleLevel1(nameKey, myArray){
  var parts = nameKey.split('/');
  var label = decodeURIComponent(parts[parts.length-1].replace(/_/g, ' '));
  var searchResults = [];
  for (var result in myArray) {
    if (typeof myArray[result].article.concepts !== 'undefined' && myArray[result].article.concepts.length > 0) {
      var conceptObjects = searchIndividualsArticleLevel2(nameKey,label,myArray[result].article.concepts, myArray[result].article.body);
      if (typeof conceptObjects !== 'undefined' && conceptObjects.length > 0) {
        searchResults.push(myArray[result]);
      }
    }
  }
  searchResults.sort(function(a, b) {return b.overallNum - a.overallNum});
  var results = [];
  for (i = 0; i < searchResults.length; i++) {
    // console.log('searchResults - title: ' + searchResults[i].article.title + ', ' +  searchResults[i].overallNum);
    results.push(searchResults[i].article);
}

  return results;
}

function searchIndividualsArticleLevel2(nameKey, label, myArray, content){
  var searchResults = [];
  for (var c in myArray) {
    if (myArray[c].uri === nameKey) {

      var contentToCheck = '';
      // check if name appears in all the body of the article
      if (NUMBER_OF_PARAGRAPHS_PERSON_CONCEPT == 0) {
        contentToCheck = content;
      }
      // check if name appears in the first N paragraphs
      else {
        // restrict to few paragraphs
        var paragraphs = content.split('\n\n');
        for (j = 0; j < NUMBER_OF_PARAGRAPHS_PERSON_CONCEPT; j++) {
          contentToCheck += paragraphs[j];
        }
      }

      if (contentToCheck.indexOf(label) != -1) {
        //          console.log('MATCH: ' + nameKey);
        searchResults.push(myArray[c]);
      }
    }
  }
  return searchResults;
}

function findPersons(result) {
//  var foundPersons = [];
  var concepts = result.concepts;
  for (i = 0; i < concepts.length; i++) {
    var concept = concepts[i];
    var genericType = concept["generic-type"];
    if (genericType.indexOf("/Person") > -1) {
      return true;
//      foundPersons.push(concepts[i].uri);
//      console.log(concepts[i].uri);
    }
  }
  return false;
}


function countPersons(persons) {
    var mapPersons = {};
    for (var key in persons) {
      if (persons[key].uri in mapPersons) {
        mapPersons[persons[key].uri] = mapPersons[persons[key].uri] + persons[key].count;
      }
      else {
        mapPersons[persons[key].uri] = persons[key].count;
      }
    }

//    for (var key in mapPersons) {
//      console.log('mapPersons key: ' + key + '-- value ' + mapPersons[key]);
//    }
   return mapPersons;
}


function extractPersonsFromText(result) {
//  var content = 'water provided by his aide but Khan does not. The Tooting MP and devout Muslim has begun fasting for Ramadan, abstaining from food and drink for 19 hours a day.\n\nIf Khan, who is 44, is low on energy it does not show. The former shadow justice secretary speaks fluently and passionately about his bid to become Labour’s London mayoral candidate and his vision for the capital.\n\nHe reveals his intention';
  var personsMap = {};
  for (i = 0; i < result.concepts.length; i++) {
    var genericType = result.concepts[i]["generic-type"];
    if (genericType.indexOf("/Person") > -1) {
      var parts = result.concepts[i].uri.split('/');
      var p = decodeURIComponent(parts[parts.length-1].replace(/_/g, ' '));

      var contentToCheck = '';
      // check if name appears in all the body of the article
      if (NUMBER_OF_PARAGRAPHS_PERSON_CONCEPT == 0) {
        contentToCheck = result.body;
      }
      // check if name appears in the first N paragraphs
      else {
        // restrict to few paragraphs
        var paragraphs = result.body.split('\n\n');
        for (j = 0; j < NUMBER_OF_PARAGRAPHS_PERSON_CONCEPT; j++) {
          contentToCheck += paragraphs[j];
        }
      }

      // does the name appear at least once in the contentToCheck?
      if (contentToCheck.indexOf(p) != -1) {
        var key = result.id + "&" + i;
        personsMap[key] = result.concepts[i];
//        personsMap.push(concepts[i]);
//        console.log('firstParagraphs: ' + firstParagraphs);
//        console.log(' result.concepts[i]: ' + result.concepts[i].surface_form);
      }
    }
  }
//    for (var key in personsMap) {
//      console.log('personsMap key: ' + key + '-- value ' + personsMap[key].surface_form);
//    }
  return personsMap;
}
 
