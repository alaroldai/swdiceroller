namespace Types {

  export type Symbol =
    'success'
    | 'triumph'
    | 'failure'
    | 'threat'
    | 'advantage'
    | 'despair'
    | 'dark'
    | 'light'
    ;

  export type DieSides = Symbol[][]

  export type DieType =
    'boost'
    | 'setback'
    | 'ability'
    | 'difficulty'
    | 'proficiency'
    | 'challenge'
    | 'force'
    ;

  export type Ability = 'brawn' | 'agility' | 'intellect' | 'cunning' | 'willpower' | 'presence';

  export type Skill =
    'astrogation'
    | 'athletics'
    | 'brawl'
    | 'charm'
    | 'coercion'
    | 'computers'
    | 'cool'
    | 'coordination'
    | 'coreWorlds'
    | 'deception'
    | 'discipline'
    | 'gunnery'
    | 'knowledgeOther'
    | 'leadership'
    | 'lore'
    | 'mechanics'
    | 'medicine'
    | 'melee'
    | 'negotiation'
    | 'outerRim'
    | 'perception'
    | 'pilotingPlanetary'
    | 'pilotingSpace'
    | 'rangedHeavy'
    | 'rangedLight'
    | 'resilience'
    | 'skulduggery'
    | 'stealth'
    | 'streetwise'
    | 'survival'
    | 'underworld'
    | 'vigilence'
    | 'xenology';
}

namespace Dice {
  export const Boost: Types.DieSides = [
    ['success'],
    ['success', 'advantage'],
    ['advantage', 'advantage'],
    ['advantage']
  ]

  export const Setback: Types.DieSides = [
    [],
    [],
    ['failure'], ['failure'],
    ['threat'], ['threat']
  ]

  export const Ability: Types.DieSides = [
    [],
    ['success'], ['success'],
    ['success', 'success'],
    ['advantage'], ['advantage'],
    ['success', 'advantage'],
    ['advantage', 'advantage']
  ]

  export const Difficulty: Types.DieSides = [
    [],
    ['failure'],
    ['failure', 'failure'],
    ['threat'], ['threat'], ['threat'],
    ['threat', 'threat'],
    ['failure', 'threat']
  ]

  export const Proficiency: Types.DieSides = [
    [],
    ['success'], ['success'],
    ['success', 'success'], ['success', 'success'],
    ['advantage'],
    ['success', 'advantage'], ['success', 'advantage'], ['success', 'advantage'],
    ['advantage', 'advantage'], ['advantage', 'advantage'],
    ['triumph']
  ]

  export const Challenge: Types.DieSides = [
    [],
    ['failure'], ['failure'],
    ['failure', 'failure'], ['failure', 'failure'],
    ['threat'],
    ['failure', 'threat'], ['failure', 'threat'], ['failure', 'threat'],
    ['threat', 'threat'], ['threat', 'threat'],
    ['despair']
  ]

  export const Force: Types.DieSides = [
    ['dark'], ['dark'], ['dark'], ['dark'], ['dark'], ['dark'],
    ['dark', 'dark'],
    ['light'], ['light'],
    ['light', 'light'], ['light', 'light'], ['light', 'light'],
  ]

  type Dice = Record<Types.DieType, number>;
  export const defaultDice: Readonly<Dice> = {
    boost: 0,
    setback: 0,
    ability: 0,
    difficulty: 0,
    proficiency: 0,
    challenge: 0,
    force: 0,
  };

  function dieTypeToSides(t: Types.DieType): Types.DieSides {
    switch (t) {
      case 'boost': return Boost
      case 'setback': return Setback
      case 'ability': return Ability
      case 'difficulty': return Difficulty
      case 'proficiency': return Proficiency
      case 'challenge': return Challenge
      case 'force': return Force
    }
  }

  export class DiePool {
    dice: Record<Types.DieType, number>

