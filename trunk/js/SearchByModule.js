function SearchByModule(moduleName,searchString,startingIndex,maxResults) {
$.get(CurrentServerAddress + '/service/v2/rest.php', {
	method: "search_by_module",
	input_type: "JSON",
        response_type: "JSON",
	rest_data: '{"session":"' + SugarSessionId + '",' +
		'"search_string":"' + searchString + '",' +
		'"modules":"' + moduleName + '",' +
                '"offset":"' + maxResults + '",' +
                '"max_results":"' + maxResults + '"}'
        }, function(data) {
            if (data !== undefined) {
                var searchResults = jQuery.parseJSON(data);
            }
        });
}