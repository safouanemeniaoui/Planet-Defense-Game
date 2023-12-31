class Enemy {
  constructor(c) {
    this.canvas = c;
    this.x = this.canvas.width * Math.random();
    this.y = 0;
    this.speed = Math.random() * 1.5 + 1;
    this.radius = 40;
    this.frame = 1000 / 10;
    this.timer = 0;
    this.maxLive = 5;
    this.live = Math.ceil(Math.random() * this.maxLive);
    this.free = true;
    this.image = document.getElementById("asteroid");
    this.spriteWidth = 80;
    this.spriteHeight = 80;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.angle = 0;
    this.dests = false;
    this.sound1 = document.getElementById("sound1");
    this.debug = false;
    this.check = false;
  }
  play() {
    this.sound1.currentTime = 0;
    this.sound1.play();
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.translate(this.x, this.y - this.radius);
      context.rotate(this.angle);
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        -this.spriteWidth / 2,
        -this.spriteHeight / 2,
        this.spriteWidth,
        this.spriteHeight
      );
      context.restore();
      if (this.debug && !this.dests) {
        context.fillStyle = "white";
        context.font = "25px Helvetica";
        context.fillText(
          `${this.live}`,
          this.x - 10,
          this.y - this.radius + 10
        );
      }
    }
  }
  update(deltaTime) {
    if (!this.free) {
      this.angle += 0.03;
      if (this.timer > this.frame) {
        this.y += this.speed;
        this.timer = 0;
        if (this.y - this.radius > this.canvas.height) {
          this.reset();
        }
      } else {
        this.timer += deltaTime;
      }
    }
  }
  cols() {
    if (!this.free) {
      this.live--;
      if (this.live <= 0) {
        this.live = Math.ceil(Math.random() * this.maxLive);
        this.dests = true;
        this.play();
      }
    }
  }

  dest(context) {
    if (this.dests) {
      this.frameX++;
      this.draw(context);
    }
    if (this.frameX >= 6) {
      this.reset();
      this.dests = false;
    }
  }

  start() {
    this.free = false;
    this.y = 0;
    this.frameX = 0;
    this.x = this.canvas.width * Math.random();
  }
  reset() {
    this.free = true;
    this.check = false;
  }
}

class Player {
  constructor(c) {
    this.canvas = c;
    this.width = 80;
    this.height = 80;
    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height - this.height;
    this.speed = 20;
    this.image = document.getElementById("player");
    this.timer = 0;
    this.frame = 1000 / 10;
    this.weaponArray = [];
    this.maxWeapon = 30;
    this.maxLive = 5;
    this.live = this.maxLive;
    this.score = 0;
    this.createWeapon();
  }
  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  liveBar(context) {
    context.fillStyle = "yellow";
    context.font = "20px Helvetica";
    context.fillText(`Lives = `, 10, 40);
    for (let i = 0; i < this.live; i++) {
      context.fillRect(90 + i * 15, 25, 10, 20);
    }
  }
  scoreCount() {
    this.score++;
  }
  drawScore(context) {
    context.fillStyle = "white";
    context.font = "20px Helvetica";
    context.fillText(`Score : ${this.score}`, this.canvas.width - 120, 40);
  }
  finish(context) {
    context.fillStyle = "white";
    context.font = "60px Helvetica";
    context.textAlign = "center";
    context.fillText(
      `Game Over`,
      this.canvas.width / 2,
      this.canvas.height / 2 - 100
    );
    context.fillStyle = "yellow";
    context.font = "30px Helvetica";
    context.fillText(
      `Score : ${this.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
  goRight() {
    this.x += this.speed;
    if (this.x + this.width >= this.canvas.width)
      this.x = this.canvas.width - this.width;
  }
  goLeft() {
    this.x -= this.speed;
    if (this.x <= 0) this.x = 0;
  }
  createWeapon() {
    for (let i = 0; i < this.maxWeapon; i++) {
      this.weaponArray.push(new Weapon(this));
    }
  }
  getFreeWeapon() {
    for (let i = 0; i < this.weaponArray.length; i++) {
      if (this.weaponArray[i].free == true) {
        this.weaponArray[i].start();
        return this.weaponArray[i];
      }
    }
  }
  drawWeapon(context) {
    let wp = this.getFreeWeapon();
    if (wp) {
      wp.position(this);
      wp.draw(context);
    }
  }
  handleWeapon(context) {
    for (let i = 0; i < this.weaponArray.length; i++) {
      this.weaponArray[i].draw(context);
      this.weaponArray[i].update();
      if (this.weaponArray[i].y <= 0) {
        this.weaponArray[i].reset();
      }
    }
  }
}

class Weapon {
  constructor(player) {
    this.player = player;
    this.x = this.player.x + this.player.width / 2;
    this.y = this.player.y - this.player.width;
    this.radius = 5;
    this.free = true;
    this.sound3 = document.getElementById("sound3");
  }
  position(player) {
    this.x = player.x + player.width / 2;
    this.y = player.y;
  }
  draw(context) {
    if (!this.free) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = "orange";
      context.fill();
    }
  }
  update() {
    if (!this.free) {
      this.y -= 10;
    }
  }
  reset() {
    this.free = true;
  }
  start() {
    this.free = false;
    this.play();
  }
  play() {
    this.sound3.currentTime = 0;
    this.sound3.play();
  }
}