    constructor(dice: Partial<Record<Types.DieType, number>>) {
      this.dice = {
        ...defaultDice,
        ...dice,
      };
    }

    static build(skill: number, ability: number): DiePool {
      var dice: Dice = { ...defaultDice };
      var i = 0;
      for (; i < Math.min(skill, ability); i++) {
        dice['proficiency'] += 1;
      }
      for (; i < Math.max(skill, ability); i++) {
        dice['ability'] += 1;
      }
      return new DiePool(dice)
    }

    add(pool: DiePool): DiePool {
      for (let k in pool.dice) {
        this.dice[k] += pool.dice[k]
      }
      return this
    }

    boost(times: number): DiePool {
      return this.add(new DiePool({ boost: times }))
    }

    setback(times: number): DiePool {
      return this.add(new DiePool({ setback: times }))
    }

    difficulty(times: number): DiePool {
      return this.add(new DiePool({ difficulty: times }))
    }

    challenge(times: number): DiePool {
      return this.add(new DiePool({ challenge: times }))
    }

    populate() {
      setInputElementValue('numgreen', this.dice['ability'].toString());
      setInputElementValue('numpurple', this.dice['difficulty'].toString());
      setInputElementValue('numyellow', this.dice['proficiency'].toString());
      setInputElementValue('numred', this.dice['challenge'].toString());
      setInputElementValue('numboost', this.dice['boost'].toString());
      setInputElementValue('numsetback', this.dice['setback'].toString());
      updatePool();
    }

    roll(): Record<Types.Symbol, number> {
      var result: Record<Types.Symbol, number> = {
        success: 0,
        triumph: 0,
        failure: 0,
        threat: 0,
        advantage: 0,
        despair: 0,
        dark: 0,
        light: 0,
      };

      var dice: Types.DieSides[] = [];
      for (let d in this.dice) {
        for (let i = 0; i < this.dice[d]; i++) {
          dice.push(dieTypeToSides(d as Types.DieType));
        }
      }

      for (let die of dice) {
        let side = die[Math.floor(Math.random() * die.length)];
        for (let sym of side) {
          result[sym] += 1
        }
      }

      return result;
    }
  }
}
// ------------------------------------------------------------------------------------------------


var DICE_SIZE = 25;
var OFFSET = 2;

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

var posImages = { success: successImg, advantage: advantageImg, triumph: triumphImg };
var negImages = { failure: failureImg, threat: threatImg, despair: despairImg };

var posDicePool = { green: 0, yellow: 0, boost: 0 };
var negDicePool = { purple: 0, red: 0, setback: 0 };

var posResults = { success: 0, advantage: 0, triumph: 0 };
var negResults = { failure: 0, threat: 0, despair: 0 };

var netsuccess = 0;
var netfailure = 0;

var combat_skills = ['brawl', 'melee', 'ranged-light', 'ranged-heavy', 'gunnery'];
var knowledge_skills = ['core worlds', 'education', 'lore', 'outer rim', 'underworld', 'xenology'];

var check_table = {
  'brawl': 'brawn',
  'melee': 'brawn',
  'ranged-light': 'agility',
  'ranged-heavy': 'agility',
  'gunnery': 'agility',
  'astrogation': 'intellect',
  'athletics': 'brawn',
  'charm': 'pressence',
  'coercion': 'willpower',
  'computers': 'intellect',
  'cool': 'pressence',
  'coordination': 'agility',
  'deception': 'cunning',
  'discipline': 'willpower',
  'leadership': 'pressence',
  'mechanics': 'intellect',
  'medicine': 'intellect',
  'negotiation': 'pressence',
  'perception': 'cunning',
  'pilot-planet': 'agility',
  'pilot-space': 'agility',
  'resilience': 'brawn',
  'skullduggery': 'cunning',
  'stealth': 'agility',
  'streetwise': 'cunning',
  'survival': 'cunning',
  'vigilance': 'willpower',
  'core worlds': 'intellect',
  'education': 'intellect',
  'lore': 'intellect',
  'outer rim': 'intellect',
  'underworld': 'intellect',
  'xenology': 'intellect'
};

