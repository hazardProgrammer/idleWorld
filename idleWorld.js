var canvas;
var usernameInput;
var usernameDiv;
var ctx;
var loginScreen;
var username;
var xp;
var xpCalcLevel;
var level;
var gold;
var inMainScreen;
var charStats;
var dateStart;
var isMonsterDead;

function init() {
	canvas = $("#canvas")[0];
	usernameInput = $("#username-input")[0];
	usernameDiv = $("#username-div")[0];
	ctx = canvas.getContext("2d");
	if (localStorage.getItem("username") === null) {
		loginScreen = true;
	} else {
		username = localStorage.getItem("username");
	};
	
	if (localStorage.getItem("xp") === null) {
		xp = 0;
	} else {
		xp = localStorage.getItem("xp");
	};
	
	if (localStorage.getItem("gold") === null) {
		gold = 0;
	} else {
		gold = localStorage.getItem("gold");
	};
	
	level = 0;
	xpCalcLevel = 0;
	inMainScreen = true;
	charStats = {
		killTime: 10,
	};
	dateStart = Date.now();
	isMonsterDead = false;
	
	run();
}

function renderMain() {
	if (loginScreen) {
		ctx.fillStyle = "#222222";
		ctx.fillRect(0, 0, 800, 600);
		ctx.fillStyle = "#603a0c";
		ctx.fillRect(190, 190, 420, 220);
		ctx.fillStyle = "#906a3c";
		ctx.fillRect(200, 200, 400, 200);
		ctx.fillStyle = "#000000";
		ctx.font = "32px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Enter Username", 400, 250);
		ctx.fillStyle = "#8a1717";
		ctx.fillRect(315, 330, 170, 50);
		ctx.fillStyle = "#a73434";
		ctx.fillRect(320, 335, 160, 40);
		ctx.fillStyle = "#000000";
		ctx.fillText("Join", 400, 355)
	} else {
		ctx.fillStyle = "#4d2001";
		ctx.fillRect(0, 0, 400, 80);
		ctx.fillStyle = "#7d4f20";
		ctx.fillRect(5, 5, 390, 70);
		ctx.font = "16px Arial";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "left";
		ctx.fillText(username, 8, 20);
		ctx.fillText("XP: " + xp, 8, 36);
		ctx.fillText("Gold: " + gold, 8, 52);
		ctx.fillText("Level: " + level, 8, 68);
	};
}

function renderSpecial() { //renders the area-unique things, like the enemy, the trees, etc.
	if (!loginScreen) {
		if (inMainScreen) {
			if (!isMonsterDead) {
				ctx.fillStyle = "#bb2222";
				ctx.fillRect(350, 250, 100, 100);
			};
			ctx.fillStyle = "#413f45";
			ctx.fillRect(200, 400, 400, 60);
			ctx.fillStyle = "#615f65";
			ctx.fillRect(205, 425, 390, 30);
			var timeLeftRatio = (charStats.killTime - ((Date.now() - dateStart)/1000)).toFixed(3) / charStats.killTime;
			if (timeLeftRatio <= 0) {
				isMonsterDead = true;
				setTimeout(function() {
					dateStart = Date.now();
					isMonsterDead = false;
				}, 1000);
			};
			if (!isMonsterDead) {
				ctx.fillStyle = "#2222ca";
				ctx.fillRect(210, 430, 380 * timeLeftRatio, 20);
				ctx.fillStyle = "#ffffff";
				ctx.font = "15px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText((charStats.killTime - ((Date.now() - dateStart)/1000)).toFixed(3) + " S", 400, 440);
			};
		};
	};
}

function hideHTMLElements() {
	if (!loginScreen) {
		usernameDiv.style.display = "none";
	};
}

function calcLevel() {
	if (xpCalcLevel <= xp) {
		level++;
		xpCalcLevel += (level + 2) ** 3;
	};
}

function clickHandler(event) {
    var clickX = event.clientX - canvas.getBoundingClientRect().left;
    var clickY = event.clientY - canvas.getBoundingClientRect().top;
	if (loginScreen) {
		if (clickX >= 320 && clickX <= 480 && clickY >= 335 && clickY <= 375) {
			if (usernameInput.value.length <= 16) {
				username = usernameInput.value;
				localStorage.setItem("username", username);
				console.log("Your username is " + username);
				loginScreen = false;
			} else {
				usernameInput.value = "";
				alert("Sorry, your username is too long. Please make it 16 letters or shorter.")
			};
		};
	} else {
		
	};
}

$("#canvas").click(clickHandler);

function run() {
	var interval = setInterval(function() {
		ctx.clearRect(0, 0, 800, 600);
		ctx.strokeStyle = "#000000"
		ctx.strokeRect(0, 0, 800, 600);
		renderMain();
		renderSpecial();
		hideHTMLElements();
		calcLevel();
	}, 10);
}
