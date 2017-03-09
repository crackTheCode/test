 

(function($, inject, undefined) {

    inject.google = {
        insertTextIntoDoc: function(content, url, options) {
          var o = _.extend({
              successCallback: function() {},
              errorCallback: function() {}
          }, options);
          google.script.run
              .withSuccessHandler(
                  function() {
                    console.log('success: insertTextIntoDoc');
                    if (o.successCallback && typeof o.successCallback === "function") {
                        o.successCallback()
                    }
                  })
              .withFailureHandler(
                  function(msg) {
                    console.log('failed: insertTextIntoDoc, ' + msg);
                    if (o.errorCallback && typeof o.errorCallback === "function") {
                        o.errorCallback()
                    }
                  })
              .withUserObject(this)
              .onInsertSelectedText(content, url);
        },
        getSelectedText: function(options) {
          var o = _.extend({
              successCallback: function() {},
              errorCallback: function() {}
          }, options);
          google.script.run
              .withSuccessHandler(
                function(output) {
                  console.log('withSuccessHandler: output ' + output);
                  if (o.successCallback && typeof o.successCallback === "function") {
                      o.successCallback(output)
                  }
                })
              .withFailureHandler(
                function(msg) {
                  console.log('withFailureHandler:msg ' + msg);
                  if (o.errorCallback && typeof o.errorCallback === "function") {
                      o.errorCallback()
                  }
                })
              .withUserObject(this)
              .onGetSelectedText();
        },
        openArticleDialog: function(queryTermsOriginal, queryTermsExpanded, isWiki, content, pages, options) {
          var o = _.extend({
              successCallback: function() {},
              errorCallback: function() {}
          }, options);
          google.script.run
              // .withSuccessHandler(
              //   function() {
              //     if (o.successCallback && typeof o.successCallback === "function") {
              //         o.successCallback()
              //     }
              //   })
              // .withFailureHandler(
              //   function(msg) {
              //     console.log('withFailureHandler:msg ' + msg);
              //     if (o.errorCallback && typeof o.errorCallback === "function") {
              //         o.errorCallback()
              //     }
              //   })
              // .withUserObject(this)
              .onOpenArticleDialog(queryTermsOriginal, queryTermsExpanded, isWiki, content, pages);
        },
        setDialogWidth: function(dialogWidth, options) {
          google.script.host.setWidth(dialogWidth);
        }
    }


    inject.events.on("insertTextIntoDoc", function(event, content, url, options) {
        inject.google.insertTextIntoDoc(content, url, options);
    })

    inject.events.on("getSelectedText", function(event, options) {
        inject.google.getSelectedText(options);
    })

    inject.events.on("openArticleDialog", function(event, queryTermsOriginal, queryTermsExpanded, isWiki, content, pages, options) {
        inject.google.openArticleDialog(queryTermsOriginal, queryTermsExpanded, isWiki, content, pages, options);
    })

    inject.events.on("setDialogWidth", function(event, dialogWidth, options) {
        inject.google.setDialogWidth(dialogWidth, options);
    })

}(jQuery, inject))

 
