 

/**
 * Check if text is null or white space or no space
 * @param  {String}  str text to check
 * @return {Boolean}     if true than text is null or white space or no space
 */
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function createQueryTermsHashtable(queryExpandedTerms) {
    var queryTermsHashtable = [];
    var originalTerms = [];
    var expandedTerms = [];
    for (var key in queryExpandedTerms) {
        if (queryExpandedTerms[key] === 'empty') {
            originalTerms.push(key);
        } else {
            originalTerms.push(key);
            var terms = queryExpandedTerms[key].split(',');
            for (var t in terms) {
                expandedTerms.push(terms[t]);
            }
        }
    }
    queryTermsHashtable['original'] = originalTerms.join('|');
    queryTermsHashtable['expanded'] = expandedTerms.join('|');
    return [originalTerms, expandedTerms, queryTermsHashtable];
    // return queryTermsHashtable;
}

function findCurrencies(result) {
    //  var foundCurrencies = [];
    var concepts = result.concepts;
    for (i = 0; i < concepts.length; i++) {
        var concept = concepts[i];
        var genericType = concept["generic-type"];
        if (genericType.indexOf("/Thing") > -1) {
            var types = concept["types"];
            if (typeof types !== 'undefined' && types.length > 0) {
                for (j = 0; j < types.length; j++) {
                    if (types[j].indexOf("/Currency") > -1) {
                        //            foundCurrencies.push(concepts[i].uri);
                        //            Logger.log(concepts[i].uri);
                        return true;
                    }
                }
            }

        }
    }
    return false;
}

function extractCurrenciesFromText(result) {
    var currenciesMap = {};
    for (i = 0; i < result.concepts.length; i++) {
        var genericType = result.concepts[i]["generic-type"];
        if (genericType.indexOf("/Thing") > -1) {
            var types = result.concepts[i]["types"];
            if (typeof types !== 'undefined' && types.length > 0) {
                for (j = 0; j < types.length; j++) {
                    if (types[j].indexOf("/Currency") > -1) {
                        var parts = result.concepts[i].uri.split('/');
                        var p = decodeURIComponent(parts[parts.length - 1].replace(/_/g, ' '));

                        // restrict to few paragraphs
                        var paragraphs = result.body.split('\n\n');
                        var firstParagraphs = paragraphs[0] + paragraphs[1] + paragraphs[2] + paragraphs[3];
                        if (firstParagraphs.indexOf(p) != -1) {
                            var key = result.id + "&" + i;
                            currenciesMap[key] = result.concepts[i];
                        }
                    }
                }
            }


        }
    }
    //    for (var key in personsMap) {
    //      Logger.log('personsMap key: ' + key + '-- value ' + personsMap[key].surface_form);
    //    }
    return currenciesMap;
}

function countCurrencies(currencies) {
    var mapCurrencies = {};
    for (var key in currencies) {
        if (currencies[key].uri in mapCurrencies) {
            mapCurrencies[currencies[key].uri] = mapCurrencies[currencies[key].uri] + currencies[key].count;
        } else {
            mapCurrencies[currencies[key].uri] = currencies[key].count;
        }
    }

    //    for (var key in mapPersons) {
    //      Logger.log('mapPersons key: ' + key + '-- value ' + mapPersons[key]);
    //    }
    return mapCurrencies;
}

