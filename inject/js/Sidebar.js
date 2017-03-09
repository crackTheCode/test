// google.load("feeds", "1");

/**
 * Run initializations on sidebar load.
 */
$(function() {


    // change the main color everytime the sidebar starts
    var random_color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // $('body').css('background', random_color);
    // document.documentElement.style.setProperty('--main-color', random_color);

    // check if the guide needs to be displayed
    // show only when add-on is installed and run for the first time
    cache.getItem('guide');
    // google.script.run.withSuccessHandler(function(value){
    // if there is no entry in the cache for guide then display guide
    if (typeof value == 'undefined') {
        // create guide instance
        // toggleGuide();
        // start the guide
        // $.tutorialize.start();
        // document.getElementById('isCachedGuide').value = value;
    }
    // else {
    //   document.getElementById('isCachedGuide').value = value;
    // }
    // }).withFailureHandler(showError)
    // .withUserObject(this)
    // .getCacheGuide('guide');

    hide('reset-tags');

    // when no tags exist in the search then disable the dimension icons
    disableDimensions('wrap');
    // disable dimension icons that are currently not implemented
    disableDimensions('wrap2');

    console.log($("#start-logo .overlay-content"))
    $("#start-logo .content-item").height($(window).height() -125);


    /**
     * Toggle options to move between main and favourites screen (show and hide)
     */
    $("#options-button,#options-back-button").click(function() {
        $('#main,#options,#footer,#footer-options').toggle();
    });

    $("#contact-button,#contact-back-button").click(function() {
        $('#main,#contact,#footer,#footer-contact').toggle();
    });

    $("#contact-clear-button").click(function() {
        document.getElementById("textarea-contact").value = "";
    });

    $("#guide-button").click(function() {
        // window.open('http://juice.jellibee.co/thread/using-juice/');

        // create guide instance
        toggleGuide();
        // start the guide
        // $.tutorialize.start();

    });

    $("#help-button").click(function() {
        window.open('http://juice.jellibee.co/thread/using-juice/');
    });

    $("#info-button").click(function() {
        window.open('http://juice.jellibee.co');
    });

    $("#refresh-button").click(function() {
        if (document.getElementById('evidence').checked == true) {
            runSearch('evidence', true);
        } else if (document.getElementById('individual').checked == true) {
            runSearch('individual', true);
        } else if (document.getElementById('causal').checked == true) {
            runSearch('causal', true);
        } else if (document.getElementById('quirky').checked == true) {
            runSearch('quirky', true);
        } else if (document.getElementById('ramification').checked == true) {
            runSearch('ramification', true);
        } else if (document.getElementById('visualisation').checked == true) {
            runSearch('visualisation', true);
        }
    });

    $("#contact-send-button").click(function() {
        var service_id = "default_service";
        var template_id = "juice_template";
        if (document.getElementById("textarea-contact").value == '') {
            showNotification('notice', 'All fields required. Try again or cancel');
        } else {
            var message = '';
            if (document.getElementById('radio-contact-question').checked) {
                message += document.getElementById('radio-contact-question').value + ': ';
            } else if (document.getElementById('radio-contact-feature').checked) {
                message += document.getElementById('radio-contact-feature').value + ': ';
            } else if (document.getElementById('radio-contact-bug').checked) {
                message += document.getElementById('radio-contact-bug').value + ': ';
            }
            message += document.getElementById("textarea-contact").value;
            $.LoadingOverlay("show");
            emailjs.send(service_id, template_id, {
                from_name: "Juice App",
                message_html: message
            }).then(function() {
                showNotification('success', 'Message sent!');
                $.LoadingOverlay("hide");
            }, function(err) {
                showNotification('error', 'Send message failed!');
                $.LoadingOverlay("hide");
            });
        }
    });

    $('.zebra li:even').addClass('stripe-even');
    $('.zebra li:odd').addClass('stripe-odd');

    // $("textarea").focusout(function() {    $.LoadingOverlay("show"); }); to work for IE $('input[type=textarea]').bind('input change', function() {   console.log(this.value); }); var button = $("#run-search"); $("#keywords").on('input',function(e){
    // if(e.target.value === 'Copy text or enter keyword(s)'){     // Textarea has no value     button.hide();   } else {     // Textarea has a value     button.show();   } });

    $('#keywords').tagEditor({
        // initialTags: ['Hello', 'World', 'Example', 'Tags'],
        clickDelete: true,
        delimiter: ',\n',
        /* space and comma */
        placeholder: PLACEHOLDER_SEARCH_BOX
    });

    $('input[type=radio][name=tabs]').change(function() {
        if (this.value == 'evidence') {
            $('.tab-content').css('display', 'none');
            $('#content1').css('display', 'block');
            $(document).scrollTop('#');
        } else if (this.value == 'individual') {
            $('.tab-content').css('display', 'none');
            $('#content2').css('display', 'block');
            $(document).scrollTop('#');
        } else if (this.value == 'causal') {
            $('.tab-content').css('display', 'none');
            $('#content3').css('display', 'block');
            $(document).scrollTop('#');
        } else if (this.value == 'quirky') {
            $('.tab-content').css('display', 'none');
            $('#content4').css('display', 'block');
            $(document).scrollTop('#');
        } else if (this.value == 'ramification') {
            $('.tab-content').css('display', 'none');
            $('#content5').css('display', 'block');
            $(document).scrollTop('#');
        } else if (this.value == 'visualisation') {
            $('.tab-content').css('display', 'none');
            $('#content6').css('display', 'block');
            $(document).scrollTop('#');
        }
    });

    function sticky_relocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#sticky-anchor').offset().top;
        if (window_top > div_top) {
            $('#sticky').addClass('stick');
            $('#sticky-anchor').height($('#sticky').outerHeight());
        } else {
            $('#sticky').removeClass('stick');
            $('#sticky-anchor').height(0);
        }
    }

    $(window).scroll(sticky_relocate);
    // sticky_relocate();

    $('#evidence').click(function() {
        runSearch('evidence', false);
    });
    $('#individual').click(function() {
        runSearch('individual', false);
    });
    $('#causal').click(function() {
        runSearch('causal', false);
    });
    $('#quirky').click(function() {
        runSearch('quirky', false);
    });
    $('#ramification').click(function() {
        runSearch('ramification', false);
    });
    $('#visualisation').click(function() {
        runSearch('visualisation', false);
    });

    $('#insert-text').click(function() {
        parseText('');
    });

    $('#reset-tags').click(resetTags);

    function resetTags() {
        // Remove all keywords
        var tags = $('#keywords').tagEditor('getTags')[0].tags;
        for (i = 0; i < tags.length; i++) {
            $('#keywords').tagEditor('removeTag', tags[i]);
        }

        document.getElementById('evidence').checked = false;
        document.getElementById('individual').checked = false;
        document.getElementById('causal').checked = false;
        document.getElementById('quirky').checked = false;
        document.getElementById('ramification').checked = false;
        document.getElementById('visualisation').checked = false;

        $('#ulResultsIndividual').empty();
        $('#article-list-individual').empty();
        $('#article-list-pagination-individual').empty();
        $('#ulResultsEvidence').empty();
        $('#article-list-evidence').empty();
        $('#article-list-pagination-evidence').empty();
        $('#ulResultsCausal').empty();
        $('#article-list-causal').empty();
        $('#article-list-pagination-causal').empty();
        $('#ulResultsQuirky').empty();
        $('#article-list-quirky').empty();
        $('#article-list-pagination-quirky').empty();
        $('#ulResultsRamification').empty();
        $('#article-list-ramification').empty();
        $('#article-list-pagination-ramification').empty();
        $('#ulResultsVisualisation').empty();
        $('#article-list-visualisation').empty();
        $('#article-list-pagination-visualisation').empty();

        showStatus('', 'rss-info', 'evidence');
        showStatus('', 'rss-info', 'individual');
        showStatus('', 'rss-info', 'causal');
        showStatus('', 'rss-info', 'quirky');
        showStatus('', 'rss-info', 'ramification');
        showStatus('', 'rss-info', 'visualisation');

        $('#refresh').hide();

        // show logo into empty sidebar on opening or res
        // $('#start-logo').show();

        // hide reset tags icon, show search icon
        hide('reset-tags');
        show('search-icon');

    }

    /*
		function that will run the search.
	   */
    function runSearch(dimension, isRefresh) {
        $('#start-logo').hide();
        document.getElementById("content1").style.padding = "10px";
        document.getElementById("content1").style.marginLeft = "2px";

        var tags = $('#keywords').tagEditor('getTags')[0].tags;
        // If no keywords are in the query box
        if (tags.length === 0) {
            document.getElementById(dimension).checked = false;
            showNotification('notice', NOTIFICATION_STATUS_NO_KEYWORDS);
        }
        // If more than 5 keywords entered, and ‘AND’ strategy invoked
        else if (tags.length > 5 && $('#radio-operator-and').is(':checked')) {
            document.getElementById(dimension).checked = false;
            showNotification('notice', NOTIFICATION_STATUS_TOO_MANY_KEYWORDS);
        } else {
            // create keyword tags to be checked if the query exist in cache
            var queryKeywordTags = '';
            for (i = 0; i < tags.length; i++) {
                queryKeywordTags += tags[i] + 'x~';
            }

            if (dimension === 'evidence') {
                if (isRefresh) {
                    // reset the infinite-scroll elements
                    $('#article-list-evidence').empty();
                    $('#article-list-pagination-evidence').empty();
                    $('#article-list-pagination-evidence').addClass('article-list__pagination--inactive');

                    $('#refresh').hide();
                    $.LoadingOverlay("show");
                    var t0 = performance.now();
                    runMultipleDimensions(t0, 'evidence');
                } else {
                    var cachedContent = document.getElementById('isCachedEvidence').value;
                    if (cachedContent == 'true') {
                        if (!checkDimensionResults('evidence')) {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'evidence');
                        } else {
                            $('#refresh').show();
                        }
                    } else {
                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'evidence');
                        cache.setItem('evidence', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'evidence');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedEvidence').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'evidence');
                    }
                }
            }
            if (dimension === 'individual') {
                if (isRefresh) {
                    // reset the infinite-scroll elements
                    $('#article-list-individual').empty();
                    $('#article-list-pagination-individual').empty();
                    $('#article-list-pagination-individual').addClass('article-list__pagination--inactive');

                    $('#refresh').hide();
                    $.LoadingOverlay("show");
                    var t0 = performance.now();
                    runMultipleDimensions(t0, 'individual');
                } else {
                    var cachedContent = document.getElementById('isCachedIndividual').value;
                    if (cachedContent == 'true') {
                        if (!checkDimensionResults('individual')) {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'individual');
                        } else {
                            $('#refresh').show();
                        }
                    } else {
                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'individual');
                        cache.setItem('individual', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'individual');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedIndividual').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'individual');
                    }
                }
            }
            if (dimension === 'causal') {
                if (isRefresh) {
                    // reset the infinite-scroll elements
                    $('#article-list-causal').empty();
                    $('#article-list-pagination-causal').empty();
                    $('#article-list-pagination-causal').addClass('article-list__pagination--inactive');

                    $('#refresh').hide();
                    $.LoadingOverlay("show");
                    var t0 = performance.now();
                    runMultipleDimensions(t0, 'causal');
                } else {
                    var cachedContent = document.getElementById('isCachedCausal').value;
                    if (cachedContent == 'true') {
                        if (!checkDimensionResults('causal')) {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'causal');
                        } else {
                            $('#refresh').show();
                        }
                    } else {
                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'causal');
                        cache.setItem('causal', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'causal');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedCausal').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'causal');
                    }
                }
            }
            if (dimension === 'quirky') {
                if (isRefresh) {
                    // reset the infinite-scroll elements
                    $('#article-list-quirky').empty();
                    $('#article-list-pagination-quirky').empty();
                    $('#article-list-pagination-quirky').addClass('article-list__pagination--inactive');

                    $('#refresh').hide();
                    $.LoadingOverlay("show");
                    var t0 = performance.now();
                    runMultipleDimensions(t0, 'quirky');
                    cache.setItem('quirky', queryKeywordTags, {});
                    // createCacheKeywords(queryKeywordTags, 'quirky');
                    // google.script.run.withSuccessHandler(function(){
                    document.getElementById('isCachedQuirky').value = 'true';
                    // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'quirky');
                } else {
                    var cachedContent = document.getElementById('isCachedQuirky').value;
                    if (cachedContent == 'true') {
                        if (!checkDimensionResults('quirky')) {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'quirky');
                        } else {
                            $('#refresh').show();
                        }
                    } else {
                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'quirky');
                        cache.setItem('quirky', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'quirky');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedQuirky').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'quirky');
                    }
                }
            }
            if (dimension === 'ramification') {
                if (TWITTER) {
                    if (isRefresh) {
                        // reset the infinite-scroll elements
                        $('#article-list-ramification').empty();
                        $('#article-list-pagination-ramification').empty();
                        $('#article-list-pagination-ramification').addClass('article-list__pagination--inactive');

                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'ramification');
                        cache.setItem('ramification', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'ramification');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedRamification').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'ramification');
                    } else {
                        var cachedContent = document.getElementById('isCachedRamification').value;
                        if (cachedContent == 'true') {
                            if (!checkDimensionResults('ramification')) {
                                $('#refresh').hide();
                                $.LoadingOverlay("show");
                                var t0 = performance.now();
                                runMultipleDimensions(t0, 'ramification');
                            } else {
                                $('#refresh').show();
                            }
                        } else {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'ramification');
                            cache.setItem('ramification', queryKeywordTags, {});
                            // createCacheKeywords(queryKeywordTags, 'ramification');
                            // google.script.run.withSuccessHandler(function(){
                            document.getElementById('isCachedRamification').value = 'true';
                            // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'ramification');
                        }
                    }
                } else {
                    // document.getElementById('ramification').checked = false;
                    $('#refresh').hide();
                    showNotification('notice', NOTIFICATION_STATUS_VISUALISATION_DIMENSION);
                }
            }
            if (dimension === 'visualisation') {
                if (isRefresh) {
                    // reset the infinite-scroll elements
                    $('#article-list-visualisation').empty();
                    $('#article-list-pagination-visualisation').empty();
                    $('#article-list-pagination-visualisation').addClass('article-list__pagination--inactive');

                    $('#refresh').hide();
                    $.LoadingOverlay("show");
                    var t0 = performance.now();
                    runMultipleDimensions(t0, 'visualisation');
                } else {
                    var cachedContent = document.getElementById('isCachedVisualisation').value;
                    if (cachedContent == 'true') {
                        if (!checkDimensionResults('visualisation')) {
                            $('#refresh').hide();
                            $.LoadingOverlay("show");
                            var t0 = performance.now();
                            runMultipleDimensions(t0, 'visualisation');
                        } else {
                            $('#refresh').show();
                        }
                    } else {
                        $('#refresh').hide();
                        $.LoadingOverlay("show");
                        var t0 = performance.now();
                        runMultipleDimensions(t0, 'visualisation');
                        cache.setItem('visualisation', queryKeywordTags, {});
                        // createCacheKeywords(queryKeywordTags, 'visualisation');
                        // google.script.run.withSuccessHandler(function(){
                        document.getElementById('isCachedVisualisation').value = 'true';
                        // }).withFailureHandler(showError).createCacheKeywords(queryKeywordTags, 'visualisation');
                    }
                }
                // // document.getElementById('visualisation').checked = false;
                // $('#refresh').hide();
                // showNotification('notice', NOTIFICATION_STATUS_VISUALISATION_DIMENSION);
            }

        }

    }

    /*
    	function that will show result in alert box.
    	we have passed tags object as argument
    */
    function showTags(tags) {
        var string = "Tags (label : value)\r\n";
        string += "--------\r\n";
        for (var i in tags)
            string += tags[i].label + " : " + tags[i].value + "\r\n";
        alert(string);
    }

    // // Call the server here to retrieve any information needed to build the sidebar, if necessary.
    // google.script.run.withSuccessHandler(function (footerText) {
    //     // Respond to success conditions here.
    //     $('#sidebar-footer-text').val(footerText);
    //     // showStatus('Ready.', 'rss-info', 'individual'); showStatus('Ready.', 'rss-info', 'evidence'); showStatus('Ready.', 'rss-info', 'causal'); showStatus('Ready.', 'rss-info', 'quirky'); showStatus('Ready.', 'rss-info', 'ramification');
    //     // showStatus('Ready.', 'rss-info', 'visualisation');
    // }).withFailureHandler(showError).getPreferences();
});

