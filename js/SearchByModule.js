/* This method is called when the search is executed from the UI */
function SearchByModule() {
    $('#SearchResultsListUl li').remove();
    /* Build a list of modules to be searched based on selected values */
    var searchByModulesString = "[";
    $('#AvailableSearchModulesFieldSet input').each(function() {
        var target = $(this);
        if ($(target).is(":checked")) {
            searchByModulesString+='"' + target.attr('value') + '",';
        }
    });
    searchByModulesString = searchByModulesString.substring(0,(searchByModulesString.length - 1));
    searchByModulesString+="]";
    /* Now place the call to the search_by_module method in the REST API */
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
        /* Check the data that came back to see if it had results */
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
                                var resultLi = $('<li/>');
                                var result = searchResult.records[intItemResults];
                                var resultHeader = "<h4>" + result.name.value + "</h4>";
                                if (searchResult.name == "Accounts") {
                                    resultLi.attr('data-icon','flag');
                                    var accountLink = $('<a/>', {
                                        href: "#",
                                        "data-identity": result.id.value,
                                        click: function() {
                                            CurrentAccountId = $(this).data("identity");
                                            $.mobile.changePage('#ViewAccountDetailsPage');

                                            SugarCrmGetAccountDetails();
                                        }
                                    });
                                    accountLink.append(resultHeader);
                                    resultLi.append(accountLink);
                                } else {
                                    if (searchResult.name == "Contacts") {
                                        resultLi.attr('data-icon','person');
                                        var contactLink = $('<a/>', {
                                            href: "#",
                                            "data-identity": result.id.value,
                                            click: function() {
                                                CurrentContactId = $(this).data("identity");
                                                $.mobile.changePage('#ViewContactDetailsPage');
                                                SugarCrmGetContactDetails();
                                            }
                                        });
                                        contactLink.append(resultHeader);
                                        resultLi.append(contactLink);
                                    } else {
                                        if (searchResult.name == "Calls") {
                                            resultLi.attr('data-icon','phone');
                                            var callLink = $('<a/>', {
                                                href: "#",
                                                "data-identity": result.id.value,
                                                click: function() {
                                                    CurrentCallId = $(this).data("identity");
                                                    $.mobile.changePage('#ViewCallDetailsPage');
                                                    SugarCrmGetCallDetails();
                                                }
                                            });
                                            callLink.append(resultHeader);
                                            resultLi.append(callLink);
                                        } else {
                                            if (searchResult.name == "Opportunities") {
                                                resultLi.attr('data-icon','dollar');
                                                var opportunityLink = $('<a/>', {
                                                    href: "#",
                                                    "data-identity": result.id.value,
                                                    click: function() {
                                                        CurrentOpportunityId = $(this).data("identity");
                                                        $.mobile.changePage('#ViewOpportunityDetailsPage');
                                                        SugarCrmGetOpportunityDetails();
                                                    }
                                                });
                                                opportunityLink.append(resultHeader);
                                                resultLi.append(opportunityLink);
                                            } else {
                                                if (searchResult.name == "Leads") {
                                                    resultLi.attr('data-icon','person');
                                                    var leadLink = $('<a/>', {
                                                        href: "#",
                                                        "data-identity": result.id.value,
                                                        click: function() {
                                                            CurrentLeadId = $(this).data("identity");
                                                            $.mobile.changePage('#ViewLeadDetailsPage');
                                                            SugarCrmGetLeadDetails();
                                                        }
                                                    });
                                                    leadLink.append(resultHeader);
                                                    resultLi.append(leadLink);
                                                }
                                            }
                                        }
                                    }
                                }
                                $('#SearchResultsListUl').append(resultLi);
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
            }
            $('#SearchResultsListUl').listview("refresh");
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
               /* TODO: Change to be dynamic once all modules are supported */
               if ($.inArray("Accounts", availableModulesData.modules)) {
                    var accountSearchModuleOption = $("<input/>", {
                        id: "SearchModuleAccount",
                        "value": "Accounts",
                        "name": "SearchModuleAccount",
                        "type": "checkbox",
                        "class": "custom",
                        "checked":true,
                        "data-theme": "d"
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
                        "class": "custom",
                        "checked":true,
                        "data-theme": "d"
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
                        "class": "custom",
                        "checked":true,
                        "data-theme": "d"
                    });
                    var contactsSearchModuleOptionlabel = $("<label/>",{
                        "for": "SearchModuleContacts",
                        text: RES_CONTACTS_LABEL
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
                        "class": "custom",
                        "checked":true,
                        "data-theme": "d"
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
                        "value": "Leads",
                        "name": "SearchModuleLeads",
                        "type": "checkbox",
                        "class": "custom",
                        "checked":true,
                        "data-theme": "d"
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