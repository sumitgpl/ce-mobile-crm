function SugarCrmGetContactListFromServer(offset) {
    var existingList = $('#AllContactsListDiv li');
    if ((existingList.length === 0) || (ContactsListCurrentOffset !== offset)) {
        $.mobile.showshowPageLoadingMsgMsg();
        ContactsListCurrentOffset = offset;
        $.get(CurrentServerAddress + '/service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '",' +
                '"module_name":"Contacts",' +
                '"query":"",' +
                '"order_by":"name",' +
                '"offset":' + offset + ',' +
                '"select_fields":["first_name","last_name","account_name","title"],' +
                '"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var contactsList = jQuery.parseJSON(data);
                if ((contactsList != undefined) && (contactsList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (contactsList.result_count === 0) {
                        ContactsListCurrentOffset = (ContactsListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (contactsList.next_offset === 0) {
                            ContactsListCurrentOffset = 0;
                        }
                    }
                    if ((contactsList.next_offset == 0) || (contactsList.result_count == 0))
                    {
                        alert('There are no more records in that direction');
                    }
                    else {
                        $('#AllContactsListDiv li').remove();
                        var intContact = 0;
                        for(intContact=0;intContact<=contactsList.entry_list.length;intContact++)
                        {
                            if (contactsList.entry_list[intContact] != undefined) {
                                var contact = contactsList.entry_list[intContact];
                                var listItem = $("<li/>");
                                var header = "<h4>" + contact.name_value_list.first_name.value + "&nbsp;" + contact.name_value_list.last_name.value + "</h4>";
                                var contactPText = contact.name_value_list.title.value;
                                if (contact.name_value_list.account_name != undefined) {
                                    contactPText+=" at " + contact.name_value_list.account_name.value;
                                }
                                var contactContact = "<p>" + contactPText + "</p>";
                                var contactLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": contact.id,
                                    click: function() {
                                        CurrentContactId = $(this).data("identity");
                                        $.mobile.changePage('#ViewContactDetailsPage');
                                        $.mobile.showshowPageLoadingMsgMsg();
                                        SugarCrmGetContactDetails();
                                    }
                                });
                                contactLink.append( header );
                                contactLink.append(contactContact);
                                listItem.append( contactLink );
                                $('#AllContactsListDiv').append(listItem);
                            }
                        }
                        $('#AllContactsListDiv').listview("refresh");
                        ContactsListNextOffset = contactsList.next_offset;
                        var newPreviousContactOffset = (offset - RowsPerPageInListViews);
                        ContactsListPrevOffset = newPreviousContactOffset;
                    }
                }
            }
            $.mobile.hideshowPageLoadingMsgMsg();
        });
    }
}

