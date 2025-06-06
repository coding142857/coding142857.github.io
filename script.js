// 貪吃蛇遊戲

// 變數設定

// 偵測螢幕大小
var the_screen = {
    old: { width: "", height: "" },
    now: { width: "", height: "" },
}

// 鍵盤事件
var key_up = 'ArrowUp';
var key_left = 'ArrowLeft';
var key_down = 'ArrowDown';
var key_right = 'ArrowRight';
var the_key = "";

// 背景
var game_position = document.querySelector("#screen_info");
var snake_body_color;
var bg_screen;
var bg_row;
var bg_col;
var bg_block;

// 蛇
var snake_position = { x: 5, y: 11 };
var snake_self = new Map();
var snake_self_pop;
var snake_div;
var snake_index;
var foot_stop = 0;
var snake_v = { xv: 0, yv: 0 };
var snake_score = 0;
var speed = 0.2;
var eye_left_top = 0.4;
var eye_right_bottom = 1.2;
var snake_body_width;
var snake_body_height;
var snake_body_length;
var snake_step = 3;

// 初始化身體
snake_self.set('foot', { x: 3, y: 11 });
snake_self.set(1, { x: 4, y: 11 });
snake_self.set('head', { x: 5, y: 11 });

// 食物
var foods_list = new Map();
var max_food = 10;

// 遊戲運行
var loop;
var running = false;
var score_text;
var PDX;
var PDY;
var PUX;
var PUY;
var PC;

// function

// 運算函數
// 四捨五入=>小數點下一位
function round(number) {
    return Math.round(number * 10) / 10
}

// 包含兩數 取隨機
function randint(a, b) {
    return Math.floor(Math.random() * (Math.abs(a - b) + 1)) + 1;
}

// 蛇

// 繪製身體
function draw_snake() {
    snake_div = document.querySelector("#snake");
    snake_body_color = 200 + snake_step * 10;
    snake_self.forEach(
        (value, key, map) => {
            switch (key) {
                case "foot":
                    snake_body_length = 0;
                    break;
                case 1:
                    snake_div.appendChild(
                        draw_snake_body(
                            value.x,
                            value.y,
                            map.get("foot").x,
                            map.get("foot").y,
                            "foot"
                        )
                    )
                    break;
                case "head":
                    snake_div.appendChild(
                        draw_snake_body(
                            map.get("head").x,
                            map.get("head").y,
                            map.get(map.size - 2).x,
                            map.get(map.size - 2).y,
                            `head`
                        )
                    )
                    break;
                default:
                    snake_div.appendChild(
                        draw_snake_body(
                            map.get(key).x,
                            map.get(key).y,
                            map.get(key - 1).x,
                            map.get(key - 1).y,
                            `body-${key}`
                        )
                    )
                    break;
            }
            if (snake_body_length != undefined) {
                snake_body_color -= snake_body_length * 10;
            }
        }
    )
}

// 回傳身體段
function draw_snake_body(x1, y1, x2, y2, tag) {
    game_position = document.querySelector("#screen_info");
    var snake_body = document.createElement("div");
    snake_body.classList.add("snake_body");
    snake_body.style["left"] = `calc(${Math.min(x1, x2) * 2 - 2}rem + ${game_position.offsetLeft}px)`;
    snake_body.style["top"] = `calc(${Math.min(y1, y2) * 2 - 2}rem + ${game_position.offsetTop}px)`;
    snake_body_width = round(Math.abs(x1 - x2));
    snake_body.style["width"] = `${1.8 + (snake_body_width) * 2}rem`;
    snake_body_height = round(Math.abs(y1 - y2));
    snake_body.style["height"] = `${1.8 + (snake_body_height) * 2}rem`;
    snake_body_length = snake_body_width + snake_body_height;
    if (x1 > x2) D = 'right';
    else if (x1 < x2) D = 'left';
    else if (y1 < y2) D = 'top';
    else if (y1 > y2) D = 'bottom';
    snake_body.id = tag;
    snake_body.style.backgroundImage = `linear-gradient(to ${D}, 
    hsl(${(snake_body_color + 5) % 360}, 100%, 70%), 
    hsl(${(snake_body_color - 5 - snake_body_length * 10) % 360}, 100%, 70%))`;
    return snake_body;
}

