function SugarCrmGetMeetingsListFromServer(offset) {
    $.mobile.showPageLoadingMsg();
    var existingList = $('#AllMeetingsListDiv li');
    if ((existingList.length === 0) || (MeetingsListCurrentOffset !== offset)) {
        
        MeetingsListCurrentOffset = offset;
        $.get(CurrentServerAddress + '/service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","query":"","order_by":"date_start desc","offset":' + offset + ',"select_fields":"","link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var meetingsList = jQuery.parseJSON(data);
                if ((meetingsList.name !== undefined) && (meetingsList.name === "Invalid Session ID")) {
                    SugarSessionId = '';
                    $.mobile.changePage('#LoginPage');
                }
                if ((meetingsList != undefined) && (meetingsList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (meetingsList.result_count === 0) {
                        MeetingsListCurrentOffset = (MeetingsListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (meetingsList.next_offset === 0) {
                            MeetingsListCurrentOffset = 0;
                        }
                    }
                    if ((meetingsList.next_offset == 0) || (meetingsList.result_count == 0))
                    {
                        alert(RES_NO_RECORDS_TEXT);
                    } else {
                        $('#AllMeetingsListDiv li').remove();

                        var intMeetings = 0;
                        for(intMeetings=0;intMeetings<=meetingsList.entry_list.length;intMeetings++)
                        {
                            if (meetingsList.entry_list[intMeetings] != undefined) {
                                var meeting = meetingsList.entry_list[intMeetings];
                                var listItem = $("<li/>");
                                var header = "<h4>" + meeting.name_value_list.name.value + "</h4>";
                                var meetingParagraph = "<p>" + meeting.name_value_list.status.value + " " + meeting.name_value_list.date_start.value + "</p>";
                                var meetingLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": meeting.id,
                                    click: function() {
                                        CurrentMeetingId = $(this).data("identity");
                                        $.mobile.changePage('#ViewMeetingDetailsPage');
                                        
                                        SugarCrmGetMeetingDetails();
                                    }
                                });
                                meetingLink.append( header );
                                meetingLink.append(meetingParagraph);
                                listItem.append( meetingLink );
                                $('#AllMeetingsListDiv').append(listItem);
                            }
                        }
                        $('#AllMeetingsListDiv').listview("refresh");
                        MeetingsListNextOffset = meetingsList.next_offset;
                        var newMeetingsPreviousOffset = (offset - RowsPerPageInListViews);
                        MeetingsListPrevOffset = newMeetingsPreviousOffset;
                    }
                }
            }
            $.mobile.hidePageLoadingMsg();
        });
    } else { $.mobile.hidePageLoadingMsg(); }
}

