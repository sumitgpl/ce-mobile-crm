var appversion = '0.0.2.2',
    resturl="../service/v2/rest.php";
var CurrentAccountId = "",
    CurrentContactId = "",
    CurrentOpportunityId = "",
    CurrentLeadId = "",
    CurrentCallId = "",
    CurrentMeetingId = "",
    CurrentTaskId = "",
    AccountsListNextOffset = 0,
    AccountsListPrevOffset = 0,
    AccountsListCurrentOffset = 0,
    ContactsListNextOffset = 0,
    ContactsListPrevOffset = 0,
    ContactsListCurrentOffset = 0,
    OpportunitiesListNextOffset = 0,
    OpportunitiesListPrevOffset = 0,
    OpportunitiesListCurrentOffset = 0,
    LeadsListNextOffset = 0,
    LeadsListPrevOffset = 0,
    LeadsListCurrentOffset = 0,
    CallsListNextOffset = 0,
    CallsListPrevOffset = 0,
    CallsListCurrentOffset = 0,
    MeetingsListNextOffset = 0,
    MeetingsListPrevOffset = 0,
    MeetingsListCurrentOffset = 0,
    TasksListNextOffset = 0,
    TasksListPrevOffset = 0,
    TasksListCurrentOffset = 0;

var HaveAccounts=false;
var HaveContacts=false;
var HaveOpportunities=false;
var HaveLeads=false;
var HaveCalls=false;
var HaveMeetings=false;
var HaveTasks=false;

var retrylang=true;
var Sugarmodules='';
var HomepageCreated=false;
var Langset=false;

document.title = appname;
//$("#SiteName").append(appname);


if ( typeof( window[ 'SugarSessionId' ] ) == "undefined" ) { var SugarSessionId=""; }
if ( typeof( window[ 'SrVSugarSessionId' ] ) == "undefined" ) { var SrVSugarSessionId=""; }

if (SrVSugarSessionId!='') SugarSessionId=SrVSugarSessionId;
if ( typeof( window[ 'SugarLanguage' ] ) == "undefined" ) { var SugarLanguage=""; }

window.onload = function () {
  currentpage = $('.ui-page-active').attr('id');	
  if (currentpage.indexOf('DetailsPage') != -1)
	document.location.href='./';
  if (SugarLanguage!='')
  {
	var headID = document.getElementsByTagName("head")[0];         
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.src = 'js/language/'+SugarLanguage+'.js';
	headID.appendChild(newScript);
  }
  getusermodule();
};

$("#HomePage").live("pagecreate", function () {
 $("#SiteName").append(appname);
    $(".IconContainer a").attr("class", "IconContainerLink");
});
$("#AccountsListPage").live("pageshow", function () {
    SugarCrmGetAccountsListFromServer(AccountsListCurrentOffset)
});
$("#ContactsListPage").live("pageshow", function () {
    SugarCrmGetContactListFromServer(ContactsListCurrentOffset)
});
$("#OpportunitiesListPage").live("pageshow", function () {
    SugarCrmGetOpportunitiesListFromServer(OpportunitiesListCurrentOffset)
});
$("#LeadsListPage").live("pageshow", function () {
    SugarCrmGetLeadsListFromServer(LeadsListCurrentOffset)
});
$("#CallsListPage").live("pageshow", function () {
    SugarCrmGetCallsListFromServer(CallsListCurrentOffset)
});
$("#MeetingsListPage").live("pageshow", function () {
    SugarCrmGetMeetingsListFromServer(MeetingsListCurrentOffset)
});
$("#TasksListPage").live("pageshow", function () {
    SugarCrmGetTasksListFromServer(TasksListCurrentOffset)
});
$("#HomePage").live("pageshow", function () {    
    SugarSessionId === "" && $.mobile.changePage("LoginPage");
    SugarSessionId == "" && $.mobile.changePage("LoginPage");
    if (HomepageCreated) SugarCrmHomepage();
});
$("#LoginPage").live("pageshow", function () {    
	SugarSessionId !== "" && $.mobile.changePage("HomePage");
	$("#FooterLogin span").remove();
	$("#FooterLogin").append('<span>'+appname+' v'+appversion+'</span>');
});
function LoginUser(notcryptmdp) {
    $.mobile.pageLoading();
    var a = $("#SettingsPageSugarCrmUsername").val(),
        c = $("#SettingsPageSugarCrmPassword").val();
     if (notcryptmdp==undefined) c = $.md5(c);
    $.get(resturl, {
        method: "login",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"password":"' + c + '","user_name":"' + a + '"},"SugarCrm",{"name":"language","value","en_US"}]'
    }, function (b) {
        if (b !== "") {
            b = jQuery.parseJSON(b);
            if (b.name !== undefined && b.name === "Invalid Login") 
		{
			if (notcryptmdp==undefined) LoginUser(true);
			else alert("Login Failed");
		}
            else {
                SugarSessionId = b.id;
		  SugarLanguage = b.name_value_list.user_language.value;
        //        $("#SettingsPageSugarCrmUsername").val("");
                $("#SettingsPageSugarCrmPassword").val("");
                $.mobile.changePage("HomePage")
            }
        } else alert("An unexpected error occurred logging in.");
        $.mobile.pageLoading(true)
    })
}
window.onbeforeunload = function () {
//    $.get(resturl, {
//        method: "logout",
//        input_type: "JSON",
//        response_type: "JSON",
//        rest_data: '[{"session":"' + SugarSessionId + '"}]'
//    })
};

function LogOutUser() {
    $.get(resturl, {
        method: "logout",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    }, function () {
	 SugarSessionId="";
        $.mobile.changePage("LoginPage")
    });

}
function pausecomp(millis)
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); }
while(curDate-date < millis);
} 

function getusermodule() {
    $.get(resturl, {
        method: "get_available_modules",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '[{"session":"' + SugarSessionId + '"}]'
    }, function (b) {
        if (b !== "") {
            b = jQuery.parseJSON(b);	
            if (b.modules !== undefined) 
		{
			Sugarmodules=b.modules;
			SugarCrmHomepage();
		}
	 HomepageCreated=true;
	}
    });
}
function SugarCrmHomepage() {
menu= "";

if ( typeof( window[ 'HomePageiconlabel' ] ) == "undefined" ) { 
//	alert('no language');
	if (retrylang) {
		retrylang=false;
		pausecomp(200);
		getusermodule();
	}
	else {
		document.location.href='./';
//		alert('no language');
	}
}
else {
  if (Langset==false) {
	$("#HomePageIcon div").remove();
	$.each(Sugarmodules, function(index) {
		if(jQuery.inArray(Sugarmodules[index],mobilemodules) > -1) {
			menu += '<div class="IconContainer"><a href="#'+Sugarmodules[index]+'ListPage"> <div class="'+Sugarmodules[index]+'Icon"></div> '+HomePageiconlabel[Sugarmodules[index]]+'</a></div>';
			if (Sugarmodules[index]=='Accounts') HaveAccounts=true;
			if (Sugarmodules[index]=='Contacts') HaveContacts=true;
			if (Sugarmodules[index]=='Opportunities') HaveOpportunities=true;
			if (Sugarmodules[index]=='Leads') HaveLeads=true;
			if (Sugarmodules[index]=='Calls') HaveCalls=true;
			if (Sugarmodules[index]=='Meetings') HaveMeetings=true;
			if (Sugarmodules[index]=='Tasks') HaveTasks=true;
		}
	});
	 $("#HomePageIcon").append(menu);
	 $("#Accountstitle").text(Accountstitle);
	 $("#AccountDetailstitle").text(AccountDetailstitle);
	
	$(".homeicon").each(function(index){
		$(this).text(Hometitle);
  	});
	$.mobile.page.prototype.options.backBtnText = Mobilebacktext;
// alert(AccountDetailstitle);
// alert(MobilebackBtnText);
	Langset=true;
  }
}

}

