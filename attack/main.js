const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvas2 = document.createElement("canvas");
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });

const main_x = canvas.width / 2;
const main_y = canvas.height / 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const is_music = false;

let mouse_x = 0;
let mouse_y = 0;
const client = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", (event) => {
	mouse_x = (event.clientX - client.left) / client.width * canvas.width;
	mouse_y = (event.clientY - client.top) / client.height * canvas.height;
});

let hitter = 0;
function hit() {
	console.log(`hit ${hitter + 1}`)
	hitter = hitter + 1;
};


function touch(img1, x1, y1, h1, w1, r1, img2, x2, y2, h2, w2, r2) {
	const cd1 = Math.hypot(w1, h1) / 2, cd2 = Math.hypot(w2, h2) / 2;
	const interx = Math.max(x1 - cd1, x2 - cd2), intery = Math.max(y1 - cd1, y2 - cd2);
	const interw = Math.ceil(Math.max(x1 + cd1, x2 + cd2) - interx);
	const interh = Math.ceil(Math.max(y1 + cd1, y2 + cd2) - intery);
	if (interw <= 0 || interh <= 0) return false;
	canvas2.width = interw; canvas2.height = interh;
	
	ctx2.save();
	ctx2.translate(x1 - interx, y1 - intery);
	ctx2.rotate(r1 * Math.PI / 180);
	ctx2.drawImage(img1, -w1 / 2, -h1 / 2, w1, h1);
	ctx2.restore();
	const a = ctx2.getImageData(0, 0, interw, interh).data;
	
	ctx2.clearRect(0, 0, interw, interh);
	
	ctx2.save();
	ctx2.translate(x2 - interx, y2 - intery);
	ctx2.rotate(r2 * Math.PI / 180);
	ctx2.drawImage(img2, -w2 / 2, -h2 / 2, w2, h2);
	ctx2.restore();
	const b = ctx2.getImageData(0, 0, interw, interh).data;
	
	ctx2.clearRect(0, 0, interw, interh);
	
	for (let i = 3; i < a.length; i += 4) {
		if (a[i] > 0 && b[i] > 0) return true;
	};
	return false;
	
};


function touch2(x1, y1, w1, h1, x2, y2, w2, h2) {
	return(
		x1 < x2 + w2 &&
		x1 + w1 > x2 &&
		y1 < y2 + h2 &&
		y1 + h1 > y2
	);
};


function sendmessage(event) {
	clone.forEach(c => c.receivemessage(event));
};


let clone = [];

//keys

let key_up = false;
let key_down = false;
let key_right = false;
let key_left = false;

window.addEventListener("keydown", (event) => {
	if (event.key === "ArrowUp") {
		key_up = true;
	};
	if (event.key === "ArrowDown") {
		key_down = true;
	};
	if (event.key === "ArrowRight") {
		key_right = true;
	};
	if (event.key === "ArrowLeft") {
		key_left = true;
	};
});

window.addEventListener("keyup", (event) => {
	if (event.key === "ArrowUp") {
		key_up = false;
	};
	if (event.key === "ArrowDown") {
		key_down = false;
	};
	if (event.key === "ArrowRight") {
		key_right = false;
	};
	if (event.key === "ArrowLeft") {
		key_left = false;
	};
});

let soul_x = 0;
let soul_y = 0;

//audio
const sound_screen = new Audio("src/snd_great_shine.wav");
const sound_bye_bye = new Audio("src/bye_bye.wav");
const sound_max_health_bye_bye = new Audio("src/max_health_bye_bye.wav");
const sound_douu = new Audio("src/douu.wav");
const sound_knight_summon_blade00 = new Audio("src/knight_summon_blade00.wav");
const sound_knife_dance = new Audio("src/knife_dance.wav");
const sound_charge = new Audio("src/charge.wav");
const sound_cut = new Audio("src/cut.wav");

//sprites
const sprite_soul = new Image;
const sprite_arrow = new Image;
const sprite_back = new Image;

const sprite_box = new Image;
const sprite_box2 = new Image;

