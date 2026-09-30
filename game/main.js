const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const main_x = canvas.width / 2;
const main_y = canvas.height / 2;

const mask = new Path2D();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sound_runsword = new Audio("src/knife_dance.wav");
const sound_hurt = new Audio("src/hurt.wav");
const sound_chargesword = new Audio("src/knight_summon_blade00.wav");
const sound_music = new Audio("src/knight.ogg");
const sound_charge = new Audio("src/charge.wav");
const sound_cut = new Audio("src/cut.wav");
sound_music.loop = true;
sound_music.play();

const sprite_s1 = new Image;
const sprite_s2 = new Image;
const sprite_s3 = new Image;
const sprite_effect1 = new Image;
const sprite_s4 = new Image;
const sprite_soul = new Image;
const sprite_laser = new Image;
const sprite_laser2 = new Image;

sprite_s1.src = "src/s1.svg";
sprite_s2.src = "src/s2.svg";
sprite_s3.src = "src/s3.svg";
sprite_s4.src = "src/s4.svg";
sprite_effect1.src = "src/effect1.png";
sprite_laser.src = "src/laser.svg";
sprite_laser2.src = "src/laser2.svg";
sprite_soul.src = "src/soul.svg";

let clone = [];

let arrowdown = false;
let arrowleft = false;
let arrowright = false;
let arrowup = false;

let soul_x = canvas.width / 2;
let soul_y = canvas.height / 2;

document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft") {
		arrowleft = true;
	};
	if (event.key === "ArrowRight") {
		arrowright = true;
	};
	if (event.key === "ArrowDown") {
		arrowdown = true;
	};
	if (event.key === "ArrowUp") {
		arrowup = true;
	};
});

document.addEventListener("keyup", (event) => {
	if (event.key === "ArrowLeft") {
		arrowleft = false;
	};
	if (event.key === "ArrowRight") {
		arrowright = false;
	};
	if (event.key === "ArrowDown") {
		arrowdown = false;
	};
	if (event.key === "ArrowUp") {
		arrowup = false;
	};
});

function aabb(x, y, w, h) {
	return x <= 0 || (x + w) >= canvas.width || y <= 0 || (y + h) >= canvas.height;
};

function touch(x, y, w, h, x2, y2, w2, h2) {
	return (
		x < x2 + w2 &&
		x + w > x2 &&
		y < y2 + h2 &&
		y + h > y2
	);
};

function damage() {
	sound_hurt.play();
};

