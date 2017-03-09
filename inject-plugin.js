tinymce.PluginManager.add('inject', function(editor, url) {

	$("body").wrapInner("<div id='body-wrapper'></div>");
	$("body").append("<iframe id='inject' style='position: absolute;top: 0;right: 0; width: 300px; display: none; border-top: 0; border-bottom: 0;' src='about:blank'></iframe>");
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
			if (document.getElementById("inject").className.search("active") == -1) {
				document.getElementById("body-wrapper").className += ' active';
				document.getElementById("inject").className += ' active';
				document.getElementById("inject").src = "inject/index.html";
			} else {
				document.getElementById("inject").className = document.getElementById("inject").className.replace(" active" , "");
				document.getElementById("inject").src = "about:blank";
				document.getElementById("body-wrapper").className = document.getElementById("body-wrapper").className.replace(" active" , "") ;
			}
		}
	});
});