function SugarCrmGetAccountsListFromServer(a) {
    if ($("#AllAccountsListDiv li").length === 0 || AccountsListCurrentOffset !== a) {
        $.mobile.pageLoading();
        AccountsListCurrentOffset = a;

        SugarSessionId === "" && $.mobile.changePage("HomePage");

        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","query":"","order_by":"name","offset":' + a + ',"select_fields":'+AccountsListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
//            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","query":"","order_by":"name","offset":' + a + ',"max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c !== undefined) {
// alert(c);
// alert(SugarSessionId);

//return;
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c !== undefined && c.entry_list !== undefined) {
                    if (c.result_count === 0) AccountsListCurrentOffset = AccountsListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) AccountsListCurrentOffset = 0;
                    if (c.next_offset === 0 || c.result_count === 0) alert("There are no more records in that direction");
                    else {
//alert(c.entry_list.length);
                        $("#AllAccountsListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] !== undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.name.value + "</h4>",
                                g = "<p>" + d.name_value_list.billing_address_city.value + "&nbsp;" + d.name_value_list.billing_address_state.value + "</p>";
	                            d = $("<a/>", {
       	                         href: "#",
              	                  "data-identity": d.id,
                     	           click: function () {
                            	        CurrentAccountId = $(this).data("identity");
                                   	 $.mobile.changePage("ViewAccountDetailsPage");
	                                    $.mobile.pageLoading();
       	                             SugarCrmGetAccountDetails()
              	                  }
                     	       });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllAccountsListDiv").append(f)
                        }
                        $("#AllAccountsListDiv").listview("refresh");
                        AccountsListNextOffset = c.next_offset;
                        AccountsListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetAccountDetails() {
    SugarSessionId === "" && $.mobile.changePage("HomePage");
    $("#ViewAccountDetailsPageDetailsList li").remove();
    $("#AccountNameH1").html("");
    $("#AccountDescriptionP").text("");
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","id":"' + CurrentAccountId + '","select_fields":'+AccountDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list[0] !== undefined) {
                account = a.entry_list[0];
                $("#AccountNameH1").html(account.name_value_list.name.value);
                $("#AccountDescriptionP").text(account.name_value_list.description.value);
                $("#ViewAccountDetailsPageDetailsList").append('<li data-role="list-divider">Account Overview</li>');
                a = $("<li/>");
                var c = account.name_value_list.phone_office.value.replace("(", "");
                c = c.replace(")", "");
                c = c.replace(" ", "");
                c = c.replace("-", "");
//                c = c.replace("+1", "");
                var b = "<h4>" + account.name_value_list.phone_office.value + "</h4>";
                c = $("<a/>", {
                    href: "tel:" + c,
                    rel: "external",
                    style: "text-decoration:none;color:#444;"
                });
                c.append("<p><br />Office Phone</p>");
                c.append(b);
                a.append(c);
                account.name_value_list.phone_office.value !== "" && $("#ViewAccountDetailsPageDetailsList").append(a);
                if (account.name_value_list.website.value !== "") {
                    c = "";
                    c = account.name_value_list.website.value.substring(0, 4) !== "http" ? "http://" + account.name_value_list.website.value : account.name_value_list.website.value;
                    a = $("<li/>");
                    b = "<h4>" + account.name_value_list.website.value + "</h4>";
                    c = $("<a/>", {
                        href: c,
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                    c.append("<p><br />Web Site</p>");
                    c.append(b);
                    a.append(c);
                    $("#ViewAccountDetailsPageDetailsList").append(a)
                }
                a = $("<li/>");
                a.append("<p>Fax</p>");
                a.append("<h4>" + account.name_value_list.phone_fax.value + "</h4>");
                account.name_value_list.phone_fax.value !== "" && $("#ViewAccountDetailsPageDetailsList").append(a);
                a = $("<li/>");
                c = account.name_value_list.billing_address_street.value;
                var d = account.name_value_list.billing_address_city.value,
                    f = account.name_value_list.billing_address_state.value,
                    e = account.name_value_list.billing_address_postalcode.value,
                    g = account.name_value_list.billing_address_country.value,
                    h = "<h4>" + c + "<br />" + d + ", " + f + " " + e + "<br />" + g + "</h4>";
                b = $("<a/>", {
                    href: "http://maps.google.com/?q=" + c + "%20" + d + "%20" + f + "%20" + e + "&t=m&z=13",
                    rel: "external",
                    target: "_new",
                    style: "text-decoration:none;color:#444;"
                });
                b.append("<p><br />Billing Address</p>");
                b.append(h);
                a.append(b);
                if (c !== "" || d !== "" || f !== "" || e !== "" || g !== "") $("#ViewAccountDetailsPageDetailsList").append(a);
                c = $("<li/>");
                d = account.name_value_list.shipping_address_street.value;
                f = account.name_value_list.shipping_address_city.value;
                e = account.name_value_list.shipping_address_state.value;
                g = account.name_value_list.shipping_address_postalcode.value;
                h = account.name_value_list.shipping_address_country.value;
                var i = "<h4>" + d + "<br />" + f + ", " + e + " " + g + "<br />" + h + "</h4>",
                    j = $("<a/>", {
                        href: "http://maps.google.com/?q=" + d + "%20" + f + "%20" + e + "%20" + g + "&t=m&z=13",
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                j.append("<p><br />Shipping Address</p>");
                j.append(i);
                c.append(j);
                a.append(b);
                if (d !== "" || f !== "" || e !== "" || g !== "" || h !== "") $("#ViewAccountDetailsPageDetailsList").append(c);
                a = $("<li/>");
                b = "<h4>" + account.name_value_list.email1.value + "</h4>";
                c = $("<a/>", {
                    href: "mailto:" + account.name_value_list.email1.value,
                    rel: "external",
                    style: "text-decoration:none;color:#444;"
                });
                c.append("<p><br />Email</p>");
                c.append(b);
                a.append(c);
                account.name_value_list.email1.value !== "" && $("#ViewAccountDetailsPageDetailsList").append(a);
                $("#ViewAccountDetailsPageDetailsList").append('<li data-role="list-divider">More Information</li>');
                account.name_value_list.account_type.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Account Type</p><h4>" + account.name_value_list.account_type.value + "</h4></li>");
                account.name_value_list.industry.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Industry</p><h4>" + account.name_value_list.industry.value + "</h4></li>");
                account.name_value_list.annual_revenue.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Annual Revenue</p><h4>" + account.name_value_list.annual_revenue.value + "</h4></li>");
                account.name_value_list.employees.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Employees</p><h4>" + account.name_value_list.employees.value + "</h4></li>");
                account.name_value_list.sic_code.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><P><br />SIC Code</p><h4>" + account.name_value_list.sic_code.value + "</h4></li>");
                account.name_value_list.ticker_symbol.value != "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Ticker Symbol</p><h4>" + account.name_value_list.ticker_symbol.value + "</h4></li>");
                account.name_value_list.parent_name !== undefined && account.name_value_list.parent_name.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Member of</p><h4>" + account.name_value_list.parent_name.value + "</h4></li>");
                account.name_value_list.ownership.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Ownership</p><h4>" + account.name_value_list.ownership.value + "</h4></li>");
                account.name_value_list.campaign_name.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Campaign</p><h4>" + account.name_value_list.campaign_name.value + "</h4></li>");
                account.name_value_list.rating.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Rating</p><h4>" + account.name_value_list.rating.value + "</h4></li>");
                $("#ViewAccountDetailsPageDetailsList").append('<li data-role="list-divider">Other</li>');
                account.name_value_list.assigned_user_name.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + account.name_value_list.assigned_user_name.value + "</h4></li>");
                account.name_value_list.date_modified.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + account.name_value_list.date_modified.value + "</h4></li>");
                account.name_value_list.date_entered.value !== "" && $("#ViewAccountDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + account.name_value_list.date_entered.value + " by " + account.name_value_list.created_by_name.value + "</h4></li>")
            }
        }
        $("#ViewAccountDetailsPageDetailsList").listview("refresh")
    });
    if (HaveContacts) {
    $("#ViewAccountDetailsPageContactsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageContactsListUl").append('<li data-role="list-divider">Contacts</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>",
                        e = "<p>" + b.name_value_list.title.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentContactId = $(this).data("identity");
                            $.mobile.changePage("ViewContactDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetContactDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewAccountDetailsPageContactsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageContactsListUl").append(a)
            }
            $("#ViewAccountDetailsPageContactsListUl").listview("refresh")
        }
    });
    }
    if (HaveOpportunities) {
    $("#ViewAccountDetailsPageOpportunitiesListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"opportunities","related_module_query":"","related_fields":["id","name","sales_stage"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageOpportunitiesListUl").append('<li data-role="list-divider">Opportunities</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "<p>" + b.name_value_list.sales_stage.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentOpportunityId = $(this).data("identity");
                            $.mobile.changePage("ViewOpportunityDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetOpportunityDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewAccountDetailsPageOpportunitiesListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageOpportunitiesListUl").append(a)
            }
        }
        $("#ViewAccountDetailsPageOpportunitiesListUl").listview("refresh")
    });
    }
    if (HaveLeads) {
    $("#ViewAccountDetailsPageLeadsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                        e = "";
                    e = b.name_value_list.title !== undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentLeadId = $(this).data("identity");
                            $.mobile.changePage("ViewLeadDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetLeadDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewAccountDetailsPageLeadsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageLeadsListUl").append(a)
            }
        }
        $("#ViewAccountDetailsPageLeadsListUl").listview("refresh")
    });
    }
    if (HaveCalls) {
    $("#ViewAccountDetailsPageCallsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"calls","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageCallsListUl").append('<li data-role="list-divider">Calls</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status !== undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    }
                    var g = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentCallId = $(this).data("identity");
                            $.mobile.changePage("ViewCallDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetCallDetails()
                        }
                    });
                    g.append(f);
                    b.name_value_list.status !== undefined && g.append(e);
                    d.append(g);
                    $("#ViewAccountDetailsPageCallsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageCallsListUl").append(a)
            }
        }
        $("#ViewAccountDetailsPageCallsListUl").listview("refresh")
    });
    }
    if (HaveMeetings) {
    $("#ViewAccountDetailsPageMeetingsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"meetings","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageMeetingsListUl").append('<li data-role="list-divider">Meetings</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status !== undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start !== undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentMeetingId = $(this).data("identity");
                            $.mobile.changePage("ViewMeetingDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetMeetingDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewAccountDetailsPageMeetingsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageMeetingsListUl").append(a)
            }
        }
        $("#ViewAccountDetailsPageMeetingsListUl").listview("refresh")
    });
    }
    if (HaveTasks) {
    $("#ViewAccountDetailsPageTasksListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Accounts","module_id":"' + CurrentAccountId + '","link_field_name":"tasks","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        $("#ViewAccountDetailsPageTasksListUl").append('<li data-role="list-divider">Tasks</li>');
        if (a !== undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status !== undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start !== undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentTaskId = $(this).data("identity");
                            $.mobile.changePage("ViewTaskDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetTaskDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewAccountDetailsPageTasksListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewAccountDetailsPageTasksListUl").append(a)
            }
        }
        $("#ViewAccountDetailsPageTasksListUl").listview("refresh");
    });
    }
        $.mobile.pageLoading(true)
    
}

