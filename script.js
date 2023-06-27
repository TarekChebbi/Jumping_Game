const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");
//aswwatt
let scoreSFX = new Audio("https://archive.org/download/classiccoin/classiccoin.wav");
let gameOverSFX = new Audio("https://archive.org/download/smb_gameover/smb_gameover.wav");
let jumpSFX = new Audio("https://archive.org/download/jump_20210424/jump.wav");

//des functions
let player = null;
let score = 0;
//béch najjm nchouf élli yal3eb 3mal 10 score o5ra walla la
let scoreIncrement = 0;
let arrayBlocks = [];
//ywallo yesr3o ki tfot l'intervale 10 fi score
let enemySpeed = 5;
//matnajmch ta3ml score akther mn 1 fi wa9t mo3ayn
let canScore = true;
//esta3meltha béch nrakka7 lintervalle 'setInterval'
let presetTime = 1000;

function startGame() {
    player = new Player(150,350,50,"black");
    arrayBlocks = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 5;
    canScore = true;
    presetTime = 1000;
}

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//yrajja3 'true' ki yetdharbo fi b3adhhom ezouz
function squaresColliding(player,block){
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    //ma na7tajich perfect estidam detection
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x>s2.x+s2.size || //R1 droit de  R2
        s1.x+s1.size<s2.x || //R1 gauche de  R2
        s1.y>s2.y+s2.size || //R1 ta7t R2
        s1.y+s1.size<s2.y //R1 fo9 R2
    )
}

//yrajja3 'true' ken lplayer féét el block
function isPastBlock(player, block){
    return(
        player.x + (player.size / 2) > block.x + (block.size / 4) && 
        player.x + (player.size / 2) < block.x + (block.size / 4) * 3
    )
}

class Player {
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.jumpHeight = 12;
        //3 hadhoma 3mathom lel configuration ta33 jump
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;
        //l'animation ta3 spin
        this.spin = 0;
        //90 degrée rotation 
        this.spinIncrement = 90 / 32;
    }
    draw() {
        this.jump();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
        //rest lel rotation béch rotation ta3 les élements lo5rin ma yetbaddloch
        if(this.shouldJump) this.counterRotation();
    }
    jump() {
        if(this.shouldJump){
            this.jumpCounter++;
            if(this.jumpCounter < 15){
                //béch yetal3 el fog
                this.y -= this.jumpHeight;
            }else if(this.jumpCounter > 14 && this.jumpCounter < 19){
                this.y += 0;
            }else if(this.jumpCounter < 33){
                //béch yahbet loota
                this.y += this.jumpHeight;
            }
            this.rotation();
            //cycle yekmell lahna
            if(this.jumpCounter >= 32){
                //reset spin béch ta7der ljump o5ra
                this.counterRotation();
                this.spin = 0;
                this.shouldJump = false;
            }
        }    
    }   
    rotation() {
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);
        //divisions béch tbaddel degrée lel radians
        ctx.rotate(this.spin * Math.PI / 180);
        ctx.rotate(this.spinIncrement * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
        this.spin += this.spinIncrement;
    }

    counterRotation() {
        //hadhi tdawér el cube normale béch ynajjem t7arrko 3aadi
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);
        ctx.rotate(-this.spin * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
    }

}

class AvoidBlock {
    constructor(size, speed){
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = "red";
        this.slideSpeed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
    
}



//les blocks yjoo automatiquement
function generateBlocks() {


    let timeDelay = randomInterval(presetTime);
    arrayBlocks.push(new AvoidBlock(50, enemySpeed));


    setTimeout(generateBlocks, timeDelay);
}

function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if(Math.random() < 0.5){
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    }else{
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

function drawBackgroundLine() {
    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.lineTo(600,400);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 280 - xOffset, 100);
}

function shouldIncreaseSpeed() {
    //béch tchoof game speed yelzem yetla3 walla
        if(scoreIncrement + 10 === score){
            scoreIncrement = score;
            enemySpeed++;
            presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;
            //Update speed 
            arrayBlocks.forEach(block => {
                block.slideSpeed = enemySpeed;
            });
            console.log("Speed increased");
        }
}


let animationId = null;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Canvas 
    drawBackgroundLine();
    drawScore();
    player.draw();

    shouldIncreaseSpeed();

    arrayBlocks.forEach((arrayBlock, index) => {
        arrayBlock.slide();
        //yetdharbo player w el enemy lo3ba tekmell
        if(squaresColliding(player, arrayBlock)){
            gameOverSFX.play();
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
        }
        //lel score yziid
        if(isPastBlock(player, arrayBlock) && canScore){
            canScore = false;
            scoreSFX.currentTime = 0;
            scoreSFX.play();
            score++;
            
        }

        //nafassa5 les block elli déja t3addo
        if((arrayBlock.x + arrayBlock.size) <= 0){
            setTimeout(() => {
                arrayBlocks.splice(index, 1);
            }, 0)
        }
    });
    
    
}
startGame();
animate();
setTimeout(() => {
    generateBlocks();
}, randomInterval(presetTime))
//sooot les évenement ta3oo
addEventListener("keydown", e => {
    if(e.code === 'Space'){
        if(!player.shouldJump){
            jumpSFX.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
});
function restartGame(button) {
    card.style.display = "none";
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}