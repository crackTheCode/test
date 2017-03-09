 


function runDimensions(queryKeywordTags, operator, time, sources, lang, individualBool, evidenceBool, causalBool, quirkyBool, ramificationsBool, visualisationBool, callback) {

    async.waterfall([
      // first, add terms generated through EDDiE API
      function(callback) {
        var queryTerms = [];
        var queryKeywords = queryKeywordTags.substring(0, queryKeywordTags.length - 1).split('~');
        for (i = 0; i < queryKeywords.length; ++i) {
          if (queryKeywords[i].substring(queryKeywords[i].length - 1, queryKeywords[i].length) === 'x') {
              queryTerms.push(queryKeywords[i].substring(0, queryKeywords[i].length - 1));
          }
        }
        runEddieAdvanced(queryTerms, function (err, queryExpandedTerms) {
          if (err) {
            callback(true);
          }
          callback(null, queryExpandedTerms, queryTerms);
        });
      },
      // then, add name entities using Mango API
      function(queryExpandedTerms, queryTerms, callback) {
        var query = queryTerms.join(" ");
        findNameEntities(query, 'text', function (err, names) {
          if (err) {
            callback(true);
          }
          if (typeof names !== 'undefined' && names.length > 0) {
              var namesString = '';
              for (var n in names) {
                  namesString += names[n] + ',';
              }
              namesString = namesString.substring(0, namesString.length - 1);
              queryExpandedTerms['names'] = namesString;
          }
        });
        callback(null, queryExpandedTerms);
      },
      // then, create query terms
      function(queryExpandedTerms, callback) {
        var queryTermsHashtable = createQueryTermsHashtable(queryExpandedTerms);
        callback(null, queryExpandedTerms, queryTermsHashtable);
      }
    ],
    // finally, create keywords for each retrieved term
    function(err, queryExpandedTerms, queryTermsHashtable) {
      var individual = [],
          evidence = [],
          causal = [],
          quirky = [],
          ramification = [],
          visualisation = [],
          results = [];

      if (individualBool) {
        // individual = runIndividualsDimension(queryExpandedTerms, queryTermsHashtable, queryKeywordTags, operator, time, sources);
        runIndividualsDimension(queryExpandedTerms, queryTermsHashtable, queryKeywordTags, operator, time, sources, function(err, articles) {
          if (err) return callback(err);
          if (!articles[0].length) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'individual');
            document.getElementById('individual').checked = false;
            return;
          }
          individual = articles;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });
      }
      if (evidenceBool) {
        // evidence = runQuantitativeDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources);
        runQuantitativeDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources, function(err, articles) {
          if (err) return callback(err);
          if (!articles.length) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'evidence');
            document.getElementById('evidence').checked = false;
            return;
          }
          evidence = articles;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });
      }
      if (causalBool) {
        // causal = runCausalDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources);
        runCausalDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources, function(err, articles) {
          if (err) return callback(err);
          if (!articles.length) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'causal');
            document.getElementById('causal').checked = false;
            return;
          }
          causal = articles;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });
      }
      if (quirkyBool) {
        runQuirkyDimension(queryTermsHashtable, function(err, cartoons) {
          if (err) return callback(err);
          if (cartoons.length === 0) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'quirky');
            document.getElementById('quirky').checked = false;
            return;
          }
          quirky = cartoons;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });
      }
      if (ramificationsBool) {
        // ramification = runRamificationDimension(results, queryExpandedTerms);
        runRamificationDimension(queryExpandedTerms, operator, function(err, ramifications) {
          if (err) return callback(err);
          if (ramifications.length === 0) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'ramification');
            document.getElementById('ramification').checked = false;
            return;
          }
          ramification = ramifications;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });

      }
      if (visualisationBool) {
        // visualisation = runVisualisationDimension(queryExpandedTerms, operator);
        runVisualisationDimension(queryExpandedTerms, operator, function(err, visualisations) {
          if (err) return callback(err);
          if (visualisations.length === 0) {
            showError(NOTIFICATION_NO_RESULTS, true, '', 'rss-info', 'visualisation');
            document.getElementById('visualisation').checked = false;
            return;
          }
          visualisation = visualisations;
          callback(null, [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individual, evidence, causal, quirky, ramification, visualisation]);
        });

      }

      //visualisation = runNoDimension(results, resultObjects, queryTermsThreshold);
    });


}


 