/**
 * Callback function that populates the origin and destination selection
 * boxes with user preferences from the server.
 *
 * @param {Object} languagePrefs The saved origin and destination languages.
 */
function loadPreferences(languagePrefs) {
    $('input:radio[name="origin"]').filter('[value=' + languagePrefs.originLang + ']').attr('checked', true);
    $('input:radio[name="dest"]').filter('[value=' + languagePrefs.destLang + ']').attr('checked', true);
    // Respond to success conditions here.
    $('#sidebar-footer-text').val(footerText);
    showStatus('Ready.');
}

/**
 * Inserts a div that contains an error message after a given element.
 *
 * @param msg The error message to display.
 * @param element The element after which to display the error.
 */
function showError(errorMsg, isOverlay, statusMsg, statusType, statusDimension) {
    // Respond to failure conditions here.
    if (typeof statusDimension !== 'undefined') showStatus(statusMsg, statusType, statusDimension);
    showNotification('error', errorMsg);
    if (isOverlay) $.LoadingOverlay("hide");
}

function getGuideSlides() {
    var slides = [{
            content: 'Hello,<br/><br/>Welcome to JUICE, a prototype of <strong>digital creativity</strong> support for journalists during the early stages of news story and feature development.<br/><br/>Please take a tour and follow the slides to know more about JUICE.',
            selector: '#sticky-anchor',
            position: 'bottom-center',
            title: 'Welcome to JUICE!'
        },
        {
            content: 'There are two main ways to enter a search query: <br><br> 1. You can <b>highlight text</b> on your writing page and <b>click the insert button</b>. <br><br><img style="width:240px; height:90px;  max-height:90px;" src="https://dl.dropboxusercontent.com/s/dlzwby1sq93oogp/insert_from_doc.png"/><br><br>',
            selector: '#search',
            position: 'bottom-center',
            title: 'Entering search queries'
        },
        {
            content: '2. You can also <b>enter search terms</b> yourself directly into the <b>search box</b>. Type in the search term and press <b>Enter</b> or <b>Tab</b> to insert it. <b>Compound terms</b> can be entered with a <b>space between terms</b> e.g. “Presidential election”.<br><br><img style="width:240px; height:142px;  max-height:142px;" src="https://dl.dropboxusercontent.com/s/fcx3k4yz6lcdnmx/enter_terms.png"/><br><br>',
            selector: '#search',
            position: 'bottom-center',
            title: 'Entering search queries'
        },
        {
            content: 'To <b>run a search</b> click on one of the <b>creative search icons</b>.<br><br>There are <b>6 creative search dimensions</b> to open up possible new angles on a story:<ul><li><b>Backing & Evidence</b> – Quantitative evidence (e.g. numbers and measures).</li><li><b>Individuals</b> – Who are the key players? The viewpoint of an individual.</li><li><b>Causal</b> – The background, the history, what caused something.</li><li><b>Quirky</b> – Satire, not the obvious (cartoons).</li><li><b>Ramifications</b> – What for the future? (coming soon).</li><li><b>Data visualisations</b> – Charts and infographics (coming soon).</li></ul>',
            selector: '#dimensions',
            position: 'bottom-center',
            title: 'Running a search'
        },
        // {
        // content: 'For example, clicking on <b>Individuals</b> generates results in the following format:<br><br><img style="width:240px; height:395px;  max-height:395px;" src="https://dl.dropboxusercontent.com/s/o3moicwfkwja69p/individual_results.png"/><br><br>',
        // selector: '#sticky-anchor',
        // position: 'bottom-center',
        // title: 'Exploring the search results'
        // },
        // {
        // content: 'The sidebar displays the title of the retrieved article, its source, how long ago it was published and a short description from the opening paragraph.',
        // selector: '#sticky-anchor',
        // position: 'bottom-center',
        // title: 'Exploring the search results'
        // },
        {
            content: 'In addition to the article title and short description, JUICE extracts <b>concepts</b> from the article, displayed in a colour-coded form:<ul><li><b>Red</b> – Place</li><li><b>Purple</b> – Person</li><li><b>Blue</b> – Thing</li><li><b>Green</b> – Organisation</li></ul>Click on a coloured keyword to add the term to the search box and rerun the search using the additional term(s).',
            selector: '#sticky-anchor',
            position: 'bottom-center',
            title: 'Adding keyword terms from articles'
        },
        {
            content: 'To view an article, click on the title to open a dialog window containing the detailed information. <br><br><img style="width:240px; height:187px;  max-height:187px;" src="https://dl.dropboxusercontent.com/s/snmohi81lboqnid/dialog.png"/>4 functions are available: <ul><li><b>Search Article</b>: Enter a search term in the search box to highlight any matching words in the article. </li> <li><b>Insert Selected Text</b>: Highlight text in the article and select this option to insert the text into the writing page. </li> <li><b>Insert Reference</b>: Click this option to insert the source reference into the writing page at the position of the cursor. </li><li><b>View Original Article</b>: Click on this option to open the original article in a new browser tab.</li></ul>',
            selector: '#sticky-anchor',
            position: 'bottom-center',
            title: 'Using the Dialog Window'
        },
        {
            content: 'To <b>rerun a search</b>, for example where the search terms have been changed, click on the <b>“Refresh results” bar</b>.<br><br><img style="width:240px; height:149px;  max-height:149px;" src="https://dl.dropboxusercontent.com/s/5rycvdgksgrut2u/rerun_search.png"/>',
            selector: '#sticky-anchor',
            position: 'bottom-center',
            title: 'Rerunning a search'
        },
        {
            content: 'There are 5 functions available in the footer of the sidebar:<ul><li><b>Advanced search setting</b> – change search strategy, publish date, and news sources.</li><li>Start this <b>tutorial</b> at any time again.</li><li><b>“Ask a question, request a feature, report a bug”</b> – Click on this to open up a form to send feedback to the JUICE development team. We welcome your feedback!</li><li><b>Get help</b> – click to open a new browser tab containing this user guide.</li><li><b>Get more info</b> – select the JUICE logo to open a new browser tab containing the JUICE user forum</li></ul>',
            selector: '#footer',
            position: 'top-center',
            title: 'Using the footer functions'
        },
        {
            content: 'A small degree of experimentation may be needed to get the creative inspiration you are looking for. Give JUICE a try and see what you find!',
            selector: '#sticky-anchor',
            position: 'bottom-center',
            title: 'Ready to go!'
        }
    ];

    return slides;
}

