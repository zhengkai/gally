import { setting } from './setting'
import { Hct, hexFromArgb } from "@material/material-color-utilities";
import { sound } from './sound';

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

	noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	sharp = ['C♯', 'D♯', 'F♯', 'G♯', 'A♯'];
	flat = ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'];

	marker = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

	run() {
		this.init();
		const o = document.querySelector<HTMLDivElement>('#fretboard');
		if (!o) {
			return;
		}
		o.innerHTML = this.genHTML();
		this.hookEvent(o);
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

	getLabel(fretID: number): string {
		if (fretID === 0) {
			return 'Nut';
		}
		return `${fretID}`;
	}

	genHTML() {
		if (setting.color !== 'none') {
			this.genColor(setting.color === 'octave');
		}
		let s = `<table class="string ${setting.octave ? 'show' : 'hide'}-octave ${setting.color ? 'show' : 'hide'}-color">`;
		setting.tone.forEach((startTone, stringID) => {
			s += `<tr class="string" id="string-${stringID}">`;
			[...Array(setting.fret + 1).keys()].forEach(fretID => {
				const midiID = startTone + fretID;
				const note = this.note[midiID];
				const sn = this.genHTMLNote(note);
				s += `<td id="fret-${stringID}-${fretID}">${sn}</td>`;
			})
			s += '</tr>';
		})
		s += '</table><table class="label">';
		s += `<tr class="marker">`;
		[...Array(setting.fret + 1).keys()].forEach(fretID => {
			if (this.marker.includes(fretID)) {
				let marker = 1;
				let h = '⬤';
				if (fretID % 12 === 0) {
					marker = 2;
					h += "<br>" + h;
				}
				s += `<td class="marker-${marker}"><div>${h}</div></td>`;
			} else {
				s += `<td></td>`;
			}
		})
		s += `</tr><tr class="name">`;
		[...Array(setting.fret + 1).keys()].forEach(fretID => {
			s += `<td><div>${this.getLabel(fretID)}</div></td>`;
		})
		s += '</tr></table>';

		return s;
	}

	genHTMLNote(note: Note) {
		let s = '';
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
		if (!pitch) {
			return '';
		}
		let octave = setting.octave ? `<sub>${note.octave}</sub>` : '';
		let color = '';
		if (setting.color !== 'none') {
			const id = setting.color === 'octave' ? note.octave : note.midi;
			color = ` text-color-${id}`;
		}
		s = `<div class="${color}" data-midi="${note.midi}">${pitch}${octave}</div>`;
		return s;
	}

	genColor(byOctave = true) {
		let ol: number[] = [];
		setting.tone.forEach((startTone) => {
			[...Array(setting.fret + 1).keys()].forEach(fretID => {
				const midiID = startTone + fretID;
				if (byOctave) {
					const note = this.note[midiID];
					ol.push(note.octave);
				} else {
					ol.push(midiID);
				}
			});
		});
		ol = [...new Set(ol)].sort();

		const len = ol.length;
		ol.forEach((octave, i) => {
			const color = hexFromArgb(Hct.from(360 * i / len, 75, 75).toInt());
			document.documentElement.style.setProperty(`--text-color-${octave}`, color);
		});
	}

	hookEvent(o: HTMLElement) {
		(o.querySelectorAll('div[data-midi]') as NodeListOf<HTMLDivElement>).forEach((el: HTMLDivElement) => {
			el.addEventListener('click', () => {
				const midi = parseInt(el.getAttribute('data-midi') || '0');
				sound.playMIDI(midi);
			});
		});
	}
}

export const fretboard = new Fretboard();
