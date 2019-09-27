class GameObject{
    constructor(infoArray){
        this.name = infoArray[0];
        this.desc = infoArray[1];
        this.val = infoArray[2];
    }
}
class Building extends GameObject{
    constructor(info,costArray,upkeepArray,produceArray){
        super(info);
        this.cost = costArray;
        this.upkeep = upkeepArray;
        this.production = produceArray;
    }

    checkCost(){
        let flag = true;
        this.cost.forEach( i => {
            if(!i[1]){if(!Resources[i[1]].val) flag = false;}
            else if(Math.trunc(i[0] * Math.pow(1.2,this.val)) > Resources[i[1]].val){flag = false;}
        });
        return flag;
    }

    checkUpkeep(){
        if(this.production[0] < 0)
        {
            if(Luxury[upkeep[0]].val && Luxury[upkeep[1]].val)
            {
                return 2;
            }
            else if(Luxury[upkeep[0]].val || Luxury[upkeep[1]].val)
            {
                return 1;
            }
            else{
                return 0;
            }
        }
        else
        {
            let flag = true;
            this.upkeep.forEach( i=> {
                if(i[0] < 0)
                {
                    if(Resources[i[0]*-1].val < i[1]*this.val)
                    {
                        flag = false;
                        // break;
                    }
                    Resources[i[0]*-1].delta -= i[1]*this.val;
                }
                else
                {
                    if(Units[i[0]].val < i[1]*this.val)
                    {
                        flag = false;
                        // break;
                    } 
                    Units[i[0]*-1].delta -= i[1]*this.val;
                }
            });
            return flag;
        }
    }

    payUpkeep(){
        this.upkeep.forEach( i=> {
            if(i[0] < 0)
            {
                Resources[i[0]*-1].val -= i[1]*this.val;
            }
            else
            {
                Units[i[0]].val -= i[1]*this.val;
            }
        });
    }

    buy(){
        if(!this.checkCost()){return;}
        this.cost.forEach( i => {if(!i[1]){Resources[i[1]].val--}else{Resources[i[1]].val -= Math.trunc(i[0] * Math.pow(1.2,this.val))}});
        this.val++;
        updateUI();
    }   

    sell(){
        this.cost.forEach( i => {if(!i[1]){Resources[i[1]].val++}else{Resources[i[1]].val += Math.trunc(i[0] * Math.pow(1.2,this.val))}});
        this.val--;
        updateUI();
    }
}
class Upgrade extends GameObject{
    constructor(info,targetArr,operation,mod,dArray = null){
        super(info);
        this.targets = targetArr;
        this.operation = operation;
        this.mod = mod;
        this.dervitives = dArray;
    }
    update(){
        //called from targets if derivitives !== null
    }
}
class Resource extends GameObject{
    constructor(info,modsArr){
        super(info);
        this.mods = modsArr;
        this.delta = 0;
    }
    update(){
        this.delta = 0;
        if(this.mods.length < 3){return;}
        
        this.delta += Buildings[this.mods[0]].val * Buildings[this.mods[0]].production[1];
        for(let i = 3; i < this.mods.length;i++){
            Upgrades[mods[i]].update();
            this.delta = Upgrades[mods[i]].use(this.delta);
        }
        if(Luxuries[this.mods[1]].val && Luxuries[this.mods[2]].val)
        {
            this.val += this.delta * 3;
        }
        else if(Luxuries[this.mods[1]].val || Luxuries[this.mods[2]].val)
        {
            this.val += this.delta * 2;
        }
        else{
            this.val += this.delta;
        }
    }
}
class Luxury extends GameObject{
    constructor(info,location){
        super(info);
        this.location = location;
    }
}
class Unit extends Resource{
    constructor(info,mods,typeArr,power,armor){
        super(info,mods);
        this.type = typeArr;
        this.power = power;
        this.armor = armor;
    }
    update(){
        this.delta = 0;
        for(let i = 0; i < this.mods.length;i++){
            if(Buildings[this.mods[i]].checkUpkeep()){
                Buildings[this.mods[i]].payUpkeep();
                this.delta += Buildings[this.mods[0]].val * Buildings[this.mods[0]].production[1];
            }
            if(this.mods[i] > 99)
            {
                Upgrades[this.mods[i-100]].update();
                this.delta = Upgrades[this.mods[i-100]].use(this.delta);
            }
            
        }
        this.val += this.delta;
    }
}
let shiftOn = false;
let tab = 'Build';
let saveData = [];
const Buildings = [];
const Resources = [];
const Luxuries = [];
const Units = [];

