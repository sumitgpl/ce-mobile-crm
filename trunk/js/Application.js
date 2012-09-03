/* DO NOT CHANGE VERSION INFORMATION IT IS SET BY THE MAKEFILE */
var applicationVersion="DEV";
var SugarSessionId = '';
var RowsPerPageInListViews = 20;
/* Set the Global Current Record Id Variables */
var CurrentAccountId = '';
var CurrentContactId = '';
var CurrentOpportunityId = '';
var CurrentLeadId = '';
var CurrentCallId = '';
var CurrentMeetingId = '';
var CurrentTaskId = '';
/*Set the Account List Global Variables */
var AccountsListNextOffset = 0;
var AccountsListPrevOffset = 0;
var AccountsListCurrentOffset = 0;
/*Set the Contact List Global Variables */
var ContactsListNextOffset = 0;
var ContactsListPrevOffset = 0;
var ContactsListCurrentOffset = 0;
/*Set the Opportunity List Global Variables */
var OpportunitiesListNextOffset = 0;
var OpportunitiesListPrevOffset = 0;
var OpportunitiesListCurrentOffset = 0;
/*Set the Lead List Global Variables */
var LeadsListNextOffset = 0;
var LeadsListPrevOffset = 0;
var LeadsListCurrentOffset = 0;
/*Set the Call List Global Variables */
var CallsListNextOffset = 0;
var CallsListPrevOffset = 0;
var CallsListCurrentOffset = 0;
/*Set the Meeting List Global Variables */
var MeetingsListNextOffset = 0;
var MeetingsListPrevOffset = 0;
var MeetingsListCurrentOffset = 0;
/*Set the Task List Global Variables */
var TasksListNextOffset = 0;
var TasksListPrevOffset = 0;
var TasksListCurrentOffset = 0;
/* Set the Note Global Variables */
var CurrentNoteId = '';
var CurrentProtocol = 'HTTPS';
var CurrentServerAddress = '..';
var currentLocale = "en_US";
var currentCurrencyId = "";
var currentCurrencyName = "";
var currentLatitude = "";
var currentLongitude = "";
var currentStreet = "";
var currentCity = "";
var currentState = "";
var currentPostalCode = "";
var currentCountry = "";

$('#LoginPage').live('pagecreate',function(event,ui) {
    if ((getURLParameter("localeInfo") !== null) && (getURLParameter("localeInfo").length > 0)) {
        currentLocale = getURLParameter("localeInfo");
    }
    $.ajaxSetup({
        async:false
    });
    $.getScript('l10n/ui_resources_' + currentLocale + '.js').done(processLanaguageFile());
    $.ajaxSetup({
        async:true
    });
});


$('#LoginPage').live('pageshow',function(event,ui) {
    var username = getCookie("username");
    if (username!=null && username!="") {
        $('#SettingsPageSugarCrmUsername').val(username);
    }
    /* Check all input controls that hava a data-validation rule and bind the appropriate regular expression checking */
    $('input[data-validation]').each(function(index,item){
        if ($(item).attr('data-validation') !== "") {
            $(item).bind('change',function(){
                if ($(this).val().match($(this).attr('data-validation')) !== null) {
                    $(this).removeClass('invalid');
                } else {
                    $(this).addClass('invalid');
                }
            });
        }
    });
});

$('#HomePage').live('pageshow',function(event,ui){

    });

$('#AboutPage').live('pagecreate',function(event,ui) {
    $('#ViewAboutApplicationPageTitle').text(RES_ABOUT_APPLICATION_HEADER);
    $('#AboutApplicationParagraph').text(RES_LOGIN_PAGE_HEADER + " " + RES_CURRENT_VERSION_NUMBER);
});

$('#AddNewSelectTypePage').live('pagecreate',function(event,ui) {
    $('#SelectNewRecordTypeHeader').text(RES_SELECT_NEW_TYPE);
    $('#CreateNewAccountButton').text(RES_ACCOUNT_LABEL);
    $('#CreateNewContactButton').text(RES_CONTACT_LABEL);
    $('#CreateNewOpportunityButton').text(RES_OPPORTUNITY_LABEL);
    $('#CreateNewLeadButton').text(RES_LEAD_LABEL);
    $('#CreateNewCallButton').text(RES_CALL_LABEL);
    $('#CreateNewMeetingButton').text(RES_MEETING_LABEL);
    $('#CreateNewTaskButton').text(RES_TASK_LABEL);
});

