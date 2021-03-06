// game.js for Perlenspiel 3.2
// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

/** Class scripting */
class Staff extends GameObject {
	constructor(params) {
		super(params);
		this.type = "staff";
		this.image = SPRITE_DATA.staff;
		this.ephemeral = true;

		this.dontRegenerate = true;

		this.altarImage = SPRITE_DATA.altar_staff
		this.target = null;
		this.holder = player;
		this.statusText = [
			"It's a powerful staff!",
			"Click to move blocks!"
		];
	}

	tick() {
		if (this.target) {
			this.target.move(
				controls.mouseX + camera.x - WIDTH/2 - 2 - this.target.x,
				controls.mouseY + camera.y - HEIGHT/2 - 3 - this.target.y);
			if (Math.abs(this.target.x + 2 - (controls.mouseX + camera.x - WIDTH/2)) > 2 ||
				Math.abs(this.target.y + 2 - (controls.mouseY + camera.y - HEIGHT/2)) > 2) {
				this.drop();
			}
		}
	}

	draw() {
		// Overloaded draw function
		// Follows merlin
		this.spriteInverted = this.holder.spriteInverted;
		this.x = this.holder.x + (this.spriteInverted ? -1 : 4);
		this.y = this.holder.y;

		super.draw();
	}

	cast (targets) {
		if (this.target == null) {
			for (var obj of Object.keys(targets)) {
				if (targets[obj] && targets[obj].type == "box") {
					this.target = targets[obj];
					this.target.image = SPRITE_DATA.box_active;
					this.image = SPRITE_DATA.staff_active;
					return;
				}
			}
		} else {
			this.drop();
		}
	}

	drop() {
		if (this.target) {
			this.target.image = SPRITE_DATA.box;
			this.image = SPRITE_DATA.staff;
			this.target = null;
		}
	}
}