var deegray_stats = {
  'brawn': 6,
  'agility': 3,
  'intellect': 2,
  'cunning': 2,
  'willpower': 3,
  'pressence': 1,
  'astrogation': 0,
  'athletics': 0,
  'charm': 0,
  'coercion': 1,
  'computers': 0,
  'cool': 0,
  'coordination': 1,
  'deception': 0,
  'discipline': 1,
  'leadership': 0,
  'mechanics': 0,
  'medicine': 0,
  'negotiation': 0,
  'perception': 0,
  'pilot-planet': 2,
  'pilot-space': 0,
  'resilience': 1,
  'skullduggery': 0,
  'stealth': 0,
  'streetwise': 0,
  'survival': 0,
  'vigilance': 1,
  'brawl': 1,
  'melee': 3,
  'ranged-light': 0,
  'ranged-heavy': 1,
  'gunnery': 1
};

var load_deegray = function () {
  var stat_keys = Object.keys(deegray_stats);
  for (var i = 0; i < stat_keys.length; i++) {
    var e = <HTMLInputElement>document.getElementById(stat_keys[i]);
    console.log(stat_keys[i]);
    e.value = deegray_stats[stat_keys[i]];
  }
};

var setup_skills = function () {

  var combat_table = document.createElement("table");
  var knowledge_table = document.createElement("table");
  var table = document.createElement("table");
  table.style.float = "left";
  table.style.border = "1px solid";
  combat_table.style.border = "1px solid";
  knowledge_table.style.border = "1px solid";

  var skills = Object.keys(check_table);
  for (var i = 0; i < skills.length; i++) {
    var row = document.createElement('tr');
    var tdr = document.createElement('td');
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "check_type";
    radio.id = skills[i] + "_check";
    tdr.appendChild(radio);
    var name = skills[i].charAt(0).toUpperCase() + skills[i].slice(1);
    tdr.innerHTML += name;
    var tdi = document.createElement('td');
    var input = document.createElement('input');
    input.type = "number";
    input.id = skills[i];
    input.min = "0";
    input.style.width = "50px";
    tdi.appendChild(input);
    row.appendChild(tdr);
    row.appendChild(tdi);
    if (combat_skills.includes(skills[i])) {
      combat_table.appendChild(row);
    }
    else if (knowledge_skills.includes(skills[i])) {
      knowledge_table.appendChild(row);
    }
    else {
      table.appendChild(row);
    }
  }
  document.getElementById("skills").appendChild(table);
  document.getElementById("skills").appendChild(combat_table);
  document.getElementById("skills").appendChild(knowledge_table);
};

var get_check = function (e) {
  var skill = e.target.id.split('_')[0];
  set_dice(skill);
};

function getInputElementValue(id: string): string {
  const inputElement = <HTMLInputElement>document.getElementById(id);
  return inputElement.value
}

function setInputElementValue(id: string, value: string) {
  const inputElement = <HTMLInputElement>document.getElementById(id);
  inputElement.value = value;
}

var set_dice = function (skill) {
  var chara = check_table[skill];
  var num_skill = parseInt(getInputElementValue(skill));
  var num_char = parseInt(getInputElementValue(chara));
  var num_dice = Math.max(num_skill, num_char);
  var num_yellow = Math.min(num_skill, num_char);
  setInputElementValue('numgreen', (num_dice - num_yellow).toString());
  setInputElementValue('numyellow', num_yellow.toString());

  updatePool();
};

