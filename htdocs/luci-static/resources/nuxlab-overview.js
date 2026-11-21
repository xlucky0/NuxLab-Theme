'use strict';
'require baseclass';

// Keep the native counters and tooltip, adding structure after each poll render.
return baseclass.extend({
	__init__: function() {
		var view = document.querySelector('#view');
		if (!view)
			return;

		var frame = null;
		var trafficHistory = new WeakMap();
		var trafficFrames = new WeakMap();
		var parseTraffic = function(value) {
			var match = /^([0-9]+(?:\.[0-9]+)?)\s*(.*)$/.exec(value);
			if (!match)
				return null;
			var unit = match[2].trim();
			var scale = { B: 1, KiB: 1024, MiB: 1048576, GiB: 1073741824,
				kB: 1000, MB: 1000000, GB: 1000000000 }[unit];
			return scale ? { amount: parseFloat(match[1]) * scale, unit: unit, number: parseFloat(match[1]) } : null;
		};
		var animateTraffic = function(node, value) {
			if (node.textContent === value)
				return;
			var previous = parseTraffic(node.textContent);
			var next = parseTraffic(value);
			if (!previous || !next || previous.unit !== next.unit) {
				node.textContent = value;
				return;
			}
			var priorFrame = trafficFrames.get(node);
			if (priorFrame)
				cancelAnimationFrame(priorFrame);
			var started = performance.now();
			var precision = Math.min(2, (value.split('.')[1] || '').match(/^\d+/)?.[0].length || 0);
			var tick = function(now) {
				if (document.hidden) {
					trafficFrames.delete(node);
					return;
				}
				var progress = Math.min(1, (now - started) / 360);
				var amount = previous.number + (next.number - previous.number) * progress;
				node.textContent = progress === 1 ? value : amount.toFixed(precision) + ' ' + next.unit;
				if (progress < 1)
					trafficFrames.set(node, requestAnimationFrame(tick));
				else
					trafficFrames.delete(node);
			};
			trafficFrames.set(node, requestAnimationFrame(tick));
		};
		var updateSparkline = function(node, value) {
			var parsed = parseTraffic(value);
			if (!parsed)
				return;
			var history = trafficHistory.get(node) || [];
			if (!history.length || history[history.length - 1] !== parsed.amount) {
				history.push(parsed.amount);
				if (history.length > 12)
					history.shift();
				trafficHistory.set(node, history);
			}
			var min = Math.min.apply(null, history);
			var range = Math.max(1, Math.max.apply(null, history) - min);
			var points = history.map(function(sample, index) {
				var x = history.length > 1 ? index * 64 / (history.length - 1) : 64;
				var y = 16 - ((sample - min) / range) * 14;
				return x.toFixed(1) + ',' + y.toFixed(1);
			}).join(' ');
			var line = node.querySelector('polyline');
			if (line)
				line.setAttribute('points', points);
		};
		var annotateWirelessSignal = function() {
			view.querySelectorAll('td, span, div, li').forEach(function(node) {
				var text = Array.from(node.childNodes).filter(function(child) {
					return child.nodeType === 3;
				}).map(function(child) {
					return child.textContent;
				}).join(' ');
				var match = /(-\d{2,3})\s*dBm\b/i.exec(text);
				if (!match)
					return;
				var dbm = Math.max(-90, Math.min(-30, parseInt(match[1], 10)));
				var level = Math.round((dbm + 90) * 100 / 60);
				if (node.dataset.nuxlabSignal !== String(level)) {
					node.dataset.nuxlabSignal = String(level);
					[
						Math.max(14, 14 + level * .3),
						Math.max(17, 17 + level * .44),
						Math.max(21, 21 + level * .65),
						Math.max(25, 25 + level * .75)
					].forEach(function(height, index) {
						node.style.setProperty('--nuxlab-signal-bar-' + (index + 1), Math.min(100, height) + '%');
					});
				}
			});
		};
		var update = function() {
			frame = null;
			if (document.hidden)
				return;
			annotateWirelessSignal();
			view.querySelectorAll('.ifacebox > .ifacebox-body > img[src*="/icons/port_"]').forEach(function(icon) {
				var box = icon.parentNode.parentNode;
				box.parentNode.classList.add('nuxlab-port-grid');
				var container = box.lastElementChild.querySelector('.cbi-tooltip-container');
				if (!container)
					return;
				var values = {};
				var nodes = Array.from(container.childNodes);
				nodes.forEach(function(node) {
					if (node.nodeType !== 3)
						return;
					var text = node.textContent.trim();
					if (text.charAt(0) === '▲' || text.charAt(0) === '▼')
						values[text.charAt(0)] = text.slice(1).trim();
				});
				if (!values['▲'] || !values['▼'])
					return;

				var existing = container.querySelector('.nuxlab-port-traffic');
				if (existing) {
					[ [ 'tx', values['▲'] ], [ 'rx', values['▼'] ] ].forEach(function(entry) {
						var row = existing.querySelector('[data-direction="' + entry[0] + '"]');
						var value = row && row.querySelector('dd > span');
						if (!value)
							return;
						animateTraffic(value, entry[1]);
						updateSparkline(row.querySelector('svg'), entry[1]);
					});
					return;
				}

				var list = document.createElement('dl');
				list.className = 'nuxlab-port-traffic';
				[
					[ 'tx', 'TX', _('Transmitted bytes'), values['▲'] ],
					[ 'rx', 'RX', _('Received bytes'), values['▼'] ]
				].forEach(function(entry) {
					var row = document.createElement('div');
					var label = document.createElement('dt');
					var value = document.createElement('dd');
					var number = document.createElement('span');
					var sparkline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
					row.dataset.direction = entry[0];
					label.textContent = entry[1];
					label.title = entry[2];
					number.textContent = entry[3];
					sparkline.setAttribute('viewBox', '0 0 64 18');
					sparkline.setAttribute('aria-hidden', 'true');
					line.setAttribute('points', '64,9');
					sparkline.append(line);
					value.append(number, sparkline);
					updateSparkline(sparkline, entry[3]);
					row.append(label, value);
					list.append(row);
				});
				nodes.forEach(function(node) {
					if (node.nodeType === 3 || node.nodeName === 'BR')
						node.remove();
				});
				container.prepend(list);
			});
		};
		var schedule = function() {
			if (frame === null && !document.hidden)
				frame = requestAnimationFrame(update);
		};
		new MutationObserver(schedule).observe(view, { childList: true, subtree: true, characterData: true });
		document.addEventListener('visibilitychange', function() {
			if (!document.hidden)
				schedule();
		});
		schedule();
	}
});
