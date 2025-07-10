class Sound {

	playMIDI(note: number) {
		const freq = 440 * Math.pow(2, (note - 69) / 12);
		if (!(freq > 25 && freq < 13000)) {
			return;
		}
		this.play(freq);
	}

	play(freq: number, dur: number = 0.5) {

		const ctx = new window.AudioContext();
		const o = ctx.createOscillator();
		const n = ctx.createGain();
		const now = ctx.currentTime;
		const g = n.gain;

		o.connect(n);
		n.connect(ctx.destination);

		o.type = 'sine';

		o.frequency.setValueAtTime(freq, now);

		g.setValueAtTime(0, now);

		g.linearRampToValueAtTime(0.5, now + 0.01);
		g.linearRampToValueAtTime(0.5, now + dur - 0.01);
		g.linearRampToValueAtTime(0, now + dur);

		o.onended = () => {
			n.disconnect();
		}

		o.start(now);
		o.stop(now + dur);
	}
}

export const sound = new Sound();
