var DICE_SIZE = 25;
var OFFSET = 2;

var SUCCESS = 0;
var ADVANTAGE = 1;
var TRIUMPH = 2;
var FAILURE = 0;
var THREAT = 1;
var DESPAIR = 2;

var successImg = new Image();
successImg.src = "img/success.png";
var advantageImg = new Image();
advantageImg.src = "img/advantage.png";
var triumphImg = new Image();
triumphImg.src = "img/triumph.png";
var failureImg = new Image();
failureImg.src = "img/failure.png";
var threatImg = new Image();
threatImg.src = "img/threat.png";
var despairImg = new Image();
despairImg.src = "img/despair.png";

var posImages = [successImg, advantageImg, triumphImg];
var negImages = [failureImg, threatImg, despairImg];

var posDicePool = {'green': 0, 'yellow': 0, 'boost': 0};
var negDicePool = {'purple': 0, 'red': 0, 'setback': 0};

var posResults = [0, 0, 0];
var negResults = [0, 0, 0];

var greenDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE]];
var yellowDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [TRIUMPH]];
var boostDie = [ [], [], [SUCCESS], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE]];

var purpleDie =  [ [], [FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [THREAT], [FAILURE, THREAT]];
var redDie = [ [], [FAILURE], [FAILURE], [FAILURE, FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [FAILURE, THREAT], [FAILURE, THREAT], [THREAT, THREAT], [THREAT, THREAT], [DESPAIR]];
var setbackDie = [ [], [], [FAILURE], [FAILURE], [THREAT], [THREAT]];

var charateristics = ['brawn', 'agility', 'intellect', 'cunning', 'willpower', 'pressence'];

var check_table = {
  'brawl' : 'brawn',
  'melee' : 'brawn',
  'ranged-light' : 'agility',
  'ranged-heavy' : 'agility',
  'gunnery' : 'agility',
  'astrogation' : 'intellect',
  'athletics' : 'brawn',
  'charm' : 'pressence',
  'coercion' : 'willpower',
  'computers' : 'intellect',
  'cool' : 'pressence',
  'coordination' : 'agility',
  'deception' : 'cunning',
  'discipline' : 'willpower',
  'leadership' : 'pressence',
  'mechanics' : 'intellect',
  'medicine' : 'intellect',
  'negotiation' : 'pressence',
  'perception' : 'cunning',
  'pilot-planet' : 'agility',
  'pilot-space' : 'agility',
  'resilience' : 'brawn',
  'skullduggery' : 'cunning',
  'stealth' : 'agility',
  'streetwise' : 'cunning',
  'survival' : 'cunning',
  'vigilance' : 'willpower'
};

var deegray_stats = {
  'brawn' : 5,
  'agility' : 3,
  'intellect' : 2,
  'cunning' : 2,
  'willpower' : 3,
  'pressence' : 1,
  'astrogation' : 0,
  'athletics' : 0,
  'charm' : 0,
  'coercion' : 1,
  'computers' : 0,
  'cool' : 0,
  'coordination' : 1,
  'deception' : 0,
  'discipline' :1,
  'leadership' : 0,
  'mechanics' : 0,
  'medicine' : 0,
  'negotiation' : 0,
  'perception' : 0,
  'pilot-planet' : 2,
  'pilot-space' : 0,
  'resilience' : 1,
  'skullduggery' : 0,
  'stealth' : 0,
  'streetwise' : 0,
  'survival' : 0,
  'vigilance' : 1,
  'brawl' : 1,
  'melee' : 3,
  'ranged-light' : 0,
  'ranged-heavy' : 1,
  'gunnery' : 0
};

var load_deegray = function() {
  var stat_keys = Object.keys(deegray_stats);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    console.log(stat_keys[i]);
    e.value = deegray_stats[ stat_keys[i] ];
  }
};

var setup_skills = function() {
  var table = document.createElement("table");

  var skills = Object.keys(check_table);
  for (i=0; i<skills.length; i++) {
    //console.log(skills[i]);
    var row = document.createElement('tr');
    var tdr = document.createElement('td');
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name="check_type";
    radio.id = skills[i] + "_check";
    tdr.appendChild(radio);
    tdr.innerHTML+= skills[i];
    var tdi = document.createElement('td');
    var input = document.createElement('input');
    input.type = "number";
    input.id = skills[i];
    input.min = "0";
    input.style.width = "50px";
    tdi.appendChild(input);
    row.appendChild(tdr);
    row.appendChild(tdi);
    table.appendChild(row);
  }
  document.getElementById("skills").appendChild( table );
};

var get_check = function( e ) {
  var skill = e.target.id.split('_')[0];
  set_dice(skill);
};

var set_dice = function( skill ) {
  var chara = check_table[skill];
  var num_skill = document.getElementById(skill).value;
  var num_char = document.getElementById(chara).value;
  var num_dice = Math.max(num_skill, num_char);
  var num_yellow = Math.min(num_skill, num_char);
  document.getElementById('numgreen').value = (num_dice - num_yellow);
  document.getElementById('numyellow').value = num_yellow;

  updatePool();
};

var rollDice = function() {
  updatePool();
  posResults = [0,0, 0];
  negResults = [0, 0, 0];

  var posDiceTypes = {'green': [greenDie, "#00FF00"], 'yellow' : [yellowDie, '#FFFF00'], 'boost': [boostDie, '#80dfff']};
  //var posResultDisplay = document.getElementById('posresultc');
  var posResultDisplay = document.getElementById('pospool');
  var ctx = posResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  var startx = 0;
  var keys = Object.keys(posDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = posDiceTypes[dtype][0];
    for (var j=0; j<posDicePool[dtype]; j++) {
      var result = die[Math.floor(Math.random() * die.length)];

      ctx.fillStyle = posDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
      if (result.length == 1) {
        posResults[result]+= 1;
        ctx.drawImage(posImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {

        posResults[result[0]]+= 1;
        posResults[result[1]]+= 1;

        ctx.drawImage(posImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
        ctx.drawImage(posImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
      }
      startx+= DICE_SIZE + OFFSET;
    }
  }

  var negDiceTypes = {'purple': [purpleDie, "#5c00e6"], 'red' : [redDie, '#FF0000'], 'setback': [setbackDie, '#000000']};
  //var negResultDisplay = document.getElementById('negresultc');
  var negResultDisplay = document.getElementById('negpool');
  ctx = negResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  startx = 0;
  keys = Object.keys(negDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = negDiceTypes[dtype][0];

    for (var j=0; j<negDicePool[dtype]; j++) {
      result = die[Math.floor(Math.random() * die.length)];
      ctx.fillStyle = negDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);

      if (result.length == 1) {
        negResults[result]+= 1;
        ctx.drawImage(negImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {
        negResults[result[0]]+= 1;
        negResults[result[1]]+= 1;
        ctx.drawImage(negImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
        ctx.drawImage(negImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
      }
      if (dtype == 'setback' || dtype == "purple")
        ctx.fillStyle = "#FFFFFF";

      startx+= DICE_SIZE + OFFSET;
    }
  }
  updateResultTotals();
};

var updateResultTotals = function() {
  var u = posResults[TRIUMPH];
  var s = posResults[SUCCESS] + u;
  var a = posResults[ADVANTAGE];
  var d = negResults[DESPAIR];
  var f = negResults[FAILURE] + d;
  var t = negResults[THREAT];

  document.getElementById("scount").innerText = s;
  document.getElementById("acount").innerText = a;
  document.getElementById("fcount").innerText = f;
  document.getElementById("tcount").innerText = t;

  document.getElementById("ucount").innerText = u;
  document.getElementById("dcount").innerText = d;

  document.getElementById("snet").innerText = (s - f);
  document.getElementById("anet").innerText = (a - t);
};


var updateDiceDisplay = function() {
  var posPoolDisplay = document.getElementById('pospool');
  var ctx = posPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  var startx = 0;
  var amt = posDicePool['green'];
  ctx.fillStyle = "#00FF00";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = posDicePool['yellow'];
  ctx.fillStyle = "#FFFF00";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = posDicePool['boost'];
  ctx.fillStyle = "#80dfff";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }

  var negPoolDisplay = document.getElementById('negpool');
  ctx = negPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  startx = 0;
  amt = negDicePool['purple'];
  ctx.fillStyle = "#5c00e6";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = negDicePool['red'];
  ctx.fillStyle = "#FF0000";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = negDicePool['setback'];
  ctx.fillStyle = "#000000";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }

};

var updatePool = function() {
  var g = document.getElementById('numgreen').value;
  var p = document.getElementById('numpurple').value;
  var y = document.getElementById('numyellow').value;
  var r = document.getElementById('numred').value;
  var b = document.getElementById('numboost').value;
  var s = document.getElementById('numsetback').value;

  posDicePool['green'] = g;
  posDicePool['yellow'] = y;
  posDicePool['boost'] = b;

  negDicePool['purple'] = p;
  negDicePool['red'] = r;
  negDicePool['setback'] = s;

  updateDiceDisplay();
};


document.getElementById('numgreen').addEventListener('change', updatePool);
document.getElementById('numyellow').addEventListener('change', updatePool);
document.getElementById('numboost').addEventListener('change', updatePool);
document.getElementById('numpurple').addEventListener('change', updatePool);
document.getElementById('numred').addEventListener('change', updatePool);
document.getElementById('numsetback').addEventListener('change', updatePool);
document.getElementById("roll").addEventListener('click', rollDice);

var setup = function() {
  setup_skills();
  var checks = document.getElementsByName('check_type');
  for (var i=0; i<checks.length; i++) {
    checks[i].addEventListener('click', get_check);
  }
};
