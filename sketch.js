var gameover, gameoverimg
var restart, restartimg
var trex, trexRunning, trexCollided
var ground, groundImg
var invGround
var cloud, cloudIMG, cloudGroup
var cactus, cactusimg1, cactusimg2, cactusimg3, cactusimg4, cactusimg5, cactusimg6, cactusGroup
var score = 0
const PLAY = 0
const END = 1
var gameState = PLAY
var Sdie, Sjump, Sscore,highScore=0

//preload carrega as mídias do jogo
function preload() {
  trexRunning = loadAnimation('./images/trex3.png', "./images/trex4.png")
  groundImg = loadImage("./images/ground2.png")
  cloudIMG = loadImage("./images/cloud.png")
  cactusimg1 = loadImage("./images/obstacle1.png")
  cactusimg2 = loadImage("./images/obstacle2.png")
  cactusimg3 = loadImage("./images/obstacle3.png")
  cactusimg4 = loadImage("./images/obstacle4.png")
  cactusimg5 = loadImage("./images/obstacle5.png")
  cactusimg6 = loadImage("./images/obstacle6.png")
  trexCollided = loadAnimation("./images/trex_collided.png")
  gameoverimg = loadImage("./images/gameOver.png")
  restartimg = loadImage("./images/restart.png")
  Sdie = loadSound("./sounds/die.mp3")
  Sjump = loadSound("./sounds/jump.mp3")
  Sscore = loadSound("./sounds/checkPoint.mp3")
}


//setup faz a configuração
function setup() {
  createCanvas(windowWidth, windowHeight); //600 - 200
  cactusGroup = new Group()
  cloudGroup = new Group()
  //sprite trex
  trex = createSprite(50, height-50, 30, 70)
  trex.addAnimation("running", trexRunning)
  trex.scale = 0.5
  trex.addAnimation("trexCollided", trexCollided)
  // trex.debug=true
  // trex.setCollider("circle",-10,-15,40)
  trex.setCollider("rectangle", 3, -10, 45, 90, 20)
  //sprite Solo
  ground = createSprite(width/2, height-20, 600, 10)
  ground.addImage(groundImg)

  gameover = createSprite(width/2, height/2)
  gameover.addImage(gameoverimg)

  restart = createSprite(width/2, height/2+50,)
  restart.addImage(restartimg)
  restart.scale = 0.5
  invGround = createSprite(width/2, height-10, width, 10)
  invGround.visible = false


}

//draw faz o movimento, a ação do jogo
function draw() {
  background("#ebf5ff");

  if (gameState == PLAY) {
    //pulo do trex
    // console.log("gamestateplay")
    //console.log(Math.round(random(1,5)))
    gameover.visible = false
    restart.visible = false
    
    if ((touches.length>0||keyDown("space")) && trex.y > height-50) {
      trex.velocityY = -10
      Sjump.play()
      touches=[]
    }
    if (ground.x < width/4) {
      ground.x = ground.width / 2
    }
    ground.velocityX = -(2 + 3 * score / 100)
    createClouds()
    createCactus()
    score += Math.round(getFrameRate() / 60)
    if (score % 100 == 0 && score > 0) {
      Sscore.play()
    }
    
    if (trex.isTouching(cactusGroup)) {
      gameState = END
      Sdie.play()
    }

  } else if (gameState == END) {
      gameover.visible = true
      //console.log("gamestateend")
      restart.visible = true
      ground.velocityX = 0
      cactusGroup.setVelocityXEach(0)
      cloudGroup.setVelocityXEach(0)
      trex.changeAnimation("trexCollided")
      cloudGroup.setLifetimeEach(-1)
      cactusGroup.setLifetimeEach(-1)
      if (mousePressedOver(restart)||touches.lenght>0) {
        reset()
        touches=[]
      }
      if(score>highScore){
        highScore=score
      }
  }


  trex.velocityY += 0.5
  trex.collide(invGround)


  fill("black")
  textSize(20)
  text("Score: " + score, width/2+180, height-160)
  text("HighScore: " + highScore, width/2+20, height-160)
  //coordenadas do mouse na tela
  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY)
  drawSprites();

}

function createClouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(width, random(height-200, height-90), 30, 15)
    cloud.velocityX = -3
    cloud.scale = random(0.5, 1.5)
    cloud.addImage(cloudIMG)
    cloud.depth = trex.depth - 1
    cloud.lifetime = width/3
    cloudGroup.add(cloud)
  }

}

function createCactus() {
  if (frameCount % 85 == 0) {
    cactus = createSprite(width+10, height-30, 30, 15)
    cactus.velocityX = -(2 + 3 * score / 100)
    cactus.depth = trex.depth - 1
    var choseCactus = Math.round(random(1, 6))
    switch (choseCactus) {
      case 1:
        cactus.addImage(cactusimg1)
        break;
      case 2:
        cactus.addImage(cactusimg2)
        break;
      case 3:
        cactus.addImage(cactusimg3)
        break;
      case 4:
        cactus.addImage(cactusimg4)
        break;
      case 5:
        cactus.addImage(cactusimg5)
        break;
      case 6:
        cactus.addImage(cactusimg6)
        break;
    }
    cactus.scale = 0.4
    cactus.lifetime = width/cactus.velocityX
    cactusGroup.add(cactus)
  }
}

function reset() {
  gameState = PLAY
  cactusGroup.destroyEach()
  cloudGroup.destroyEach()
  trex.changeAnimation("running")
  score = 0
}





