function toggleGuide() {

    $.tutorialize({
        slides: getGuideSlides(),
        arrowPath: 'https://dl.dropboxusercontent.com/s/8jagrw9vgt778b2/arrow-blue.png',
        bgColor: '#29BB9C',
        buttonBgColor: '#29BB9C',
        buttonFontColor: '#fff',
        fontColor: '#666',
        padding: '0px',
        overlayMode: 'focus',
        showClose: true,
        theme: 'lined',
        width: 280,
        rememberOnceOnly: true,
        onStop: function() {
            cache.setItem('guide', 'disable', {});
            //  google.script.run.withSuccessHandler(function(){
            // if (isEnabled) {
            // document.getElementById('isCachedGuide').value = 'disable';
            // }
            // }).withFailureHandler(showError)
            // .withUserObject(this)
            // .createCacheGuide('guide', 'disable');
        }
    });
}

function show(element) {
    document.getElementById(element).setAttribute("display", "inline");
}

function hide(element) {
    document.getElementById(element).setAttribute("display", "none");
}

function disableDimensions(element) {
    $('.' + element).css('opacity', '.5');
    // $(".tabs").attr('disabled', true);
}

function enableDimensions(element) {
    $('.' + element).css('opacity', '1');
    // $(".tabs").attr('disabled', false);
}

