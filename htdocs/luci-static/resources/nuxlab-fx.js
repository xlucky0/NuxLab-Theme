'use strict';
'require baseclass';

return baseclass.extend({
	__init__: function() {
		var html = document.documentElement;
		var view = document.getElementById('view');
		var isOverviewPage = [ 'admin-status', 'admin-status-overview' ].includes(document.body.dataset.page);
		var savedMode = html.dataset.nuxlabFx;
		var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		var pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
		var updateFrame = null;
		var pointerFrame = null;
		var performanceFrame = null;
		var lastFrame = 0;
		var frameTotal = 0;
		var frameCount = 0;
		var monitorStart = 0;
		var frameSaver = false;
		var performanceChecked = false;
		var tiltSelector = [
			'#view > .cbi-section.fade-in',
			'#view > .Dashboard .dashboard-kpi-row > .cbi-section',
			'#view > .Dashboard .dashboard-charts > .cbi-section',
			'#view > .Dashboard .ifacebox',
			'#view .nuxlab-port-grid > .ifacebox'
		].join(', ');

		var setMode = function(mode) {
			html.dataset.nuxlabFxEffective = mode;
		};

		var initialMode = function() {
			if (reducedMotion.matches || savedMode === 'off')
				return 'off';
			if (savedMode === 'saver' || frameSaver ||
				(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
				(navigator.deviceMemory && navigator.deviceMemory <= 2))
				return 'saver';
			return 'full';
		};
		window.addEventListener('nuxlab-visual-settings-saved', function(event) {
			var settings = event.detail || {};
			if ([ 'full', 'saver', 'off' ].includes(settings.fx_mode))
				savedMode = settings.fx_mode;
			if ([ 'aurora', 'cyber', 'mono' ].includes(settings.preset))
				html.dataset.nuxlabPreset = settings.preset;
			if ([ '0', '1' ].includes(settings.rgb_mode))
				html.dataset.nuxlabRgb = settings.rgb_mode;
			if ([ 'off', 'slow', 'normal', 'fast' ].includes(settings.rgb_speed))
				html.dataset.nuxlabRgbSpeed = settings.rgb_speed;
			setMode(initialMode());
			scheduleUpdate();
		});

		var annotateMeters = function() {
			if (!view || !isOverviewPage)
				return;
			view.querySelectorAll('.cbi-progressbar > div').forEach(function(fill) {
				if (!/^\s*\d+(?:\.\d+)?%\s*$/.test(fill.style.width))
					return;
				var width = Math.max(0, Math.min(100, parseFloat(fill.style.width)));
				var level = width >= 85 ? 'high' : width >= 60 ? 'mid' : 'low';
				var meter = fill.parentNode;
				if (meter.dataset.nuxlabLevel !== level)
					meter.dataset.nuxlabLevel = level;
				if (meter.style.getPropertyValue('--nuxlab-meter-value') !== width + '%')
					meter.style.setProperty('--nuxlab-meter-value', width + '%');
			});
		};

		var attachTilt = function() {
			if (!view || !isOverviewPage || !pointerFine.matches || html.dataset.nuxlabFxEffective !== 'full')
				return;
			view.querySelectorAll(tiltSelector).forEach(function(card) {
				if (!card.querySelector('.cbi-progressbar') &&
					card.matches('.cbi-section.fade-in'))
					return;
				if (card.hasAttribute('data-nuxlab-tilt'))
					return;
				card.setAttribute('data-nuxlab-tilt', '');
				card.addEventListener('pointermove', function(event) {
					if (document.hidden || html.dataset.nuxlabFxEffective !== 'full' ||
						event.pointerType !== 'mouse')
						return;
					var bounds = card.getBoundingClientRect();
					if (!bounds.width || !bounds.height)
						return;
					var x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
					var y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
					card.style.setProperty('--nuxlab-tilt-x', ((.5 - y) * 14).toFixed(2) + 'deg');
					card.style.setProperty('--nuxlab-tilt-y', ((x - .5) * 14).toFixed(2) + 'deg');
				});
				card.addEventListener('pointerleave', function() {
					card.style.removeProperty('--nuxlab-tilt-x');
					card.style.removeProperty('--nuxlab-tilt-y');
				});
			});
		};

		var scheduleUpdate = function() {
			if (updateFrame === null && !document.hidden)
				updateFrame = requestAnimationFrame(function() {
					updateFrame = null;
					annotateMeters();
					attachTilt();
				});
		};

		var stopMotion = function() {
			if (updateFrame !== null)
				cancelAnimationFrame(updateFrame);
			if (pointerFrame !== null)
				cancelAnimationFrame(pointerFrame);
			updateFrame = null;
			pointerFrame = null;
			html.dataset.nuxlabHidden = 'true';
			if (view)
				view.querySelectorAll('[data-nuxlab-tilt]').forEach(function(card) {
					card.style.removeProperty('--nuxlab-tilt-x');
					card.style.removeProperty('--nuxlab-tilt-y');
				});
		};

		var startMotion = function() {
			delete html.dataset.nuxlabHidden;
			scheduleUpdate();
		};

		var onVisibilityChange = function() {
			if (document.hidden) {
				stopMotion();
				if (performanceFrame !== null)
					cancelAnimationFrame(performanceFrame);
				performanceFrame = null;
				lastFrame = 0;
				monitorStart = 0;
				frameTotal = 0;
				frameCount = 0;
			} else {
				startMotion();
				schedulePerformanceMonitor();
			}
		};

		var onPointerMove = function(event) {
			if (html.dataset.nuxlabFxEffective !== 'full' ||
				!pointerFine.matches || document.hidden || pointerFrame !== null)
				return;
			var bounds = { width: window.innerWidth, height: window.innerHeight };
			var x = (event.clientX / bounds.width - .5) * 12;
			var y = (event.clientY / bounds.height - .5) * 12;
			pointerFrame = requestAnimationFrame(function() {
				pointerFrame = null;
				html.style.setProperty('--nuxlab-pointer-x', x.toFixed(1) + 'px');
				html.style.setProperty('--nuxlab-pointer-y', y.toFixed(1) + 'px');
			});
		};

		var monitorFrameTime = function(timestamp) {
			performanceFrame = null;
			if (document.hidden || html.dataset.nuxlabFxEffective !== 'full' || performanceChecked)
				return;
			if (!monitorStart)
				monitorStart = timestamp;
			if (lastFrame) {
				frameTotal += timestamp - lastFrame;
				frameCount++;
			}
			lastFrame = timestamp;
			if (timestamp - monitorStart >= 3000) {
				performanceChecked = true;
				if (frameCount && frameTotal / frameCount > 24) {
					frameSaver = true;
					setMode('saver');
				}
				return;
			}
			performanceFrame = requestAnimationFrame(monitorFrameTime);
		};
		var schedulePerformanceMonitor = function() {
			if (performanceFrame === null && !document.hidden &&
				html.dataset.nuxlabFxEffective === 'full' && !performanceChecked)
				performanceFrame = requestAnimationFrame(monitorFrameTime);
		};
		var onMotionPreferenceChange = function() {
			setMode(initialMode());
			scheduleUpdate();
			schedulePerformanceMonitor();
		};

		setMode(initialMode());
		html.dataset.nuxlabHidden = document.hidden ? 'true' : 'false';
		if (view) {
			new MutationObserver(scheduleUpdate).observe(view, {
				childList: true, subtree: true, attributes: true, attributeFilter: [ 'style' ]
			});
			scheduleUpdate();
		}
		document.addEventListener('visibilitychange', onVisibilityChange);
		if (reducedMotion.addEventListener)
			reducedMotion.addEventListener('change', onMotionPreferenceChange);
		else if (reducedMotion.addListener)
			reducedMotion.addListener(onMotionPreferenceChange);
		if (pointerFine.matches)
			window.addEventListener('pointermove', onPointerMove, { passive: true });
		schedulePerformanceMonitor();
	}
});