// 整體重置
function snake_reset() {
    snake_div = document.querySelector("#snake");
    snake_div.innerHTML = "";
    if (snake_position.x % 1 === 0 && snake_position.y % 1 === 0) {
        snake_self.set(snake_self.size - 1, {
            x: snake_position.x,
            y: snake_position.y
        });
    }
    snake_self.set("head", {
        x: snake_position.x,
        y: snake_position.y
    });
    if (foot_stop === 0) {
        if (snake_self.get(1).x > snake_self.get("foot").x) {
            snake_self.set("foot", { x: snake_self.get("foot").x + speed, y: snake_self.get("foot").y + 0 })
        } else if (snake_self.get(1).x < snake_self.get("foot").x) {
            snake_self.set("foot", { x: snake_self.get("foot").x - speed, y: snake_self.get("foot").y + 0 })
        } else if (snake_self.get(1).y > snake_self.get("foot").y) {
            snake_self.set("foot", { x: snake_self.get("foot").x + 0, y: snake_self.get("foot").y + speed })
        } else if (snake_self.get(1).y < snake_self.get("foot").y) {
            snake_self.set("foot", { x: snake_self.get("foot").x + 0, y: snake_self.get("foot").y - speed })
        }
        if (snake_self.get(1).x === snake_self.get("foot").x && snake_self.get(1).y === snake_self.get("foot").y) {
            snake_self.delete(1);
        }
    } else {
        foot_stop--;
        snake_step += speed;
        snake_step = round(snake_step);
    }
    snake_self_pop = new Map();
    snake_self_pop.set("foot", snake_self.get("foot"));
    var index = 1;
    for (i = 1; i <= snake_self.size; i++) {
        snake_index = snake_self.get(i);
        if (snake_index != undefined) {
            snake_self_pop.set(index, snake_index);
            index++;
        }
    }
    snake_self_pop.set("head", snake_self.get("head"));
    snake_self.clear();
    snake_self_pop.forEach((value, key) => {
        value.x = round(value.x);
        value.y = round(value.y);
        snake_self.set(key, value);
    });
    draw_snake();
    eye_number = 1;
    if (snake_v.xv > 0 || snake_v.yv > 0) {
        draw_eye(eye_right_bottom, eye_right_bottom, eye_number++);
    }
    if (snake_v.xv > 0 || snake_v.yv < 0) {
        draw_eye(eye_right_bottom, eye_left_top, eye_number++);
    }
    if (snake_v.xv < 0 || snake_v.yv > 0) {
        draw_eye(eye_left_top, eye_right_bottom, eye_number++);
    }
    if (snake_v.xv < 0 || snake_v.yv < 0) {
        draw_eye(eye_left_top, eye_left_top, eye_number++);
    }
}

// 眼睛更新
function draw_eye(x, y, eyes) {
    eye = document.querySelector(`#eye${eyes}`);
    snake_head = document.querySelector("#head");
    eye.style.left = `calc(${game_position.offsetLeft}px + ${x + (snake_position.x - 1) * 2}rem)`;
    eye.style.top = `calc(${game_position.offsetTop}px + ${y + (snake_position.y - 1) * 2}rem)`;
}

// 食物

// 更新食物
function draw_food(key, x, y) {
    try {
        var foods = document.querySelector(`#food${key}`);
        foods.style.left = `calc(${(x - 1) * 2}rem + ${game_position.offsetLeft}px)`;
        foods.style.top = `calc(${(y - 1) * 2}rem + ${game_position.offsetTop}px)`;
    } catch (error) { }
}

// 畫食物
function food_reset() {
    foods_list.forEach(
        (value, key) => {
            draw_food(key, value.x, value.y)
        }
    )
}

// 食物重置
function set_foods(tag) {
    try { document.querySelector(`#food${tag}`).remove(); } catch (error) { }
    foods = document.createElement("div");
    foods.classList.add("foods");
    random_food = true;
    while (random_food) {
        x = randint(1, 21);
        y = randint(1, 21);
        in_snake = false;
        snake_self.forEach((value) => {
            if (Math.round(value.x) === x && Math.round(value.y) === y) {
                in_snake = true;
            }
        })
        if (!in_snake) {
            random_food = false;
        }
    }
    foods.style.left = `calc(${(x - 1) * 2}rem + ${game_position.offsetLeft}px)`;
    foods.style.top = `calc(${(y - 1) * 2}rem + ${game_position.offsetTop}px)`;
    foods.id = `food${tag}`
    foods_list.set(tag, { x: x, y: y });
    document.querySelector("#foods").appendChild(foods);
}

// 背景重置
function bg_reset() {
    bg_screen = document.querySelector("#screen");
    game_position = document.querySelector("#screen_info");
    for (bg_row = 0; bg_row < 21; bg_row++) {
        for (bg_col = 0; bg_col < 21; bg_col++) {
            bg_block = document.createElement("div");
            try { document.querySelector(`#bg_${bg_row * 21 + bg_col}`).remove(); } catch (error) { }
            bg_block.id = `bg_${bg_row * 21 + bg_col}`;
            if ((bg_row + bg_col) % 2 === 0) {
                bg_block.classList.add("block1");
            } else {
                bg_block.classList.add("block2");
            }
            bg_block.style.left = `calc(${bg_row * 2}rem + ${game_position.offsetLeft}px)`;
            bg_block.style.top = `calc(${bg_col * 2}rem + ${game_position.offsetTop}px)`;
            bg_screen.appendChild(bg_block);
        }
    }
    draw_snake();
    draw_eye(eye_right_bottom, eye_left_top, 1);
    draw_eye(eye_right_bottom, eye_right_bottom, 2);
}