function populateConcepts(concepts) {
    var str = '';
    if (typeof concepts !== 'undefined' && concepts.length > 0) {
        var maxResultsConcepts = concepts.length < 7 ?
            concepts.length :
            7;
        for (c = 0; c < maxResultsConcepts; c++) {
            var parts = concepts[c].uri.split('/');
            var p = decodeURIComponent(parts[parts.length - 1].replace(/_/g, ' '));
            if (concepts[c]["generic-type"].indexOf('Organisation') > -1) {
                var prompt = getDimensionPrompt(3, concepts[c].label);
                str += '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + prompt + '\' class="post-category post-category-organisation" href="javascript:void(0)" onClick="insertConceptAsKeyword(this)">' + concepts[c].label + '</a> ';
            } else if (concepts[c]["generic-type"].indexOf('Thing') > -1) {
                var prompt = getDimensionPrompt(1, concepts[c].label);
                str += '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + prompt + '\' class="post-category post-category-thing" href="javascript:void(0)" onClick="insertConceptAsKeyword(this)">' + concepts[c].label + '</a> ';
            } else if (concepts[c]["generic-type"].indexOf('Person') > -1) {
                var prompt = getDimensionPrompt(0, concepts[c].label);
                str += '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + prompt + '\' class="post-category post-category-person" href="javascript:void(0)" onClick="insertConceptAsKeyword(this)">' + concepts[c].label + '</a> ';
            } else if (concepts[c]["generic-type"].indexOf('Place') > -1) {
                var prompt = getDimensionPrompt(2, concepts[c].label);
                str += '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + prompt + '\' class="post-category post-category-place" href="javascript:void(0)" onClick="insertConceptAsKeyword(this)">' + concepts[c].label + '</a> ';
            } else {
                var prompt = getDimensionPrompt(0, concepts[c].label);
                str += '<a data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + prompt + '\' class="post-category post-category-organisation" href="javascript:void(0)" onClick="insertConceptAsKeyword(this)">' + concepts[c].label + '</a> ';
            }
            str += '&nbsp;';
        }
    }
    return str;
}

function changeImage(img) {
    var id = '';
    if (img.id.match(/a_/))
        id = 'delete';
    else {
        id = img.id;
        if (id.indexOf('individual') > -1 || id.indexOf('evidence') > -1 || id.indexOf('causal') > -1 || id.indexOf('quirky') > -1 || id.indexOf('visualisations') > -1) {
            if (img.src.match(/_off/))
                img.src = "https://dl.dropboxusercontent.com/s/" + img.name + "/" + id + ".png";
            else
                img.src = "https://dl.dropboxusercontent.com/s/" + img.alt + "/" + id + "_off.png";
        }
    }

    //  changeImage2(img);  var individualid = document.getElementById("individual").id;  var individualalt = document.getElementById("individual").alt;  if(individualid === id){}  else {  document.getElementById("individual").src =
    // "https://dl.dropboxusercontent.com/s/" + individualalt + "/" + individualid + "_off.png";  }  var evidenceid = document.getElementById("evidence").id;  var evidencealt = document.getElementById("evidence").alt;  if(individualid === id){}  else {
    // document.getElementById("evidence").src = "https://dl.dropboxusercontent.com/s/" + quantifiablealt + "/" + quantifiableid + "_off.png";  }  var causalid = document.getElementById("causal").id;  var causalalt =
    // document.getElementById("causal").alt;  if(individualid === id){}  else {  document.getElementById("causal").src = "https://dl.dropboxusercontent.com/s/" + causalalt + "/" + causalid + "_off.png";  }  var quirkyid =
    // document.getElementById("quirky").id;  var quirkyalt = document.getElementById("quirky").alt;  if(individualid === id){}  else {  document.getElementById("quirky").src = "https://dl.dropboxusercontent.com/s/" + quirkyalt + "/" + quirkyid +
    // "_off.png";  }  var ramificationsid = document.getElementById("ramifications").id;  var ramificationsalt = document.getElementById("ramifications").alt;  if(individualid === id){}  else {  document.getElementById("ramifications").src =
    // "https://dl.dropboxusercontent.com/s/" + ramificationsalt + "/" + ramificationsid + "_off.png";  }  var visualisationsid = document.getElementById("visualisations").id;  var visualisationsalt = document.getElementById("visualisations").alt;
    // if(individualid === id){}  else {  document.getElementById("visualisations").src = "https://dl.dropboxusercontent.com/s/" + visualisationsalt + "/" + visualisationsid + "_off.png";  }

}

