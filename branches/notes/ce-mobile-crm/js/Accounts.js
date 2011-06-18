/*
* CE Mobile CRM : SugarCrmGetAccountsListFromServer
* This Global method is called on the pageshow method for the
* ViewAcccountsListPage and it gets the entry list from the
* REST API then binds each of the items to the list view.
*/
function SugarCrmGetAccountsListFromServer(offset) {
    var existingList = $('#AllAccountsListDiv li');
    if ((existingList.length === 0) || (AccountsListCurrentOffset !== offset)) {
        /* Show the loading panel */
        $.mobile.pageLoading();
        AccountsListCurrentOffset = offset;
        /* Set the parameters of the call to the get_entry_list then place the call */
        $.get('../service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '",' +
            '"module_name":"Accounts",' +
            '"query":"",' +
            '"order_by":"name",' +
            '"offset":' + offset + ',' +
            '"select_fields":["name","billing_address_city","billing_address_state"],' +
            '"link_name_to_fields_array":"",' +
            '"max_results":' + RowsPerPageInListViews + ',' +
            '"deleted":0}'
        }, function(data) {
            if (data !== undefined) {
                var accountsList = jQuery.parseJSON(data);
            if ((accountsList.name !== undefined) && (accountsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
                if ((accountsList !== undefined) && (accountsList.entry_list !== undefined)) {
                    /* Set the current offset accordingly */
                    if (accountsList.result_count === 0) {
                        AccountsListCurrentOffset = (AccountsListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (accountsList.next_offset === 0) {
                            AccountsListCurrentOffset = 0;
                        }
                    }
                    /* Warn the user if they try to naviage beyond the records available */
                    if ((accountsList.next_offset === 0) || (accountsList.result_count === 0))
                    {
                        alert('There are no more records in that direction');
                    }
                    else {
                        /* Remove the existing list items before rebinding */
                        $('#AllAccountsListDiv li').remove();
                        var intAccount = 0;
                        for(intAccount=0;intAccount<=accountsList.entry_list.length;intAccount++)
                        {
                            if (accountsList.entry_list[intAccount] !== undefined) {
                                var account = accountsList.entry_list[intAccount];
                                var listItem = $('<li/>');
                                var header = "<h4>" + account.name_value_list.name.value + "</h4>";
                                var accountParagraph = "<p>" + account.name_value_list.billing_address_city.value + "&nbsp;" +
                                account.name_value_list.billing_address_state.value + "</p>";
                                var accountLink = $('<a/>', {
                                    href: "#",
                                    "data-identity": account.id,
                                    click: function() {
                                        CurrentAccountId = $(this).data("identity");
                                        $.mobile.changePage('ViewAccountDetailsPage');
                                        $.mobile.pageLoading();
                                        SugarCrmGetAccountDetails();
                                    }
                                });
                                accountLink.append(header);
                                accountLink.append(accountParagraph);
                                listItem.append(accountLink);
                                $('#AllAccountsListDiv').append(listItem);
                            }
                        }
                        /* After binding all the list items to the listview refresh it so all styles are applied */
                        $('#AllAccountsListDiv').listview("refresh");
                        /* Update the Global offset variables so the paging in each direction works */
                        AccountsListNextOffset = accountsList.next_offset;
                        var newPreviousOffset = (offset - RowsPerPageInListViews);
                        AccountsListPrevOffset = newPreviousOffset;
                    }
                }
            }
            /* Hide the loading panel */
            $.mobile.pageLoading(true);
        });
    }
}


/*
* CE Mobile CRM : SugarCrmGetAccountDetails
* This Global method is called on the onclick event for each
* of the list view rows as well as any hyperlinks to a
* specific account. It calls the REST API then
* appends the details to the Account details screen
*/
function SugarCrmGetAccountDetails() {
    $('#ViewAccountDetailsPageDetailsList li').remove();
    $('#AccountNameH1').html('');
    $('#AccountDescriptionP').text('');
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","id":"' + CurrentAccountId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data !== undefined) {
            var accountsList = jQuery.parseJSON(data);
            if ((accountsList.name !== undefined) && (accountsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountsList !== undefined) && (accountsList.entry_list !== undefined)) {
                if (accountsList.entry_list[0] !== undefined) {
                    var account = accountsList.entry_list[0];
                    /* Set the Acccount Name and Description */
                    $('#AccountNameH1').html(account.name_value_list.name.value);
                    $('#AccountDescriptionP').text(account.name_value_list.description.value);
                    /* Now start appending details and divider rows to the informaiton list */
                    $('#ViewAccountDetailsPageDetailsList').append("<li data-role=\"list-divider\">Account Overview</li>");
                    /* Build the hyperlink of the phone number removing any special characters */
                    var officePhoneLi = $("<li/>");
                    var officePhoneLinkUrl = account.name_value_list.phone_office.value.replace('(','');
                    officePhoneLinkUrl = officePhoneLinkUrl.replace(')','');
                    officePhoneLinkUrl = officePhoneLinkUrl.replace(' ','');
                    officePhoneLinkUrl = officePhoneLinkUrl.replace('-','');
                    officePhoneLinkUrl = officePhoneLinkUrl.replace('+1','');
                    var officePhoneHeader = "<h4>" + account.name_value_list.phone_office.value + "</h4>";
                    var officePhoneParagraph = "<p><br />Office Phone</p>";
                    var officePhoneLink = $('<a/>', {
                        href: "tel:+1" + officePhoneLinkUrl,
                        rel: "external",
                        "style": "text-decoration:none;color:#444;",
                        click: function() {
                            var answer = confirm("Log this call?");
                            if (answer) {
                                LogCall("Accounts",CurrentAccountId);
                                return true;
                            }
                            else { return true; }
                        }
                    });
                    officePhoneLink.append(officePhoneParagraph);
                    officePhoneLink.append(officePhoneHeader);
                    officePhoneLi.append(officePhoneLink);
                    /* Now append it to the list of details */
                    if (account.name_value_list.phone_office.value !== "") {
                        $('#ViewAccountDetailsPageDetailsList').append(officePhoneLi);
                    }
                    /* Web site hyperlink */
                    if (account.name_value_list.website.value !== "") {
                        var formattedUrl = "";
                        if (account.name_value_list.website.value.substring(0, 4) !== "http") {
                            formattedUrl = "http://" + account.name_value_list.website.value;
                        } else { formattedUrl = account.name_value_list.website.value; }
                        var webSiteLi = $("<li/>");
                        var webSiteHeader = "<h4>" + account.name_value_list.website.value + "</h4>";
                        var webSiteParagraph = "<p><br />Web Site</p>";
                        var webSiteLink = $('<a/>', {
                            href: formattedUrl,
                            rel: "external",
                            target: "_new",
                            "style": "text-decoration:none;color:#444;"
                        });
                        webSiteLink.append(webSiteParagraph);
                        webSiteLink.append(webSiteHeader);
                        webSiteLi.append(webSiteLink);
                        $('#ViewAccountDetailsPageDetailsList').append(webSiteLi);
                    }
                    /* Append the Fax number */
                    var FaxLi = $("<li/>");
                    var FaxHeader = "<h4>" + account.name_value_list.phone_fax.value + "</h4>";
                    var FaxParagraph = "<p>Fax</p>";
                    FaxLi.append(FaxHeader);
                    FaxLi.append(FaxParagraph);
                    if (account.name_value_list.phone_fax.value !== "") {
                        $('#ViewAccountDetailsPageDetailsList').append(FaxLi);
                    }
                    /* Append the Billing Address */
                    var accountBillingAddressLi = $("<li/>");
                    var accountBillingAddressStreet = account.name_value_list.billing_address_street.value;
                    var accountBillingAddressCity = account.name_value_list.billing_address_city.value;
                    var accountBillingAddressState = account.name_value_list.billing_address_state.value;
                    var accountBillingAddressPostalCode = account.name_value_list.billing_address_postalcode.value;
                    var accountBillingAddressCountry = account.name_value_list.billing_address_country.value;
                    var accountBillingAddressUrl = "http://maps.google.com/?q=" + accountBillingAddressStreet + "%20" +
                    accountBillingAddressCity +"%20" +  accountBillingAddressState + "%20" + accountBillingAddressPostalCode + "&t=m&z=13";
                    var billingAddressHeader = "<h4>" + accountBillingAddressStreet + "<br />" + accountBillingAddressCity + ", " + accountBillingAddressState +
                    " " + accountBillingAddressPostalCode + "<br />" + accountBillingAddressCountry + "</h4>";
                    var billingAddressP = "<p><br />Billing Address</p>";
                    var billingAddressLink = $('<a/>', {
                        href: accountBillingAddressUrl,
                        rel: "external",
                        target: "_new",
                        "style": "text-decoration:none;color:#444;"
                    });
                    billingAddressLink.append(billingAddressP);
                    billingAddressLink.append(billingAddressHeader);
                    accountBillingAddressLi.append(billingAddressLink);
                    if ((accountBillingAddressStreet !== "") || (accountBillingAddressCity !== "")
                        || (accountBillingAddressState !== "") || (accountBillingAddressPostalCode !== "")
                        || (accountBillingAddressCountry !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append(accountBillingAddressLi);
                    }
                    /* Shipping Address */
                    var accountShippingAddressLi = $("<li/>");
                    var accountShippingAddressStreet = account.name_value_list.shipping_address_street.value;
                    var accountShippingAddressCity = account.name_value_list.shipping_address_city.value;
                    var accountShippingAddressState = account.name_value_list.shipping_address_state.value;
                    var accountShippingAddressPostalCode = account.name_value_list.shipping_address_postalcode.value;
                    var accountShippingAddressCountry = account.name_value_list.shipping_address_country.value;
                    var accountShippingAddressUrl = "http://maps.google.com/?q=" + accountShippingAddressStreet + "%20" +
                    accountShippingAddressCity + "%20" + accountShippingAddressState + "%20" + accountShippingAddressPostalCode + "&t=m&z=13";
                    var shippingAddressHeader = "<h4>" + accountShippingAddressStreet + "<br />" + accountShippingAddressCity + ", " + accountShippingAddressState +
                    " " + accountShippingAddressPostalCode + "<br />" + accountShippingAddressCountry + "</h4>";
                    var shippingAddressP = "<p><br />Shipping Address</p>";
                    var shippingAddressLink = $('<a/>', {
                        href: accountShippingAddressUrl,
                        rel: "external",
                        target: "_new",
                        "style": "text-decoration:none;color:#444;"
                    });
                    shippingAddressLink.append(shippingAddressP);
                    shippingAddressLink.append(shippingAddressHeader);
                    accountShippingAddressLi.append(shippingAddressLink);
                    accountBillingAddressLi.append(billingAddressLink);
                    if ((accountShippingAddressStreet !== "") || (accountShippingAddressCity !== "")
                        || (accountShippingAddressState !== "") || (accountShippingAddressPostalCode !== "")
                        || (accountShippingAddressCountry !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append(accountShippingAddressLi);
                    }
                    /* Append the Email Address */
                    var emailLi = $("<li/>");
                    var emailParagraph = "<p><br />Email</p>";
                    var emailHeader = "<h4>" + account.name_value_list.email1.value + "</h4>";
                    var emailLink = $('<a/>', {
                        href: "mailto:" + account.name_value_list.email1.value,
                        rel: "external",
                        "style": "text-decoration:none;color:#444;"
                    });
                    emailLink.append(emailParagraph);
                    emailLink.append(emailHeader);
                    emailLi.append(emailLink);
                    if (account.name_value_list.email1.value !== "") {
                        $('#ViewAccountDetailsPageDetailsList').append(emailLi);
                    }
                    /* Append the deivider for the More Information Section */
                    $('#ViewAccountDetailsPageDetailsList').append("<li data-role=\"list-divider\">More Information</li>");
                    if ((account.name_value_list.account_type !== undefined) && (account.name_value_list.account_type.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Account Type</p><h4>" + account.name_value_list.account_type.value + "</h4></li>");
                    }
                    if ((account.name_value_list.industry !== undefined) && (account.name_value_list.industry.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Industry</p><h4>" + account.name_value_list.industry.value + "</h4></li>");
                    }
                    if ((account.name_value_list.annual_revenue !== undefined) && (account.name_value_list.annual_revenue.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Annual Revenue</p><h4>" + account.name_value_list.annual_revenue.value + "</h4></li>");
                    }
                    if ((account.name_value_list.employees !== undefined) && (account.name_value_list.employees.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Employees</p><h4>" + account.name_value_list.employees.value + "</h4></li>");
                    }
                    if ((account.name_value_list.sic_code !== undefined) && (account.name_value_list.sic_code.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><P><br />SIC Code</p><h4>" + account.name_value_list.sic_code.value + "</h4></li>");
                    }
                    if ((account.name_value_list.ticker_symbol !== undefined) && (account.name_value_list.ticker_symbol.value != "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Ticker Symbol</p><h4>" + account.name_value_list.ticker_symbol.value + "</h4></li>");
                    }
                    if ((account.name_value_list.parent_name !== undefined) && (account.name_value_list.parent_name.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Member of</p><h4>" + account.name_value_list.parent_name.value + "</h4></li>");
                    }
                    if ((account.name_value_list.ownership !== undefined) && (account.name_value_list.ownership.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Ownership</p><h4>" + account.name_value_list.ownership.value + "</h4></li>");
                    }
                    if ((account.name_value_list.campaign_name !== undefined) && (account.name_value_list.campaign_name.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Campaign</p><h4>" + account.name_value_list.campaign_name.value + "</h4></li>");
                    }
                    if ((account.name_value_list.rating !== undefined) && (account.name_value_list.rating.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Rating</p><h4>" + account.name_value_list.rating.value + "</h4></li>");
                    }
                    $('#ViewAccountDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other</li>");
                    if ((account.name_value_list.assigned_user_name !== undefined) && (account.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + account.name_value_list.assigned_user_name.value + "</h4></li>");
                    }
                    if ((account.name_value_list.date_modified !== undefined) && (account.name_value_list.date_modified.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + account.name_value_list.date_modified.value + "</h4></li>");
                    }
                    if ((account.name_value_list.date_entered !== undefined) && (account.name_value_list.date_entered.value !== "")) {
                        $('#ViewAccountDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + account.name_value_list.date_entered.value + " by " + account.name_value_list.created_by_name.value + "</h4></li>");
                    }
                }
            }
        }
        $('#ViewAccountDetailsPageDetailsList').listview("refresh");
    });
    $('#ViewAccountDetailsPageContactsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageContactsListUl').append("<li data-role=\"list-divider\">Contacts</li>");
        if (data !== undefined) {
            var accountContactsList = jQuery.parseJSON(data);
            if ((accountContactsList.name !== undefined) && (accountContactsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountContactsList !== undefined) && (accountContactsList.entry_list !== undefined)) {
                if (accountContactsList.entry_list.length>0)
                {
                    var intAccountContact = 0;
                    for(intAccountContact=0;intAccountContact<=accountContactsList.entry_list.length;intAccountContact++)
                    {
                        if (accountContactsList.entry_list[intAccountContact] !== undefined) {
                            var accountConctact = accountContactsList.entry_list[intAccountContact];
                            var accountContactListItem = $("<li/>");
                            var accountContactHeader = "<h4>" + accountConctact.name_value_list.first_name.value + "&nbsp;" + accountConctact.name_value_list.last_name.value + "</h4>";
                            var accountContactParagraph = "<p>" + accountConctact.name_value_list.title.value + "</p>";

                            var accountContactLink = $("<a/>", {
                                href: "#",
                                "data-identity": accountConctact.id,
                                click: function() {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage('ViewContactDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetContactDetails();
                                }
                            });
                            accountContactLink.append( accountContactHeader );
                            accountContactLink.append(accountContactParagraph);
                            accountContactListItem.append( accountContactLink );
                            $('#ViewAccountDetailsPageContactsListUl').append(accountContactListItem);
                        }
                    }
                }
                else {
                    var accountContactEmptyListItem = $("<li/>");
                    var accountContactEmptyListHeader = "<h4>No Data</h4>";
                    accountContactEmptyListItem.append(accountContactEmptyListHeader);
                    $('#ViewAccountDetailsPageContactsListUl').append(accountContactEmptyListItem);
                }
            }
            $('#ViewAccountDetailsPageContactsListUl').listview("refresh");
        }
    });

    $('#ViewAccountDetailsPageOpportunitiesListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"opportunities","related_module_query":"","related_fields":["id","name","sales_stage"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageOpportunitiesListUl').append("<li data-role=\"list-divider\">Opportunities</li>");
        if (data !== undefined) {
            var accountOpportunitiesList = jQuery.parseJSON(data);
            if ((accountOpportunitiesList.name !== undefined) && (accountOpportunitiesList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountOpportunitiesList !== undefined) && (accountOpportunitiesList.entry_list !== undefined)) {
                if (accountOpportunitiesList.entry_list.length>0)
                {
                    var intAccountOpportunity = 0;
                    for(intAccountOpportunity=0;intAccountOpportunity<=accountOpportunitiesList.entry_list.length;intAccountOpportunity++)
                    {
                        if (accountOpportunitiesList.entry_list[intAccountOpportunity] !== undefined) {
                            var accountOpportunity = accountOpportunitiesList.entry_list[intAccountOpportunity];
                            var accountOpportunityListItem = $("<li/>");
                            var accountOpportunityHeader = "<h4>" + accountOpportunity.name_value_list.name.value + "</h4>";
                            var accountOpportunityParagraph = "<p>" + accountOpportunity.name_value_list.sales_stage.value + "</p>";

                            var accountOpportunityLink = $('<a/>', {
                                href: "#",
                                "data-identity": accountOpportunity.id,
                                click: function() {
                                    CurrentOpportunityId = $(this).data("identity");
                                    $.mobile.changePage('ViewOpportunityDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetOpportunityDetails();
                                }
                            });
                            accountOpportunityLink.append( accountOpportunityHeader );
                            accountOpportunityLink.append(accountOpportunityParagraph);
                            accountOpportunityListItem.append( accountOpportunityLink );
                            $('#ViewAccountDetailsPageOpportunitiesListUl').append(accountOpportunityListItem);
                        }
                    }
                }
                else {
                    var accountOpportunityEmptyListItem = $("<li/>");
                    var accountOpportunityEmptyListHeader = "<h4>No Data</h4>";
                    accountOpportunityEmptyListItem.append(accountOpportunityEmptyListHeader);
                    $('#ViewAccountDetailsPageOpportunitiesListUl').append(accountOpportunityEmptyListItem);
                }
            }
        }
        $('#ViewAccountDetailsPageOpportunitiesListUl').listview("refresh");
    });

    $('#ViewAccountDetailsPageLeadsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
        if (data !== undefined) {
            var accountLeadsList = jQuery.parseJSON(data);
            if ((accountLeadsList.name !== undefined) && (accountLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountLeadsList !== undefined) && (accountLeadsList.entry_list !== undefined)) {
                if (accountLeadsList.entry_list.length>0)
                {
                    var intAccountLead = 0;
                    for(intAccountLead=0;intAccountLead<=accountLeadsList.entry_list.length;intAccountLead++)
                    {
                        if (accountLeadsList.entry_list[intAccountLead] !== undefined) {
                            var accountLead = accountLeadsList.entry_list[intAccountLead];
                            var accountLeadListItem = $("<li/>");
                            var accountLeadHeader = "<h4>" + accountLead.name_value_list.first_name.value + " " + accountLead.name_value_list.last_name.value + "</h4>";
                            var accountLeadParagraph = '';
                            if (accountLead.name_value_list.title !== undefined) {
                                accountLeadParagraph = "<p>" + accountLead.name_value_list.title.value + "</p>";
                            } else {
                                accountLeadParagraph = "<p></p>";
                            }
                            var accountLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": accountLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('ViewLeadDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            accountLeadLink.append( accountLeadHeader );
                            accountLeadLink.append(accountLeadParagraph);
                            accountLeadListItem.append( accountLeadLink );
                            $('#ViewAccountDetailsPageLeadsListUl').append(accountLeadListItem);
                        }
                    }
                }
                else {
                    var accountLeadEmptyListItem = $("<li/>");
                    var accountLeadEmptyListHeader = "<h4>No Data</h4>";
                    accountLeadEmptyListItem.append(accountLeadEmptyListHeader);
                    $('#ViewAccountDetailsPageLeadsListUl').append(accountLeadEmptyListItem);
                }
            }
        }
        $('#ViewAccountDetailsPageLeadsListUl').listview("refresh");
    });


    $('#ViewAccountDetailsPageCallsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Accounts",' +
        '"module_id":"' + CurrentAccountId + '",' +
        '"link_field_name":"calls",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageCallsListUl').append("<li data-role=\"list-divider\">Calls</li>");
        if (data !== undefined) {
            var accountCallsList = jQuery.parseJSON(data);
            if ((accountCallsList.name !== undefined) && (accountCallsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountCallsList !== undefined) && (accountCallsList.entry_list !== undefined)) {
                if (accountCallsList.entry_list.length>0)
                {
                    var intAccountCall = 0;
                    for(intAccountCall=0;intAccountCall<=accountCallsList.entry_list.length;intAccountCall++)
                    {
                        if (accountCallsList.entry_list[intAccountCall] !== undefined) {
                            var accountCall = accountCallsList.entry_list[intAccountCall];
                            var accountCallListItem = $("<li/>");
                            var accountCallHeader = "<h4>" + accountCall.name_value_list.name.value + "</h4>";
                            var accountCallParagraph = '';
                            if (accountCall.name_value_list.status !== undefined) {
                                accountCallParagraph = "<p>" + accountCall.name_value_list.status.value;
                                accountCallParagraph+="<br/>" + accountCall.name_value_list.date_start.value;
                                accountCallParagraph+="</p>";
                            }
                            var accountCallLink = $("<a/>", {
                                href: "#",
                                "data-identity": accountCall.id,
                                click: function() {
                                    CurrentCallId = $(this).data("identity");
                                    $.mobile.changePage('ViewCallDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetCallDetails();
                                }
                            });
                            accountCallLink.append( accountCallHeader );
                            if (accountCall.name_value_list.status !== undefined) {
                                accountCallLink.append(accountCallParagraph);
                            }
                            accountCallListItem.append(accountCallLink);
                            $('#ViewAccountDetailsPageCallsListUl').append(accountCallListItem);
                        }
                    }
                }
                else {
                    var accountCallEmptyListItem = $("<li/>");
                    var accountCallEmptyListHeader = "<h4>No Data</h4>";
                    accountCallEmptyListItem.append(accountCallEmptyListHeader);
                    $('#ViewAccountDetailsPageCallsListUl').append(accountCallEmptyListItem);
                }
            }
        }
        $('#ViewAccountDetailsPageCallsListUl').listview("refresh");
    });

    $('#ViewAccountDetailsPageMeetingsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Accounts",' +
        '"module_id":"' + CurrentAccountId + '",' +
        '"link_field_name":"meetings",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageMeetingsListUl').append("<li data-role=\"list-divider\">Meetings</li>");
        if (data !== undefined) {
            var accountMeetingsList = jQuery.parseJSON(data);
            if ((accountMeetingsList.name !== undefined) && (accountMeetingsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountMeetingsList !== undefined) && (accountMeetingsList.entry_list !== undefined)) {
                if (accountMeetingsList.entry_list.length>0)
                {
                    var intAccountMeeting = 0;
                    for(intAccountMeeting=0;intAccountMeeting<=accountMeetingsList.entry_list.length;intAccountMeeting++)
                    {
                        if (accountMeetingsList.entry_list[intAccountMeeting] !== undefined) {
                            var accountMeeting = accountMeetingsList.entry_list[intAccountMeeting];
                            var accountMeetingListItem = $("<li/>");
                            var accountMeetingHeader = "<h4>" + accountMeeting.name_value_list.name.value + "</h4>";
                            var accountMeetingParagraph = '';
                            if (accountMeeting.name_value_list.status !== undefined) {
                                accountMeetingParagraph = "<p>" + accountMeeting.name_value_list.status.value;
                                if (accountMeeting.name_value_list.date_start !== undefined) {
                                    accountMeetingParagraph+="<br/>" + accountMeeting.name_value_list.date_start.value;
                                }
                                accountMeetingParagraph+="</p>";
                            } else {
                                accountMeetingParagraph = "<p></p>";
                            }

                            var accountMeetingLink = $("<a/>", {
                                href: "#",
                                "data-identity": accountMeeting.id,
                                click: function() {
                                    CurrentMeetingId = $(this).data("identity");
                                    $.mobile.changePage('ViewMeetingDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetMeetingDetails();
                                }
                            });
                            accountMeetingLink.append( accountMeetingHeader );
                            accountMeetingLink.append(accountMeetingParagraph);
                            accountMeetingListItem.append( accountMeetingLink );
                            $('#ViewAccountDetailsPageMeetingsListUl').append(accountMeetingListItem);
                        }
                    }
                }
                else {
                    var accountMeetingEmptyListItem = $("<li/>");
                    var accountMeetingEmptyListHeader = "<h4>No Data</h4>";
                    accountMeetingEmptyListItem.append(accountMeetingEmptyListHeader);
                    $('#ViewAccountDetailsPageMeetingsListUl').append(accountMeetingEmptyListItem);
                }
            }
        }
        $('#ViewAccountDetailsPageMeetingsListUl').listview("refresh");
    });

    $('#ViewAccountDetailsPageTasksListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Accounts",' +
        '"module_id":"' + CurrentAccountId + '",' +
        '"link_field_name":"tasks",' +
        '"related_module_query":"",' +
        '"related_fields":["id","name","status","date_start"],' +
        '"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        $('#ViewAccountDetailsPageTasksListUl').append("<li data-role=\"list-divider\">Tasks</li>");
        if (data !== undefined) {
            var accountTasksList = jQuery.parseJSON(data);
            if ((accountTasksList.name !== undefined) && (accountTasksList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((accountTasksList !== undefined) && (accountTasksList.entry_list !== undefined)) {
                if (accountTasksList.entry_list.length>0)
                {
                    var intAccountTask = 0;
                    for(intAccountTask=0;intAccountTask<=accountTasksList.entry_list.length;intAccountTask++)
                    {
                        if (accountTasksList.entry_list[intAccountTask] !== undefined) {
                            var accountTask = accountTasksList.entry_list[intAccountTask];
                            var accountTaskListItem = $("<li/>");
                            var accountTaskHeader = "<h4>" + accountTask.name_value_list.name.value + "</h4>";
                            var accountTaskParagraph = '';
                            if (accountTask.name_value_list.status !== undefined) {
                                accountTaskParagraph = "<p>" + accountTask.name_value_list.status.value;
                                if (accountTask.name_value_list.date_start !== undefined) {
                                    accountTaskParagraph+="<br/>" + accountTask.name_value_list.date_start.value;
                                }
                                accountTaskParagraph+="</p>";
                            } else {
                                accountTaskParagraph = "<p></p>";
                            }

                            var accountTaskLink = $("<a/>", {
                                href: "#",
                                "data-identity": accountTask.id,
                                click: function() {
                                    CurrentTaskId = $(this).data("identity");
                                    $.mobile.changePage('ViewTaskDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetTaskDetails();
                                }
                            });
                            accountTaskLink.append( accountTaskHeader );
                            accountTaskLink.append(accountTaskParagraph);
                            accountTaskListItem.append( accountTaskLink );
                            $('#ViewAccountDetailsPageTasksListUl').append(accountTaskListItem);
                        }
                    }
                }
                else {
                    var accountTaskEmptyListItem = $("<li/>");
                    var accountTaskEmptyListHeader = "<h4>No Data</h4>";
                    accountTaskEmptyListItem.append(accountTaskEmptyListHeader);
                    $('#ViewAccountDetailsPageTasksListUl').append(accountTaskEmptyListItem);
                }
            }
        }
        $('#ViewAccountDetailsPageTasksListUl').listview("refresh");
        $.mobile.pageLoading(true);
    });
}


