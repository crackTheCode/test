 

    /**
  * Runs a server-side function to preform the individual humans dimension and update
  * the sidebar UI with the resulting list of persons.
  */
    function runMultipleDimensions(t0, dimension) {
        this.disabled = true;
        if (dimension === 'evidence') {
            $('#ulResultsEvidence').empty();
        }
        if (dimension === 'individual') {
            $('#ulResultsIndividual').empty();
        }
        if (dimension === 'causal') {
            $('#ulResultsCausal').empty();
        }
        if (dimension === 'quirky') {
            $('#ulResultsQuirky').empty();
        }
        if (dimension === 'ramification') {
            $('#ulResultsRamification').empty();
        }
        if (dimension === 'visualisation') {
            $('#ulResultsVisualisation').empty();
        }

        var individualBool = false,
            evidenceBool = false,
            causalBool = false,
            quirkyBool = false,
            ramificationsBool = false,
            visualisationBool = false;

        if (dimension === 'evidence') {
            evidenceBool = true;
        }
        if (dimension === 'individual') {
            individualBool = true;
        }
        if (dimension === 'causal') {
            causalBool = true;
        }
        if (dimension === 'quirky') {
            quirkyBool = true;
        }
        if (dimension === 'ramification') {
            ramificationsBool = true;
        }
        if (dimension === 'visualisation') {
            visualisationBool = true;
        }

        var operator = '';
        if ($('#radio-operator-and').is(':checked')) {
            operator = 'AND';
        }
        if ($('#radio-operator-or').is(':checked')) {
            operator = 'OR';
        }

        var time = '';
        if ($('#radio-time-1year').is(':checked')) {
            time = '12|m';
        }
        if ($('#radio-time-6months').is(':checked')) {
            time = '6|m';
        }
        if ($('#radio-time-1month').is(':checked')) {
            time = '1|m';
        }
        if ($('#radio-time-1week').is(':checked')) {
            time = '7|d';
        }
        if ($('#radio-time-2days').is(':checked')) {
            time = '2|d';
        }

        var sources = [];
        if ($('#checkbox-source-britain').is(':checked')) {
            sources.push(1);
            sources.push(2);
            sources.push(3);
        }
        if ($('#checkbox-source-europe').is(':checked')) {
            sources.push(4);
        }
        if ($('#checkbox-source-usa-canada').is(':checked')) {
            sources.push(5);
            sources.push(6);
        }
        if ($('#checkbox-source-australia-new-zealand').is(':checked')) {
            sources.push(7);
            sources.push(8);
        }
        // if($('#checkbox-source-asia-india').is(':checked')) {  sources.push(9); sources.push(10);} if($('#checkbox-source-middle-east-russia').is(':checked')) {  sources.push(11); sources.push(12);}
        // if($('#checkbox-source-south-america-caribbean').is(':checked')) {  sources.push(13); sources.push(14);} if($('#checkbox-source-africa').is(':checked')) {  sources.push(15); } if($('#checkbox-source-britain').is(':checked')) {  sources.push('Main
        // British Isles'); sources.push('Tabloid British Isles'); sources.push('Main Regional British Isles');} if($('#checkbox-source-europe').is(':checked')) {  sources.push('Europe'); } if($('#checkbox-source-usa-canada').is(':checked')) {
        // sources.push('USA'); sources.push('Canada');} if($('#checkbox-source-australia-new-zealand').is(':checked')) {  sources.push('Australia'); sources.push('New Zealand');} if($('#checkbox-source-asia-india').is(':checked')) {  sources.push('Asia');
        // sources.push('India');} if($('#checkbox-source-middle-east-russia').is(':checked')) {  sources.push('Middle East'); sources.push('Russia');} if($('#checkbox-source-south-america-caribbean').is(':checked')) {  sources.push('South America');
        // sources.push('Caribbean');} if($('#checkbox-source-africa').is(':checked')) {  sources.push('Africa'); }

        var lang = 'en';

        var queryKeywordTags = '';
        var tags = $('#keywords').tagEditor('getTags')[0].tags;
        for (i = 0; i < tags.length; i++) {
            queryKeywordTags += tags[i] + 'x~';
        }

        if (isEmptyOrSpaces(queryKeywordTags)) {
          showError('Please select some text or enter one or more terms.', true, '', 'rss-info', dimension);
          document.getElementById(dimension).checked = false;
        } else if (!individualBool && !evidenceBool && !causalBool && !quirkyBool && !ramificationsBool && !visualisationBool) {
          showError('Please select at least ONE dimension.', true, '', 'rss-info', dimension);
          document.getElementById(dimension).checked = false;
        } else {
          showStatus('Searching...', 'rss-info', dimension);

          async.waterfall([
            // first, get the results
            function(callback) {
              runDimensions(queryKeywordTags, operator, time, sources, lang, individualBool, evidenceBool, causalBool, quirkyBool, ramificationsBool, visualisationBool, function (err, output) {
                if (err) return callback(err);
                // console.log('length:' + output[7].length);
                callback(null, output);
              });
            }
          ],
          // then, process the results
          function(err, output) {
            if (err) return callback(err);
            // google.script.run.withSuccessHandler(function (output, element) {
            var queryTermsOriginal = output[0];
            var queryTermsExpanded = output[1];
            var allJuicerResults = output[2];

            var countArticles = 0;
            var str = '';

            // record the event using Activity Logger
            // activityLogger_insert(1, 'search', 'individual', 'test', 'end-move', 'test', 0);

            /* INDIVIDUAL Dimension */
            if (output[3][0] && output[3].length) {
                var individualsMap = output[3];
                var articles = individualsMap[0];
                var tweets = individualsMap[1];
                var personsWithDbpediaTypes = individualsMap[2];
                var personsWikipedia = individualsMap[3];

                var finished = false;
                var countIndividuals = 0;
                var sortedArticles = [];
                for (var key in articles) {
                    sortedArticles.push([key, articles[key]])
                }
                sortedArticles = getRandomSubarray(sortedArticles, sortedArticles.length);
                var maxResultsIndividuals = sortedArticles.length < MAX_NUMBER_INDIVIDUALS
                    ? sortedArticles.length
                    : MAX_NUMBER_INDIVIDUALS;

                for (key = 0; key < maxResultsIndividuals; key++) {
                    if (!finished) { // we havent reached the max limit of results to display so keep going
                        if (sortedArticles[key][0].indexOf("human angles") > -1) { // Other human angles entry
                        } else {
                            //  tooltip = '';  var dbpediaTypes = personsWithDbpediaTypes[currentName];  if (undefined !== dbpediaTypes && dbpediaTypes.length) {    for (a = 0; a < dbpediaTypes.length; a++) {    var dbpediaType = dbpediaTypes[a];    tooltip += dbpediaType  + '
                            // AND ';    }    tooltip = tooltip.substring(0, tooltip.length - 5);  }

                            countIndividuals++;
                            var titleArray = [];
                            var currentName = sortedArticles[key][0];
                            var parts = currentName.split('/');
                            var p = decodeURIComponent(parts[parts.length - 1].replace(/_/g, ' '));
                            var wiki = personsWikipedia[p];
                            var isWiki = true;

                            tooltip = '';
                            var dbpediaTypes = personsWithDbpediaTypes[currentName];
                            if (undefined !== dbpediaTypes && dbpediaTypes.length) {
                              for (a = 0; a < dbpediaTypes.length; a++) {
                                var dbpediaType = dbpediaTypes[a];
                                  tooltip += dbpediaType  + ' AND ';
                              }
                              tooltip = tooltip.substring(0, tooltip.length - 5);
                            }

                            var wikiContentLi = addWikiHtml(isWiki, wiki, tooltip, key);
                            // add wiki content list item to temporary ul list
                            // used to convert to DOM array
                            $('#divResultsIndividual ul').append(wikiContentLi);

                            isWiki = false;
                            var maxResults = sortedArticles[key][1].length < MAX_NUMBER_RESULTS_PER_INDIVIDUAL
                                ? sortedArticles[key][1].length
                                : MAX_NUMBER_RESULTS_PER_INDIVIDUAL;
                            for (i = 0; i < maxResults; i++) {
                                var obj = sortedArticles[key][1][i];
                                if (titleArray.indexOf(obj.title) < 0) {
                                    if (countArticles < MAX_NUMBER_RESULTS_DIMENSION_TOTAL) {
                                        countArticles++;
                                        titleArray.push(obj.title);

                                        var contentLi = addArticleHtml('individual', obj, queryTermsOriginal, queryTermsExpanded, isWiki, wiki);
                                        // add list item to temporary ul list
                                        // used to convert to DOM array
                                        $('#divResultsIndividual ul').append(contentLi);

                                    } else {
                                        finished = true;
                                        break;
                                    }
                                }
                            }

                            //  var tweetsForName = tweets[currentName];  for (j = 0; j < tweetsForName.length; j++) {    var obj2 = tweetsForName[j];    if (titleArray.indexOf(obj2.title) < 0) {      countArticles++;      titleArray.push(obj2.title);      str += '<li
                            // class=\'rss-item2\'><span class=\'rss-item2\'><a href=\'#\' onclick="return openDialog(\''      + isWiki + '\',\'' + htmlEscape(obj2.title) + '\',\'' + obj2.url + '\',\'' + obj2.tweetdate + '\',\'' + obj2.image + '\',\'' +
                            // htmlEscape(obj2.description) + '\');">'      + obj2.title + '</a></span><br><span class=\'rss-date\'>'      + obj2.tweetdate  + '</span><br>'      +  htmlEscape(obj2.tweettext) + '<br>';      str += '<hr class="small" width="100%">';    }  }

                            // line to separate elements
                            var $hr = $( document.createElement('hr') );
                            $hr.addClass("small");
                            $hr.css("width", "100%");
                            $('#divResultsIndividual ul').append($hr);
                            $('#divResultsIndividual ul').append('<br>');
                        }
                    } else { // already reached the number of results so leave the loop
                        break;
                    }
                }
                // set global variable articleList and articleListPagination to quirky div
                articleList = document.getElementById('article-list-individual');
                articleListPagination = document.getElementById('article-list-pagination-individual');
                dimensionPage = 'individual';
                // add jquery list items to articleArray
                articleArray = $.makeArray( $('#divResultsIndividual ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsIndividual').hide();

            }

            /* EVIDENCE Dimension */
            if (output[4] && output[4].length) {

                var evidenceMap = output[4];
                var isWiki = false;
                var maxResults = evidenceMap.length < MAX_NUMBER_RESULTS_DIMENSION_TOTAL
                    ? evidenceMap.length
                    : MAX_NUMBER_RESULTS_DIMENSION_TOTAL;

                for (var k = 0; k < maxResults; k++) {
                    countArticles++;
                    str = '';
                    var titleArray = [];

                    var obj = evidenceMap[k].article;
                    var entities = evidenceMap[k].entities;
                    if (titleArray.indexOf(obj.title) < 0) {
                        titleArray.push(obj.title);

                        // create list item li for the current result
                        var contentLi = addArticleHtml('evidence', obj, queryTermsOriginal, queryTermsExpanded, isWiki, null);
                        // add list item to temporary ul list
                        // used to convert to DOM array
                        $('#divResultsEvidence ul').append(contentLi);

                    }
                    // else {
                    //   // line to separate elements
                    //   var $hr = $( document.createElement('hr') );
                    //   $hr.addClass("small");
                    //   $hr.css("width", "100%");
                    //   $('#divResultsEvidence ul').append($hr);
                    // }

                }
                // set global variable articleList and articleListPagination to quirky div
                articleList = document.getElementById('article-list-evidence');
                articleListPagination = document.getElementById('article-list-pagination-evidence');
                dimensionPage = 'evidence';
                // add jquery list items to articleArray
                articleArray = $.makeArray( $('#divResultsEvidence ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsEvidence').hide();
            }

            /* CAUSAL Dimension */
            if (output[5] && output[5].length) {
                var causalMap = output[5];
                var isWiki = false;
                var maxResults = causalMap.length < MAX_NUMBER_RESULTS_DIMENSION_TOTAL
                    ? causalMap.length
                    : MAX_NUMBER_RESULTS_DIMENSION_TOTAL;
                for (var k = 0; k < maxResults; k++) {
                    countArticles++;
                    str = '';
                    var titleArray = [];

                    var obj = causalMap[k].article;
                    var entities = causalMap[k].entities;

                    var overallPercentage = causalMap[k].overallPercentage.toFixed(0);
                    var causalNum = causalMap[k].overallNum;
                    var dimensionPercentage = causalMap[k].dimensionPercentage.toFixed(0);
                    var queryPercentage = causalMap[k].queryPercentage.toFixed(0);
                    var lengthBooster = causalMap[k].lengthBooster;
                    var titleOverallNum = causalMap[k].titleOverallNum;
                    var bodyOverallNum = causalMap[k].bodyOverallNum;

                    if (titleArray.indexOf(obj.title) < 0) {
                        titleArray.push(obj.title);

                        // create list item li for the current result
                        var contentLi = addArticleHtml('causal', obj, queryTermsOriginal, queryTermsExpanded, isWiki, null);
                        // add list item to temporary ul list
                        // used to convert to DOM array
                        $('#divResultsCausal ul').append(contentLi);
                    }
                    // else {
                    //   // line to separate elements
                    //   var $hr = $( document.createElement('hr') );
                    //   $hr.addClass("small");
                    //   $hr.css("width", "100%");
                    //   $('#divResultsCausal ul').append($hr);
                    // }
                }
                // set global variable articleList and articleListPagination to quirky div
                articleList = document.getElementById('article-list-causal');
                articleListPagination = document.getElementById('article-list-pagination-causal');
                dimensionPage = 'causal';
                // add jquery list items to articleArray
                articleArray = $.makeArray( $('#divResultsCausal ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsCausal').hide();

            }

            /* QUIRKY Dimension */
            if (output[6] && output[6].length) {
                var quirkyMap = output[6];
                var sortedQuirkies = getRandomSubarray(quirkyMap, quirkyMap.length < MAX_NUMBER_RESULTS_DIMENSION_TOTAL
                    ? quirkyMap.length
                    : MAX_NUMBER_RESULTS_DIMENSION_TOTAL);
                var isWiki = false;
                //  var maxResults = quirkyMap.length < 80 ? quirkyMap.length : 80;
                for (var k = 0; k < sortedQuirkies.length; k++) {
                    countArticles++;
                    str = '';
                    var obj = sortedQuirkies[k];
                    // create list item li for the current result
                    var contentLi = addArticleHtml('quirky', obj, queryTermsOriginal, queryTermsExpanded, isWiki, null);
                    // add list item to temporary ul list
                    // used to convert to DOM array
                    $('#divResultsQuirky ul').append(contentLi);
                }
                // set global variable articleList and articleListPagination and dimension to quirky div
                articleList = document.getElementById('article-list-quirky');
                articleListPagination = document.getElementById('article-list-pagination-quirky');
                dimensionPage = 'quirky';
                // add jquery list items to global variable articleArray
                articleArray = $.makeArray( $('#divResultsQuirky ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsQuirky').hide();
            }

            /* TWITTER Results */
            if (output[7] && output[7].length) {
                var tweets = output[7];
                var isWiki = false;

                for (var key in tweets) {
                  countArticles++;

                  var obj = tweets[key];

                  // create list item li for the current result
                  var contentLi = addArticleHtml('twitter', obj, queryTermsOriginal, queryTermsExpanded, isWiki, null);
                  // add list item to temporary ul list
                  // used to convert to DOM array
                  $('#divResultsRamification ul').append(contentLi);
                }
                // set global variable articleList and articleListPagination and dimension to quirky div
                articleList = document.getElementById('article-list-ramification');
                articleListPagination = document.getElementById('article-list-pagination-ramification');
                dimensionPage = 'ramification';
                // add jquery list items to global variable articleArray
                articleArray = $.makeArray( $('#divResultsRamification ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsRamification').hide();
            }

            /* QUIRKY Dimension */
            if (output[8] && output[8].length) {
                var visualisationMap = output[8];
                var isWiki = false;
                //  var maxResults = quirkyMap.length < 80 ? quirkyMap.length : 80;
                for (var k = 0; k < visualisationMap.length; k++) {
                    countArticles++;
                    str = '';
                    var obj = visualisationMap[k];
                    // create list item li for the current result
                    var contentLi = addArticleHtml('visualisation', obj, queryTermsOriginal, queryTermsExpanded, isWiki, null);
                    // add list item to temporary ul list
                    // used to convert to DOM array
                    $('#divResultsVisualisation ul').append(contentLi);
                }
                // set global variable articleList and articleListPagination and dimension to quirky div
                articleList = document.getElementById('article-list-visualisation');
                articleListPagination = document.getElementById('article-list-pagination-visualisation');
                dimensionPage = 'visualisation';
                // add jquery list items to global variable articleArray
                articleArray = $.makeArray( $('#divResultsVisualisation ul li') );
                // set global variable max to total number of articles
                max = articleArray.length;
                page = 0;
                counter = 0;
                // start adding articles to the first page
                // (other pages are added in infinite-scroll.js window.onscroll function)
                addPage(++page);
                // hide all list items from the temporary ul list
                $('#divResultsVisualisation').hide();
            }


            //  /* No Dimension */
            //  if (typeof output[8] !== 'undefined') {
            //    var noMap = output[8];
            //    var isWiki = false;
            //    var maxResults = noMap.length < 200 ? noMap.length : 200;    for (var k = 0; k < maxResults; k++) {          countArticles++; str =
            // '';          var titleArray = [];
            //
            //          var obj = noMap[k].article;          if (titleArray.indexOf(obj.title) < 0) {            titleArray.push(obj.title);            var body = obj.body.substr(0, 140) + "\u2026";
            //
            //            var prompt = getDimensionPrompt(1, '<b>' + obj.title + '</b>');
            //
            //           //  str += '<img align="bottom" data-toggle=\'tooltip\' data-placement=\'top\' title=\'Causal\' src="https://dl.dropboxusercontent.com/s/3uyy5e15uvu28ro/causal_red.png" width="15">&nbsp;&nbsp;'            str += '<span
            // class=\'rss-item\'><a href=\'#\' onclick="return openDialog2(\''            + queryTermsOriginal + '\',\'' + queryTermsExpanded + '\',\'' + isWiki + '\',\'' + htmlEscape(obj.title) + '\',\'' + obj.url + '\',\'' + moment(obj.published).fromNow() +
            // '\',\'' + obj.image + '\',\'' + htmlEscape(obj.body) + '\',\'' + sourceName + '\');">'            + obj.title + '</a></span><br>';            str += '<span class=\'rss-info\'>';            str += moment(obj.published).fromNow()  + '</span><br>' +
            // body + '<br>';            str += populateConcepts(obj.concepts);            str += '<br><br>';          }
            //
            //      str += '<hr class="small" width="100%"><br>';      $('#divResultsNo ul').append(str);    }
            //
            //  }

            $('[data-toggle="tooltip"]').tooltip();

            var t1 = performance.now();
            var ms = Math.floor((t1 - t0)),
                min = (ms / 1000 / 60) << 0,
                sec = (ms / 1000) % 60,
                rounded = Math.round(sec * 10) / 10;
            var result = Math.floor((t1 - t0));

            //               var actLog = alasql('SELECT * FROM activity');               var resultContent = '';               for (var i = 0; i < actLog.length; i++) {                 resultContent += actLog[i].eventCategory + '<br>';               }
            // $('#divResults ul').append(resultContent);

            var statusContent = '';
            // if individual dimension then let user know there is randomness
            if (typeof output[3][0] !== 'undefined') {
              statusContent += 'Here are <b>' + countIndividuals + '</b> possible individuals to write your story about';
            }
            // if quirky dimension then let user know there is randomness
            else if (output[6].length > 0) {
              statusContent += 'Here are <b>' + countArticles + '</b> possible cartoons to inspire your story';
            }
            // if ramification/twitter dimension
            else if (output[7].length > 0) {
              statusContent += 'Here are <b>' + countArticles + '</b> relevant tweets to inspire your story';
            }
            else {
              statusContent += 'Here are the <b>' + countArticles + '</b> most relevant articles';
            }
            statusContent += '<br><br>';

            // statusContent += ' (' + rounded + ' seconds)';
            showStatus(statusContent, 'rss-info', dimension);

            $.LoadingOverlay("hide");
            $('#refresh').show();
            // }).withFailureHandler(function (msg, element) {
            //     $.LoadingOverlay("hide");
            //     showNotification('error', msg);
            //     document.getElementById(dimension).checked = false;
            //     showStatus('', 'rss-info', dimension);
            //     // showStatus(msg, 'status-error', dimension);
            //     element.disabled = false;
            // }).withUserObject(this).runMultipleDimensions(queryKeywordTags, operator, time, sources, lang, individualBool, evidenceBool, causalBool, quirkyBool, ramificationsBool, visualisationBool);

          });



        }
    }

    function addWikiHtml(isWiki, wiki, tooltip, pos) {
      var maxExtractLength = wiki.extract.length < 150
          ? wiki.extract.length
          : 150;
      var body1 = decodeURI(wiki.extract.substr(0, maxExtractLength)) + "\u2026";

      // line to separate elements
      var $hr = $( document.createElement('hr') );
      $hr.addClass("small");
      $hr.css("width", "100%");

      // wiki title of individual as link
      var wikiTitleLink = '<a href=\'#\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + tooltip + '\' onclick="return openDialog(\''
      + isWiki + '\',\'' + wiki.title + '\',\'' + wiki.url + '\',\'\',\'' + wiki.image + '\',\'' + htmlEscape(wiki.extract) + '\');">'
      + wiki.title + '</a>';
      /* JQUERY BELOW NOT DISPLAYING PROPERLY IN DIALOG WINDOW */
      // var $wikiTitleLink = $( document.createElement('a') );
      // $wikiTitleLink.attr('href', '#');
      // $wikiTitleLink.attr('data-toggle', 'tooltip');
      // $wikiTitleLink.attr('data-placement', 'top');
      // $wikiTitleLink.attr('title', tooltip);
      // $wikiTitleLink.click( function() {
      //   openDialog(isWiki, wiki.title, wiki.url, '', wiki.image, htmlEscape(wiki.extract));
      //   return false;
      // } );
      // $wikiTitleLink.append(wiki.title);

      // container that represent name of individual
      var $nameSpan = $( document.createElement('span') );
      $nameSpan.addClass("rss-item");
      $nameSpan.append(wikiTitleLink);
      // $nameSpan.append($wikiTitleLink);

      // represent wiki body extract
      var $wikiBodySpan = $( document.createElement('span') );
      $wikiBodySpan.append(body1);

      // create a list item with elements to add to current list
      var $listItem = $( document.createElement('li') );
      if (pos > 0) {
        $listItem.append('<br>');
        $listItem.append($hr);
        $listItem.append('<br>');
      }
      $listItem.append($nameSpan);
      $listItem.append('<br>');
      $listItem.append($wikiBodySpan);
      $listItem.append('<br>');
      // $listItem.append('<br>');

      return $listItem;
    }


    function addArticleHtml(dimension, obj, queryTermsOriginal, queryTermsExpanded, isWiki, wiki) {

      // create a list item with elements to add to current list
      var $listItem = $( document.createElement('li') );
      $listItem.append('<br>');

      // Elements used for more than one dimension
      // ----------------------------------------------

      // line to separate elements
      var $hr = $( document.createElement('hr') );
      $hr.addClass("small");
      $hr.css("width", "100%");

      // Individual
      // ----------------------------------------------
      if (dimension === 'individual') {

        var body = obj.body.substr(0, 140) + "\u2026";
        var sourceName = obj.source['source-name'];

        // title of object as link
        titleLink = '<a href=\'#\' onclick="return openDialog2(\'' + queryTermsOriginal + '\',\'' + queryTermsExpanded + '\',\'' + isWiki + '\',\'' + htmlEscape(obj.title) + '\',\'' + obj.url + '\',\'' + moment(obj.published).fromNow() + '\',\'' + obj.image + '\',\'' + htmlEscape(obj.body) + '\',\'' + sourceName + '\');">'
        + obj.title + '</a>';
        /* JQUERY BELOW NOT DISPLAYING PROPERLY IN DIALOG WINDOW */
        // var $titleLink = $( document.createElement('a') );
        // $titleLink.attr('href', '#');
        // $titleLink.click( function() {
        //   openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, htmlEscape(obj.title), obj.url, moment(obj.published).fromNow(), obj.image, htmlEscape(obj.body), sourceName);
        //   return false;
        // } );
        // $titleLink.append(obj.title);

        // container that represent article title
        var $titleSpan = $( document.createElement('span') );
        $titleSpan.addClass("rss-item");
        $titleSpan.append(titleLink);
        // $titleSpan.append($titleLink);

        // container that represent individual name associated with the article
        var $individualNameSpan = $( document.createElement('span') );
        $individualNameSpan.addClass("rss-info");
        $individualNameSpan.append('A story about <b>' + wiki.title + '</b>');

        // container that represent article source name
        var $sourceNameSpan = $( document.createElement('span') );
        $sourceNameSpan.addClass("rss-info-bold");
        $sourceNameSpan.append(sourceName);

        // container that represent article published date
        var $publishedDateSpan = $( document.createElement('span') );
        $publishedDateSpan.addClass("rss-info");
        $publishedDateSpan.append(moment(obj.published).fromNow());

        // container that represent article body
        var $bodySpan = $( document.createElement('span') );
        $bodySpan.append(body);

        $listItem.append($titleSpan);
        $listItem.append('<br>');
        $listItem.append($individualNameSpan);
        $listItem.append('<br>');
        $listItem.append($sourceNameSpan);
        $listItem.append('&nbsp;-&nbsp;');
        $listItem.append($publishedDateSpan);
        $listItem.append('<br>');
        $listItem.append($bodySpan);
        $listItem.append('<br>');
        $listItem.append(populateConcepts(obj.concepts));
        $listItem.append('<br>');
      }

      // Evidence, Causal
      // ----------------------------------------------
      if (dimension === 'evidence' || dimension === 'causal' ) {

        var body = obj.body.substr(0, 140) + "\u2026";
        var sourceName = obj.source['source-name'];

        // title of object as link
        titleLink = '<a href=\'#\' onclick="return openDialog2(\'' + queryTermsOriginal + '\',\'' + queryTermsExpanded + '\',\'' + isWiki + '\',\'' + htmlEscape(obj.title) + '\',\'' + obj.url + '\',\'' + moment(obj.published).fromNow() + '\',\'' + obj.image + '\',\'' + htmlEscape(obj.body) + '\',\'' + sourceName + '\');">'
        + obj.title + '</a>';
        /* JQUERY BELOW NOT DISPLAYING PROPERLY IN DIALOG WINDOW */
        // var $titleLink = $( document.createElement('a') );
        // $titleLink.attr('href', '#');
        // $titleLink.click( function() {
        //   openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, htmlEscape(obj.title), obj.url, moment(obj.published).fromNow(), obj.image, htmlEscape(obj.body), sourceName);
        //   return false;
        // } );
        // $titleLink.append(obj.title);

        // container that represent article title
        var $titleSpan = $( document.createElement('span') );
        $titleSpan.addClass("rss-item");
        $titleSpan.append(titleLink);
        // $titleSpan.append($titleLink);

        // container that represent article source name
        var $sourceNameSpan = $( document.createElement('span') );
        $sourceNameSpan.addClass("rss-info-bold");
        $sourceNameSpan.append(sourceName);

        // container that represent article published date
        var $publishedDateSpan = $( document.createElement('span') );
        $publishedDateSpan.addClass("rss-info");
        $publishedDateSpan.append(moment(obj.published).fromNow());

        // container that represent article body
        var $bodySpan = $( document.createElement('span') );
        $bodySpan.append(body);

        $listItem.append($titleSpan);
        $listItem.append('<br>');
        $listItem.append($sourceNameSpan);
        $listItem.append('&nbsp;-&nbsp;');
        $listItem.append($publishedDateSpan);
        $listItem.append('<br>');
        $listItem.append($bodySpan);
        $listItem.append('<br>');
        $listItem.append(populateConcepts(obj.concepts));
        $listItem.append('<br>');
        $listItem.append('<br>');
        $listItem.append($hr);

      }


      // Quirky
      // ----------------------------------------------
      else if (dimension === 'quirky') {

        // needed to represent image properly
        var cartoonImageUrl = obj.src.replace(/cartoon_sketch_thumbnails/g, 'cartoons');
        cartoonImageUrl = cartoonImageUrl.replace(/jpg/g, 'jpeg');

        // thumbnail of object as link
        var $imageLink = $( document.createElement('a') );
        $imageLink.attr('href', '#');
        $imageLink.click( function() {
          openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, htmlEscape(obj.title), obj.url, obj.author, cartoonImageUrl, '', '');
          return false;
        } );
        var image = new Image();
      	image.src = obj.src;
        image.id = 'cartoonImg';
        $imageLink.append(image);


        // title of object as link
        var $titleLink = $( document.createElement('a') );
        $titleLink.attr('href', '#');
        $titleLink.click( function() {
          openDialog2(queryTermsOriginal,queryTermsExpanded,isWiki,htmlEscape(obj.title),obj.url,obj.author,cartoonImageUrl,'','');
          return false;
        } );
        $titleLink.append(obj.title);

        // main container that represent the complete UI of a retrieved article
        var $contentDiv = $( document.createElement('div') );
        $contentDiv.addClass("rss-quirky-item");
        $contentDiv.append($imageLink);
        $contentDiv.append($titleLink);
        $contentDiv.append('<br>');
        $contentDiv.append(obj.author);

        $listItem.append($contentDiv);
        $listItem.append('<br>');
        $listItem.append($hr);
        $listItem.append('<br>');

      }

      // Twitter
      // ----------------------------------------------
      if (dimension === 'twitter') {

        var body = obj.body;
        var sourceName = 'Twitter';

        // tweet as link
        tweetLink = '<a href=\'#\'>' + body + '</a>';

        // container that represent tweet
        var $tweetSpan = $( document.createElement('span') );
        $tweetSpan.addClass("rss-item");
        $tweetSpan.append(body);
        // $titleSpan.append($titleLink);

        $listItem.append($tweetSpan);
        $listItem.append('<br>');
        $listItem.append('<br>');
        $listItem.append($hr);

      }

      // Visualisation
      // ----------------------------------------------
      else if (dimension === 'visualisation') {

        // thumbnail of object as link
        var $imageLink = $( document.createElement('a') );
        $imageLink.attr('href', '#');
        $imageLink.click( function() {
          openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, htmlEscape(obj.title), obj.link, obj.displayLink, obj.link, '', '');
          return false;
        } );
        var image = new Image();
      	image.src = obj.link;
        image.id = 'cartoonImg';
        $imageLink.append(image);


        // title of object as link
        var $titleLink = $( document.createElement('a') );
        $titleLink.attr('href', '#');
        $titleLink.click( function() {
          openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, htmlEscape(obj.title), obj.link, obj.displayLink, obj.link, '', '');
          return false;
        } );
        $titleLink.append(obj.title);

        // main container that represent the complete UI of a retrieved article
        var $contentDiv = $( document.createElement('div') );
        $contentDiv.addClass("rss-quirky-item");
        $contentDiv.append($imageLink);
        $contentDiv.append($titleLink);
        $contentDiv.append('<br>');
        $contentDiv.append(obj.author);

        $listItem.append($contentDiv);
        $listItem.append('<br>');
        $listItem.append($hr);
        $listItem.append('<br>');

      }


      return $listItem;

    }



 