function SugarCrmGetContactDetails() {
    $.mobile.showshowPageLoadingMsgMsg();
    $('#ContactNameH1').html('');
    $('#ContactTitleP').text('');
    $('#ViewContactDetailsPageDetailsList li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId +
            '","module_name":"Contacts",' +
            '"id":"' + CurrentContactId + '",' +
            '"select_fields":["first_name","last_name","account_name","title","phone_work","email1","description","primary_address_street","primary_address_city","primary_address_state",' +
            '"primary_address_postalcode","primary_address_country","phone_mobile","phone_fax","department","alt_address_street","alt_address_city","alt_address_state",' +
            '"alt_address_postalcode","alt_address_country"],' +
            '"link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var contactsList = jQuery.parseJSON(data);
            if ((contactsList.name !== undefined) && (contactsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactsList != undefined) && (contactsList.entry_list != undefined)) {
                if (contactsList.entry_list[0] != undefined) {
                    var contact = contactsList.entry_list[0];
                    /* Set the Contact Name and Title */
                    $('#ContactNameH1').html(contact.name_value_list.first_name.value + "&nbsp;" + contact.name_value_list.last_name.value);
                    var contactPText = contact.name_value_list.title.value;
                    if (contact.name_value_list.account_name != undefined) {
                        contactPText+=" at " + contact.name_value_list.account_name.value;
                    }
                    $('#ContactTitleP').text(contactPText);
                    $('#ViewContactDetailsPageDetailsList').append("<li data-role=\"list-divider\">Contact Information</li>");
                    /* Now append the populated fields to the detailed list sections */
                    if ((contact.name_value_list.phone_work !== undefined) && (contact.name_value_list.phone_work.value !== "")) {
                        var officePhoneLi = $("<li/>");
                        var officePhoneLinkUrl = contact.name_value_list.phone_work.value.replace('(','');
                        officePhoneLinkUrl = officePhoneLinkUrl.replace(')','');
                        officePhoneLinkUrl = officePhoneLinkUrl.replace(' ','');
                        officePhoneLinkUrl = officePhoneLinkUrl.replace('-','');
                        if (contact.name_value_list.phone_work !== undefined) {
                            var officePhoneParagraph = "<p><br />Office Phone</p>";
                            var officePhoneHeader = "<h4>" + contact.name_value_list.phone_work.value + "</h4>";
                            var officePhoneLink = $("<a/>", {
                                href: "tel:+1" + officePhoneLinkUrl,
                                rel: "external",
                                "style": "text-decoration:none;color:#444;"
                            });
                            officePhoneLink.append(officePhoneParagraph);
                            officePhoneLink.append(officePhoneHeader);
                            officePhoneLi.append(officePhoneLink);
                        }
                        $('#ViewContactDetailsPageDetailsList').append(officePhoneLi);
                    }
                    if ((contact.name_value_list.email1 !== undefined) && (contact.name_value_list.email1.value !== "")) {
                        var emailLi = $("<li/>");
                        var emailParagraph = "<p><br />Email</p>";
                        var emailHeader = "<h4>" + contact.name_value_list.email1.value + "</h4>";
                        var emailLink = $("<a/>", {
                            href: "mailto:" + contact.name_value_list.email1.value,
                            rel: "external",
                            "style": "text-decoration:none;color:#444;"
                        });
                        emailLink.append(emailParagraph);
                        emailLink.append(emailHeader);
                        emailLi.append(emailLink);
                        $('#ViewContactDetailsPageDetailsList').append(emailLi);
                    }
                    if ((contact.name_value_list.description !== undefined) && (contact.name_value_list.description.value !== "")) {
                        var descriptionLi = $("<li/>");
                        var descriptionParagraph = "<p><br />Description</p>";
                        var descriptionHeader = "<h4>" + contact.name_value_list.description.value + "</h4>";
                        descriptionLi.append(descriptionParagraph);
                        descriptionLi.append(descriptionHeader);
                        $('#ViewContactDetailsPageDetailsList').append(descriptionLi);
                    }
                    if (((contact.name_value_list.primary_address_street !== undefined) && (contact.name_value_list.primary_address_street.value != "")) ||
                        ((contact.name_value_list.primary_address_city !== undefined) && (contact.name_value_list.primary_address_city.value != "")) ||
                        ((contact.name_value_list.primary_address_state !== undefined) && (contact.name_value_list.primary_address_state.value != "")) ||
                        ((contact.name_value_list.primary_address_postalcode !== undefined) && (contact.name_value_list.primary_address_postalcode.value != "")) ||
                        ((contact.name_value_list.primary_address_country !== undefined) && (contact.name_value_list.primary_address_country.value != ""))) {
                        var contactPrimaryAddressStreet = contact.name_value_list.primary_address_street.value;
                        var contactPrimaryAddressCity = contact.name_value_list.primary_address_city.value;
                        var contactPrimaryAddressState = contact.name_value_list.primary_address_state.value;
                        var contactPrimaryAddressPostalCode = contact.name_value_list.primary_address_postalcode.value;
                        var contactPrimaryAddressCountry = contact.name_value_list.primary_address_country.value;
                        var contactPrimaryAddressUrl = "http://maps.google.com/?q=" + contactPrimaryAddressStreet + "%20" +
                        contactPrimaryAddressCity +"%20" +  contactPrimaryAddressState + "%20" + contactPrimaryAddressPostalCode + "&t=m&z=13";
                        var primaryAddressLi = $("<li/>");
                        var pirmaryAddressParagraph = "<p><br />Primary Address</p>";
                        var primaryAddressHeader = "<h4>" + contactPrimaryAddressStreet + "<br />" + contactPrimaryAddressCity + ", " + contactPrimaryAddressState +
                        " " + contactPrimaryAddressPostalCode + "<br />" + contactPrimaryAddressCountry + "</h4>";
                        var primaryAddressLink = $("<a/>", {
                            href: contactPrimaryAddressUrl,
                            rel: "external",
                            target: "_new",
                            "style": "text-decoration:none;color:#444;"
                        });
                        primaryAddressLink.append(pirmaryAddressParagraph);
                        primaryAddressLink.append(primaryAddressHeader);
                        primaryAddressLi.append(primaryAddressLink);
                        $('#ViewContactDetailsPageDetailsList').append(primaryAddressLi);
                    }
                    if ((contact.name_value_list.phone_mobile !== undefined) && (contact.name_value_list.phone_mobile.value !== "")) {
                        var mobilePhoneLi = $("<li/>");
                        var mobilePhoneLinkUrl = contact.name_value_list.phone_mobile.value.replace('(','');
                        mobilePhoneLinkUrl = officePhoneLinkUrl.replace(')','');
                        mobilePhoneLinkUrl = officePhoneLinkUrl.replace(' ','');
                        mobilePhoneLinkUrl = officePhoneLinkUrl.replace('-','');
                        var mobilePhoneParagraph = "<p><br />Mobile Phone</p>";
                        var mobilePhoneHeader = "<h4>" + contact.name_value_list.phone_mobile.value + "</h4>";
                        var mobilePhoneLink = $("<a/>", {
                            href: "tel:+1" + mobilePhoneLinkUrl,
                            rel: "external",
                            "style": "text-decoration:none;color:#444;"
                        });
                        mobilePhoneLink.append(mobilePhoneParagraph);
                        mobilePhoneLink.append(mobilePhoneHeader);
                        mobilePhoneLi.append(mobilePhoneLink)
                        $('#ViewContactDetailsPageDetailsList').append(mobilePhoneLi);
                    }

                    if ((contact.name_value_list.phone_fax !== undefined) && (contact.name_value_list.phone_fax.value !== "")) {
                        var contactFaxLi = $("<li/>");
                        var contactFaxParagraph = "<p><br />Fax</p>";
                        var contactFaxHeader = "<h4>" + contact.name_value_list.phone_fax.value + "</h4>";
                        contactFaxLi.append(contactFaxParagraph);
                        contactFaxLi.append(contactFaxHeader);
                        $('#ViewContactDetailsPageDetailsList').append(contactFaxLi);
                    }
                    if ((contact.name_value_list.department !== undefined) && (contact.name_value_list.department.value !== "")) {
                        var contactDepartmentLi = $("<li/>");
                        var contactDepartmentParagraph = "<p><br />Department</p>";
                        var contactDepartmentHeader = "<h4>" + contact.name_value_list.department.value + "</h4>";
                        contactDepartmentLi.append(contactDepartmentParagraph);
                        contactDepartmentLi.append(contactDepartmentHeader);
                        $('#ViewContactDetailsPageDetailsList').append(contactDepartmentLi);
                    }
                    if (((contact.name_value_list.alt_address_street !== undefined) && (contact.name_value_list.alt_address_street.value != "")) ||
                        ((contact.name_value_list.alt_address_city !== undefined) && (contact.name_value_list.alt_address_city.value != "")) ||
                        ((contact.name_value_list.alt_address_state !== undefined) && (contact.name_value_list.alt_address_state.value != "")) ||
                        ((contact.name_value_list.alt_address_postalcode !== undefined) && (contact.name_value_list.alt_address_postalcode.value != "")) ||
                        ((contact.name_value_list.alt_address_country !== undefined) && (contact.name_value_list.alt_address_country.value != ""))) {
                        var contactOtherLi = $("<li/>");
                        var contactOtherAddressStreet = contact.name_value_list.alt_address_street.value;
                        var contactOtherAddressCity = contact.name_value_list.alt_address_city.value;
                        var contactOtherAddressState = contact.name_value_list.alt_address_state.value;
                        var contactOtherAddressPostalCode = contact.name_value_list.alt_address_postalcode.value;
                        var contactOtherAddressCountry = contact.name_value_list.alt_address_country.value;
                        var contactOtherAddressUrl = "http://maps.google.com/?q=" + contactOtherAddressStreet + "%20" +
                        contactOtherAddressCity +"%20" +  contactOtherAddressState + "%20" + contactOtherAddressPostalCode + "&t=m&z=13";

                        var otherAddressParagraph = "<p><br />Other Address</p>";
                        var otherAddressHeader = "<h4>" + contactOtherAddressStreet + "<br />" + contactOtherAddressCity + ", " + contactOtherAddressState +
                        " " + contactOtherAddressPostalCode + "<br />" + contactOtherAddressCountry + "</h4>";
                        var otherAddressLink = $("<a/>", {
                            href: contactOtherAddressUrl,
                            rel: "external",
                            target: "_new",
                            "style": "text-decoration:none;color:#444;"
                        });
                        otherAddressLink.append(otherAddressParagraph);
                        otherAddressLink.append(otherAddressHeader);
                        contactOtherLi.append(otherAddressLink);
                        $('#ViewContactDetailsPageDetailsList').append(contactOtherLi);
                    }
                    $('#ViewContactDetailsPageDetailsList').append("<li data-role=\"list-divider\">More Information</li>");
                    if ((contact.name_value_list.report_to_name !== undefined) && (contact.name_value_list.report_to_name.value !== "")) {
                        $('#ViewContactDetailsPageDetailsList').append("<li><p><br />Reports To</p><h4>" + contact.name_value_list.report_to_name.value +"</h4></li>");
                    }
                    if ((contact.name_value_list.lead_source !== undefined) && (contact.name_value_list.lead_source.value !== "")) {
                        $('#ViewContactDetailsPageDetailsList').append("<li><p><br />Lead Source</p><h4>" + contact.name_value_list.lead_source.value +"</h4></li>");
                    }
                    $('#ViewContactDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((contact.name_value_list.assigned_user_name !== undefined) && (contact.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewContactDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + contact.name_value_list.assigned_user_name.value +"</h4></li>");
                    }
                    if ((contact.name_value_list.date_modified !== undefined) && (contact.name_value_list.date_modified.value !== "")) {
                        $('#ViewContactDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + contact.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + contact.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((contact.name_value_list.date_entered !== undefined) && (contact.name_value_list.date_entered.value !== "")) {
                        $('#ViewContactDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + contact.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + contact.name_value_list.created_by_name.value +"</h4></li>");
                    }
                    if ((contact.name_value_list.do_not_call !== undefined) && (contact.name_value_list.do_not_call.value == 'true')) {
                        alert('*NOTE: This Contact is marked as Do Not Call.');
                    }
                }
            }
            $('#ViewContactDetailsPageDetailsList').listview("refresh");
        }
        $.mobile.showshowPageLoadingMsgMsg();
    });
    getContactRelatedOpportunitiesInsetList();
    getContactRelatedLeadsInsetList();
    getContactRelatedCallsInsetList();
    getContactRelatedMeetingsInsetList();
    getContactRelatedTasksInsetList();
}



