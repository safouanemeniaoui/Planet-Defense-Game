const c = document.getElementById("my-canvas");
const ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
ctx.strokeStyle = "white";
ctx.lineWidth = 3;

let enemyArray = [];
let weaponArray = [];
let playerArray = [];
let maxEnemy = 10;
let time = 0;
let timePlayer = 0;
let lastTime = 0;
let show = true;

window.addEventListener("load", () => {
  playerArray.push(new Player(c));
  weaponArray = playerArray[0].weaponArray;

  for (let i = 0; i < maxEnemy; i++) {
    enemyArray.push(new Enemy(c));
  }

  function showEnemyLive() {
    window.addEventListener("keydown", (e) => {
      if (e.key == "d") {
        if (show == true) {
          show = false;
          enemyArray.forEach((e) => {
            e.debug = true;
          });
        } else {
          show = true;
          enemyArray.forEach((e) => {
            e.debug = false;
          });
        }
      }
    });
  }

  function getFreeEnemy(deltaTime) {
    if (time > 2000) {
      time = 0;
      for (let i = 0; i < enemyArray.length; i++) {
        if (enemyArray[i].free) {
          return enemyArray[i];
        }
      }
    } else {
      time += deltaTime;
    }
  }

  function handleEnemy(deltaTime, context) {
    const enemy = getFreeEnemy(deltaTime);
    if (enemy) enemy.start();
    for (let i = 0; i < enemyArray.length; i++) {
      enemyArray[i].update(deltaTime);
      enemyArray[i].draw(context);
    }
  }

  function colission(enemyArray, weaponArray, deltaTime) {
    sumRadius = enemyArray[0].radius + weaponArray[0].radius;
    for (let i = 0; i < enemyArray.length; i++) {
      if (enemyArray[i].free == false) {
        enemyArray[i].dest(ctx);
        for (let j = 0; j < weaponArray.length; j++) {
          if (weaponArray[j].free == false) {
            let dx = enemyArray[i].x - weaponArray[j].x;
            let dy = enemyArray[i].y - weaponArray[j].y - enemyArray[i].radius;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= sumRadius) {
              weaponArray[j].reset();
              enemyArray[i].cols();
            }
          }
        }
      }
    }
  }

  function handlePlayer(context) {
    playerArray.forEach((e) => {
      e.draw(context);
      e.handleWeapon(context);
      if (playerArray.length > 1) {
        playerArray.shift();
      }
    });
  }

  function movePlayer() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
          playerArray[0].goRight();
          break;
        case "ArrowLeft":
          playerArray[0].goLeft();
          break;
        case "ArrowUp":
          playerArray[0].drawWeapon(ctx);
          break;
        case "w":
          playerArray[0].drawWeapon(ctx);
          break;
        default:
          break;
      }
    });
  }

  function playerLives() {
    enemyArray.forEach((e) => {
      if (e.y - e.radius > c.height && !e.check) {
        e.check = true;
        playerArray[0].live--;
      }
    });
  }

  function score() {
    enemyArray.forEach((e) => {
      if (e.dests == true && e.frameX == 1) {
        playerArray[0].score++;
      }
    });
  }

  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, c.width, c.height);
    if (playerArray[0].live > 0) {
      colission(enemyArray, weaponArray, deltaTime);
      handleEnemy(deltaTime, ctx);
      handlePlayer(ctx);
      playerLives();
      score();
      playerArray[0].liveBar(ctx);
      playerArray[0].drawScore(ctx);
    } else {
      playerArray[0].finish(ctx);
    }
    requestAnimationFrame(animate);
  }

  showEnemyLive();
  movePlayer();
  animate(0);
});
