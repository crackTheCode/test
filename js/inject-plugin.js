(function($, Inject, options, undefined) {

	window.TinyMceInjectPlugin = function () {

		if (Inject) {
			throw new Error("No Inject object defined");
		}

		options = options || {};
		options.wrapper = options.wrapper || "[data-inject]";

		if (!$('div' + options.wrapper).length) {
			throw new Error("No Inject div found");
		}

		tinymce.PluginManager.add('inject', function(editor, url) {

			$("body").wrapInner("<div id='inject-body-wrapper'></div>");
			$("body").append($('div' + options.wrapper).detach());

			$(function(){
				$(document).on('inject.getSelectedText', function(event, callbacks) {
					var text = tinymce.activeEditor.selection.getContent({format : 'text'});
					if (callbacks) {
						if (text) {
							callbacks.successCallback && callbacks.successCallback(text);
						} else {
							callbacks.errorCallback && callbacks.errorCallback(new Error("No text selected"));
						}
					}
				});
			});

			// Add a button that opens a window
			editor.addButton('inject', {
				text: 'INJECT',
				icon: false,
				onclick: function() {
					if ($('div' + options.wrapper).hasClass("inject-active")) {
						$('div' + options.wrapper).removeClass("inject-active");
						$('#inject-body-wrapper').removeClass("inject-active");
					} else {
						$('div' + options.wrapper).addClass("inject-active");
						$('#inject-body-wrapper').addClass("inject-active");
					}
				}
			});
		});
		
	}

})(jQuery, null, {});

