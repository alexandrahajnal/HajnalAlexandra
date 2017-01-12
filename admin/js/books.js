/*global $*/

// READ records on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords() {
    $.get("/books/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.book_id +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#books').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.book_id+'</td>'
            + '<td class="book_name">'+value.book_name+'</a></td>'
			+ '<td class="description">'+ value.description+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.book_id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.book_id +')" class="btn btn-danger">Remove</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#book_name').val('');
    $('#description').val('');
  
    $('#myModalLabel').html('Add New Book');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/books/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#book_name').val(data.book_name);
        $('#description').val(data.description);
        $('#id').val(id);
        $('#myModalLabel').html('Edit BOOK');
        $('#add_new_record_modal').modal('show');
    });
}

function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/books/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#books').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/books/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.book_name').html(formData.book_name);
            $('#row_id_'+formData.id+'>td.description').html(formData.description);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

function deleteRecord(id) {
    $.ajax({
        url: '/books/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}


//extending jQuery with a serializeObject method so that form values can be retrieved as JSON objects
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};