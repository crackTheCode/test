 

/**
 * Run BBC Juicer API to retrieve articles that match intial query/
 * @param  {Array} queryExpandedTerms [description]
 * @param  {[type]} dimensionType      [description]
 * @param  {[type]} operator           [description]
 * @param  {[type]} time               [description]
 * @param  {[type]} sources            [description]
 * @return {[type]}                    [description]
 */
function runJuicer(queryExpandedTerms, dimensionType, operator, time, sources, callback) {

    var preparedQuery = prepareQuery(queryExpandedTerms, operator);
    var str = preparedQuery[0];

    var recentFirst = false;
    if (dimensionType === 'individual' || JUICER_SORT_BY_RECENT_PARAMETER === true)
        recentFirst = true;
    var publishedAfter = PUBLISHED_AFTER;
    var timeFormat = time.split('|');
    if (typeof timeFormat[1] !== 'undefined') {
        if (timeFormat[1] === 'm') {
            var dateRange = parseInt(timeFormat[0]);
            if (dateRange > 0) {
                var d = new Date();
                d.setMonth(d.getMonth() - dateRange);
                var newDate = formatDate(d);
                publishedAfter = newDate + "T00:00:00.000Z";
                // Logger.log('month - ' + dateRange + ': ' + publishedAfter);
            }
        } else if (timeFormat[1] === 'd') {
            var dateRange = parseInt(timeFormat[0]);
            if (dateRange > 0) {
                var d = new Date();
                d.setDate(d.getDate() - dateRange);
                var newDate = formatDate(d);
                publishedAfter = newDate + "T00:00:00.000Z";
                // Logger.log('day - ' + dateRange + ': ' + publishedAfter);
            }
        }
    }
    var parameters = {};
    parameters.q = str;
    parameters.size = JUICER_SIZE_PARAMETER;
    parameters.published_after = publishedAfter;
    parameters.lang = JUICER_LANG_PARAMETER;
    parameters.api_key = JUICER_API_KEY;
    if (recentFirst)
      parameters.recent_first = 'yes';

    var serviceCall = JUICER_URL;
    if (PRESSER) {
      serviceCall = PRESSER_URL;
    }
    $.ajax({
      url: serviceCall,
      type: 'GET',
      // data: {"q":"brexit","size":200,"published_after":"2016-02-10T00:00:00.000Z","lang":"en","api_key":"Wq8CsZK0zZqNoPZwVbxe8HjqM146OuEx"},
      data: parameters,
      dataType: 'json',
      headers: {
        'X-Mashape-Authorization': MASHAPE_KEY
      }
    })
    .done(function(data) {
      var json = data.hits;
      if (!json.length) {
        showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', dimensionType);
        document.getElementById(dimensionType).checked = false;
        return;
      }
      return callback && callback(null, json);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find articles";
      showNotification('error', message);
      return callback && callback(err);
    });


}

function runTwitterSearch(queryExpandedTerms, operator, callback) {
    var allTweets = [];
    var preparedQuery = prepareQuery(queryExpandedTerms, operator);
    var str = preparedQuery[0];
    var facetParameter = preparedQuery[1];

    if (isEmptyOrSpaces(facetParameter)) {
        facetParameter = '&name=%20';
    }
    // var url = 'http://cruise.imuresearch.eu/ui/service/tweets?query=%22mexican%20wall%22&name=trump&lang=en';
    var serviceCall = TWITTER_URL;
    $.ajax({
        url: serviceCall,
        type: 'GET',
        data: {query: str, name: ' ', lang: TWITTER_LANG_PARAMETER},
        dataType: 'json',
        headers: {
          'X-Mashape-Authorization': MASHAPE_KEY
        }
    })
    .done(function(data) {
      // console.log('data:' + data.hits[0].description);
      var json = data.hits;
      for (var t in json) {
        var tweet = {
            id: json[t].id,
            description: json[t].description,
            image: json[t].image,
            body: json[t].body,
            published: json[t].published
        };
        allTweets.push(tweet);
      }
      return callback && callback(null, allTweets);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find tweets";
      showNotification('error', message);
      return callback && callback(err);
    });

    // var response = UrlFetchApp.fetch(url, {
    //     muteHttpExceptions: true
    // });
    // var contents = response.getContentText();
    // contents = fixJsonResponse(contents);
    // var json = JSON.parse(contents);
    // return json;
}

