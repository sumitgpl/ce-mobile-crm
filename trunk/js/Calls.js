function SugarCrmGetCallsListFromServer(offset) {
    var existingList = $('#AllCallsListDiv li');
    if ((existingList.length === 0) || (CallsListCurrentOffset !== offset)) {
        
        CallsListCurrentOffset = offset;
        $.get(CurrentServerAddress + '/service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","query":"","order_by":"date_start desc","offset":' + offset + ',"select_fields":"","link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var callsList = jQuery.parseJSON(data);
                if ((callsList.name !== undefined) && (callsList.name === "Invalid Session ID")) {
                    SugarSessionId = '';
                    $.mobile.changePage('#LoginPage');
                }
                if ((callsList != undefined) && (callsList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (callsList.result_count === 0) {
                        CallsListCurrentOffset = (CallsListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (callsList.next_offset === 0) {
                            CallsListCurrentOffset = 0;
                        }
                    }
                    if ((callsList.next_offset == 0) || (callsList.result_count == 0))
                    {
                        alert('There are no more records in that direction');
                    } else {
                        $('#AllCallsListDiv li').remove();

                        var intCalls = 0;
                        for(intCalls=0;intCalls<=callsList.entry_list.length;intCalls++)
                        {
                            if (callsList.entry_list[intCalls] != undefined) {
                                var call = callsList.entry_list[intCalls];
                                var listItem = $("<li/>");
                                var callDateTime = "<p>" + call.name_value_list.date_start.value + "</p>";
                                var header = "<h4>" + call.name_value_list.name.value + "</h4>";
                                var callParagraph = "<p>" + call.name_value_list.direction.value + " " + call.name_value_list.status.value + "</p>";
                                var callLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": call.id,
                                    click: function() {
                                        CurrentCallId = $(this).data("identity");
                                        $.mobile.changePage('#ViewCallDetailsPage');
                                        
                                        SugarCrmGetCallDetails();
                                    }
                                });
                                callLink.append( header );
                                callLink.append(callParagraph);
                                callLink.append(callDateTime);
                                listItem.append( callLink );
                                $('#AllCallsListDiv').append(listItem);
                            }
                        }
                        $('#AllCallsListDiv').listview("refresh");
                        CallsListNextOffset = callsList.next_offset;
                        var newCallsPreviousOffset = (offset - RowsPerPageInListViews);
                        CallsListPrevOffset = newCallsPreviousOffset;
                    }
                }
            }
            
        });
    }
}

