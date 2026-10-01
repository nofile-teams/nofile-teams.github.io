const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const main_x = canvas.width / 2;
const main_y = canvas.height / 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sprite_button = new Image;
const sprite_t = new Image;
const sprite_a = new Image;
const sprite_fountain = new Image;


sprite_t.src = "src/t.svg";
sprite_a.src = "src/a.svg";
sprite_fountain.src = "src/fountain.png";
sprite_button.src = "src/button.svg";

let clone = [];

function touch(x1, y1, width1, height1, x2, y2, width2, height2) {
	return (
		x1 < x2 + width2 &&
		x1 + width1 > x2 &&
		y1 < y2 + height2 &&
		y1 + height1 > y2
	);
};

function touch_mouse(x, y, width, height) {
	return mouse_x >= x && mouse_x <= x + width && mouse_y >= y && mouse_y <= y + height;
};

function touch2(x, y, width, height) {
	return x <= 0 || (x + width) >= canvas.width || y <= 0 || (y + height) >= canvas.height;
};

let clicks = false;

document.addEventListener("click", (event) => {
	if (event.button === 0) {
		clicks = true;
	} else {
		clicks = false;
	};
});

let mouse_x = 0;
let mouse_y = 0;
let m_x = 0;
let m_y = 0;

const center_mouse = canvas.getBoundingClientRect();

