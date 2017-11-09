var LAMBDA_ADDRESS = "";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		alert("Done");
	}
}

function submitForm(token) {
    console.log(token);
	//xhr.open("POST", LAMBDA_ADDRESS);
	//xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	//xhr.send(genRequest(token));
}

function genRequest(token) {
	var replyObj = {
		replyAddress: "a",
		subject: "b",
		msgBody: "c",
		token: token
	};
	return JSON.stringify(replyObj);
}