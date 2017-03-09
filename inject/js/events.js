 

(function($, inject, undefined) {

    inject.events = {
        emit: function(topic, args) {
            $(inject).trigger("inject." + topic, args);
		    parent.$(parent.document).trigger("inject." + topic, args); 
        },
        on: function(topic, callback) {
            $(inject).on("inject." + topic, callback);
        }

    }

}(jQuery, inject))

 
