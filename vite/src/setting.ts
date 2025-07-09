export const NoteList = ['natural-only', 'sharp', 'flat'] as const;
export type NoteType = typeof NoteList[number];

class Setting {
	fret = 24; // 品数，22 或 24
	noteShow: NoteType = NoteList[0];
	octave = true;
	color = true;
}

export const setting = new Setting();
