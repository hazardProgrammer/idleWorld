//external script for overriding javascript timer while chrome tab is closed. Thanks, turuslan! (https://github.com/turuslan/HackTimer)
(function(s){var w,f={},o=window,l=console,m=Math,z='postMessage',x='HackTimer.js by turuslan: ',v='Initialisation failed',p=0,r='hasOwnProperty',y=[].slice,b=o.Worker;function d(){do{p=0x7FFFFFFF>p?p+1:0}while(f[r](p));return p}if(!/MSIE 10/i.test(navigator.userAgent)){try{s=o.URL.createObjectURL(new Blob(["var f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){var d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))}catch(e){}}if(typeof(b)!=='undefined'){try{w=new b(s);o.setInterval=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2)};w[z]({n:'a',i:i,t:t});return i};o.clearInterval=function(i){if(f[r](i))delete f[i],w[z]({n:'b',i:i})};o.setTimeout=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2),t:!0};w[z]({n:'c',i:i,t:t});return i};o.clearTimeout=function(i){if(f[r](i))delete f[i],w[z]({n:'d',i:i})};w.onmessage=function(e){var i=e.data,c,n;if(f[r](i)){n=f[i];c=n.c;if(n[r]('t'))delete f[i]}if(typeof(c)=='string')try{c=new Function(c)}catch(k){l.log(x+'Error parsing callback code string: ',k)}if(typeof(c)=='function')c.apply(o,n.p)};w.onerror=function(e){l.log(e)};l.log(x+'Initialisation succeeded')}catch(e){l.log(x+v);l.error(e)}}else l.log(x+v+' - HTML5 Web Worker is not supported')})('HackTimerWorker.min.js');



var canvas;
var usernameInput;
var usernameDiv;
var ctx;
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
var frameChange2;
var frame;//doesn't change
var frameSinceClick;//time since last damage click
var damageFloatXAuto;
var damageFloatXClick;
var monstersKilled;
var monsterNames;
var img;
var overStartBtn;
var upgradesBox;
var upgradeLevels;
var clicked;

function init() {
	canvas = $("#canvas")[0];
	usernameInput = $("#username-input")[0];
	usernameDiv = $("#username-div")[0];
	ctx = canvas.getContext("2d");
	if (localStorage.getItem("username") === null) {
		isMainScreen = false;
	} else {
		username = localStorage.getItem("username");
		inMainScreen = true;
	};
	level = 0;
	xpCalcLevel = 0;
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
	frameChange2 = 0;
	frame = 0;
	frameSinceClick = 0;
	damageFloatXAuto = 0;
	damageFloatXClick = 0;
	monstersKilled = 0;
	monsterNames = ["Stickman", "Stickman Fighter"];
	img = [];
	img[0] = new Image();
	img[0].src = "img/creature_stickman.png";
	img[0].onload = function() {
		ctx.drawImage(img[0], 350, 250);
	}
	img[1] = new Image();
	img[1].src = "img/creature_stickman-fighter.png";
	img[1].onload = function() {
		ctx.drawImage(img[1], 350, 250);
	}
	img[2] = new Image();
	img[2].src = "img/sword.png"
	overStartBtn = false;
	upgradesBox = false;
	upgradeLevels = [1];
	/*
		index 0: Auto Damage
	*/

	getMonsterHealth(monsterStats.level);
	monsterStats.health = monsterStats.maxHealth;
	loadSave();
	run();
}

function loadSave() {
	if (localStorage.getItem("mLevel") !== null) {
		monsterStats.level = parseInt(localStorage.getItem("mLevel"));
	}
	if (localStorage.getItem("upgrades") !== null) {
		upgrades = parseJSON(localStorage.getItem("upgrades"));
	};
	if (localStorage.getItem("xp") !== null) {
		xp = parseInt(localStorage.getItem("xp"), 10);
	};
	if (localStorage.getItem("gold") === null) {
		gold = parseInt(localStorage.getItem("gold"), 10);
	};
}

function renderMain() {
	if (!inMainScreen) {
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
		ctx.textBaseline = "middle";
		ctx.fillText(username, 8, 20);
		ctx.fillText("XP: " + xp, 8, 36);
		ctx.fillText("Gold: " + gold, 8, 52);
		ctx.fillText("Level: " + level, 8, 68);
		ctx.fillStyle = "4d2001";
		ctx.fillRect(405, 0, 80, 80);
		ctx.fillStyle = "#7d4f20";
		ctx.fillRect(410, 5, 70, 70);
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = "16px Arial";
		ctx.fillText("Upgrades", 445, 10);
		if (upgradesBox) {
			ctx.fillStyle = "rgba(10, 10, 10, 0.8)";
			ctx.fillRect(0, 0, 800, 600);
			ctx.fillStyle = "#4d2001";
			ctx.fillRect(100, 80, 600, 440);
			ctx.fillStyle = "#7d4f20";
			ctx.fillRect(105, 85, 590, 430);
			ctx.fillStyle = "#ff6535";
			ctx.fillRect(670, 50, 60, 60);
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = "50px Arial";
			ctx.fillText("X", 700, 80);
			ctx.fillStyle = "#4d2001";
			ctx.fillRect(250, 55, 300, 50);
			ctx.fillStyle = "#7d4f20";
			ctx.fillRect(255, 60, 290, 40);
			ctx.font = "30px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Upgrades", 400, 80);
			ctx.fillStyle = "#5d3011";
			ctx.fillRect(125, 110, 250, 120);//here
			ctx.fillStyle = "#4d2001";
			ctx.fillRect(135, 140, 80, 80);
			ctx.drawImage(img[2], 135, 140);
			ctx.fillStyle = "#ffffff";
			ctx.font = "14px Arial";
			ctx.textAlign = "left";
			ctx.fillText("Auto Damage", 135, 125);
			ctx.fillText("Level " + upgradeLevels[0], 240, 125)
			ctx.fillText("Cost: " + (100 * (upgradeLevels[0] + 2) ** 2) + " gold", 240, 150);
			ctx.fillText("Current: " + Math.round(upgradeLevels[0] ** 1.35) + " dmg", 240, 175);
			ctx.fillText("Next Level: " + Math.round((upgradeLevels[0] + 1) ** 1.35) + " dmg", 240, 200);
		};
	};
}

function killMonsters() {
	if (inMainScreen) {
		monsterStats.xpGain = Math.round((2 * monsterStats.level) ** (1.5 + (1 / 64) * Math.round(monsterStats.level / 25)));
		monsterStats.goldGain = Math.round((monsterStats.level * 2) ** (1.3 + Math.floor(monsterStats.level / 25) * 0.015));
		if (!isMonsterDead) {
			if (monsterStats.level % 2 === 1) {
				ctx.drawImage(img[0], 350, 250);
			} else {
				ctx.drawImage(img[1], 350, 250);
			};
		};
		ctx.fillStyle = "#413f45";
		ctx.fillRect(200, 380, 400, 100);
		ctx.fillStyle = "#ffffff";
		ctx.font = "16px Arial";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText("LV. " + monsterStats.level, 210, 395);
		ctx.textAlign = "right";
		if (typeof monsterNames[monsterStats.level - 1] !== "undefined") {
			ctx.fillText(monsterNames[monsterStats.level - 1], 590, 395);
		} else {
			ctx.fillText(monsterNames[2 - (monsterStats.level % 2) - 1] + " " + Math.ceil(monsterStats.level / 2), 590, 395);
		};
		ctx.fillStyle = "#615f65";
		ctx.fillRect(205, 410, 390, 30);
		ctx.fillRect(205, 445, 390, 30);
		var timeLeftRatio = (monsterStats.killTime - ((Date.now() - dateStart)/1000)).toFixed(2) / monsterStats.killTime;
		if (monsterStats.health <= 0 || timeLeftRatio <= 0) {
			isMonsterDead = true;
			if (timeLeftRatio > 0) {
				monstersKilled++;
				gold += monsterStats.goldGain;
				xp += monsterStats.xpGain;
			}
			setTimeout(function() {
				dateStart = Date.now();
				isMonsterDead = false;
			}, 1000);
		};
		ctx.fillStyle = "#a21ca3";
		ctx.beginPath();
		ctx.moveTo(560, 160);
		ctx.lineTo(560 + 20 * Math.sqrt(3) / 2, 170);
		ctx.lineTo(560, 180);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(240, 160);
		ctx.lineTo(240 - 20 * Math.sqrt(3) / 2, 170);
		ctx.lineTo(240, 180);
		ctx.fill();
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
			if (i === 0 || i <= 30) {
				if (i === 0 && frameChange !== 0) {
					monsterStats.health -= charStats.autoStats.autoDamage;
				} else {
					ctx.font = "32px Arial";
					ctx.fillStyle = "rgba(255, 102, 0, " + (1 - (damageFloatXAuto / 120)) + ")";
					ctx.fillText(charStats.autoStats.autoDamage, 400, 300 - damageFloatXAuto);
					damageFloatXAuto += 3;
				}
			} else {
				damageFloatXAuto = 0;
			};
			frameChange2 = 0;
			if (clicked) {
				if (frameChange2 <= 30) {
					ctx.font = "32px Arial";
					ctx.fillStyle = "rgba(255, 145, 121, " + (1 - (damageFloatXClick / 120)) + ")";
					ctx.fillText(charStats.clickStats.clickDamage, 400, 300 - damageFloatXClick);
					damageFloatXClick += 3;
					frameChange2++;
				} else {
					frameChange2 = 0;
					damageFloatXClick = 0;
					clearInterval(interval)
				}
			} else {
				damageFloatXClick = 0;
				frameChange2 = 0;
			}
		} else {
			monsterStats.health = monsterStats.maxHealth;
			ctx.fillStyle = "#ff5500";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = "48px Arial";
			ctx.fillText("Monster Killed!", 400, 300);
			frameChange = 0;
			frameSinceClick = 0;
		};
	};
}

function clickDamageDisplay() {
	clicked = true;
	setTimeout(function() {clicked = false}, 300)
}

function hideHTMLElements() {
	if (inMainScreen) {
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
	if (!inMainScreen) {
		if (clickX >= 320 && clickX <= 480 && clickY >= 335 && clickY <= 375) {
			if (usernameInput.value.length <= 16) {
				username = usernameInput.value;
				localStorage.setItem("username", username);
				console.log("Your username is " + username);
				inMainScreen = true;
				dateStart = Date.now();
			} else {
				usernameInput.value = "";
				alert("Sorry, your username is too long. Please make it 16 letters or shorter.")
			};
		};
	} else {
		if (clickX >= 560 && clickX <= 560 + 40 * Math.sqrt(3) / 2 && clickY >= 160 && clickY <= 180) {
			monsterStats.level++;
			getMonsterHealth(monsterStats.level);
			monsterStats.health = monsterStats.maxHealth;
		} else if (clickX <= 240 && clickX >= 240 - 40 * Math.sqrt(3) / 2 && clickY >= 160 && clickY <= 180 && monsterStats.level > 1) {
			monsterStats.level--;
			getMonsterHealth(monsterStats.level);
			monsterStats.health = monsterStats.maxHealth;
		};
		if (!upgradesBox) {
			if (clickX >= 405 && clickX <= 485 && clickY >= 0 && clickY <= 80) {
				upgradesBox = true;
			} else if (frameChange !== 0 && frameSinceClick / (charStats.clickStats.attackSpeed * 100) >= 1) {
				frameSinceClick = 0;
				monsterStats.health -= charStats.clickStats.clickDamage;
				clickDamageDisplay();
			};
		} else {
			if (clickX >= 670 && clickX <= 730 && clickY >= 70 && clickY <= 130) {
				upgradesBox = false;
			} else if (clickX >= 125 && clickX <= 365 && clickY >= 110 && clickY <= 230) {
				upgrade("auto", "damage")
			};
		};
	};
}

function upgrade(type, upg) {
	if (type === "auto") {
		if (upg === "damage") {
			if ((100 * (upgradeLevels[0] + 2) ** 2) <= gold) {
				upgradeLevels[0]++;

			}
		}
	}
}

function moveHandler(event) {
	var mX = event.clientX - canvas.getBoundingClientRect().left;
    var mY = event.clientY - canvas.getBoundingClientRect().top;
	if (!inMainScreen) {
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
	levelDamage = Math.round((level * 2 + 2) ** 1.2);
	upgradeDamage = Math.round(upgradeLevels[0] ** 1.35)
	charStats.attackDamage = levelDamage + upgradeDamage;
	charStats.clickDamage = levelDamage;
}

function save() {
	localStorage.setItem("xp", xp);
	localStorage.setItem("gold", gold);
	localStorage.setItem("mLevel", monsterStats.level);
	localStorage.setItem("upgrades", upgradeLevels);
}

function resetGame() {
	//CAUTION: DO NOT RUN WITHOUT PRECAUTION!!!
	localStorage.removeItem("username");
	localStorage.removeItem("xp");
	localStorage.removeItem("gold");
	localStorage.removeItem("mLevel");
	localStorage.removeItem("upgrades");
}

$("#canvas").click(clickHandler);
$("#canvas").mousemove(moveHandler);

function run() {
	var interval = setInterval(function() {
		ctx.clearRect(0, 0, 800, 600);
		ctx.strokeStyle = "#000000"
		ctx.strokeRect(0, 0, 800, 600);
		getMonsterHealth(monsterStats.level);
		killMonsters();
		renderMain();
		hideHTMLElements();
		calcLevel();
		if (frame % 1000 === 0) {//saves every 10 seconds
			save();
		}
		frame++;
		frameChange++;
		frameSinceClick++;
		//I should really put this into a function
	}, 10);
}
