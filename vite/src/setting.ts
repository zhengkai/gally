export const NoteList = ['natural-only', 'sharp', 'flat'] as const;
export type NoteType = typeof NoteList[number];

class Setting {
	tune = [64, 59, 55, 50, 45, 40];
	fret = 24;
	noteShow: NoteType = NoteList[0];
	octave = true;
	color = true;
}

export const setting = new Setting();