function runGoogleCustomSearch(queryExpandedTerms, operator, visualisationType, startNumber, callback) {
    var preparedQuery = visualisationType + ' AND ';
    preparedQuery += prepareQuery(queryExpandedTerms, operator)[0];
    var url = GOOGLE_SEARCH_URL;
    $.ajax({
        url: url,
        type: 'GET',
        data: {q: preparedQuery, searchType: 'image', num: '10', start: startNumber, key: GOOGLE_SEARCH_KEY, cx: GOOGLE_SEARCH_CX, },
        dataType: 'json',
        // headers: {
        //   'X-Mashape-Authorization': MASHAPE_KEY
        // }
    })
    .done(function(data) {
      var results = data;
      return callback && callback(null, results);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find any results";
      showNotification('error', message);
      return callback && callback(err);
    });

    // var response = UrlFetchApp.fetch(url, {
    //     muteHttpExceptions: true
    // });
    // var contents = response.getContentText();
    // var json = JSON.parse(contents);
    // return json;

}

/**
 * Run Cartoon Movement API to retrieve cartoons for the quirky dimension
 * @param  {String} queryTerm
 * @return {[type]}           [description]
 */
function runCartoonMovement(queryTerm, callback) {
    // var queryTerm = 'immigration';
    var allCartoons = [];

    var serviceCall = CARTOON_URL;
    // console.log(queryTerm);
    $.ajax({
        url: serviceCall,
        type: 'GET',
        data: {q: queryTerm},
        dataType: 'json',
        headers: {
          'X-Mashape-Authorization': MASHAPE_KEY
        }
    })
    .done(function(data) {
      // console.log(data.error);
      var json = data;
      console.log('json.length: ' + json.length);
      console.log('json: ' + JSON.stringify(json));
      if (typeof json.error !== 'undefined') {
        showError(json.error, true, '', 'rss-info', 'quirky');
        document.getElementById('quirky').checked = false;
        return;
      }
      for (var t in json) {
        if (json[t].title.toLowerCase().indexOf(queryTerm) > -1) {
            var cartoon = {
                src: CARTOON_PREFIX + json[t].src,
                url: CARTOON_PREFIX + json[t].href,
                author: json[t].author,
                title: json[t].title
            };
            allCartoons.push(cartoon);
        }
      }
      return callback && callback(null, allCartoons);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find cartoons";
      showNotification('error', message);
      return callback && callback(err);
    });

    // var options = {
    //     "method": "get",
    //     muteHttpExceptions: true
    // };
    // var response = UrlFetchApp.fetch(serviceCall, options);
    // // Logger.log(serviceCall);
    //
    // if (response.getContentText().indexOf('"error"') < 0) {
    //     // if (response.getContentText().indexOf('<') < 0) {
    //     var json = JSON.parse(response.getContentText());
    //     // Logger.log(response.getContentText());
    //     for (var t in json) {
    //         if (json[t].title.toLowerCase().indexOf(queryTerm) > -1) {
    //             var cartoon = {
    //                 src: CARTOON_PREFIX + json[t].src,
    //                 url: CARTOON_PREFIX + json[t].href,
    //                 author: json[t].author,
    //                 title: json[t].title
    //             };
    //             allCartoons.push(cartoon);
    //         }
    //     }
    //     // }
    //
    // }
    //
    // // for (var c in allCartoons) {
    // //   Logger.log(allCartoons[c].src);
    // //   Logger.log(allCartoons[c].url);
    // //   Logger.log(allCartoons[c].author);
    // //   Logger.log(allCartoons[c].title);
    // // }
    // return allCartoons;
}

/**
 * [runWikipedia description]
 * @param  {[type]} titles [description]
 * @return {[type]}        [description]
 */