function LogCall() {
    $.get(resturl, {
        method: "set_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","name_value_list":[{"name":"name","value":"Call placed from mobile device"},{"name":"direction","value":"Outbound"},{"name":"parent_type","value":"Accounts"},{"name":"parent_id","value":"' + CurrentAccountId + '"},{"name":"status","value":"Test"},{"name":"duration_hours","value":0},{"name":"duration_minutes","value":0}]}'
    }, function () {})
}

function SugarCrmGetContactListFromServer(a) {
    if ($("#AllContactsListDiv li").length === 0 || ContactsListCurrentOffset !== a) {
        $.mobile.pageLoading();
        ContactsListCurrentOffset = a;
        SugarSessionId == "" && $.mobile.changePage("HomePage");
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","query":"","order_by":"name","offset":' + a + ',"select_fields":'+ContactListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) ContactsListCurrentOffset = ContactsListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) ContactsListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllContactsListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.first_name.value + "&nbsp;" + d.name_value_list.last_name.value + "</h4>",
                                g = d.name_value_list.title.value;
                            if (d.name_value_list.account_name != undefined) g += " at " + d.name_value_list.account_name.value;
                            g = "<p>" + g + "</p>";
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage("ViewContactDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetContactDetails()
                                }
                            });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllContactsListDiv").append(f)
                        }
                        $("#AllContactsListDiv").listview("refresh");
                        ContactsListNextOffset = c.next_offset;
                        ContactsListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetContactDetails() {
    $("#ContactNameH1").html("");
    $("#ContactTitleP").text("");
    $("#ViewContactDetailsPageDetailsList li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","id":"' + CurrentContactId + '","select_fields":'+ContactDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#ContactNameH1").html(a.name_value_list.first_name.value + "&nbsp;" + a.name_value_list.last_name.value);
                var c = a.name_value_list.title.value;
                if (a.name_value_list.account_name != undefined) c += " at " + a.name_value_list.account_name.value;
                $("#ContactTitleP").text(c);
                $("#ViewContactDetailsPageDetailsList").append('<li data-role="list-divider">Contact Information</li>');
                if (a.name_value_list.phone_work !== undefined && a.name_value_list.phone_work.value !== "") {
                    c = $("<li/>");
                    var b = a.name_value_list.phone_work.value.replace("(", "");
                    b = b.replace(")", "");
                    b = b.replace(" ", "");
                    b = b.replace("-", "");
                    if (a.name_value_list.phone_work !== undefined) {
                        var d = "<h4>" + a.name_value_list.phone_work.value + "</h4>",
                            f = $("<a/>", {
                                href: "tel:" + b,
                                rel: "external",
                                style: "text-decoration:none;color:#444;"
                            });
                        f.append("<p><br />Office Phone</p>");
                        f.append(d);
                        c.append(f)
                    }
                    $("#ViewContactDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.email1 !== undefined && a.name_value_list.email1.value !== "") {
                    c = $("<li/>");
                    d = "<h4>" + a.name_value_list.email1.value + "</h4>";
                    f = $("<a/>", {
                        href: "mailto:" + a.name_value_list.email1.value,
                        rel: "external",
                        style: "text-decoration:none;color:#444;"
                    });
                    f.append("<p><br />Email</p>");
                    f.append(d);
                    c.append(f);
                    $("#ViewContactDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.description !== undefined && a.name_value_list.description.value !== "") {
                    c = $("<li/>");
                    d = "<h4>" + a.name_value_list.description.value + "</h4>";
                    c.append("<p><br />Description</p>");
                    c.append(d);
                    $("#ViewContactDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.primary_address_street !== undefined && a.name_value_list.primary_address_street.value != "" || a.name_value_list.primary_address_city !== undefined && a.name_value_list.primary_address_city.value != "" || a.name_value_list.primary_address_state !== undefined && a.name_value_list.primary_address_state.value != "" || a.name_value_list.primary_address_postalcode !== undefined && a.name_value_list.primary_address_postalcode.value != "" || a.name_value_list.primary_address_country !== undefined && a.name_value_list.primary_address_country.value != "") {
                    f = a.name_value_list.primary_address_street.value;
                    var e = a.name_value_list.primary_address_city.value,
                        g = a.name_value_list.primary_address_state.value,
                        h = a.name_value_list.primary_address_postalcode.value,
                        i = a.name_value_list.primary_address_country.value;
                    d = "http://maps.google.com/?q=" + f + "%20" + e + "%20" + g + "%20" + h + "&t=m&z=13";
                    c = $("<li/>");
                    f = "<h4>" + f + "<br />" + e + ", " + g + " " + h + "<br />" + i + "</h4>";
                    d = $("<a/>", {
                        href: d,
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                    d.append("<p><br />Primary Address</p>");
                    d.append(f);
                    c.append(d);
                    $("#ViewContactDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.phone_mobile !== undefined && a.name_value_list.phone_mobile.value !== "") {
                    c = $("<li/>");
                    d = a.name_value_list.phone_mobile.value.replace("(", "");
                    b.replace(")", "");
                    b.replace(" ", "");
                    d = b.replace("-", "");
                    b = "<h4>" + a.name_value_list.phone_mobile.value + "</h4>";
                    d = $("<a/>", {
                        href: "tel:" + d,
                        rel: "external",
                        style: "text-decoration:none;color:#444;"
                    });
                    d.append("<p><br />Mobile Phone</p>");
                    d.append(b);
                    c.append(d);
                    $("#ViewContactDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.phone_fax !== undefined && a.name_value_list.phone_fax.value !== "") {
                    b = $("<li/>");
                    c = "<h4>" + a.name_value_list.phone_fax.value + "</h4>";
                    b.append("<p><br />Fax</p>");
                    b.append(c);
                    $("#ViewContactDetailsPageDetailsList").append(b)
                }
                if (a.name_value_list.department !== undefined && a.name_value_list.department.value !== "") {
                    b = $("<li/>");
                    c = "<h4>" + a.name_value_list.department.value + "</h4>";
                    b.append("<p><br />Department</p>");
                    b.append(c);
                    $("#ViewContactDetailsPageDetailsList").append(b)
                }
                if (a.name_value_list.alt_address_street !== undefined && a.name_value_list.alt_address_street.value != "" || a.name_value_list.alt_address_city !== undefined && a.name_value_list.alt_address_city.value != "" || a.name_value_list.alt_address_state !== undefined && a.name_value_list.alt_address_state.value != "" || a.name_value_list.alt_address_postalcode !== undefined && a.name_value_list.alt_address_postalcode.value != "" || a.name_value_list.alt_address_country !== undefined && a.name_value_list.alt_address_country.value != "") {
                    b = $("<li/>");
                    d = a.name_value_list.alt_address_street.value;
                    f = a.name_value_list.alt_address_city.value;
                    e = a.name_value_list.alt_address_state.value;
                    g = a.name_value_list.alt_address_postalcode.value;
                    c = "<h4>" + d + "<br />" + f + ", " + e + " " + g + "<br />" + a.name_value_list.alt_address_country.value + "</h4>";
                    d = $("<a/>", {
                        href: "http://maps.google.com/?q=" + d + "%20" + f + "%20" + e + "%20" + g + "&t=m&z=13",
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                    d.append("<p><br />Other Address</p>");
                    d.append(c);
                    b.append(d);
                    $("#ViewContactDetailsPageDetailsList").append(b)
                }
                $("#ViewContactDetailsPageDetailsList").append('<li data-role="list-divider">More Information</li>');
                a.name_value_list.report_to_name !== undefined && a.name_value_list.report_to_name.value !== "" && $("#ViewContactDetailsPageDetailsList").append("<li><p><br />Reports To</p><h4>" + a.name_value_list.report_to_name.value + "</h4></li>");
                a.name_value_list.lead_source !== undefined && a.name_value_list.lead_source.value !== "" && $("#ViewContactDetailsPageDetailsList").append("<li><p><br />Lead Source</p><h4>" + a.name_value_list.lead_source.value + "</h4></li>");
                $("#ViewContactDetailsPageDetailsList").append('<li data-role="list-divider">Other Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewContactDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.date_modified !== undefined && a.name_value_list.date_modified.value !== "" && $("#ViewContactDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + a.name_value_list.modified_by_name.value + "</h4></li>");
                a.name_value_list.date_entered !== undefined && a.name_value_list.date_entered.value !== "" && $("#ViewContactDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + a.name_value_list.created_by_name.value + "</h4></li>");
                a.name_value_list.do_not_call !== undefined && a.name_value_list.do_not_call.value == "true" && alert("*NOTE: This Contact is marked as Do Not Call.")
            }
            $("#ViewContactDetailsPageDetailsList").listview("refresh")
        }
    });
    if (HaveOpportunities) { getContactRelatedOpportunitiesInsetList(); }
    if (HaveLeads) { getContactRelatedLeadsInsetList(); }
    if (HaveCalls) { getContactRelatedCallsInsetList(); }
    if (HaveMeetings) { getContactRelatedMeetingsInsetList(); }
    if (HaveTasks) { getContactRelatedTasksInsetList(); }
}

function getContactRelatedOpportunitiesInsetList() {
    $("#ViewContactDetailsPageOpportunitiesListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"opportunities","related_module_query":"","related_fields":["id","name","sales_stage"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewContactDetailsPageOpportunitiesListUl").append('<li data-role="list-divider">Opportunities</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "<p>" + b.name_value_list.sales_stage.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentOpportunityId = $(this).data("identity");
                            $.mobile.changePage("ViewOpportunityDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetOpportunityDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewContactDetailsPageOpportunitiesListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewContactDetailsPageOpportunitiesListUl").append(a)
            }
            $("#ViewContactDetailsPageOpportunitiesListUl").listview("refresh")
        }
    })
}

function getContactRelatedLeadsInsetList() {
    $("#ViewContactDetailsPageLeadsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewContactDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                        e = "";
                    e = b.name_value_list.title != undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentLeadId = $(this).data("identity");
                            $.mobile.changePage("ViewLeadDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetLeadDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewContactDetailsPageLeadsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewContactDetailsPageLeadsListUl").append(a)
            }
            $("#ViewContactDetailsPageLeadsListUl").listview("refresh")
        }
    })
}

function getContactRelatedCallsInsetList() {
    $("#ViewContactDetailsPageCallsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"calls","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewContactDetailsPageCallsListUl").append('<li data-role="list-divider">Calls</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a !== undefined && a.entry_list !== undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] !== undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status !== undefined && b.name_value_list.status.value !== "") {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    var g = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentCallId = $(this).data("identity");
                            $.mobile.changePage("ViewCallDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetCallDetails()
                        }
                    });
                    g.append(f);
                    b.name_value_list.status !== undefined && b.name_value_list.status.value !== "" && g.append(e);
                    d.append(g);
                    $("#ViewContactDetailsPageCallsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewContactDetailsPageCallsListUl").append(a)
            }
            $("#ViewContactDetailsPageCallsListUl").listview("refresh")
        }
    })
}

