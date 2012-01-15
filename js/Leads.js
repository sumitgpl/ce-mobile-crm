function SugarCrmGetLeadsListFromServer(offset) {
    var existingList = $('#AllLeadsListDiv li');
    if ((existingList.length === 0) || (LeadsListCurrentOffset !== offset)) {
        
        LeadsListCurrentOffset = offset;
        $.get('../service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","query":"","order_by":"name","offset":' + offset + ',"select_fields":"","link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var leadsList = jQuery.parseJSON(data);
                if ((leadsList.name !== undefined) && (leadsList.name === "Invalid Session ID")) {
                    SugarSessionId = '';
                    $.mobile.changePage('#LoginPage');
                }
                if ((leadsList != undefined) && (leadsList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (leadsList.result_count === 0) {
                        LeadsListCurrentOffset = (LeadsListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (leadsList.next_offset === 0) {
                            LeadsListCurrentOffset = 0;
                        }
                    }
                    if ((leadsList.next_offset == 0) || (leadsList.result_count == 0))
                    {
                        alert('There are no more records in that direction');
                    }
                    else {
                        $('#AllLeadsListDiv li').remove();

                        var intLeads = 0;
                        for(intLeads=0;intLeads<=leadsList.entry_list.length;intLeads++)
                        {
                            if (leadsList.entry_list[intLeads] != undefined) {
                                var lead = leadsList.entry_list[intLeads];
                                var listItem = $("<li/>");
                                var header = "<h4>" + lead.name_value_list.first_name.value + "&nbsp;" + lead.name_value_list.last_name.value + "</h4>";
                                var leadAccount = "<p>" + lead.name_value_list.title.value + " at&nbsp;" + lead.name_value_list.account_name.value + "</p>";
                                var leadLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": lead.id,
                                    click: function() {
                                        CurrentLeadId = $(this).data("identity");
                                        $.mobile.changePage('#ViewLeadDetailsPage');
                                        
                                        SugarCrmGetLeadDetails();
                                    }
                                });
                                leadLink.append( header );
                                leadLink.append(leadAccount);
                                listItem.append( leadLink );
                                $('#AllLeadsListDiv').append(listItem);
                            }
                        }
                        $('#AllLeadsListDiv').listview("refresh");
                        LeadsListNextOffset = leadsList.next_offset;
                        var newLeadsPreviousOffset = (offset - RowsPerPageInListViews);
                        LeadsListPrevOffset = newLeadsPreviousOffset;
                    }
                }
            }
            
        });
    }
}

