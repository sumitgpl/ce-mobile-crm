function SugarCrmGetOpportunitiesListFromServer(offset) {
    var existingList = $('#AllOpportunitiesListDiv li');
    if ((existingList.length === 0) || (OpportunitiesListCurrentOffset !== offset)) {
        
        OpportunitiesListCurrentOffset = offset;
        $.get('../service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","query":"","order_by":"amount desc","offset":' + offset + ',"select_fields":"","link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var opportunitiesList = jQuery.parseJSON(data);
            if ((opportunitiesList.name !== undefined) && (opportunitiesList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
                if ((opportunitiesList != undefined) && (opportunitiesList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (opportunitiesList.result_count === 0) {
                        OpportunitiesListCurrentOffset = (OpportunitiesListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (opportunitiesList.next_offset === 0) {
                            OpportunitiesListCurrentOffset = 0;
                        }
                    }
                    if ((opportunitiesList.next_offset == 0) || (opportunitiesList.result_count == 0))
                    {
                        alert('There are no more records in that direction');
                    }
                    else {
                        $('#AllOpportunitiesListDiv li').remove();
                        var intOpportunity = 0;
                        for(intOpportunity=0;intOpportunity<=opportunitiesList.entry_list.length;intOpportunity++)
                        {
                            if (opportunitiesList.entry_list[intOpportunity] != undefined) {
                                var opportunity = opportunitiesList.entry_list[intOpportunity];
                                var listItem = $("<li/>");
                                var header = "<h4>" + opportunity.name_value_list.name.value + "</h4>";
                                var opportunityAmountParagraph = $("<p/>");
                                /* This should handle different currencies in the list view but for some reason they don't return sysmbols */
                                if ((opportunity.name_value_list.amount !== undefined) && (opportunity.name_value_list.amount.value !== "")) {
                                    if ((opportunity.name_value_list.currency_name !== undefined) && (opportunity.name_value_list.currency_name.value !== ""))
                                    {
                                        opportunityAmountParagraph.append(opportunity.name_value_list.currency_symbol.value);
                                        opportunityAmountParagraph.append(parseFloat(opportunity.name_value_list.amount.value).toFixed(2));
                                    }
                                    else {
                                        opportunityAmountParagraph.append("$");
                                        opportunityAmountParagraph.append(parseFloat(opportunity.name_value_list.amount_usdollar.value).toFixed(2));
                                    }
                                }
                                if ((opportunity.name_value_list.sales_stage !== undefined) && (opportunity.name_value_list.sales_stage.value !== ""))
                                {
                                    opportunityAmountParagraph.append(" - " + opportunity.name_value_list.sales_stage.value);
                                }
                                var opportunityLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": opportunity.id,
                                    click: function() {
                                        CurrentOpportunityId = $(this).data("identity");
                                        $.mobile.changePage('#ViewOpportunityDetailsPage');
                                        
                                        SugarCrmGetOpportunityDetails();
                                    }
                                });
                                opportunityLink.append( header );
                                opportunityLink.append(opportunityAmountParagraph);
                                listItem.append( opportunityLink );
                                $('#AllOpportunitiesListDiv').append(listItem);
                            }
                        }
                        $('#AllOpportunitiesListDiv').listview("refresh");
                        OpportunitiesListNextOffset = opportunitiesList.next_offset;
                        var newOpportunityPreviousOffset = (offset - RowsPerPageInListViews);
                        OpportunitiesListPrevOffset = newOpportunityPreviousOffset;
                    }
                }
            }
            
        });
    }
}

