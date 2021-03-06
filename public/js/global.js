// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Login button
    $('#btnLogin').on('click', doLogin);
    $('#btnLogout').on('click', doLogout);
    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Populate the user table on initial page load
    //populateTable();
    if ($("#canvas")) {
        var canvas = document.getElementById('canvas');
        var canvasW = 640;
        var canvasH = 480;
        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');
            canvas.width = document.body.clientWidth; //document.width is obsolete
            canvas.height = document.body.clientHeight; //document.height is obsolete
            canvasW = canvas.width;
            canvasH = canvas.height;
            // drawing code here
            $.getScript("js/draw.js", function (data, textStatus, jqxhr) {
                console.log("Load was performed.");
            });
        } else {
            // canvas-unsupported code here
        }
    }
});

// Functions =============================================================
// Login functionality
function doLogin(event) {
    console.log("doLogin() start");
    event.preventDefault();
    var errorCount = 0;
    $('#loginForm input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {
        // If it is, compile all user info into one object
        var loginUser = {
            'username': $('#loginForm input#inputUserName').val(),
            'password': $('#loginForm input#inputUserPassword').val()
        }
        console.log(loginUser);
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: loginUser,
            //dataType: 'JSON',
            url: '/admin/login'
        }).done(function (response) {
            console.log(response);
            console.log("DONE WITH AJAX LOGIN..");
            // Check for successful (blank) response
            if (response.msg === '') {
                console.log("..success!");
                response.render('panel', {
                    title: 'Admin Panel'
                });
            } else {
                console.log("..failed :(");
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        }).fail(function (response) {
            $("#loginForm").append("<p>WTF it didn't work.</p>");
            console.log("WTF it didn't work again.");
            console.log(response);
        });
        console.log("doLogin() end");
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function doLogout(event) {
    console.log("LOGGING OUT!");
    $.ajax({
        type: 'POST',
        data: {},
        //dataType: 'JSON',
        url: '/admin/logout'
    }).done(function (response) {
        console.log("DONE WITH AJAX LOGOUT..");
        // Check for successful (blank) response
        if (response.msg === '') {
            console.log("..success!");
            response.render('/', {
                title: 'Home!'
            });
        }
    }).fail(function (response) {
        $("#loginForm").append("<p>WTF it didn't work.</p>");
        console.log("WTF it didn't work again.");
        console.log(response);
    });
};
// Fill table with data
function populateTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/admin/userlist', function (data) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.password + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};
// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};
// Add User
function addUser(event) {
    event.preventDefault();
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {
        // If it is, compile all user info into one object
        var newUser = {
                'username': $('#addUser fieldset input#inputUserName').val(),
                'email': $('#addUser fieldset input#inputUserEmail').val(),
                'password': $('#addUser fieldset input#inputUserPassword').val()
            }
            // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: newUser,
            url: '/admin/adduser',
            dataType: 'JSON'
        }).done(function (response) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                // Update the table
                populateTable();
            } else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    } else {
        // If errorCount is more than 0, error out
        console.log('Please fill in all fields');
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/admin/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {} else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;

    }

};