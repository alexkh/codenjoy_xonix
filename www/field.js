// game state
function Field() {
	var my = this
	// map stores 1 for each filled square and 0 for non-filled one
	// sum of all elements of map array is the total volume
	my.field_size = [20, 15]
	my.map = []
	my.n_internal_balls = 1 // balls on the player's space of the field
	my.player_pos = [10, 1]
	my.player_dir = [0, 0]
	my.ball_pos = [[0, 1]]
	my.ball_dir = [[1, -1]]
	my.init = function() {
		my.map = new Array(my.field_size[0] * my.field_size[1]).fill(0)
		for(let i = 0; i < my.field_size[0]; ++i) {
			my.map[i] = 1;
			my.map[i + my.field_size[0]] = 1;
			my.map[i + my.map.length - my.field_size[0] * 2] = 1;
			my.map[i + my.map.length - my.field_size[0]] = 1;
		}
		for(let i = 2; i < my.field_size[1] - 2; ++i) {
			my.map[i * my.field_size[0]] = 1;
			my.map[i * my.field_size[0] + 1] = 1;
			my.map[i * my.field_size[0] + my.field_size[0] - 1] = 1;
			my.map[i * my.field_size[0] + my.field_size[0] - 2] = 1;
		}
	}
	my.draw = function() {
		var output = "<pre>"
		for(let i = 0; i < my.field_size[1]; ++i) {
			let str = ""
			for(let j = 0; j < my.field_size[0]; ++j) {
				let val = my.map[i * my.field_size[0] + j]
				// also show balls
				for(let k = 0; k < my.ball_pos.length; ++k) {
					if(my.ball_pos[k][0] == j &&
						my.ball_pos[k][1] == i) {
						val = "o"
					}
					if(my.player_pos[0] == j &&
						my.player_pos[1] == i) {
						val = "@"
					}
				}
				str += val
			}
			output += str
			output += "\n"
		}
		$("#field").html(output)
	}
	my.print = function() {
		for(let i = 0; i < my.field_size[1]; ++i) {
			let str = ""
			for(let j = 0; j < my.field_size[0]; ++j) {
				let val = my.map[i * my.field_size[0] + j]
				// also show balls
				for(let k = 0; k < my.ball_pos.length; ++k) {
					if(my.ball_pos[k][0] == j &&
						my.ball_pos[k][1] == i) {
						val = "o"
					}
					if(my.player_pos[0] == j &&
						my.player_pos[1] == i) {
						val = "@"
					}
				}
				str += val
			}
			console.log(str)
		}
		console.log("")
	}
	// returns null if no change, new direction vector if change is needed
	my.new_dir = function(ball_number) {
		let pos = my.ball_pos[ball_number]
		let dir = my.ball_dir[ball_number]
		let isinternal = my.map[pos[0] + pos[1] * my.field_size[0]]
		// calculate indexes of 3 adjacent squares in map array
		let adj_x = pos[0] + dir[0] +
				pos[1] * my.field_size[0]
		let adj_y = pos[0] + (pos[1] + dir[1]) * my.field_size[0]
		let adj_z = pos[0] + dir[0] +
				(pos[1] + dir[1]) * my.field_size[0]
		// check for wall: xwall, ywall, zwall
		let xwall = false // assuming there is no wall
		if(isinternal !== my.map[adj_x] ||
			(pos[0] + dir[0] < 0) ||
			(pos[0] + dir[0] > my.field_size[0] - 1)) {
			xwall = true
		}
		let ywall = false
		if(isinternal !== my.map[adj_y] ||
			(pos[1] + dir[1] < 0) ||
			(pos[1] + dir[1] > my.field_size[1] - 1)) {
			ywall = true
		}
		let zwall = false
		if(isinternal !== my.map[adj_z] ||
				xwall || ywall) {
			zwall = true
		}
		if(!zwall) {
			return null
		}
		let new_dir = [dir[0], dir[1]]
		if(xwall) {
			new_dir[0] *= -1
		}
		if(ywall) {
			new_dir[1] *= -1
		}
		return [new_dir[0], new_dir[1]]
	}
	my.sim = function() {
		// maximum 2 iterations of change directions
		for(let i = 0; i < my.ball_pos.length; ++i) {
			let newdir = my.new_dir(i)
			if(newdir) {
				my.ball_dir[i][0] = newdir[0]
				my.ball_dir[i][1] = newdir[1]
				if(newdir = my.new_dir(i)) {
					console.log(newdir)
					// second direction change needed,
					// meanind the ball is stuck, so no move
					console.log("Second direction change")
					continue
				}
			}
			// do move according to new direction
			my.ball_pos[i][0] += my.ball_dir[i][0]
			my.ball_pos[i][1] += my.ball_dir[i][1]
		}
		// move player
		let newpos = [my.player_pos[0] + my.player_dir[0],
				my.player_pos[1] + my.player_dir[1]]
		if(newpos[0] < 0 || newpos[0] > my.field_size[0] - 1 ||
			newpos[1] < 0 || newpos[1] > my.field_size[1] - 1) {
			my.player_dir = [0, 0]
		} else {
			my.player_pos = newpos
		}
	}
}

