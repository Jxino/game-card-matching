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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0부터 i 사이의 난수
        [array[i], array[j]] = [array[j], array[i]]; // 요소 교환
    }
}
// 신경쇠약 게임 로직
// state = hide: 0, show: 1, done: 2

const HIDE = 0;
const SHOW = 1;
const DONE = 2;
const USER = 0;
const MACHINE = 1;
var states = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var cards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
var scores = [0, 0];
var player = USER;

function initialize() {
    states = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    shuffleArray(cards);
        // player = 사용자: 0, 기계: 1
    scores = [0, 0];
    player = USER;
}

function play() {
    if (player == MACHINE) {
        var x = Math.floor(Math.random() * (cards.length)); // 0부터 15 사이의 난수
        while (states[x] == DONE) {
            x = (x + 1) % cards.length;
        }
        states[x] = SHOW;
        var y = Math.floor(Math.random() * (cards.length)); // 0부터 15 사이의 난수
        while (states[y] == DONE) {
            y = (y + 1) % cards.length;
        }
        states[y] = SHOW;
    } else {
        // x, y = 사용자로부터 두 개를 입력받고;
        states[x] = SHOW;
        states[y] = SHOW;
    }
    if (cards[x] == cards[y]) {
        scores[player] += 1;
        states[x] = DONE;
        states[y] = DONE;
    } else {
        states[x] = HIDE;
        states[y] = HIDE;
        player = (player + 1) % 2; // 토글
    }
    
    var none_done_found = false; 
    for (var i = 0; i < cards.length; i++) {
        if (states[i] != DONE) {
            none_done_found = true;
            break;
        }
    }
    if (! none_done_found) {
        console.log(player + " is winner!");
        initialize();
    }
}

function card_clicked(card_id) {
    console.log(card_id);
    if (player == MACHINE) {
        console.log("cur_user is machine");
        return;
    }
    if (states[parseInt(card_id)] == DONE) {
        console.log("This card is done");
        return;
    }
    if (states[parseInt(card_id)] == SHOW) {
        console.log("This card is show");
        return;
    }
    var show_cnt = 0;
    for (var i = 0; i < 16; i++) {
        if (states[i] == SHOW) {
            show_cnt += 1;
        }
    }
    if (show_cnt > 1) {
        console.log("Show count exceeded");
        return;
    }
    states[parseInt(card_id)] = SHOW;
    $(card_id).value = cards[parseInt(card_id)]; // show card
    var open_cards = [];
    for (var i = 0; i < 16; i++) {
        if (states[i] == SHOW) {
            open_cards.push(i);
        }
    }
    if (open_cards.length == 1) {
        console.log("Open card is 1");
        return;
    }
    console.log(open_cards);
    console.log(states);
    console.log(cards);
    if (cards[open_cards[0]] == cards[open_cards[1]]) {
        setTimeout(function() {
            states[open_cards[0]] = DONE;
            states[open_cards[1]] = DONE;
            $(open_cards[0] + "").value = ""; // hide card
            $(open_cards[1] + "").value = ""; // hide card
            $(open_cards[0] + "").style.backgroundColor = "gray";
            $(open_cards[1] + "").style.backgroundColor = "gray";
            console.log("same");
        }, 1000);
    } else {
        setTimeout(function() {
            states[open_cards[0]] = HIDE;
            states[open_cards[1]] = HIDE;
            $(open_cards[0] + "").value = ""; // hide card
            $(open_cards[1] + "").value = ""; // hide card
            console.log("different");
        }, 1000);
    }
}

window.onload = function() { // HTML이 로딩이 완료되면 호출됨
    initialize();
    $("cur_player").innerText = "사용자";
    $("user_score").innerText = scores[0];
    $("machine_score").innerText = scores[1];
    for (var i = 0; i < 16; i++) {
        $(i + "").onclick = function(e) {card_clicked(e.target.id)};
    }
}