function changeImage2(img) {
    $('img').each(function(i) {
        var imgSrc = this.src;

        if (this.id === img.id) {} else {
            this.src = "https://dl.dropboxusercontent.com/s/" + this.alt + "/" + this.id + "_off.png";
        }
    });

}

function extractPersons(result) {
    var persons = [];
    var concepts = result.concepts;
    for (j = 0; j < concepts.length; j++) {
        var concept = concepts[j];
        var genericType = concept["generic-type"];
        if (genericType.indexOf("/Person") > -1) {
            var parts = concepts[j].uri.split('/');
            var p = parts[parts.length - 1].replace(/_/g, ' ');
            persons.push(p);
        }
    }
    return persons;
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
        i = arr.length,
        temp,
        index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip()

})

function checkDimensionResults(dimension) {
    if (dimension === 'evidence') {
        var $target = $('#article-list-evidence');
        if ($target.find("ul").length > 0) {
            // if (($("ul#ulResultsCausal").has("span").length === 0)) {
            return true;
        } else {
            return false;
        }
    }
    if (dimension === 'individual') {
        var $target = $('#article-list-individual');
        if ($target.find("ul").length > 0) {
            // if (($("ul#ulResultsCausal").has("span").length === 0)) {
            return true;
        } else {
            return false;
        }
    }
    if (dimension === 'causal') {
        var $target = $('#article-list-causal');
        if ($target.find("ul").length > 0) {
            // if (($("ul#ulResultsCausal").has("span").length === 0)) {
            return true;
        } else {
            return false;
        }
    }
    if (dimension === 'quirky') {
        var $target = $('#article-list-quirky');
        if ($target.find("ul").length > 0) {
            // if (($("ul#ulResultsCausal").has("span").length === 0)) {
            return true;
        } else {
            return false;
        }
    }
    if (dimension === 'ramification') {
        var $target = $('#article-list-ramification');
        if ($target.find("ul").length > 0) {
            // if (($("ul#ulResultsCausal").has("span").length === 0)) {
            return true;
        } else {
            return false;
        }
    }
    if (dimension === 'visualisation') {
        // var $target = $('#article-list-visualisation');
        // if ($target.find("ul").length > 0) {
        // // if (($("ul#ulResultsCausal").has("span").length === 0)) {
        //     return true;
        // } else {
        //     return false;
        // }
    }
}

function showNotification(type, msg) {
    var fadeIn = 1000;
    var fadeOut = 1000;
    var delay = 6000;
    if (type === 'notice') {
        $("#noticeMessage").html(msg);
        $("div.notice").fadeIn(fadeIn).delay(delay).fadeOut(fadeOut);
    } else if (type === 'error') {
        $("#errorMessage").html(msg);
        $("div.error").fadeIn(fadeIn).delay(delay).fadeOut(fadeOut);
    } else if (type === 'success') {
        $("#successMessage").html(msg);
        $("div.success").fadeIn(fadeIn).delay(delay).fadeOut(fadeOut);
    } else if (type === 'warning') {
        $("#warningMessage").html(msg);
        $("div.warning").fadeIn(fadeIn).delay(delay).fadeOut(fadeOut);
    }
}

/**
 * Displays the given status message in the sidebar.
 *
 * @param {String} msg The status message to display.
 * @param {String} classId The message type (class id) that the message
 *   should be displayed as.
 */
function showStatus(msg, classId) {
    $('#sidebar-status').removeClass('status-error');
    $('#sidebar-status').html(msg);
    if (classId) {
        $('#sidebar-status').addClass(classId);
    }
}

/**
 * Displays the given status message in the sidebar.
 *
 * @param {String} msg The status message to display.
 * @param {String} classId The message type (class id) that the message
 *   should be displayed as.
 * @param {String} dimension The dimension that relates the status message.
 */
function showStatus(msg, classId, dimension) {
    if (dimension === 'evidence') {
        $('#sidebar-status-evidence').removeClass('status-error');
        $('#sidebar-status-evidence').html(msg);
        if (classId) {
            $('#sidebar-status-evidence').addClass(classId);
        }
    }
    if (dimension === 'individual') {
        $('#sidebar-status-individual').removeClass('status-error');
        $('#sidebar-status-individual').html(msg);
        if (classId) {
            $('#sidebar-status-individual').addClass(classId);
        }
    }
    if (dimension === 'causal') {
        $('#sidebar-status-causal').removeClass('status-error');
        $('#sidebar-status-causal').html(msg);
        if (classId) {
            $('#sidebar-status-causal').addClass(classId);
        }
    }
    if (dimension === 'quirky') {
        $('#sidebar-status-quirky').removeClass('status-error');
        $('#sidebar-status-quirky').html(msg);
        if (classId) {
            $('#sidebar-status-quirky').addClass(classId);
        }
    }
    if (dimension === 'ramification') {
        $('#sidebar-status-ramification').removeClass('status-error');
        $('#sidebar-status-ramification').html(msg);
        if (classId) {
            $('#sidebar-status-ramification').addClass(classId);
        }
    }
    if (dimension === 'visualisation') {
        $('#sidebar-status-visualisation').removeClass('status-error');
        $('#sidebar-status-visualisation').html(msg);
        if (classId) {
            $('#sidebar-status-visualisation').addClass(classId);
        }
    }
}

function addKeyword() {
    var queryTextArea = $('#query-text').val();
    var numitems = $("#ulKeywords li").length;
    var str = '<li id=\'li_' + numitems + '\' class=\'alert-box notice\'><img valign="middle" onmouseover=changeImage(this) onmouseout=changeImage(this) id=\'a_' + numitems + '\' name="wlg5h7yo0dcarps" alt="jro526lr35rgaen" height=\'12\' width=\'12\' src=\'https://dl.dropboxusercontent.com/s/wlg5h7yo0dcarps/delete.png\'>   ' + queryTextArea + '</li>';
    $('#ulList ul').append(str);
}