$('#HomePage').live('pagecreate',function(event,ui) {
    $('#HomePage').page();
});

/* Set Page Bindings for each of the List Pages */
$('#AccountsListPage').live('pageshow',function(event, ui){
    SugarCrmGetAccountsListFromServer(AccountsListCurrentOffset);
});

$('#ContactsListPage').live('pageshow',function(event,ui) {
    SugarCrmGetContactListFromServer(ContactsListCurrentOffset);
});

$('#OpportunitiesListPage').live('pageshow',function(event,ui) {
    SugarCrmGetOpportunitiesListFromServer(OpportunitiesListCurrentOffset);
});

$('#LeadsListPage').live('pageshow',function(event,ui) {
    SugarCrmGetLeadsListFromServer(LeadsListCurrentOffset);
});

$('#CallsListPage').live('pageshow',function(event,ui) {
    SugarCrmGetCallsListFromServer(CallsListCurrentOffset);
});

$('#MeetingsListPage').live('pageshow',function(event,ui) {
    SugarCrmGetMeetingsListFromServer(MeetingsListCurrentOffset);
});

$('#TasksListPage').live('pageshow',function(event,ui) {
    SugarCrmGetTasksListFromServer(TasksListCurrentOffset);
});

$('#SearchListPage').live('pagecreate',function(event,ui) {
    getAvailableSearchModules();
    $('#SearchPageHeader').text(RES_SEARCH_PAGE_HEADER);
    $('#SearchModulesLabel').html(RES_SELECT_MODULES_TO_SEARCH);
    $('#SearchPagePerformSearchButton').text(RES_SEARCH_PAGE_BUTTON);
});

$('#SearchResultsPage').live('pageshow',function(event,ui){
    SearchByModule();
});
/* Redirect to the Login Page if no session exists */
$('#HomePage').live('pageshow',function(event,ui) {
    if (SugarSessionId === '') {
        $.mobile.changePage('#LoginPage');
    }
});

/* Login function used to log the user in and establish session */
function LoginUser(noEncryption) {
    $('#LoginPageLoginForm input').each(function(item,index){
        $(item).change();
    });
    if ($('#LoginPageLoginForm .invalid').length <= 0) {
        $.mobile.showPageLoadingMsg();
        var enteredUsername = "";
        if ($('#SettingsPageSugarCrmSaveSettings').attr('checked',true)) {
            setCookie("username",$('#SettingsPageSugarCrmUsername').val(),365);
            enteredUsername = getCookie("username");
            setCookie("serveraddress",CurrentServerAddress,365);
        } else {
            enteredUsername = $('#SettingsPageSugarCrmSaveSettings').val();
        }
    
        var enteredPassword = $('#SettingsPageSugarCrmPassword').val();
        var password = enteredPassword;

        if (noEncryption==undefined) password = $.md5(password);

        $.get(CurrentServerAddress + '/service/v2/rest.php', {
            method: "login",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '[{"password":"' + password + '","user_name":"' + enteredUsername + '"},"SugarCrm",{"name":"language","value":"en_US"}]'
        },
        function(data) {
            if (data !== "") {
                var loginResult = jQuery.parseJSON(data);
                if ((loginResult.name !== undefined) && (loginResult.name === 'Invalid Login')) {
                    if (noEncryption==undefined) { // invalid login, try with non encrypted password (LDAP auth) @TODO check security (https needed ?)
                        LoginUser(true);
                    }
                    else {
                        $.mobile.hidePageLoadingMsg();
                        alert('Login Failed');
                    }
                }
                else {
                    SugarSessionId = loginResult.id;
                    currentLocale = loginResult.name_value_list.user_language.value;
                    currentCurrencyId = loginResult.name_value_list.user_currency_id.value;
                    currentCurrencyName = loginResult.name_value_list.user_currency_name.value;
                    $('#SettingsPageSugarCrmUsername').val('');
                    $('#SettingsPageSugarCrmPassword').val('');
                    $.ajaxSetup({
                        async:false
                    });
                    $.getScript('l10n/ui_resources_' + currentLocale + '.js',processLanaguageFile());
                    $.ajaxSetup({
                        async:true
                    });
                    $.mobile.hidePageLoadingMsg();
                    $.mobile.changePage('#HomePage');
                }
            }
            else {
                $.mobile.hidePageLoadingMsg();
                alert('An unexpected error occurred logging in.');
            }
        });
    } else {
        $.mobile.hidePageLoadingMsg();
        alert(RES_ADD_NEW_ACCOUNT_VALIDATION_FAILED);
    }
}

