class Fretboard {

	config = {

	}

	tuning = [40, 45, 50, 55, 59, 64];
	noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

	run() {
		document.querySelector<HTMLDivElement>('#fretboard')!.innerHTML = this.genHTML();
	}

	getSymbol(stringID: number, fretID: number): string {
		const symbol = this.noteNames[(this.tuning[stringID] + fretID) % 12];
		const level = Math.floor((this.tuning[stringID] + fretID) / 12);
		return `${symbol}${level}`;
	}

	genHTML() {

		let s = '';
		[...Array(6).keys()].forEach(stringID => {
			s += `<div class="string" id="string-${stringID}">`;
			[...Array(24).keys()].forEach(fertID => {
				s += `<div class="fret" id="fret-${stringID}-${fertID}"><div class="symbol">${this.getSymbol(stringID, fertID)}</div></div>`;
			})
			s += '</div>';
		})

		return s;
	}
}

export const fretboard = new Fretboard();
