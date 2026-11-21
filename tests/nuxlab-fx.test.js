'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../htdocs/luci-static/resources/nuxlab-fx.js'), 'utf8');
const overview = fs.readFileSync(path.join(__dirname, '../htdocs/luci-static/resources/nuxlab-overview.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '../less/fx.less'), 'utf8');

function fixture(options = {}) {
	const listeners = new Map();
	const frames = new Map();
	const media = {
		reduced: { matches: !!options.reduced, addEventListener(type, fn) { this.listener = fn; } },
		pointer: { matches: options.pointer !== false }
	};
	const html = {
		dataset: { nuxlabFx: options.fx || 'full' },
		style: { setProperty() {} }
	};
	const document = Object.assign(new EventTarget(), {
		documentElement: html,
		body: { dataset: { page: options.page || 'admin-status' } },
		hidden: false,
		getElementById() { return null; }
	});
	const window = Object.assign(new EventTarget(), {
		innerWidth: 1000,
		innerHeight: 700,
		matchMedia(query) {
			return query.includes('reduced-motion') ? media.reduced : media.pointer;
		}
	});
	class MutationObserver {
		constructor(callback) { this.callback = callback; }
		observe() {}
	}
	let nextFrame = 0;
	const requestFrame = callback => {
		const id = ++nextFrame;
		frames.set(id, callback);
		return id;
	};
	const cancelFrame = id => frames.delete(id);
	const api = new Function(
		'baseclass', 'document', 'window', 'navigator', 'MutationObserver',
		'requestAnimationFrame', 'cancelAnimationFrame', source
	)(
		{ extend: value => value }, document, window,
		{ hardwareConcurrency: options.cores || 8, deviceMemory: options.memory || 8 },
		MutationObserver, requestFrame, cancelFrame
	);
	api.__init__();
	return { api, document, html, media, frames, listeners, window };
}

test('effective mode respects saved mode, reduced motion, and low-core fallback', () => {
	assert.equal(fixture({ fx: 'off' }).html.dataset.nuxlabFxEffective, 'off');
	assert.equal(fixture({ fx: 'saver' }).html.dataset.nuxlabFxEffective, 'saver');
	assert.equal(fixture({ cores: 2 }).html.dataset.nuxlabFxEffective, 'saver');
	assert.equal(fixture({ memory: 2 }).html.dataset.nuxlabFxEffective, 'saver');
	assert.equal(fixture({ reduced: true }).html.dataset.nuxlabFxEffective, 'off');
	assert.equal(fixture({}).html.dataset.nuxlabFxEffective, 'full');
});

test('frame timing falls back to saver when average frame time exceeds 24ms', () => {
	const state = fixture();
	let timestamp = 0;
	for (let i = 0; state.frames.size && i < 200; i++) {
		const entry = Array.from(state.frames.entries())[0];
		assert.ok(entry);
		state.frames.delete(entry[0]);
		entry[1](timestamp);
		timestamp += 25;
	}
	assert.equal(state.html.dataset.nuxlabFxEffective, 'saver');
});

test('visibility and preference changes stop motion and enforce reduced-motion off', () => {
	const state = fixture();
	state.document.hidden = true;
	state.document.dispatchEvent(new Event('visibilitychange'));
	assert.equal(state.html.dataset.nuxlabHidden, 'true');
	state.document.hidden = false;
	state.document.dispatchEvent(new Event('visibilitychange'));
	assert.equal('nuxlabHidden' in state.html.dataset, false);
	state.media.reduced.matches = true;
	state.media.reduced.listener();
	assert.equal(state.html.dataset.nuxlabFxEffective, 'off');
});

test('tilt and meter decorators are restricted to overview selectors', () => {
	assert.match(source, /admin-status', 'admin-status-overview/);
	assert.match(source, /\.cbi-section\.fade-in/);
	assert.match(source, /data-nuxlab-tilt/);
	assert.match(source, /style\.width/);
	assert.doesNotMatch(source, /#modal_overlay|\.cbi-dropdown|\.table/);
	assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
	assert.match(source, /\(\.5 - y\) \* 14/);
});

test('live indicators consume existing DOM updates without adding a polling timer', () => {
	assert.match(overview, /new MutationObserver\(schedule\)/);
	assert.match(overview, /\(dbm \+ 90\) \* 100 \/ 60/);
	assert.match(overview, /--nuxlab-signal-bar-/);
	assert.match(overview, /animateTraffic/);
	assert.match(overview, /updateSparkline/);
	assert.doesNotMatch(overview, /setInterval|setTimeout/);
	assert.match(styles, /nuxlab-fx-signal-ping/);
});