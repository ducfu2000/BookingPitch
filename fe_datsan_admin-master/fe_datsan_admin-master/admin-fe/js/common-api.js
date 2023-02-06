// api extends
var api = {
    doGet : function(requestUrl, requestData, successFuntion, errorFunction) {
        $.ajax({
            url: requestUrl,
            data: requestData,
            method: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            crossDomain:true,
            headers:{  'Access-Control-Allow-Origin':'*'},
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Token " + localStorage.getItem("token"));
                $('#loading').show();
            },
            success: function(data){
                if($.isFunction(successFuntion)) {
                    successFuntion(data);
                }
            },
            error: function (error) {
                if($.isFunction(errorFunction)) {
                    errorFunction(error);
                }
                if(error.status == 403){
                    window.location.href = '403.html';
                }
            },
            complete: function() {
                $('#loading').hide();
            }
        });
    },
    doPost : function(requestUrl, requestData, successFuntion, errorFunction) {
        $.ajax({
            url: requestUrl,
            data: requestData,
            method: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers:{  'Access-Control-Allow-Origin':'*'},
            crossDomain:true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Token " + localStorage.getItem("token"));
                $('#loading').show();
            },
            success: function(data){
                if($.isFunction(successFuntion)) {
                    successFuntion(data);
                }
            },
            error: function (error) {
                if($.isFunction(errorFunction)) {
                    errorFunction(error);
                }
                if(error.status == 403){
                    window.location.href = '403.html';
                }
            },
            complete: function() {
                $('#loading').hide();
            }
        });
    },
    doPut : function(requestUrl, requestData, successFuntion, errorFunction) {
        $.ajax({
            url: requestUrl,
            data: requestData,
            method: "PUT",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers:{  'Access-Control-Allow-Origin':'*'},
            crossDomain:true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Token " + localStorage.getItem("token"));
                $('#loading').show();
            },
            success: function(data){
                if($.isFunction(successFuntion)) {
                    successFuntion(data);
                }
            },
            error: function (error) {
                if($.isFunction(errorFunction)) {
                    errorFunction(error);
                }
                if(error.status == 403){
                    window.location.href = '403.html';
                }
            },
            complete: function() {
                $('#loading').hide();
            }
        });
    },
    doGetByStep : function(requestUrl, requestData, beforeSendFuntion, successFuntion, errorFunction, completeFunction) {
        $.ajax({
            url: requestUrl,
            data: requestData,
            method: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            beforeSend: function(data) {
                if($.isFunction(beforeSendFuntion)) {
                    beforeSendFuntion();
                }
            },
            success: function(data){
                if($.isFunction(successFuntion)) {
                    successFuntion(data);
                }
            },
            error: function (error) {
                if($.isFunction(errorFunction)) {
                    errorFunction(error);
                }
            },
            complete: function() {
                if($.isFunction(completeFunction)) {
                    completeFunction();
                }
            }
        });
    },
    doUpload: function(url, postData, onSuccess, onError) {
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            processData: false,
            contentType: false,
            cache      : false,
            xhr        : function ()
            {
                var jqXHR = null;
                if ( window.ActiveXObject )
                {
                    jqXHR = new window.ActiveXObject( "Microsoft.XMLHTTP" );
                }
                else
                {
                    jqXHR = new window.XMLHttpRequest();
                }
                //Upload progress
                jqXHR.upload.addEventListener( "progress", function ( evt )
                {
                    if (evt.lengthComputable)
                    {
                        var percentComplete = Math.round( (evt.loaded * 100) / evt.total );
                        console.log( 'Uploaded percent', percentComplete );
                        showProgressBar(percentComplete);
                    }
                }, false );
                return jqXHR;
            },
            success : function (data) {
                onSuccess(data);
                hideProgressBar();
            },
            error : function (data, status, jqXHR) {
                hideProgressBar();
                onError(data, status);
            },
            complete: function() {
                hideProgressBar();
            }
        });
    }
};

function isUnSet(val) {
    return val == null || val === undefined || val == "";
}

function hideProgressBar() {
    $("#progress").addClass("hidden");
    $("#progressbar").width(0 + '%');
    $("#percent").html(0 + '%');
}

// Show progress bar
function showProgressBar(percentComplete) {
    $("#progress").removeClass("hidden");

    //init prrgressbar
    $('#progressbar').attr('style' , 'width :' + 0 + '%');
    $("#percent").html(0 + '%');

    //upload progressbar
    $('#progressbar').attr('style' , 'width :' + percentComplete + '%');
    if(percentComplete < 100) {
        $('#percent').html(percentComplete + '%');
    }

    if(percentComplete === 100) {
        $('#percent').html("Done");
    }
}

// reload select list
function reloadSeletcList(id, data, hasEmpty, dispValue) {
    $(id).empty();

    // if append empty
    if (hasEmpty) {
        $(id).append('<option value=""></option>');
    }

    // reload data
    $.each(data, function( index, select ) {
        var value = (select.value) ? select.value : '';
        var newline = String.fromCharCode(13, 10);
        value =  value.replaceAll('\\n', newline);

        var content = (select.content) ? select.content : '';
        if (dispValue) {
            $(id).append('<option value="' + select.key +  '" keyVal="' + value + '" keyContent="' + content  + '">' + select.value + '</option>');
        } else {
            $(id).append('<option value="' + select.id +  '" keyVal="' + value + '" keyContent="' + content  + '">' + select.key + '</option>');
        }
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var gitName = 'git-token';
var redmineName = 'redmine-token';
var yourServiceName = 'service-token';
var screenConfigName = 'screenConfig-token';



$(function() {
    // config
    $("#config").on('shown.bs.modal', onShowConfig);
    $("#config").on('hidden.bs.modal', onHideConfig);

    function onShowConfig() {
        $("#config #git-token").val(getCookie(gitName));
        $("#config #redmine-token").val(getCookie(redmineName));
        $("#config #your-service").val(getCookie(yourServiceName));
        var screenConfig = JSON.parse(getCookie(screenConfigName));
        if (screenConfig) {
            $("#config #screenConfig").val(screenConfig.join('\n'));
        }

        $('#config #btn-save-config').on('click', function() {
            var redmineToken = $("#config #redmine-token").val();
            eraseCookie(redmineName);
            setCookie(redmineName, redmineToken, 365);

            var gitToken = $("#config #git-token").val();
            eraseCookie(gitName);
            setCookie(gitName, gitToken, 365);

            var yourService = $("#config #your-service").val();
            eraseCookie(yourServiceName);
            setCookie(yourServiceName, yourService, 365);

            var screenConfig = $("#config #screenConfig").val();
            eraseCookie(screenConfigName);
            var screenConfigs = screenConfig.replaceAll('"','#').split('\n');
            setCookie(screenConfigName, JSON.stringify(screenConfigs), 365);

            alert('Success saved!');
            $('#config').modal('hide');
        });
    }

    function onHideConfig() {
        $("#config #git-token").val('');
        $("#config #redmine-token").val('');
        $("#config #your-service").val('');
        $("#config #screenConfig").val('');
        $('#config #btn-save-config').unbind('click');
    }
});