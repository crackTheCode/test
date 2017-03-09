 

/**
 * Check a href for an anchor. If exists, and in document, scroll to it.
 * If href argument ommited, assumes context (this) is HTML Element,
 * which will be the case when invoked by jQuery after an event
 */
function scroll_if_anchor(href) {
    href = typeof(href) == "string" ? href : $(this).attr("href");

    // You could easily calculate this dynamically if you prefer
    var fromTop = 50;

    // If our Href points to a valid, non-empty anchor, and is on the same page (e.g. #foo)
    // Legacy jQuery and IE7 may have issues: http://stackoverflow.com/q/1593174
    if(href.indexOf("#") == 0) {
        var $target = $(href);

        // Older browser without pushState might flicker here, as they momentarily
        // jump to the wrong position (IE < 10)
        if($target.length) {
            $('html, body').animate({ scrollTop: $target.offset().top - fromTop });
            if(history && "pushState" in history) {
                history.pushState({}, document.title, window.location.pathname + href);
                return false;
            }
        }
    }
}

function getPageId(dimensionPage, n) {
  return 'article-page-' + dimensionPage + '-' + n;
}

function getDocumentHeight() {
  var body = document.body;
  var html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

function getScrollTop() {
  return window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}


function getArticlePage(page) {
  var articlesPerPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_NUMBER_RESULTS_DIMENSION_PER_PAGE;

  var pageElement = document.createElement('ul');
  pageElement.id = getPageId(dimensionPage, page);
  pageElement.className = 'article-list__page rss-items';

  while (articlesPerPage-- && counter < max) {
    pageElement.appendChild(articleArray[counter]);
    counter++;
  }

  return pageElement;
}

function addPaginationPage(page) {
  var pageLink = document.createElement('a');
  pageLink.href = '#' + getPageId(dimensionPage, page);
  pageLink.innerHTML = page;
  // pageLink.innerHTML = page + '-' + counter + '-' + max;

  var listItem = document.createElement('li');
  listItem.className = 'article-list__pagination__item';
  listItem.id = getPageId(dimensionPage, page);
  listItem.appendChild(pageLink);

  articleListPagination.appendChild(listItem);

  if (page === 2) {
    articleListPagination.classList.remove('article-list__pagination--inactive');
  }
}

function fetchPage(page) {
  articleList.appendChild(getArticlePage(page));
}

function addPage(page) {
  fetchPage(page);
  addPaginationPage(page);
}

// When our page loads, check to see if it contains and anchor
scroll_if_anchor(window.location.hash);
// Intercept all anchor clicks
$("body").on("click", "a", scroll_if_anchor);


var articleArray = [];
var articleList;
var articleListPagination;
var page = 0;
var counter = 0;
var max = 0;
var dimensionPage;


window.onscroll = function () {
  if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
  if (counter < max) {
    addPage(++page);
  }
};


 