function getContactRelatedOpportunitiesInsetList() {
    $('#ViewContactDetailsPageOpportunitiesListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"opportunities","related_module_query":"","related_fields":["id","name","sales_stage"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewContactDetailsPageOpportunitiesListUl').append("<li data-role=\"list-divider\">Opportunities</li>");
            var contactOpportunitiesList = jQuery.parseJSON(data);
            if ((contactOpportunitiesList.name !== undefined) && (contactOpportunitiesList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactOpportunitiesList != undefined) && (contactOpportunitiesList.entry_list != undefined)) {
                if (contactOpportunitiesList.entry_list.length>0)
                {
                    var intContactOpportunity = 0;
                    for(intContactOpportunity=0;intContactOpportunity<=contactOpportunitiesList.entry_list.length;intContactOpportunity++)
                    {
                        if (contactOpportunitiesList.entry_list[intContactOpportunity] != undefined) {
                            var contactOpportunity = contactOpportunitiesList.entry_list[intContactOpportunity];
                            var contactOpportunityListItem = $("<li/>");
                            var contactOpportunityHeader = "<h4>" + contactOpportunity.name_value_list.name.value + "</h4>";
                            var contactOpportunityParagraph = "<p>" + contactOpportunity.name_value_list.sales_stage.value + "</p>";

                            var contactOpportunityLink = $('<a/>', {
                                href: "#",
                                "data-identity": contactOpportunity.id,
                                click: function() {
                                    CurrentOpportunityId = $(this).data("identity");
                                    $.mobile.changePage('#ViewOpportunityDetailsPage');
                                    $.mobile.showshowPageLoadingMsgMsg();
                                    SugarCrmGetOpportunityDetails();
                                }
                            });
                            contactOpportunityLink.append( contactOpportunityHeader );
                            contactOpportunityLink.append(contactOpportunityParagraph);
                            contactOpportunityListItem.append( contactOpportunityLink );
                            $('#ViewContactDetailsPageOpportunitiesListUl').append(contactOpportunityListItem);
                        }
                    }
                }
                else {
                    var contactOpportunityEmptyListItem = $("<li/>");
                    var contactOpportunityEmptyListHeader = "<h4>No Data</h4>";
                    contactOpportunityEmptyListItem.append(contactOpportunityEmptyListHeader);
                    $('#ViewContactDetailsPageOpportunitiesListUl').append(contactOpportunityEmptyListItem);
                }
            }
            $('#ViewContactDetailsPageOpportunitiesListUl').listview("refresh");
        }
        $.mobile.showshowPageLoadingMsgMsg();
    });
}

