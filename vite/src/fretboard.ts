class Fretboard {

	run() {
		console.log("Fretboard is running");

		document.querySelector<HTMLDivElement>('#fretboard')!.innerHTML = this.genHTML();
	}

	genHTML() {
		return 'Fretboard is running';
	}
}

export const fretboard = new Fretboard();