function SugarCrmGetCallDetails() {
    
    $('#CallNameH1').html('');
    $('#CallSubjectP').text('');
    $('#ViewCallDetailsPageDetailsList li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","id":"' + CurrentCallId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var callsList = jQuery.parseJSON(data);
            if ((callsList.name !== undefined) && (callsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callsList != undefined) && (callsList.entry_list != undefined)) {
                if (callsList.entry_list[0] != undefined) {
                    var call = callsList.entry_list[0];
                    /* Set the Main Header and Paragraph */
                    $('#CallNameH1').html(call.name_value_list.name.value);
                    var callPText =  call.name_value_list.direction.value + " " + call.name_value_list.status.value;
                    $('#CallSubjectP').text(callPText);
                    /* Append the first divider */
                    $('#ViewCallDetailsPageDetailsList').append("<li data-role=\"list-divider\">Call Overview</li>");
                    if ((call.name_value_list.date_start !== undefined) && (call.name_value_list.date_start.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Start Date/Time</p><h4>" + call.name_value_list.date_start.value + "</h4></li>");
                    }

                    if ((call.name_value_list.duration_hours !== undefined) && (call.name_value_list.duration_hours.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Duration</p><h4>" + call.name_value_list.duration_hours.value + "h&nbsp;" + call.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                    }

                    if ((call.name_value_list.description !== undefined) && (call.name_value_list.description.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Description</p><h4>" + call.name_value_list.description.value + "</h4></li>");
                    }
                    /* Record Information */
                    $('#ViewCallDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((call.name_value_list.assigned_user_name !== undefined) && (call.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + call.name_value_list.assigned_user_name.value +"</h4></li>");
                    }
                    if ((call.name_value_list.date_modified !== undefined) && (call.name_value_list.date_modified.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + call.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + call.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((call.name_value_list.date_entered !== undefined) && (call.name_value_list.date_entered.value !== "")) {
                        $('#ViewCallDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + call.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + call.name_value_list.created_by_name.value +"</h4></li>");
                    }
                    if ((call.name_value_list.parent_id !== undefined) && (call.name_value_list.parent_id.value !== "")) {
                        getCallParentDetails(call.name_value_list.parent_type.value,call.name_value_list.parent_id.value);
                    }
                    else {
                        $('#ViewCallDetailsPageDetailsList').listview("refresh");
                    }
                }
            }
        }
    });
    getCallRelatedContactsInsetList();
    //getCallRelatedUsersInsetList();
    getCallRelatedLeadsInsetList();
    getCallRelatedNotesInsetList();
}

function getCallParentDetails(callDetailsParentType,callDetailsParentId) {
    var parentInfo = "<h4>" + callDetailsParentType + ":&nbsp;";
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + callDetailsParentType + '","id":"' + callDetailsParentId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        var parentsList = jQuery.parseJSON(data);
        if ((parentsList.name !== undefined) && (parentsList.name === "Invalid Session ID")) {
            SugarSessionId = '';
            $.mobile.changePage('#LoginPage');
        }
        if ((parentsList != undefined) && (parentsList.entry_list != undefined)) {
            if (parentsList.entry_list[0] != undefined) {
                var parentItem = parentsList.entry_list[0];
                if ((parentItem.module_name == "Leads") || (parentItem.module_name == "Contacts")) {
                    parentInfo+=parentItem.name_value_list.first_name.value + " " + parentItem.name_value_list.last_name.value;
                }
                else {
                    parentInfo+=parentItem.name_value_list.name.value;
                }
            }
        }
        parentInfo+="</h4>";
        $('#ViewCallDetailsPageDetailsList').append("<li data-role=\"list-divider\">Related To</li>");
        $('#ViewCallDetailsPageDetailsList').append("<li>" + parentInfo + "</li>");
        $('#ViewCallDetailsPageDetailsList').listview("refresh");
    });
}

function getCallRelatedContactsInsetList() {
    $('#ViewCallDetailsPageContactsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewCallDetailsPageContactsListUl').append("<li data-role=\"list-divider\">Contacts</li>");
            var callContactsList = jQuery.parseJSON(data);
            if ((callContactsList.name !== undefined) && (callContactsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callContactsList != undefined) && (callContactsList.entry_list != undefined)) {
                if (callContactsList.entry_list.length>0)
                {
                    var intCallContact = 0;
                    for(intCallContact=0;intCallContact<=callContactsList.entry_list.length;intCallContact++)
                    {
                        if (callContactsList.entry_list[intCallContact] != undefined) {
                            var callConctact = callContactsList.entry_list[intCallContact];
                            var callContactListItem = $("<li/>");
                            var callContactHeader = "<h4>" + callConctact.name_value_list.first_name.value + "&nbsp;" + callConctact.name_value_list.last_name.value + "</h4>";
                            var callContactParagraph = "<p>" + callConctact.name_value_list.title.value + "</p>";

                            var callContactLink = $("<a/>", {
                                href: "#",
                                "data-identity": callConctact.id,
                                click: function() {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage('#ViewContactDetailsPage');
                                    
                                    SugarCrmGetContactDetails();
                                }
                            });
                            callContactLink.append( callContactHeader );
                            callContactLink.append(callContactParagraph);
                            callContactListItem.append( callContactLink );
                            $('#ViewCallDetailsPageContactsListUl').append(callContactListItem);
                        }
                    }
                }
                else {
                    var callContactEmptyListItem = $("<li/>");
                    var contactContactEmptyListHeader = "<h4>No Data</h4>";
                    callContactEmptyListItem.append(contactContactEmptyListHeader);
                    $('#ViewCallDetailsPageContactsListUl').append(callContactEmptyListItem);
                }
            }
            $('#ViewCallDetailsPageContactsListUl').listview("refresh");
        }
        
    });
}

function getCallRelatedUsersInsetList() {
    $('#ViewCallDetailsPageUsersListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"users","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewCallDetailsPageUsersListUl').append("<li data-role=\"list-divider\">Users</li>");
            var callUsersList = jQuery.parseJSON(data);
            if ((callUsersList.name !== undefined) && (callUsersList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callUsersList != undefined) && (callUsersList.entry_list != undefined)) {
                if (callUsersList.entry_list.length>0)
                {
                    var intCallUser = 0;
                    for(intCallUser=0;intCallUser<=callUsersList.entry_list.length;intCallUser++)
                    {
                        if (callUsersList.entry_list[intCallUser] != undefined) {
                            var callUser = callUsersList.entry_list[intCallUser];
                            var callUserListItem = $("<li/>");
                            var callUserHeader = "<h4>" + callUser.name_value_list.first_name.value + "&nbsp;" + callUser.name_value_list.last_name.value + "</h4>";
                            var callUserParagraph = "<p>" + callUser.name_value_list.title.value + "</p>";
                            callUserListItem.append(callUserHeader);
                            callUserListItem.append(callUserParagraph);
                            $('#ViewCallDetailsPageUsersListUl').append(callUserListItem);
                        }
                    }
                }
                else {
                    var callUserEmptyListItem = $("<li/>");
                    var callUserEmptyListHeader = "<h4>No Data</h4>";
                    callUserEmptyListItem.append(callUserEmptyListHeader);
                    $('#ViewCallDetailsPageUsersListUl').append(callUserEmptyListItem);
                }
            }
            $('#ViewCallDetailsPageUsersListUl').listview("refresh");
        }
        
    });
}

