var p5_started_draw = false;
var socket;
var player1;
var enemies = [];
var data_client;
var bc_client;
var bl_client;
var playerLeftArray = [];
var img1;
var img2;
class player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.mx = mouseX
    this.my = mouseY
    this.weaponState = 1
    this.speed = 5
    this.size = 50
    this.cantpress = 0
    this.reload = 0
    this.reloadTime= 50
    this.shoot = false
    this.health = 500
    this.block = false
    this.shotVectorx = 0
    this.shotVectory = 0
    this.burnTime = 0
  }
  // updateid(id){
  //   if (typeof id != 'undefined') {
  //    this.id = id
  //   }
  // }

  move(){
    this.mx = this.x + mouseX
    this.my = this.y + mouseY
  if(keyIsDown(87)){this.y -= this.speed};
  if(keyIsDown(83)){this.y += this.speed};
  if(keyIsDown(65)){this.x -= this.speed;};
  if(keyIsDown(68)){this.x += this.speed;};  return this
}
shootC(){
  this.shotVectorx = mouseX - width/2
  this.shotVectory = mouseY  - height/2
  if(this.weaponState == 1){

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("bang")
    this.shoot = true
    this.reloadTime = 25
    this.reload += this.reloadTime
    // this.shoot2 = false;
  }
  } else if(this.weaponState == 2){
      if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("boop")
    this.block = true
    this.reloadTime = 100
    this.reload += this.reloadTime
    // this.shoot2 = false;
  }
  } else if(this.weaponState == 3) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("SHVBANGGG")
    this.shoot = true
    this.reloadTime = 50
    this.reload += this.reloadTime
  }
} else if(this.weaponState == 4) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("ffff")
    this.shoot = true
    this.reloadTime = 2
    this.reload += this.reloadTime
  }
}
   else if(this.weaponState == 6) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("fbb")
    this.shoot = true
    this.reloadTime = 8
    this.reload += this.reloadTime
  }
} else if(this.weaponState == 0) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("BOOM")
    this.shoot = true
    this.reloadTime = 200
    this.reload += this.reloadTime
  }
} else if(this.weaponState == -1) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("bzzz")
    this.shoot = true
    this.reloadTime = 50
    this.reload += this.reloadTime
  }
}
 else if(this.weaponState == -2) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("hhhhh")
    this.shoot = true
    this.reloadTime = 2
    this.reload += this.reloadTime
  }
} else if(this.weaponState == -3) {

  if(this.reload > 0){this.reload -= 1}
  if(mouseIsPressed && this.reload < 1){
    console.log("gulp")
    if(this.health < 500 && this.burnTime < 1){
    this.health += 1;
  } else if (this.burnTime > 0) {
    this.burnTime -= 1
  }
  }
}


}

distance2(x1,y1,x2,y2) {
  var d = Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
  return d;
}

draw(){

  if(keyIsDown(81) && this.cantpress < 1){this.weaponState --; this.cantpress = 10};
  if(keyIsDown(69) && this.cantpress < 1){this.weaponState ++; this.cantpress = 10};
  this.cantpress --


  if(this.burnTime > 0){
    this.health -= 0.3
    this.burnTime -= 1
  }


  fill(255)
  textSize(25)
  text(this.weaponState,this.x + 410,this.y + 340)
  text(int(this.x),this.x + 300,this.y + 340)
  text(int(this.y),this.x + 300,this.y + 310)
  fill(255-(this.health / 500 * 255),this.health / 500 * 255,0)
  rect(this.x + 350,this.y + 350,this.health / 255 * 50,10)
  text(int(this.health),this.x + 370,this.y + 460)
  fill(255,255-this.burnTime/2,255-this.burnTime)
  ellipse(this.x + width/2,this.y + height/2,this.size,this.size)
  if (this.health < 0) {
    fill(255,0,0)
    stroke(200,0,0)
    textSize(100)
    text('YOU DIED',this.x+100,this.y + 350)
    fill(0,255,0)
    rect(700 + this.x,700 + this.y,100,100)
    if (mouseIsPressed && mouseX > 700 && mouseY > 700 && mouseX < width && mouseY < height){
      this.health = 500
    }
  }
}
}
function preload(){
  img1 = loadImage('background2.png')
  img2 = loadImage('fire1.png')
}
function setup() {

  createCanvas(800,800);
  // background(25)
  socket = io.connect('/');
  socket.on('connect', () => {
    player1 = new player(socket.id)
    p5_started_draw = true
  });
  socket.on('toClient',cloned);
  socket.on('BulletClient',cloned2);
  socket.on('BlockClient',cloned3);
  socket.on('deletePlayer',deletePlayer);
}


function draw(){
  if (p5_started_draw) {


    // console.log( mouseY - player1.y - height/2)
    background(25)

    // player1.updateid(socket.id)
    

   
    var px2 = player1.x + width/2
    var py2 = player1.y + height/2
    translate(-player1.x,-player1.y)
    image(img1,-2438.5,-900,5337,2502)
    // console.log( mouseX,player1.x - 400)
    if(player1.health > 0){
      if(player1.weaponState != -3){
     player1.move()}
    player1.shootC();
  }
      bullet_data()
      block_data()
      for(let i = 0; i <3; i++){
    draw_data()
  }
    player1.draw()
      var data = {
       x: player1.x,
       y: player1.y,
       p: player1
    }
    var shotData = {
      p: player1
    }
    socket.emit('toSer', data)
    socket.emit('Cshot', shotData)

    player1.shoot = false;
    player1.block = false;
  }
}

