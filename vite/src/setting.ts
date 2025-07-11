export const NoteList = ['natural-only', 'number', 'sharp', 'flat'] as const;
export type NoteType = typeof NoteList[number];

export const ColorList = ['octave', 'midi', 'none'] as const;
export type ColorType = typeof ColorList[number];

class Setting {
	tone = [64, 59, 55, 50, 45, 40];
	fret = 24;
	noteShow: NoteType = NoteList[0];
	octave = true;
	color: ColorType = ColorList[0];
}

export const setting = new Setting();