class player {
	constructor(x, y, width, height, r, trans, layer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		
	};
	broadcast() {
		
	};
	update() {
		soul_x = this.x;
		soul_y = this.y;
		if (arrowdown === true) {
			this.y = Math.round((this.y + 2) * 10) / 10;
			if (aabb(this.x, this.y, this.width, this.height)) {
				this.y = Math.round((this.y - 2) * 10) / 10;
			};
		};
		if (arrowup === true) {
			this.y = Math.round((this.y - 2) * 10) / 10;
			if (aabb(this.x, this.y, this.width, this.height)) {
				this.y = Math.round((this.y + 2) * 10) / 10;
			};
		};
		if (arrowleft === true) {
			this.x = Math.round((this.x - 2) * 10) / 10;
			if (aabb(this.x, this.y, this.width, this.height)) {
				this.x = Math.round((this.x + 2) * 10) / 10;
			};
		};
		if (arrowright === true) {
			this.x = Math.round((this.x + 2) * 10) / 10;
			if (aabb(this.x, this.y, this.width, this.height)) {
				this.x = Math.round((this.x - 2) * 10) / 10;
			};
		};
	};
	draw() {
		ctx.save();
		
		ctx.filter = `
			drop-shadow(3px 0px 18px red) 
			drop-shadow(-3px 0px 18px red) 
			drop-shadow(0px 3px 18px red) 
			drop-shadow(0px -3px 18px red)
		`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(sprite_soul, -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};

class sword {
	constructor(x, y, width, height, r, trans, layer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		this.step = 60;
		this.move_mode = true;
		this.sprite = sprite_s4;
		sound_chargesword.play();
		this.charge_time();
	};
	update() {
		if (this.move_mode === true) {
			this.x = soul_x + Math.cos(this.r * Math.PI / 180) * -this.step;
			this.y = soul_y + Math.sin(this.r * Math.PI / 180) * -this.step;
		};
	};
	async charge_time() {
		this.count = 0;
		await sleep(700);
		this.sprite_charge();
		this.move_charge();
	};
	async sprite_charge() {
		this.sprite = sprite_s4;
		await sleep(30);
		this.sprite = sprite_s3;
		await sleep(30);
		this.sprite = sprite_s1;
		this.layer = 80;
	};
	async move_charge() {
		for (let i = 0; i < 18; i++) {
			this.step = this.step + 1;
			await sleep(15);
		};
		this.move_mode = false;
		await sleep(300);
		sound_runsword.play();
		clone.push(new sword_fade(this.x, this.y, this.width, this.height, this.r, this.trans, 40, 1));
		clone.push(new sword_fade(this.x, this.y, this.width + 10, 5, this.r, this.trans, 10, 2));
		for (let i = 0; i < 30; i++) {
			this.x = this.x + Math.cos(this.r * Math.PI / 180) * 25;
			this.y = this.y + Math.sin(this.r * Math.PI / 180) * 25;
			clone.push(new sword_fade(this.x, this.y, this.width, this.height, this.r, this.trans, 40, 0));
			clone.push(new sword_fade(this.x, this.y, this.width + 10, 5, this.r, this.trans, 10, 2));
			if (touch(this.x, this.y, 5, 5, soul_x, soul_y, 15, 15)) {
				damage();
			};
			await sleep(15);
		};
		this.destroy = true;
	};
	broadcast() {
		
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};


class sword_fade {
	constructor(x, y, width, height, r, trans, layer, mode) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		this.mode = mode;
		this.count = 0;
		
	};
	update() {
		if (this.mode === 0) {
			this.count = this.count + 1;
			this.trans = ((this.trans * 100) - (0.1 * 100)) / 100;
			if (this.count === 10) {
				this.destroy = true;
			};
		};
		if (this.mode === 2) {
			this.count = this.count + 1;
			this.trans = ((this.trans * 100) - (0.1 * 100)) / 100;
			if (this.count === 10) {
				this.destroy = true;
			};
		};
		if (this.mode === 1) {
			this.count = this.count + 1;
			this.trans = ((this.trans * 100) - (0.1 * 100)) / 100;
			this.width = this.width + 2;
			this.height = this.height + 1;
			if (this.count === 10) {
				this.destroy = true;
			};
		};
	};
	broadcast() {
		
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		if (this.mode === 2) {
			ctx.drawImage(sprite_s2, -this.width / 2, -this.height / 2, this.width, this.height);
		} else {
			ctx.drawImage(sprite_s1, -this.width / 2, -this.height / 2, this.width, this.height);
		};
		
		ctx.restore();
	};
};



class laser {
	constructor(x, y, width, height, r, trans, layer, mode, r2) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.mode = mode;
		this.sprite = sprite_laser;
		if (this.mode !== 0) {
			this.count = Math.floor((Math.random() * 360) + 0);
			this.r = this.count;
		} else {
			this.r = r;
		};
		this.r2 = r2;
		this.trans = trans;
		this.layer = layer;
		this.count = 0;
		this.bright = 200;
		this.animation();
		this.move = 0;
		//this.destroy = true;
	};
	async broadcast() {
		clone.push(new laser_hit(this.x, this.y, 10, 10, this.r + 90, 1, 120, 0));
		clone.push(new laser_hit(this.x, this.y, 10, 10, this.r + 90, 1, 120, 1));
		this.move = 1;
		this.sprite = sprite_laser2;
		this.count = Math.floor((Math.random() * 100) + 0);
		//console.log(this.bright);
		this.bright = this.bright + Math.floor((Math.random() * 30) + -10);
		this.width = 0;
		await sleep(this.count);
		this.count = Math.floor((Math.random() * 8) + 4);
		for (let i = 0; i < this.count; i++) {
			this.width = this.width + 3;
			await sleep(20);
		};
		for (let i = 0; i < this.count; i++) {
			this.width = this.width - 3;
			await sleep(20);
		};
		this.destroy = true;
	};
	async animation() {
		if (this.mode !== 0) {
			this.count = Math.floor((Math.random() * 2) + 1);
		};
		if (this.mode === 1) {
			clone.push(new laser(this.x, this.y, 50, 0, this.r + 90, 1, 50, 0, this.r2));
		};
		if (this.mode === 2) {
			clone.push(new laser(this.x, this.y, 50, 0, this.r + 90, 1, 50, 0, this.r2));
			clone.push(new laser(this.x, this.y, 50, 0, this.r + 45, 1, 50, 0, this.r2));
			clone.push(new laser(this.x, this.y, 50, 0, this.r - 45, 1, 50, 0, this.r2));
		};
		for (let i = 0; i < 20; i++) {
			this.width = this.width -2;
			this.height = this.height + 100;
			this.bright = ((this.bright * 100) - (5 * 100)) / 100;
			if (this.r2 === 1) {
				this.r = this.r + 6;
			};
			if (this.r2 === 2) {
				this.r = this.r - 6;
			};
			await sleep(30)
		};
		while (true) {
			if (this.move === 0) {
				if (this.r2 === 1) {
					this.r = this.r + 3;
				};
				if (this.r2 === 2) {
					this.r = this.r - 3;
				};
			};
			await sleep(30);
		};
	};
	update() {
	};
	draw() {
		ctx.save();
		
		ctx.filter = `brightness(${this.bright}%)`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};



class effect1 {
	constructor(x, y, width, height, r, trans, layer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		this.start();
		
	};
	async start() {
		for (let i = 0; i < 20; i++) {
			this.width = this.width + 100;
			this.height = this.height + 100;
			this.trans = ((this.trans * 100) - (0.05 * 100)) / 100;
			await sleep(30);
		};
		this.destroy = true;
	};
	update() {
		
	};
	broadcast() {
		
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(sprite_effect1, -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};

class laser_hit {
	constructor(x, y, width, height, r, trans, layer, mode) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		this.mode = mode;
		this.start();
		
	};
	async start() {
		for (let i = 0; i < 30; i++) {
			if (touch(this.x, this.y, 5, 5, soul_x, soul_y, 15, 15)) {
				damage();
			};
			if (this.mode === 1) {
				this.x += Math.cos(this.r * Math.PI / 180) * 30;
				this.y += Math.sin(this.r * Math.PI / 180) * 30;	
			};
			if (this.mode === 0) {
				this.x += Math.cos(this.r * Math.PI / 180) * -30;
				this.y += Math.sin(this.r * Math.PI / 180) * -30;	
			};
		};
		this.destroy = true;
	};
	update() {
		
	};
	broadcast() {
		
	};
	draw() {
	};
};




const message_laser = new laser();
class laser_ai {
	constructor(x, y, width, height, r, trans, layer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
		this.trans = trans;
		this.layer = layer;
		this.count = 0;
		this.start();
		
	};
	async start() {
		await sleep(100)
		while (true) {
			sound_charge.play();
			clone.push(new effect1(soul_x, soul_y, 0, 0, 0, 1, 1));
			this.count = Math.floor((Math.random() * 3) + 1);
			if (this.count === 1) {
				this.rdm = Math.floor((Math.random() * 2) + 1);
				clone.push(new laser(soul_x, soul_y, 50, 0, 0, 1, 50, 0, this.rdm));
			};
			if (this.count === 2) {
				this.rdm = Math.floor((Math.random() * 2) + 1);
				clone.push(new laser(soul_x, soul_y, 50, 0, 0, 1, 50, 1, this.rdm));
			};
			if (this.count === 3) {
				this.rdm = Math.floor((Math.random() * 2) + 1);
				clone.push(new laser(soul_x, soul_y, 50, 0, 0, 1, 50, 2, this.rdm));
			};
			this.count = Math.floor((Math.random() * 8) + 1)
			if (this.count === 1) {
				this.r = 0;
			};
			if (this.count === 2) {
				this.r = 45;
			};
			if (this.count === 3) {
				this.r = 90;
			};
			if (this.count === 4) {
				this.r = -45;
			};
			if (this.count === 5) {
				this.r = 180;
			};
			if (this.count === 6) {
				this.r = 135;
			};
			if (this.count === 7) {
				this.r = -90;
			};
			if (this.count === 8) {
				this.r = -135;
			};
			clone.push(new sword(main_x, main_y, 40, 20, this.r, 1, 50))
			await sleep(100)
			this.count = Math.floor((Math.random() * 8) + 1)
			if (this.count === 1) {
				this.r = 0;
			};
			if (this.count === 2) {
				this.r = 45;
			};
			if (this.count === 3) {
				this.r = 90;
			};
			if (this.count === 4) {
				this.r = -45;
			};
			if (this.count === 5) {
				this.r = 180;
			};
			if (this.count === 6) {
				this.r = 135;
			};
			if (this.count === 7) {
				this.r = -90;
			};
			if (this.count === 8) {
				this.r = -135;
			};
			clone.push(new sword(main_x, main_y, 40, 20, this.r, 1, 50))
			await sleep(900);
			sound_cut.play();
			clone.forEach(c => c.broadcast());
			await sleep(700)
		};
	};
	update() {
		
	};
	broadcast() {
		
	};
	draw() {
		
	};
};


function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	clone = clone.filter(clones => !clones.destroy);
	clone.sort((a, b) => a.layer - b.layer);
	clone.forEach(clones => {
		clones.update();
		clones.draw();
	});
	
	requestAnimationFrame(loop);
};

sprite_soul.onload = function() {
	clone.push(new player(main_x, main_y, 15, 15, 0, 1, 100));
	//clone.push(new sword_ai(main_x, main_y, 80, 40, 0, 1, 50));
	clone.push(new laser_ai(main_x, main_y, 80, 40, 0, 1, 50));
	loop();
};
