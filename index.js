let fighting;
let monsterHealth;

let xp             = 0;
let health         = 100;
let gold           = 50;
let currentWeapon  = 0;
let inventory      = ["bastão"];

const locations    = [
    {
        name: "Praça da cidade",
        "button text":      ["Ir para a loja", "Ir para a caverna", "Lutar com o dragão"],
        "button functions": [goStore, goCave, fightDragon],
        text: "Você está na praça da cidade, você vê uma placa que diz \"loja\""
    },
    {
      name: "Loja",
      "button text":      ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Ir para a cidade"],
      "button functions": [buyHealth, buyWeapon, goTown],
      text: "You enter the store."
    },
    {
        name: "Caverna",
        "button text":      ["Lute contra o lodo", "Lute contra a fera com presas", "Ir para a cidade"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "Você entra na caverna e vê alguns monstros"
    },
    {
        name: "Lutar",
        "button text": ["Atacar", "Desviar", "Ir para a cidade"],
        "button functions": [attack, dodge, goTown],
        text: "Você está lutando contra um monstro"
    },
    {
        name: "Matar monstro",
        "button text": ["Ir para a cidade", "Ir para a cidade", "Ir para a cidade"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'O monstro grita "Arg!" à medida que morre. Você ganha pontos de experiência e encontra ouro.'
    },
    {
        name: "Perdeu",
        "button text": ["Reiniciar?", "Reiniciar?", "Reiniciar?"],
        "button functions": [restart, restart, restart],
        text: "Você morreu. &#x2620;"
    },
    {
        name: "win",
        "button text": ["Reiniciar?", "Reiniciar?", "Reiniciar?"],
        "button functions": [restart, restart, restart],
        text: "Você derrotou o dragon e ganhou o jogo! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "Você encontrou um jogo secreto, escolha um número acima, dez números serão escolhidos aleatóriamente entre 0 e 10. Se o número escolhido corresponder a um dos números aleatório, você ganha!"
    }
    
];

const button1           = document.querySelector("#button1");
const button2           = document.querySelector("#button2");
const button3           = document.querySelector("#button3");
const text              = document.querySelector("#text");
const xpText            = document.querySelector("#xpText");
const healthText        = document.querySelector("#healthText");
const goldText          = document.querySelector("#goldText");
const monsterStats      = document.querySelector("#monsterStats");
const monsterName       = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons           = [ 
    {
      name: "stick",
      power: 5
    },
    {
      name: "dagger",
      power: 30
    },
    {
      name: "claw hammer",
      power: 50
    },
    {
      name: "sword",
      power: 100
    }
];

const monsters        = [

    {name: "slime", level: 2, health: 15},
    {name: "fanged beast", level: 8, health: 60},
    {name: "dragon", level: 20, health: 300}

];


//Botões de inicialização
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {

    monsterStats.style.display = "none";
  
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore () {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold   >= 10) {
        gold   -= 10;
        health += 10;

        goldText.innerText   = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "Você não tem ouro suficiente para comprar saúde."
    }
}

function buyWeapon() {

    if (currentWeapon < weapons.length - 1) {

        if (gold >= 30) {

            gold -= 30;
            currentWeapon++;

            goldText.innerText = gold;
            let newWeapon      = weapons[currentWeapon].name;
            text.innerText     = "Agora você tem uma " + newWeapon + ".";

            inventory.push(newWeapon);

            text.innerText += " Em seu inventário você tem: " + inventory;
        } else {
            text.innerText = "Você não tem ouro o suficiente para comprar uma arma";
        }

    } else {
        text.innerText    = "Você já tem a arma mais podderosa comprada";
        button2.innerText = "Você quer vender sua arma por 15 gold?";
        button2.onclick   = sellWeapon;
    }

}

function sellWeapon () {
    
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();

        text.innerText = "Você vendeu um(a) " + currentWeapon + ".";
        text.innerText += " Agora seu inventário tem: " + inventory;
    } else {
        text.innerText = "Não venda sua única arma!";
    }

}

function fightSlime () {

    fighting = 0;
    goFight();

}

function fightBeast () {
  
    fighting = 1;
    goFight();

}

function fightDragon() {
    fighting = 2;
    goFight();

}

function goFight () {
    update(locations[3]);
    monsterHealth               = monsters[fighting].health;
    monsterName.innerText       = monsters[fighting].name;
    monsterHealthText.innerHTML = monsters[fighting].health;

    monsterStats.style.display  = "block";
}

function attack () {
    text.innerText = "O " + monsters[fighting].name + " ataca.";

    text.innerText += " Você ataca com sua " + weapons[currentWeapon].name + ".";
    health         -= getMonsterAttackValue(monsters[fighting].level);

    if (isMonterHit()) {
        monsterHealth  -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " Você errou."
    }

    healthText.innerText        = health;
    monsterHealthText.innerText = monsterHealth;

    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame()
        } else {
            defeatMonster();
        }
    }


    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Sua " + inventory.pop() + " quebrou.";
        currentWeapon--;
    }

}   

function getMonsterAttackValue (level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log("hit", hit);

    return hit > 0 ? hit : 0;
}

function isMonterHit () {
    return Math.random() > .2 || health < 20;
}

function dodge () {
    text.innerText = "Você evita o ataque do " + monsters[fighting].name;
}

function lose () {
    update(locations[5]);
}

function winGame () {
    update(locations[6]);
}

function defeatMonster () {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp   += monsters[fighting].level;

    goldText.innerText = gold;
    xpText.innerText   = xp;

    update(locations[4]);
}

function restart () {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["Bastão"];

    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
    goTown();
}

function easterEgg () {
    update(locations[7]);
}

function pick (palpite) {
    const numbers = [];

    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "Você escolheu " + palpite + ". Aqui estão os números aleatórios:\n";

    for (var i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
        if (numbers.includes(palpite)) {
            text.innerText     += "Certo! Você ganhou 20 de ouros ";
            gold               += 20;
            goldText.innerText = gold;
        } else {
            text.innerText       += "Errado! Você perdeu 10 de vida ";
            health               -= 10;
            healthText.innerText = health;

            if (health <= 0) {
                lose();
            }
        }
    }
}

function pickTwo () {
    pick(2);
}

function pickEight () {
    pick(8);
}