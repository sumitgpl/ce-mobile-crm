function SugarCrmGetTasksListFromServer(offset) {
    var existingList = $('#AllTasksListDiv li');
    if ((existingList.length === 0) || (TasksListCurrentOffset !== offset)) {
        $.mobile.pageLoading();
        TasksListCurrentOffset = offset
        $.get('../service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","query":"","order_by":"date_start desc","offset":' + offset + ',"select_fields":"","link_name_to_fields_array":"","max_results":' + RowsPerPageInListViews + ',"deleted":0}'
        }, function(data) {
            if (data != undefined) {
                var tasksList = jQuery.parseJSON(data);
                if ((tasksList.name !== undefined) && (tasksList.name === "Invalid Session ID")) {
                    SugarSessionId = ''
                    $.mobile.changePage('LoginPage');
                }
                if ((tasksList != undefined) && (tasksList.entry_list != undefined)) {
                    /* Set the current offset accordingly */
                    if (tasksList.result_count === 0) {
                        TasksListCurrentOffset = (TasksListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (tasksList.next_offset === 0) {
                            TasksListCurrentOffset = 0;
                        }
                    }
                    if ((tasksList.next_offset == 0) || (tasksList.result_count == 0))
                    {
                        alert('There are no more records in that direction');
                    } else {
                        $('#AllTasksListDiv li').remove();

                        var intTasks = 0;
                        for(intTasks=0;intTasks<=tasksList.entry_list.length;intTasks++)
                        {
                            if (tasksList.entry_list[intTasks] != undefined) {
                                var task = tasksList.entry_list[intTasks];
                                var listItem = $("<li/>");
                                var header = "<h4>" + task.name_value_list.name.value + "</h4>";
                                var taskParagraph = "<p>" + task.name_value_list.status.value + " - " + task.name_value_list.date_due.value + "</p>";
                                var taskLink = $("<a/>", {
                                    href: "#",
                                    "data-identity": task.id,
                                    click: function() {
                                        CurrentTaskId = $(this).data("identity");
                                        $.mobile.changePage('ViewTaskDetailsPage');
                                        $.mobile.pageLoading();
                                        SugarCrmGetTaskDetails();
                                    }
                                });
                                taskLink.append( header );
                                taskLink.append(taskParagraph);
                                listItem.append( taskLink );
                                $('#AllTasksListDiv').append(listItem);
                            }
                        }
                        $('#AllTasksListDiv').listview("refresh");
                        TasksListNextOffset = tasksList.next_offset;
                        var newTasksPreviousOffset = (offset - RowsPerPageInListViews);
                        TasksListPrevOffset = newTasksPreviousOffset;
                    }
                }
            }
            $.mobile.pageLoading(true);
        });
    }
}