function getContactRelatedMeetingsInsetList() {
    $("#ViewContactDetailsPageMeetingsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"meetings","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewContactDetailsPageMeetingsListUl").append('<li data-role="list-divider">Meetings</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status != undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentMeetingId = $(this).data("identity");
                            $.mobile.changePage("ViewMeetingDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetMeetingDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewContactDetailsPageMeetingsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewContactDetailsPageMeetingsListUl").append(a)
            }
            $("#ViewContactDetailsPageMeetingsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getContactRelatedTasksInsetList() {
    $("#ViewContactDetailsPageTasksListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Contacts","module_id":"' + CurrentContactId + '","link_field_name":"tasks","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewContactDetailsPageTasksListUl").append('<li data-role="list-divider">Tasks</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status != undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentTaskId = $(this).data("identity");
                            $.mobile.changePage("ViewTaskDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetTaskDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewContactDetailsPageTasksListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewContactDetailsPageTasksListUl").append(a)
            }
            $("#ViewContactDetailsPageTasksListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function SugarCrmGetOpportunitiesListFromServer(a) {
    if ($("#AllOpportunitiesListDiv li").length === 0 || OpportunitiesListCurrentOffset !== a) {
        $.mobile.pageLoading();
        OpportunitiesListCurrentOffset = a;
        SugarSessionId == "" && $.mobile.changePage("HomePage");
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","query":"","order_by":"amount desc","offset":' + a + ',"select_fields":'+OpportunitiesListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) OpportunitiesListCurrentOffset = OpportunitiesListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) OpportunitiesListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllOpportunitiesListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.name.value + "</h4>",
                                g = $("<p/>");
                            if (d.name_value_list.amount !== undefined && d.name_value_list.amount.value !== "") if (d.name_value_list.currency_name !== undefined && d.name_value_list.currency_name.value !== "") {
                                g.append(d.name_value_list.currency_symbol.value);
                                g.append(parseFloat(d.name_value_list.amount.value).toFixed(2))
                            } else {
                                g.append("$");
                                g.append(parseFloat(d.name_value_list.amount_usdollar.value).toFixed(2))
                            }
                            d.name_value_list.sales_stage !== undefined && d.name_value_list.sales_stage.value !== "" && g.append(" - " + d.name_value_list.sales_stage.value);
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentOpportunityId = $(this).data("identity");
                                    $.mobile.changePage("ViewOpportunityDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetOpportunityDetails()
                                }
                            });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllOpportunitiesListDiv").append(f)
                        }
                        $("#AllOpportunitiesListDiv").listview("refresh");
                        OpportunitiesListNextOffset = c.next_offset;
                        OpportunitiesListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetOpportunityDetails() {
    $.mobile.pageLoading();
    $("#OpportunityNameH1").html("");
    $("#OpportunityDescriptionP").text("");
    $("#ViewOpportunityDetailsPageDetailsList li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","id":"' + CurrentOpportunityId + '","select_fields":'+OpportunitiesDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#OpportunityNameH1").html(a.name_value_list.name.value);
                $("#OpportunityDescriptionP").text(a.name_value_list.account_name.value);
                $("#ViewOpportunityDetailsPageDetailsList").append('<li data-role="list-divider">Opportunity Information</li>');
                if (a.name_value_list.amount !== undefined && a.name_value_list.amount.value !== "") {
                    var c = $("<li/>"),
                        b = $("<p/>");
                    b.append("<br />Opportunity Amount (");
                    var d = $("<h4/>");
                    if (a.name_value_list.currency_name !== undefined && a.name_value_list.currency_name.value !== "") {
                        b.append(a.name_value_list.currency_name.value + ")");
                        d.append(a.name_value_list.currency_symbol.value);
                        d.append(parseFloat(a.name_value_list.amount.value).toFixed(2))
                    } else {
                        b.append("USD)");
                        d.append("$");
                        d.append(parseFloat(a.name_value_list.amount_usdollar.value).toFixed(2))
                    }
                    b.append(d);
                    c.append(b);
                    c.append(d);
                    $("#ViewOpportunityDetailsPageDetailsList").append(c)
                }
                a.name_value_list.date_closed !== undefined && a.name_value_list.date_closed.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Expected Close Date</p><h4>" + a.name_value_list.date_closed.value + "</h4></li>");
                a.name_value_list.sales_stage !== undefined && a.name_value_list.sales_stage.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Sales Stage</p><h4>" + a.name_value_list.sales_stage.value + "</h4></li>");
                a.name_value_list.opportunity_type !== undefined && a.name_value_list.opportunity_type.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Type</p><h4>" + a.name_value_list.opportunity_type.value + "</h4></li>");
                a.name_value_list.probability !== undefined && a.name_value_list.probability.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Probability(%)</p><h4>" + a.name_value_list.probability.value + "</h4></li>");
                a.name_value_list.lead_source !== undefined && a.name_value_list.lead_source.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Lead Source</p><h4>" + a.name_value_list.lead_source.value + "</h4></li>");
                a.name_value_list.next_step !== undefined && a.name_value_list.next_step.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Next Step</p><h4>" + a.name_value_list.next_step.value + "</h4></li>");
                a.name_value_list.description !== undefined && a.name_value_list.description.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Description</p><h4>" + a.name_value_list.description.value + "</h4></li>");
                $("#ViewOpportunityDetailsPageDetailsList").append('<li data-role="list-divider">Opportunity Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.date_modified !== undefined && a.name_value_list.date_modified.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "</h4></li>");
                a.name_value_list.date_entered !== undefined && a.name_value_list.date_entered.value !== "" && $("#ViewOpportunityDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + " by " + a.name_value_list.created_by_name.value + "</h4></li>")
            }
            $("#ViewOpportunityDetailsPageDetailsList").listview("refresh")
        }
    });

    if (HaveContacts) { getOpportunityRelatedContactsInsetList(); }
    if (HaveLeads) { getOpportunityRelatedLeadsInsetList(); }
    if (HaveCalls) { getOpportunityRelatedCallsInsetList(); }
    if (HaveMeetings) { getOpportunityRelatedMeetingsInsetList(); }
    if (HaveTasks) { getOpportunityRelatedTasksInsetList(); }
}