function getCallRelatedLeadsInsetList() {
    $('#ViewCallDetailsPageLeadsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewCallDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
            var callLeadsList = jQuery.parseJSON(data);
            if ((callLeadsList.name !== undefined) && (callLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callLeadsList != undefined) && (callLeadsList.entry_list != undefined)) {
                if (callLeadsList.entry_list.length>0)
                {
                    var intCallLead = 0;
                    for(intCallLead=0;intCallLead<=callLeadsList.entry_list.length;intCallLead++)
                    {
                        if (callLeadsList.entry_list[intCallLead] != undefined) {
                            var callLead = callLeadsList.entry_list[intCallLead];
                            var callLeadListItem = $("<li/>");
                            var callLeadHeader = "<h4>" + callLead.name_value_list.first_name.value + " " + callLead.name_value_list.last_name.value + "</h4>";
                            var callLeadParagraph = '';
                            if (callLead.name_value_list.title != undefined) {
                                callLeadParagraph = "<p>" + callLead.name_value_list.title.value + "</p>";
                            } else {
                                callLeadParagraph = "<p></p>";
                            }
                            var callLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": callLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('#ViewLeadDetailsPage');
                                    
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            callLeadLink.append(callLeadHeader);
                            callLeadLink.append(callLeadParagraph);
                            callLeadListItem.append( callLeadLink );
                            $('#ViewCallDetailsPageLeadsListUl').append(callLeadListItem);
                        }
                    }
                }
                else {
                    var callLeadEmptyListItem = $("<li/>");
                    var callLeadEmptyListHeader = "<h4>No Data</h4>";
                    callLeadEmptyListItem.append(callLeadEmptyListHeader);
                    $('#ViewCallDetailsPageLeadsListUl').append(callLeadEmptyListItem);
                }
            }
            $('#ViewCallDetailsPageLeadsListUl').listview("refresh");
        }
    });
}

function getCallRelatedNotesInsetList() {
    $('#ViewCallDetailsPageNotesListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"notes","related_module_query":"","related_fields":["id","name","description","date_entered"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewCallDetailsPageNotesListUl').append("<li data-role=\"list-divider\">Notes</li>");
            var callNotesList = jQuery.parseJSON(data);
            if ((callNotesList.name !== undefined) && (callNotesList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callNotesList != undefined) && (callNotesList.entry_list != undefined)) {
                if (callNotesList.entry_list.length>0)
                {
                    var intNoteLead = 0;
                    for(intNoteLead=0;intNoteLead<=callNotesList.entry_list.length;intNoteLead++)
                    {
                        if (callNotesList.entry_list[intNoteLead] != undefined) {
                            var callNote = callNotesList.entry_list[intNoteLead];
                            var callNoteListItem = $("<li/>");
                            var callLeadHeader = "<h4>" + callNote.name_value_list.name.value + "</h4>";
                            var callNoteParagraph = '';
                            if (callNote.name_value_list.description != undefined) {
                                callNoteParagraph = "<p>" + callNote.name_value_list.description.value + "</p>";
                            } else {
                                callNoteParagraph = "<p></p>";
                            }
                            var callNoteLink = $("<a/>", {
                                href: "#",
                                "data-identity": callNote.id,
                                click: function() {
                                    CurrentNoteId = $(this).data("identity");
                                    $.mobile.changePage('#ViewNoteDetailsPage');
                                    
                                    SugarCrmGetNoteDetails();
                                }
                            });
                            callNoteLink.append(callLeadHeader);
                            callNoteLink.append(callNoteParagraph);
                            callNoteListItem.append(callNoteLink);
                            $('#ViewCallDetailsPageNotesListUl').append(callNoteListItem);
                        }
                    }
                }
                else {
                    var callLeadEmptyListItem = $("<li/>");
                    var callLeadEmptyListHeader = "<h4>No Data</h4>";
                    callLeadEmptyListItem.append(callLeadEmptyListHeader);
                    $('#ViewCallDetailsPageNotesListUl').append(callLeadEmptyListItem);
                }
            }
            $('#ViewCallDetailsPageNotesListUl').listview("refresh");
        }
        
    });
}