function runWikipedia(titles, callback) {
    //  titles = 'David Cameron|Neil Lennon';
    // var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&pithumbsize=300&exlimit=max&explaintext&exintro&titles=";
    //  var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&titles=";
    var serviceCall = WIKIPEDIA_URL;
    // format=json&action=query&prop=extracts|pageimages&pithumbsize=300&exlimit=max&explaintext&exintro&titles=

    var parameters = {};
    parameters.format = 'json';
    parameters.action = 'query';
    parameters.prop = 'extracts|pageimages';
    parameters.pithumbsize = 300;
    parameters.exlimit = 'max';
    parameters.explaintext = 'empty';
    parameters.exintro = 'empty';
    parameters.titles = titles;

    $.ajax({
        url: serviceCall,
        type: 'GET',
        data: parameters,
        dataType: 'json',
        headers: {
          'X-Mashape-Authorization': MASHAPE_KEY
        }
    })
    .done(function(data) {
      var results = data.query.pages;
      var pages = [];
      for (var t in results) {
          var page = {
              title: results[t].title,
              url: 'https://en.wikipedia.org/wiki/' + results[t].title.replace(/ /g, '_'),
              extract: ' ',
              pageid: results[t].pageid,
              // below its short for this:
              // if (typeof results[t].thumbnail !== 'undefined') {
              //   page.image = results[t].thumbnail.source;
              // }
              // image: typeof results[t].thumbnail !== 'undefined' && results[t].thumbnail.source
              image: ''
          };
          if (typeof results[t].extract !== 'undefined') {
              page.extract = results[t].extract;
          }
          if (typeof results[t].thumbnail !== 'undefined') {
              page.image = results[t].thumbnail.source;
          }
          pages.push(page);
      }
      return callback && callback(null, pages);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find name entitites";
      showNotification('error', message);
      return callback && callback(err);
    });
}

/**
 * [runEddie description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function runEddie(text, callback) {

    async.waterfall ([
      function (callback) {
        if (isEmptyOrSpaces(text)) {
          inject.events.emit("getSelectedText",{
            successCallback: function(output) {
              console.log('output: ' + output);
              text = output;
              text = text[0].replace(/\(|\)|\?|\*|\+|\-|!|&|:|;/g, ' ');
              // no text selected in doc
              if (text.split(' ').length === 0) {
                console.log(1)
                showError(NOTIFICATION_INSERT_NO_EDDIE_SELECTION, true, '', 'rss-info', null);
                return;
              }
              // If the user highlights a large chunk of text to insert into the keywords (e.g. >20 words)
              else if (text.split(' ').length > 20) {
                console.log(2)
                showError(NOTIFICATION_LARGE_CHUNK_HIGHLIGHTED, true, '', 'rss-info', 'quirky');
                return;
              }
              else
                callback(null, text);
          },
            errorCallback:function(err) {
              showError(err, true, '', 'rss-info', null);
              return;
            }
          });
        }
      }
    ],
    function (err, text) {
                console.log(3)
      var serviceCall = EDDIE_URL + encodeURIComponent(text);
      $.ajax({
          url: serviceCall,
          type: 'GET',
          data: {},
          dataType: 'json',
          headers: {
            'X-Mashape-Authorization': MASHAPE_KEY
          }
      })
      .done(function(data) {
                console.log(4)
        var terms = data.GetExpandedTermsResult.Terms;
        var content = [];

        // add terms generated through EDDiE API
        for (var t in terms) {
            if (!isEmptyOrSpaces(terms[t].TermValue) && terms[t].TermValue.length > 1 && terms[t].ExpType === 'empty') {
              content.push(terms[t].TermValue);
            }
        }
        return callback && callback(null, text, content);
      })
      .fail(function(err) {
                console.log(5)
        var message = err.responseText || "Unable to generate keywords";
        showNotification('error', message);
        return callback && callback(err);
      });
    });


}

/**
 * [runEddieAdvanced description]
 * @param  {[type]} queryTerms          [description]
 * @param  {[type]} extractNameEntities [description]
 * @return {[type]}                     [description]
 */