function getOpportunityRelatedContactsInsetList() {
    $.mobile.pageLoading();
    $("#ViewOpportunityDetailsPageContactsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewOpportunityDetailsPageContactsListUl li").remove();
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) {
                $("#ViewOpportunityDetailsPageContactsListUl").append('<li data-role="list-divider">Contacts</li>');
                if (a.entry_list.length > 0) {
                    var c = 0;
                    for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                        var b = a.entry_list[c],
                            d = $("<li/>"),
                            f = '<h4 class="contactName">' + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>",
                            e = "<p>" + b.name_value_list.title.value + "</p>";
                        b = $("<a/>", {
                            href: "#",
                            "data-identity": b.id,
                            click: function () {
                                CurrentContactId = $(this).data("identity");
                                $.mobile.changePage("ViewContactDetailsPage");
                                $.mobile.pageLoading();
                                SugarCrmGetContactDetails()
                            }
                        });
                        b.append(f);
                        b.append(e);
                        d.append(b);
                        $("#ViewOpportunityDetailsPageContactsListUl").append(d)
                    }
                } else {
                    a = $("<li/>");
                    a.append("<h4>No Data</h4>");
                    $("#ViewOpportunityDetailsPageContactsListUl").append(a)
                }
            }
            $("#ViewOpportunityDetailsPageContactsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getOpportunityRelatedLeadsInsetList() {
    $.mobile.pageLoading();
    $("#ViewOpportunityDetailsPageLeadsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) {
                $("#ViewOpportunityDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
                if (a.entry_list.length > 0) {
                    var c = 0;
                    for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                        var b = a.entry_list[c],
                            d = $("<li/>"),
                            f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                            e = "";
                        e = b.name_value_list.title != undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                        b = $("<a/>", {
                            href: "#",
                            "data-identity": b.id,
                            click: function () {
                                CurrentLeadId = $(this).data("identity");
                                $.mobile.changePage("ViewLeadDetailsPage");
                                $.mobile.pageLoading();
                                SugarCrmGetLeadDetails()
                            }
                        });
                        b.append(f);
                        b.append(e);
                        d.append(b);
                        $("#ViewOpportunityDetailsPageLeadsListUl").append(d)
                    }
                } else {
                    a = $("<li/>");
                    a.append("<h4>No Data</h4>");
                    $("#ViewOpportunityDetailsPageLeadsListUl").append(a)
                }
            }
            $("#ViewOpportunityDetailsPageLeadsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getOpportunityRelatedCallsInsetList() {
    $.mobile.pageLoading();
    $("#ViewOpportunityDetailsPageCallsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"calls","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) {
                $("#ViewOpportunityDetailsPageCallsListUl").append('<li data-role="list-divider">Calls</li>');
                if (a.entry_list.length > 0) {
                    var c = 0;
                    for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                        var b = a.entry_list[c],
                            d = $("<li/>"),
                            f = "<h4>" + b.name_value_list.name.value + "</h4>",
                            e = "";
                        if (b.name_value_list.status != undefined) {
                            e = "<p>" + b.name_value_list.status.value;
                            if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                            e += "</p>"
                        } else e = "<p></p>";
                        var g = $("<a/>", {
                            href: "#",
                            "data-identity": b.id,
                            click: function () {
                                CurrentCallId = $(this).data("identity");
                                $.mobile.changePage("ViewCallDetailsPage");
                                $.mobile.pageLoading();
                                SugarCrmGetCallDetails()
                            }
                        });
                        g.append(f);
                        b.name_value_list.status != undefined && g.append(e);
                        d.append(g);
                        $("#ViewOpportunityDetailsPageCallsListUl").append(d)
                    }
                } else {
                    a = $("<li/>");
                    a.append("<h4>No Data</h4>");
                    $("#ViewOpportunityDetailsPageCallsListUl").append(a)
                }
            }
            $("#ViewOpportunityDetailsPageCallsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getOpportunityRelatedMeetingsInsetList() {
    $.mobile.pageLoading();
    $("#ViewOpportunityDetailsPageMeetingsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"meetings","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewOpportunityDetailsPageMeetingsListUl li").remove();
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) {
                $("#ViewOpportunityDetailsPageMeetingsListUl").append('<li data-role="list-divider">Meetings</li>');
                if (a.entry_list.length > 0) {
                    var c = 0;
                    for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                        var b = a.entry_list[c],
                            d = $("<li/>"),
                            f = "<h4>" + b.name_value_list.name.value + "</h4>",
                            e = "";
                        if (b.name_value_list.status != undefined) {
                            e = "<p>" + b.name_value_list.status.value;
                            if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                            e += "</p>"
                        } else e = "<p></p>";
                        b = $("<a/>", {
                            href: "#",
                            "data-identity": b.id,
                            click: function () {
                                CurrentMeetingId = $(this).data("identity");
                                $.mobile.changePage("ViewMeetingDetailsPage");
                                $.mobile.pageLoading();
                                SugarCrmGetMeetingDetails()
                            }
                        });
                        b.append(f);
                        b.append(e);
                        d.append(b);
                        $("#ViewOpportunityDetailsPageMeetingsListUl").append(d)
                    }
                } else {
                    a = $("<li/>");
                    a.append("<h4>No Data</h4>");
                    $("#ViewOpportunityDetailsPageMeetingsListUl").append(a)
                }
            }
            $("#ViewOpportunityDetailsPageMeetingsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getOpportunityRelatedTasksInsetList() {
    $.mobile.pageLoading();
    $("#ViewOpportunityDetailsPageTasksListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Opportunities","module_id":"' + CurrentOpportunityId + '","link_field_name":"tasks","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewOpportunityDetailsPageTasksListUl li").remove();
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) {
                $("#ViewOpportunityDetailsPageTasksListUl").append('<li data-role="list-divider">Tasks</li>');
                if (a.entry_list.length > 0) {
                    var c = 0;
                    for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                        var b = a.entry_list[c],
                            d = $("<li/>"),
                            f = "<h4>" + b.name_value_list.name.value + "</h4>",
                            e = "";
                        if (b.name_value_list.status != undefined) {
                            e = "<p>" + b.name_value_list.status.value;
                            if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                            e += "</p>"
                        } else e = "<p></p>";
                        b = $("<a/>", {
                            href: "#",
                            "data-identity": b.id,
                            click: function () {
                                CurrentTaskId = $(this).data("identity");
                                $.mobile.changePage("ViewTaskDetailsPage");
                                $.mobile.pageLoading();
                                SugarCrmGetTaskDetails()
                            }
                        });
                        b.append(f);
                        b.append(e);
                        d.append(b);
                        $("#ViewOpportunityDetailsPageTasksListUl").append(d)
                    }
                } else {
                    a = $("<li/>");
                    a.append("<h4>No Data</h4>");
                    $("#ViewOpportunityDetailsPageTasksListUl").append(a)
                }
            }
            $("#ViewOpportunityDetailsPageTasksListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function SugarCrmGetLeadsListFromServer(a) {
    if ($("#AllLeadsListDiv li").length === 0 || LeadsListCurrentOffset !== a) {
        $.mobile.pageLoading();
        LeadsListCurrentOffset = a;
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","query":"","order_by":"name","offset":' + a + ',"select_fields":'+LeadsListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) LeadsListCurrentOffset = LeadsListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) LeadsListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllLeadsListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.first_name.value + "&nbsp;" + d.name_value_list.last_name.value + "</h4>",
                                g = "<p>" + d.name_value_list.title.value + " at&nbsp;" + d.name_value_list.account_name.value + "</p>";
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage("ViewLeadDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetLeadDetails()
                                }
                            });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllLeadsListDiv").append(f)
                        }
                        $("#AllLeadsListDiv").listview("refresh");
                        LeadsListNextOffset = c.next_offset;
                        LeadsListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetLeadDetails() {
    $("#ContactNameH1").html("");
    $("#ContactTitleP").text("");
    $("#ViewLeadDetailsPageDetailsList li").remove();
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","id":"' + CurrentLeadId + '","select_fields":'+LeadsDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#LeadNameH1").html(a.name_value_list.first_name.value + "&nbsp;" + a.name_value_list.last_name.value);
                if (a.name_value_list.account_name !== undefined && a.name_value_list.account_name.value !== "") {
                    var c = a.name_value_list.title.value;
                    c += " at " + a.name_value_list.account_name.value;
                    $("#LeadTitleP").text(c)
                }
                $("#ViewLeadDetailsPageDetailsList").append('<li data-role="list-divider">Lead Information</li>');
                if (a.name_value_list.phone_work !== undefined && a.name_value_list.phone_work.value !== "") {
                    c = $("<li/>");
                    var b = a.name_value_list.phone_work.value.replace("(", "");
                    b = b.replace(")", "");
                    b = b.replace(" ", "");
                    b = b.replace("-", "");
                    var d = "<h4>" + a.name_value_list.phone_work.value + "</h4>";
                    b = $("<a/>", {
                        href: "tel:" + b,
                        rel: "external",
                        style: "text-decoration:none;color:#444;"
                    });
                    b.append("<p><br />Office Phone</p>");
                    b.append(d);
                    c.append(b);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.phone_mobile !== undefined && a.name_value_list.phone_mobile.value !== "") {
                    c = $("<li/>");
                    b = a.name_value_list.phone_mobile.value.replace("(", "");
                    b = b.replace(")", "");
                    b = b.replace(" ", "");
                    b = b.replace("-", "");
                    d = "<h4>Mobile Phone:&nbsp;" + a.name_value_list.phone_mobile.value + "</h4>";
                    b = $("<a/>", {
                        href: "tel:" + b,
                        rel: "external",
                        style: "text-decoration:none;color:#444;"
                    });
                    b.append("<p><br />Mobile Phone</p>");
                    b.append(d);
                    c.append(b);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.phone_fax !== undefined && a.name_value_list.phone_fax.value !== "") {
                    c = $("<li/>");
                    d = "<h4>" + a.name_value_list.phone_fax.value + "</h4>";
                    c.append("<p><br />Fax</p>");
                    c.append(d);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                a.name_value_list.department !== undefined && a.name_value_list.department.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Department</p><h4>" + a.name_value_list.department.value + "</h4></li>");
                if (a.name_value_list.primary_address_street !== undefined && a.name_value_list.primary_address_street.value != "" || a.name_value_list.primary_address_city !== undefined && a.name_value_list.primary_address_city.value != "" || a.name_value_list.primary_address_state !== undefined && a.name_value_list.primary_address_state.value != "" || a.name_value_list.primary_address_postalcode !== undefined && a.name_value_list.primary_address_postalcode.value != "" || a.name_value_list.primary_address_country !== undefined && a.name_value_list.primary_address_country.value != "") {
                    c = $("<li/>");
                    b = a.name_value_list.primary_address_street.value;
                    var f = a.name_value_list.primary_address_city.value,
                        e = a.name_value_list.primary_address_state.value,
                        g = a.name_value_list.primary_address_postalcode.value;
                    d = "<h4>" + b + "<br />" + f + ", " + e + g + "<br />" + a.name_value_list.primary_address_country.value + "</h4>";
                    b = $("<a/>", {
                        href: "http://maps.google.com/?q=" + b + "%20" + f + "%20" + e + "%20" + g + "&t=m&z=13",
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                    b.append("<p><br />Primary Address</p>");
                    b.append(d);
                    c.append(b);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.alt_address_street !== undefined && a.name_value_list.alt_address_street.value != "" || a.name_value_list.alt_address_city !== undefined && a.name_value_list.alt_address_city.value != "" || a.name_value_list.alt_address_state !== undefined && a.name_value_list.alt_address_state.value != "" || a.name_value_list.alt_address_postalcode !== undefined && a.name_value_list.alt_address_postalcode.value != "" || a.name_value_list.alt_address_country !== undefined && a.name_value_list.alt_address_country.value != "") {
                    c = $("<li/>");
                    b = a.name_value_list.alt_address_street.value;
                    f = a.name_value_list.alt_address_city.value;
                    e = a.name_value_list.alt_address_state.value;
                    g = a.name_value_list.alt_address_postalcode.value;
                    d = "<h4>" + b + "<br />" + f + ", " + e + g + "<br />" + a.name_value_list.alt_address_country.value + "</h4>";
                    b = $("<a/>", {
                        href: "http://maps.google.com/?q=" + b + "%20" + f + "%20" + e + "%20" + g + "&t=m&z=13",
                        rel: "external",
                        target: "_new",
                        style: "text-decoration:none;color:#444;"
                    });
                    b.append("<p><br />Other Address</p>");
                    b.append(d);
                    c.append(b);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                if (a.name_value_list.email1 !== undefined && a.name_value_list.email1.value !== "") {
                    c = $("<li/>");
                    d = "<h4>" + a.name_value_list.email1.value + "</h4>";
                    b = $("<a/>", {
                        href: "mailto:" + a.name_value_list.email1.value,
                        rel: "external",
                        style: "text-decoration:none;color:#444;"
                    });
                    b.append("<p><br />Email</p>");
                    b.append(d);
                    c.append(b);
                    $("#ViewLeadDetailsPageDetailsList").append(c)
                }
                a.name_value_list.description !== undefined && a.name_value_list.description.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Description<p><h4>" + a.name_value_list.description.value + "</h4></li>");
                $("#ViewLeadDetailsPageDetailsList").append('<li data-role="list-divider">More Information</li>');
                a.name_value_list.status !== undefined && a.name_value_list.status.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Status<p><h4>" + a.name_value_list.status.value + "</h4></li>");
                a.name_value_list.lead_source !== undefined && a.name_value_list.lead_source.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Source<p><h4>" + a.name_value_list.lead_source.value + "</h4></li>");
                a.name_value_list.status_description !== undefined && a.name_value_list.status_description.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Status Desccription<p><h4>" + a.name_value_list.status_description.value + "</h4></li>");
                a.name_value_list.lead_source_description !== undefined && a.name_value_list.lead_source_description.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Source Description<p><h4>" + a.name_value_list.lead_source_description.value + "</h4></li>");
                a.name_value_list.opportunity_amount !== undefined && a.name_value_list.opportunity_amount.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Opportunity Amount<p><h4>$" + parseFloat(a.name_value_list.opportunity_amount.value).toFixed(2) + "</h4></li>");
                a.name_value_list.refered_by !== undefined && a.name_value_list.refered_by.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Referred By<p><h4>" + a.name_value_list.refered_by.value + "</h4></li>");
                a.name_value_list.campaign_name !== undefined && a.name_value_list.campaign_name.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br /><p><h4>Campaign:&nbsp;" + a.name_value_list.campaign_name.value + "</h4></li>");
                $("#ViewLeadDetailsPageDetailsList").append('<li data-role="list-divider">Other Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.date_modified !== undefined && a.name_value_list.date_modified.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + a.name_value_list.modified_by_name.value + "</h4></li>");
                a.name_value_list.date_entered !== undefined && a.name_value_list.date_entered.value !== "" && $("#ViewLeadDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + a.name_value_list.created_by_name.value + "</h4></li>");
                a.name_value_list.do_not_call.value == "true" && alert("*NOTE: This Lead is marked as Do Not Call.")
            }
            $("#ViewLeadDetailsPageDetailsList").listview("refresh")
        }
    });

    if (HaveCalls) { getLeadRelatedCallsInsetList(); }
    if (HaveMeetings) { getLeadRelatedMeetingsInsetList(); }
    if (HaveTasks) { getLeadRelatedTasksInsetList(); }
}

function getLeadRelatedCallsInsetList() {
    $("#ViewLeadDetailsPageCallsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","module_id":"' + CurrentLeadId + '","link_field_name":"calls","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewLeadDetailsPageCallsListUl").append('<li data-role="list-divider">Calls</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status != undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    var g = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentCallId = $(this).data("identity");
                            $.mobile.changePage("ViewCallDetailsPage")
                        }
                    });
                    g.append(f);
                    b.name_value_list.status != undefined && g.append(e);
                    d.append(g);
                    $("#ViewLeadDetailsPageCallsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewLeadDetailsPageCallsListUl").append(a)
            }
            $("#ViewLeadDetailsPageCallsListUl").listview("refresh")
        }
    })
}