function getContactRelatedLeadsInsetList() {
    $('#ViewContactDetailsPageLeadsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewContactDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
            var contactLeadsList = jQuery.parseJSON(data);
            if ((contactLeadsList.name !== undefined) && (contactLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactLeadsList != undefined) && (contactLeadsList.entry_list != undefined)) {
                if (contactLeadsList.entry_list.length>0)
                {
                    var intContactLead = 0;
                    for(intContactLead=0;intContactLead<=contactLeadsList.entry_list.length;intContactLead++)
                    {
                        if (contactLeadsList.entry_list[intContactLead] != undefined) {
                            var contactLead = contactLeadsList.entry_list[intContactLead];
                            var contactLeadListItem = $("<li/>");
                            var contactLeadHeader = "<h4>" + contactLead.name_value_list.first_name.value + " " + contactLead.name_value_list.last_name.value + "</h4>";
                            var contactLeadParagraph = '';
                            if (contactLead.name_value_list.title != undefined) {
                                contactLeadParagraph = "<p>" + contactLead.name_value_list.title.value + "</p>";
                            } else {
                                contactLeadParagraph = "<p></p>";
                            }
                            var contactLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": contactLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('#ViewLeadDetailsPage');
                                    $.mobile.showshowPageLoadingMsgMsg();
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            contactLeadLink.append( contactLeadHeader );
                            contactLeadLink.append(contactLeadParagraph);
                            contactLeadListItem.append( contactLeadLink );
                            $('#ViewContactDetailsPageLeadsListUl').append(contactLeadListItem);
                        }
                    }
                }
                else {
                    var contactLeadEmptyListItem = $("<li/>");
                    var contactLeadEmptyListHeader = "<h4>No Data</h4>";
                    contactLeadEmptyListItem.append(contactLeadEmptyListHeader);
                    $('#ViewContactDetailsPageLeadsListUl').append(contactLeadEmptyListItem);
                }
            }
            $('#ViewContactDetailsPageLeadsListUl').listview("refresh");
        }
    });
    $.mobile.showshowPageLoadingMsgMsg();
}