function SugarCrmGetTaskDetails() {
    $.mobile.pageLoading();
    $('#TaskNameH1').html('');
    $('#TaskSubjectP').text('');
    $('#ViewTaskDetailsPageDetailsList li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","id":"' + CurrentTaskId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var tasksList = jQuery.parseJSON(data);
            if ((tasksList.name !== undefined) && (tasksList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((tasksList != undefined) && (tasksList.entry_list != undefined)) {
                if (tasksList.entry_list[0] != undefined) {
                    var task = tasksList.entry_list[0];
                    /* Set the Main Header and Paragraph */
                    $('#TaskNameH1').html(task.name_value_list.name.value);
                    var taskPText =  task.name_value_list.status.value;
                    $('#TaskSubjectP').text(taskPText);
                    /* Append the first divider */
                    $('#ViewTaskDetailsPageDetailsList').append("<li data-role=\"list-divider\">Task Overview</li>");
                    if ((task.name_value_list.date_due !== undefined) && (task.name_value_list.date_due.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Due Date</p><h4>" + task.name_value_list.date_due.value + "</h4></li>");
                    }

                    if ((task.name_value_list.duration_hours !== undefined) && (task.name_value_list.duration_hours.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Duration</p><h4>" + task.name_value_list.duration_hours.value + "h&nbsp;" + task.name_value_list.duration_minutes.value + "m&nbsp;</h4></li>");
                    }

                    if ((task.name_value_list.description !== undefined) && (task.name_value_list.description.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Description</p><h4>" + task.name_value_list.description.value + "</h4></li>");
                    }
                    /* Record Information */
                    $('#ViewTaskDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((task.name_value_list.assigned_user_name !== undefined) && (task.name_value_list.assigned_user_name.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Assigned To</p><h4>" + task.name_value_list.assigned_user_name.value +"</h4></li>");
                    }
                    if ((task.name_value_list.date_modified !== undefined) && (task.name_value_list.date_modified.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + task.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + task.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((task.name_value_list.date_entered !== undefined) && (task.name_value_list.date_entered.value !== "")) {
                        $('#ViewTaskDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + task.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + task.name_value_list.created_by_name.value +"</h4></li>");
                    }
                    if ((task.name_value_list.parent_id !== undefined) && (task.name_value_list.parent_id.value !== "")) {
                        getTaskParentDetails(task.name_value_list.parent_type.value,task.name_value_list.parent_id.value);
                    }
                    else {
                        $('#ViewTaskDetailsPageDetailsList').listview("refresh");
                    }
                }
            }
        }
    getTaskRelatedContactsInsetList();
    getTaskRelatedUsersInsetList();
    getTaskRelatedLeadsInsetList();
    });
}

function getTaskParentDetails(taskDetailsParentType,taskDetailsParentId) {
    var parentInfo = "<h4>" + taskDetailsParentType + ":&nbsp;";
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"' + taskDetailsParentType + '","id":"' + taskDetailsParentId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        var parentsList = jQuery.parseJSON(data);
        if ((parentsList.name !== undefined) && (parentsList.name === "Invalid Session ID")) {
            SugarSessionId = ''
            $.mobile.changePage('LoginPage');
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
        $('#ViewTaskDetailsPageDetailsList').append("<li data-role=\"list-divider\">Related To</li>");
        $('#ViewTaskDetailsPageDetailsList').append("<li>" + parentInfo + "</li>");
        $('#ViewTaskDetailsPageDetailsList').listview("refresh");
    });
}

function getTaskRelatedContactsInsetList() {
    $('#ViewTaskDetailsPageContactsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"contacts","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewTaskDetailsPageContactsListUl').append("<li data-role=\"list-divider\">Contacts</li>");
            var taskContactsList = jQuery.parseJSON(data);
            if ((taskContactsList.name !== undefined) && (taskContactsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((taskContactsList != undefined) && (taskContactsList.entry_list != undefined)) {
                if (taskContactsList.entry_list.length>0)
                {
                    var intTaskContact = 0;
                    for(intTaskContact=0;intTaskContact<=taskContactsList.entry_list.length;intTaskContact++)
                    {
                        if (taskContactsList.entry_list[intTaskContact] != undefined) {
                            var taskConctact = taskContactsList.entry_list[intTaskContact];
                            var taskContactListItem = $("<li/>");
                            var taskContactHeader = "<h4>" + taskConctact.name_value_list.first_name.value + "&nbsp;" + taskConctact.name_value_list.last_name.value + "</h4>";
                            var taskContactParagraph = "<p>" + taskConctact.name_value_list.title.value + "</p>";

                            var taskContactLink = $("<a/>", {
                                href: "#",
                                "data-identity": taskConctact.id,
                                click: function() {
                                    CurrentContactId = $(this).data("identity");
                                    $.mobile.changePage('ViewContactDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetContactDetails();
                                }
                            });
                            taskContactLink.append( taskContactHeader );
                            taskContactLink.append(taskContactParagraph);
                            taskContactListItem.append( taskContactLink );
                            $('#ViewTaskDetailsPageContactsListUl').append(taskContactListItem);
                        }
                    }
                }
                else {
                    var taskContactEmptyListItem = $("<li/>");
                    var contactContactEmptyListHeader = "<h4>No Data</h4>";
                    taskContactEmptyListItem.append(contactContactEmptyListHeader);
                    $('#ViewTaskDetailsPageContactsListUl').append(taskContactEmptyListItem);
                }
            }
            $('#ViewTaskDetailsPageContactsListUl').listview("refresh");
        }
        $.mobile.pageLoading(true);
    });
}

function getTaskRelatedUsersInsetList() {
    $('#ViewTaskDetailsPageUsersListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"users","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewTaskDetailsPageUsersListUl').append("<li data-role=\"list-divider\">Users</li>");
            var taskUsersList = jQuery.parseJSON(data);
            if ((taskUsersList.name !== undefined) && (taskUsersList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((taskUsersList != undefined) && (taskUsersList.entry_list != undefined)) {
                if (taskUsersList.entry_list.length>0)
                {
                    var intTaskUser = 0;
                    for(intTaskUser=0;intTaskUser<=taskUsersList.entry_list.length;intTaskUser++)
                    {
                        if (taskUsersList.entry_list[intTaskUser] != undefined) {
                            var taskUser = taskUsersList.entry_list[intTaskUser];
                            var taskUserListItem = $("<li/>");
                            var taskUserHeader = "<h4>" + taskUser.name_value_list.first_name.value + "&nbsp;" + taskUser.name_value_list.last_name.value + "</h4>";
                            var taskUserParagraph = "<p>" + taskUser.name_value_list.title.value + "</p>";
                            taskUserListItem.append(taskUserHeader);
                            taskUserListItem.append(taskUserParagraph);
                            $('#ViewTaskDetailsPageUsersListUl').append(taskUserListItem);
                        }
                    }
                }
                else {
                    var taskUserEmptyListItem = $("<li/>");
                    var taskUserEmptyListHeader = "<h4>No Data</h4>";
                    taskUserEmptyListItem.append(taskUserEmptyListHeader);
                    $('#ViewTaskDetailsPageUsersListUl').append(taskUserEmptyListItem);
                }
            }
            $('#ViewTaskDetailsPageUsersListUl').listview("refresh");
        }
        $.mobile.pageLoading(true);
    });
}

function getTaskRelatedLeadsInsetList() {
    $('#ViewTaskDetailsPageLeadsListUl li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_relationships",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Tasks","module_id":"' + CurrentTaskId + '","link_field_name":"leads","related_module_query":"","related_fields":["id","first_name","last_name","title"],"related_module_link_name_to_fields_array":"","deleted":0}'
    }, function(data) {
        if (data != undefined) {
            $('#ViewTaskDetailsPageLeadsListUl').append("<li data-role=\"list-divider\">Leads</li>");
            var taskLeadsList = jQuery.parseJSON(data);
            if ((taskLeadsList.name !== undefined) && (taskLeadsList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((taskLeadsList != undefined) && (taskLeadsList.entry_list != undefined)) {
                if (taskLeadsList.entry_list.length>0)
                {
                    var intTaskLead = 0;
                    for(intTaskLead=0;intTaskLead<=taskLeadsList.entry_list.length;intTaskLead++)
                    {
                        if (taskLeadsList.entry_list[intTaskLead] != undefined) {
                            var taskLead = taskLeadsList.entry_list[intTaskLead];
                            var taskLeadListItem = $("<li/>");
                            var taskLeadHeader = "<h4>" + taskLead.name_value_list.first_name.value + " " + taskLead.name_value_list.last_name.value + "</h4>";
                            var taskLeadParagraph = '';
                            if (taskLead.name_value_list.title != undefined) {
                                taskLeadParagraph = "<p>" + taskLead.name_value_list.title.value + "</p>";
                            } else {
                                taskLeadParagraph = "<p></p>";
                            }
                            var taskLeadLink = $("<a/>", {
                                href: "#",
                                "data-identity": taskLead.id,
                                click: function() {
                                    CurrentLeadId = $(this).data("identity");
                                    $.mobile.changePage('ViewLeadDetailsPage');
                                    $.mobile.pageLoading();
                                    SugarCrmGetLeadDetails();
                                }
                            });
                            taskLeadLink.append(taskLeadHeader);
                            taskLeadLink.append(taskLeadParagraph);
                            taskLeadListItem.append( taskLeadLink );
                            $('#ViewTaskDetailsPageLeadsListUl').append(taskLeadListItem);
                        }
                    }
                }
                else {
                    var taskLeadEmptyListItem = $("<li/>");
                    var taskLeadEmptyListHeader = "<h4>No Data</h4>";
                    taskLeadEmptyListItem.append(taskLeadEmptyListHeader);
                    $('#ViewTaskDetailsPageLeadsListUl').append(taskLeadEmptyListItem);
                }
            }
            $('#ViewTaskDetailsPageLeadsListUl').listview("refresh");
        }
        $.mobile.pageLoading(true);
    });
}