function mouseDragged(){
}


// function cloned(data) {
//   ellipse(data.p.x,data.p.y,data.p.size+300)
//   console.log(data.p.size)
// }


function cloned(data) {
  data_client = data
}
function cloned2(bc) {
  bc_client = bc
  // console.log(bc.length)
  // console.log("aaa")
}
function cloned3(bl){
  bl_client = bl
}


function bullet_data() {
  // console.log(bc_client)
  if (typeof bc_client != 'undefined') {
    // console.log(bc_client) 
    let bullets = JSON.parse(bc_client)
    // console.log(bullets[0])
    for (let i = 0; i < bullets.length; i++){
      fill(255,255,0)
      // console.log(player1.id)
      if(bullets[i].state == 4){image(img2,bullets[i].posx-5,bullets[i].posy-5)
        fill(255,bullets[i].lifetime * 255 / 100,0,bullets[i].lifetime)
        noStroke()
        ellipse(bullets[i].posx,bullets[i].posy,bullets[i].size*2)
        fill(255,bullets[i].lifetime * 255 / 100,0,20)
        ellipse(bullets[i].posx,bullets[i].posy,bullets[i].size*5)
        stroke(0)
      }
        else{
      ellipse(bullets[i].posx,bullets[i].posy,bullets[i].size)}
      if (Math.sqrt(Math.pow(player1.x-bullets[i].posx + 400, 2)+Math.pow(player1.y-bullets[i].posy + 400, 2)) < player1.size + bullets[i].size/2&& bullets[i].id != player1.id){
        
        if(bullets[i].heal == false){
          if(bullets[i].state == 4 && player1.burnTime < 255){        
            player1.burnTime += 2
          }
          player1.health -= bullets[i].damage * 0.1
          player1.x += bullets[i].velx * 0.1
          player1.y += bullets[i].vely * 0.1
      } else if(bullets[i].heal == true) {
        if (player1.health < 600){
        player1.health += bullets[i].damage
      }
    }
    }
    }
  }
}
function block_data() {
  if (typeof bl_client != 'undefined') {
    let blocks = JSON.parse(bl_client)
    for (let i = 0; i < blocks.length; i++){
      fill(100)
      ellipse(blocks[i].x,blocks[i].y,blocks[i].size * 2)
    }
  }
}

// function draw_data() {
//   if (typeof data_client != 'undefined') {
//       fill(data_client.health / 500 * -255,data_client.health / 500 * 255,0)
//   rect(data_client.x + 350,data_client.y + 350,data_client.health / 255 * 50,10)
//     fill(255,240,240)
//     ellipse(data_client.p.x + width/2 ,data_client.p.y + width/2,data_client.p.size) 
//       // console.log(data_client.p.x + width/2)
//   }
// }

function draw_data() {

  if (typeof data_client != 'undefined') {
  // console.log(data_client.p.id)
      let current_enemy_id = data_client.p.id
      let is_enemy_exist = update_enemy(current_enemy_id, data_client)
      if (!is_enemy_exist) add_enemy(current_enemy_id, data_client)
          draw_all_enemies()
  }


}

function  draw_all_enemies() {
  // console.log(enemies.length)
  // debugger
  for (let i = enemies.length - 1; i >= 0; i--) {
    // console.log(enemies[i].id)
    draw_enemy(enemies[i])
  }
}

function update_enemy(current_enemy_id, enemy_data){
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].id == current_enemy_id) {
      enemies[i].enemy_data = enemy_data
      return true
    }
  }
  return false
}

function add_enemy(current_enemy_id, enemy_data) {
  if(playerLeftArray.length > 0){
    let i2 = false;
for(let i = 0;i < playerLeftArray.length; i++){
  // console.log(current_enemy_id,playerLeftArray[i])
  if(current_enemy_id == playerLeftArray[i]){
      // console.log(current_enemy_id,playerLeftArray[i])
      i2 = true
    } 
  }
  if(i2 == false){
    enemies.push({id: current_enemy_id, enemy_data: enemy_data})
  }
} else {
  enemies.push({id: current_enemy_id, enemy_data: enemy_data})
}
}

function draw_enemy(enemy) {
  let enemy_data = enemy.enemy_data
      fill(255-(enemy_data.p.health / 500 * 255),enemy_data.p.health / 500 * 255,0)
  rect(enemy_data.p.x + 350,enemy_data.p.y + 350,enemy_data.p.health / 255 * 50,10)
    fill(255,255-enemy_data.p.burnTime/2,255-enemy_data.p.burnTime)
    ellipse(enemy_data.p.x + width/2 ,enemy_data.p.y + height/2,enemy_data.p.size)
    if (player1.weaponState == 5){ 
    stroke(255)
    line(enemy_data.p.x+ width/2,enemy_data.p.y + height/2,player1.x+ width/2,player1.y + height/2)
}else{stroke(0)}}

function deletePlayer(deletePlayer_event_data){
  // debugger
  console.log(deletePlayer_event_data)
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].id == deletePlayer_event_data) {
      enemies.splice(i,1)
      playerLeftArray.push(deletePlayer_event_data)
    }
  }
}