function removeKeyword(id) {
    id = id.substring(id.indexOf("_") + 1);
    $('#li_' + id).remove();
}

//$(document).on("click", "#remove", function(){   $(this).parent('li').remove(); });

$('#ulList').on("click", "img", function() {
    $(this).parent('li').remove();
    //    removeKeyword($(this).attr('id'));    $("#ulList ul li:contains('dementia')").remove();
});

/**
 * Runs a server-side function to insert the text into the document
 * at the user's cursor or selection.
 */
function parseText(pasted_content) {
    $.LoadingOverlay("show");
    this.disabled = true;
    showStatus('Adding text...');

    // var text = 'Earthquake near Donald Trump and mount everest David Cameron';

    async.waterfall([
            // first, add terms generated through EDDiE API
            function(callback) {
                runEddie(pasted_content, function(err, query, terms) {
                    if (err) return callback(err);

                    // // record the event using Activity Logger
                    // activityLogger_insert(1, 'sdsdfsdf', 'element', 'test', 'end-move', 'test', 0);
                    // var result = alasql('SELECT * FROM activity');
                    // var resultContent = '';
                    // for (var i= 0; i < result.length; i++) {
                    //   resultContent += result[i].id;
                    // }

                    callback(null, query, terms);
                });
            },
            // then, add name entities using Mango API
            function(query, terms, callback) {
                // console.log('terms: ' +  terms);
                console.log(6,query,terms)
                findNameEntities(query, 'text', function(err, names) {
                    if (err) return callback(err);
                    if (typeof names !== 'undefined' && names.length > 0) {
                        for (var n in names) {
                            // add keyword to search area
                            terms.push(names[n]);
                        }
                    }
                    callback(null, terms);
                });
            }
        ],
        // finally, create keywords for each retrieved term
        function(err, results) {
                console.log(7,results)
            if (typeof results !== 'undefined' && results.length > 0) {
                for (var n in results) {
                    // add keyword to search area
                    $('#keywords').tagEditor('addTag', results[n]);
                }
            }
            var tags = $('#keywords').tagEditor('getTags')[0].tags;
            if (tags.length === 0) {
                showError(NOTIFICATION_INSERT_NO_EDDIE_SELECTION, true, '', 'rss-info', null);
            }
            if (pasted_content.length > 0) {
                // $('#keywords').tagEditor('removeTag', pasted_content);
                $('#keywords').tagEditor('addTag', pasted_content);
            }
            $.LoadingOverlay("hide");
            if (err) {
                showError(err, true, '', 'rss-info', null);
            }
            // else {
            //   showStatus('Finished.');
            // }
        });


    // runEddie(text, function (err, terms) {
    //   if (err) {
    //     return;
    //   }
    //   if (typeof terms !== 'undefined' && terms.length > 0) {
    //     for (var i in terms) {
    //       // add keyword to search area
    //       $('#keywords').tagEditor('addTag', terms[i]);
    //     }
    //   }
    //
    //   // // record the event using Activity Logger
    //   // activityLogger_insert(1, 'sdsdfsdf', 'element', 'test', 'end-move', 'test', 0);
    //   // var result = alasql('SELECT * FROM activity');
    //   // var resultContent = '';
    //   // for (var i= 0; i < result.length; i++) {
    //   //   resultContent += result[i].id;
    //   // }
    //
    //   var tags = $('#keywords').tagEditor('getTags')[0].tags;
    //   if (tags.length === 0) {
    //       showNotification('error', NOTIFICATION_INSERT_NO_EDDIE_SELECTION);
    //   }
    //   if (pasted_content.length > 0) {
    //     // $('#keywords').tagEditor('removeTag', pasted_content);
    //     $('#keywords').tagEditor('addTag', pasted_content);
    //   }
    // });
    //
    // // add names through Mango API
    // findNameEntities(text, 'text', function (err, names) {
    //   if (err) {
    //     return;
    //   }
    //   if (typeof names !== 'undefined' && names.length > 0) {
    //       for (var n in names) {
    //         // add keyword to search area
    //         $('#keywords').tagEditor('addTag', names[n]);
    //       }
    //   }
    // });

}