function getContactRelatedCallsInsetList() {
    $('#ViewContactDetailsPageCallsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Contacts",' +
        '"module_id":"' + CurrentContactId + '",' +
        '"link_field_name":"calls",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewContactDetailsPageCallsListUl').append("<li data-role=\"list-divider\">Calls</li>");
            var contactCallsList = jQuery.parseJSON(data);
            if ((contactCallsList.name !== undefined) && (contactCallsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactCallsList !== undefined) && (contactCallsList.entry_list !== undefined)) {
                if (contactCallsList.entry_list.length>0)
                {
                    var intContactCall = 0;
                    for(intContactCall=0;intContactCall<=contactCallsList.entry_list.length;intContactCall++)
                    {
                        if (contactCallsList.entry_list[intContactCall] !== undefined) {
                            var contactCall = contactCallsList.entry_list[intContactCall];
                            var contactCallListItem = $("<li/>");
                            var contactCallHeader = "<h4>" + contactCall.name_value_list.name.value + "</h4>";
                            var contactCallParagraph = '';
                            if ((contactCall.name_value_list.status !== undefined) && (contactCall.name_value_list.status.value !== "")) {
                                contactCallParagraph = "<p>" + contactCall.name_value_list.status.value;
                                if (contactCall.name_value_list.date_start != undefined) {
                                    contactCallParagraph+="<br/>" + contactCall.name_value_list.date_start.value;
                                }
                                contactCallParagraph+="</p>";
                            } else {
                                contactCallParagraph = "<p></p>";
                            }
                            var contactCallLink = $("<a/>", {
                                href: "#",
                                "data-identity": contactCall.id,
                                click: function() {
                                    CurrentCallId = $(this).data("identity");
                                    $.mobile.changePage('#ViewCallDetailsPage');
                                    $.mobile.showshowPageLoadingMsgMsg();
                                    SugarCrmGetCallDetails();
                                }
                            });
                            contactCallLink.append( contactCallHeader );
                            if ((contactCall.name_value_list.status !== undefined) && (contactCall.name_value_list.status.value !== "")) {
                                contactCallLink.append(contactCallParagraph);
                            }
                            contactCallListItem.append(contactCallLink);
                            $('#ViewContactDetailsPageCallsListUl').append(contactCallListItem);
                        }
                    }
                }
                else {
                    var contactCallEmptyListItem = $("<li/>");
                    var contactCallEmptyListHeader = "<h4>No Data</h4>";
                    contactCallEmptyListItem.append(contactCallEmptyListHeader);
                    $('#ViewContactDetailsPageCallsListUl').append(contactCallEmptyListItem);
                }
            }
            $('#ViewContactDetailsPageCallsListUl').listview("refresh");
            $.mobile.showshowPageLoadingMsgMsg();
        }
    });
}