function SugarCrmGetOpportunityDetails() {
    
    $('#OpportunityNameH1').html('');
    $('#OpportunityDescriptionP').text('');
    $('#ViewOpportunityDetailsPageDetailsList li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId +
        '","module_name":"Opportunities","id":"' + CurrentOpportunityId +
        '","select_fields":"",' +
        '"link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var opportunitiesList = jQuery.parseJSON(data);
            if ((opportunitiesList.name !== undefined) && (opportunitiesList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunitiesList != undefined) && (opportunitiesList.entry_list != undefined)) {
                if (opportunitiesList.entry_list[0] != undefined) {
                    var opportunity = opportunitiesList.entry_list[0];
                    $('#OpportunityNameH1').html(opportunity.name_value_list.name.value);
                    $('#OpportunityDescriptionP').text(opportunity.name_value_list.account_name.value);
                    $('#ViewOpportunityDetailsPageDetailsList').append("<li data-role=\"list-divider\">Opportunity Information</li>");
                    /* The amount list item with currency symbole */
                    if ((opportunity.name_value_list.amount !== undefined) && (opportunity.name_value_list.amount.value !== "")) {
                        var oppAmountLi = $("<li/>");
                        var opportunityAmountParagraph = $("<p/>");
                        opportunityAmountParagraph.append("<br />Opportunity Amount (");
                        var oppAmountHeader = $("<h4/>");
                        if ((opportunity.name_value_list.currency_name !== undefined) && (opportunity.name_value_list.currency_name.value !== ""))
                        {
                            opportunityAmountParagraph.append(opportunity.name_value_list.currency_name.value + ")");
                            oppAmountHeader.append(opportunity.name_value_list.currency_symbol.value);
                            oppAmountHeader.append(parseFloat(opportunity.name_value_list.amount.value).toFixed(2));
                        }
                        else {
                            opportunityAmountParagraph.append("USD)");
                            oppAmountHeader.append("$");
                            oppAmountHeader.append(parseFloat(opportunity.name_value_list.amount_usdollar.value).toFixed(2));
                        }
                        opportunityAmountParagraph.append(oppAmountHeader);
                        oppAmountLi.append(opportunityAmountParagraph);
                        oppAmountLi.append(oppAmountHeader);
                        $('#ViewOpportunityDetailsPageDetailsList').append(oppAmountLi);
                    }
                    if ((opportunity.name_value_list.date_closed !== undefined) && (opportunity.name_value_list.date_closed.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Expected Close Date</p><h4>" + opportunity.name_value_list.date_closed.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.sales_stage !== undefined) && (opportunity.name_value_list.sales_stage.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Sales Stage</p><h4>" + opportunity.name_value_list.sales_stage.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.opportunity_type !== undefined) && (opportunity.name_value_list.opportunity_type.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Type</p><h4>" + opportunity.name_value_list.opportunity_type.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.probability !== undefined) && (opportunity.name_value_list.probability.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Probability(%)</p><h4>" + opportunity.name_value_list.probability.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.lead_source !== undefined) && (opportunity.name_value_list.lead_source.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Lead Source</p><h4>" + opportunity.name_value_list.lead_source.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.next_step !== undefined) && (opportunity.name_value_list.next_step.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Next Step</p><h4>" + opportunity.name_value_list.next_step.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.description !== undefined) && (opportunity.name_value_list.description.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Description</p><h4>" + opportunity.name_value_list.description.value + "</h4></li>");
                    }
                    $('#ViewOpportunityDetailsPageDetailsList').append("<li data-role=\"list-divider\">Opportunity Information</li>");
                    if ((opportunity.name_value_list.assigned_user_name !== undefined) && (opportunity.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + opportunity.name_value_list.assigned_user_name.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.date_modified !== undefined) && (opportunity.name_value_list.date_modified.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + opportunity.name_value_list.date_modified.value + "</h4></li>");
                    }
                    if ((opportunity.name_value_list.date_entered !== undefined) && (opportunity.name_value_list.date_entered.value !== "")) {
                        $('#ViewOpportunityDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + opportunity.name_value_list.date_entered.value + " by " + opportunity.name_value_list.created_by_name.value + "</h4></li>");
                    }   
                }
            }
            $('#ViewOpportunityDetailsPageDetailsList').listview("refresh");
        }
    });
    getOpportunityRelatedContactsInsetList();
    getOpportunityRelatedLeadsInsetList();
    getOpportunityRelatedCallsInsetList();
    getOpportunityRelatedMeetingsInsetList();
    getOpportunityRelatedTasksInsetList();
}