function runEddieAdvanced(queryTerms, callback) {
    //  var queryTerms = ["immigration", "London", "David Cameron", "migrant"];
    //  var extractNameEntities = false;
    var content = {};
    for (var q in queryTerms) {
        content[queryTerms[q]] = 'empty';
    }
    var query = queryTerms.join(" ");

    //  var url = "https://kzachos-spoe-v1.p.mashape.com/eddie/";
    // var url = "https://kzachos-textbooster-v1.p.mashape.com/eddie/";
    //  var query = "Mr Acorn joined in the yiddish group this morning";
    var serviceCall = EDDIE_URL + encodeURIComponent(query);
    $.ajax({
        url: serviceCall,
        type: 'GET',
        data: {},
        dataType: 'json',
        headers: {
          'X-Mashape-Authorization': MASHAPE_KEY
        }
    })
    .done(function(data) {
      var terms = data.GetExpandedTermsResult.Terms;

      // if (extractNameEntities === true) {
      //     // add names through Mango API
      //     var names = findNameEntities(query, 'text');
      //     if (typeof names !== 'undefined' && names.length > 0) {
      //         var namesString = '';
      //         for (var n in names) {
      //             namesString += names[n] + ',';
      //         }
      //         namesString = namesString.substring(0, namesString.length - 1);
      //         content['names'] = namesString;
      //     }
      // }

      // add terms generated through EDDiE API
      for (var t in terms) {
          if (!isEmptyOrSpaces(terms[t].TermValue) && terms[t].TermValue.length > 1 && terms[t].ExpType !== 'empty') {
              if (terms[t].RefTermValue in content) {
                  var existingExpandedTerms = content[terms[t].RefTermValue];
                  if (existingExpandedTerms === 'empty') {
                      content[terms[t].RefTermValue] = terms[t].TermValue;
                  } else {
                      var existingExpandedTermsArray = existingExpandedTerms.split(',');
                      if (existingExpandedTermsArray.indexOf(terms[t].TermValue) === -1) {
                          content[terms[t].RefTermValue] = existingExpandedTerms + ',' + terms[t].TermValue;
                      }
                  }
              }
          }
      }
      return callback && callback(null, content);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to generate keywords";
      showNotification('error', message);
      return callback && callback(err);
    });

    // var options = {
    //     "method": "get",
    //     "headers": {
    //         "X-Mashape-Key": MASHAPE_KEY,
    //         "Accept": "text/plain"
    //     },
    //     muteHttpExceptions: true
    // };
    //
    // var response = UrlFetchApp.fetch(serviceCall, options);
    // if (response.getContentText().indexOf('<') < 0) {
    //     // Parse the JSON response from the service
    //     var json = JSON.parse(response.getContentText());
    //
    //     var terms = json.GetExpandedTermsResult.Terms;
    //
    //     if (extractNameEntities === true) {
    //         // add names through Mango API
    //         var names = findNameEntities(query, 'text');
    //         if (typeof names !== 'undefined' && names.length > 0) {
    //             var namesString = '';
    //             for (var n in names) {
    //                 namesString += names[n] + ',';
    //             }
    //             namesString = namesString.substring(0, namesString.length - 1);
    //             content['names'] = namesString;
    //         }
    //     }
    //
    //     // add terms generated through EDDiE API
    //     for (var t in terms) {
    //         if (!isEmptyOrSpaces(terms[t].TermValue) && terms[t].TermValue.length > 1 && terms[t].ExpType !== 'empty') {
    //             if (terms[t].RefTermValue in content) {
    //                 var existingExpandedTerms = content[terms[t].RefTermValue];
    //                 if (existingExpandedTerms === 'empty') {
    //                     content[terms[t].RefTermValue] = terms[t].TermValue;
    //                 } else {
    //                     var existingExpandedTermsArray = existingExpandedTerms.split(',');
    //                     if (existingExpandedTermsArray.indexOf(terms[t].TermValue) === -1) {
    //                         content[terms[t].RefTermValue] = existingExpandedTerms + ',' + terms[t].TermValue;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // //  for (var c in content) {
    // //    Logger.log(c);
    // //    Logger.log(content[c]);
    // //  }
    //
    // return content;
}