const sprite_1 = new Image;
const sprite_2 = new Image;
const sprite_3 = new Image;
const sprite_4 = new Image;
const sprite_5 = new Image;

const sprite_s1 = new Image;
const sprite_s2 = new Image;
const sprite_s3 = new Image;
const sprite_s4 = new Image;

const sprite_laser = new Image;
const sprite_effect = new Image;

//load
sprite_soul.src = "src/soul.svg";
sprite_arrow.src = "src/arrow.svg";
sprite_back.src = "src/back.svg";

sprite_laser.src = "src/laser.svg";
sprite_box.src = "src/box.svg";
sprite_box2.src = "src/box2.svg";

sprite_1.src = "src/1.svg";
sprite_2.src = "src/2.svg";
sprite_3.src = "src/3.png";
sprite_4.src = "src/4.png";
sprite_5.src = "src/5.png";


sprite_s1.src = "src/s1.svg";
sprite_s2.src = "src/s2.svg";
sprite_s3.src = "src/s3.svg";
sprite_s4.src = "src/s4.svg";

sprite_effect.src = "src/effect.png";


class test {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};

const message = "攻撃をうけた回数";

class result {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.anime();
	};
	async anime() {
		for (let i = 0; i < 10; i++) {
			this.w = this.w + 8;
			this.h = this.h + 18;
			await sleep(30);
		};
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.filter = `
			drop-shadow(1px 0px 0.5px ${this.sprite})
			drop-shadow(-1px 0px 0.5px ${this.sprite})
			drop-shadow(0px 1px 0.5px ${this.sprite})
			drop-shadow(0px -1px 0.5px ${this.sprite})
		`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = this.sprite;
		ctx.font = `30px sans-serif`;
		ctx.fillText(`Hit ${hitter}`, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class laser {
	constructor(x, y, w, h, r, trans, sprite, layer, id, rotate, aa) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.aa = aa;
		this.layer = layer;
		this.id = id;
		this.rotate = rotate;
		if (this.rotate === "none") {
			this.rotate = Math.floor((Math.random() * 2) + 1);
		};
		this.bright = 0;
		//clone.push(new laser(main_x, main_y, 0, 20, 0, 1, sprite_laser, 100, 1));
		this.anime();
	};
	async anime() {
		if (this.id === 1) {
			if (this.aa === 1){
				sound_charge.pause();
				sound_charge.currentTime = 0;
				sound_charge.play();
			};
			clone.push(new laser(this.x, this.y, 0, 5, this.r, 1, sprite_box, 30, 2, this.rotate));
			clone.push(new laser(this.x, this.y, 0, 0, 0, 1, sprite_effect, 3, 3, 0));
			this.h = 25;
			this.bright = 1;
			for (let i = 0; i < 20; i++) {
				this.w = this.w + 25;
				this.h = this.h -0.5;
				this.bright = this.bright - 0.05;
				if (this.rotate === 1) {
					this.r = this.r + 8;
				} else {
					this.r = this.r - 8;
				};
				await sleep(15);
			};
			await sleep(800);
			if (this.aa === 1) {
				sound_cut.pause();
				sound_cut.currentTime = 0;
				sound_cut.play();
			};
			this.destroy = true;
		};
		if (this.id === 2) {
			for (let i = 0; i < 20; i++) {
				this.w = this.w + 25;
				if (this.rotate === 1) {
					this.r = this.r + 8;
				} else {
					this.r = this.r - 8;
				};
				await sleep(15);
			};
			await sleep(800);
			clone.push(new laser(this.x, this.y, this.w, this.h, this.r, 1, sprite_box2, 8, 4, this.rotate));
			this.destroy = true;
		};
		if (this.id === 3) {
			this.trans = 1;
			for (let i = 0; i < 20; i++) {
				this.w = this.w + 25;
				this.h = this.h + 25;
				this.trans = this.trans - 0.04;
				await sleep(15);
			};
			this.destroy = true;
		};
		if (this.id === 4) {
			if (touch(this.sprite, this.x, this.y, this.w, this.h, this.r, sprite_soul, soul_x, soul_y, 15, 15, 0)) {
				hit();
			};
			this.bright = Math.floor((Math.random() * 0.5) + 1);
			this.h = 0;
			this.random = Math.floor((Math.random() * 8) + 4);
			for (let i = 0; i < this.random; i++) {
				this.h = this.h + 3;
				await sleep(15)
			};
			for (let i = 0; i < this.random; i++) {
				this.h = this.h - 3;
				await sleep(15)
			};
			this.destroy = true;
		};
	};
	update() {
		if (this.id === 2 || this.id === 1) {
			this.w = this.w + 8;
			if (this.rotate === 1) {
				this.r = this.r + 2;
			} else {
				this.r = this.r - 2;
			};
		};
	};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		if (this.id === 1) {
			ctx.filter = `
				brightness(${1 - this.bright})
				invert(${this.bright})
			`;
		};
		if (this.id === 4) {
			ctx.filter = `
				brightness(${1 - this.bright})
				invert(${this.bright})
				drop-shadow(1px 0px ${this.h / 2}px white)
				drop-shadow(-1px 0px ${this.h / 2}px white)
				drop-shadow(0px 1px ${this.h / 2}px white)
				drop-shadow(0px -1px ${this.h / 2}px white)
			`;
		};
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};



class background {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.anime();
	};
	async anime() {
		this.y = canvas.height;
		
		if (is_music === true) {
			const music = new Audio("src/ice_knight.mp3");
			music.loop = true;
			music.play();
		};
		
		await sleep(250);
		for (let i = 0; i < 10; i++) {
			this.h = this.h - (client.height / 10);
			await sleep(30);
		};
		await sleep(60);
		clone.push(new caught(soul_x, soul_y, 60, 60, 0, 1, sprite_5, 50, 1));
		await sleep(1000);
		clone.push(new beam(main_x, 0, 0, client.width, 0, 1, "none", 50, 1));
		await sleep(1000);
		sound_douu.pause();
		sound_douu.currentTime = 0;
		clone.push(new beam(main_x + 50, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new beam(main_x - 50, 0, 0, client.width, 0, 1, "none", 50, 1));
		await sleep(1000);
		sound_douu.pause();
		sound_douu.currentTime = 0;
		clone.push(new beam(main_x + 100, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new beam(main_x - 100, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 45, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, -45, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, -135, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 135, 1, sprite_s4, 80, 1));
		await sleep(1000);
		sound_douu.pause();
		sound_douu.currentTime = 0;
		clone.push(new caught(soul_x, soul_y, 60, 60, 0, 1, sprite_5, 50, 1));
		clone.push(new beam(main_x + 150, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new beam(main_x - 150, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 0, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 90, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, -90, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 180, 1, sprite_s4, 80, 1));
		await sleep(1000);
		sound_douu.pause();
		sound_douu.currentTime = 0;
		clone.push(new beam(main_x + 200, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new beam(main_x - 200, 0, 0, client.width, 0, 1, "none", 50, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 45, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, -45, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, -135, 1, sprite_s4, 80, 1));
		clone.push(new sword(soul_x, soul_y, 60, 25, 135, 1, sprite_s4, 80, 1));
		
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		await sleep(1200);
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		await sleep(1200);
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		await sleep(1200);
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		await sleep(1200);
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		await sleep(1200);
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 1));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		clone.push(new laser(soul_x, soul_y, 0, 20, Math.floor((Math.random() * 360) + 0), 1, sprite_laser, 25, 1, "none", 0));
		await sleep(2800);
		clone.push(new result(main_x, main_y - 0, 0, 30, 0, 1, "green", 10));
		
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.filter = `hue-rotate(100deg)`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};



class sword {
	constructor(x, y, w, h, r, trans, sprite, layer, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.id = id;
		this.layer = layer;
		this.anime();
	};
	async anime() {
		if (this.id === 1) {
			sound_knight_summon_blade00.play();
			this.x += Math.cos(this.r * Math.PI / 180) * -80;
			this.y += Math.sin(this.r * Math.PI / 180) * -80;
			await sleep(300);
			this.sprite = sprite_s3;
			await sleep(60);
			this.sprite = sprite_s1;
			for (let i = 0; i < 10; i++) {
				this.x += Math.cos(this.r * Math.PI / 180) * -3;
				this.y += Math.sin(this.r * Math.PI / 180) * -3;
				await sleep(30);
			};
			await sleep(300);
			sound_knife_dance.play();
			for (let i = 0; i < 30; i++) {
				if (touch(this.sprite, this.x, this.y, this.w, this.h, this.r, sprite_soul, soul_x, soul_y, 15, 15, 0)) {
					hit();
				};
				this.x += Math.cos(this.r * Math.PI / 180) * 30;
				this.y += Math.sin(this.r * Math.PI / 180) * 30;
				clone.push(new sword(this.x, this.y, 30, 4, this.r, 1, sprite_s2, 50, 2));
				clone.push(new sword(this.x, this.y, this.w, this.h, this.r, 1, sprite_s1, 60, 2));
				await sleep(15);
			};
		};
		if (this.id === 2) {
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.1;
				await sleep(30);
			};
			this.destroy = true;
		};
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class beam {
	constructor(x, y, w, h, r, trans, sprite, layer, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = "white";
		this.layer = layer;
		this.id = id;
		this.anime();
	};
	async anime() {
		if (this.id === 1) {
			sound_bye_bye.play();
			for (let i = 0; i < 10; i++) {
				this.w = this.w + 5;
				await sleep(15);
			};
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.1;
				await sleep(30);
			};
			await sleep(60);
			//sound_douu.pause();
			//sound_douu.currentTime = 0;
			sound_douu.play();
			this.sprite = "red";
			this.trans = 1;
			clone.push(new beam(this.x, this.y, this.w, this.h, 0, 0.5, "none", 50, 2));
			if (touch2(this.x, this.y, this.w, this.h, soul_x, soul_y, 15, 15)) {
				hit();
			};
			await sleep(450);
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.1;
				await sleep(30);
			};
			this.destroy = true;
		};
		if (this.id === 2) {
			this.sprite = "red";
			for (let i = 0; i < 10; i++) {
				this.w = this.w + 1.5;
				await sleep(15);
			};
			await sleep(300);
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.05;
				await sleep(30);
			};
			this.destroy = true;
		};
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = this.sprite;
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class caught {
	constructor(x, y, w, h, r, trans, sprite, layer, id) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.id = id;
		this.anime();
	};
	async anime() {
		if (this.id === 1) {
			sound_max_health_bye_bye.play();
			this.sprite = sprite_5;
			await sleep(30);
			this.sprite = sprite_4;
			await sleep(30);
			this.sprite = sprite_3;
			await sleep(30);
			this.sprite = sprite_2;
			await sleep(180);
			this.sprite = sprite_1;
			clone.push(new caught(this.x, this.y, this.w, this.h, 0, 0.5, sprite_1, 50, 2));
			if (touch(this.sprite, this.x, this.y, this.w, this.h, this.r, sprite_soul, soul_x, soul_y, 15, 15, 0)) {
				sendmessage("white_soul");
				hit();
			};
			await sleep(360);
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.1;
				await sleep(30);
			};
			this.destroy = true;
		};
		if (this.id === 2) {
			for (let i = 0; i < 10; i++) {
				this.w += 1;
				this.h += 1;
				await sleep(30);
			};
			await sleep(60);
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.05;
				await sleep(30);
			};
			this.destroy = true;
		};
		
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};



class start_screen {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.anime();
	};
	async anime() {
		sound_screen.play();
		for (let i = 0; i < 10; i++) {
			this.trans = this.trans + 0.1;
			await sleep(15);
		};
		clone.push(new background(0, 0, client.width, 0, 0, 0.5, sprite_back, 1));
		for (let i = 0; i < 10; i++) {
			this.trans = this.trans - 0.1;
			await sleep(30);
		};
		this.destroy = true;
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = "white";
		ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class arrow {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
		if (this.event === "start_text") {
			for (let i = 0; i < 10; i++) {
				this.trans = this.trans - 0.05;
				await sleep(15);
			};
			await sleep(1000);
			clone.push(new start_screen(0, 0, client.width, client.height, 0, 0, "none", 200));
			this.destroy = true;
		};
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class start_text {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.size = 30;
		this.is_startmove = false;
	};
	update() {
		if (this.is_startmove === false) {
			if (key_up === true || key_right === true || key_left === true || key_down === true) {
				sendmessage("start_text");
				this.is_startmove = true;
			};
		};
	};
	async receivemessage(event) {
		this.event = event;
		if (this.event === "start_text") {
			for (let i = 0; i < 10; i++) {
				//this.trans = this.trans - 0.1;
				this.size -= 3;
				this.r = this.r + 3;
				clone.push(new start_text_fade(this.x, this.y, this.w, this.h, this.r, this.trans, "green", 99, this.size));
				await sleep(30);
			};
			this.destroy = true;
		};
	};
	draw() {
		ctx.save();
		
		ctx.filter = `
			drop-shadow(1px 0px 0.5px ${this.sprite})
			drop-shadow(-1px 0px 0.5px ${this.sprite})
			drop-shadow(0px 1px 0.5px ${this.sprite})
			drop-shadow(0px -1px 0.5px ${this.sprite})
		`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = this.sprite;
		ctx.font = `${this.size}px sans-serif`;
		ctx.fillText("Move to Start", -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};

class start_text_fade {
	constructor(x, y, w, h, r, trans, sprite, layer, size) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = 1;
		this.sprite = sprite;
		this.layer = layer;
		this.size = size;
		this.anime();
	};
	async anime() {
		for (let i = 0; i < 5; i++) {
			this.trans = this.trans - 0.2;
			await sleep(30);
		};
		this.destroy = true;
	};
	update() {};
	async receivemessage(event) {
		this.event = event;
	};
	draw() {
		ctx.save();
		
		ctx.filter = `
			drop-shadow(1px 0px 0.5px ${this.sprite})
			drop-shadow(-1px 0px 0.5px ${this.sprite})
			drop-shadow(0px 1px 0.5px ${this.sprite})
			drop-shadow(0px -1px 0.5px ${this.sprite})
		`;
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = this.sprite;
		ctx.font = `${this.size}px sans-serif`;
		ctx.fillText("Move to Start", -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


class player {
	constructor(x, y, w, h, r, trans, sprite, layer) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = r;
		this.trans = trans;
		this.sprite = sprite;
		this.layer = layer;
		this.move_mode = true;
	};
	update() {
		soul_x = this.x;
		soul_y = this.y;
		if (this.move_mode === true) {
			if (key_up === true) {
				this.y = this.y - 1.5
			};
			if (key_down === true) {
				this.y = this.y + 1.5
			};
			if (key_right === true) {
				this.x = this.x + 1.5
			};
			if (key_left === true) {
				this.x = this.x - 1.5
			};
		};
	};
	async receivemessage(event) {
		this.event = event;
		if (this.event === "white_soul") {
			this.move_mode = false;
			await sleep(2000);
			this.move_mode = true;
		};
	};
	draw() {
		ctx.save();
		
		if (this.move_mode === false) {
			ctx.filter = `
				brightness(0)
				invert(1)
				drop-shadow(1px 0px 8px white)
				drop-shadow(-1px 0px 8px white)
				drop-shadow(0px 1px 8px white)
				drop-shadow(0px -1px 8px white)
			`;
		};
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
		
		ctx.restore();
	};
};


function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	clone = clone.filter(c => !c.destroy);
	clone.sort((a, b) => a.layer - b.layer);
	clone.forEach(c => {
		c.update();
		c.draw();
	});
	
	requestAnimationFrame(loop);
};

sprite_soul.onload = function() {
	clone.push(new start_text(main_x, main_y - 80, 180, 30, 0, 1, "green", 100));
	clone.push(new player(main_x, main_y, 15, 15, 0, 1, sprite_soul, 100));
	clone.push(new arrow(main_x, main_y, 80, 80, 0, 0.5, sprite_arrow, 100));
	loop();
};












