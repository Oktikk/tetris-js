const scr = document.querySelector('.score');
const lin = document.querySelector('.lines');
const lvl = document.querySelector('.level');

const scores = [
    100,
    300,
    500,
    800
];
let level = 1;
let score = 0;


function rowScore(lines){
    score += scores[lines-1]*level;
    scr.innerHTML = "Score:&#10;"+score; 
}

function tileDropScore(tileDistance, isHardDrop){
    if(isHardDrop){
        score += tileDistance * 2;
    }
    else{
        score += tileDistance;
    }
    scr.innerHTML = "Score:&#10;"+score; 
}

function increseLevel(lines){
    lin.innerHTML = "Lines:&#10;"+lines;
    if(level > 25){
        return;
    }
    if(lines%10 == 0){
        level++;
        time.level -= 40;
        lvl.innerHTML = "Level:&#10;"+level;
    }
}