function SugarCrmGetLeadDetails() {
    $('#ContactNameH1').html('');
    $('#ContactTitleP').text('');
    $('#ViewLeadDetailsPageDetailsList li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","id":"' + CurrentLeadId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var leadsList = jQuery.parseJSON(data);
            if ((leadsList.name !== undefined) && (leadsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((leadsList != undefined) && (leadsList.entry_list != undefined)) {
                if (leadsList.entry_list[0] != undefined) {
                    var lead = leadsList.entry_list[0];
                    $('#LeadNameH1').html(lead.name_value_list.first_name.value + "&nbsp;" + lead.name_value_list.last_name.value);
                    /* Set the at Account name if not blank */
                    if ((lead.name_value_list.account_name !== undefined) && (lead.name_value_list.account_name.value !== "")) { 
                        var leadPText = lead.name_value_list.title.value;
                        leadPText+=" at " + lead.name_value_list.account_name.value;
                        $('#LeadTitleP').text(leadPText);
                    }
                    /* Append the first divider */
                    $('#ViewLeadDetailsPageDetailsList').append("<li data-role=\"list-divider\">Lead Information</li>");
                    /* If available append the Office Phone Link */
                    if ((lead.name_value_list.phone_work !== undefined) && (lead.name_value_list.phone_work.value !== "")) {
                        var leadOfficePhoneLi = $("<li/>");
                        var leadOfficePhoneLinkUrl = lead.name_value_list.phone_work.value.replace('(','');
                        leadOfficePhoneLinkUrl = leadOfficePhoneLinkUrl.replace(')','');
                        leadOfficePhoneLinkUrl = leadOfficePhoneLinkUrl.replace(' ','');
                        leadOfficePhoneLinkUrl = leadOfficePhoneLinkUrl.replace('-','');
                        var leadPhoneP = "<p><br />Office Phone</p>";
                        var leadPhoneHeader = "<h4>" + lead.name_value_list.phone_work.value + "</h4>";
                        var leadOfficePhoneLink = $("<a/>", {
                            href: "tel:+1" + leadOfficePhoneLinkUrl,
                            rel: "external",
                            "style": "text-decoration:none;color:#444;"
                        });
                        leadOfficePhoneLink.append(leadPhoneP);
                        leadOfficePhoneLink.append(leadPhoneHeader);
                        leadOfficePhoneLi.append(leadOfficePhoneLink);
                        $('#ViewLeadDetailsPageDetailsList').append(leadOfficePhoneLi);
                    }
                    /* If available append the Mobile Phone Link */
                    if ((lead.name_value_list.phone_mobile !== undefined) && (lead.name_value_list.phone_mobile.value !== "")) {
                        var leadMobilePhoneLi = $("<li/>");
                        var leadMobilePhoneP = "<p><br />Mobile Phone</p>";
                        var leadMobilePhoneLinkUrl = lead.name_value_list.phone_mobile.value.replace('(','');
                        leadMobilePhoneLinkUrl = leadMobilePhoneLinkUrl.replace(')','');
                        leadMobilePhoneLinkUrl = leadMobilePhoneLinkUrl.replace(' ','');
                        leadMobilePhoneLinkUrl = leadMobilePhoneLinkUrl.replace('-','');
                        var leadMobilePhoneHeader = "<h4>Mobile Phone:&nbsp;" + lead.name_value_list.phone_mobile.value + "</h4>";
                        var leadMobilePhoneLink = $("<a/>", {
                            href: "tel:+1" + leadMobilePhoneLinkUrl,
                            rel: "external",
                            "style": "text-decoration:none;color:#444;"
                        });
                        leadMobilePhoneLink.append(leadMobilePhoneP);
                        leadMobilePhoneLink.append(leadMobilePhoneHeader);
                        leadMobilePhoneLi.append(leadMobilePhoneLink);
                        $('#ViewLeadDetailsPageDetailsList').append(leadMobilePhoneLi);
                    }
                    /* If available append the Fax */
                    if ((lead.name_value_list.phone_fax !== undefined) && (lead.name_value_list.phone_fax.value !== "")) {
                        var leadFaxLi = $("<li/>");
                        var leadFaxP = "<p><br />Fax</p>";
                        var leadFaxHeader = "<h4>" + lead.name_value_list.phone_fax.value + "</h4>";
                        leadFaxLi.append(leadFaxP);
                        leadFaxLi.append(leadFaxHeader);
                        $('#ViewLeadDetailsPageDetailsList').append(leadFaxLi);
                    }
                    /* If available append the Department */
                    if ((lead.name_value_list.department !== undefined) && (lead.name_value_list.department.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Department</p><h4>" + lead.name_value_list.department.value  + "</h4></li>");
                    }
                    /* If available append the Primary Address */
                    if (((lead.name_value_list.primary_address_street !== undefined) && (lead.name_value_list.primary_address_street.value != "")) ||
                        ((lead.name_value_list.primary_address_city !== undefined) && (lead.name_value_list.primary_address_city.value != "")) ||
                        ((lead.name_value_list.primary_address_state !== undefined) && (lead.name_value_list.primary_address_state.value != "")) ||
                        ((lead.name_value_list.primary_address_postalcode !== undefined) && (lead.name_value_list.primary_address_postalcode.value != "")) ||
                        ((lead.name_value_list.primary_address_country !== undefined) && (lead.name_value_list.primary_address_country.value != ""))) {
                        var leadPrimaryAddressLi = $("<li/>");
                        var leadPrimaryAddressStreet = lead.name_value_list.primary_address_street.value;
                        var leadPrimaryAddressCity = lead.name_value_list.primary_address_city.value;
                        var leadPrimaryAddressState = lead.name_value_list.primary_address_state.value;
                        var leadPrimaryAddressPostalCode = lead.name_value_list.primary_address_postalcode.value;
                        var leadPrimaryAddressCountry = lead.name_value_list.primary_address_country.value;
                        var leadPrimaryAddressUrl = "http://maps.google.com/?q=" + leadPrimaryAddressStreet + "%20" +
                        leadPrimaryAddressCity +"%20" +  leadPrimaryAddressState + "%20" + leadPrimaryAddressPostalCode + "&t=m&z=13";
                        var leadPrimaryAddressP = "<p><br />Primary Address</p>";
                        var leadPrimaryAddressHeader = "<h4>" + leadPrimaryAddressStreet + "<br />" + leadPrimaryAddressCity + ", " + leadPrimaryAddressState +
                        leadPrimaryAddressPostalCode + "<br />" + leadPrimaryAddressCountry + "</h4>";
                        var leadPrimaryAddressLink = $("<a/>", {
                            href: leadPrimaryAddressUrl,
                            rel: "external",
                            target: "_new",
                            "style": "text-decoration:none;color:#444;"
                        });
                        leadPrimaryAddressLink.append(leadPrimaryAddressP);
                        leadPrimaryAddressLink.append(leadPrimaryAddressHeader);
                        leadPrimaryAddressLi.append(leadPrimaryAddressLink);
                        $('#ViewLeadDetailsPageDetailsList').append(leadPrimaryAddressLi);
                    }
                    /* If available append the Alt Address */
                    if (((lead.name_value_list.alt_address_street !== undefined) && (lead.name_value_list.alt_address_street.value != "")) ||
                        ((lead.name_value_list.alt_address_city !== undefined) && (lead.name_value_list.alt_address_city.value != "")) ||
                        ((lead.name_value_list.alt_address_state !== undefined) && (lead.name_value_list.alt_address_state.value != "")) ||
                        ((lead.name_value_list.alt_address_postalcode !== undefined) && (lead.name_value_list.alt_address_postalcode.value != "")) ||
                        ((lead.name_value_list.alt_address_country !== undefined) && (lead.name_value_list.alt_address_country.value != ""))) {
                        var leadAltAddressLi = $("<li/>");
                        var leadAltAddressStreet = lead.name_value_list.alt_address_street.value;
                        var leadAltAddressCity = lead.name_value_list.alt_address_city.value;
                        var leadAltAddressState = lead.name_value_list.alt_address_state.value;
                        var leadAltAddressPostalCode = lead.name_value_list.alt_address_postalcode.value;
                        var leadAltAddressCountry = lead.name_value_list.alt_address_country.value;
                        var leadAltAddressUrl = "http://maps.google.com/?q=" + leadAltAddressStreet + "%20" +
                        leadAltAddressCity +"%20" +  leadAltAddressState + "%20" + leadAltAddressPostalCode + "&t=m&z=13";
                        var leadAltAddressP = "<p><br />Other Address</p>";
                        var leadAltAddressHeader = "<h4>" + leadAltAddressStreet + "<br />" + leadAltAddressCity + ", " + leadAltAddressState +
                        leadAltAddressPostalCode + "<br />" + leadAltAddressCountry + "</h4>";
                        var leadAltAddressLink = $("<a/>", {
                            href: leadAltAddressUrl,
                            rel: "external",
                            target: "_new",
                            "style": "text-decoration:none;color:#444;"
                        });
                        leadAltAddressLink.append(leadAltAddressP);
                        leadAltAddressLink.append(leadAltAddressHeader);
                        leadAltAddressLi.append(leadAltAddressLink);
                        $('#ViewLeadDetailsPageDetailsList').append(leadAltAddressLi);
                    }

                    if ((lead.name_value_list.email1 !== undefined) && (lead.name_value_list.email1.value !== "")) {
                        var leadEmailLi = $("<li/>");
                        var leadEmailP = "<p><br />Email</p>";
                        var leadEmailHeader = "<h4>" + lead.name_value_list.email1.value + "</h4>";
                        var leadEmailLink = $("<a/>", {
                            href: "mailto:" + lead.name_value_list.email1.value,
                            rel: "external",
                            "style": "text-decoration:none;color:#444;"
                        });
                        leadEmailLink.append(leadEmailP);
                        leadEmailLink.append(leadEmailHeader);
                        leadEmailLi.append(leadEmailLink);
                        $('#ViewLeadDetailsPageDetailsList').append(leadEmailLi);
                    }

                    if ((lead.name_value_list.description !== undefined) && (lead.name_value_list.description.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Description<p><h4>" + lead.name_value_list.description.value + "</h4></li>");
                    }
                    $('#ViewLeadDetailsPageDetailsList').append("<li data-role=\"list-divider\">More Information</li>");
                    
                    if ((lead.name_value_list.status !== undefined) && (lead.name_value_list.status.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Status<p><h4>" + lead.name_value_list.status.value + "</h4></li>");
                    }

                    if ((lead.name_value_list.lead_source !== undefined) && (lead.name_value_list.lead_source.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Source<p><h4>" + lead.name_value_list.lead_source.value + "</h4></li>");
                    }

                    if ((lead.name_value_list.status_description !== undefined) && (lead.name_value_list.status_description.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Status Desccription<p><h4>" + lead.name_value_list.status_description.value + "</h4></li>");
                    }

                    if ((lead.name_value_list.lead_source_description !== undefined) && (lead.name_value_list.lead_source_description.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Source Description<p><h4>" + lead.name_value_list.lead_source_description.value + "</h4></li>");
                    }

                    if ((lead.name_value_list.opportunity_amount !== undefined) && (lead.name_value_list.opportunity_amount.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Opportunity Amount<p><h4>$" + parseFloat(lead.name_value_list.opportunity_amount.value).toFixed(2) + "</h4></li>");
                    }

                    if ((lead.name_value_list.refered_by !== undefined) && (lead.name_value_list.refered_by.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Referred By<p><h4>" + lead.name_value_list.refered_by.value + "</h4></li>");
                    }

                    if ((lead.name_value_list.campaign_name !== undefined) && (lead.name_value_list.campaign_name.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br /><p><h4>Campaign:&nbsp;" + lead.name_value_list.campaign_name.value + "</h4></li>");
                    }
                    /* Record Information */
                    $('#ViewLeadDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((lead.name_value_list.assigned_user_name !== undefined) && (lead.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + lead.name_value_list.assigned_user_name.value +"</h4></li>");
                    }
                    if ((lead.name_value_list.date_modified !== undefined) && (lead.name_value_list.date_modified.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + lead.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + lead.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((lead.name_value_list.date_entered !== undefined) && (lead.name_value_list.date_entered.value !== "")) {
                        $('#ViewLeadDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + lead.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + lead.name_value_list.created_by_name.value +"</h4></li>");
                    }

                    if (lead.name_value_list.do_not_call.value == 'true') {
                        alert('*NOTE: This Lead is marked as Do Not Call.');
                    }
                }
            }
            $('#ViewLeadDetailsPageDetailsList').listview("refresh");
        }
    });
    getLeadRelatedCallsInsetList();
    getLeadRelatedMeetingsInsetList();
    getLeadRelatedTasksInsetList();
}


function getLeadRelatedCallsInsetList() {
    $('#ViewLeadDetailsPageCallsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Leads",' +
        '"module_id":"' + CurrentLeadId + '",' +
        '"link_field_name":"calls",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewLeadDetailsPageCallsListUl').append("<li data-role=\"list-divider\">Calls</li>");
            var leadCallsList = jQuery.parseJSON(data);
            if ((leadCallsList.name !== undefined) && (leadCallsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((leadCallsList != undefined) && (leadCallsList.entry_list != undefined)) {
                if (leadCallsList.entry_list.length>0)
                {
                    var intLeadCall = 0;
                    for(intLeadCall=0;intLeadCall<=leadCallsList.entry_list.length;intLeadCall++)
                    {
                        if (leadCallsList.entry_list[intLeadCall] != undefined) {
                            var leadCall = leadCallsList.entry_list[intLeadCall];
                            var leadCallListItem = $("<li/>");
                            var leadCallHeader = "<h4>" + leadCall.name_value_list.name.value + "</h4>";
                            var leadCallParagraph = '';
                            if (leadCall.name_value_list.status != undefined) {
                                leadCallParagraph = "<p>" + leadCall.name_value_list.status.value;
                                if (leadCall.name_value_list.date_start != undefined) {
                                    leadCallParagraph+="<br/>" + leadCall.name_value_list.date_start.value;
                                }
                                leadCallParagraph+="</p>";
                            } else {
                                leadCallParagraph = "<p></p>";
                            }
                            var leadCallLink = $("<a/>", {
                                href: "#",
                                "data-identity": leadCall.id,
                                click: function() {
                                    CurrentCallId = $(this).data("identity");
                                    $.mobile.changePage('#ViewCallDetailsPage');
                                }
                            });
                            leadCallLink.append( leadCallHeader );
                            if (leadCall.name_value_list.status != undefined) {
                                leadCallLink.append(leadCallParagraph);
                            }
                            leadCallListItem.append( leadCallLink );
                            $('#ViewLeadDetailsPageCallsListUl').append(leadCallListItem);
                        }
                    }
                }
                else {
                    var leadCallEmptyListItem = $("<li/>");
                    var leadCallEmptyListHeader = "<h4>No Data</h4>";
                    leadCallEmptyListItem.append(leadCallEmptyListHeader);
                    $('#ViewLeadDetailsPageCallsListUl').append(leadCallEmptyListItem);
                }
            }
            $('#ViewLeadDetailsPageCallsListUl').listview("refresh");
        }
    });
}

function getLeadRelatedMeetingsInsetList() {
    $('#ViewLeadDetailsPageMeetingsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Leads",' +
        '"module_id":"' + CurrentLeadId + '",' +
        '"link_field_name":"meetings",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewLeadDetailsPageMeetingsListUl').append("<li data-role=\"list-divider\">Meetings</li>");
            var leadMeetingsList = jQuery.parseJSON(data);
            if ((leadMeetingsList.name !== undefined) && (leadMeetingsList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((leadMeetingsList != undefined) && (leadMeetingsList.entry_list != undefined)) {
                if (leadMeetingsList.entry_list.length>0)
                {
                    var intLeadMeeting = 0;
                    for(intLeadMeeting=0;intLeadMeeting<=leadMeetingsList.entry_list.length;intLeadMeeting++)
                    {
                        if (leadMeetingsList.entry_list[intLeadMeeting] != undefined) {
                            var leadMeeting = leadMeetingsList.entry_list[intLeadMeeting];
                            var leadMeetingListItem = $("<li/>");
                            var leadMeetingHeader = "<h4>" + leadMeeting.name_value_list.name.value + "</h4>";
                            var leadMeetingParagraph = '';
                            if (leadMeeting.name_value_list.status != undefined) {
                                leadMeetingParagraph = "<p>" + leadMeeting.name_value_list.status.value;
                                if (leadMeeting.name_value_list.date_start != undefined) {
                                    leadMeetingParagraph+="<br/>" + leadMeeting.name_value_list.date_start.value;
                                }
                                leadMeetingParagraph+="</p>";
                            } else {
                                leadMeetingParagraph = "<p></p>";
                            }

                            var leadMeetingLink = $("<a/>", {
                                href: "#",
                                "data-identity": leadMeeting.id,
                                click: function() {
                                    CurrentMeetingId = $(this).data("identity");
                                    $.mobile.changePage('#ViewMeetingDetailsPage');
                                }
                            });
                            leadMeetingLink.append( leadMeetingHeader );
                            leadMeetingLink.append(leadMeetingParagraph);
                            leadMeetingListItem.append( leadMeetingLink );
                            $('#ViewLeadDetailsPageMeetingsListUl').append(leadMeetingListItem);
                        }
                    }
                }
                else {
                    var leadMeetingEmptyListItem = $("<li/>");
                    var leadMeetingEmptyListHeader = "<h4>No Data</h4>";
                    leadMeetingEmptyListItem.append(leadMeetingEmptyListHeader);
                    $('#ViewLeadDetailsPageMeetingsListUl').append(leadMeetingEmptyListItem);
                }
            }
            $('#ViewLeadDetailsPageMeetingsListUl').listview("refresh");
        }
    });
}

function getLeadRelatedTasksInsetList() {
    $('#ViewLeadDetailsPageTasksListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Leads",' +
        '"module_id":"' + CurrentLeadId + '",' +
        '"link_field_name":"tasks",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewLeadDetailsPageTasksListUl').append("<li data-role=\"list-divider\">Tasks</li>");
            var leadTasksList = jQuery.parseJSON(data);
            if ((leadTasksList.name !== undefined) && (leadTasksList.name === "Invalid Session ID")) {
                SugarSessionId = '';
                $.mobile.changePage('#LoginPage');
            }
            if ((leadTasksList != undefined) && (leadTasksList.entry_list != undefined)) {
                if (leadTasksList.entry_list.length>0)
                {
                    var intLeadTask = 0;
                    for(intLeadTask=0;intLeadTask<=leadTasksList.entry_list.length;intLeadTask++)
                    {
                        if (leadTasksList.entry_list[intLeadTask] != undefined) {
                            var leadTask = leadTasksList.entry_list[intLeadTask];
                            var leadTaskListItem = $("<li/>");
                            var leadTaskHeader = "<h4>" + leadTask.name_value_list.name.value + "</h4>";
                            var leadTaskParagraph = '';
                            if (leadTask.name_value_list.status != undefined) {
                                leadTaskParagraph = "<p>" + leadTask.name_value_list.status.value;
                                if (leadTask.name_value_list.date_start != undefined) {
                                    leadTaskParagraph+="<br/>" + leadTask.name_value_list.date_start.value;
                                }
                                leadTaskParagraph+="</p>";
                            } else {
                                leadTaskParagraph = "<p></p>";
                            }

                            var leadTaskLink = $("<a/>", {
                                href: "#",
                                "data-identity": leadTask.id,
                                click: function() {
                                    CurrentTaskId = $(this).data("identity");
                                    $.mobile.changePage('#ViewTaskDetailsPage');
                                }
                            });
                            leadTaskLink.append(leadTaskHeader);
                            leadTaskLink.append(leadTaskParagraph);
                            leadTaskListItem.append( leadTaskLink);
                            $('#ViewLeadDetailsPageTasksListUl').append(leadTaskListItem);
                        }
                    }
                }
                else {
                    var leadTaskEmptyListItem = $("<li/>");
                    var leadTaskEmptyListHeader = "<h4>No Data</h4>";
                    leadTaskEmptyListItem.append(leadTaskEmptyListHeader);
                    $('#ViewLeadDetailsPageTasksListUl').append(leadTaskEmptyListItem);
                }
            }
            $('#ViewLeadDetailsPageTasksListUl').listview("refresh");
        }
        
    });
}



