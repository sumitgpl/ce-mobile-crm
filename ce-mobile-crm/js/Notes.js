function SugarCrmGetNotesListFromServer(offset) {
    var existingList = $('#AllNotesListDiv li');
    if ((existingList.length === 0) || (NotesListCurrentOffset !== offset)) {
        /* Show the loading panel */
        $.mobile.pageLoading();
        NotesListCurrentOffset = offset;
        /* Set the parameters of the call to the get_entry_list then place the call */
        $.get('../service/v2/rest.php', {
            method: "get_entry_list",
            input_type: "JSON",
            response_type: "JSON",
            rest_data: '{"session":"' + SugarSessionId + '",' +
            '"module_name":"Notes",' +
            '"query":"",' +
            '"order_by":"name",' +
            '"offset":' + offset + ',' +
            '"select_fields":"",' +
            '"link_name_to_fields_array":"",' +
            '"max_results":' + RowsPerPageInListViews + ',' +
            '"deleted":0}'
        }, function(data) {
            if (data !== undefined) {
                var notesList = jQuery.parseJSON(data);
            if ((notesList.name !== undefined) && (notesList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
                if ((notesList !== undefined) && (notesList.entry_list !== undefined)) {
                    /* Set the current offset accordingly */
                    if (notesList.result_count === 0) {
                        NotesListCurrentOffset = (NotesListPrevOffset + RowsPerPageInListViews);
                    } else {
                        if (notesList.next_offset === 0) {
                            NotesListCurrentOffset = 0;
                        }
                    }
                    /* Warn the user if they try to naviage beyond the records available */
                    if ((notesList.next_offset === 0) || (notesList.result_count === 0))
                    {
                        alert('There are no more records in that direction');
                    }
                    else {
                        /* Remove the existing list items before rebinding */
                        $('#AllNotesListDiv li').remove();
                        var intNote = 0;
                        for(intNote=0;intNote<=notesList.entry_list.length;intNote++)
                        {
                            if (notesList.entry_list[intNote] !== undefined) {
                                var note = notesList.entry_list[intNote];
                                var listItem = $('<li/>');
                                var header = "<h4>" + note.name_value_list.name.value + " (" + note.name_value_list.date_modified.value  + ")</h4>";
                                var noteParagraph = "<p>" + note.name_value_list.description.value + "</p>";
                                var noteLink = $('<a/>', {
                                    href: "#",
                                    "data-identity": note.id,
                                    click: function() {
                                        CurrentNoteId = $(this).data("identity");
                                        $.mobile.changePage('ViewNoteDetailsPage');
                                        $.mobile.pageLoading();
                                        SugarCrmGetNoteDetails();
                                    }
                                });
                                noteLink.append(header);
                                noteLink.append(noteParagraph);
                                listItem.append(noteLink);
                                $('#AllNotesListDiv').append(listItem);
                            }
                        }
                        /* After binding all the list items to the listview refresh it so all styles are applied */
                        $('#AllNotesListDiv').listview("refresh");
                        /* Update the Global offset variables so the paging in each direction works */
                        NotesListNextOffset = notesList.next_offset;
                        var newPreviousOffset = (offset - RowsPerPageInListViews);
                        NotesListPrevOffset = newPreviousOffset;
                    }
                }
            }
            /* Hide the loading panel */
            $.mobile.pageLoading(true);
        });
    }
}






function SugarCrmGetNoteDetails() {
    $('#NoteSubjectH1').html('');
    $('#NoteTextP').text('');
    $('#ViewNoteDetailsPageDetailsList li').remove();
    $.get('../service/v2/rest.php', {
        method: "get_entry",
        input_type: "JSON",
        response_type: "JSON",
        rest_data: '{"session":"' + SugarSessionId + '","module_name":"Notes","id":"' + CurrentNoteId + '","select_fields":"","link_name_to_fields_array":""}'
    }, function(data) {
        if (data != undefined) {
            var notesList = jQuery.parseJSON(data);
            if ((notesList.name !== undefined) && (notesList.name === "Invalid Session ID")) {
                SugarSessionId = ''
                $.mobile.changePage('LoginPage');
            }
            if ((notesList != undefined) && (notesList.entry_list != undefined)) {
                if (notesList.entry_list[0] != undefined) {
                    var note = notesList.entry_list[0];
                    /* Set the Main Header and Paragraph */
                    $('#NoteSubjectH1').html(note.name_value_list.name.value);
                    var callPText =  note.name_value_list.description.value;
                    $('#NoteTextP').text(callPText);
                    /* Record Information */
                    $('#ViewNoteDetailsPageDetailsList').append("<li data-role=\"list-divider\">Other Information</li>");
                    if ((note.name_value_list.date_modified !== undefined) && (note.name_value_list.date_modified.value !== "")) {
                        $('#ViewNoteDetailsPageDetailsList').append("<li><p><br />Date Modified</p><h4>" + note.name_value_list.date_modified.value + "&nbsp;by&nbsp;" + note.name_value_list.modified_by_name.value +"</h4></li>");
                    }
                    if ((note.name_value_list.date_entered !== undefined) && (note.name_value_list.date_entered.value !== "")) {
                        $('#ViewNoteDetailsPageDetailsList').append("<li><p><br />Date Created</p><h4>" + note.name_value_list.date_entered.value + "&nbsp;by&nbsp;" + note.name_value_list.created_by_name.value +"</h4></li>");
                    }

                    $('#ViewNoteDetailsPageDetailsList').listview("refresh");
                }
            }
        }
        $.mobile.pageLoading(true);
    });
}


