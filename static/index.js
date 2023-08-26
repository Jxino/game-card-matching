function $(id) { // id를 이용해서 DOM 객체를 return
    document.getElement
    return document.getElementById(id);
}

// 서버로 ajax request를 보내서 응답을 받아오는 함수
function sendPostRequest(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () { // event handler
        if (xhr.readyState === 4) { // 정상적으로 값을 받으면
            var response = JSON.parse(xhr.responseText);
            callback(response); // 성공했을 때만 callback 함수를 호출
        } else {
            console.log("sendPostRequest fail.");
        }
    };

    var json_str = JSON.stringify(data); // 객체를 json string으로 변환
    xhr.send(json_str); // 서버로 request를 날림
}

// array를 shuffle함
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0부터 i 사이의 난수
        [array[i], array[j]] = [array[j], array[i]]; // 요소 교환
    }
}

// 게임 상태 관리를 위한 변수 선언
const HIDE = 0;
const SHOW = 1;
const DONE = 2;
const USER = 0;
const MACHINE = 1;
var states = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var cards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
var scores = [0, 0];
var player = USER;

function initialize() { // 게임 상태 초기화
    states = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    shuffleArray(cards);
    scores = [0, 0];
    player = USER;
    for (var i = 0; i < cards.length; i++) {
        $(i + "").src = "X.png"; // 닫힌 카드
    }
    $("user_score").innerText = "0";
    $("machine_score").innerText = "0";
}

function check_finished() { // 게임 종료 조건 체크
    console.log("Check finished");
    var DONE_count = 0;
    for (var i = 0; i < states.length; i++) {
        if (states[i] == DONE) DONE_count += 1;
    }
    if (DONE_count == states.length) {
        alert("Game Over!");
        initialize();
        return true;
    }
    return false;
}

function machine_second_card() { // 기계가 두 번째 카드 열기
    console.log("Machine second card");
    // DONE이 아닌 card를 임의로 한 장 열고
    var x = Math.floor(Math.random() * (cards.length)); // 0부터 15 사이의 난수
    while (states[x] == DONE || states[x] == SHOW) {
        x = (x + 1) % cards.length;
    }
    states[x] = SHOW;
    $(x + "").src = cards[x] + ".png"; // show card    
    // 1초 후에 만약에 매칭하면 DONE으로 마크하면서 뒤집고
    // 그렇지 않으면 1초 후에 그냥 뒤집는다.
    // 다음 플레이어를 USER으로 바꿔준다.
    check_match();
}

function call_machine() { // 기계가 첫 번째 카드 열기
    console.log("Call Machine");
    // DONE이 아닌 card를 임의로 하나 열고
    var x = Math.floor(Math.random() * (cards.length)); // 0부터 15 사이의 난수
    while (states[x] == DONE || states[x] == SHOW) {
        x = (x + 1) % cards.length;
    }
    states[x] = SHOW;
    $(x + "").src = cards[x] + ".png"; // show card 
    // 1초 후에 또 한 장을 더 연다.
    setTimeout(machine_second_card, 1000);
}

function check_match() { // 열린 두 장의 카드가 매치하는지 확인
    console.log("Check match");
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
            // $(open_cards[0] + "").value = ""; // hide card
            // $(open_cards[1] + "").value = ""; // hide card
            $(open_cards[0] + "").src = "Y.png";
            $(open_cards[1] + "").src = "Y.png";
            console.log("same");
            if (player == MACHINE) {
                // 기계의 점수를 올려 준다.
                scores[MACHINE] += 1;
                $("machine_score").innerText = scores[MACHINE] + "";
                player = USER;
                $("cur_player").innerText = "사용자";
            } else { // 사용자의 점수를 올려 준다.
                scores[USER] += 1;
                $("user_score").innerText = scores[USER] + "";
                player = MACHINE;
                $("cur_player").innerText = "기계";
            }           
            console.log("player: " + player);
            if (! check_finished()) {
                if (player == MACHINE) {
                    setTimeout(call_machine, 1000);
                }        
            }            
        }, 1000);
    } else {
        setTimeout(function() {
            states[open_cards[0]] = HIDE;
            states[open_cards[1]] = HIDE;
            $(open_cards[0] + "").src = "X.png"; // hide card
            $(open_cards[1] + "").src = "X.png"; // hide card
            console.log("different");
            // player = (player == MACHINE) ? USER : MACHINE;
            if (player == MACHINE) {
                player = USER;
                $("cur_player").innerText = "사용자";
            } else {
                player = MACHINE;
                $("cur_player").innerText = "기계";
            }
            console.log("player: " + player);
            if (! check_finished()) {
                if (player == MACHINE) {
                    setTimeout(call_machine, 1000);
                }        
            }
        }, 1000);
    }
}

function card_clicked(card_id) { // 사용자가 카드를 클릭했음
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
    $(card_id).src = cards[parseInt(card_id)] + ".png"; // show card
    check_match();
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