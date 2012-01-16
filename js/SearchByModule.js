function SearchByModule() {
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "search_by_module",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"search_string":"' + $('#ModuleSearchTerm').val() + '",' +
        '"modules":"' + "" + '",' +
        '"offset":0,' +
        '"max_results":' + RowsPerPageInListViews + '}'
    }, function(data) {
        if (data !== undefined) {
            var searchResults = jQuery.parseJSON(data);
            if ((searchResults === undefined) || (searchResults.entry_list.length == 0)) {
                alert('Your search did not return any resutls');
            }
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