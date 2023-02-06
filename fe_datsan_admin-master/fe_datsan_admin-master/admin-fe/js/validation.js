$().ready(function () {
    /*validate form login*/
    $("#loginForm").validate({
        onfocusout: function (element) { $(element).valid(); },
        onkeyup: true,
        onclick: false,
        rules: {
            "username": {
                required: true,
                validatePhone: true
            },
            "password": {
                required: true,
                validatePassword: true
            }
        },
        messages: {
            "username": {
                required: "Vui lòng nhập số điện thoại"
            },
            "password": {
                required: "Vui lòng nhập mật khẩu"
            }
        }
    });

    /*validate form approve*/
    $('#approveForm').validate({
        onfocusout: function (element) { $(element).valid(); },
        onkeyup: true,
        onclick: false,
        rules: {
            "pitch-limit": {
                required: true,
                number: true,
                minValue: 1,
            },
            "address-detail":{
                required: true
            },
            "lat": {
                required: true
            },
            "lng": {
                required: true
            }
        },
        messages: {
            "pitch-limit": {
                required: "Điền giới hạn sân con",
                number: "Vui lòng điền số nguyên",
                minValue: "Giới hạn sân con phải lớn hơn 0",
            },
            "address-detail":{
                required: "Vui lòng điền địa chỉ chi tiết"
            },
            "lat": {
                required: "Bắt buộc nhập lat"
            },
            "lng": {
                required: "Bắt buộc nhập lng"
            }
        }
    })
});

$.validator.addMethod("validatePassword", function (value, element) {
    return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/i.test(value);
}, "Hãy nhập mật khẩu ít nhất có 8 ký tự bao gồm chữ hoa, chữ thường và ít nhất một chữ số");

$.validator.addMethod("validatePhone", function (value, element) {
    return this.optional(element) || /(84|0[3|5|7|8|9])+([0-9]{8})\b/i.test(value);
}, "Số điện thoại không hợp lệ");

$.validator.addMethod('minValue', function (value, el, param) {
    return value >= param;
});