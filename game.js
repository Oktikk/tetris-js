const canvas = document.querySelector('.tetris');
const ctx = canvas.getContext('2d');

const row = 20;
const column = 10;
const sq = 40;
const emptyColor = "white";
const scr = document.querySelector('.score');
let gameOver = false;
let score = 0;
let isTile = false;

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x*sq+2,y*sq+2,sq-4,sq-4);
    // if(color !== emptyColor){
    //    ctx.strokeStyle = "black";
    //    ctx.strokeRect(x*sq,y*sq,sq,sq);
    // }
    // else{
    //     console.log("aaaa");
    //     ctx.strokeStyle = "pink";
    //     ctx.strokeRect(x*sq,y*sq,sq,sq);
    // }
}

let board = [];

for(r=0; r<row; r++){
    board[r] = [];
    for(c=0; c<column; c++){
        board[r][c] = emptyColor;
    }
}

function drawBoard(){
    for(r=0; r<row; r++){
        for(c=0; c<column; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

const tiles = [
    [Z, '#74b9ff'],
    [S, '#a29bfe'],
    [T,'#ffeaa7'],
    [L,'#fab1a0'],
    [J,'#00b894'],
    [O,'#fd79a8'],
    [I,'#fdcb6e']
]




class Tile{
    constructor(tetromino, color){
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = 3;
        this.y = -1;
    }
}

Tile.prototype.fill = function(color){
    for(r=0; r<this.activeTetromino.length; r++){
        for(c=0; c<this.activeTetromino.length; c++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Tile.prototype.draw = function(){
    isTile = true;
    this.fill(this.color);
}

Tile.prototype.unDraw = function(){
    isTile = false;
    this.fill(emptyColor);
}

function randomTile(){
    let r = Math.floor(Math.random()*tiles.length);
    return new Tile (tiles[r][0], tiles[r][1]);
}

let tile = randomTile();

//tile.draw();

Tile.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
    else{
        this.lock();
        tile = randomTile();
    }
}

Tile.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Tile.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Tile.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN+1)%this.tetromino.length];
    let move = 0;

    if(this.collision(0, 0, nextPattern)){
        if(this.x > column/2){
            move = -1;
        }
        else{
            move = 1;
        }
    }

    
    if(!this.collision(move,0,nextPattern)){
        this.unDraw();
        this.x += move;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Tile.prototype.collision = function(x,y,tile){
    for(r=0; r<tile.length; r++){
        for(c=0; c<tile.length; c++){
            if(!tile[r][c]){
                continue;
            }

            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if(newX < 0 || newX >= column || newY >= row){
                return true;
            }
            if(newY < 0){
                continue;
            }
            if(board[newY][newX] != emptyColor){
                return true;
            }
        }
    }
    return false;
}

Tile.prototype.lock = function(){
    for(r=0; r<this.activeTetromino.length; r++){
        for(c=0; c<this.activeTetromino.length; c++){
            if(!this.activeTetromino[r][c]){
                continue;
            }
            if(this.y + r < 0){
                gameOver = true;
                break;
            }
            board[this.y+r][this.x+c] = this.color;
        }
    }
    let addScore = 100;
    let fullRowCount = 0;
    for(r=0; r<row; r++){

        let isRowFull = true;
        for(c=0; c<column; c++){
            isRowFull = isRowFull && (board[r][c] !== emptyColor);
        }
        if(isRowFull){
            fullRowCount += fullRowCount + 1;
            for(y=r; y>1; y--){
                for(c=0; c<column; c++){
                    board[y][c] = board[y-1][c];
                }
            }

            for(c=0; c<column; c++){
                board[0][c] = emptyColor;
            }
            addScore += 100;
        }
    }
    countScore(addScore, fullRowCount);
    
    drawBoard();
}

function countScore(addScore, multiply){
    multiply += 1;
    score += Math.floor((addScore + (time.start / 1000)) * multiply);
    time.level -= score / 10000;
    console.log(time.level);
    scr.innerHTML = "Score: "+score; 
}


document.addEventListener('keydown', control);

function control(event){
    if(event.keyCode == 37){
        tile.moveLeft();
    }
    else if(event.keyCode == 38){
        tile.rotate();  
    }
    else if(event.keyCode == 39){
        tile.moveRight();
    }
    else if(event.keyCode == 40){
        tile.moveDown();
    }
    else if(event.keyCode == 32){
        while(!tile.collision(0,1,tile.activeTetromino)){
            tile.moveDown();
        }
    }

}

time = {start: 0, elapsed: 0, level: 1000};

function drop(now=0){
    time.elapsed = now - time.start;
    if(time.elapsed > time.level){
        tile.moveDown();
        time.start = now;
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}

drop();