function getLeadRelatedMeetingsInsetList() {
    $("#ViewLeadDetailsPageMeetingsListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","module_id":"' + CurrentLeadId + '","link_field_name":"meetings","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewLeadDetailsPageMeetingsListUl").append('<li data-role="list-divider">Meetings</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status != undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentMeetingId = $(this).data("identity");
                            $.mobile.changePage("ViewMeetingDetailsPage")
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewLeadDetailsPageMeetingsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewLeadDetailsPageMeetingsListUl").append(a)
            }
            $("#ViewLeadDetailsPageMeetingsListUl").listview("refresh")
        }
    })
}

function getLeadRelatedTasksInsetList() {
    $("#ViewLeadDetailsPageTasksListUl li").remove();
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Leads","module_id":"' + CurrentLeadId + '","link_field_name":"tasks","related_module_query":"","related_fields":["id","name","status","date_start"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewLeadDetailsPageTasksListUl").append('<li data-role="list-divider">Tasks</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.name.value + "</h4>",
                        e = "";
                    if (b.name_value_list.status != undefined) {
                        e = "<p>" + b.name_value_list.status.value;
                        if (b.name_value_list.date_start != undefined) e += "<br/>" + b.name_value_list.date_start.value;
                        e += "</p>"
                    } else e = "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentTaskId = $(this).data("identity");
                            $.mobile.changePage("ViewTaskDetailsPage")
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewLeadDetailsPageTasksListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewLeadDetailsPageTasksListUl").append(a)
            }
            $("#ViewLeadDetailsPageTasksListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function SugarCrmGetCallsListFromServer(a) {
    if ($("#AllCallsListDiv li").length === 0 || CallsListCurrentOffset !== a) {
        $.mobile.pageLoading();
        CallsListCurrentOffset = a;
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","query":"","order_by":"date_start desc","offset":' + a + ',"select_fields":'+CallsListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) CallsListCurrentOffset = CallsListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) CallsListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllCallsListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<p>" + d.name_value_list.date_start.value + "</p>",
                                g = "<h4>" + d.name_value_list.name.value + "</h4>",
                                h = "<p>" + d.name_value_list.direction.value + " " + d.name_value_list.status.value + "</p>";
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentCallId = $(this).data("identity");
                                    $.mobile.changePage("ViewCallDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetCallDetails()
                                }
                            });
                            d.append(g);
                            d.append(h);
                            d.append(e);
                            f.append(d);
                            $("#AllCallsListDiv").append(f)
                        }
                        $("#AllCallsListDiv").listview("refresh");
                        CallsListNextOffset = c.next_offset;
                        CallsListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetCallDetails() {
    $.mobile.pageLoading();
    $("#CallNameH1").html("");
    $("#CallSubjectP").text("");
    $("#ViewCallDetailsPageDetailsList li").remove();
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","id":"' + CurrentCallId + '","select_fields":'+CallsDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#CallNameH1").html(a.name_value_list.name.value);
                var c = a.name_value_list.direction.value + " " + a.name_value_list.status.value;
                $("#CallSubjectP").text(c);
                $("#ViewCallDetailsPageDetailsList").append('<li data-role="list-divider">Call Overview</li>');
                a.name_value_list.date_start !== undefined && a.name_value_list.date_start.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Start Date/Time</p><h4>" + a.name_value_list.date_start.value + "</h4></li>");
                a.name_value_list.duration_hours !== undefined && a.name_value_list.duration_hours.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Duration</p><h4>" + a.name_value_list.duration_hours.value + "h&nbsp;" + a.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                a.name_value_list.description !== undefined && a.name_value_list.description.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Description</p><h4>" + a.name_value_list.description.value + "</h4></li>");
                $("#ViewCallDetailsPageDetailsList").append('<li data-role="list-divider">Other Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + a.name_value_list.modified_by_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewCallDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + a.name_value_list.created_by_name.value + "</h4></li>");
                a.name_value_list.parent_id !== undefined && a.name_value_list.parent_id.value !== "" ? getCallParentDetails(a.name_value_list.parent_type.value, a.name_value_list.parent_id.value) : $("#ViewCallDetailsPageDetailsList").listview("refresh")
            }
        }
    });

    if (HaveContacts) { getCallRelatedContactsInsetList(); }
    getCallRelatedUsersInsetList();
    if (HaveLeads) { getCallRelatedLeadsInsetList(); }
}