function getOpportunityRelatedContactsInsetList() {
    
    $('#ViewOpportunityDetailsPageContactsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' +
        CurrentOpportunityId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewOpportunityDetailsPageContactsListUl li').remove();
            var opportunityContactsList = jQuery.parseJSON(data);
            if ((opportunityContactsList.name !== undefined) && (opportunityContactsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunityContactsList != undefined) && (opportunityContactsList.entry_list != undefined)) {
                $('#ViewOpportunityDetailsPageContactsListUl').append("<li data-role=\"list-divider\">Contacts</li>");
                if (opportunityContactsList.entry_list.length>0)
                {
                    var intOpportunityContact = 0;
                    for(intOpportunityContact=0;intOpportunityContact<=opportunityContactsList.entry_list.length;intOpportunityContact++)
                    {
                        if (opportunityContactsList.entry_list[intOpportunityContact] != undefined) {
                            var opportunityConctact = opportunityContactsList.entry_list[intOpportunityContact];
                            var opportunityContactListItem = $("<li/>");
                            var opportunityContactHeader = "<h4 class=\"contactName\">" + opportunityConctact.name_value_list.first_name.value + "&nbsp;" + opportunityConctact.name_value_list["last_name"].value + "</h4>";
                            var opportunityContactParagraph = "<p>" + opportunityConctact.name_value_list.title.value + "</p>";

                            var opportunityContactLink = $("<a/>", {
                                href: "#",
                                "data-identity": opportunityConctact.id,
                                click: function() {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage('#ViewContactDetailsPage');
                                    
                                    SugarCrmGetContactDetails();
                                }
                            });
                            opportunityContactLink.append( opportunityContactHeader );
                            opportunityContactLink.append(opportunityContactParagraph);
                            opportunityContactListItem.append( opportunityContactLink );
                            $('#ViewOpportunityDetailsPageContactsListUl').append(opportunityContactListItem);
                        }
                    }
                }
                else {
                    var opportunityContactEmptyListItem = $("<li/>");
                    var opportunityContactEmptyListHeader = "<h4>No Data</h4>";
                    opportunityContactEmptyListItem.append(opportunityContactEmptyListHeader);
                    $('#ViewOpportunityDetailsPageContactsListUl').append(opportunityContactEmptyListItem);
                }
            }
            $('#ViewOpportunityDetailsPageContactsListUl').listview("refresh");
        }
        
    });
}

function getOpportunityRelatedLeadsInsetList() {
    
    $('#ViewOpportunityDetailsPageLeadsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            var opportunityLeadsList = jQuery.parseJSON(data);
           if ((opportunityLeadsList.name !== undefined) && (opportunityLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunityLeadsList != undefined) && (opportunityLeadsList.entry_list != undefined)) {
                $('#ViewOpportunityDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
                if (opportunityLeadsList.entry_list.length>0)
                {
                    var intOpportunityLead = 0;
                    for(intOpportunityLead=0;intOpportunityLead<=opportunityLeadsList.entry_list.length;intOpportunityLead++)
                    {
                        if (opportunityLeadsList.entry_list[intOpportunityLead] != undefined) {
                            var opportunityLead = opportunityLeadsList.entry_list[intOpportunityLead];
                            var opportunityLeadListItem = $("<li/>");
                            var opportunityLeadHeader = "<h4>" + opportunityLead.name_value_list.first_name.value + " " + opportunityLead.name_value_list["last_name"].value + "</h4>";
                            var opportunityLeadParagraph = '';
                            if (opportunityLead.name_value_list.title != undefined) {
                                opportunityLeadParagraph = "<p>" + opportunityLead.name_value_list.title.value + "</p>";
                            } else {
                                opportunityLeadParagraph = "<p></p>";
                            }
                            var opportunityLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": opportunityLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('#ViewLeadDetailsPage');
                                    
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            opportunityLeadLink.append( opportunityLeadHeader );
                            opportunityLeadLink.append(opportunityLeadParagraph);
                            opportunityLeadListItem.append( opportunityLeadLink );
                            $('#ViewOpportunityDetailsPageLeadsListUl').append(opportunityLeadListItem);
                        }
                    }
                }
                else {
                    var opportunityLeadEmptyListItem = $("<li/>");
                    var opportunityLeadEmptyListHeader = "<h4>No Data</h4>";
                    opportunityLeadEmptyListItem.append(opportunityLeadEmptyListHeader);
                    $('#ViewOpportunityDetailsPageLeadsListUl').append(opportunityLeadEmptyListItem);
                }
            }
            $('#ViewOpportunityDetailsPageLeadsListUl').listview("refresh");
        }
        
    });
}

