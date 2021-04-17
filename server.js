var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("server is opened")

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection)
option = {heal: true}
class bullet{
	constructor(state,damage,fx,fy,velx,vely,id,size, option){
		this.state = state
		this.posx = fx
		this.posy = fy
		this.velx = velx
		this.vely = vely
		this.lifetime = 100
		this.damagemult = damage
		this.damage = 0
		this.id = id
		this.size = size
		this.heal = option? option.heal : false
	}
	finished() {
   return( this.lifetime < 0)
  }
	update(){
		this.damage = this.damagemult * 0.1 * (Math.abs(this.velx)+Math.abs(this.vely))
		this.lifetime -=1
		this.posx += this.velx
		this.posy += this.vely
	}
	toString(){
		let ret = {posx: this.posx, posy: this.posy}
		return JSON.stringify(ret)
	}
}

class block{
	constructor(x,y,size){
		this.x = x
		this.y = y
		this.size = size
		this.health = 300
	}
	update(length){
		for(let i = length - 1; i >= 0; i--){
			if(distance2(this.x,this.y,bullets[i].posx,bullets[i].posy) < this.size){
				this.health-= bullets[i].damagemult
				bullets.splice(i,1)
			}
		}
	}
	update2(){
		return(this.health < 0)
	}
}


var blocks = []
var bullets = []
// function serializeBullets(bullets){
// 	let ret = []
// 	for (let i = 0; i < bullets.length; i++){
// 		ret.push(String(bullets[i]))

// 	}
// 	ret = JSON.stringify(bullets)
// 		console.log("ret")
// 		console.log(ret)
// 	return ret
// }

function distance2(x1,y1,x2,y2) {
  var d = Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
  return d;
}
function newConnection(socket){

	console.log(socket.id + ' has connected')

	socket.on('toSer', mouseMSG)
	socket.on('Cshot',MSGshot)
	function MSGshot(shotData) {
				for(let i = bullets.length - 1; i >= 0; i--){
			if(distance2(shotData.p.x,shotData.p.y,bullets[i].posx,bullets[i].posy) < shotData.p.size/2){
				io.sockets.emit('hitplayer',socket.id)
				bullets.splice(i,1)
			}
		}
	for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].finished()) {
      bullets.splice(i, 1);
    }
  }
		if(shotData.p.shoot == true && shotData.p.weaponState == 1){
		bullets.push(new bullet(1,100,shotData.p.x + 400 ,shotData.p.y + 400, shotData.p.shotVectorx * 0.1, shotData.p.shotVectory * 0.1 , shotData.p.id, 10))
		// console.log(bullets)
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == 3){
			for (i = 0; i < 15; i++){
		bullets.push(new bullet(3,8,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx + Math.random() * 50 - 25) * 0.1, (shotData.p.shotVectory + Math.random() * 50 - 25)* 0.1 , shotData.p.id, 10))
						}
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == 4){
		bullets.push(new bullet(4,1,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx + Math.random() * 50 - 25) * 0.03, (shotData.p.shotVectory + Math.random() * 50 - 25)* 0.03 , shotData.p.id, 10))
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == 6){
		bullets.push(new bullet(6,30,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx + Math.random() * 50 - 25) * 0.06, (shotData.p.shotVectory + Math.random() * 50 - 25)* 0.06, shotData.p.id, 10))
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == 0){
		bullets.push(new bullet(0,500,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx) * 0.01, (shotData.p.shotVectory)* 0.01 , shotData.p.id, 50))
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == -1){
		bullets.push(new bullet(-1,100,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx) * 0.03, (shotData.p.shotVectory)* 0.03 , shotData.p.id, 10, {heal: true}))
		}
		if(shotData.p.shoot == true && shotData.p.weaponState == -2){
		bullets.push(new bullet(-2,2,shotData.p.x + 400 ,shotData.p.y + 400, (shotData.p.shotVectorx) * 0.01, (shotData.p.shotVectory)* 0.01 , shotData.p.id, 10, {heal: true}))
		}
		for (let bul of bullets) {
			bul.update()
		}
		if(shotData.p.block == true && shotData.p.weaponState == 2){
		blocks.push(new block(shotData.p.mx,shotData.p.my,30))
		}
		for (let i = blocks.length - 1; i >= 0; i--){
			blocks[i].update(bullets.length)
			if (blocks[i].update2()){
				blocks.splice(i,1)
			}
		}

		var bc = JSON.stringify(bullets)
		var bl = JSON.stringify(blocks)
		io.sockets.emit('BulletClient',bc)
		io.sockets.emit('BlockClient',bl)

		// console.log(bc)
		// console.log("aa")
	}
	function mouseMSG(data) {
		
		socket.broadcast.emit('toClient',data)
		// console.log(socket.id + ' mouse is at ' , mousedata)
		// console.log(data)

	}
	socket.on('disconnect', function(){
		console.log(socket.id)
		io.sockets.emit('deletePlayer',socket.id)
	})
}


