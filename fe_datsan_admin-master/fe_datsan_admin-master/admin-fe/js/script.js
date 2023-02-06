window.addEventListener("load", (event) => {
    loadData();
});

/*logout*/
$('#logoutBtn').on("click", function () {
    api.doGet("http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com/api/admin/logout", null,
        function () {
            window.location.href = 'index.html';
        }, function () {
        })
});

/*get system pending data*/
function loadData() {
    var url = "http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com/api/admin/system/pending"
    api.doGet(url, null,
        function (success) {
            const pendings = success.pending;
            $('#content').html(`<table class="table table-striped table-hover table-content">
                                <thead>
                                <tr>
                                    <th class="col">#</th>
                                    <th class="col-3">Hệ thống sân</th>
                                    <th class="col-3">Chủ sân</th>
                                    <th class="col">Ngày đăng</th>
                                    <th class="col"></th>
                                </tr>
                                </thead>
                                <tbody id="system-data">
                                </tbody>
                            </table>`)
            var contentData = '';
            var index = 1
            pendings.forEach(element => {
                contentData += `<tr>
                                <th class="col">` + index + `</th>
                                <td>` + element.name + `</td>
                                <td>` + element.owner.name + `</td>
                                <td>` + element.updatedAt + `</td>
                                <td><a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal" onclick="getSystemDetail(`+ element.id + `)">Chi tiết</a></td>
                            </tr>`
                index++;
            });
            $('#system-data').html(contentData);
        }, function () {
            $('#content').html(`<p class="warning">Hiện không có hệ thống sân nào cần duyệt</p>`)
        })
}

function getSystemDetail(id) {
    var url = "http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com/api/admin/system/pending/" + id
    api.doGet(url, null,
        function (success) {
            var systemId = success.pending.id
            $('#hidden-id').text(systemId);
            $('#system-name').val(success.pending.name);
            $('#owner-name').val(success.pending.owner.name);
            $('#address-detail').val(success.pending.addressDetail);
            var district = success.pending.district;
            var wardDefault = success.pending.ward;
            loadDistrict(district, wardDefault);
        },
        function () {
            $('#modal-body').html("<h4>Có lỗi xảy ra trong quá trình load thông tin chi tiết</h4>")
        },
    )
}

$('#approveBtn').on("click", function () {
    var id = $('#hidden-id').text();
    if ($('#city').val() != '' && $('#district').val() != '' &&
        $('#ward').val() != '' && $('#address-detail').val() != '' &&
        $('#lat').val() != '' && $('#lng').val() != '' && $('#pitch-limit').val() != '') {
        approveSystem(id);
    } else {
        $('#approve-failed').html(`<span class="ms-3 text-danger">Vui lòng điền đầy đủ thông tin</span>`)
    }
})

function approveSystem(id) {
    var url = "http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com/api/admin/system/approve/" + id;
    api.doPut(url, JSON.stringify({
        "city": $('#city option:selected').text(),
        "district": $('#district option:selected').text(),
        "ward": $('#ward option:selected').text(),
        "addressDetail": $('#address-detail').val(),
        "lat": $('#lat').val(),
        "lng": $('#lng').val(),
        "pitchLimit": $('#pitch-limit').val()
    }), function (success) {
        if(success.message == 'success'){
            alert("Duyệt hệ thống sân thành công");
            loadData();
            $("#close-modal").click()
        }
    }, function (error) {
        $('#approve-failed').html("<h5>Có lỗi xảy ra trong quá trình duyệt hệ thống sân</h5>")
    })
}

function loadDistrict(districtDefault, wardDefault = '') {
    var url = 'https://vapi.vnappmob.com/api/province/district/01';
    api.doGet(url, null, function (success) {
        var districts = success.results;
        var html = ''
        districts.forEach(element => {
            if (element.district_name == districtDefault) {
                loadWard(element.district_id, wardDefault)
                html += `<option value="` + element.district_id + `" selected>` + element.district_name + `</option>`
            } else {
                html += `<option value="` + element.district_id + `">` + element.district_name + `</option>`
            }
        })
        $('#district').html(html);
    }, function (error) {
        console.log(error);
    })
}
$("#district").change(function () {
    var districtId = $('#district').val();
    loadWard(districtId);
});

function loadWard(districtId, wardDefault = null) {
    var url = 'https://vapi.vnappmob.com/api/province/ward/' + districtId;
    api.doGet(url, null, function (success) {
        var wards = success.results;
        var html = ''
        wards.forEach(element => {
            if (element.ward_name == wardDefault) {
                html += `<option value="` + element.ward_name + `" selected>` + element.ward_name + `</option>`
            } else {
                html += `<option value="` + element.ward_name + `">` + element.ward_name + `</option>`
            }
        })
        $('#ward').html(html);
    }, function (error) {
        console.log(error);
    })
}