function getCallParentDetails(a, c) {
    var b = "<h4>" + a + ":&nbsp;";
    selectfield = d.module_name == "Leads" || d.module_name == "Contacts" ? '"first_name","last_name"' : '"name"';
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + a + '","id":"' + c + '","select_fields":['+selectfield+'],"link_name_to_fields_array":""}'
    }, function (d) {
        d = jQuery.parseJSON(d);
        if (d.name !== undefined && d.name === "Invalid Session ID") {
            SugarSessionId = "";
            $.mobile.changePage("HomePage")
        }
        if (d != undefined && d.entry_list != undefined) if (d.entry_list[0] != undefined) {
            d = d.entry_list[0];
            b += d.module_name == "Leads" || d.module_name == "Contacts" ? d.name_value_list.first_name.value + " " + d.name_value_list.last_name.value : d.name_value_list.name.value
        }
        b += "</h4>";
        $("#ViewCallDetailsPageDetailsList").append('<li data-role="list-divider">Related To</li>');
        $("#ViewCallDetailsPageDetailsList").append("<li>" + b + "</li>");
        $("#ViewCallDetailsPageDetailsList").listview("refresh")
    })
}

function getCallRelatedContactsInsetList() {
    $("#ViewCallDetailsPageContactsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewCallDetailsPageContactsListUl").append('<li data-role="list-divider">Contacts</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>",
                        e = "<p>" + b.name_value_list.title.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentContactId = $(this).data("identity");
                            $.mobile.changePage("ViewContactDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetContactDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewCallDetailsPageContactsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewCallDetailsPageContactsListUl").append(a)
            }
            $("#ViewCallDetailsPageContactsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getCallRelatedUsersInsetList() {
    $("#ViewCallDetailsPageUsersListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"users","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewCallDetailsPageUsersListUl").append('<li data-role="list-divider">Users</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<p>" + b.name_value_list.title.value + "</p>";
                    d.append("<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>");
                    d.append(f);
                    $("#ViewCallDetailsPageUsersListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewCallDetailsPageUsersListUl").append(a)
            }
            $("#ViewCallDetailsPageUsersListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getCallRelatedLeadsInsetList() {
    $("#ViewCallDetailsPageLeadsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Calls","module_id":"' + CurrentCallId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewCallDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                        e = "";
                    e = b.name_value_list.title != undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentLeadId = $(this).data("identity");
                            $.mobile.changePage("ViewLeadDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetLeadDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewCallDetailsPageLeadsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewCallDetailsPageLeadsListUl").append(a)
            }
            $("#ViewCallDetailsPageLeadsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function SugarCrmGetMeetingsListFromServer(a) {
    if ($("#AllMeetingsListDiv li").length === 0 || MeetingsListCurrentOffset !== a) {
        $.mobile.pageLoading();
        MeetingsListCurrentOffset = a;
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","query":"","order_by":"date_start desc","offset":' + a + ',"select_fields":'+MeetingsListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) MeetingsListCurrentOffset = MeetingsListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) MeetingsListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllMeetingsListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.name.value + "</h4>",
                                g = "<p>" + d.name_value_list.status.value + " " + d.name_value_list.date_start.value + "</p>";
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentMeetingId = $(this).data("identity");
                                    $.mobile.changePage("ViewMeetingDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetMeetingDetails()
                                }
                            });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllMeetingsListDiv").append(f)
                        }
                        $("#AllMeetingsListDiv").listview("refresh");
                        MeetingsListNextOffset = c.next_offset;
                        MeetingsListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetMeetingDetails() {
    $.mobile.pageLoading();
    $("#MeetingNameH1").html("");
    $("#MeetingSubjectP").text("");
    $("#ViewMeetingDetailsPageDetailsList li").remove();
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","id":"' + CurrentMeetingId + '","select_fields":'+MeetingsDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#MeetingNameH1").html(a.name_value_list.name.value);
                var c = a.name_value_list.status.value;
                $("#MeetingSubjectP").text(c);
                $("#ViewMeetingDetailsPageDetailsList").append('<li data-role="list-divider">Meeting Overview</li>');
                a.name_value_list.date_start !== undefined && a.name_value_list.date_start.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Start Date/Time</p><h4>" + a.name_value_list.date_start.value + "</h4></li>");
                a.name_value_list.duration_hours !== undefined && a.name_value_list.duration_hours.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Duration</p><h4>" + a.name_value_list.duration_hours.value + "h&nbsp;" + a.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                a.name_value_list.description !== undefined && a.name_value_list.description.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Description</p><h4>" + a.name_value_list.description.value + "</h4></li>");
                $("#ViewMeetingDetailsPageDetailsList").append('<li data-role="list-divider">Other Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + a.name_value_list.modified_by_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewMeetingDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + a.name_value_list.created_by_name.value + "</h4></li>");
                a.name_value_list.parent_id !== undefined && a.name_value_list.parent_id.value !== "" ? getMeetingParentDetails(a.name_value_list.parent_type.value, a.name_value_list.parent_id.value) : $("#ViewMeetingDetailsPageDetailsList").listview("refresh")
            }
        }
    });

    if (HaveContacts) { getMeetingRelatedContactsInsetList(); }
    getMeetingRelatedUsersInsetList();
    if (HaveLeads) { getMeetingRelatedLeadsInsetList(); }
}

function getMeetingParentDetails(a, c) {
    var b = "<h4>" + a + ":&nbsp;";
    selectfield = d.module_name == "Leads" || d.module_name == "Contacts" ? '"first_name","last_name"' : '"name"';

    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + a + '","id":"' + c + '","select_fields":['+selectfield+'],"link_name_to_fields_array":""}'
    }, function (d) {
        d = jQuery.parseJSON(d);
        if (d.name !== undefined && d.name === "Invalid Session ID") {
            SugarSessionId = "";
            $.mobile.changePage("HomePage")
        }
        if (d != undefined && d.entry_list != undefined) if (d.entry_list[0] != undefined) {
            d = d.entry_list[0];
            b += d.module_name == "Leads" || d.module_name == "Contacts" ? d.name_value_list.first_name.value + " " + d.name_value_list.last_name.value : d.name_value_list.name.value
        }
        b += "</h4>";
        $("#ViewMeetingDetailsPageDetailsList").append('<li data-role="list-divider">Related To</li>');
        $("#ViewMeetingDetailsPageDetailsList").append("<li>" + b + "</li>");
        $("#ViewMeetingDetailsPageDetailsList").listview("refresh")
    })
}