/* Bind the Window Before Load event to log the user out */
window.onbeforeunload = function() {
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "logout",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    });
    return;
};

function validateLoginFields() {
    if (($('#SettingsPageSugarCrmUsername').val().length > 0) && ($('#SettingsPageSugarCrmPassword').val().length > 0)) {
        return true;
    } else {
        $('#SettingsPageSugarCrmUsername').change();
        $('#SettingsPageSugarCrmPassword').change();
        return false;
    }
}

function LogOutUser() {
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "logout",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    },function(data) {
        $.mobile.changePage('#LoginPage', {
            reverse: "true"
        } );
    });
}

function LogCall(moduleName,uniqueId,subject) {
    $.get(CurrentServerAddress + '/service/v2/rest.php', {
        method: "set_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"Calls",' +
        '"name_value_list":[' +
        '{"name":"name","value":"' + subject + '"},' +
        '{"name":"direction","value":"Outbound"},' +
        '{"name":"parent_type","value":"' + moduleName + '"},' +
        '{"name":"parent_id","value":"' + uniqueId + '"},' +
        '{"name":"status","value":"Held"},' +
        '{"name":"duration_hours","value":0},' +
        '{"name":"duration_minutes","value":0}]}'
    }, function(data) {
        if (data !== undefined) {
            var newCall = jQuery.parseJSON(data);
        }
    });
}



$('#CreateNewAccountPage').live('pagecreate',function(event,ui) {
    getCurrentLocation();
});

$('#CreateNewContactPage').live('pagecreate',function(event,ui) {

    });

$('#CreateNewOpportunityPage').live('pagecreate',function(event,ui) {
    $('#NewOpportunityNameLabel').text(RES_NEW_OPPORTUNITY_NAME_LABEL);
    $('#NewOpportunityNameTextBox').attr('placeholder',RES_NEW_OPPORTUNITY_NAME_LABEL);
    $('#NewOpportunityAccountNameLabel').text(RES_ACCOUNT_NAME_LABEL);
    $('#NewOpportunityAccountNameTextBox').attr('placeholder',RES_ACCOUNT_NAME_LABEL);
    $('#NewOpportunityCurrencyLabel').text(RES_CURRENCY_LABEL);
});

$('#CreateNewLeadPage').live('pagecreate',function(event,ui) {

    });

$('#CreateNewCallPage').live('pagecreate',function(event,ui) {

    });

$('#CreateNewMeetingPage').live('pagecreate',function(event,ui) {

    });

$('#CreateNewTaskPage').live('pagecreate',function(event,ui) {

    });




function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }
}

function showInformationDialog(title,msg) {
    $('#InformationDialogPageHeader').text(title);
    $('#InformationDialogPageMessage').text(msg);
    $.mobile.changePage('#InformationDialogPage');
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function enableFullScreenView() {
    $(window).scroll(function(e) {
        if ($(window).scrollTop() <= 50) {
            window.scrollTo(0, 1);
        }
    });
}

function isDeviceOnline() {
    if (navigator.onLine !== undefined) {
        return navigator.onLine;
    } else {
        return true;
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successfullyObtainedPosition, errorObtainingPosition);
    }
}

function successfullyObtainedPosition(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    var requestStringData = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + currentLatitude + '&lon=' + currentLongitude + '&zoom=18&addressdetails=1';
    $.ajax({
        url: requestStringData,
        crossDomain: true,
        dataType: 'json',
        success: gotTheAddress
    });
}
function gotTheAddress(data) {
    if (data.address.house_number !== undefined)
    {
        currentStreet = data.address.house_number  + " " + data.address.road;
    } else
{
        currentStreet = data.address.road;
    }
    currentCity = data.address.city;
    currentState = data.address.state;
    currentPostalCode = data.address.postcode;
    currentCountry= data.address.country;
}

