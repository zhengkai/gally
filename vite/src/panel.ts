import { NoteList, ColorList, setting } from './setting'
import type { NoteType, ColorType } from './setting';
import { fretboard } from './fretboard'

interface radio {
	name: string;
	list: radioOne[];
	select: string | number;
}

interface radioOne {
	show: string | number | undefined;
	v: string | number;
}

class Panel {
	run() {
		const el = document.querySelector<HTMLDivElement>('#panel')
		if (!el) {
			console.error('Panel element not found');
			return;
		}
		el.innerHTML = this.genHTML();
		this.bindEvent(el);
	}

	genHTML() {
		let s = '<form>';
		s += this.genFret();
		s += this.genNote();
		s += this.genOctave();
		s += this.genColor();
		s += '</form>';
		return s;
	}

	genFret() {
		const r: radio = {
			name: 'fret',
			list: [22, 24].map((f) => ({
				show: `${f} 品`,
				v: f,
			})),
			select: setting.fret,
		};
		return this.htmlRadio(r);
	}

	genNote() {
		const r: radio = {
			name: 'note',
			list: NoteList.map((note) => ({
				show: note.replace('-', ' '),
				v: note,
			})),
			select: setting.noteShow,
		};
		return this.htmlRadio(r);
	}

	genOctave() {
		const r: radio = {
			name: 'octave',
			list: [
				{ show: 'show octave', v: 1 },
				{ show: 'hide octave', v: 0 },
			],
			select: setting.octave ? 1 : 0,
		};
		return this.htmlRadio(r);
	}

	genColor() {
		const r: radio = {
			name: 'color',
			list: ColorList.map((c) => ({
				show: c === 'midi' ? 'note' : c,
				v: c,
			})),
			select: setting.color,
		};
		return this.htmlRadio(r);
	}

	htmlRadio(r: radio) {
		let s = `<div class="${r.name}">`;
		for (const kv of r.list) {
			const checked = r.select === kv.v ? ' checked' : '';
			const show = kv.show === undefined ? kv.v : kv.show;
			s += `<label><input type="radio" name="${r.name}" value="${kv.v}"${checked}>${show}</label>`;
		}
		return `${s}</div>`;
	}

	bindEvent(root: HTMLElement) {
		root.querySelectorAll<HTMLInputElement>('input').forEach((el) => {
			el.addEventListener('change', () => {
				this.refresh();
			});
		})
		fretboard.run()
	}

	refresh() {
		const el = document.querySelector<HTMLDivElement>('#panel')?.querySelector<HTMLFormElement>('form');
		if (!el) {
			console.error('Form element not found');
			return;
		}
		const form = new FormData(el);

		setting.fret = form.get('fret') === '24' ? 24 : 22;

		let note = form.get('note') as string;
		setting.noteShow = (NoteList as readonly string[]).includes(note) ? note as NoteType : NoteList[0];

		setting.octave = form.get('octave') === '1';

		let color = form.get('color') as string;
		setting.color = (ColorList as readonly string[]).includes(color) ? color as ColorType : ColorList[0];

		fretboard.run();
	}
}

export const panel = new Panel();
