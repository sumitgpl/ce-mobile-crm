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
var CurrentProtocol = 'HTTPS://';
var CurrentServerAddress = '';


$('#LoginPage').live('pagecreate',function(event,ui) {
    $('.AboutApplicationClass').text(RES_ABOUT_APPLICATION_MENU_ITEM);
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
    $('.SaveButtonClass').text(RES_SAVE_BUTTON);
    $('.CancelButtonClass').text(RES_CANCEL_BUTTON);
});


$('#LoginPage').live('pageshow',function(event,ui) {
    var username = getCookie("username");
    if (username!=null && username!="") {
        $('#SettingsPageSugarCrmUsername').val(username);
    }
    var serveraddress = getCookie("serveraddress");
    if ((serveraddress !== undefined) && (serveraddress !== "")) {
        var serverurl = "";
        if (serveraddress.toString().toLowerCase().indexOf("p://") > 0) {
            $('#SugarCrmProtocolHttpRadioButton').attr('checked',true).checkboxradio("refresh");
            $('#SugarCrmProtocolHttpsRadioButton').attr('checked',false).checkboxradio("refresh");
            serverurl = serveraddress.substring(7,(serveraddress.toString().length));
        } else {
            $('#SugarCrmProtocolHttpsRadioButton').attr('checked',true).checkboxradio("refresh");
            $('#SugarCrmProtocolHttpRadioButton').attr('checked',false).checkboxradio("refresh");
            serverurl = serveraddress.substring(8,(serveraddress.toString().length));
        }
        $('#SettingsPageSugarCrmServerAddress').val(serverurl);
    }
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

/* Redirect to the Login Page if no session exists */
$('#HomePage').live('pageshow',function(event,ui) {
    if (SugarSessionId === '') {
        $.mobile.changePage('#LoginPage');
    }
});

/* Login function used to log the user in and establish session */
function LoginUser(noEncryption) {
    if (validateLoginFields() == true) {
    $.mobile.showshowPageLoadingMsgMsg();
    /* Build the server address string based on prefs */
    if ($('SugarCrmProtocolHttpRadioButton').attr('checked',true)) {
        CurrentServerAddress = "http://";
    } else {
        CurrentServerAddress = "https://";
    }
    CurrentServerAddress+=$('#SettingsPageSugarCrmServerAddress').val();
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
              $.mobile.hideshowPageLoadingMsgMsg();
              alert('Login Failed');
            }
          }
          else {
              SugarSessionId = loginResult.id;
              $('#SettingsPageSugarCrmUsername').val('');
              $('#SettingsPageSugarCrmPassword').val('');
              $.mobile.hideshowPageLoadingMsgMsg();
              $.mobile.changePage('#HomePage');
          }
        }
        else {
          $.mobile.hideshowPageLoadingMsgMsg();
          alert('An unexpected error occurred logging in.');
        }
    });
    } else {
        $.mobile.hideshowPageLoadingMsgMsg();
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
    if (($('#SettingsPageSugarCrmUsername').val().length > 0) && ($('#SettingsPageSugarCrmPassword').val().length > 0) && ($('#SettingsPageSugarCrmServerAddress').val().length > 0)) {
        return true;
    } else {
        $('#SettingsPageSugarCrmUsername').change();
        $('#SettingsPageSugarCrmPassword').change();
        $('#SettingsPageSugarCrmServerAddress').change();
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
        $.mobile.changePage('#LoginPage', {reverse: "true"} );
    });
}

function ShowMainMenu() {
    $('#MainMenuNavBar').toggle();
}

function ShowAboutApplicationPage() {
    $.mobile.changePage('#AboutPage', {reverse: "true"} );
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
    $('#NewAccountHeader').text(RES_NEW_ACCOUNT_PAGE_TITLE);
    $('#AccountNameLabel').text(RES_NEW_ACCOUNT_NAME_LABEL);
    $('#NewAccountOfficePhoneLabel').text(RES_NEW_ACCOUNT_OFFICE_PHONE_LABEL);
    $('#NewAccountWebSiteLabel').text(RES_NEW_ACCOUNT_WEBSITE_LABEL);
    $('#NewAccountPhoneFaxLabel').text(RES_NEW_ACCOUNT_PHONE_FAX_LABEL);
    $('#NewAccountDescriptionLabel').text(RES_DESCRIPTION_LABEL);
});

$('#CreateNewContactPage').live('pagecreate',function(event,ui) {
    $('#NewContactHeader').text(RES_NEW_CONTACT_PAGE_TITLE);
    $('#ContactFirstNameLabel').text(RES_NEW_CONTACT_FIRST_NAME_LABEL);
    $('#ContactLastNameLabel').text(RES_NEW_CONTACT_LAST_NAME_LABEL);
    $('#ContactOfficePhoneLabel').text(RES_NEW_CONTACT_OFFICE_PHONE_LABEL);
    $('#ContactMobilePhoneLabel').text(RES_NEW_CONTACT_MOBILE_PHONE_LABEL);
    $('#ContactPhoneFaxLabel').text(RES_NEW_CONTACT_PHONE_FAX_LABEL);
    $('#ContactEmailLabel').text(RES_NEW_CONTACT_EMAIL_LABEL);
    $('#ContactTitleLabel').text(RES_NEW_CONTACT_TITLE_LABEL);
    $('#ContactDepartmentLabel').text(RES_NEW_CONTACT_DEPARTMENT_LABEL);
    $('#NewContactDescriptionLabel').text(RES_DESCRIPTION_LABEL);
});

$('#CreateNewOpportunityPage').live('pagecreate',function(event,ui) {

});

$('#CreateNewLeadPage').live('pagecreate',function(event,ui) {

});

$('#CreateNewCallPage').live('pagecreate',function(event,ui) {

});

$('#CreateNewMeetingPage').live('pagecreate',function(event,ui) {

});

$('#CreateNewTaskPage').live('pagecreate',function(event,ui) {

});

function revalidateControl(control,validationExpression) {
    var re = new RegExp(validationExpression);
    if ((control.type === 'text') || (control.type === 'password')) {
        if (re.test($.trim(control.value))) {
            $(control).removeClass('invalid');
        } else {
            $(control).addClass('invalid');
        }
    }
}


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

