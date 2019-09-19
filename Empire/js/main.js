// const Army = {
//     
//     "pikeman": 0,           "halberdier": 0,
//     "knight": 0,            "barbarian": 0,
//     "lancer": 0,            "paladin": 0,
//     "skirmisher": 0,        "hellion": 0,
//     "ranger":0,
//     "longbowman":0,         "man-at-arms":0,
//     "sniper":0,
//     "heavy trebuchet":0,    "scatter trebuchet":0,  
//     "fire ballista":0,      "cannon":0,     "centurion":0,
//     "elven archer":0, "dwarven cannon":0, "dwarven infantry":0,
//     "evoker":0,    "illusionist":0
// }
let tab = 'Build';
let saveData = [];
const Buildings = [
    {
        name: "Mines", 
        val: 0,
        cost: [[50,0]],
        upkeep: [[]]
    },
    {
        name:"Recruiters", 
        val: 0,
        cost: [[100,0]],
        upkeep: [[true,1,1]]
    },
    {
        name: "Barracks",
        val: 0,
        cost: [[250,0]],
        upkeep: [[false,0,1]]
    },
    {
        name: "Ranges",
        val: 0,
        cost: [[350,0]],
        upkeep: [[false,0,1]]
    },
    {
        name: "Stables",
        val: 0,
        cost: [[1000,0]],
        upkeep: [[false,0,1]]
    },
    {
        name: "Workshops",
        val: 0,
        cost: [[2500,0]],
        upkeep: [[false,0,5]]
    }   
];
const Resources = [
    {
        name: "Gold",
        val: 200,
        gain: 0,
        loss: 0
    },
    {
        name: "People",
        val: 1000,
        gain: 1,
        loss: 0
    },
    {
        name: "Wood",
        val: 50,
        gain: 0,
        loss: 0
    },
    {
        name: "Metal",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Mana",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Living Wood",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Deep Metal",
        val: 0,
        gain: 0,
        loss: 0
    }
];
const Luxuries = [
    {
        name: 'Gems',
        val: false
    },
    {
        name: 'Dyes',
        val: false
    },
    {
        name: 'Wheat',
        val: false
    },
    {
        name: 'Cattle',
        val: false
    },
    {
        name: 'Hard Wood',
        val: false
    },
    {
        name: 'Soft Wood',
        val: false
    },
    {
        name: 'Mithril',
        val: false
    },
    {
        name: 'Adamantite',
        val: false
    }
]
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
    },
    {
        name: "Swordsmen",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Spearmen",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Rangers",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Crossbowmen",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Cavalry",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Horse Archers",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Trebuchets",
        val: 0,
        gain: 0,
        loss: 0
    },
    {
        name: "Ballistae",
        val: 0,
        gain: 0,
        loss: 0
    },
];
function saveGame(){
    //Load R
    //Load L
    //Load B
}
function loadGame(){

}
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
function setTab(newTab){
    document.getElementById(tab).style.display = 'none';
    document.getElementById(`${tab}-btn`).style.textDecoration = 'none';
    tab = newTab;
    document.getElementById(tab).style.display = 'flex';
    document.getElementById(`${tab}-btn`).style.textDecoration = 'underline';
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
            if((i.val || (i.gain - i.loss)) !== 0){
                document.getElementById(`${i.name}`).style.display = 'inline';
            }
            else{
                document.getElementById(`${i.name}`).style.display = 'none';
            }
        });
        Units.forEach((i) => {
            let delta = '';
            if(i.gain > i.loss) {delta = `(+${i.gain-i.loss}/sec)`;}
            else if (i.gain < i.loss) {delta = `(-${i.gain-i.loss}/sec)`;}
            document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} ${delta}`;
            if((i.val || (i.gain - i.loss)) !== 0){
                document.getElementById(`${i.name}`).style.display = 'inline';
            }
            else{
                document.getElementById(`${i.name}`).style.display = 'none';
            }
        });
    
    
}
setTab('Build');
setInterval(tick, 1000);