var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ghost, ghost_running
var ground, invisibleGround, groundImage;
var grim, grimImg

var coin, coinImg

var obstaclesGroup, obstacle1

var shield, shieldImg

var r_shield, r_shieldImg

var oneup, oneupImg

var s_item, sImg
var b_item, bImg

var res
var revive, reviveImg

var c_score
var score
var highscore = localStorage.getItem("myhighscore") || 0


function preload(){
  ghost_running = loadAnimation("ghost.png");
  
  groundImage = loadImage("forest_1.png");
  
  obstacle1 = loadImage("bomb_1.png");
  
  coinImg = loadImage("coin.png")
  
  grimImg = loadImage("grim_reaper.png")
  
  shieldImg = loadImage("force_field.png")
  
  r_shieldImg = loadImage("red_f_field.png")
  
  bImg = loadImage("boost_item.png")
  
  sImg = loadImage("shield_item.png")
  
  reviveImg = loadImage("revive_gold.png")
  
  oneupImg = loadImage("1_up.png")
}

function setup() {
  createCanvas(600, 400);
  
  //create back ground
  back_ground = createSprite(0,230,400,20)
  back_ground.addImage("ground",groundImage);
  back_ground.scale = 0.5
  back_ground.x = back_ground.width / 4;
  
  //create ghost
  ghost = createSprite(100,325,20,50);
  ghost.addAnimation("running", ghost_running);
  ghost.scale = 0.125;
  ghost.setCollider("rectangle", 0, 0, 400,400)
  
  //create invisable ground
  invisibleGround = createSprite(300,360,600,20);
  invisibleGround.visible = false;
  
  //create grim reaper
  grim = createSprite(50,300,20,50)
  grim.addImage("grim_1", grimImg)
  grim.scale = 0.0825
  grim.visible = false
  
  //create shield
  shield = createSprite(100,325,10,20)
  shield.addImage("shield_1", shieldImg)
  shield.scale = 0.125
  shield.lifetime = 150
  
  //create r_shield
  r_shield = createSprite(100,325,10,20)
  r_shield.addImage("shield_2", r_shieldImg)
  r_shield.scale = 0.15
  r_shield.lifetime = 1
  
  //create restart
  res = createSprite(300,200,800,800)
  res.visible = false
  
  //create revive button
  revive = createSprite(320,330,10,20)
  revive.addImage("revive_b", reviveImg)
  revive.scale = 0.045
  revive.visible = false
  
  //create groups
  bombGroup = createGroup();
  coinGroup = createGroup();
  sGroup = createGroup();
  up1Group = createGroup();
  rGroup = createGroup();
  
  c_score = 0
  score = 0
}

function draw() {
  background(180);
  edge = createEdgeSprites();

  if(gameState === PLAY){
   
    //move the back_ground
    back_ground.velocityX = -6;
    
    if (back_ground.x < 0){
      back_ground.x = back_ground.width/ 4;
    }
    
    shield.y = ghost.y
    bombGroup.bounceOff(shield)
    
    r_shield.y = ghost.y
  
    if(bombGroup.isTouching(rGroup))
      {
        rGroup.destroyEach();
        bombGroup.destroyEach();
      }
    
    //scoring
     if(frameCount % 2===0)
    {
      score = score + 1
    
    }
    
    if(score > highscore){
    // Set in-game high score variable to current score
    highscore = score
    // Update text to display new high score
    text("H I G H  S C O R E : " + highscore, 500, 25)
    // Store high score permanently on player's computer
    localStorage.setItem("myhighscore", highscore)
    }
    
    //jump when the space key is pressed
    if(keyDown("space")) {
        ghost.velocityY = -8;
    }
    
    //add gravity
    ghost.velocityY = ghost.velocityY + 0.5
  
    //shield if touching icon
    if(ghost.isTouching(sGroup))
      {
        shields();
      }
    
    //r_shield if touching icon
    if(ghost.isTouching(up1Group))
      {
        r_shields();
      }
    
    //spawn everything
    spawnObstacles();
    coins_1();
    coins_2();
    coins_3();
    shields_items();
    up1();
    
    if(bombGroup.isTouching(ghost)){
        gameState = END;
    }
  }
   else if (gameState === END) {
      back_ground.velocityX = 0;
     
     bombGroup.setVelocityXEach(0);
     bombGroup.setLifetimeEach(-1);
     coinGroup.setVelocityXEach(0);
     coinGroup.setLifetimeEach(-1);
     sGroup.setVelocityXEach(0);
     sGroup.setLifetimeEach(-1);
     up1Group.setVelocityXEach(0);
     up1Group.setLifetimeEach(-1);
     
     ghost.velocityY = 8
     
     grim.visible = true
     revive.visible = true
     startOver();
     revives();
   }
         
 
  //stop trex from falling down
  ghost.collide(invisibleGround);
  ghost.collide(edge[2])
  
  
  drawSprites();
  
  //display coin score
  fill("white")
  stroke("white")
  text("C O I N S : " + c_score, 25,25)
  
  //display acctual score
  fill("white")
  stroke("white")
  text("S C O R E : " + score, 500,50)
  
   //display high score
  
  var highscoretext = new Text();{
  fill("white")
  stroke("white")
  text("H I G H  S C O R E : " + highscore, 450, 25 )
  }
  
  if(gameState === END)
    {
      textSize(30)
      fill("white")
      stroke("white")
      text("G A M E  O V E R", 200,200)
      textSize(15)
      text("(Press Anywhere to try Again)", 220,220)
      text("(Press Enter to Revive (100 Coins))", 200, 290)
    }
}