function getContactRelatedMeetingsInsetList() {
    $('#ViewContactDetailsPageMeetingsListUl li').remove();
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Contacts",' +
        '"module_id":"' + CurrentContactId + '",' +
        '"link_field_name":"meetings",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewContactDetailsPageMeetingsListUl').append("<li data-role=\"list-divider\">Meetings</li>");
            var contactMeetingsList = jQuery.parseJSON(data);
            if ((contactMeetingsList.name !== undefined) && (contactMeetingsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactMeetingsList != undefined) && (contactMeetingsList.entry_list != undefined)) {
                if (contactMeetingsList.entry_list.length>0)
                {
                    var intContactMeeting = 0;
                    for(intContactMeeting=0;intContactMeeting<=contactMeetingsList.entry_list.length;intContactMeeting++)
                    {
                        if (contactMeetingsList.entry_list[intContactMeeting] != undefined) {
                            var contactMeeting = contactMeetingsList.entry_list[intContactMeeting];
                            var contactMeetingListItem = $("<li/>");
                            var contactMeetingHeader = "<h4>" + contactMeeting.name_value_list.name.value + "</h4>";
                            var contactMeetingParagraph = '';
                            if (contactMeeting.name_value_list.status != undefined) {
                                contactMeetingParagraph = "<p>" + contactMeeting.name_value_list.status.value;
                                if (contactMeeting.name_value_list.date_start != undefined) {
                                    contactMeetingParagraph+="<br/>" + contactMeeting.name_value_list.date_start.value;
                                }
                                contactMeetingParagraph+="</p>";
                            } else {
                                contactMeetingParagraph = "<p></p>";
                            }

                            var contactMeetingLink = $("<a/>", {
                                href: "#",
                                "data-identity": contactMeeting.id,
                                click: function() {
                                    CurrentMeetingId = $(this).data("identity");
                                    $.mobile.changePage('#ViewMeetingDetailsPage');
                                    $.mobile.showshowPageLoadingMsgMsg();
                                    SugarCrmGetMeetingDetails();
                                }
                            });
                            contactMeetingLink.append( contactMeetingHeader );
                            contactMeetingLink.append(contactMeetingParagraph);
                            contactMeetingListItem.append( contactMeetingLink );
                            $('#ViewContactDetailsPageMeetingsListUl').append(contactMeetingListItem);
                        }
                    }
                }
                else {
                    var contactMeetingEmptyListItem = $("<li/>");
                    var contactMeetingEmptyListHeader = "<h4>No Data</h4>";
                    contactMeetingEmptyListItem.append(contactMeetingEmptyListHeader);
                    $('#ViewContactDetailsPageMeetingsListUl').append(contactMeetingEmptyListItem);
                }
            }
            $('#ViewContactDetailsPageMeetingsListUl').listview("refresh");
        }
    });
    $.mobile.showshowPageLoadingMsgMsg();
}