function findNames(content, type) {
    //  content = "Catherine Herridge is an award-winning Chief Intelligence correspondent for FOX News Channel (FNC) based in Washington, D.C. She covers intelligence, the Justice Department and the Department of Homeland Security. Herridge joined FNC in 1996 as a London-based correspondent.";
    //  type = "text";
    //  var parameterText = "text=";
    //  var parameterUri = "uri=";
    var url = RAMEN_URL + "names?";
    var serviceCall = url + type + "=" + encodeURIComponent(content);
    //  var url = UrlShortener.Url.insert({
    //    longUrl: serviceCall
    //  });
    var options = {
        "method": "get",
        muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(serviceCall, options);
    //  Logger.log('response: ' + response);
    if (response.getContentText().indexOf('<') < 0) {
        var json = JSON.parse(response.getContentText());
        var results = json.results.people;
        var names = [];
        for (var t in results) {
            //    var p = results[t].name["id"].replace(/_/g, ' ');
            var p = results[t].name["id"];
            names.push(p);
            //    Logger.log('name: ' + p);
        }
    }
    return names;
}

function findNameEntities(content, type, callback) {
    var serviceCall = MANGO_URL;
    $.ajax({
        url: serviceCall,
        type: 'GET',
        data: {text: content},
        dataType: 'json',
        headers: {
          'X-Mashape-Authorization': MASHAPE_KEY
        }
    })
    .done(function(data) {
      var results = data.results;
      var names = [];
      for (var t in results) {
          if (typeof results[t].types !== 'undefined' && results[t].types.length > 0) {
              // find all strings in array containing 'NaturalPerson'
              var matches = _.filter(
                  results[t].types,
                  function(s) {
                      return s.indexOf('Person') !== -1;
                  }
                  // function( s ) { return s.length > 0; }
              );
              if (typeof matches !== 'undefined' && matches.length > 0) {
                  var parts = results[t].uri.split('/');
                  var p = decodeURIComponent(parts[parts.length - 1]);
                  var p = decodeURIComponent(parts[parts.length - 1].replace(/_/g, ' '));
                  names.push(p);
                  //          Logger.log('name: ' + p);
              }
          }

      }
      return callback && callback(null, names);
    })
    .fail(function(err) {
      var message = err.responseText || "Unable to find name entitites";
      showNotification('error', message);
      return callback && callback(err);
    });

    // var options = {
    //     "method": "get",
    //     muteHttpExceptions: true
    // };
    // var response = UrlFetchApp.fetch(serviceCall, options);
    // //  Logger.log('response: ' + response);
    // if (response.getContentText().indexOf('<') < 0) {
    //     //    Logger.log('stringStartsWith: ' + response.getContentText().indexOf('<'));
    //     var json = JSON.parse(response.getContentText());
    //     var results = json.results;
    //     var names = [];
    //     for (var t in results) {
    //         if (typeof results[t].types !== 'undefined' && results[t].types.length > 0) {
    //             // find all strings in array containing 'NaturalPerson'
    //             var matches = underscoreGS._filter(
    //                 results[t].types,
    //                 function(s) {
    //                     return s.indexOf('Person') !== -1;
    //                 }
    //                 // function( s ) { return s.length > 0; }
    //             );
    //             if (typeof matches !== 'undefined' && matches.length > 0) {
    //                 var parts = results[t].uri.split('/');
    //                 var p = decodeURIComponent(parts[parts.length - 1]);
    //                 var p = decodeURIComponent(parts[parts.length - 1].replace(/_/g, ' '));
    //                 names.push(p);
    //                 //          Logger.log('name: ' + p);
    //             }
    //         }
    //
    //     }
    // }
    // return names;
}

function prepareQuery(queryExpandedTerms, operator) {
    var str = '';
    var facetParameter = '&';
    if (operator === 'AND') {
        for (var key in queryExpandedTerms) {
            if (key === 'names') {
                var names = queryExpandedTerms[key].split(',');
                for (var n in names) {
                    var p = decodeURIComponent(names[n].replace(/ /g, '_'));
                    facetParameter += "name=" + encodeURIComponent(p) + "&";
                }
            } else {
                if (queryExpandedTerms[key] === 'empty') {
                    str += '"' + key + '" ';
                } else {
                    var terms = queryExpandedTerms[key].split(',');
                    str += '(';
                    str += '"' + key + '" OR ';
                    for (var t in terms) {
                        str += '"' + terms[t] + '" OR ';
                    }
                    str = str.substring(0, str.length - 4);
                    str += ')';
                }
                str += ' ' + operator + ' ';
            }
        }
        str = str.substring(0, str.length - 4).trim();
    } else { // OR
        var baseStr = '(';
        var counter = 0;
        for (var key in queryExpandedTerms) {
            if (key === 'names') {
                var names = queryExpandedTerms[key].split(',');
                for (var n in names) {
                    var p = decodeURIComponent(names[n].replace(/ /g, '_'));
                    facetParameter += "name=" + encodeURIComponent(p) + "&";
                }
            } else {
                counter = counter + 1;
                if (queryExpandedTerms[key] === 'empty') {
                    baseStr += '"' + key + '" ';
                } else {
                    var terms = queryExpandedTerms[key].split(',');
                    baseStr += '(';
                    baseStr += '"' + key + '" OR ';
                    for (var t in terms) {
                        baseStr += '"' + terms[t] + '" OR ';
                    }
                    baseStr = baseStr.substring(0, baseStr.length - 4);
                    baseStr += ')';
                }
                baseStr += ' OPERATOR' + counter + ' ';
            }
        }
        baseStr = baseStr.substring(0, baseStr.length - 11);
        baseStr += ')';
        var baseStr2 = baseStr;
        Logger.log('baseStr: ' + baseStr);

        var count = (baseStr.match(/OPERATOR/g) || []).length;
        switch (count) {
            case 0:
                str += baseStr;
                break;
            case 1:
                str += baseStr2.replace(/OPERATOR1/g, 'AND') + ' OR ';
                baseStr2 = baseStr;
                str += baseStr2.replace(/OPERATOR1/g, 'OR');
                break;
            case 2:
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                str += s2 + ' OR ';
                baseStr2 = baseStr;
                s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                s2 = s1.replace(/OPERATOR2/g, 'OR');
                str += s2 + ' OR ';
                baseStr2 = baseStr;
                s1 = baseStr2.replace(/OPERATOR1/g, 'OR');
                s2 = s1.replace(/OPERATOR2/g, 'AND');
                str += s2;
                break;
            case 3:
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                str += s3 + ' OR ';
                baseStr2 = baseStr;
                s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                s2 = s1.replace(/OPERATOR2/g, 'AND');
                s3 = s2.replace(/OPERATOR3/g, 'OR');
                str += s3 + ' OR ';
                baseStr2 = baseStr;
                s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                s2 = s1.replace(/OPERATOR2/g, 'OR');
                s3 = s2.replace(/OPERATOR3/g, 'AND');
                str += s3 + ' OR ';
                baseStr2 = baseStr;
                s1 = baseStr2.replace(/OPERATOR1/g, 'OR');
                s2 = s1.replace(/OPERATOR2/g, 'AND');
                s3 = s2.replace(/OPERATOR3/g, 'AND');
                str += s3;
                break;
            case 4:
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                str += s4 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'OR');
                str += s4 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'OR');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                str += s4 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'OR');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                str += s4 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'OR');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                str += s4;
                break;
            case 5:
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                str += s5 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'OR');
                str += s5 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'OR');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                str += s5 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'OR');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                str += s5 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'OR');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                str += s5 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'OR');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                str += s5;
                break;
            case 6:
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'OR');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'OR');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'OR');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'OR');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'AND');
                var s2 = s1.replace(/OPERATOR2/g, 'OR');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6 + ' OR ';
                baseStr2 = baseStr;
                var s1 = baseStr2.replace(/OPERATOR1/g, 'OR');
                var s2 = s1.replace(/OPERATOR2/g, 'AND');
                var s3 = s2.replace(/OPERATOR3/g, 'AND');
                var s4 = s3.replace(/OPERATOR4/g, 'AND');
                var s5 = s4.replace(/OPERATOR5/g, 'AND');
                var s6 = s5.replace(/OPERATOR6/g, 'AND');
                str += s6;
                break;
            default:
                str += baseStr2.replace(/OPERATOR/g, 'AND');
        }
    }

    facetParameter = facetParameter.substring(0, facetParameter.length - 1);
    return [str, facetParameter];
}