// 主程式迴圈
function gameLoop() {
    foods_list.forEach((value, key) => {
        if (value.x === Math.round(snake_position.x) && value.y === Math.round(snake_position.y)) {
            foot_stop += 1 / speed;
            set_foods(key);
            snake_score += 1;
        }
    })
    the_screen.now.width = document.documentElement.clientWidth;
    the_screen.now.height = document.documentElement.clientHeight;
    if (the_screen.old.width != the_screen.now.width ||
        the_screen.old.height != the_screen.now.height
    ) {
        bg_reset();
    }
    the_screen.old.width = document.documentElement.clientWidth;
    the_screen.old.height = document.documentElement.clientHeight;
    if (snake_position.x % 1 === 0 && snake_position.y % 1 === 0) {
        if (the_key != "") {
            switch (the_key) {
                case 'w':
                    if (snake_v.yv != speed) {
                        snake_v.yv = -speed;
                        snake_v.xv = 0;
                    }
                    break;
                case 'a':
                    if (snake_v.xv != speed) {
                        snake_v.yv = 0;
                        snake_v.xv = -speed;
                    }
                    break;
                case 's':
                    if (snake_v.yv != -speed) {
                        snake_v.yv = speed;
                        snake_v.xv = 0;
                    }
                    break;
                case 'd':
                    if (snake_v.xv != -speed) {
                        snake_v.yv = 0;
                        snake_v.xv = speed;
                    }
                    break;
            }
            the_key = "";
        }
    }
    snake_position.x += snake_v.xv;
    snake_position.y += snake_v.yv;
    snake_position.x = round(snake_position.x);
    snake_position.y = round(snake_position.y);
    snake_reset();
    food_reset();
    score_text = document.querySelector(".score_text");
    score_text.innerHTML = snake_score;
    snake_self.forEach(
        (value, key, map) => {
            switch (key) {
                case "head":
                case "foot":
                case map.size - 2:
                    break;
                default:
                    if (Math.round(value.x) === Math.round(snake_position.x + (snake_v.xv / speed) * 0.4) &&
                        Math.round(value.y) === Math.round(snake_position.y + (snake_v.yv / speed) * 0.4)) {
                        restart();
                        window.alert(`You die , your scores is ${snake_score}.`);
                        window.alert(`Press [space] to restart the game.`);
                        snake_reset();
                        bg_reset();
                    }
                    break;
            }
        }
    )
    if (snake_position.x < 1 ||
        snake_position.x > 21 ||
        snake_position.y < 1 ||
        snake_position.y > 21) {
        restart();
        window.alert(`You die , your scores is ${snake_score}.`);
        window.alert(`Press [space] to restart the game.`);
        snake_reset();
        bg_reset();
    }
    if (snake_score >= 50) {
        restart();
        window.alert(`You win , your scores is ${snake_score}.`);
        window.alert(`Press [space] to restart the game.`);
        snake_reset();
        bg_reset();
    }
}

// 資料重置
function restart() {
    snake_v = { xv: 0, yv: 0 };
    snake_position = { x: 5, y: 11 };
    snake_self.clear();
    snake_self.set('foot', { x: 3, y: 11 });
    snake_self.set(1, { x: 4, y: 11 });
    snake_self.set('head', { x: 5, y: 11 });
    snake_step = 3;
    speed = 0.2
    running = false;
    snake_score = 0;
    window.clearInterval(loop);
    
}

// 遊戲開始
function game_start() {
    if (!running) {
        running = true;
        the_key = "d";
        snake_v.xv = speed;
        loop = setInterval(gameLoop, 50);
        if (!PC) {
            document.addEventListener("touchstart", (event) => {
                PDX = event.touches[0].clientX;
                PDY = event.touches[0].clientY;
            }, false);
            document.addEventListener("touchmove", (event) => {
                if (PDX && PDY) {
                    PUX = event.touches[0].clientX;
                    PUY = event.touches[0].clientY;

                    PXV = PDX - PUX;
                    PYV = PDY - PUY;

                    if (Math.abs(PXV) > Math.abs(PYV)) {
                        if (PXV > 0) { the_key = 'a' }
                        else { the_key = 'd' }
                    } else {
                        if (PYV > 0) { the_key = 'w' }
                        else { the_key = 's' }
                    }

                    PDX = null;
                    PDY = null;
                }
            }, false);
        }
    }
}

// 遊戲初始化
function game_init() {
    PC = !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (PC) {
        document.documentElement.style.fontSize = "14px";
        document.addEventListener(
            'keydown', (event) => {
                key = event.key;
                switch (key) {
                    case 'w':
                    case key_up:
                        the_key = "w";
                        break;
                    case 'a':
                    case key_left:
                        the_key = "a";
                        break;
                    case 's':
                    case key_down:
                        the_key = "s";
                        break;
                    case 'd':
                    case key_right:
                        the_key = "d";
                        break;
                    case ' ':
                        game_start();
                        break;
                    default:
                        the_key = "";
                        break;
                }
            }
        )
    } else {
        document.documentElement.style.fontSize = "7.1px";
        document.addEventListener('click', game_start, false);
    }
    bg_reset();
    for (let index = 0; index < max_food; index++) {
        set_foods(index);
    }

}

game_init();