function initGame(){
    
    setTab('Build');
    // ========================================================================
    // Buildings Array
    // ========================================================================
    Buildings.push(new Building(["Mines","Produces 10G / sec.",0],[ [1,0],[50,1],[10,3] ],[[]],[-1,10] ));
    Buildings.push(new Building(["Farms","Increases population growth by 1 person / sec.",0],[ [1,0],[100,1] ],[[]],[-2,1] ));
    Buildings.push(new Building(["Lumberyards","Produces 10 wood / sec.",0],[ [1,0],[100,1],[10,3] ],[[]],[-3,10] ));
    Buildings.push(new Building(["Forges","Produces 10 metal / sec.",0],[ [1,0],[100,1],[50,3] ],[[]],[-4,10] ));
    Buildings.push(new Building(["Recruiters","Turns 1 person into 1 recruit.",0],[ [1,0],[100,1],[50,3] ],[ [-2,1] ],[0,1] ));
    Buildings.push(new Building(["Barracks","Trains 1 recruit into 1 soldier",0],[ [1,0],[250,1],[100,3] ],[ [0,1] ],[1,1] ));
    Buildings.push(new Building(["Ranges","Trains 1 recruit into 1 archer",0],[ [1,0],[350,1],[120,3] ],[ [0,1] ],[8,1] ));
    Buildings.push(new Building(["Stables","Trains 1 recruit into 1 horseman",0],[ [1,0],[1000,1],[250,3] ],[ [0,1] ],[15,1] ));
    Buildings.push(new Building(["Workshops","Trains 5 recruits into 1 catapult",0],[ [1,0],[2500,1],[500,3],[250,4] ],[ [0,5] ],[22,1] ));
    // ========================================================================
    // Resources Array
    // ========================================================================
    Resources.push(new Resource(["Land","The unused land that you occupy.",100],[]));
    Resources.push(new Resource(["Gold","Cold hard cash!",50],[0,0,1]));
    Resources.push(new Resource(["People","The citizens of your empire.",1000],[1,2,3]));
    Resources.push(new Resource(["Wood","Used to make buildings.",20],[2,3,4]));
    Resources.push(new Resource(["Metal","Used to make arms and armor.",0],[3,5,6]));
    Resources.push(new Resource(["Mana","Magical energy used to power spells.",0],[99]));
    Resources.push(new Resource(["Living Wood","Wood that grows even after being milled. Elves value it highly.",0],[99]));
    Resources.push(new Resource(["Deep Metal","Rare metal used to make the strongest arms and armor. Dwarfs love this stuff!",0],[99]));
    // ========================================================================
    // Luxury Array
    // ========================================================================
    Luxuries.push(new Luxury(['Gems',"Rare gemstones that increase gold production by 100%",false],0));
    Luxuries.push(new Luxury(['Dyes',"Vibrant dyes that increase gold production by 100%",false],0));
    Luxuries.push(new Luxury(['Wheat',"Rolling wheat fields that increase population growth by 100%",false],0));
    Luxuries.push(new Luxury(['Cattle',"Healthy livestock that increase population growth by 100%",false],0));
    Luxuries.push(new Luxury(['Hard Wood',"Hard wood forests that increase wood production by 100%",false],0));
    Luxuries.push(new Luxury(['Soft Wood',"Soft wood forests that increase wood production by 100%",false],0));
    Luxuries.push(new Luxury(['Mithril',"Silvery light metal that increases metal production by 100%",false],0));
    Luxuries.push(new Luxury(['Adamantite',"Super strong metal that increases metal production by 100%",false],0));
    // ========================================================================
    // Unit Array
    // ========================================================================
    Units.push(new Unit(["Recruits","Untrained citizen that \nis enlisted to serve.\n   Power: 1\n   Armor: 0",0],[4],[0],1,0));
    Units.push(new Unit(["Soldiers","Recruit who have been given \nsome training with a weapon",0],[5],[0],0,0));
    Units.push(new Unit(["Swordsmen","Soldier who have specialized \nin the use of a sword",0],[],[0],0,0));
    Units.push(new Unit(["Knights","Well armored swordsman who \nhave taken up a shield",0],[],[0],0,0));
    Units.push(new Unit(["Barbarians","Swordsman with a sword \nin each hand and no sense of fear",0],[],[0],0,0));
    Units.push(new Unit(["Spearmen","Soldier who have specialized \nin the use a spear",0],[],[0],0,0));
    Units.push(new Unit(["Pikemen","Spearman who use long pikes \nto fend off attackers from a range",0],[],[0],0,0));
    Units.push(new Unit(["Halberdiers","Spearman who use their \nhalberd to pick apart enemy lines",0],[],[0],0,0));
    Units.push(new Unit(["Archers","Recruit who have trained \nto use a bow",0],[6],[0],0,0));
    Units.push(new Unit(["Rangers","Archer who specialized \nin hitting distant targets",0],[],[0],0,0));
    Units.push(new Unit(["Marksmen","Ranger who specialized \nin firing very rapidly",0],[],[0],0,0));
    Units.push(new Unit(["Longbowmen","Ranger who specialized \nin hitting targets from very far away",0],[],[0],0,0));
    Units.push(new Unit(["Crossbowmen","Archer who use took \nup the crossbow for it's stopping power",0],[],[0],0,0));
    Units.push(new Unit(["Men-At-Arms","Crossbowman who took \nup training with a blade to defend themselves in melee",0],[],[0],0,0));
    Units.push(new Unit(["Snipers","Crossbowman who uses a heavy \ncrossbow to punch through armor",0],[],[0],0,0));
    Units.push(new Unit(["Horsemen","Recruit who learned to ride \na horse into battle",0],[7],[0],0,0));
    Units.push(new Unit(["Cavalry","Horsemen who powerful charge \ncan tear through infantry",0],[],[0],0,0));
    Units.push(new Unit(["Lancers","Cavalry who use lances make \ntheir charge hit like a hammer on the anvil",0],[],[0],0,0));
    Units.push(new Unit(["Paladins","Cavalry with swords allowing \nprolong combat to stay in their favor",0],[],[0],0,0));
    Units.push(new Unit(["Horse Archers","Horsemen who use their \nmount and a bow to pick targets off safely",0],[],[0],0,0));
    Units.push(new Unit(["Skirmishers","Horse archers that are \nalmost impossible to pin down",0],[],[0],0,0));
    Units.push(new Unit(["Hellions","Horse archers that leave \ntheir enemies riddled with arrows",0],[],[0],0,0));
    Units.push(new Unit(["Catapults","A siege weapon used to \nthrow large rocks at distant targets",0],[8],[0],0,0));
    Units.push(new Unit(["Trebuchets","A sling based siege weapon \nthe will leave their targets shocked",0],[],[0],0,0));
    Units.push(new Unit(["Heavy-Trebuchets","A trebuchet that that \nthrows huge boulders to crush entire squads",0],[],[0],0,0));
    Units.push(new Unit(["Scatter-Trebuchets","A trebuchet that \nlay out a large swathe of devastation",0],[],[0],0,0));
    Units.push(new Unit(["Ballistae","A bow-like siege weapon \nthat can punch through most armor with ease",0],[],[0],0,0));
    Units.push(new Unit(["Fire-Ballistae","A ballista that \nleaves it's target ablaze",0],[],[0],0,0));
    Units.push(new Unit(["Cannons","A cannon capable of blowing \nright through armor",0],[],[0],0,0));
    Units.push(new Unit(["Elven-Centurions","Swift and deadly \nelven infantry",0],[],[0],0,0));
    Units.push(new Unit(["Elven-Rangers","Elf archers who \nnever let a single arrow miss its mark",0],[],[0],0,0));
    Units.push(new Unit(["Dwarven-Infantry","Allied dwarves \nwith heavy armor and unflinching resolve",0],[],[0],0,0));
    Units.push(new Unit(["Dwarven-Cannons","The cannon of terrific \npower crafted by dwarves",0],[],[0],0,0));
    Units.push(new Unit(["Evoker","A powerful wizard who used \nthe elements to devastate his opponents",0],[],[0],0,0));
    Units.push(new Unit(["Illusionist","A powerful wizard who \nused trickery and phastasms to devastate his opponents",0],[],[0],0,0));

    Buildings.forEach( i => document.getElementById(`${i.name}`).title = i.desc);
    Resources.forEach( i => document.getElementById(`${i.name}`).title = i.desc);
    Units.forEach( i => document.getElementById(`${i.name}`).title = i.desc);
    Buildings.forEach( i => document.getElementById(`${i.name}`).style.cursor = 'pointer');
    Resources.forEach( i => document.getElementById(`${i.name}`).style.cursor = 'pointer');
    Units.forEach( i => document.getElementById(`${i.name}`).style.cursor = 'pointer');

    document.addEventListener('keydown',shiftD);
    document.addEventListener('keyup',shiftU);
}
function shiftD(e){
    if(e) if(e.shiftKey) shiftOn = true;
    updateUI();
}
function shiftU(e){
    if(e) if(!e.shiftKey) shiftOn = false;
    updateUI();
}
function saveGame(){
    //Load R
    //Load L
    //Load B
}
function loadGame(){

}
function setTab(newTab){
    document.getElementById(tab).style.display = 'none';
    document.getElementById(`${tab}-btn`).style.textDecoration = 'none';
    tab = newTab;
    document.getElementById(tab).style.display = 'flex';
    document.getElementById(`${tab}-btn`).style.textDecoration = 'underline';
}
function bBtnClick(target)
{
    if(!shiftOn) Buildings[target].buy();
    else Buildings[target].sell();
}
// Update GameObjects ~ Runs once per second
function updateValues(){
    Resources.forEach(i => {
        i.update();
    });
    Units.forEach(i => {
        i.update();
    });
}
// Update User Interface ~ Runs once per second and on buy || sell
function updateUI(){
    if(tab === 'Build')Buildings.forEach(i => {
        document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val}`;
        document.getElementById(`${i.name}-btn`).innerHTML = '';
        i.cost.forEach(j => {
            if(shiftOn && i.val !== 0){
                if(j[1]) document.getElementById(`${i.name}-btn`).innerHTML += `+${Math.trunc(j[0] * Math.pow(1.2,i.val-1))} ${Resources[j[1]].name}<br>`;
            }
            else{
                if(j[1]) document.getElementById(`${i.name}-btn`).innerHTML += `${Math.trunc(j[0] * Math.pow(1.2,i.val))} ${Resources[j[1]].name}<br>`;
            }
        });
        if(i.checkCost() && !shiftOn){
            document.getElementById(`${i.name}-btn`).disabled = false;
            document.getElementById(`${i.name}-btn`).style.color = 'black';
            
        }
        else if(i.val > 0 && shiftOn){
            document.getElementById(`${i.name}-btn`).disabled = false;
            document.getElementById(`${i.name}-btn`).style.color = 'red';
        }
        else{
            document.getElementById(`${i.name}-btn`).disabled = true;
            document.getElementById(`${i.name}-btn`).style.color = 'grey';
        }
    });
    Resources.forEach((i) => {
        if(i.delta > 0)document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} (+${i.delta}/sec)`;
        else if(i.delta < 0)document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} (${i.delta}/sec)`;
        else document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val}`;
        if(i.name === 'Land')
        {
            document.getElementById(`${i.name}`).style.display = 'inline';
        }
        else if(i.mods[0] === 99){
            document.getElementById(`${i.name}`).style.display = 'none';
        }
        else if(i.val !== 0 || Buildings[i.mods[0]].val){
            document.getElementById(`${i.name}`).style.display = 'inline';
        }
        else{
            document.getElementById(`${i.name}`).style.display = 'none';
        }
    });
    Units.forEach((i) => {
        if(i.delta > 0)document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} (+${i.delta}/sec)`;
        else if(i.delta < 0)document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} (${i.delta}/sec)`;
        else document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val}`;
        if(!i.mods[0]){
            document.getElementById(`${i.name}`).style.display = 'none';
        }
        else if(i.val !== 0 || Buildings[i.mods[0]].val){
            document.getElementById(`${i.name}`).style.display = 'inline';
        }
        else{
            document.getElementById(`${i.name}`).style.display = 'none';
        }
    });
}




//=====Game Start=====
initGame();
setInterval(updateUI, 100);
setInterval(updateValues, 100);