function getContactRelatedTasksInsetList() {
    $('#ViewContactDetailsPageTasksListUl li').remove();
    if (SugarSessionId == '') {
        $.mobile.changePage('#HomePage');
    }
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Contacts",' +
        '"module_id":"' + CurrentContactId + '",' +
        '"link_field_name":"tasks",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewContactDetailsPageTasksListUl').append("<li data-role=\"list-divider\">Tasks</li>");
            var contactTasksList = jQuery.parseJSON(data);
            if ((contactTasksList.name !== undefined) && (contactTasksList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('#LoginPage');
            }
            if ((contactTasksList != undefined) && (contactTasksList.entry_list != undefined)) {
                if (contactTasksList.entry_list.length>0)
                {
                    var intContactTask = 0;
                    for(intContactTask=0;intContactTask<=contactTasksList.entry_list.length;intContactTask++)
                    {
                        if (contactTasksList.entry_list[intContactTask] != undefined) {
                            var contactTask = contactTasksList.entry_list[intContactTask];
                            var contactTaskListItem = $("<li/>");
                            var contactTaskHeader = "<h4>" + contactTask.name_value_list.name.value + "</h4>";
                            var contactTaskParagraph = '';
                            if (contactTask.name_value_list.status != undefined) {
                                contactTaskParagraph = "<p>" + contactTask.name_value_list.status.value;
                                if (contactTask.name_value_list.date_start != undefined) {
                                    contactTaskParagraph+="<br/>" + contactTask.name_value_list.date_start.value;
                                }
                                contactTaskParagraph+="</p>";
                            } else {
                                contactTaskParagraph = "<p></p>";
                            }

                            var contactTaskLink = $("<a/>", {
                                href: "#",
                                "data-identity": contactTask.id,
                                click: function() {
                                    CurrentTaskId = $(this).data("identity");
                                    $.mobile.changePage('#ViewTaskDetailsPage');
                                    $.mobile.showshowPageLoadingMsgMsg();
                                    SugarCrmGetTaskDetails();
                                }
                            });
                            contactTaskLink.append( contactTaskHeader );
                            contactTaskLink.append(contactTaskParagraph);
                            contactTaskListItem.append( contactTaskLink );
                            $('#ViewContactDetailsPageTasksListUl').append(contactTaskListItem);
                        }
                    }
                }
                else {
                    var contactTaskEmptyListItem = $("<li/>");
                    var contactTaskEmptyListHeader = "<h4>No Data</h4>";
                    contactTaskEmptyListItem.append(contactTaskEmptyListHeader);
                    $('#ViewContactDetailsPageTasksListUl').append(contactTaskEmptyListItem);
                }
            }
            $('#ViewContactDetailsPageTasksListUl').listview("refresh");
        }
    });
    $.mobile.showshowPageLoadingMsgMsg();
}

