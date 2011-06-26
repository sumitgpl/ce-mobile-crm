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