var rollDice = function () {
  updatePool();
  posResults = { success: 0, advantage: 0, triumph: 0 };
  negResults = { failure: 0, threat: 0, despair: 0 };

  var posDiceTypes = { 'green': [Dice.Ability, "#00FF00"], 'yellow': [Dice.Proficiency, '#FFFF00'], 'boost': [Dice.Boost, '#80dfff'] };
  var posResultDisplay = <HTMLCanvasElement>document.getElementById('pospool');
  var ctx = posResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  var startx = 0;
  var keys = Object.keys(posDiceTypes);
  for (var i = 0; i < keys.length; i++) {

    var dtype = keys[i];
    var die = posDiceTypes[dtype][0];
    for (var j = 0; j < posDicePool[dtype]; j++) {
      var result = die[Math.floor(Math.random() * die.length)];

      ctx.fillStyle = posDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
      if (result.length == 1) {
        posResults[result] += 1;
        ctx.drawImage(posImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {

        posResults[result[0]] += 1;
        posResults[result[1]] += 1;

        ctx.drawImage(posImages[result[0]], startx, 0, DICE_SIZE / 2, DICE_SIZE / 2);
        ctx.drawImage(posImages[result[1]], startx + (DICE_SIZE) / 2, DICE_SIZE / 2, DICE_SIZE / 2, DICE_SIZE / 2);
      }
      startx += DICE_SIZE + OFFSET;
    }
  }

  var negDiceTypes = { 'purple': [Dice.Difficulty, "#5c00e6"], 'red': [Dice.Challenge, '#FF0000'], 'setback': [Dice.Setback, '#000000'] };
  var negResultDisplay = <HTMLCanvasElement>document.getElementById('negpool');
  ctx = negResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  startx = 0;
  keys = Object.keys(negDiceTypes);
  for (var i = 0; i < keys.length; i++) {

    var dtype = keys[i];
    var die = negDiceTypes[dtype][0];

    for (var j = 0; j < negDicePool[dtype]; j++) {
      result = die[Math.floor(Math.random() * die.length)];
      ctx.fillStyle = negDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);

      if (result.length == 1) {
        negResults[result] += 1;
        ctx.drawImage(negImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {
        negResults[result[0]] += 1;
        negResults[result[1]] += 1;
        ctx.drawImage(negImages[result[0]], startx, 0, DICE_SIZE / 2, DICE_SIZE / 2);
        ctx.drawImage(negImages[result[1]], startx + (DICE_SIZE) / 2, DICE_SIZE / 2, DICE_SIZE / 2, DICE_SIZE / 2);
      }
      if (dtype == 'setback' || dtype == "purple")
        ctx.fillStyle = "#FFFFFF";

      startx += DICE_SIZE + OFFSET;
    }
  }
  updateResultTotals();
};

function setTableDataInnerText(id: string, text: string) {
  (<HTMLTableDataCellElement>document.getElementById(id)).innerText = text;
}

var updateResultTotals = function () {
  var u = posResults['triumph'];
  var s = posResults['success'] + u;
  var a = posResults['advantage'];
  var d = negResults['despair'];
  var f = negResults['failure'] + d;
  var t = negResults['threat'];

  setTableDataInnerText("scount", s.toString());
  setTableDataInnerText("acount", a.toString());
  setTableDataInnerText("fcount", f.toString());
  setTableDataInnerText("tcount", t.toString());
  setTableDataInnerText("ucount", u.toString());
  setTableDataInnerText("dcount", d.toString());
  setTableDataInnerText("snet", (s - f).toString());
  setTableDataInnerText("anet", (a - t).toString());

  if ((s - f) > 0)
    netsuccess += 1;
  else
    netfailure += 1;
};

var multi_roll = function (n) {
  netsuccess = 0;
  netfailure = 0;
  while (n > 0) {
    rollDice();
    n -= 1;
  }

  console.log("success: " + netsuccess);
  console.log("failure: " + netfailure);
};


var updateDiceDisplay = function () {
  var posPoolDisplay = <HTMLCanvasElement>document.getElementById('pospool');
  var ctx = posPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  var startx = 0;
  var amt = posDicePool['green'];
  ctx.fillStyle = "#00FF00";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }
  amt = posDicePool['yellow'];
  ctx.fillStyle = "#FFFF00";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }
  amt = posDicePool['boost'];
  ctx.fillStyle = "#80dfff";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }

  var negPoolDisplay = <HTMLCanvasElement>document.getElementById('negpool');
  ctx = negPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  startx = 0;
  amt = negDicePool['purple'];
  ctx.fillStyle = "#5c00e6";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }
  amt = negDicePool['red'];
  ctx.fillStyle = "#FF0000";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }
  amt = negDicePool['setback'];
  ctx.fillStyle = "#000000";
  for (var i = 0; i < amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx += DICE_SIZE + OFFSET;
  }

};