class test {
	constructor(x, y, r, width, height, trans, layer) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
	};
	async event(event) {
		this.event = event;
	};
	update() {
		
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


class font {
	constructor(x, y, r, width, height, trans, layer) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.shadow = 1.5
		this.count = 0;
		this.mode = false;
		this.font = 30;
		this.move();
	};
	async move() {
		while (true) {
			for (let i = 0; i < 20; i++) {
				this.y = this.y + 1;
				clone.push(new font2(this.x, this.y, 0, 250, 30, 0.5, 90));
				await sleep(30);
				if (this.mode === true) {
					break
				};
			};
			for (let i = 0; i < 20; i++) {
				this.y = this.y - 1;
				clone.push(new font2(this.x, this.y, 0, 250, 30, 0.5, 90));
				await sleep(30);
				if (this.mode === true) {
					break
				};
			};
			if (this.mode === true) {
				break
			};
		};
		this.shadow = 0;
		for (let i = 0; i < 10; i++) {
			this.trans = ((this.trans * 100) - (0.1 * 100)) / 100;
			this.width = this.width + 10;
			this.height = this.height + 10;
			this.font = this.font + 10;
			await sleep(30);
		};
		clone.forEach(clones => {
			clones.event("clark");
		});
		this.destroy = true;
	};
	async event(event) {
		this.event = event;
	};
	update() {
		if (clicks === true) {
			this.mode = true;
		};
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = "cyan";
		ctx.font = `${this.font}px sans-serif`;

		ctx.fillText("画面をタップしてね", -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};





class font2 {
	constructor(x, y, r, width, height, trans, layer) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.shadow = 1.5;
		this.fade();
	};
	async fade() {
		for (let i = 0; i < 10; i++) {
			this.trans = ((this.trans * 100) - (0.05 * 100)) / 100;
			await sleep(30);
		};
		this.destroy = true;
	};
	async event(event) {
		this.event = event;
	};
	update() {
		
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = "white";
		ctx.font = '30px sans-serif';
		ctx.filter = `
			drop-shadow(${this.shadow}px 0px ${this.shadow}px white)
			drop-shadow(${-this.shadow}px 0px ${this.shadow}px white)
			drop-shadow(0px ${this.shadow}px ${this.shadow}px white)
			drop-shadow(0px ${-this.shadow}px ${this.shadow}px white)
		`;
		ctx.fillText("画面をタップしてね", -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};






class clark {
	constructor(x, y, r, width, height, trans, layer, mode) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.random2 = Math.floor((Math.random() * 810) + 1);
		this.mode = mode;
		
		if (this.mode === 0) {
			this.r = Math.floor((Math.random() * 45) + -45) - 45;
		};
		if (this.mode === 1) {
			this.r = Math.floor((Math.random() * 45) + -45) - 90;
		};
		
		this.x += Math.cos(this.r * Math.PI / 180) * Math.floor((Math.random() * 30) + -64);
		this.y += Math.sin(this.r * Math.PI / 180) * Math.floor((Math.random() * 30) + -64);
		
		this.fade();
		this.anime();
	};
	async fade() {
		
	};
	async anime() {
		this.random = Math.floor((Math.random() * 2) + 1);
		while (true) {
			for (let i = 0; i < 10; i++) {
				if (this.random === 1) {
					this.width = this.width - 2
				};
				if (this.random === 2) {
					this.height = this.height - 2
				};
				await sleep(30);
			};
			for (let i = 0; i < 10; i++) {
				if (this.random === 1) {
					this.width = this.width + 2
				};
				if (this.random === 2) {
					this.height = this.height + 2
				};
				await sleep(30);
			};
		};
	};
	async event(event) {
		this.event = event;
	};
	update() {
		this.x += Math.cos(this.r * Math.PI / 180) * Math.floor((Math.random() * 7) + 3);
		this.y += Math.sin(this.r * Math.PI / 180) * Math.floor((Math.random() * 7) + 3);
		this.y = this.y + 2.5;
		if (this.mode === 1) {
			this.r = this.r + 1;
		};
		if (this.mode === 0) {
			this.r = this.r - 1;
		};
	};
	draw() {
		ctx.save();
		
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.fillStyle = "red";
		ctx.filter = `hue-rotate(${this.random2}deg)`;
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};




class clark_ai {
	constructor(x, y, r, width, height, trans, layer) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
	};
	async event(event) {
		this.event = event;
		await sleep(1500);
		if (this.event === "clark") {
			clone.push(new happy(main_x, main_y - 80, 0, 0, 0, 1, 150, 1));
			clone.push(new happy(main_x, main_y - 40, 0, 0, 0, 1, 150, 0));
			for (let i = 0; i < 30; i++) {
				clone.push(new clark(main_x + 280, main_y + 120, 0, 10, 10, 1, 200, 0));
				clone.push(new clark(main_x - 280, main_y + 120, 0, 10, 10, 1, 200, 1));
			};
		};
	};
	update() {
		
	};
	draw() {

	};
};






class happy {
	constructor(x, y, r, width, height, trans, layer, mode) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.mode = mode;
		if (this.mode === 1) {
			this.sprite = sprite_t;
		};
		if (this.mode === 0) {
			this.sprite = sprite_a;
		};
		this.anime();
	};
	async anime() {
		if (this.mode === 0) {
			await sleep(1000);
			for (let i = 0; i < 30; i++) {
				this.width = this.width + 8;
				this.height = this.height + 4;
				await sleep(30);
			};
		};
		if (this.mode === 1) {
			for (let i = 0; i < 30; i++) {
				this.width = this.width + 8;
				this.height = this.height + 2;
				await sleep(30);
			};
		};
	};
	async event(event) {
		this.event = event;
	};
	update() {
		
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





class fountain {
	constructor(x, y, r, width, height, trans, layer, mode) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.mode = mode;
		this.sprite = sprite_fountain;
		this.anime();
	};
	async anime() {
		if (this.mode === 0) {
			while (true) {
				clone.push(new fountain(main_x, main_y, 0, canvas.width, canvas.height, 1, 1, 1));
				await sleep(300);
			};
		};
		if (this.mode === 1) {
			for (let i = 0; i < 50; i++) {
				this.width = this.width + 3;
				this.height = this.height + 3;
				this.trans = ((this.trans * 100) - (0.02 * 100)) / 100;
				this.layer = this.layer + 1;
				await sleep(30);
			};
			this.destroy = true;
		};
	};
	async event(event) {
		this.event = event;
	};
	update() {
		
	};
	draw() {
		ctx.save();
		
		if (this.mode === 1) {
			ctx.filter = 'brightness(70%)';
		};
		ctx.globalAlpha = this.trans;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r * Math.PI / 180);
		ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
	};
};




class back {
	constructor(x, y, r, width, height, trans, layer) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.width = width;
		this.height = height;
		this.trans = trans;
		this.layer = layer;
		this.bright = 0;
	};
	async event(event) {
		this.event = event;
		if (this.event === "clark") {
			for (let i = 0; i < 25; i++) {
				this.bright = this.bright + 4;
				await sleep(30);
			};
			for (let i = 0; i < 10; i++) {
				this.trans = ((this.trans * 100) - (0.1 * 100)) / 100;
				await sleep(30);
			};
			this.destroy = true;
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
		ctx.fillStyle = "white";
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		
		ctx.restore();
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

//clone.push(new button(0, 0, 0, 30, 30, 1, 100));
sprite_button.onload = function() {
	clone.push(new font(main_x, main_y, 0, 250, 30, 1, 100));
	clone.push(new fountain(main_x, main_y, 0, canvas.width, canvas.height, 1, 0, 0));
	clone.push(new back(main_x, main_y, 0, canvas.width, canvas.height, 1, 64));
	clone.push(new clark_ai(main_x, main_y, 0, 250, 30, 1, 100));
	loop();
};