function getOpportunityRelatedCallsInsetList() {
    
    $('#ViewOpportunityDetailsPageCallsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Opportunities",' +
        '"module_id":"' + CurrentOpportunityId + '",' +
        '"link_field_name":"calls",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            var opportunityCallsList = jQuery.parseJSON(data);
           if ((opportunityCallsList.name !== undefined) && (opportunityCallsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunityCallsList != undefined) && (opportunityCallsList.entry_list != undefined)) {
                $('#ViewOpportunityDetailsPageCallsListUl').append("<li data-role=\"list-divider\">Calls</li>");
                if (opportunityCallsList.entry_list.length>0)
                {
                    var intOpportunityCall = 0;
                    for(intOpportunityCall=0;intOpportunityCall<=opportunityCallsList.entry_list.length;intOpportunityCall++)
                    {
                        if (opportunityCallsList.entry_list[intOpportunityCall] != undefined) {
                            var opportunityCall = opportunityCallsList.entry_list[intOpportunityCall];
                            var opportunityCallListItem = $("<li/>");
                            var opportunityCallHeader = "<h4>" + opportunityCall.name_value_list.name.value + "</h4>";
                            var opportunityCallParagraph = '';
                            if (opportunityCall.name_value_list.status != undefined) {
                                opportunityCallParagraph = "<p>" + opportunityCall.name_value_list.status.value;
                                if (opportunityCall.name_value_list.date_start != undefined) {
                                    opportunityCallParagraph+="<br/>" + opportunityCall.name_value_list.date_start.value;
                                }
                                opportunityCallParagraph+="</p>";
                            } else {
                                opportunityCallParagraph = "<p></p>";
                            }
                            var opportunityCallLink = $("<a/>", {
                                href: "#",
                                "data-identity": opportunityCall.id,
                                click: function() {
                                    CurrentCallId = $(this).data("identity");
                                    $.mobile.changePage('#ViewCallDetailsPage');
                                    
                                    SugarCrmGetCallDetails();
                                }
                            });
                            opportunityCallLink.append( opportunityCallHeader );
                            if (opportunityCall.name_value_list.status != undefined) {
                                opportunityCallLink.append(opportunityCallParagraph);
                            }
                            opportunityCallListItem.append( opportunityCallLink );
                            $('#ViewOpportunityDetailsPageCallsListUl').append(opportunityCallListItem);
                        }
                    }
                }
                else {
                    var opportunityCallEmptyListItem = $("<li/>");
                    var opportunityCallEmptyListHeader = "<h4>No Data</h4>";
                    opportunityCallEmptyListItem.append(opportunityCallEmptyListHeader);
                    $('#ViewOpportunityDetailsPageCallsListUl').append(opportunityCallEmptyListItem);
                }
            }
            $('#ViewOpportunityDetailsPageCallsListUl').listview("refresh");
        }
        
    });
}

function getOpportunityRelatedMeetingsInsetList() {
    
    $('#ViewOpportunityDetailsPageMeetingsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Opportunities",' +
        '"module_id":"' + CurrentOpportunityId + '",' +
        '"link_field_name":"meetings",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewOpportunityDetailsPageMeetingsListUl li').remove();
            var opportunityMeetingsList = jQuery.parseJSON(data);
           if ((opportunityMeetingsList.name !== undefined) && (opportunityMeetingsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunityMeetingsList != undefined) && (opportunityMeetingsList.entry_list != undefined)) {
                $('#ViewOpportunityDetailsPageMeetingsListUl').append("<li data-role=\"list-divider\">Meetings</li>");
                if (opportunityMeetingsList.entry_list.length>0)
                {
                    var intOpportunityMeeting = 0;
                    for(intOpportunityMeeting=0;intOpportunityMeeting<=opportunityMeetingsList.entry_list.length;intOpportunityMeeting++)
                    {
                        if (opportunityMeetingsList.entry_list[intOpportunityMeeting] != undefined) {
                            var opportunityMeeting = opportunityMeetingsList.entry_list[intOpportunityMeeting];
                            var opportunityMeetingListItem = $("<li/>");
                            var opportunityMeetingHeader = "<h4>" + opportunityMeeting.name_value_list.name.value + "</h4>";
                            var opportunityMeetingParagraph = '';
                            if (opportunityMeeting.name_value_list.status != undefined) {
                                opportunityMeetingParagraph = "<p>" + opportunityMeeting.name_value_list.status.value;
                                if (opportunityMeeting.name_value_list.date_start != undefined) {
                                    opportunityMeetingParagraph+="<br/>" + opportunityMeeting.name_value_list.date_start.value;
                                }
                                opportunityMeetingParagraph+="</p>";
                            } else {
                                opportunityMeetingParagraph = "<p></p>";
                            }

                            var opportunityMeetingLink = $("<a/>", {
                                href: "#",
                                "data-identity": opportunityMeeting.id,
                                click: function() {
                                    CurrentMeetingId = $(this).data("identity");
                                    $.mobile.changePage('#ViewMeetingDetailsPage');
                                    
                                    SugarCrmGetMeetingDetails();
                                }
                            });
                            opportunityMeetingLink.append( opportunityMeetingHeader );
                            opportunityMeetingLink.append(opportunityMeetingParagraph);
                            opportunityMeetingListItem.append( opportunityMeetingLink );
                            $('#ViewOpportunityDetailsPageMeetingsListUl').append(opportunityMeetingListItem);
                        }
                    }
                }
                else {
                    var opportunityMeetingEmptyListItem = $("<li/>");
                    var opportunityMeetingEmptyListHeader = "<h4>No Data</h4>";
                    opportunityMeetingEmptyListItem.append(opportunityMeetingEmptyListHeader);
                    $('#ViewOpportunityDetailsPageMeetingsListUl').append(opportunityMeetingEmptyListItem);
                }
            }
            $('#ViewOpportunityDetailsPageMeetingsListUl').listview("refresh");
        }
        
    });
}