var updatePool = function () {
  var g = parseInt(getInputElementValue('numgreen'));
  var p = parseInt(getInputElementValue('numpurple'));
  var y = parseInt(getInputElementValue('numyellow'));
  var r = parseInt(getInputElementValue('numred'));
  var b = parseInt(getInputElementValue('numboost'));
  var s = parseInt(getInputElementValue('numsetback'));

  posDicePool['green'] = g;
  posDicePool['yellow'] = y;
  posDicePool['boost'] = b;

  negDicePool['purple'] = p;
  negDicePool['red'] = r;
  negDicePool['setback'] = s;

  updateDiceDisplay();
};

function reset() {
  new Dice.DiePool(Dice.defaultDice).populate();
}

function addEventListeners() {
  buildDataNodeTree(data);
  document.getElementById('numgreen').addEventListener('change', updatePool);
  document.getElementById('numyellow').addEventListener('change', updatePool);
  document.getElementById('numboost').addEventListener('change', updatePool);
  document.getElementById('numpurple').addEventListener('change', updatePool);
  document.getElementById('numred').addEventListener('change', updatePool);
  document.getElementById('numsetback').addEventListener('change', updatePool);
  document.getElementById("roll").addEventListener('click', rollDice);
  document.getElementById("reset").addEventListener('click', reset);

  var togglers = document.getElementsByClassName("caret");
  for (var i = 0; i < togglers.length; i++) {
    togglers[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
}

var setup = function () {
  setup_skills();
  var checks = document.getElementsByName('check_type');
  for (var i = 0; i < checks.length; i++) {
    checks[i].addEventListener('click', get_check);
  }
};

document.addEventListener('DOMContentLoaded', addEventListeners, false);

// --------------------------------------------------------

interface DiePoolBuilder {
  build_pool(parents: [DataNode]): Dice.DiePool;
}

interface StatContainer {
  brawn: number;
  agility: number;
  intellect: number;
  cunning: number;
  willpower: number;
  presence: number;
  astrogation: number;
  athletics: number;
  brawl: number;
  charm: number;
  coercion: number;
  computers: number;
  cool: number;
  coordination: number;
  coreWorlds: number;
  deception: number;
  discipline: number;
  gunnery: number;
  knowledgeOther: number;
  leadership: number;
  lore: number;
  mechanics: number;
  medicine: number;
  melee: number;
  negotiation: number;
  outerRim: number;
  perception: number;
  pilotingPlanetary: number;
  pilotingSpace: number;
  rangedHeavy: number;
  rangedLight: number;
  resilience: number;
  skulduggery: number;
  stealth: number;
  streetwise: number;
  survival: number;
  underworld: number;
  vigilence: number;
  xenology: number;
}

interface DataNode {
  title: string;
  children: DataNode[];
  parent?: DataNode;
  build_pool?(): Dice.DiePool;
  stat_container?: StatContainer;
}

function dataNode_nearestNodeWithStatContainer(node: DataNode): DataNode {
  for (node; ; node = node.parent) {
    console.log('checking if ' + node.title + ' has a stat container');
    if (node.stat_container) {
      console.log('yep');
      return node;
    }
    console.log('nah');
    if (!node.parent) return null;
  }
  return null;
}

let data: DataNode = {
  title: 'root',
  children: [
    {
      title: 'Deegray',
      stat_container: {
        brawn: 6,
        agility: 3,
        intellect: 2,
        cunning: 2,
        willpower: 3,
        presence: 1,
        astrogation: 0,
        athletics: 0,
        charm: 0,
        coercion: 1,
        computers: 0,
        cool: 0,
        coordination: 1,
        deception: 0,
        discipline: 1,
        leadership: 0,
        mechanics: 0,
        medicine: 0,
        negotiation: 0,
        perception: 0,
        pilotingPlanetary: 2,
        pilotingSpace: 0,
        resilience: 1,
        skulduggery: 0,
        stealth: 0,
        streetwise: 0,
        survival: 0,
        vigilence: 1,
        brawl: 1,
        melee: 3,
        rangedLight: 0,
        rangedHeavy: 1,
        gunnery: 1,
        coreWorlds: 0,
        outerRim: 0,
        knowledgeOther: 0,
        lore: 0,
        underworld: 0,
        xenology: 0,
      },
      children: [] as DataNode[]
    },
    {
      title: 'Rekhtyart',
      stat_container: {
        brawn: 3,
        agility: 3,
        intellect: 4,
        cunning: 2,
        willpower: 1,
        presence: 2,
        astrogation: 3,
        athletics: 0,
        brawl: 1,
        charm: 0,
        coercion: 0,
        computers: 0,
        cool: 0,
        coordination: 2,
        coreWorlds: 0,
        deception: 0,
        discipline: 0,
        gunnery: 0,
        knowledgeOther: 0,
        leadership: 0,
        lore: 0,
        mechanics: 4,
        medicine: 1,
        melee: 0,
        negotiation: 0,
        outerRim: 0,
        perception: 1,
        pilotingPlanetary: 0,
        pilotingSpace: 0,
        rangedHeavy: 3,
        rangedLight: 0,
        resilience: 0,
        skulduggery: 0,
        stealth: 0,
        streetwise: 0,
        survival: 0,
        underworld: 1,
        vigilence: 0,
        xenology: 0,
      },
      children: [
        {
          title: 'Bowcaster',
          children: [
            {
              title: 'Shoot',
              children: [],
              build_pool(): Dice.DiePool {
                let statContainer = dataNode_nearestNodeWithStatContainer(this);
                let pool = Dice.DiePool.build(statContainer.stat_container.agility, statContainer.stat_container.rangedHeavy);

                return pool;
              }
            }
          ],
        }
      ]
    }
  ]
}

function buildDataNodeTree(root: DataNode) {
  type action = 'pre' | 'post';
  let estack = [document.getElementById('nodes')];
  let nstack = [{ action: 'pre', node: root }];

  estack[0].textContent = '';

  while (nstack.length > 0) {
    let element = estack[estack.length - 1];
    let { action, node } = nstack.pop();

    if (action == 'pre') {
      let li = document.createElement('li');
      let span = document.createElement('span');

      if (node !== root) {
        span.textContent = node.title;
        li.appendChild(span);

        if (node.build_pool) {
          let build_pool_button = document.createElement('button');
          build_pool_button.classList.add('build-pool-button');
          build_pool_button.textContent = 'Build Pool';
          build_pool_button.onclick = () => { node.build_pool().populate(); };
          li.appendChild(build_pool_button);
        }
        element.appendChild(li);
        estack.push(li);

        element = li;
      }

      nstack.push({ action: 'post', node: node });

      if (node.children.length > 0) {

        if (node !== root) {
          let ul = document.createElement('ul');
          ul.classList.add('nested');
          span.classList.add('caret');
          element.appendChild(ul);
          estack.push(ul);
        }
        for (let child of node.children) {
          nstack.push({ action: 'pre', node: child });
          child.parent = node;
        }
      }
    } else {
      estack.pop();
      if (node.children.length > 0) {
        estack.pop();
      }
    }
  }
}