function htmlEscape(str) {
    str = str.replace(/\n/g, "<br>");
    str = str.replace(/'/g, "`");
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/#/g, "&#35;");
    str = str.replace(/!/g, "&#33;");
    str = str.replace(/$/g, "&#36;");
    str = str.replace(/%/g, "&#37;");
    str = str.replace(/\*/g, "&#42;");
    str = str.replace(/=/g, "&#61;");
    str = str.replace(/@/g, "&#64;");
    str = str.replace(/£/g, "&#163;");
    str = str.replace(/€/g, "&#8364;");
    str = str.replace(/à/g, "&#224;");
    str = str.replace(/á/g, "&#225;");
    str = str.replace(/â/g, "&#226;");
    str = str.replace(/ã/g, "&#227;");
    str = str.replace(/ä/g, "&#228;");
    str = str.replace(/å/g, "&#229;");
    str = str.replace(/è/g, "&#232;");
    str = str.replace(/é/g, "&#233;");
    str = str.replace(/ê/g, "&#234;");
    str = str.replace(/ë/g, "&#235;");
    str = str.replace(/ì/g, "&#236;");
    str = str.replace(/í/g, "&#237;");
    str = str.replace(/î/g, "&#238;");
    str = str.replace(/ï/g, "&#239;");
    str = str.replace(/ñ/g, "&#241;");
    str = str.replace(/ò/g, "&#242;");
    str = str.replace(/ò/g, "&#242;");
    str = str.replace(/ó/g, "&#243;");
    str = str.replace(/ô/g, "&#244;");
    str = str.replace(/õ/g, "&#245;");
    str = str.replace(/ö/g, "&#246;");
    str = str.replace(/ø/g, "&#248;");
    str = str.replace(/ù/g, "&#249;");
    str = str.replace(/ú/g, "&#250;");
    str = str.replace(/û/g, "&#251;");
    str = str.replace(/ü/g, "&#252;");
    str = str.replace(/ý/g, "&#253;");
    str = str.replace(/ÿ/g, "&#255;");
    str = str.replace(/ā/g, "&#257;");
    str = str.replace(/ă/g, "&#259;");
    str = str.replace(/ć/g, "&#263;");
    str = str.replace(/ĉ/g, "&#265;");
    str = str.substring(0, str.length - 5);
    return str;
}



// // Intercom - Dialog/Sidebar communication
// /**
//  * How long to wait for the dialog to check-in before assuming it's been
//  * closed, in milliseconds.
//  */
// var DIALOG_TIMEOUT_MS = 2000;
//
// /**
//  * Holds a mapping from dialog ID to the ID of the timeout that is used to
//  * check if it was lost. This is needed so we can cancel the timeout when
//  * the dialog is closed.
//  */
// var timeoutIds = {};
//
// /**
//  * Instance of the Intercom.js library.
//  */
// var intercom = Intercom.getInstance();
//
// /**
//  * Callback to run after the dialog has been opened.
//  * @param {string} dialogId The ID of the dialog.
//  */
// function onDialogOpened(dialogId) {
//     $('#output').append('Dialog opened\n');
//     // Setup event listeners.
//     intercom.on(dialogId, function (state) {
//         switch (state) {
//             case 'done':
//                 $('#output').append('Dialog submitted.\n');
//                 forget(dialogId);
//                 break;
//             case 'aborted':
//                 $('#output').append('Dialog cancelled.\n');
//                 forget(dialogId);
//                 break;
//             case 'checkIn':
//                 forget(dialogId);
//                 watch(dialogId);
//                 break;
//             case 'lost':
//                 $('#output').append('Dialog lost.\n');
//                 break;
//             default:
//                 throw 'Unknown dialog state: ' + state;
//         }
//     });
// }
//
// function onError(exception) {
//     $('#output').append('Error: ' + exception + '\n');
// }
//
// /**
//  * Watch the given dialog, to detect when it's been X-ed out.
//  * @param {string} dialogId The ID of the dialog to watch.
//  */
// function watch(dialogId) {
//     timeoutIds[dialogId] = window.setTimeout(function () {
//         intercom.emit(dialogId, 'lost');
//     }, DIALOG_TIMEOUT_MS);
// }
//
// /**
//  * Stop watching the given dialog.
//  * @param {string} dialogId The ID of the dialog to watch.
//  */
// function forget(dialogId) {
//     if (timeoutIds[dialogId]) {
//         window.clearTimeout(timeoutIds[dialogId]);
//     }
// }

/**
 * Open the dialog with information from article or wikipedia.
 */
function openDialog(isWiki, title, url, published, image, body) {

    var content = {
        title: title,
        url: url,
        published: published,
        image: image,
        body: body
    };

    async.waterfall([
            function(callback) {
                runWikipedia(content.title, function(err, pages) {
                    if (err) return callback(err);
                    console.log('pages.length: ' + pages.length);
                    callback(null, pages);
                });
            },
            // function(callback, pages) {
            //   inject.events.emit("openArticleDialog",['', '', isWiki, content, pages, {
            //     //   successCallback: function() {
            //     //     callback(null, false);
            //     // },
            //     //   errorCallback:function(err) {
            //     //     callback(true);
            //     //   }
            //   }]);
            //   callback(null, false);
            // }
        ],
        function(err, pages) {
            inject.events.emit("openArticleDialog", ['', '', isWiki, content, pages, {
                //   successCallback: function() {
                //     callback(null, false);
                // },
                //   errorCallback:function(err) {
                //     callback(true);
                //   }
            }]);
            // return false;
        });
    return false;
}

/**
 * Open the dialog with information from article or wikipedia.
 */
function openDialog2(queryTermsOriginal, queryTermsExpanded, isWiki, title, url, published, image, body, sourceName) {

    var content = {
        title: title,
        url: url,
        published: published,
        image: image,
        body: body,
        sourceName: sourceName
    };

    inject.events.emit("openArticleDialog", [queryTermsOriginal, queryTermsExpanded, isWiki, content, null, {}]);
    // google.script.run.withSuccessHandler(onDialogOpened).withFailureHandler(onError).showCustomDialog(queryTermsOriginal, queryTermsExpanded, isWiki, content);
    return false;
}

function getWaitingPrompt() {
    var conceptsGeneric = new Array("Comedians", "Pop artists", "Classical music artists", "Politicians", "Current sportspersons", "Retired sportspersons", "Trades union leaders", "Military historians", "Television journalists", "Print journalists", "Entrepreneurs", "Sculptors", "Artists", "Naturalists", "Aristocrats", "Social media celebrities", "Academics", "Bon viveurs", "Religious leaders", "Military leaders", "Common persons", "Authors", "Film makers", "Sex workers", "TV documentary makers", "Rock stars", "Scientists", "Winners of a Nobel Prize", "Refuges", "Child stars", "Company directors", "Someone who died in current year", "Engineers", "Designers", "Television pundits", "Medical doctors", "Medical nurses", "Psychologists", "Psychiatrists", "Sociologists", "Business owners", "Surgeons", "Author and novelists", "Explorers", "Financial analysts", "Cartoonists", "Satirists", "Police officers", "Chefs and bakers", "Architects", "Social planners", "Town planners", "Environmental activists", "Data scientists", "Political lobbyists", "Geographers and geologers", "Photographers", "Philanthropists");

    var shuffledConcepts = getRandomSubarrayLocal(conceptsGeneric, 3);
    var content = 'Meanwhile, think about types of people for your human angle, from <b>';
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

    //  var content = 'Meanwhile, think about types of people for your human angle, from <b>' + shuffledConcepts[0] + '</b> and <b>' + shuffledConcepts[1] + '</b> to <b>' + shuffledConcepts[2] + '</b>.';
    return content;
}

function getRandomSubarrayLocal(arr, size) {
    var shuffled = arr.slice(0),
        i = arr.length,
        temp,
        index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function getDimensionPrompt(dimesion, source) {
    var dimensionPromptArray = [
        [
            ["Person"],
            [
                "Take [filler], and develop an interesting angle based on the background of that person",
                "Think about [filler], and explore a new angle based on how the person might take advantage from the news story - what is in it for [filler]",
                "Focus on [filler], and investigate what the story might mean for their associates - family members or colleagues",
                "Target what might be behind the behaviour or actions of [filler], as the focus of your story - what caused this behaviour or actions?",
                "Think about the opponents of [filler], and how the story evolves from their perspective",
                "Think about what evidence is available about [filler], which you can use to investigate a different angle on the story",
                "Is there something witty or humorous about [filler] that be the basis for a new take on a story about [filler]?",
                "What will [filler] do next? Next week, next month, next year?",
                "Explore the data that is available about [filler], and build on something unusual in it"
            ]
        ],
        [
            ["Thing"],
            [
                "Explore the characteristics of [filler] that enhance emotional impact",
                "Explore the history or background of [filler] to see whether there are curious angles",
                "Think about what might have happened if [filler] had not been available",
                "If [filler] influenced events in the story, explore this influence for new insights",
                "What does the story means for the future of [filler]?",
                "Consider people who might be associated with [filler]. Incorporate them into your thinking",
                "Is there anything quirky about [filler] to write either a serious or light-hearted piece about?",
                "Explore the data that is available about [filler], and incorporate it into your stories"
            ]
        ],
        [
            ["Place"],
            [
                "Think about [filler], and explore an angle that is based on the significance of it.",
                "Think about [filler], and explore an angle that is based on the history of it - what else happened there",
                "If there are other important people associated with [filler], evolve your story about one or more of these people",
                "Unpick what the relevance of [filler], as opposed to somewhere else, might have on the story",
                "Is there something unusual or humorous about [filler]? If so, work with it",
                "What are the future implications of the story on [filler], and how it and/or the people in it might be impacted?",
                "Explore recent data that is available about [filler], and build on interesting patterns in it",
                "Go to [filler] in Google Maps. Explore the place - what stands out? What ideas do you get?"
            ]
        ],
        [
            ["Organisation"],
            [
                "How did the [filler] influence this story? Is there an unusual take on this?",
                "What do these events mean for the future of the [filler]?",
                "Take someone associated with [filler], and work up a new story about this person",
                "Explore the history and background of [filler] to obtain a new perspective on your story",
                "Is there anything unusual about [filler] to write either a serious or light-hearted piece about?",
                "Explore the data that is available about [filler], and incorporate it into your stories"
            ]
        ],
        [
            ["Individual"],
            [
                "Create an angle with [filler]",
                "Think about an angle based on [filler]",
                "Involve [filler] in your angle",
                "How might [filler] relate to your story?",
                "Explore stories about [filler]",
                "Read the first story about [filler]"
            ]
        ],
        [
            ["Evidence"],
            [
                "Take this story. What evidence-based angles does it inspire?",
                "Use data types reported in this story, to generate a new angle",
                "Take direct inspiration from this story",
                "Use themes in this story to inspire new story angles",
                "Select 2 data types reported in this story to build your angle around",
                "Work the first sentence from this story into your story",
                "Reinterpret this story to create a new angle",
                "What is the first idea that you get when reading this story?",
                "Make your angle more similar to the angle in this story",
                "Use the same information sources cited in this story",
                "Imagine you wrote this story. What was your inspiration?",
                "Incorporate evidence from this story into your angle"
            ]
        ],
        [
            ["Evidence"],
            [
                "Take the story: [filler]. What evidence-based angles does it inspire?",
                "Use data types reported in [filler], to generate a new angle",
                "Take direct inspiration from the story about [filler]",
                "Use themes in the story [filler], to inspire new story angles",
                "Select 2 data types reported in [filler], to build your angle around",
                "Work the first sentence from the story: [filler], into your story",
                "Reinterpret the story [filler], to create a new angle",
                "What is the first idea that you get when reading [filler]?",
                "Make your angle more similar to the angle in [filler]",
                "Use the same information sources cited in the story [filler]",
                "Imagine you wrote the story: [filler]. What was your inspiration?",
                "Incorporate evidence from the story: [filler], into your angle"
            ]
        ]
    ];
    var values = [];
    for (j = 0; j < dimensionPromptArray[dimesion][1].length; j++) {
        values.push(dimensionPromptArray[dimesion][1][j]);
    }
    var shuffledPrompts = getRandomSubarray(values, 1);
    var content;

    if (shuffledPrompts[0].indexOf('[filler]') > -1) {
        var str = shuffledPrompts[0].replace(/\[filler\]/g, source);
        content = str;
    } else
        content = shuffledPrompts[0];
    return content;
}

function changeAllHidden(isCached) {
    document.getElementById('isCachedIndividual').value = isCached;
    document.getElementById('isCachedEvidence').value = isCached;
    document.getElementById('isCachedCausal').value = isCached;
    document.getElementById('isCachedQuirky').value = isCached;
    document.getElementById('isCachedRamification').value = isCached;
    document.getElementById('isCachedVisualisation').value = isCached;

}

function removeContentDimension() {
    if (document.getElementById('evidence').checked == true) {
        $('#ulResultsIndividual').empty();
        // $('#ulResultsEvidence').empty();
        $('#ulResultsCausal').empty();
        $('#ulResultsQuirky').empty();
        $('#ulResultsRamification').empty();
        $('#ulResultsVisualisation').empty();
    }
    if (document.getElementById('individual').checked == true) {
        // $('#ulResultsIndividual').empty();
        $('#ulResultsEvidence').empty();
        $('#ulResultsCausal').empty();
        $('#ulResultsQuirky').empty();
        $('#ulResultsRamification').empty();
        $('#ulResultsVisualisation').empty();
    }
    if (document.getElementById('causal').checked == true) {
        $('#ulResultsIndividual').empty();
        $('#ulResultsEvidence').empty();
        // $('#ulResultsCausal').empty();
        $('#ulResultsQuirky').empty();
        $('#ulResultsRamification').empty();
        $('#ulResultsVisualisation').empty();
    }
    if (document.getElementById('quirky').checked == true) {
        $('#ulResultsIndividual').empty();
        $('#ulResultsEvidence').empty();
        $('#ulResultsCausal').empty();
        // $('#ulResultsQuirky').empty();
        $('#ulResultsRamification').empty();
        $('#ulResultsVisualisation').empty();
    }
    if (document.getElementById('ramification').checked == true) {
        $('#ulResultsIndividual').empty();
        $('#ulResultsEvidence').empty();
        $('#ulResultsCausal').empty();
        $('#ulResultsQuirky').empty();
        // $('#ulResultsRamification').empty();
        $('#ulResultsVisualisation').empty();
    }
    if (document.getElementById('visualisation').checked == true) {
        $('#ulResultsIndividual').empty();
        $('#ulResultsEvidence').empty();
        $('#ulResultsCausal').empty();
        $('#ulResultsQuirky').empty();
        $('#ulResultsRamification').empty();
        // $('#ulResultsVisualisation').empty();
    }

}


/*
		Insert data to the database.

		Parameters:
			successCallback: function to call on success

		Returns:
			Nothing. Calls the output function on completion instead.
	*/
function activityLogger_insert(groupId, sessionId, eventCategory, eventLabel, eventAction, eventName, eventValue) {
    // Create storage
    // var mybase = new alasql.Database('MyDB');
    // mybase.exec('CREATE TABLE IF NOT EXISTS MyDB.activity (id number, timestamp string, sessionId number, eventCategory string, eventAction string, eventLabel string, eventValue number)');
    alasql('CREATE localStorage DATABASE IF NOT EXISTS DB');
    alasql('ATTACH localStorage DATABASE DB');
    alasql('USE DB');
    alasql('CREATE TABLE IF NOT EXISTS activity (id number, timestamp string, groupId number, sessionId string, eventCategory string, eventLabel string, eventAction string, eventName string, eventValue number)');

    var id = 0,
        x = alasql('SELECT * FROM activity'),
        lastId = x.length - 1;

    // normalize id
    if (id < x.length) {
        while (true) {
            id++;
            if (id > x[lastId].id) {
                break;
            }
        }
    } else {
        id = x.length + 1;
    }

    var currentDate = new Date();

    alasql("INSERT INTO activity (id, timestamp, groupId, sessionId, eventCategory, eventLabel, eventAction, eventName, eventValue) VALUES (?,?,?,?,?,?,?,?,?)", [
        parseInt(id),
        currentDate,
        parseInt(groupId),
        sessionId,
        eventCategory,
        eventLabel,
        eventAction,
        eventName,
        parseInt(eventValue)
    ]);
    // alasql("INSERT INTO activity VALUES (" + id + ", '" + currentDate + "', " + sessionId + ", '" + eventCategory + "', '" + eventAction + "', '" + eventLabel + "', " + eventValue + ")");

}; // end insert
