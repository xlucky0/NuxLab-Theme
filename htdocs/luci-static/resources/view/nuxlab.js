'use strict';
'require form';
'require nuxlab.branding as branding';
'require nuxlab.updates as updates';
'require fs';
'require rpc';
'require uci';
'require ui';
'require view';

var callAvailSpace = rpc.declare({
	object: 'luci.nuxlab',
	method: 'avail',
	raise: true,
	expect: { '': { avail: 0 } }
});

var callRemoveNuxLab = rpc.declare({
	object: 'luci.nuxlab',
	method: 'remove',
	params: ['filename'],
	raise: true,
	expect: { '': {} }
});

var callRenameNuxLab = rpc.declare({
	object: 'luci.nuxlab',
	method: 'rename',
	params: ['newname'],
	raise: true,
	expect: { '': {} }
});

var bg_path = '/www/luci-static/nuxlab/background/';

var trans_set = [0, 0.1, 0.2, 0.3, 0.4,
	0.5, 0.6, 0.7, 0.8, 0.9, 1 ];

function expandHex(value) {
	if (/^#[0-9a-f]{3}$/i.test(value))
		return value.replace(/[0-9a-f]/gi, function(digit) { return digit + digit; }).toLowerCase();
	return /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : null;
}

var ColorValue = form.Value.extend({
	validate: function(section_id, value) {
		return expandHex(value) !== null ||
			_('Expecting: %s').format(_('valid HEX color value'));
	},

	renderWidget: function(section_id, option_index, cfgvalue) {
		// Keep the native Textfield and its binding as the saved form value.
		var node = this.super('renderWidget', [section_id, option_index, cfgvalue]);
		var input = node.querySelector('input');
		var picker = E('input', {
			'type': 'color',
			'id': this.cbid(section_id) + '-picker',
			'class': 'nuxlab-color-swatch',
			'value': expandHex(input.value) || this.default,
			'disabled': input.disabled || null,
			'aria-label': this.title,
			'title': this.title
		});

		node.classList.add('nuxlab-color-picker');
		input.setAttribute('spellcheck', 'false');
		input.setAttribute('autocapitalize', 'off');
		input.setAttribute('autocomplete', 'off');
		node.appendChild(picker);

		var updatePicker = function() {
			var color = expandHex(input.value);
			if (color !== null)
				picker.value = color;
		};
		var updateText = L.bind(function() {
			if (input.disabled || input.readOnly)
				return;
			input.value = picker.value;
			input.dispatchEvent(new Event('change', { bubbles: true }));
			this.triggerValidation(section_id);
		}, this);
		input.addEventListener('input', updatePicker);
		input.addEventListener('change', updatePicker);
		picker.addEventListener('input', updateText);
		picker.addEventListener('change', updateText);
		return node;
	}
});

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('nuxlab'),
			callAvailSpace().catch(function(e) {
				ui.addNotification(null, E('p', _('Failed to read available space: %s.').format(e.message)));
				return { avail: 0 };
			}),
			fs.list(bg_path).then(function(files) {
				return files.filter(function(file) {
					return file.type === 'file' && /\.(jpe?g|png|gif|webp|mp4|webm)$/i.test(file.name);
				});
			}).catch(function(e) {
				ui.addNotification(null, E('p', _('Failed to list background files: %s.').format(e.message)));
				return [];
			}),
			branding.load(),
			updates.load()
		]);
	},

	render: function(data) {
		var m, s, o;

		m = new form.Map('nuxlab', _('NuxLab theme configuration'),
			_('Configure the NuxLab Cyberpunk Neon & Frost Indigo LuCI theme, login glass effects, wallpapers, and custom branding.'));

		s = m.section(form.TypedSection);
		s.render = function() { return updates.render(data[4], this.map); };

		s = m.section(form.TypedSection, 'global', _('Theme configuration'));
		s.addremove = false;
		s.anonymous = true;

		var loginStyles = {
			classic: _('Classic sidebar'),
			centered: _('Centered card')
		};
		o = s.option(form.ListValue, 'login_style', _('Login page style'),
			_('Applies the next time you open the login page.'));
		o.value('classic', loginStyles.classic);
		o.value('centered', loginStyles.centered);
		o.default = 'classic';
		o.rmempty = false;
		o.renderWidget = function(section_id, option_index, cfgvalue) {
			var style = cfgvalue === 'centered' ? 'centered' : 'classic';
			return E('div', {}, [
				form.ListValue.prototype.renderWidget.call(this, section_id, option_index, style),
				E('img', {
					'id': this.cbid(section_id) + '-preview',
					'src': L.resource('nuxlab-config/login-' + style + '.svg'),
					'alt': loginStyles[style],
					'width': 320,
					'height': 180,
					'class': 'nuxlab-login-preview'
				})
			]);
		};
		o.onchange = function(ev, section_id, value) {
			var preview = document.getElementById(this.cbid(section_id) + '-preview');
			var style = value === 'centered' ? 'centered' : 'classic';
			if (preview) {
				preview.src = L.resource('nuxlab-config/login-' + style + '.svg');
				preview.alt = loginStyles[style];
			}
		};

		o = s.option(form.ListValue, 'fx_mode', _('Visual effects'),
			_('Choose the motion and visual detail level for NuxLab backgrounds and cards.'));
		o.value('full', _('Full'));
		o.value('saver', _('Power saver'));
		o.value('off', _('Off'));
		o.default = 'full';
		o.rmempty = false;

		o = s.option(form.ListValue, 'rgb_mode', _('RGB mode'));
		o.value('1', _('On'));
		o.value('0', _('Off'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.ListValue, 'rgb_speed', _('RGB speed'),
			_('Hue cycle duration: 30, 14, or 6 seconds.'));
		o.value('off', _('Off'));
		o.value('slow', _('Slow (30s)'));
		o.value('normal', _('Normal (14s)'));
		o.value('fast', _('Fast (6s)'));
		o.default = 'normal';
		o.rmempty = false;

		o = s.option(form.ListValue, 'preset', _('Color preset'));
		o.value('aurora', _('Aurora'));
		o.value('cyber', _('Cyber RGB'));
		o.value('mono', _('Mono Glass'));
		o.default = 'aurora';
		o.rmempty = false;

		o = s.option(form.ListValue, 'online_wallpaper', _('Wallpaper source'));
		o.value('none', _('Built-in'));
		o.value('bing', _('Bing'));
		o.value('unsplash', _('Unsplash'));
		o.value('wallhaven', _('Wallhaven'));
		o.default = 'none';
		o.rmempty = false;

		o = s.option(form.Value, 'use_api_key', _('Unsplash API access key'),
			_('Required when using Unsplash wallpapers.'));
		o.password = true;
		o.depends('online_wallpaper', 'unsplash');
		o.rmempty = true;

		o = s.option(form.ListValue, 'mode', _('Theme mode'));
		o.value('normal', _('Follow system'));
		o.value('light', _('Light mode'));
		o.value('dark', _('Dark mode'));
		o.default = 'normal';
		o.rmempty = false;
		// A header shortcut saves independently of this form. Keep the widget and
		// its comparison value current, while leaving other pending fields alone.
		o.renderWidget = function(section_id, option_index, cfgvalue) {
			var option = this;
			var node = form.ListValue.prototype.renderWidget.call(this, section_id, option_index, cfgvalue);
			var syncMode = function(event) {
				if (!node.isConnected) {
					window.removeEventListener('nuxlab-appearance-saved', syncMode);
					return;
				}
				option.cfgvalue(section_id, event.detail.mode);
				L.dom.callClassMethod(node, 'setValue', event.detail.mode);
			};
			window.addEventListener('nuxlab-appearance-saved', syncMode);
			return node;
		};

		o = s.option(ColorValue, 'primary', _('Primary color'), _('A HEX color (default: #4f46e5).'));
		o.default = '#4f46e5';
		o.rmempty = false;

		o = s.option(form.ListValue, 'transparency', _('Login panel opacity'),
			_('0 transparent - 1 opaque (suggest: transparent: 0 or translucent preset: 0.5).'));
		for (var i of trans_set)
			o.value(i);
		o.default = '0.5';
		o.rmempty = false;

		o = s.option(form.Value, 'blur', _('Login panel blur'),
			_('Larger value will more blurred (suggest: clear: 1 or blur preset: 10).'));
		o.datatype = 'and(ufloat,range(0,100))';
		o.default = '10';
		o.rmempty = false;

		o = s.option(form.ListValue, 'dark_primary_mode', _('Dark mode colors'),
			_('Automatically generate dark colors from the primary color, or choose a custom dark color.'));
		o.value('auto', _('Automatic'));
		o.value('custom', _('Custom'));
		o.default = 'auto';
		o.rmempty = false;
		o.cfgvalue = function(section_id) {
			var mode = uci.get('nuxlab', section_id, 'dark_primary_mode');
			return mode === 'auto' || mode === 'custom' ? mode :
				(expandHex(uci.get('nuxlab', section_id, 'dark_primary')) ? 'custom' : 'auto');
		};

		o = s.option(ColorValue, 'dark_primary', _('[Dark mode] Primary Color'),
			_('A HEX Color (default: #00e5ff).'));
		o.default = '#00e5ff';
		o.rmempty = false;
		o.depends('dark_primary_mode', 'custom');
		o.retain = true;

		o = s.option(form.ListValue, 'dark_glass_mode', _('Dark mode login panel'),
			_('Use the same opacity and blur in both modes, or customize the dark login panel.'));
		o.value('inherit', _('Follow light mode'));
		o.value('custom', _('Custom'));
		o.default = 'inherit';
		o.rmempty = false;
		o.cfgvalue = function(section_id) {
			var mode = uci.get('nuxlab', section_id, 'dark_glass_mode');
			if (mode === 'inherit' || mode === 'custom')
				return mode;
			var blur = uci.get('nuxlab', section_id, 'blur') || '10';
			var opacity = uci.get('nuxlab', section_id, 'transparency') || '0.5';
			var darkBlur = uci.get('nuxlab', section_id, 'blur_dark');
			var darkOpacity = uci.get('nuxlab', section_id, 'transparency_dark');
			return (darkBlur != null && +darkBlur !== +blur) ||
				(darkOpacity != null && +darkOpacity !== +opacity) ? 'custom' : 'inherit';
		};

		o = s.option(form.ListValue, 'transparency_dark', _('[Dark mode] Transparency'),
			_('0 transparent - 1 opaque (suggest: black translucent preset: 0.5).'));
		for (var i of trans_set)
			o.value(i);
		o.default = '0.5';
		o.rmempty = false;
		o.depends('dark_glass_mode', 'custom');
		o.retain = true;

		o = s.option(form.Value, 'blur_dark', _('[Dark mode] Frosted Glass Radius'),
			_('Larger value will more blurred (suggest: clear: 1 or blur preset: 10).'));
		o.datatype = 'and(ufloat,range(0,100))';
		o.default = '10';
		o.rmempty = false;
		o.depends('dark_glass_mode', 'custom');
		o.retain = true;

		o = s.option(form.Button, '_save', _('Save settings'));
		o.inputstyle = 'apply';
		o.inputtitle = _('Save current settings');
		o.onclick = function() {
			if (this.map.readonly)
				return Promise.resolve();
			return this.map.save(null, true).then(function() {
				window.dispatchEvent(new CustomEvent('nuxlab-visual-settings-saved', { detail: {
					fx_mode: uci.get('nuxlab', 'global', 'fx_mode') || 'full',
					rgb_mode: uci.get('nuxlab', 'global', 'rgb_mode') || '1',
					rgb_speed: uci.get('nuxlab', 'global', 'rgb_speed') || 'normal',
					preset: uci.get('nuxlab', 'global', 'preset') || 'aurora'
				} }));
				return ui.changes.apply(true);
			}).catch(function(e) {
				ui.addNotification(null, E('p', e.message));
			});
		};

		s = m.section(form.TypedSection);
		s.render = function() { return branding.render(this.map, data[3]); };

		s = m.section(form.TypedSection, null, _('Upload background (available space: %1024.2mB)')
			.format(data[1].avail * 1024),
			_('You can upload files such as gif/jpg/mp4/png/webm/webp files, to change the login page background.'));
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.Button, '_upload_bg', _('Upload background'),
			_('Files will be uploaded to <code>%s</code>.').format(bg_path));
		o.inputstyle = 'action';
		o.inputtitle = _('Upload...');
		o.onclick = function(ev, section_id) {
			if (this.map.readonly)
				return Promise.resolve();
			var file = '/tmp/nuxlab_background.tmp';
			var uploaded = false;
			return ui.uploadFile(file, ev.target).then(function(res) {
				uploaded = true;
				return callRenameNuxLab(res.name).then(function(ret) {
					if (ret.result === 0)
						return location.reload();
					throw new Error(_('Failed to upload file: %s.').format(res.name));
				});
			})
			.catch(function(e) {
				ui.addNotification(null, E('p', e.message));
				if (uploaded)
					return L.resolveDefault(fs.remove(file));
			});
		};
		o.modalonly = true;

		s = m.section(form.TableSection);
		s.render = function() {
			var tbl = E('table', { 'class': 'table cbi-section-table' },
				E('tr', { 'class': 'tr table-titles' }, [
					E('th', { 'class': 'th' }, [ _('Filename') ]),
					E('th', { 'class': 'th' }, [ _('Modified date') ]),
					E('th', { 'class': 'th' }, [ _('Size') ]),
					E('th', { 'class': 'th' }, [ _('Action') ])
				])
			);

			cbi_update_table(tbl, data[2].map(L.bind(function(file) {
				return [
					file.name,
					new Date(file.mtime * 1000).toLocaleString(),
					String.format('%1024.2mB', file.size),
					E('button', {
						'class': 'btn cbi-button cbi-button-remove',
						'disabled': this.map.readonly || null,
						'click': ui.createHandlerFn(this, function() {
							if (this.map.readonly)
								return Promise.resolve();
							return callRemoveNuxLab(file.name).then(function(ret) {
								if (ret.result === 0)
									return location.reload();
								throw new Error(_('Failed to delete file: %s.').format(file.name));
							}).catch(function(e) {
								ui.addNotification(null, E('p', e.message));
							});
						})
					}, [ _('Delete') ])
				];
			}, this)), E('em', _('No files found.')));

			return E('div', { 'class': 'cbi-section', 'id': 'cbi-filelist' }, [
				E('h3', _('Background file list')),
				tbl
			]);
		};

		return m.render();
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