// function checkExpInString(content, regEx) {
//   // regEx = allRegexDates;
//   // content = '3,000 people marching in support of a second referendum is a wilful dismissal of democracy, says Euan McColm THE spectacle of thousands of flag-waving nationalists isn’t for everyone; while some may see such displays as joyous and uplifting, others detect a darker tone. History is littered with moments when flags were used to conceal something shameful. Terrible things have been done in the name of nationalism. Naturally, Scottish nationalists bristle at the suggestion that theirs is at all similar to any of those other nasty nationalisms. Scottish nationalism, they say, is civic and inclusive. It’s not, they insist, about blood and soil; it’s about shared endeavour. This is all very well and good but so often, in its expression, Scottish nationalism looks exactly the same as the other nationalisms. On Saturday, 3,000 or so Scottish nationalists marched through Glasgow, waving flags and carrying banners in support of a second independence referendum. Having lost the 2014 vote by a substantial margin (55-45 is not, as some nationalists would like to believe, a narrow victory), many Yes campaigners are eager for another kick of the constitutional ball. It is hardly surprising that so many felt compelled to take to the streets on Saturday. First Minister Nicola Sturgeon has devoted her energy to gee-ing up nationalists, preparing them for campaign battle, ever since the UK voted on 23 June to leave the EU. You will have heard Ms Sturgeon explain that Scotland did not vote to leave the EU and, thus, the prospect of a second referendum is back in play. The First Minister has explained repeatedly to Scots that we should feel cheated and betrayed, that we should feel excluded from the UK’s democratic process. And, undoubtedly, those already committed to the cause of Scottish independence will have agreed with every word. But, despite what Ms Sturgeon and other senior SNP members say, Scotland did not vote to stay in the EU. A majority of Scots voted for the UK to stay in the EU. As full participants in a UK-wide vote, those Scots came out on the losing side. That is democracy. That is how it works. One cannot always be a winner. Ms Sturgeon’s narrative – the nationalist one – is designed, of course, to create as much grievance as possible. But it is not factually accurate. Scots are not victims of a “democratic deficit”. Nationalists will, no doubt, see Saturday’s march as evidence that the final push towards the break-up of the UK is now underway. Who could blame them? The First Minister has, over the past month or so, told a story of Scotland denied its destiny by the rest of the UK. This is pure, invigorating oxygen for nationalists. But others, those who were unconvinced by the case for independence in 2014, do not feel the same way. A new poll on Scottish independence last week found that support for the Union remains the position of the majority. Scots who did not want to break up the UK almost two years ago are no more inclined to want to do so because of the Brexit campaign’s victory. With this in mind, one wonders about the good sense of holding a huge, disruptive march in the centre of Glasgow on a busy Saturday afternoon. The First Minister may have made a strategic error in trying to use the EU referendum as the springboard for another crack at Scottish independence. When she succeeded Alex Salmond as First Minister, Ms Sturgeon sought to reassure the pro-UK majority of Scots that she would govern for them just as thoughtfully as she would for those who backed the SNP. And, for a while at least, she was as good as her word. There was no mention of a second independence referendum in the SNP’s manifesto for last year’s General Election and, before the Holyrood election this year, the party went no further than promising to retain the right to call one should Scots demand it. Wisely, Ms Sturgeon turned her attention to the domestic political agenda. There was – and there remains – no escaping the fact that standards in Scotland’s schools are not what they once were. There is a real need for improvements in both literacy and numeracy, and it continues to be the case that too few young people from less affluent backgrounds are able to make the move on to higher education. The appointment of her most capable colleague – deputy First Minister John Swinney – as Cabinet Secretary for Education signalled that Ms Sturgeon did indeed take this matter seriously. This change of tack should have been welcomed by those whose hunger for Scottish independence remains powerful. The sceptical majority will not change their minds because of marches or flag-waving but if the SNP can show real policy delivery then maybe attitudes to its key proposal of ending the Union will soften. Pro-independence newspapers and websites hailed Saturday’s march as proof that the passion for independence is blazing as brightly as ever. SNP MPs and MSPs shared photos in the echo chambers of social media, seemingly convinced that the final heave was almost upon us. But for every one of the 3,000 pro-independence Scots who marched, there were very many more who did not. And among those were the sort of No voters who found the flag-waving nationalism of 2014 a complete turn-off. The First Minister has over-promised when it comes to a second referendum. Her post Brexit-vote campaign was supposed to bring on board a substantial number of those who voted No last time around. But she has failed to do this. Instead, she has reignited the worst of the Yes campaign. If you are in favour of Scottish independence, you may well have looked at Saturday’s march and felt a swell of pride. The sea of Saltires fluttering through the centre of Glasgow may have made your heart sing. But many of those whom the SNP has yet to persuade will have watched with a deep sense of unease.';
//   var overallNum = 0;
//   var num_matches = content.match(regEx);
//   if (num_matches != null && num_matches.length > 0) {
//     overallNum = num_matches.length;
//   }
//   Logger.log('Exp: ' + overallNum);
//   return overallNum;
// }
//
// function checkExpInString2(content, regEx) {
//   // regEx = allRegexDates;
//   // content = '3,000 people marching in support of a second referendum is a wilful dismissal of democracy, says Euan McColm THE spectacle of thousands of flag-waving nationalists isn’t for everyone; while some may see such displays as joyous and uplifting, others detect a darker tone. History is littered with moments when flags were used to conceal something shameful. Terrible things have been done in the name of nationalism. Naturally, Scottish nationalists bristle at the suggestion that theirs is at all similar to any of those other nasty nationalisms. Scottish nationalism, they say, is civic and inclusive. It’s not, they insist, about blood and soil; it’s about shared endeavour. This is all very well and good but so often, in its expression, Scottish nationalism looks exactly the same as the other nationalisms. On Saturday, 3,000 or so Scottish nationalists marched through Glasgow, waving flags and carrying banners in support of a second independence referendum. Having lost the 2014 vote by a substantial margin (55-45 is not, as some nationalists would like to believe, a narrow victory), many Yes campaigners are eager for another kick of the constitutional ball. It is hardly surprising that so many felt compelled to take to the streets on Saturday. First Minister Nicola Sturgeon has devoted her energy to gee-ing up nationalists, preparing them for campaign battle, ever since the UK voted on 23 June to leave the EU. You will have heard Ms Sturgeon explain that Scotland did not vote to leave the EU and, thus, the prospect of a second referendum is back in play. The First Minister has explained repeatedly to Scots that we should feel cheated and betrayed, that we should feel excluded from the UK’s democratic process. And, undoubtedly, those already committed to the cause of Scottish independence will have agreed with every word. But, despite what Ms Sturgeon and other senior SNP members say, Scotland did not vote to stay in the EU. A majority of Scots voted for the UK to stay in the EU. As full participants in a UK-wide vote, those Scots came out on the losing side. That is democracy. That is how it works. One cannot always be a winner. Ms Sturgeon’s narrative – the nationalist one – is designed, of course, to create as much grievance as possible. But it is not factually accurate. Scots are not victims of a “democratic deficit”. Nationalists will, no doubt, see Saturday’s march as evidence that the final push towards the break-up of the UK is now underway. Who could blame them? The First Minister has, over the past month or so, told a story of Scotland denied its destiny by the rest of the UK. This is pure, invigorating oxygen for nationalists. But others, those who were unconvinced by the case for independence in 2014, do not feel the same way. A new poll on Scottish independence last week found that support for the Union remains the position of the majority. Scots who did not want to break up the UK almost two years ago are no more inclined to want to do so because of the Brexit campaign’s victory. With this in mind, one wonders about the good sense of holding a huge, disruptive march in the centre of Glasgow on a busy Saturday afternoon. The First Minister may have made a strategic error in trying to use the EU referendum as the springboard for another crack at Scottish independence. When she succeeded Alex Salmond as First Minister, Ms Sturgeon sought to reassure the pro-UK majority of Scots that she would govern for them just as thoughtfully as she would for those who backed the SNP. And, for a while at least, she was as good as her word. There was no mention of a second independence referendum in the SNP’s manifesto for last year’s General Election and, before the Holyrood election this year, the party went no further than promising to retain the right to call one should Scots demand it. Wisely, Ms Sturgeon turned her attention to the domestic political agenda. There was – and there remains – no escaping the fact that standards in Scotland’s schools are not what they once were. There is a real need for improvements in both literacy and numeracy, and it continues to be the case that too few young people from less affluent backgrounds are able to make the move on to higher education. The appointment of her most capable colleague – deputy First Minister John Swinney – as Cabinet Secretary for Education signalled that Ms Sturgeon did indeed take this matter seriously. This change of tack should have been welcomed by those whose hunger for Scottish independence remains powerful. The sceptical majority will not change their minds because of marches or flag-waving but if the SNP can show real policy delivery then maybe attitudes to its key proposal of ending the Union will soften. Pro-independence newspapers and websites hailed Saturday’s march as proof that the passion for independence is blazing as brightly as ever. SNP MPs and MSPs shared photos in the echo chambers of social media, seemingly convinced that the final heave was almost upon us. But for every one of the 3,000 pro-independence Scots who marched, there were very many more who did not. And among those were the sort of No voters who found the flag-waving nationalism of 2014 a complete turn-off. The First Minister has over-promised when it comes to a second referendum. Her post Brexit-vote campaign was supposed to bring on board a substantial number of those who voted No last time around. But she has failed to do this. Instead, she has reignited the worst of the Yes campaign. If you are in favour of Scottish independence, you may well have looked at Saturday’s march and felt a swell of pride. The sea of Saltires fluttering through the centre of Glasgow may have made your heart sing. But many of those whom the SNP has yet to persuade will have watched with a deep sense of unease.';
//   var found = false;
//   var result = content.search(regEx);
//   if (result > 0) {
//     found = true;
//   }
//   return found;
// }