function spawnObstacles()
{
 if (frameCount % Math.round(random(20,40)) === 0){
   
   var r=random(10,350)
   
   var bomb = createSprite(650,r,10,40);
   
   bomb.velocityX = -6;
   bomb.addImage(obstacle1);
   bomb.setCollider("circle", 0, 0, 95)
   
    //assign scale and lifetime to the obstacle           
    bomb.scale = 0.25;
    bomb.lifetime = 600;
   
   //add each obstacle to the group
    bombGroup.add(bomb);
 }
}


function coins_1()
{
  if (frameCount % 40 === 0)
 {
   var r = random(10,300)
   
    coin = createSprite(600, r, 20, 50)
   
   coin.addImage(coinImg)
   coin.velocityX = -6
    
   //scale and lifetime
   coin.scale = 0.0075
   coin.lifetime = 600
    
   //add coin to the group
   coinGroup.add(coin)
 }
  if(ghost.overlap(coinGroup, getCoin))
    {}
}


function coins_2()
{
  if (frameCount % 40 === 0)
 {
   var r = random(10,300)
   
    coin = createSprite(675, r, 20, 50)
   
   coin.addImage(coinImg)
   coin.velocityX = -6
    
   //scale and lifetime
   coin.scale = 0.0075
   coin.lifetime = 600
    
   //add coin to the group
   coinGroup.add(coin)
 }
  if(ghost.overlap(coinGroup, getCoin))
    {}
}


function coins_3()
{
  if (frameCount % 40 === 0)
 {
   var r = random(10,300)
   
    coin = createSprite(750, r, 20, 50)
   
   coin.addImage(coinImg)
   coin.velocityX = -6
    
   //scale and lifetime
   coin.scale = 0.0075
   coin.lifetime = 600
    
   //add coin to the group
   coinGroup.add(coin)
 }
  if(ghost.overlap(coinGroup, getCoin))
    {}
}


function getCoin(player, coin) 
{
  coin.remove();
  c_score = c_score+1
}


function startOver()
{
  if(mousePressedOver(res))
    {
      gameState = PLAY
      bombGroup.destroyEach()
      coinGroup.destroyEach();
      sGroup.destroyEach();
      up1Group.destroyEach();
      grim.visible = false
      revive.visible = false
      score = 0
      
      //create shield again
      shield = createSprite(100,325,10,20)
      shield.addImage("shield_1", shieldImg)
      shield.scale = 0.125
      shield.lifetime = 150
    }
}


function shields_items()
{
  if(frameCount % Math.round(random(600,800)) === 0)
 {
  var r = random(10,300)
   
  var s_item = createSprite(650, r, 10, 20)
  
  s_item.addImage("shield_2", sImg)
  s_item.velocityX = -6
  
  
  //scale and lifetime
  s_item.scale = 0.05
  s_item.lifetime = 600
   
  //add shield to the group
  sGroup.add(s_item)
 }
}


function shields()
{
  //create shield again
  shield = createSprite(100,ghost.y,10,20)
  shield.addImage("shield_1", shieldImg)
  shield.scale = 0.125
  shield.lifetime = 150
  sGroup.destroyEach();
}


function revives()
{
  if(keyDown("enter") && c_score >= 100)
    {
      gameState = PLAY
      bombGroup.setVelocityXEach(-6)
      coinGroup.setVelocityXEach(-6)
      sGroup.setVelocityXEach(-6)
      grim.visible = false
      revive.visible = false
      
      c_score = c_score - 100
      
      //create shield again
      shield = createSprite(100,325,10,20)
      shield.addImage("shield_1", shieldImg)
      shield.scale = 0.125
      shield.lifetime = 150
    }
}


function up1()
{
  if(frameCount % Math.round(random(700,900)) === 0)
 {
   var r = random(10,300)
   
   var oneup = createSprite(650,r,10,20)
   
   oneup.addImage("1up", oneupImg)
   oneup.velocityX = -6
   
   //scale and lifetime
   oneup.scale = 0.09
   oneup.lifetime = 600
   
   //add oneup to the group
   up1Group.add(oneup)
 }
}


function r_shields()
{
  //create r_shield 
  r_shield = createSprite(100,ghost.y,10,20)
  r_shield.addImage("shield_2", r_shieldImg)
  r_shield.scale = 0.15
  up1Group.destroyEach();
  
  rGroup.add(r_shield)
}