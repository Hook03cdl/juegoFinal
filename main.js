// Obtén el elemento canvas
var canvas = document.getElementById('micanvas');
var ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let saltos = 50;
let contadorTime = 0;
let time = { seg: 0, min: 0 };
let monedasRecogidas = 0;

let vista = 'derecha';

const bombaImg = new Image();
bombaImg.src = 'bomba.png';

const imgExplocion = new Image();
imgExplocion.src = 'explocion.png';

const imgPlayerIzq = new Image();
imgPlayerIzq.src = 'playerIzq.png';

const imgPlayerDer = new Image();
imgPlayerDer.src = 'playerDer.png';

const moneda = new Image();
moneda.src = 'moneda.png';

const bomberman_start = new Audio();
bomberman_start.volume = 0.3;
bomberman_start.src = 'bomberman_start.mp3';

const pop = new Audio();
pop.src = 'pop.mp3';

const soltarBomba = new Audio();
soltarBomba.src = 'soltarBomba.mp3';

const coin = new Audio();
coin.src = 'marioCoin.mp3';

const tema = new Audio();
tema.loop = true;
tema.volume = 0.3;
tema.src = 'temaBomberman.mp3';

let bombasAct = [];
// Dibuja el mapa
class Player {
	constructor({
		posicion = { x: 0, y: 0 },
		h = saltos,
		w = saltos,
		destruible = false,
		color = null,
	}) {
		this.posicion = posicion;
		this.h = h;
		this.w = w;
		this.destruible = destruible;
		this.color = color;
		this.bombasUsables = 3;
	}
	esDestruido() {
		return this.destruible && this.color === 'red';
	}
	draw() {
		if (vista == 'derecha') {
			ctx.drawImage(
				imgPlayerDer,
				this.posicion.x,
				this.posicion.y,
				this.w,
				this.h
			);
		} else if (vista == 'izquierda') {
			ctx.drawImage(
				imgPlayerIzq,
				this.posicion.x,
				this.posicion.y,
				this.w,
				this.h
			);
		}
	}
}
class Bomba {
	constructor({ posicion = { x: 0, y: 0 }, posArray = { a_x, a_y } }) {
		this.posicion = posicion;
		this.w = saltos;
		this.h = saltos;
		this.explosionTime = 180;
		this.rango = 1;
		this.posArray = posArray;
	}
	update() {
		this.explosionTime--;
		if (this.explosionTime === 0) {
			let index = bombasAct.indexOf(this);
			if (index !== -1) {
				bombasAct.splice(index, 1);
			}
			this.explocion();

			pop.play();
		}
		this.draw();
	}

