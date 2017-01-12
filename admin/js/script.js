/*global $*/

// READ records on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords() {
    $.get("/authors/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id_author +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#authors').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id_author+'</td>'
            + '<td class="name_author">'+value.name_author+'</a></td>'
			+ '<td class="about">'+ value.about+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id_author +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id_author +')" class="btn btn-danger">Remove</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#name_author').val('');
    $('#about').val('');
  
    $('#myModalLabel').html('Add New Author');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/authors/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#name_author').val(data.name_author);
        $('#about').val(data.about);
       
        $('#id').val(id);
        $('#myModalLabel').html('Edit AUTHOR');
        
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
        url: '/authors/',
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
            $('#authors').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/authors/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name_author').html(formData.name_author);
            $('#row_id_'+formData.id+'>td.about').html(formData.about);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

function deleteRecord(id) {
    $.ajax({
        url: '/authors/'+id,
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