function SugarCrmGetMeetingDetails() {
    
    $('#MeetingNameH1').html('');
    $('#MeetingSubjectP').text('');
    $('#ViewMeetingDetailsPageDetailsList li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","id":"' + CurrentMeetingId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var meetingsList = jQuery.parseJSON(data);
            if ((meetingsList.name !== undefined) && (meetingsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((meetingsList != undefined) && (meetingsList.entry_list != undefined)) {
                if (meetingsList.entry_list[0] != undefined) {
                    var meeting = meetingsList.entry_list[0];
                    /* Set the Main Header and Paragraph */
                    $('#MeetingNameH1').html(meeting.name_value_list.name.value);
                    var meetingPText =  meeting.name_value_list.status.value;
                    $('#MeetingSubjectP').text(meetingPText);
                    /* Append the first divider */
                    $('#ViewMeetingDetailsPageDetailsList').append("<li data-role=\"list-divider\">Meeting Overview</li>");
                    if ((meeting.name_value_list.date_start !== undefined) && (meeting.name_value_list.date_start.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Start Date/Time</p><h4>" + meeting.name_value_list.date_start.value + "</h4></li>");
                    }

                    if ((meeting.name_value_list.duration_hours !== undefined) && (meeting.name_value_list.duration_hours.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Duration</p><h4>" + meeting.name_value_list.duration_hours.value + "h&nbsp;" + meeting.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                    }

                    if ((meeting.name_value_list.description !== undefined) && (meeting.name_value_list.description.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Description</p><h4>" + meeting.name_value_list.description.value + "</h4></li>");
                    }
                    /* Record Information */
                    $('#ViewMeetingDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((meeting.name_value_list.assigned_user_name !== undefined) && (meeting.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + meeting.name_value_list.assigned_user_name.value +"</h4></li>");
                    }
                    if ((meeting.name_value_list.date_modified !== undefined) && (meeting.name_value_list.date_modified.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + meeting.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + meeting.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((meeting.name_value_list.date_entered !== undefined) && (meeting.name_value_list.date_entered.value !== "")) {
                        $('#ViewMeetingDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + meeting.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + meeting.name_value_list.created_by_name.value +"</h4></li>");
                    }
                    if ((meeting.name_value_list.parent_id !== undefined) && (meeting.name_value_list.parent_id.value !== "")) {
                        getMeetingParentDetails(meeting.name_value_list.parent_type.value,meeting.name_value_list.parent_id.value);
                    }
                    else {
                        $('#ViewMeetingDetailsPageDetailsList').listview("refresh");
                    }
                }
            }
        }
    });
    getMeetingRelatedContactsInsetList();
    //getMeetingRelatedUsersInsetList();
    getMeetingRelatedLeadsInsetList();
    getMeetingRelatedNotesInsetList();
}

function getMeetingParentDetails(meetingDetailsParentType,meetingDetailsParentId) {
    var parentInfo = "<h4>" + meetingDetailsParentType + ":&nbsp;";
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + meetingDetailsParentType + '","id":"' + meetingDetailsParentId + '","select_fields":"","link_name_to_fields_array":""}'
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
        $('#ViewMeetingDetailsPageDetailsList').append("<li data-role=\"list-divider\">Related To</li>");
        $('#ViewMeetingDetailsPageDetailsList').append("<li>" + parentInfo + "</li>");
        $('#ViewMeetingDetailsPageDetailsList').listview("refresh");
    });
}

function getMeetingRelatedContactsInsetList() {
    $('#ViewMeetingDetailsPageContactsListUl li').remove();
    if (SugarSessionId == '') {
        $.mobile.changePage('#HomePage');
    }
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {            
            var meetingContactsList = jQuery.parseJSON(data);
            if ((meetingContactsList.name !== undefined) && (meetingContactsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((meetingContactsList != undefined) && (meetingContactsList.entry_list != undefined)) {
                if (meetingContactsList.entry_list.length>0)
                {
                    $('#ViewMeetingDetailsPageContactsListUl').append("<li data-role=\"list-divider\">Contacts</li>");
                    var intMeetingContact = 0;
                    for(intMeetingContact=0;intMeetingContact<=meetingContactsList.entry_list.length;intMeetingContact++)
                    {
                        if (meetingContactsList.entry_list[intMeetingContact] != undefined) {
                            var meetingConctact = meetingContactsList.entry_list[intMeetingContact];
                            var meetingContactListItem = $("<li/>");
                            var meetingContactHeader = "<h4>" + meetingConctact.name_value_list.first_name.value + "&nbsp;" + meetingConctact.name_value_list.last_name.value + "</h4>";
                            var meetingContactParagraph = "<p>" + meetingConctact.name_value_list.title.value + "</p>";

                            var meetingContactLink = $("<a/>", {
                                href: "#",
                                "data-identity": meetingConctact.id,
                                click: function() {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage('#ViewContactDetailsPage');
                                    
                                    SugarCrmGetContactDetails();
                                }
                            });
                            meetingContactLink.append( meetingContactHeader );
                            meetingContactLink.append(meetingContactParagraph);
                            meetingContactListItem.append( meetingContactLink );
                            $('#ViewMeetingDetailsPageContactsListUl').append(meetingContactListItem);
                        }
                    }
                }              
            }
            $('#ViewMeetingDetailsPageContactsListUl').listview("refresh");
        }
        
    });
}

function getMeetingRelatedUsersInsetList() {
    $('#ViewMeetingDetailsPageUsersListUl li').remove();
    if (SugarSessionId == '') {
        $.mobile.changePage('#HomePage');
    }
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"users","related_module_query":"","related_fields":"","related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {            
            var meetingUsersList = jQuery.parseJSON(data);
            if ((meetingUsersList.name !== undefined) && (meetingUsersList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((meetingUsersList != undefined) && (meetingUsersList.entry_list != undefined)) {
                if (meetingUsersList.entry_list.length>0)
                {
                    $('#ViewMeetingDetailsPageUsersListUl').append("<li data-role=\"list-divider\">Users</li>");
                    var intMeetingUser = 0;
                    for(intMeetingUser=0;intMeetingUser<=meetingUsersList.entry_list.length;intMeetingUser++)
                    {
                        if (meetingUsersList.entry_list[intMeetingUser] != undefined) {
                            var meetingUser = meetingUsersList.entry_list[intMeetingUser];
                            var meetingUserListItem = $("<li/>");
                            var meetingUserHeader = "<h4>" + meetingUser.name_value_list.first_name.value + "&nbsp;" + meetingUser.name_value_list.last_name.value + "</h4>";
                            var meetingUserParagraph = "<p>" + meetingUser.name_value_list.title.value + "</p>";
                            meetingUserListItem.append(meetingUserHeader);
                            meetingUserListItem.append(meetingUserParagraph);
                            $('#ViewMeetingDetailsPageUsersListUl').append(meetingUserListItem);
                        }
                    }
                }               
            }
            $('#ViewMeetingDetailsPageUsersListUl').listview("refresh");
        }
        
    });
}

function getMeetingRelatedLeadsInsetList() {
    $('#ViewMeetingDetailsPageLeadsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {            
            var meetingLeadsList = jQuery.parseJSON(data);
            if ((meetingLeadsList.name !== undefined) && (meetingLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((meetingLeadsList != undefined) && (meetingLeadsList.entry_list != undefined)) {
                if (meetingLeadsList.entry_list.length>0)
                {
                    $('#ViewMeetingDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
                    var intMeetingLead = 0;
                    for(intMeetingLead=0;intMeetingLead<=meetingLeadsList.entry_list.length;intMeetingLead++)
                    {
                        if (meetingLeadsList.entry_list[intMeetingLead] != undefined) {
                            var meetingLead = meetingLeadsList.entry_list[intMeetingLead];
                            var meetingLeadListItem = $("<li/>");
                            var meetingLeadHeader = "<h4>" + meetingLead.name_value_list.first_name.value + " " + meetingLead.name_value_list.last_name.value + "</h4>";
                            var meetingLeadParagraph = '';
                            if (meetingLead.name_value_list.title != undefined) {
                                meetingLeadParagraph = "<p>" + meetingLead.name_value_list.title.value + "</p>";
                            } else {
                                meetingLeadParagraph = "<p></p>";
                            }
                            var meetingLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": meetingLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('#ViewLeadDetailsPage');
                                    
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            meetingLeadLink.append(meetingLeadHeader);
                            meetingLeadLink.append(meetingLeadParagraph);
                            meetingLeadListItem.append( meetingLeadLink );
                            $('#ViewMeetingDetailsPageLeadsListUl').append(meetingLeadListItem);
                        }
                    }
                }                
            }
            $('#ViewMeetingDetailsPageLeadsListUl').listview("refresh");
        }
    });
}

function getMeetingRelatedNotesInsetList() {
    $('#ViewMeetingDetailsPageNotesListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"notes","related_module_query":"","related_fields":["id","name","description","date_entered"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {            
            var callNotesList = jQuery.parseJSON(data);
            if ((callNotesList.name !== undefined) && (callNotesList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((callNotesList != undefined) && (callNotesList.entry_list != undefined)) {
                if (callNotesList.entry_list.length>0)
                {
                    $('#ViewMeetingDetailsPageNotesListUl').append("<li data-role=\"list-divider\">Notes</li>");
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
                            callNoteListItem.append( callNoteLink );
                            $('#ViewMeetingDetailsPageNotesListUl').append(callNoteListItem);
                        }
                    }
                }                
            }
            $('#ViewMeetingDetailsPageNotesListUl').listview("refresh");
        }
        
    });
}
