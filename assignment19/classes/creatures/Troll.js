// game.js for Perlenspiel 3.2
// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

/** Class scripting */
class Troll extends GameObject {
	constructor(params) {
		super(params);
		this.type = "troll";
		this.altitude = 2;
		this.image = SPRITE_DATA.troll;
		this.frameSpeed = 20;

		this.width = 9;
		this.height = 11;
		this.widthOffset = 0;
		this.heightOffset = 1;

		if (!params.homeX) {
			this.homeX = this.x;
			this.homeY = this.y;
		} else {
			this.homeX = params.homeX;
			this.homeY = params.homeY;
			this.x = this.homeX;
			this.y = this.homeY;
		}
	}

	spawnParams() {
		var ret = super.spawnParams();
		ret.homeX = this.homeX;
		ret.homeY = this.homeY;

		return ret;
	}

	tick() {
		if (!this.boundingBox) {
			return;
		}

		// Check distance to merlin
		// Range = 16?
		var selfLoc = this.x + (this.width / 2);
		var merlinLoc = player.x + (player.width / 2);

		var distance = Math.abs(selfLoc - merlinLoc);
		this.image = SPRITE_DATA.troll;

		// Check if troll is on ground
		var ground = checkCollision(this.boundingBox.left, this.boundingBox.bot, this.width, 1);

		if (distance <= 16) {
			
			var edge = null;
			this.image = SPRITE_DATA.troll_walk;
			if (selfLoc > merlinLoc) {
				edge = checkCollision(this.boundingBox.left - 1, this.boundingBox.top, 1, this.height);
				this.xVel = -0.2;
				this.spriteXInverted = true;
			} else {
				edge = checkCollision(this.boundingBox.right, this.boundingBox.top, 1, this.height);
				this.xVel = 0.2;
				this.spriteXInverted = false;
			}
			if (ground.solid && edge && edge.solid) {
				// On ground or standing on something
				this.yVel = -.5;
			}
		} else if (Math.abs(this.x - this.homeX) >= 4) {
			var edge = null;
			this.image = SPRITE_DATA.troll_walk;
			if (this.x > this.homeX) {
				edge = checkCollision(this.boundingBox.left - 1, this.boundingBox.top, 1, this.height);
				this.xVel = -0.1;
				this.spriteXInverted = true;
			} else {
				edge = checkCollision(this.boundingBox.right, this.boundingBox.top, 1, this.height);
				this.xVel = 0.1;
				this.spriteXInverted = false;
			}
			if (ground.solid && edge && edge.solid) {
				// On ground or standing on something
				this.yVel = -.5;
			}
		} else {
			this.xVel = 0.0;
			if (ground.solid) {
				// On ground or standing on something
				this.yVel = 0;
			}
		}

		if (!ground.solid) {
			// In air
			this.yVel += 0.07;
			if (this.yVel > 1) {
				this.yVel = 1;
			}
		}
	}
}