function errorObtainingPosition(msg) {
    alert(RES_NOTIFICATION_GEOLOCATE_ERROR);
}

/* This function loads or reloads all of the labels based on current language */
function processLanaguageFile() {
    $('.BackButton').text(RES_ACTION_BACK);
    $('.AboutApplicationClass').text(RES_ABOUT_APPLICATION_MENU_ITEM);
    $('.AboutApplicationClass .ui-btn-text').text(RES_ABOUT_APPLICATION_MENU_ITEM);
    $('#SearchResultsPageHeader').text(RES_SEARCH_RESULTS_TITLE);
    $('#UsernameLabel').text(RES_USERNAME_LABEL);
    $('#UsernameLabel').text(RES_USERNAME_LABEL);
    $('#PasswordLabel').text(RES_PASSWORD_LABEL);
    $('#LoginDescriptionParagraph').text(RES_LOGIN_MESSAGE);
    $('#LoginFormLoginButton').text(RES_LOGIN_TITLE);
    $('#LoginPageHeader').text(RES_LOGIN_PAGE_HEADER);
    $('#SettingsPageSugarCrmProtocol').text(RES_SETTINGS_PROTOCOL_SELECTION_LABEL);
    $('#SugarCrmProtocolHttpsLabel').text(RES_SETTINGS_PROTOCOL_HTTPS_LABEL);
    $('#SugarCrmProtocolHttpLabel').text(RES_SETTINGS_PROTOCOL_HTTP_LABEL);
    $('#SettingsPageSugarCrmServerAddressLabel').text(RES_SETTINGS_SERVER_ADDRESS_LABEL);
    $('#SettingsPageSugarCrmSaveSettingsLabel').text(RES_SETTINGS_SAVE_CONFIG_LABEL);
    document.title = RES_LOGIN_PAGE_HEADER;
    $(document).attr('title',RES_LOGIN_PAGE_HEADER);
    $('.SaveButtonClass').text(RES_SAVE_BUTTON);
    $('.CancelButtonClass').text(RES_CANCEL_BUTTON);
    $('.AboutApplicationClass').bind({
        click:function() {
            showInformationDialog(RES_INFO_TITLE,RES_LOGIN_PAGE_HEADER + ' ' + applicationVersion);
        }
    });
    $('.PreviousRecordsButton').text(RES_NAVIGATE_RECORDS_PREV_LABEL);
    $('.NextRecordsButton').text(RES_NAVIGATE_RECORDS_NEXT_LABEL);
    $('.EditRecordClass').text(RES_ACTION_EDIT);
    $('.DeleteRecordClass').text(RES_ACTION_DELETE);

    /* BEGIN HOME PAGE SECTION */
    $('#HomePageHeader').text(RES_LOGIN_PAGE_HEADER);
    $('.MainMenuButton').text(RES_MAIN_MENU_LABEL);
    $('#AddNewButton').text(RES_ADD_BUTTON);
    $('.LogoutButton').text(RES_LOGOUT_LABEL);
    $('#LogOutButton .ui-btn-text').text(RES_LOGOUT_LABEL);
    $('#AccountsListPageLinkLabel').text(RES_ACCOUNTS_LABEL);
    $('#ContactsListPageLinkLabel').text(RES_CONTACTS_LABEL);
    $('#OpportunitiesListPageLinkLabel').text(RES_OPPORTUNITIES_LABEL);
    $('#LeadsListPageLinkLabel').text(RES_LEADS_LABEL);
    $('#CallsListPageLinkLabel').text(RES_CALLS_LABEL);
    $('#MeetingsListPageLinkLabel').text(RES_MEETINGS_LABEL);
    $('#TasksListPageLinkLabel').text(RES_TASKS_LABEL);
    $('#AccountsListPageTitle').text(RES_ACCOUNTS_LABEL);
    $('#ContactsListPageTitle').text(RES_CONTACTS_LABEL);
    $('#OpportunitiesListPageTitle').text(RES_OPPORTUNITIES_LABEL);
    $('#LeadsListPageTitle').text(RES_LEADS_LABEL);
    $('#CallsListPageTitle').text(RES_CALLS_LABEL);
    $('#SearchListPageLinkLabel').text(RES_SEARCH_ICON_LABEL);
    $('#MeetingsListPageTitle').text(RES_MEETINGS_LABEL);
    $('#TasksListPageTitle').text(RES_TASKS_LABEL);
    $('#ViewContactDetailsPageTitle').text(RES_CONTACT_LABEL + " " + RES_DETAILS_LABEL);
    $('#ViewAccountDetailsPageTitle').text(RES_ACCOUNT_LABEL + " " + RES_DETAILS_LABEL);
    $('#ViewAboutApplicationPageTitle').text(RES_ABOUT_APPLICATION_HEADER);
    /* END HOME PAGE SECTION */

    /* BEGIN NEW ACCOUNTS SECTION */
    $('#AccountNameLabel').text(RES_NEW_ACCOUNT_NAME_LABEL);
    $('#AccountNameTextBox').attr('placeholder',RES_NEW_ACCOUNT_NAME_LABEL);
    $('#NewAccountOfficePhoneLabel').text(RES_NEW_ACCOUNT_OFFICE_PHONE_LABEL)
    $('#NewAccountOfficePhoneTextBox').attr('placeholder',RES_NEW_ACCOUNT_OFFICE_PHONE_LABEL);
    $('#NewAccountWebSiteLabel').text(RES_NEW_ACCOUNT_WEBSITE_LABEL);
    $('#NewAccountWebSiteTextBox').attr('placeholder',RES_NEW_ACCOUNT_WEBSITE_LABEL);
    $('#NewAccountPhoneFaxLabel').text(RES_NEW_ACCOUNT_PHONE_FAX_LABEL);
    $('#NewAccountPhoneFaxTextBox').attr('placeholder',RES_NEW_ACCOUNT_PHONE_FAX_LABEL);
    $('#NewAccountPrimaryEmailLabel').text(RES_PRIMARY_EMAIL_LABEL);
    $('#NewAccountPrimaryEmailTextBox').attr('placeholder',RES_PRIMARY_EMAIL_LABEL);
    $('#NewAccountDescriptionLabel').text(RES_DESCRIPTION_LABEL);
    $('#NewAccountDescriptionTextArea').attr('placeholder',RES_DESCRIPTION_LABEL);
    $('#NewAccountBillingAddressStreetLabel').text(RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewAccountBillingAddressDivider').text(RES_FIELD_LABEL_BILLING_ADDRESS);
    $('#NewAccountBillingAddressStreetTextBox').attr('placeholder',RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewAccountBillingAddressCityLabel').text(RES_NEW_ACCOUNT_CITY_LABEL)
    $('#NewAccountBillingAddressCityTextBox').attr('placeholder',RES_NEW_ACCOUNT_CITY_LABEL);
    $('#NewAccountBillingAddressStateLabel').text(RES_NEW_ACCOUNT_STATE_LABEL)
    $('#NewAccountBillingAddressStateTextBox').attr('placeholder',RES_NEW_ACCOUNT_STATE_LABEL);
    $('#NewAccountBillingAddressPostalCodeLabel').text(RES_NEW_ACCOUNT_POSTAL_CODE_LABEL)
    $('#NewAccountBillingAddressPostalCodeTextBox').attr('placeholder',RES_NEW_ACCOUNT_POSTAL_CODE_LABEL);
    $('#NewAccountBillingAddressCountryLabel').text(RES_NEW_ACCOUNT_COUNTRY_LABEL)
    $('#NewAccountBillingAddressCountryTextBox').attr('placeholder',RES_NEW_ACCOUNT_COUNTRY_LABEL);
    $('#NewAccountBillingAddressUseLocButton').text(RES_ACTION_USE_CURRENT_ADDRESS);
    $('#NewAccountShippingAddressStreetLabel').text(RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewAccountShippingAddressDivider').text(RES_FIELD_LABEL_SHIPPING_ADDRESS);
    $('#NewAccountShippingAddressStreetTextBox').attr('placeholder',RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewAccountShippingAddressCityLabel').text(RES_NEW_ACCOUNT_CITY_LABEL)
    $('#NewAccountShippingAddressCityTextBox').attr('placeholder',RES_NEW_ACCOUNT_CITY_LABEL);
    $('#NewAccountShippingAddressStateLabel').text(RES_NEW_ACCOUNT_STATE_LABEL)
    $('#NewAccountShippingAddressStateTextBox').attr('placeholder',RES_NEW_ACCOUNT_STATE_LABEL);
    $('#NewAccountShippingAddressPostalCodeLabel').text(RES_NEW_ACCOUNT_POSTAL_CODE_LABEL)
    $('#NewAccountShippingAddressPostalCodeTextBox').attr('placeholder',RES_NEW_ACCOUNT_POSTAL_CODE_LABEL);
    $('#NewAccountShippingAddressCountryLabel').text(RES_NEW_ACCOUNT_COUNTRY_LABEL)
    $('#NewAccountShippingAddressCountryTextBox').attr('placeholder',RES_NEW_ACCOUNT_COUNTRY_LABEL);
    $('#NewAccountShippingAddressUseBillingButton').text(RES_ACTION_COPY_BILLING_ADDRESS);
    $('#NewAccountMoreInformationDivider').text(RES_MORE_INFORMATION_LABEL);
    $('#NewAccountAnnualRevenueLabel').text(RES_ACCOUNT_REVENUE_LABEL)
    $('#NewAccountAnnualRevenueTextBox').attr('placeholder',RES_ACCOUNT_REVENUE_LABEL);
    $('#NewAccountSicCodeLabel').text(RES_ACCOUNT_SIC_LABEL)
    $('#NewAccountSicCodeTextBox').attr('placeholder',RES_ACCOUNT_SIC_LABEL);
    $('#NewAccountEmployeesLabel').text(RES_ACCOUNT_EMPLOYEES_LABEL)
    $('#NewAccountEmployeesTextBox').attr('placeholder',RES_ACCOUNT_EMPLOYEES_LABEL);
    $('#NewAccountTickerSymbolLabel').text(RES_ACCOUNT_TICKER_LABEL)
    $('#NewAccountTickerSymbolTextBox').attr('placeholder',RES_ACCOUNT_TICKER_LABEL);
    $('#NewAccountOwnershipLabel').text(RES_ACCOUNT_OWNERSHIP_LABEL)
    $('#NewAccountOwnershipTextBox').attr('placeholder',RES_ACCOUNT_OWNERSHIP_LABEL);
    $('#NewAccountRatingLabel').text(RES_ACCOUNT_RATING_LABEL)
    $('#NewAccountRatingTextBox').attr('placeholder',RES_ACCOUNT_RATING_LABEL);
    /* END NEW ACCOUNTS SECTION */

    /* BEGIN NEW CONTACTS SECTION */
    $('#NewContactHeader').text(RES_NEW_CONTACT_PAGE_TITLE);
    $('#ContactFirstNameLabel').text(RES_NEW_CONTACT_FIRST_NAME_LABEL);
    $('#ContactFirstNameTextBox').attr('placeholder',RES_NEW_CONTACT_FIRST_NAME_LABEL);
    $('#ContactLastNameLabel').text(RES_NEW_CONTACT_LAST_NAME_LABEL);
    $('#ContactLastNameTextBox').attr('placeholder',RES_NEW_CONTACT_LAST_NAME_LABEL);
    $('#ContactOfficePhoneLabel').text(RES_NEW_CONTACT_OFFICE_PHONE_LABEL);
    $('#ContactOfficePhoneTextBox').attr('placeholder',RES_NEW_CONTACT_OFFICE_PHONE_LABEL);
    $('#ContactMobilePhoneLabel').text(RES_NEW_CONTACT_MOBILE_PHONE_LABEL);
    $('#ContactMobilePhoneTextBox').attr('placeholder',RES_NEW_CONTACT_MOBILE_PHONE_LABEL);
    $('#ContactPhoneFaxLabel').text(RES_NEW_CONTACT_PHONE_FAX_LABEL);
    $('#ContactPhoneFaxTextBox').attr('placeholder',RES_NEW_CONTACT_PHONE_FAX_LABEL);
    $('#ContactEmailLabel').text(RES_NEW_CONTACT_EMAIL_LABEL);
    $('#ContactEmailTextBox').attr('placeholder',RES_NEW_CONTACT_EMAIL_LABEL);
    $('#ContactTitleLabel').text(RES_NEW_CONTACT_TITLE_LABEL);
    $('#ContactTitleTextBox').attr('placeholder',RES_NEW_CONTACT_TITLE_LABEL);
    $('#ContactDepartmentLabel').text(RES_NEW_CONTACT_DEPARTMENT_LABEL);
    $('#ContactDepartmentTextBox').attr('placeholder',RES_NEW_CONTACT_DEPARTMENT_LABEL);
    $('#NewContactDescriptionLabel').text(RES_DESCRIPTION_LABEL);
    $('#NewContactDescriptionTextArea').attr('placeholder',RES_DESCRIPTION_LABEL);
    $('#NewContactPrimaryAddressStreetLabel').text(RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewContactPrimaryAddressDivider').text(RES_PRIMARY_ADDRESS_LABEL);
    $('#NewContactPrimaryAddressStreetTextBox').attr('placeholder',RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewContactPrimaryAddressCityLabel').text(RES_NEW_ACCOUNT_CITY_LABEL)
    $('#NewContactPrimaryAddressCityTextBox').attr('placeholder',RES_NEW_ACCOUNT_CITY_LABEL);
    $('#NewContactPrimaryAddressStateLabel').text(RES_NEW_ACCOUNT_STATE_LABEL)
    $('#NewContactPrimaryAddressStateTextBox').attr('placeholder',RES_NEW_ACCOUNT_STATE_LABEL);
    $('#NewContactPrimaryAddressPostalCodeLabel').text(RES_NEW_ACCOUNT_POSTAL_CODE_LABEL)
    $('#NewContactPrimaryAddressPostalCodeTextBox').attr('placeholder',RES_NEW_ACCOUNT_POSTAL_CODE_LABEL);
    $('#NewContactPrimaryAddressCountryLabel').text(RES_NEW_ACCOUNT_COUNTRY_LABEL)
    $('#NewContactPrimaryAddressCountryTextBox').attr('placeholder',RES_NEW_ACCOUNT_COUNTRY_LABEL);
    $('#NewContactPrimaryAddressUseLocButton').text(RES_ACTION_USE_CURRENT_ADDRESS);
    $('#NewContactOtherAddressStreetLabel').text(RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewContactOtherAddressDivider').text(RES_OTHER_ADDRESS_LABEL);
    $('#NewContactOtherAddressStreetTextBox').attr('placeholder',RES_NEW_ACCOUNT_STREET_LABEL);
    $('#NewContactOtherAddressCityLabel').text(RES_NEW_ACCOUNT_CITY_LABEL)
    $('#NewContactOtherAddressCityTextBox').attr('placeholder',RES_NEW_ACCOUNT_CITY_LABEL);
    $('#NewContactOtherAddressStateLabel').text(RES_NEW_ACCOUNT_STATE_LABEL)
    $('#NewContactOtherAddressStateTextBox').attr('placeholder',RES_NEW_ACCOUNT_STATE_LABEL);
    $('#NewContactOtherAddressPostalCodeLabel').text(RES_NEW_ACCOUNT_POSTAL_CODE_LABEL)
    $('#NewContactOtherAddressPostalCodeTextBox').attr('placeholder',RES_NEW_ACCOUNT_POSTAL_CODE_LABEL);
    $('#NewContactOtherAddressCountryLabel').text(RES_NEW_ACCOUNT_COUNTRY_LABEL)
    $('#NewContactOtherAddressCountryTextBox').attr('placeholder',RES_NEW_ACCOUNT_COUNTRY_LABEL);
    $('#NewContactOtherAddressUseBillingButton').text(RES_ACTION_COPY_BILLING_ADDRESS);
/* END NEW CONTACTS SECTION */
}