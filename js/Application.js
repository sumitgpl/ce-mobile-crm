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

$('#HomePage').live('pagecreate',function(event,ui) {
   $('.IconContainer a').attr('class','IconContainerLink');
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
   $('#MeetingsListPageTitle').text(RES_MEETINGS_LABEL);
   $('#TasksListPageTitle').text(RES_TASKS_LABEL);
   $('#ViewContactDetailsPageTitle').text(RES_CONTACT_LABEL + " " + RES_DETAILS_LABEL);
   $('#ViewAccountDetailsPageTitle').text(RES_ACCOUNT_LABEL + " " + RES_DETAILS_LABEL);
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
    $.mobile.showPageLoadingMsg();
    var enteredUsername = $('#SettingsPageSugarCrmUsername').val();
    var enteredPassword = $('#SettingsPageSugarCrmPassword').val();
    var password = enteredPassword;
    if (noEncryption==undefined) password = $.md5(password);

    $.get('../service/v2/rest.php', {
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
              alert('Login Failed');
            }
          }
          else {
              SugarSessionId = loginResult.id;
              $('#SettingsPageSugarCrmUsername').val('');
              $('#SettingsPageSugarCrmPassword').val('');
              $.mobile.changePage('#HomePage');
          }
        }
        else {
          alert('An unexpected error occurred logging in.');
        }
        $.mobile.hidePageLoadingMsg();
    });
}

/* Bind the Window Before Load event to log the user out */
window.onbeforeunload = function() {
    $.get('../service/v2/rest.php', {
        method: "logout",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    });
    return;
};

function LogOutUser() {
    $.get('../service/v2/rest.php', {
        method: "logout",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    },function(data) {
        $.mobile.changePage('#LoginPage', { reverse: "true"} );
    });
}

function LogCall(moduleName,uniqueId) {
    $.get('../service/v2/rest.php', {
        method: "set_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '",' +
        '"module_name":"' + moduleName + '",' +
        '"name_value_list":[' +
        '{"name":"name","value":"Call placed from mobile device"},' +
        '{"name":"direction","value":"Outbound"},' +
        '{"name":"parent_type","value":"' + moduleName + '"},' +
        '{"name":"parent_id","value":"' + uniqueId + '"},' +
        '{"name":"status","value":"Test"},' +
        '{"name":"duration_hours","value":0},' +
        '{"name":"duration_minutes","value":0}]}'
    }, function(data) {
        alert(data);
    });
}
