 

(function($, inject, undefined) {

    inject.scripts = {};
    var _self = inject.scripts;

    var _callback = null;
    var _successHandler = null;
    var _errorHandler = null;
    var _scope = null;

    inject.scripts.withSuccessHandler = function(output, callback) {
        _successHandler = callback;
        return _self;
    }

    inject.scripts.withFailureHandler = function(callback) {
        _errorHandler = callback;
        return _self;
    }

    inject.scripts.withUserObject = function(scope) {



        _scope = scope;
        return _self;
    }

    inject.scripts.runEddie = function(text) {
      var serviceCall = 'https://kzachos-textbooster-v1.p.mashape.com/eddie/' + encodeURIComponent(text);
      var contentString= '';
      // $.ajax({
      //     url: serviceCall, // The URL to the API. You can get this in the API page of the API you intend to consume
      //     type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
      //     data: {}, // Additional parameters here
      //     dataType: 'json',
      //     success: function(data) {
      //       var terms = data.GetExpandedTermsResult.Terms;
      //       var content = [];
      //
      //       // // add names through Mango API
      //       // var names = findNameEntities(query, 'text');
      //       // if (typeof names !== 'undefined' && names.length > 0) {
      //       //     for (var n in names) {
      //       //         contentString += names[n] + ',';
      //       //     }
      //       // }
      //
      //       // add terms generated through EDDiE API
      //       for (var t in terms) {
      //           //  content.push(terms[t].TermValue);
      //           if (!isEmptyOrSpaces(terms[t].TermValue) && terms[t].TermValue.length > 1 && terms[t].ExpType === 'empty') {
      //               contentString += terms[t].TermValue + ',';
      //           }
      //       }
      //       contentString = contentString.substring(0, contentString.length - 1);
      //     },
      //     error: function(err) { alert(err); },
      //     beforeSend: function(xhr) {
      //     xhr.setRequestHeader("X-Mashape-Authorization", 'jGOEsrunUOmshZv3ahQRsuyWV0n7p1FLmhcjsnemmDR0s0bvTH'); // Enter here your Mashape key
      //     }
      // });
      $.ajax({
          url: 'https://kzachos-textbooster-v1.p.mashape.com/sentiment/im%20upset', // The URL to the API. You can get this in the API page of the API you intend to consume
          type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
          data: {}, // Additional parameters here
          dataType: 'json',
          success: function(data) {
            contentString = data.DetermineSentimentResult;
          },
          error: function(err) { alert(err); },
          beforeSend: function(xhr) {
          xhr.setRequestHeader("X-Mashape-Authorization", 'jGOEsrunUOmshZv3ahQRsuyWV0n7p1FLmhcjsnemmDR0s0bvTH'); // Enter here your Mashape key
          }
      });

      return contentString;

    }


    inject.scripts.runMultipleDimensions = function(queryKeywordTags, operator, time, sources, lang, individualBool, evidenceBool, causalBool, quirkyBool, ramificationsBool, visualisationBool) {
        var individuals = [],
            evidence = [],
            causal = [],
            quirky = [],
            ramification = [],
            visualisation = [];
        var queryTerms = [];
        var results = [];

        if (isEmptyOrSpaces(queryKeywordTags)) {
            _errorHandler('Please select some text or enter one or more terms.');
        } else if (!individualBool && !evidenceBool && !causalBool && !quirkyBool && !ramificationsBool && !visualisationBool) {
            _errorHandler('Please select at least ONE dimension.');
        } else {
            var queryKeywords = queryKeywordTags.substring(0, queryKeywordTags.length - 1).split('~');
            //        Logger.log(queryKeywordTags);
            for (i = 0; i < queryKeywords.length; ++i) {
                if (queryKeywords[i].substring(queryKeywords[i].length - 1, queryKeywords[i].length) === 'x') {
                    //        if (queryKeywords[i].indexOf('_') === -1) {
                    queryTerms.push(queryKeywords[i].substring(0, queryKeywords[i].length - 1));
                    //          str += '"' + queryKeywords[i].substring(0, queryKeywords[i].length - 1) + '" ' + operator + ' ';
                    //        }
                    //        else {
                    //          facetParameter += "facets[]=http%3A%2F%2Fdbpedia.org%2Fresource%2F" + queryKeywords[i].substring(0, queryKeywords[i].length - 1) + "&";
                    //        }
                }
            }
            var extractNameEntities = true;
            var queryExpandedTerms = runEddieAdvanced(queryTerms, extractNameEntities);
            var queryTermsHashtable = createQueryTermsHashtable(queryExpandedTerms);

            if (individualBool)
                individuals = runIndividualsDimension(queryExpandedTerms, queryTermsHashtable, queryKeywordTags, operator, time, sources);
            if (evidenceBool)
                evidence = runQuantitativeDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources);
            if (causalBool)
                causal = runCausalDimension(queryExpandedTerms, queryTermsHashtable, operator, time, sources);
            if (quirkyBool)
                quirky = runQuirkyDimension(queryTermsHashtable);
            if (ramificationsBool)
                ramification = runRamificationDimension(results, queryExpandedTerms);
            if (visualisationBool)
                visualisation = runVisualisationDimension(queryExpandedTerms, operator);


        }

        return [queryTermsHashtable[2].original, queryTermsHashtable[2].expanded, results, individuals, evidence, causal, quirky, ramification, visualisation];

    }





})(jQuery, inject);

 
