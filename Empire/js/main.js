// const Resources = {
//     "gold": 100,    "gems": false,      "dyes":false,
//     "people": 100,  "wheat":false,      "cattle":false,
//     "wood": 50,     "hard wood":false,  "soft wood":false,
//     "metal": 25,    "mithril":false,    "adamantite":false,
//     "mana": 0,      "living wood": 0,   "deep metal": 0
// };
// const Army = {
//     "peasant": 10,          "militia": 0,           "spearman": 0,
//     "pikeman": 0,           "halberdier": 0,        "swordsman": 0,
//     "knight": 0,            "barbarian": 0,         "horseman": 0,
//     "cavalier": 0,          "lancer": 0,            "paladin": 0,
//     "horse archer": 0,      "skirmisher": 0,        "hellion": 0,
//     "archer": 0,            "bowman":0,             "ranger":0,
//     "longbowman":0,         "crossbowman":0,        "man-at-arms":0,
//     "sniper":0,             "catapult": 0,          "trebuchet":0,
//     "heavy trebuchet":0,    "scatter trebuchet":0,  "ballista":0,
//     "fire ballista":0,      "cannon":0,             "centurion":0,
//     "elven archer":0,       "dwarven cannon":0,     "dwarven infantry":0,
//     "evoker":0,             "illusionist":0
// }

// console.log(Resources);
// console.log(Army);
const Buildings = [
    {
        name: "Mines", 
        val: 0,
        cost: [[50,0]]
    },
    {
        name:"Recruiters", 
        val: 0,
        cost: [[100,0]]
    },
    {
        name: "Barracks",
        val: 0,
        cost: [[250,0]]
    },
    {
        name: "Ranges",
        val: 0,
        cost: [[350,0]]
    },
    {
        name: "Stables",
        val: 0,
        cost: [[1000,0]]
    },
    {
        name: "Workshops",
        val: 0,
        cost: [[2500,0]]
    }   
];
const Resources = [
    {
        name: "Gold",
        val: 200,
        gain: 0,
        loss: 0
    }
];
const Units = [
     {  
        name: "Recruits",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Soldiers",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Archers",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Horsemen",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Catapults",
        val: 0,
        gain: 0,
        loss: 0
    }
];
function checkCost(b) {
    let canAfford = true;
    for(let i = 0;i < Buildings[b].cost.length;i++)
    {
        if(Buildings[b].cost[i][0] < Resources[Buildings[b].cost[i][1]].val)
        {
            canAfford = false;
            break;
        }
    }
    return canAfford;
}
function buy(b) {
    if(!checkCost(b)) {
        for(let i = 0;i < Buildings[b].cost.length;i++)
        {
            Resources[Buildings[b].cost[i][1]].val -= Buildings[b].cost[i][0];
            Buildings[b].val++;
            if(b < 1)
            {
                Buildings[b].cost[i][0] = Math.trunc(Buildings[b].cost[i][0] * 1.5);
                Resources[b].gain += 10;
            }
            else
            {
                Buildings[b].cost[i][0] = Math.trunc(Buildings[b].cost[i][0] * 1.1);
                Units[b-1].gain += 1;
            }
            document.getElementById(`${Buildings[b].name}-btn`).innerHTML = `Buy(${Buildings[b].cost[i][0]}${Resources[i].name[0]})`;
        }
        document.getElementById(`${Buildings[b].name}`).innerHTML = `${Buildings[b].name}: ${Buildings[b].val}`; 
    }
    tick(false);
}
function tick(interval = true) {
    if(interval){
        Resources.forEach((i) => {
            i.val += i.gain - i.loss;
        });
        Units.forEach((i) => {
            i.val += i.gain - i.loss;
        });
    }
    for(let i = 0; i < Buildings.length;i++){
        document.getElementById(`${Buildings[i].name}-btn`).disabled = checkCost(i);
    }
    Resources.forEach((i) => {
            let delta = '';
            if(i.gain > i.loss) {delta = `(+${i.gain-i.loss}/sec)`;}
            else if (i.gain < i.loss) {delta = `(-${i.gain-i.loss}/sec)`;}
            document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} ${delta}`;
        });
        Units.forEach((i) => {
            let delta = '';
            if(i.gain > i.loss) {delta = `(+${i.gain-i.loss}/sec)`;}
            else if (i.gain < i.loss) {delta = `(-${i.gain-i.loss}/sec)`;}
            document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} ${delta}`;
        });
    
}
setInterval(tick, 1000);