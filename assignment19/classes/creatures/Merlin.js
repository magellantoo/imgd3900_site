// game.js for Perlenspiel 3.2
// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

/** Class scripting */
class Merlin extends GameObject {
	constructor(params) {
		super(params);
		this.type = "merlin";
		this.altitude = 3;
		this.image = SPRITE_DATA.merlin;
		this.frameSpeed = 15;

		player = this;
		cameraTarget = this;
		this.stunned = 0;

		// Used to prevent bunny-hopping
		this.jumped = false;

		this.touchingAltar = true; // Currently touching altar
		this.touchedAltar = false; // Touched altar last frame

		this.touchingDoor = true; // Currently touching altar
		this.touchedDoor = false; // Touched altar last frame

		this.tool = null;
		this.alt_tool = null;
		this.spriteYInverted = false;

		if (playerData.tool) {
			console.log("Saving tool from last level");
			this.tool = new playerData.tool();
		}
		if (playerData.alt_tool) {
			this.alt_tool = new playerData.alt_tool();
		}

		this.eventListeners["touch"] = this.magic;
		this.eventListeners["camera"] = this.camera;
	}

	tick() {
		// Check for ground
		if (!this.boundingBox) {
			return;
		}
		this.ground = checkCollision(this.boundingBox.left, this.boundingBox.bot, this.width, 1);

		this.touchingAltar = this.touchedAltar;
		this.touchedAltar = false;

		this.touchingDoor = this.touchedDoor;
		this.touchedDoor = false;

		if (this.stunned <= 0) {
			if (controls.left) {
				this.image = SPRITE_DATA.merlin_walk;
				this.spriteXInverted = true;
				this.xVel = -.3;
			} else if (controls.right) {
				this.image = SPRITE_DATA.merlin_walk;
				this.spriteXInverted = false;
				this.xVel = .3;
			} else {
				this.image = SPRITE_DATA.merlin;
				this.xVel = 0;
			}

			// If there is no tool or tool has no jump effect, then do normal jump
			if (!this.tool || (this.tool && !this.tool.jump.apply(this))) {
				if (this.ground.solid) {
					// On ground or standing on something
					this.yVel = 0;
					if (controls.up || controls.space) {
						if (!this.jumped) {
							this.jumped = true;
							this.yVel = -1;
							this.move(0, -1);
						}
					} else {
						this.jumped = false;
					}
				}
			}

			if (controls.down) {
				if (this.tool) {
					this.tool.down();
				}
			}
		} else {
			this.image = SPRITE_DATA.merlin;
			this.stunned--;
		}

		// If there is no tool or tool has no gravity effect, then do normal gravity
		if (!this.tool || (this.tool && !this.tool.gravity.apply(this))) {
			if (!this.ground.solid) {
				// In air
				this.yVel += 0.07;
				if (this.yVel > 1) {
					this.yVel = 1;
				}
			}
		}
	}

	collide(other) {
		if (other.type == "troll") {
			console.log("Ack! Troll");
			this.yVel = -1.5;
			if (other.x > this.x) {
				this.xVel = -.5;
				this.move(-1, -1);
			} else {
				this.xVel = .5;
				this.move(1, -1);
			}
			this.stunned = 30;
		} else if (other.type == "door" || other.type == "door_prev") {
			this.touchedDoor = true;
			if (!this.touchingDoor) {
				console.log("Touched door target: " + other.levelTarget);
				levelChangeReady = other.levelTarget;
			}
		} else if (other.type == "altar") {
			this.touchedAltar = true;
			if (!this.touchingAltar) {
				this.pickup(other);
			}
		}
	}

	magic(x, y) {
		if (this.tool) {
			this.tool.cast(getCollisionAtScreen(x, y));
		}
	}

	pickup(altar) {
		var temp = this.tool;
		if (temp) {
			// Release first
			temp.release();
		}
		if (altar.tool) {
			this.tool = new altar.tool();
			if (PS.dbValid(DB_NAME)) {
				PS.dbEvent(DB_NAME, "tool_gained", this.tool.type);
			}
			if (!playerData[this.tool.type]) {
				showStatus(this.tool.statusText);
				playerData[this.tool.type] = true;
			}
		} else {
			this.tool = null;
		}
		if (temp) {
			altar.image = temp.altarImage;
			altar.tool = temp.constructor;
			objectDeletionQueue[temp.id] = temp;
		} else {
			altar.image = SPRITE_DATA.altar;
			altar.tool = null;
		}
	}

	camera() {
		if (this.spriteYInverted) {
			camera.y += 6;
		} else {
			camera.y -= 6;
		}
	}
}