function getMeetingRelatedContactsInsetList() {
    $("#ViewMeetingDetailsPageContactsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewMeetingDetailsPageContactsListUl").append('<li data-role="list-divider">Contacts</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>",
                        e = "<p>" + b.name_value_list.title.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentContactId = $(this).data("identity");
                            $.mobile.changePage("ViewContactDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetContactDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewMeetingDetailsPageContactsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewMeetingDetailsPageContactsListUl").append(a)
            }
            $("#ViewMeetingDetailsPageContactsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getMeetingRelatedUsersInsetList() {
    $("#ViewMeetingDetailsPageUsersListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"users","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewMeetingDetailsPageUsersListUl").append('<li data-role="list-divider">Users</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<p>" + b.name_value_list.title.value + "</p>";
                    d.append("<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>");
                    d.append(f);
                    $("#ViewMeetingDetailsPageUsersListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewMeetingDetailsPageUsersListUl").append(a)
            }
            $("#ViewMeetingDetailsPageUsersListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getMeetingRelatedLeadsInsetList() {
    $("#ViewMeetingDetailsPageLeadsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Meetings","module_id":"' + CurrentMeetingId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewMeetingDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                        e = "";
                    e = b.name_value_list.title != undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentLeadId = $(this).data("identity");
                            $.mobile.changePage("ViewLeadDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetLeadDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewMeetingDetailsPageLeadsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewMeetingDetailsPageLeadsListUl").append(a)
            }
            $("#ViewMeetingDetailsPageLeadsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function SugarCrmGetTasksListFromServer(a) {
    if ($("#AllTasksListDiv li").length === 0 || TasksListCurrentOffset !== a) {
        $.mobile.pageLoading();
        TasksListCurrentOffset = a;
        $.get(resturl, {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","query":"","order_by":"date_start desc","offset":' + a + ',"select_fields":'+TasksListField+',"link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function (c) {
            if (c != undefined) {
                c = jQuery.parseJSON(c);
                if (c.name !== undefined && c.name === "Invalid Session ID") {
                    SugarSessionId = "";
                    $.mobile.changePage("HomePage")
                }
                if (c != undefined && c.entry_list != undefined) {
                    if (c.result_count === 0) TasksListCurrentOffset = TasksListPrevOffset + RowsPerPageInListViews;
                    else if (c.next_offset === 0) TasksListCurrentOffset = 0;
                    if (c.next_offset == 0 || c.result_count == 0) alert("There are no more records in that direction");
                    else {
                        $("#AllTasksListDiv li").remove();
                        var b = 0;
                        for (b = 0; b <= c.entry_list.length; b++) if (c.entry_list[b] != undefined) {
                            var d = c.entry_list[b],
                                f = $("<li/>"),
                                e = "<h4>" + d.name_value_list.name.value + "</h4>",
                                g = "<p>" + d.name_value_list.status.value + " - " + d.name_value_list.date_due.value + "</p>";
                            d = $("<a/>", {
                                href: "#",
                                "data-identity": d.id,
                                click: function () {
                                    CurrentTaskId = $(this).data("identity");
                                    $.mobile.changePage("ViewTaskDetailsPage");
                                    $.mobile.pageLoading();
                                    SugarCrmGetTaskDetails()
                                }
                            });
                            d.append(e);
                            d.append(g);
                            f.append(d);
                            $("#AllTasksListDiv").append(f)
                        }
                        $("#AllTasksListDiv").listview("refresh");
                        TasksListNextOffset = c.next_offset;
                        TasksListPrevOffset = a - RowsPerPageInListViews
                    }
                }
            }
            $.mobile.pageLoading(true)
        })
    }
}

function SugarCrmGetTaskDetails() {
    $.mobile.pageLoading();
    $("#TaskNameH1").html("");
    $("#TaskSubjectP").text("");
    $("#ViewTaskDetailsPageDetailsList li").remove();
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","id":"' + CurrentTaskId + '","select_fields":'+TasksDetailsField+',"link_name_to_fields_array":""}'
    }, function (a) {
        if (a != undefined) {
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list[0] != undefined) {
                a = a.entry_list[0];
                $("#TaskNameH1").html(a.name_value_list.name.value);
                var c = a.name_value_list.status.value;
                $("#TaskSubjectP").text(c);
                $("#ViewTaskDetailsPageDetailsList").append('<li data-role="list-divider">Task Overview</li>');
                a.name_value_list.date_due !== undefined && a.name_value_list.date_due.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Due Date</p><h4>" + a.name_value_list.date_due.value + "</h4></li>");
                a.name_value_list.duration_hours !== undefined && a.name_value_list.duration_hours.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Duration</p><h4>" + a.name_value_list.duration_hours.value + "h&nbsp;" + a.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                a.name_value_list.description !== undefined && a.name_value_list.description.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Description</p><h4>" + a.name_value_list.description.value + "</h4></li>");
                $("#ViewTaskDetailsPageDetailsList").append('<li data-role="list-divider">Other Information</li>');
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Assigned To</p><h4>" + a.name_value_list.assigned_user_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Date Modified</p><h4>" + a.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + a.name_value_list.modified_by_name.value + "</h4></li>");
                a.name_value_list.assigned_user_name !== undefined && a.name_value_list.assigned_user_name.value !== "" && $("#ViewTaskDetailsPageDetailsList").append("<li><p><br />Date Created</p><h4>" + a.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + a.name_value_list.created_by_name.value + "</h4></li>");
                a.name_value_list.parent_id !== undefined && a.name_value_list.parent_id.value !== "" ? getTaskParentDetails(a.name_value_list.parent_type.value, a.name_value_list.parent_id.value) : $("#ViewTaskDetailsPageDetailsList").listview("refresh")
            }
        }
        if (HaveContacts) { getTaskRelatedContactsInsetList(); }
        getTaskRelatedUsersInsetList();
        if (HaveTasks) { getTaskRelatedLeadsInsetList();}
    })
}

function getTaskParentDetails(a, c) {
    var b = "<h4>" + a + ":&nbsp;";
    selectfield = d.module_name == "Leads" || d.module_name == "Contacts" ? '"first_name","last_name"' : '"name"';
    $.get(resturl, {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + a + '","id":"' + c + '","select_fields":['+selectfield+'],"link_name_to_fields_array":""}'
    }, function (d) {
        d = jQuery.parseJSON(d);
        if (d.name !== undefined && d.name === "Invalid Session ID") {
            SugarSessionId = "";
            $.mobile.changePage("HomePage")
        }
        if (d != undefined && d.entry_list != undefined) if (d.entry_list[0] != undefined) {
            d = d.entry_list[0];
            b += d.module_name == "Leads" || d.module_name == "Contacts" ? d.name_value_list.first_name.value + " " + d.name_value_list.last_name.value : d.name_value_list.name.value
        }
        b += "</h4>";
        $("#ViewTaskDetailsPageDetailsList").append('<li data-role="list-divider">Related To</li>');
        $("#ViewTaskDetailsPageDetailsList").append("<li>" + b + "</li>");
        $("#ViewTaskDetailsPageDetailsList").listview("refresh")
    })
}

function getTaskRelatedContactsInsetList() {
    $("#ViewTaskDetailsPageContactsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewTaskDetailsPageContactsListUl").append('<li data-role="list-divider">Contacts</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>",
                        e = "<p>" + b.name_value_list.title.value + "</p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentContactId = $(this).data("identity");
                            $.mobile.changePage("ViewContactDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetContactDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewTaskDetailsPageContactsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewTaskDetailsPageContactsListUl").append(a)
            }
            $("#ViewTaskDetailsPageContactsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getTaskRelatedUsersInsetList() {
    $("#ViewTaskDetailsPageUsersListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"users","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewTaskDetailsPageUsersListUl").append('<li data-role="list-divider">Users</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<p>" + b.name_value_list.title.value + "</p>";
                    d.append("<h4>" + b.name_value_list.first_name.value + "&nbsp;" + b.name_value_list.last_name.value + "</h4>");
                    d.append(f);
                    $("#ViewTaskDetailsPageUsersListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewTaskDetailsPageUsersListUl").append(a)
            }
            $("#ViewTaskDetailsPageUsersListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
}

function getTaskRelatedLeadsInsetList() {
    $("#ViewTaskDetailsPageLeadsListUl li").remove();
    SugarSessionId == "" && $.mobile.changePage("HomePage");
    $.get(resturl, {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function (a) {
        if (a != undefined) {
            $("#ViewTaskDetailsPageLeadsListUl").append('<li data-role="list-divider">Leads</li>');
            a = jQuery.parseJSON(a);
            if (a.name !== undefined && a.name === "Invalid Session ID") {
                SugarSessionId = "";
                $.mobile.changePage("HomePage")
            }
            if (a != undefined && a.entry_list != undefined) if (a.entry_list.length > 0) {
                var c = 0;
                for (c = 0; c <= a.entry_list.length; c++) if (a.entry_list[c] != undefined) {
                    var b = a.entry_list[c],
                        d = $("<li/>"),
                        f = "<h4>" + b.name_value_list.first_name.value + " " + b.name_value_list.last_name.value + "</h4>",
                        e = "";
                    e = b.name_value_list.title != undefined ? "<p>" + b.name_value_list.title.value + "</p>" : "<p></p>";
                    b = $("<a/>", {
                        href: "#",
                        "data-identity": b.id,
                        click: function () {
                            CurrentLeadId = $(this).data("identity");
                            $.mobile.changePage("ViewLeadDetailsPage");
                            $.mobile.pageLoading();
                            SugarCrmGetLeadDetails()
                        }
                    });
                    b.append(f);
                    b.append(e);
                    d.append(b);
                    $("#ViewTaskDetailsPageLeadsListUl").append(d)
                }
            } else {
                a = $("<li/>");
                a.append("<h4>No Data</h4>");
                $("#ViewTaskDetailsPageLeadsListUl").append(a)
            }
            $("#ViewTaskDetailsPageLeadsListUl").listview("refresh")
        }
        $.mobile.pageLoading(true)
    })
};