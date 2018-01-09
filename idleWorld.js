//external script for overriding javascript timer while chrome tab is closed. Thanks, turuslan!
(function(s){var w,f={},o=window,l=console,m=Math,z='postMessage',x='HackTimer.js by turuslan: ',v='Initialisation failed',p=0,r='hasOwnProperty',y=[].slice,b=o.Worker;function d(){do{p=0x7FFFFFFF>p?p+1:0}while(f[r](p));return p}if(!/MSIE 10/i.test(navigator.userAgent)){try{s=o.URL.createObjectURL(new Blob(["var f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){var d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))}catch(e){}}if(typeof(b)!=='undefined'){try{w=new b(s);o.setInterval=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2)};w[z]({n:'a',i:i,t:t});return i};o.clearInterval=function(i){if(f[r](i))delete f[i],w[z]({n:'b',i:i})};o.setTimeout=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2),t:!0};w[z]({n:'c',i:i,t:t});return i};o.clearTimeout=function(i){if(f[r](i))delete f[i],w[z]({n:'d',i:i})};w.onmessage=function(e){var i=e.data,c,n;if(f[r](i)){n=f[i];c=n.c;if(n[r]('t'))delete f[i]}if(typeof(c)=='string')try{c=new Function(c)}catch(k){l.log(x+'Error parsing callback code string: ',k)}if(typeof(c)=='function')c.apply(o,n.p)};w.onerror=function(e){l.log(e)};l.log(x+'Initialisation succeeded')}catch(e){l.log(x+v);l.error(e)}}else l.log(x+v+' - HTML5 Web Worker is not supported')})('HackTimerWorker.min.js');



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
var monsterStats;
var charStats;
var dateStart;
var isMonsterDead;
var frameChange;//changes
var frame;//doesn't change
var frameSinceClick;//time since last damage click
var damageFloatX;
var monstersKilled;
var monsterNames;
var img;
var overStartBtn;

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
		xp = parseInt(localStorage.getItem("xp"), 10);
	};

	if (localStorage.getItem("gold") === null) {
		gold = 0;
	} else {
		gold = parseInt(localStorage.getItem("gold"), 10);
	};

	level = 0;
	xpCalcLevel = 0;
	inMainScreen = true;
	monsterStats = {
		killTime: 10,
		level: 1,
	};
	charStats = {
		attackDamage: 5,
		autoStats: {
			autoDamage: 0,
			attackSpeed: 2,
		},
		clickStats : {
			clickDamage: 0,
			attackSpeed: 2,
		},
	};
	monsterStats.xpGain = Math.round((2 * monsterStats.level) ** (1.5 + (1 / 64) * Math.round(monsterStats.level / 25)));
	monsterStats.goldGain = Math.round((monsterStats.level * 2) ** (1.3 + Math.floor(monsterStats.level / 25) * 0.015));
	charStats.autoStats.autoDamage = charStats.attackDamage;
	charStats.clickStats.clickDamage = charStats.attackDamage;
	dateStart = Date.now();
	isMonsterDead = false;
	frameChange = 0;
	frame = 0;
	frameSinceClick = 0;
	damageFloatX = 0;
	monstersKilled = 0;
	monsterNames = ["Stickman"];
	img = new Image();
	img.src = "img/creature_stickman.png";
	img.onload = function() {
		ctx.drawImage(img, 350, 250);
	}
	overStartBtn = false;

	getMonsterHealth(monsterStats.level);
	monsterStats.health = monsterStats.maxHealth;

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
		if (overStartBtn) {
			ctx.fillStyle = "#942121";
		};
		ctx.fillRect(315, 330, 170, 50);
		ctx.fillStyle = "#a73434";
		if (overStartBtn) {
			ctx.fillStyle = "#b73434";
		};
		ctx.fillRect(320, 335, 160, 40);
		ctx.fillStyle = "#000000";
		ctx.fillText("Start", 400, 355)
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

function killMonsters() {
	if (!loginScreen) {
		if (inMainScreen) {
			if (!isMonsterDead) {
				ctx.drawImage(img, 350, 250);
			};
			ctx.fillStyle = "#413f45";
			ctx.fillRect(200, 380, 400, 100);
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			ctx.fillText("LV. " + monsterStats.level, 210, 395);
			ctx.textAlign = "right";
			ctx.fillText(monsterNames[monsterStats.level - 1], 590, 395)
			ctx.fillStyle = "#615f65";
			ctx.fillRect(205, 410, 390, 30);
			ctx.fillRect(205, 445, 390, 30);
			var timeLeftRatio = (monsterStats.killTime - ((Date.now() - dateStart)/1000)).toFixed(2) / monsterStats.killTime;
			if (timeLeftRatio <= 0 || monsterStats.health <= 0) {
				isMonsterDead = true;
				gold += monsterStats.goldGain;
				xp += monsterStats.xpGain;
				monstersKilled++;
				setTimeout(function() {
					dateStart = Date.now();
					isMonsterDead = false;
				}, 1000);
			};
			if (!isMonsterDead) {
				var healthLeftRatio = monsterStats.health / monsterStats.maxHealth;
				ctx.fillStyle = "#d62124";
				ctx.fillRect(210, 415, 380 * healthLeftRatio, 20);
				ctx.fillStyle = "#2222ca";
				ctx.fillRect(210, 450, 380 * timeLeftRatio, 20);
				ctx.fillStyle = "#ffffff";
				ctx.font = "15px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText((monsterStats.killTime - ((Date.now() - dateStart)/1000)).toFixed(2) + " S", 400, 460);
				ctx.fillText(monsterStats.health +  " / " + monsterStats.maxHealth, 400, 425);
				i = frameChange % (charStats.autoStats.attackSpeed * 100);
				if (i === 0 || i < 30) {
					if (i === 0 && frameChange !== 0) {
						monsterStats.health -= charStats.autoStats.autoDamage;
					} else {
						ctx.font = "32px Arial";
						ctx.fillStyle = "rgba(255, 102, 0, " + (1 - (damageFloatX / 120));
						ctx.fillText(charStats.autoStats.autoDamage, 400, 300 - damageFloatX);
						damageFloatX += 3;
					}
				} else {
					damageFloatX = 0;
				};
			} else {
				monsterStats.health = monsterStats.maxHealth;
				ctx.fillStyle = "#ff5500";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = "48px Arial";
				ctx.fillText("Monster Killed!", 400, 300);
				frameChange = 0;
				frameSinceClick = 0;
				monsterStats.xpGain = Math.round((2 * monsterStats.level) ** (1.5 + (1 / 64) * Math.round(monsterStats.level / 25)));
				monsterStats.goldGain = Math.round((monsterStats.level * 2) ** (1.3 + Math.floor(monsterStats.level / 25) * 0.015));
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
		updateDPS();
		charStats.autoStats.autoDamage = charStats.attackDamage;
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
				dateStart = Date.now();
			} else {
				usernameInput.value = "";
				alert("Sorry, your username is too long. Please make it 16 letters or shorter.")
			};
		};
	} else if (inMainScreen) {
		if (frameChange !== 0 && frameSinceClick / (charStats.clickStats.attackSpeed * 100) >= 1) {
			frameSinceClick = 0;
			monsterStats.health -= charStats.clickStats.clickDamage;
		};
	};
}

function moveHandler(event) {
	var mX = event.clientX - canvas.getBoundingClientRect().left;
    var mY = event.clientY - canvas.getBoundingClientRect().top;
	if (loginScreen) {
		if (mX >= 320 && mX <= 480 && mY >= 335 && mY <= 375) {
			overStartBtn = true;
		} else {
			overStartBtn = false;
		};
	};
}

function resetUsername() {
	localStorage.removeItem("username");
}

function getMonsterHealth(level) {
	if (level % 5 === 0) {
		monsterStats.maxHealth = (level ** 2 + 5) * 4;
	} else {
		monsterStats.maxHealth = level ** 2 + 5;
	};
}

function updateDPS() {
	charStats.attackDamage = Math.round((level * 2 + 2) ** 1.2);
}

function save() {
	localStorage.setItem("xp", xp);
	localStorage.setItem("gold", gold);
}

function resetGame() {
	//CAUTION: DO NOT RUN WITHOUT PRECAUTION!!!
	localStorage.removeItem("username");
	localStorage.removeItem("xp");
	localStorage.removeItem("gold");
}

$("#canvas").click(clickHandler);
$("#canvas").mousemove(moveHandler);

function run() {
	var interval = setInterval(function() {
		ctx.clearRect(0, 0, 800, 600);
		ctx.strokeStyle = "#000000"
		ctx.strokeRect(0, 0, 800, 600);
		getMonsterHealth(monsterStats.level);
		renderMain();
		killMonsters();
		hideHTMLElements();
		calcLevel();
		if (frame % 1000 === 0) {//saves every 10 seconds
			save();
		}
		frame++;
		frameChange++;
		frameSinceClick++;
	}, 10);
}
