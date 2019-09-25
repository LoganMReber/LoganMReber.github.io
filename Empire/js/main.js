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
            if(i[0] > Resources[i[1]].val){flag = false;}
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
                }
                else
                {
                    if(Units[i[0]].val < i[1]*this.val)
                    {
                        flag = false;
                        // break;
                    } 
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
        document.getElementById(`${this.name}-btn`).innerHTML = "";
        this.val++;
        this.cost.forEach( i => {
            Resources[i[1]].val -= i[0];
            if(i[1]){
                i[0] = Math.trunc(i[0] * 1.2);
                document.getElementById(`${this.name}-btn`).innerHTML += `${i[0]} ${Resources[i[1]].name}<br>`;
            }
        });
        document.getElementById(`${this.name}`).innerHTML = `${this.name}: ${this.val}`;
        updateUI();
    }   

    sell(){

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
    }
    update(){
        if(this.mods.length < 3){return;}
        let delta = 0;
        delta += Buildings[this.mods[0]].val * Buildings[this.mods[0]].production[1];
        for(let i = 3; i < this.mods.length;i++){
            Upgrades[mods[i]].update();
            delta = Upgrades[mods[i]].use(delta);
        }
        if(Luxuries[this.mods[1]].val && Luxuries[this.mods[2]].val)
        {
            this.val += delta * 3;
        }
        else if(Luxuries[this.mods[1]].val || Luxuries[this.mods[2]].val)
        {
            this.val += delta * 2;
        }
        else{
            this.val += delta;
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
    constructor(info,mods,type,power,armor){
        super(info,mods);
        this.type = type;
        this.power = power;
        this.armor = armor;
    }
    update(){
        let delta = 0;
        for(let i = 0; i < this.mods.length;i++){
            if(Buildings[this.mods[i]].checkUpkeep()){
                Buildings[this.mods[i]].payUpkeep();
                delta += Buildings[this.mods[0]].val * Buildings[this.mods[0]].production[1];
            }
            if(this.mods[i] > 99)
            {
                Upgrades[this.mods[i-100]].update();
            delta = Upgrades[this.mods[i-100]].use(delta);
            }
            
        }
        this.val += delta;
    }
}

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
    Buildings.push(new Building(["Mines","Produces 10G / sec.",0],[ [1,0],[50,1] ],[[]],[-1,10] ));
    Buildings.push(new Building(["Farms","Increases population growth by 1 person / sec.",0],[ [1,0],[50,1] ],[[]],[-2,1] ));
    Buildings.push(new Building(["Lumberyards","Produces 10 wood / sec.",0],[ [1,0],[100,1] ],[[]],[-3,10] ));
    Buildings.push(new Building(["Forges","Produces 10 metal / sec.",0],[ [1,0],[100,1] ],[[]],[-4,10] ));
    Buildings.push(new Building(["Recruiters","Turns 1 person into 1 recruit.",0],[ [1,0],[100,1] ],[ [-2,1] ],[0,1] ));
    Buildings.push(new Building(["Barracks","Trains 1 recruit into 1 soldier",0],[ [1,0],[250,1] ],[ [0,1] ],[1,1] ));
    Buildings.push(new Building(["Ranges","Trains 1 recruit into 1 archer",0],[ [1,0],[350,1] ],[ [0,1] ],[8,1] ));
    Buildings.push(new Building(["Stables","Trains 1 recruit into 1 horseman",0],[ [1,0],[1000,1] ],[ [0,1] ],[15,1] ));
    Buildings.push(new Building(["Workshops","Trains 5 recruits into 1 catapult",0],[ [1,0],[2500,1] ],[ [0,5] ],[22,1] ));
    // ========================================================================
    // Resources Array
    // ========================================================================
    Resources.push(new Resource(["Land","The unused land that you occupy.",100],[]));
    Resources.push(new Resource(["Gold","Cold hard cash!",200],[0,0,1]));
    Resources.push(new Resource(["People","The citizens of your empire.",1000],[1,2,3]));
    Resources.push(new Resource(["Wood","Used to make building.",50],[2,3,4]));
    Resources.push(new Resource(["Metal","Used to make arms and armor.",0],[3,5,6]));
    Resources.push(new Resource(["Mana","Magical energy used to power spells.",0],[]));
    Resources.push(new Resource(["Living Wood","Wood that grows even after being milled. Elves value it highly.",0],[]));
    Resources.push(new Resource(["Deep Metal","Rare metal used to make the strongest arms and armor. Dwarfs love this stuff!",0],[]));
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
    Units.push(new Unit(["Recruits","Untrained citizen that are enlisted to serve.",0],[4],0,0,0));
    Units.push(new Unit(["Soldiers","Recruit who have been given some training with a weapon",0],[5],0,0,0));
    Units.push(new Unit(["Swordsmen","Soldier who have specialized in the use of a sword",0],[],0,0,0));
    Units.push(new Unit(["Knights","Well armored swordsman who have taken up a shield",0],[],0,0,0));
    Units.push(new Unit(["Barbarians","Swordsman with a sword in each hand and no sense of fear",0],[],0,0,0));
    Units.push(new Unit(["Spearmen","Soldier who have specialized in the use a spear",0],[],0,0,0));
    Units.push(new Unit(["Pikemen","Spearman who use long pikes to fend off attackers from a range",0],[],0,0,0));
    Units.push(new Unit(["Halberdiers","Spearman who use their halberd to pick apart enemy lines",0],[],0,0,0));
    Units.push(new Unit(["Archers","Recruit who have trained to use a bow",0],[6],0,0,0));
    Units.push(new Unit(["Rangers","Archer who specialized in hitting distant targets",0],[],0,0,0));
    Units.push(new Unit(["Marksmen","Ranger who specialized in firing very rapidly",0],[],0,0,0));
    Units.push(new Unit(["Longbowmen","Ranger who specialized in hitting targets from very far away",0],[],0,0,0));
    Units.push(new Unit(["Crossbowmen","Archer who use took up the crossbow for it's stopping power",0],[],0,0,0));
    Units.push(new Unit(["Men-At-Arms","Crossbowman who took up training with a blade to defend themselves in melee",0],[],0,0,0));
    Units.push(new Unit(["Snipers","Crossbowman who uses a heavy crossbow to punch through armor",0],[],0,0,0));
    Units.push(new Unit(["Horsemen","Recruit who learned to ride a horse into battle",0],[7],0,0,0));
    Units.push(new Unit(["Cavalry","Horsemen who powerful charge can tear through infantry",0],[],0,0,0));
    Units.push(new Unit(["Lancers","Cavalry who use lances make their charge hit like a hammer on the anvil",0],[],0,0,0));
    Units.push(new Unit(["Paladins","Cavalry with swords allowing prolong combat to stay in their favor",0],[],0,0,0));
    Units.push(new Unit(["Horse Archers","Horsemen who use their mount and a bow to pick targets off safely",0],[],0,0));
    Units.push(new Unit(["Skirmishers","Horse archers that are almost impossible to pin down",0],[],0,0,0));
    Units.push(new Unit(["Hellions","Horse archers that leave their enemies riddled with arrows",0],[],0,0,0));
    Units.push(new Unit(["Catapults","A siege weapon used to throw large rocks at distant targets",0],[8],0,0,0));
    Units.push(new Unit(["Trebuchets","A sling based siege weapon the will leave their targets shocked",0],[],0,0));
    Units.push(new Unit(["Heavy-Trebuchets","A trebuchet that that throws huge boulders to crush entire squads",0],[],0,0,0));
    Units.push(new Unit(["Scatter-Trebuchets","A trebuchet that lay out a large swathe of devastation",0],[],0,0,0));
    Units.push(new Unit(["Ballistae","A bow-like siege weapon that can punch through most armor with ease",0],[],0,0,0));
    Units.push(new Unit(["Fire-Ballistae","A ballista that leaves it's target ablaze",0],[],0,0,0));
    Units.push(new Unit(["Cannons","A cannon capable of blowing right through armor",0],[],0,0,0));
    Units.push(new Unit(["Elven-Centurions","Swift and deadly elven infantry",0],[],0,0,0));
    Units.push(new Unit(["Elven-Rangers","Elf archers who never let a single arrow miss its mark",0],[],0,0,0));
    Units.push(new Unit(["Dwarven-Infantry","Allied dwarves with heavy armor and unflinching resolve",0],[],0,0,0));
    Units.push(new Unit(["Dwarven-Cannons","The cannon of terrific power crafted by dwarves",0],[],0,0,0));
    Units.push(new Unit(["Evoker","A powerful wizard who used the elements to devastate his opponents",0],[],0,0,0));
    Units.push(new Unit(["Illusionist","A powerful wizard who used trickery and phastasms to devastate his opponents",0],[],0,0,0));
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
function sell(target)
{

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
    for(let i = 0; i < Buildings.length;i++){
        if(Buildings[i].checkCost()){
            document.getElementById(`${Buildings[i].name}-btn`).disabled = false;
        }
        else{
            document.getElementById(`${Buildings[i].name}-btn`).disabled = true;
        }
    }
    Resources.forEach((i) => {
        let delta = '';
        document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} ${delta}`;
        if(i.val !== 0){
            document.getElementById(`${i.name}`).style.display = 'inline';
        }
        else{
            document.getElementById(`${i.name}`).style.display = 'none';
        }
    });
    Units.forEach((i) => {
        let delta = '';
        document.getElementById(`${i.name}`).innerHTML = `${i.name}: ${i.val} ${delta}`;
        if(i.val !== 0){
            document.getElementById(`${i.name}`).style.display = 'inline';
        }
        else{
            document.getElementById(`${i.name}`).style.display = 'none';
        }
    });
}




//=====Game Start=====
initGame();
setInterval(updateUI, 1000);
setInterval(updateValues, 1000);