const WINNING_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

class XO {
	public state: string[] = Array.from({ length: 9 });
	public currentPlayer: string;

	constructor(public players: string[]) {
	    this.currentPlayer = players[0]
	}

	add(index: number): void {
	    this.state[index] = this.currentPlayer === this.players[0] ? '🇽' : '🅾️'
	    this.currentPlayer = this.players.find((p) => p !== this.currentPlayer)
	}
	AI(): void {
	    for (let x = 0; x < 1000; x++) {
	        const i = Math.floor(Math.random() * 9)
	        if (this.canPlay('AI', i)) {
	            this.add(i)
	            break
	        }
	    }
	}
	canPlay(id: string, index: number): boolean {
	    return this.currentPlayer === id && !this.state[index]
	}
	toString(): string {
	    return this.state.map((item, index) => `${item || '⬜'} ${(index + 1) % 3 === 0 ? '\n' : ''}`).join('')
	}
	noWinner(): boolean {
	    return this.state.filter(value => !value).length === 0
	}
	check(): boolean {
	    const s = this.state
	    for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
	        const a = s[WINNING_CONDITIONS[i][0]],
	            b = s[WINNING_CONDITIONS[i][1]],
	            c = s[WINNING_CONDITIONS[i][2]]
	        if ([a, b, c].some(value => !value)) continue
	        if (a === b && b === c) return true
	    }
	    return false
	}
}

export default XO