	explocion() {
		mapa[this.posArray.a_y][this.posArray.a_x] = 0;
		for (let x = 0; x <= this.rango; x++) {
			if (
				this.posArray.a_x + x < mapa[this.posArray.a_y].length &&
				mapa[this.posArray.a_y][this.posArray.a_x + x] === 2
			) {
				if (mapa[this.posArray.a_y][this.posArray.a_x + 1] === 1) {
					break;
				} else if (mapa[this.posArray.a_y][this.posArray.a_x + x] === 2) {
					mapa[this.posArray.a_y][this.posArray.a_x + x] = 0;

					break;
				}
			} else if (
				this.posArray.a_x + x < mapa[this.posArray.a_y].length &&
				mapa[this.posArray.a_y][this.posArray.a_x + x] === 0
			) {
				ctx.drawImage(
					imgExplocion,
					this.posicion.x + saltos * x,
					this.posicion.y,
					this.h,
					this.w
				);
			}
		}
		for (let x = 0; x <= this.rango; x++) {
			if (
				this.posArray.a_x - x >= 1 &&
				mapa[this.posArray.a_y][this.posArray.a_x - x] === 2
			) {
				if (mapa[this.posArray.a_y][this.posArray.a_x - 1] === 1) {
					break;
				} else if (mapa[this.posArray.a_y][this.posArray.a_x - x] === 2) {
					mapa[this.posArray.a_y][this.posArray.a_x - x] = 0;
					break;
				}
			} else if (
				this.posArray.a_x - x >= 1 &&
				mapa[this.posArray.a_y][this.posArray.a_x - x] === 0
			) {
				ctx.drawImage(
					imgExplocion,
					this.posicion.x - saltos * x,
					this.posicion.y,
					this.h,
					this.w
				);
			}
		}

		for (let y = 0; y <= this.rango; y++) {
			if (
				this.posArray.a_y + y < mapa.length &&
				mapa[this.posArray.a_y + y][this.posArray.a_x] === 2
			) {
				if (mapa[this.posArray.a_y + 1][this.posArray.a_x] === 1) {
					break;
				} else if (mapa[this.posArray.a_y + y][this.posArray.a_x] === 2) {
					mapa[this.posArray.a_y + y][this.posArray.a_x] = 0;
					break;
				}
			} else if (
				this.posArray.a_y + y < mapa.length &&
				mapa[this.posArray.a_y + y][this.posArray.a_x] === 0
			) {
				ctx.drawImage(
					imgExplocion,
					this.posicion.x,
					this.posicion.y + saltos * y,
					this.h,
					this.w
				);
			}
		}
		for (let y = 0; y <= this.rango; y++) {
			if (
				this.posArray.a_y > 1 &&
				mapa[this.posArray.a_y - y][this.posArray.a_x] === 2
			) {
				if (mapa[this.posArray.a_y - 1][this.posArray.a_x] === 1) {
					break;
				} else if (mapa[this.posArray.a_y - y][this.posArray.a_x] === 2) {
					mapa[this.posArray.a_y - y][this.posArray.a_x] = 0;
					break;
				}
			} else if (
				this.posArray.a_y > 1 &&
				mapa[this.posArray.a_y - y][this.posArray.a_x] === 0
			) {
				ctx.drawImage(
					imgExplocion,
					this.posicion.x,
					this.posicion.y - saltos * y,
					this.h,
					this.w
				);
			}
		}

		player.bombasUsables++;

		ctx.drawImage(
			imgExplocion,
			this.posicion.x,
			this.posicion.y,
			this.h,
			this.w
		);
	}
	draw() {
		ctx.drawImage(bombaImg, this.posicion.x, this.posicion.y, this.h, this.w);
	}
}