function SugarCrmAddNewContact() {
    $.mobile.showshowPageLoadingMsgMsg();
    var validInput = ValidateNewContactToAdd();
    if (validInput) {
         $.get(CurrentServerAddress + '/service/v2/rest.php', {
	method: "set_entry",
	input_type: "JSON",
        response_type: "JSON",
	rest_data: '{"session":"' + SugarSessionId + '",' +
		'"module":"Contacts",' +
		'"name_value_list":[' +
                '{"name":"first_name","value":"' + $('#ContactFirstNameTextBox').val() + '"},' +
		'{"name":"last_name","value":"' + $('#ContactLastNameTextBox').val() + '"},' +
                '{"name":"phone_work","value":"' + $('#ContactOfficePhoneTextBox').val() + '"},' +
                '{"name":"phone_mobile","value":"' + $('#ContactMobileTextBox').val() + '"},' +
                '{"name":"phone_fax","value":"' + $('#ContactPhoneFaxTextBox').val() + '"},' +
                '{"name":"email1","value":"' + $('#ContactEmailTextBox').val() + '"},' +
                '{"name":"title","value":"' + $('#ContactTitleTextBox').val() + '"},' +
                '{"name":"department","value":"' + $('#ContactDepartmentTextBox').val() + '"},' +
                '{"name":"description","value":"' + $('#NewContactDescriptionTextArea').val() + '"}]}'
        }, function(data) {
            if (data !== undefined) {
                var addContactResult = jQuery.parseJSON(data);
                if (addContactResult.id === "Invalid Session ID") {
                    SugarSessionId = '';
                    $.mobile.showshowPageLoadingMsgMsg();
                    $.mobile.changePage('#LoginPage');
                }
		 $('#ContactFirstNameTextBox').val('');
                 $('#ContactLastNameTextBox').val('');
                 $('#ContactOfficePhoneTextBox').val('');
                 $('#ContactMobileTextBox').val('');
                 $('#ContactPhoneFaxTextBox').val('');
                 $('#ContactEmailTextBox').val('');
                 $('#ContactTitleTextBox').val('');
                 $('#ContactDepartmentTextBox').val('');
                 $('#NewContactDescriptionTextArea').val('');
                 $.mobile.showshowPageLoadingMsgMsg();
                 $.mobile.changePage('#HomePage');
            }
        });
    }
    else {
        $.mobile.showshowPageLoadingMsgMsg();
        alert(RES_ADD_NEW_ACCOUNT_VALIDATION_FAILED);
    }
}

function ValidateNewContactToAdd() {
    if (($('#ContactFirstNameTextBox').val().length > 0) && ($('#ContactLastNameTextBox').val().length > 0)) {
        return true;
    }
    else {
        return false;
    }
}