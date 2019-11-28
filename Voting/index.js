// window.addEventListener("load",function() {
//     var request = new XMLHttpRequest();
//     request.open('GET','processing.php',true);
//     request.addEventListener('readystatechange', function() {
//       if ((request.readyState==4) && (request.status==200)) {
//         var welcome = document.getElementById('welcome');
//         welcome.innerHTML = request.responseText;
//       }
//     });
//   request.send();

function firstPageLoad() {
    getStatistics();
}

async function getStatistics() {
    const fetchOptions = {
        headers: {
            method: "get"
        }
    };
    const response = await fetch('/stat', fetchOptions);
    const data = await response.json();
    var statisticsDiv = document.getElementById('statistics');
    statisticsDiv.innerHTML = data;
    console.log("получены данные в формате json", data);
}

// async function sendVote() {
//     const fetchOptions = {
//         headers: {
//             method: "post",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         },
//     };
//     const response = await fetch('/vote', fetchOptions);
//     const data = await response.json();
//     console.log("получены данные в формате json", data);
// }