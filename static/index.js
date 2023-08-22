function $(id) {
    document.getElement
    return document.getElementById(id);
}

// ajax.js

function sendAjaxRequest(url, data, callback) {
    // Fetch API를 사용하여 AJAX 요청 보내기
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    // .then(function (response) {
    //     if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //     }
    //     return response.json(); // JSON 데이터로 응답 처리
    // })
    .then(function (responseData) {
        callback(null, responseData.text()); // 성공적으로 데이터를 받았을 때 콜백 호출
    })
    .catch(function (error) {
        callback(error, null); // 오류 처리
    });
}

function sendPostRequest(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () { // event handler
        if (xhr.readyState === 4) { // 정상적으로 값을 받으면
            var response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    var json_str = JSON.stringify(data);
    xhr.send(json_str); // 서버로 request를 날림
}

function to_upper(y_value) {
    var item = { // json 객체
        y_value: y_value
    };
    var api_url = "http://127.0.0.1:8000/upper.api"; // end point, route  
    sendPostRequest(api_url, item, function (response) {
        console.log('Response:', response);
        $("y").value += response.result;
    });    
}

function click_function() {
    to_upper($("y").value);
    console.log($("y").value);
    // $("t").innerText = $("y").value;
    $("t").innerHTML = $("y").value + "<u>" + $("y").value + "</u>" + "<i>" + $("y").value + "</i>";
    $("y").style.fontFamily = "Times New Roman";
    $("t").style.fontFamily = "Times New Roman";
}

window.onload = function() { // HTML이 로딩이 완료되면 호출됨
    // alert("window.onload");
    // alert($("y").value);
    // document.getElementById("y").value = "wwwwwwwwww";
    // alert($("s").value);
    // HTML DOM(Document Object Model) 객체를 자바스크립트로 조작하는 것
    $("s").onchange = function() {alert($("s").value);};
    $("s").onmouseenter = function() {console.log("mouseenter")};
    $("s").onmouseout = function() {console.log("mouseout")};
    $("x").onclick = click_function;
    $("y").onchange = function() {
        $("y").value = $("y").value.replace("x", "X");
    }
    $("y").onclick = function() {
        $("y").value = $("y").value.replace("x", "X");
    }    
}