function matchAll(rgx, str) {
    var arr, extras, matches = [];
    str.replace(rgx.global ? rgx : new RegExp(rgx.source, (rgx + '').replace(/[\s\S]+\//g, 'g')), function() {
        matches.push(arr = [].slice.call(arguments));
        extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
    });
    return matches[0] ? matches : null;
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0,
        searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

//JAL: New 17 Oct 2016
function getIndicesOfRegExp(searchStr, str) {
    var indices = [];
    while (m = searchStr.exec(str)) {
        indices.push(m.index);
    }
    return indices;
}
// End new

function getIndicesOfRegEx(regEx, str, regExlength) {
    var startIndex = 0,
        searchStrLen = regExlength;
    var index, indices = [];
    while ((index = str.substr(startIndex).search(regEx)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function searchArticleLevel2RegEx(content, regExArray) {
    var overallNum = 0;
    for (j = 0; j < regExArray.length; j++) {
        // var indices = getIndicesOfRegEx(regExArray[j], content, 4);
        var indices = matchAll(regExArray[j], content);
        if (indices !== null)
            overallNum += indices.length;
    }
    return overallNum;
}

function searchArticleLevel2b(content, index, arrayToSearch) {
    var overallNum = 0;
    for (j = 0; j < arrayToSearch[index][1].length; j++) {
        var indices = getIndicesOf(arrayToSearch[index][1][j], content, false);
        overallNum += indices.length;
    }
    return overallNum;
}

// function searchArticleLevel2(content, index, arrayToSearch){
//   var entityValues = [];
//   var overallNum = 0;
//   for (j = 0; j < arrayToSearch[index][1].length; j++) {
//     entityValues.push(arrayToSearch[index][1][j]);
//   }
//   var num_matches = content.match(new RegExp(entityValues.join("|"),"gi"));
//   if (num_matches != null && num_matches.length > 0) {
//     overallNum = num_matches.length;
//   }
//   return overallNum;
// }







function convertName(name) {
    var p = decodeURIComponent(name.replace(/_/g, ' '));
    return p;
}

function convertNames(concepts) {
    var persons = [];
    for (i = 0; i < concepts.length; i++) {
        var concept = concepts[i];
        var genericType = concept["generic-type"];
        if (genericType.indexOf("/Person") > -1) {
            //      var parts = concepts[i].uri.split('/');
            //      var p = decodeURIComponent(parts[parts.length-1].replace(/_/g, ' '));
            //      persons.push(p);
            persons.push(concepts[i].surface_form);
        }
    }
    return persons;
}




function extractDbpedia(result, personDbpediaMap) {
    //  var dynamicDbpediaPersonMap = dbpediaPersonMap;
    //  var personDbpediaMap = {};
    var tempMap = [];
    for (i = 0; i < result.concepts.length; i++) {
        var genericType = result.concepts[i]["generic-type"];
        if (genericType.indexOf("/Person") > -1) {
            var personUri = result.concepts[i].uri;
            if (personUri in personDbpediaMap) { // already added this person to the personDbpediaMap, so skip
            } else { // add person to personDbpediaMap
                for (j = 0; j < result.concepts[i].types.length; j++) {
                    if (result.concepts[i].types[j].indexOf("http://dbpedia.org/ontology/") > -1) {
                        var parts = result.concepts[i].types[j].split('/');
                        var ontologyName = parts[parts.length - 1];
                        ontologyName = ontologyName.replace(/([A-Z])/g, ' $1').trim();
                        if (ontologyName !== 'Person' && ontologyName !== 'Agent') {
                            tempMap.push(ontologyName);
                        }
                    }
                }
                personDbpediaMap[personUri] = tempMap;
                tempMap = [];
            }

            //        if (personUri in personWikipediaMap) { // already added this person to the personWikipediaMap, so skip
            //        }
            //        else { // add person to personWikipediaMap
            //          var parts = personUri.split('/');
            //          var name = parts[parts.length-1];
            //
            //          var page = runWikipedia(name);
            //          if (typeof page !== 'undefined' &&  page.length > 0) {
            //            var wiki = {
            //              title: name,
            //              url: 'https://en.wikipedia.org/wiki/' + name.replace(/ /g, '_'),
            //              extract: page[0].extract,
            //              image: page[0].image
            //            };
            //            personWikipediaMap[personUri] = wiki;
            //          }
            //          else {
            //            var wikiEmpty = {
            //              title: name,
            //              url: '',
            //              extract: '',
            //              image: ''
            //            };
            //            personWikipediaMap[personUri] = wikiEmpty;
            //          }
            //
            //        }

        }
    }
    return personDbpediaMap;
}

// private function
function extractDbpediaFromPersonType(personType) {
    var personDbpediaMap = [];
    for (i = 0; i < personType.types.length; i++) {
        if (personType.types[i].indexOf("http://dbpedia.org/ontology/") > -1) {
            var parts = personType.types[i].split('/');
            var ontologyName = parts[parts.length - 1];
            // add person to dbpediaPersonMap
            //      if (ontologyName in dbpediaPersonMap) { // ontologyName already in the map
            //        var existingPersons = dbpediaPersonMap[ontologyName].split('~');
            //        if (existingPersons.length > 0) {
            //          if (personType.uri in existingPersons) { // person already associated with ontologyName, so don't do anything
            //          }
            //          else { // add person to the ontologyName
            //            dbpediaPersonMap[ontologyName] = dbpediaPersonMap[ontologyName] + '~' + personType.uri;
            //          }
            //        }
            //      }
            //      else {
            //        dbpediaPersonMap[ontologyName] = personType.uri;
            //      }
            // add dbpedia to personDbpediaMap
            personDbpediaMap.push(ontologyName);
        }
    }
    return personDbpediaMap;
}


function getSortedKeys(obj, threshold) {
    var arr = [];
    for (var key in obj) {
        if (obj[key] > threshold) {
            arr.push([key, obj[key]])
            //      arr.push(key)
        }
    }
    arr.sort(function(a, b) {
        return b[1] - a[1]
    })
    return arr;
}

function getSortedArray(obj) {
    var arr = [];
    for (var key in obj) {
        // if (obj[key].overallNum > threshold) {
        var resultWithNum = {
            key: key,
            article: obj[key].article,
            overallNum: obj[key].overallNum
        };
        arr.push(resultWithNum)
        // }
    }
    arr.sort(function(a, b) {
        return b.overallNum - a.overallNum
    })
    return arr;
}

function getSortedArray(obj, threshold) {
    var arr = [];
    for (i = 0; i < obj.length; i++) {
        if (obj[i].overallNum > threshold) {
            var resultWithNum = {
                article: obj[i].article,
                entities: obj[i].entities,
                overallNum: obj[i].overallNum
            };
            arr.push(resultWithNum)
        }
    }
    arr.sort(function(a, b) {
        return b.overallNum - a.overallNum
    })
    return arr;
}

function getSortedArrayPercentage(obj, threshold, type) {
    var arr = [];
    var percentage = 0;
    for (i = 0; i < obj.length; i++) {
        if (type === 'dimension') {
            percentage = obj[i].dimensionPercentage;
        } else if (type === 'query') {
            percentage = obj[i].queryPercentage;
        } else if (type === 'overall') {
            percentage = obj[i].overallPercentage;
        }
        if (percentage > threshold) {
            // var resultWithNum = {
            //   article: obj[i].article,
            //   entities: obj[i].entities,
            //   overallNum: obj[i].overallNum,
            //   dimensionPercentage: obj[i].dimensionPercentage,
            //   queryPercentage: obj[i].queryPercentage,
            //   overallPercentage: obj[i].overallPercentage
            // };
            var resultWithNum = obj[i];
            arr.push(resultWithNum)
        }
    }
    arr.sort(function(a, b) {
        return b.overallPercentage - a.overallPercentage
    })
    return arr;
}

function getSortedArray2(obj) {
    var arr = [];
    for (i = 0; i < obj.length; i++) {
        var resultWithNum = {
            article: obj[i].article,
            entities: obj[i].entities,
            overallNum: obj[i].overallNum
        };
        arr.push(resultWithNum)
    }
    arr.sort(function(a, b) {
        return b.overallNum - a.overallNum
    })
    return arr;
}

function getSortedQueryArray(obj, threshold) {
    var arr = [];
    for (i = 0; i < obj.length; i++) {
        if (obj[i].overallNum > threshold) {
            var resultWithNum = {
                article: obj[i].article,
                overallNum: obj[i].overallNum
            };
            arr.push(resultWithNum)
        }
    }
    arr.sort(function(a, b) {
        return b.overallNum - a.overallNum
    })
    return arr;
}


function getNosortedKeys(obj) {
    var arr = [];
    for (var key in obj) {
        //      if (obj[key] > 1) {
        arr.push([key, obj[key]])
        //      arr.push(key)
        //      }
    }
    //  var randomArr = getRandomSubarray(arr,arr.length);
    return arr;
}

function arraySwap(array, overwriteNewValue, keepKey) {
    if (typeof(array) == "undefined") {
        return false;
    };
    if (typeof(array) != "object") {
        array = new Array(array);
    };
    var output = new Array();
    if (typeof(overwriteNewValue) == "undefined") {
        for (var k in array) {
            output[array[k]] = k;
        }
    } else {
        if (!keepKey) {
            for (var k in array) {
                output[array[k]] = overwriteNewValue;
            }
        } else {
            for (var k in array) {
                output[k] = overwriteNewValue;
            }
        };
    }
    return output;
}

function formatDate(date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
        i = arr.length,
        temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function getGenericPrompt() {
    var shuffledConcepts = getRandomSubarray(CONCEPT_ARRAY, 3);
    var content = CONCEPT_CONTENT + ' <b>';
    if (shuffledConcepts[0].indexOf('current year') > -1) {
        var today = new Date();
        var year = today.getFullYear();
        var str = shuffledConcepts[0].replace(/current year/g, year);
        content += str;
    } else {
        content += shuffledConcepts[0];
    }
    content += '</b> and <b>';
    if (shuffledConcepts[1].indexOf('current year') > -1) {
        var today = new Date();
        var year = today.getFullYear();
        var str = shuffledConcepts[1].replace(/current year/g, year);
        content += str;
    } else {
        content += shuffledConcepts[1];
    }
    content += '</b> to <b>';
    if (shuffledConcepts[2].indexOf('current year') > -1) {
        var today = new Date();
        var year = today.getFullYear();
        var str = shuffledConcepts[2].replace(/current year/g, year);
        content += str;
    } else {
        content += shuffledConcepts[2];
    }
    content += '</b>.';

    return content;

}



function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
} // end guid


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getAvg(grades) {
    return grades.reduce(function(p, c) {
        return p + c;
    }) / grades.length;
}

function generateJuicerSources(sources, dimension) {
    var sourceValues = [];
    var allSourcesString = 'sources[]=';

    if (dimension === 'causal') {
        for (i = 0; i < CAUSAL_SOURCES.length; i++) {
            sourceValues.push(CAUSAL_SOURCES[i]);
            allSourcesString += CAUSAL_SOURCES[i] + "&sources[]=";
        }
    } else {
        for (i = 0; i < DEFAULT_SOURCE_ARRAY.length; i++) {
            var sourceType = DEFAULT_SOURCE_ARRAY[i][1];
            if (sources.indexOf(parseInt(sourceType)) > -1) {
                for (j = 0; j < DEFAULT_SOURCE_ARRAY[i][2].length; j++) {
                    sourceValues.push(DEFAULT_SOURCE_ARRAY[i][2][j]);
                    allSourcesString += DEFAULT_SOURCE_ARRAY[i][2][j] + "&sources[]=";
                }
            }
        }
    }
    if (allSourcesString.length > 10) {
        allSourcesString = allSourcesString.substring(0, allSourcesString.length - 11);
    } else {
        allSourcesString = '';
    }
    // Logger.log('allSourcesString: ' + allSourcesString);
    return allSourcesString;
}

function countWords(str) {
    var matches = str.match(/[\w\d]+/gi);
    return matches ? matches.length : 0;
}

function fixJsonResponse(content) {
    if (endsWith(content, "}]}")) {
        Logger.log("ends OK!");
        return content;
    } else {
        Logger.log("ends ODD!");
        var n = content.lastIndexOf(",{\"desc");
        var c = content.substring(0, n);
        c += "]}";
        //    Logger.log(c.substring(c.length-2000,c.length));
        return c;
    }
}

function log10(val) {
    return Math.log(val) / Math.LN10;
}


/**
 * Normalize an array of numbers or objects to a specific range
 * @param {array} array
 * @param {number=} min Low end of range used to normalize, defaults to 0
 * @param {number=} max High end of range used to normalize, defaults to 1
 * @param {string=} field Object property name whose value will be normalized
 * @return {array}
 */
function normalizeToRange(array, min, max, field) {
    if (arguments.length === 1) {
        min = 0;
        max = 1;
    }

    if (!array.length) {
        throw new Error('Array must not be empty');
    }

    if (max <= min) {
        throw new Error('Max can\'t be less than or equal to min');
    }

    var temp = function(a, b) {
        if (field) {
            return a[field] > b[field] ? a : b;
        }

        return Math.max(a, b);
    }
    const highValue = array.reduce(temp);


    // const highValue = array.reduce((a, b) => {
    //   if (field) {
    //     return a[field] > b[field] ? a : b;
    //   }
    //
    //   return Math.max(a, b);
    // });

    const divisor = field ? highValue[field] / max : highValue / max;

    var temp2 = function(x) {
        // Array of objects
        if (field) {
            x[field] = x[field] / divisor;
            if (x[field] < min) x[field] = min;
        }

        // Array of numbers
        else {
            x = x / divisor;
        }

        return x;
    }
    return array.map(temp2);

    // return array.map(x => {
    //
    //   // Array of objects
    //   if (field) {
    //     x[field] = x[field] / divisor;
    //     if (x[field] < min) x[field] = min;
    //   }
    //
    //   // Array of numbers
    //   else {
    //     x = x / divisor;
    //   }
    //
    //   return x;
    // });
}

// function checkCacheKeywords(queryKeywordTags) {
//     var isCached = false;
//     var cache = CacheService.getUserCache();
//     var cached = cache.get('keywords');
//     if (cached != null) {
//         Logger.log("cached!");
//         isCached = true;
//     }
//     return isCached;
// }
//
// function getCacheKeywords() {
//     var content = '';
//     var cache = CacheService.getUserCache();
//     var cached = cache.get('keywords');
//     if (cached != null) {
//         content = cached;
//     }
//     return content;
// }

// function setGuideProperty(id, value) {
//     var docProperties = PropertiesService.getUserProperties();
//     docProperties.setProperty(id, value);
// }
//
// function deleteGuideProperty(id) {
//     var docProperties = PropertiesService.getUserProperties();
//     docProperties.deleteProperty(id);
// }
//
// function checkGuideProperty() {
//     var value = 'NONE';
//     var docProperties = PropertiesService.getUserProperties();
//     var data = docProperties.getProperties();
//     if (data.length > 0) {
//         value = docProperties.getProperty('guide');
//     }
//     return value;
//     // if (data.length > 0) {
//     //     return true;
//     // } else {
//     //     return false;
//     // }
// }

// function createCacheGuide(id, value) {
//     var cache = CacheService.getUserCache();
//     cache.put(id, value);
// }
//
// function getCacheGuide(id) {
//     var cache = CacheService.getUserCache();
//     var value = cache.get('guide');
//     return value;
// }
//
// function removeCacheGuide(id) {
//     var cache = CacheService.getUserCache();
//     cache.remove(id);
// }
//
// function createCacheKeywords(queryKeywordTags) {
//     var cache = CacheService.getUserCache();
//     cache.put('keywords', queryKeywordTags, 1500); // cache for 25 minutes
// }
//
// function createCacheKeywords(queryKeywordTags, dimension) {
//     var cache = CacheService.getUserCache();
//     cache.put(dimension, queryKeywordTags, 1500); // cache for 25 minutes
// }
//
// function removeCacheKeywords(dimension) {
//     var cache = CacheService.getUserCache();
//     // Removes keywords cache entry
//     cache.remove(dimension);
// }
//
// function removeAllCacheKeywords() {
//     var cache = CacheService.getUserCache();
//     // Removes keywords cache entry
//     cache.removeAll(['individual', 'evidence', 'causal', 'quirky', 'ramification', 'visualisation']);
// }

 
