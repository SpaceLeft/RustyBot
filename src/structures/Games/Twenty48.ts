const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max))
const SPRITES = [
    '<:empty:809450298091372544>',
    ':black_large_square:',
    '<:2_:809449391776727080>',
    '<:4_:809449391760605245>',
    '<:8_:809449392385032273>',
    '<:16:809449393321017365>',
    '<:32:809449394360811530>',
    '<:64:809449397125251112>',
    '<:128:809449398916218900>',
    '<:256:809449399427399710>',
    '<:512:809449399305764894>',
    '<:1024:809449399104045057>',
    '<:2048:809449399959945227>',
    '4096 ',
    '8192 ',
    '16384 ',
]

type Grid = Array<Array<number>>;

class Twenty48 {
	public grid: Grid = Array.from({ length: 4 }, () => Array(4).fill(0));
	public moves = 0;
	public score = 0;

	constructor() {
	    this.spawn_random()
	    this.spawn_random()
	}

	spawn_random(): void {
	    let r: number, c: number

	    r = randomInt(3)
	    c = randomInt(3)

	    while (this.grid[r][c] !== 0) {
	        r = randomInt(3)
	        c = randomInt(3)
	    }

	    this.grid[r][c] = 2
	}
	isWin(): boolean {
	    return this.grid.flat().includes(2048)
	}
	isLoss(): boolean {
	    return !this.grid.flat().includes(0)
	}
	compress(grid: Grid): Grid {
	    const new_grid = Array.from({
	        length: 4
	    }, () => Array(4).fill(0))

	    for (let i = 0; i < 4; i++) {
	        let k = 0
	        for (let j = 0; j < 4; j++) {
	            if (grid[i][j] !== 0) {
	                new_grid[i][k] = grid[i][j]
	                k++
	            }
	        }
	    }
	    return new_grid
	}
	merge(grid: Grid): Grid {
	    for (let i = 0; i < 4; i++) {
	        for (let j = 0; j < 3; j++) {
	            if (grid[i][j] !== 0 && grid[i][j] === grid[i][j + 1]) {
	                grid[i][j] = grid[i][j] + 1
	                this.score += 2 ** (grid[i][j] - 1)
	                grid[i][j + 1] = 0
	            }
	        }
	    }
	    return grid
	}
	reverse(grid: Grid): Grid {
	    const new_grid = []
	    for (let i = 0; i < 4; i++) {
	        new_grid.push([])
	        for (let j = 0; j < 4; j++) {
	            new_grid[i].push(grid[i][3 - j])
	        }
	    }
	    return new_grid
	}
	transpose(grid: Grid): Grid {
	    const new_grid = []
	    for (let i = 0; i < 4; i++) {
	        new_grid.push([])
	        for (let j = 0; j < 4; j++) {
	            new_grid[i].push(grid[j][i])
	        }
	    }
	    return new_grid
	}
	left(grid: Grid): Grid {
	    return this.compress(this.merge(this.compress(grid)))
	}
	right(grid: Grid): Grid {
	    return this.reverse( this.left(this.reverse(grid)))
	}
	up(grid: Grid): Grid {
	    return this.transpose(this.left(this.transpose(grid)))
	}
	down(grid: Grid): Grid {
	    return this.transpose(this.right(this.transpose(grid)))
	}
	toString(): string {
	    return this.grid.flat().map((item, index) => SPRITES[item] + ((index !== 0 && (index + 1) % 4 === 0) ? '\n' : '')).join('')
	}
	getStats(): string {
	    return `Score: **${this.score}** | Moves: **${this.moves}**`
	}
}

export default Twenty48