const mapa = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
	[1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
	[1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
	[1, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 4, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let pausa = false;
const player = new Player({
	posicion: { x: saltos, y: saltos },
	h: saltos,
	w: saltos,
	destruible: true,
	color: 'blue',
});

let y = 1;
let x = 1;
let key = false;
document.addEventListener('keydown', (e) => {
	switch (e.keyCode) {
		case 87: //arriba
			if (mapa[y - 1][x] === 0 || mapa[y - 1][x] === 4) {
				if (mapa[y - 1][x] === 4) {
					mapa[y - 1][x] = 0;
					monedasRecogidas++;
					coin.play();
				}
				y--;
				player.posicion.y -= saltos;
			}

			break;
		case 83: //abajo
			if (mapa[y + 1][x] === 0 || mapa[y + 1][x] === 4) {
				if (mapa[y + 1][x] === 4) {
					mapa[y + 1][x] = 0;
					monedasRecogidas++;
					coin.play();
				}
				y++;
				player.posicion.y += saltos;
			}
			break;
		case 68: //derecha
			if (mapa[y][x + 1] === 0 || mapa[y][x + 1] === 4) {
				if (mapa[y][x + 1] === 4) {
					mapa[y][x + 1] = 0;
					monedasRecogidas++;
					coin.play();
				}
				x++;
				player.posicion.x += saltos;
				vista = 'derecha';
			}
			break;
		case 65: //izquierda
			if (mapa[y][x - 1] == 0 || mapa[y][x - 1] === 4) {
				if (mapa[y][x - 1] === 4) {
					mapa[y][x - 1] = 0;
					monedasRecogidas++;
					coin.play();
				}
				x--;
				player.posicion.x -= saltos;
				vista = 'izquierda';
			}
			break;
		case 32:
			key = true;
			if (player.bombasUsables > 0) {
				if (mapa[y][x] === 0) {
					mapa[y][x] = 3;
					bombasAct.push(
						new Bomba({
							posicion: { x: player.posicion.x, y: player.posicion.y },
							posArray: { a_x: x, a_y: y },
						})
					);
					player.bombasUsables--;
					soltarBomba.play();
				}
			}

			break;

		case 27: //pausa
			pausa = !pausa;
			ctx.fillStyle = 'rgba(0,0,0,.5';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#fff';
			ctx.font = '80px Arial';
			ctx.fillText(`Pausa`, canvas.width / 2 - 200, canvas.height / 2);
			break;
	}
});
bomberman_start.onended = function () {
	tema.play();
};
window.onload = function () {
	bomberman_start.play();
};

function actualizar() {
	window.requestAnimationFrame(actualizar);

	if (!pausa) {
		repintar();
	}
}

function datosJuegos() {
	contadorTime++;
	if (contadorTime % 60 === 0) {
		time.seg++;
		if (time.seg % 60 === 0) {
			time.min++;
			time.seg = 0;
		}
	}
	ctx.fillStyle = '#000';
	ctx.font = '30px Arial';
	if (time.seg < 10) {
		ctx.fillText(`Time`, canvas.width - 200, 75);
		ctx.fillText(`${time.min}:0${time.seg}`, canvas.width - 180, 100);
	} else {
		ctx.fillText(`Time`, canvas.width - 200, 75);
		ctx.fillText(`${time.min}:${time.seg}`, canvas.width - 200, 100);
	}
	ctx.drawImage(moneda, canvas.width - 200, 150, 30, 30);
	ctx.fillText(`/ ${monedasRecogidas}`, canvas.width - 160, 175);

	ctx.fillText(`Controles:`, canvas.width - 180, 250);
	ctx.font = '20px Arial';
	ctx.fillText(`W`, canvas.width - 140, 280);
	ctx.fillText(`A`, canvas.width - 180, 320);
	ctx.fillText(`S`, canvas.width - 140, 320);
	ctx.fillText(`D`, canvas.width - 100, 320);
	ctx.font = '30px Arial';
	ctx.fillText(`Bombas:`, canvas.width - 180, 360);
	ctx.font = '20px Arial';
	ctx.fillText(`space`, canvas.width - 180, 400);

	ctx.font = '30px Arial';
	ctx.fillText(`Pausa:`, canvas.width - 180, 440);
	ctx.font = '20px Arial';
	ctx.fillText(`esc`, canvas.width - 180, 480);
}

function repintar() {
	if (monedasRecogidas == 5) {
		pausa = !pausa;
	}
	ctx.fillStyle = '#6C9F28';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	bombasAct.forEach((bombaAct) => {
		bombaAct.update();
		bombaAct.tiempoRestante--;

		if (bombaAct.tiempoRestante <= 0) {
			bombaAct.explocion();
		}
	});

	datosJuegos();

	for (let i = 0; i < mapa.length; i++) {
		for (let j = 0; j < mapa[i].length; j++) {
			if (mapa[i][j] === 1) {
				ctx.fillStyle = '#8F8171';
				ctx.fillRect(j * saltos, i * saltos, saltos, saltos);
				if (i > 1 && i < mapa.length - 1 && j > 1 && j < mapa[i].length - 1) {
					ctx.fillStyle = 'rgba(255,255,255,0.5)';
					ctx.fillRect(j * saltos, i * saltos, 5, saltos);
					ctx.fillRect(j * saltos + 5, i * saltos, saltos, 5);

					ctx.fillStyle = '#333';
					ctx.fillRect(j * saltos, i * saltos + saltos - 5, saltos, 5);
				}
			} else if (mapa[i][j] === 2) {
				ctx.lineWidth = 2;
				ctx.styleStroke = '#333';
				ctx.strokeRect(j * saltos, i * saltos, saltos, saltos);
				ctx.fillStyle = '#8D1F10';
				ctx.fillRect(j * saltos, i * saltos, saltos, saltos / 3);
				ctx.fillRect(
					j * saltos,
					i * saltos + saltos / 3 + 2,
					saltos / 2,
					saltos / 3 - 2
				);
				ctx.fillRect(
					j * saltos + saltos / 2 + 2,
					i * saltos + saltos / 3 + 2,
					saltos / 2 - 2,
					saltos / 3 - 2
				);
				ctx.fillRect(
					j * saltos,
					i * saltos + saltos - saltos / 3 + 2,
					saltos,
					saltos / 3 - 4
				);
			} else if (mapa[i][j] === 4) {
				ctx.drawImage(moneda, j * saltos, i * saltos, saltos, saltos);
			} else if (mapa[i][j] === 5) {
				ctx.fillStyle = 'rgba(0,0,0,.7)';
				ctx.fillRect(j * saltos, i * saltos, saltos, saltos);
			}
		}
	}

	if (pausa) {
		ctx.fillStyle = 'rgba(0,0,0,.5';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#fff';
		ctx.font = '80px Arial';
		ctx.fillText(`Victoria`, canvas.width / 2 - 200, canvas.height / 2);
	}
	player.draw();
}

actualizar();
window.requestAnimationFrame(actualizar);
