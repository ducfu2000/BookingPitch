/*login*/
$('#loginBtn').on("click", function () {
    api.doPost("http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com/api/common/login", JSON.stringify({
        "username": $('#username').val(),
        "password": $('#password').val()
    }), function (success) {
        localStorage.setItem("token", success.token)
        window.location.href = 'homepage.html';
    }, function (error) {
        $('#login-failed').text(error.responseJSON.message);
    })
});