import { setting } from './setting'

interface Note {
	midi: number;
	octave: number;
	pitch: string;
	natural: boolean;
	sharp: string | null;
	flat: string | null;
}

class Fretboard {

	note: Note[] = [];

	tuning = [64, 59, 55, 50, 45, 40]; // E A D G B E
	noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	sharp = ['C♯', 'D♯', 'F♯', 'G♯', 'A♯'];
	flat = ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'];

	run() {
		this.init();
		document.querySelector<HTMLDivElement>('#fretboard')!.innerHTML = this.genHTML();
	}

	init() {
		if (this.note.length) {
			return;
		}
		[...Array(128).keys()].forEach((i: number) => {
			const pitch = this.noteNames[i % 12];
			const idx = this.sharp.indexOf(pitch);
			const natural = idx == -1;
			const note = {
				midi: i,
				octave: Math.floor(i / 12) - 1,
				pitch,
				natural,
				sharp: null,
				flat: null,
			} as Note;
			if (!natural) {
				note.sharp = pitch;
				note.flat = this.flat[idx];
			}
			this.note.push(note);
		});

	}

	getSymbol(stringID: number, fretID: number): string {
		const midiID = this.tuning[stringID] + fretID
		const symbol = this.noteNames[midiID % 12];
		const level = Math.floor(midiID / 12) - 1;
		return `${symbol}${level}`;
	}

	getLabel(fretID: number): string {
		if (fretID === 0) {
			return '弦枕';
		}
		return `${fretID} 品`;
	}

	genHTML() {

		let s = `<table class="string ${setting.octave ? 'show-octave' : 'hide-octave'}">`;
		[...Array(6).keys()].forEach(stringID => {
			s += `<tr class="string" id="string-${stringID}">`;
			[...Array(setting.fret + 1).keys()].forEach(fretID => {
				const midiID = this.tuning[stringID] + fretID;
				const note = this.note[midiID];
				let sn = '';

				let pitch = '';
				if (note.natural) {
					pitch = note.pitch;
				} else {
					switch (setting.noteShow) {
						case 'flat':
							pitch = note.flat || note.pitch;
							break;
						case 'sharp':
							pitch = note.sharp || note.pitch;
							break;
					}
				}
				if (pitch) {

					let octave = setting.octave ? `<sub>${note.octave}</sub>` : '';
					sn = `<div class="symbol">${pitch}${octave}</div>`;
				}
				s += `<td class="fret" id="fret-${stringID}-${fretID}">${sn}</td>`;
			})
			s += '</tr>';
		})
		s += '</table><table class="label">';
		s += `<tr>`;
		[...Array(25).keys()].forEach(fertID => {
			s += `<td class="fret"><div>${this.getLabel(fertID)}</div></td>`;
		})
		s += '</tr></table>';

		return s;
	}
}

export const fretboard = new Fretboard();
