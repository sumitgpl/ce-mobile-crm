function SearchByModule() {
    $('#SearchResultsListUl li').remove();
    var searchByModulesString = "[";
    $('#AvailableSearchModulesFieldSet input').each(function() {
        var target = $(this);
        if ($(target).is(":checked")) {
            searchByModulesString+='"' + target.attr('value') + '",';
        }
    });
    searchByModulesString = searchByModulesString.substring(0,(searchByModulesString.length - 1));
    searchByModulesString+="]";
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "search_by_module",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"search_string":"' + $('#ModuleSearchTerm').val() + '",' +
        '"modules":' + searchByModulesString + ',' +
        '"offset":0,' +
        '"max_results":999}'
    }, function(data) {
        if (data !== undefined) {
            var itemResultCount = 0;
            var searchResults = jQuery.parseJSON(data);
            if ((searchResults === undefined) || (searchResults.entry_list.length == 0)) {
                var noResults = $("<li/>");
                noResults.append("<p>" + RES_NOTIFICATION + "</p>");
                $('#SearchResultsListUl').append(noResults);
                $('#SearchResultsListUl').listview("refresh");
            } else {
                var intSearchResults = 0;
                for(intSearchResults=0;intSearchResults<=searchResults.entry_list.length;intSearchResults++)
                {
                    if (searchResults.entry_list[intSearchResults] !== undefined) {
                        var searchResult = searchResults.entry_list[intSearchResults];
                        
                        if ((searchResult.records !== undefined) && (searchResult.records.length > 0)) {
                            itemResultCount++;
                            $('#SearchResultsListUl').append("<li data-role=\"list-divider\">" + searchResult.name + "</li>");
                            var intItemResults = 0;
                            for(intItemResults=0;intItemResults<searchResult.records.length;intItemResults++) {
                                var result = searchResult.records[intItemResults];
                                $('#SearchResultsListUl').append("<li>" + result.name.value + "</li>");
                            }

                        }
                    }
                }
                if (itemResultCount == 0) {
                    var noResults = $("<li/>");
                    noResults.append("<p>" + RES_NOTIFICATION + "</p>");
                    $('#SearchResultsListUl').append(noResults);
                    $('#SearchResultsListUl').listview("refresh");
                }
                $('#SearchResultsListUl').listview("refresh");
            }
        } else {
            var noResults = $("<li/>");
            noResults.append("<p>" + RES_NOTIFICATION + "</p>");
            $('#SearchResultsListUl').append(noResults);
            $('#SearchResultsListUl').listview("refresh");
        }
    });
}

function getAvailableSearchModules() {
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_available_modules",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '"}'
    }, function(data) {
        if (data !== undefined) {
            var availableModulesData = jQuery.parseJSON(data);
            if ((availableModulesData !== undefined) && (availableModulesData.modules !== undefined)) {
                if ($.inArray("Accounts", availableModulesData.modules)) {
                    var accountSearchModuleOption = $("<input/>", {
                        id: "SearchModuleAccount",
                        "value": "Accounts",
                        "name": "SearchModuleAccount",
                        "type": "checkbox",
                        "class": "custom"
                    });
                    var accountSearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleAccount",
                        text: RES_ACCOUNTS_LABEL
                    });
                    $('#AvailableSearchModulesFieldSet').append(accountSearchModuleOption);
                    $('#AvailableSearchModulesFieldSet').append(accountSearchModuleOptionlabel);
                    $("input[type='checkbox']").checkboxradio();
                }

                if ($.inArray("Calls", availableModulesData.modules)) {
                    var callsSearchModuleOption = $("<input/>", {
                        id: "SearchModuleCalls",
                        "value": "Calls",
                        "name": "SearchModuleCalls",
                        "type": "checkbox",
                        "class": "custom"
                    });
                    var callsSearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleCalls",
                        text: RES_CALLS_LABEL
                    });
                    $('#AvailableSearchModulesFieldSet').append(callsSearchModuleOption);
                    $('#AvailableSearchModulesFieldSet').append(callsSearchModuleOptionlabel);
                    $("input[type='checkbox']").checkboxradio();
                }

                if ($.inArray("Contacts", availableModulesData.modules)) {
                    var conctactsSearchModuleOption = $("<input/>", {
                        id: "SearchModuleContacts",
                        "value": "Contacts",
                        "name": "SearchModuleContacts",
                        "type": "checkbox",
                        "class": "custom"
                    });
                    var contactsSearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleContacts",
                        text: RES_CALLS_LABEL
                    });
                    $('#AvailableSearchModulesFieldSet').append(conctactsSearchModuleOption);
                    $('#AvailableSearchModulesFieldSet').append(contactsSearchModuleOptionlabel);
                    $("input[type='checkbox']").checkboxradio();
                }
                if ($.inArray("Opportunities", availableModulesData.modules)) {
                    var OpportunitySearchModuleOption = $("<input/>", {
                        id: "SearchModuleOpportunities",
                        "value": "Opportunities",
                        "name": "SearchModuleOpportunities",
                        "type": "checkbox",
                        "class": "custom"
                    });
                    var OpportunitySearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleOpportunities",
                        text: RES_OPPORTUNITIES_LABEL
                    });
                    $('#AvailableSearchModulesFieldSet').append(OpportunitySearchModuleOption);
                    $('#AvailableSearchModulesFieldSet').append(OpportunitySearchModuleOptionlabel);
                    $("input[type='checkbox']").checkboxradio();
                }
                if ($.inArray("Leads", availableModulesData.modules)) {
                    var leadsSearchModuleOption = $("<input/>", {
                        id: "SearchModuleLeads",
                        "value": "Contacts",
                        "name": "SearchModuleLeads",
                        "type": "checkbox",
                        "class": "custom"
                    });
                    var leadsSearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleLeads",
                        text: RES_LEADS_LABEL
                    });
                    $('#AvailableSearchModulesFieldSet').append(leadsSearchModuleOption);
                    $('#AvailableSearchModulesFieldSet').append(leadsSearchModuleOptionlabel);
                    $("input[type='checkbox']").checkboxradio();
                }
            }
        }
    });
}