function getOpportunityRelatedTasksInsetList() {
    
    $('#ViewOpportunityDetailsPageTasksListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Opportunities",' +
        '"module_id":"' + CurrentOpportunityId + '",' +
        '"link_field_name":"tasks",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewOpportunityDetailsPageTasksListUl li').remove();
            var opportunityTasksList = jQuery.parseJSON(data);
           if ((opportunityTasksList.name !== undefined) && (opportunityTasksList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((opportunityTasksList != undefined) && (opportunityTasksList.entry_list != undefined)) {
                $('#ViewOpportunityDetailsPageTasksListUl').append("<li data-role=\"list-divider\">Tasks</li>");
                if (opportunityTasksList.entry_list.length>0)
                {
                    var intOpportunityTask = 0;
                    for(intOpportunityTask=0;intOpportunityTask<=opportunityTasksList.entry_list.length;intOpportunityTask++)
                    {
                        if (opportunityTasksList.entry_list[intOpportunityTask] != undefined) {
                            var opportunityTask = opportunityTasksList.entry_list[intOpportunityTask];
                            var opportunityTaskListItem = $("<li/>");
                            var opportunityTaskHeader = "<h4>" + opportunityTask.name_value_list.name.value + "</h4>";
                            var opportunityTaskParagraph = '';
                            if (opportunityTask.name_value_list.status != undefined) {
                                opportunityTaskParagraph = "<p>" + opportunityTask.name_value_list.status.value;
                                if (opportunityTask.name_value_list.date_start != undefined) {
                                    opportunityTaskParagraph+="<br/>" + opportunityTask.name_value_list.date_start.value;
                                }
                                opportunityTaskParagraph+="</p>";
                            } else {
                                opportunityTaskParagraph = "<p></p>";
                            }

                            var opportunityTaskLink = $("<a/>", {
                                href: "#",
                                "data-identity": opportunityTask.id,
                                click: function() {
                                    CurrentTaskId = $(this).data("identity");
                                    $.mobile.changePage('#ViewTaskDetailsPage');
                                    
                                    SugarCrmGetTaskDetails();
                                }
                            });
                            opportunityTaskLink.append(opportunityTaskHeader);
                            opportunityTaskLink.append(opportunityTaskParagraph);
                            opportunityTaskListItem.append( opportunityTaskLink);
                            $('#ViewOpportunityDetailsPageTasksListUl').append(opportunityTaskListItem);
                        }
                    }
                }
                else {
                    var opportunityTaskEmptyListItem = $("<li/>");
                    var opportunityTaskEmptyListHeader = "<h4>No Data</h4>";
                    opportunityTaskEmptyListItem.append(opportunityTaskEmptyListHeader);
                    $('#ViewOpportunityDetailsPageTasksListUl').append(opportunityTaskEmptyListItem);
                }
            }
            $('#ViewOpportunityDetailsPageTasksListUl').listview("refresh");
        }
        
    });
}
