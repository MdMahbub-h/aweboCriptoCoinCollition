var GameMap = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function GameMap (scene)
	{
		this.scene = game_data['scene'];
		Phaser.GameObjects.Container.call(this, scene, 0, 0);        
		this.emitter = new Phaser.Events.EventEmitter();
		this.game_started = 0;
	},


init(params) {
	game_data['game_map'] = this;
	this.create_assets();

	this.button_play = new CustomButton(this.scene, loading_vars.W / 2, loading_vars['H'] * 0.6, () => {
		this.handler_play();
	}, 'common1', 'btn_play', 'btn_play', 'btn_play', this, null, null, 1);
	this.add(this.button_play);

	this.btn_tween = game_data.scene.tweens.add({
		targets: this.button_play,
		repeat: -1,
		yoyo: true,
		scale: {from:1, to: 1.05},
		ease: 'Sine.easeInOut',
		duration: 1000,
		onUpdate: () => {

		},
		onComplete: () => {
		}
	});

	this.button_options = new CustomButton(this.scene, loading_vars.W - 50, 50, this.handler_options, 'common1', 'btn_options', 'btn_options', 'btn_options', this, null, null, 1);
	game_data['options_holder'].add(this.button_options);
	this.create_remove_ad_button();
	this.create_shop_panel();

	this.reset_music();
},

handler_options(params) {
	if (!game_data['game_play'].booster_active) {
		this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'options'});
		// this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'level_finished', 'score': 10, 'mode': 2048});
		// this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'level_complete', 'score': 10, 'mode': 2048});
	}
},

create_shop_panel() {
	this.container_shop = new Phaser.GameObjects.Container(this.scene, loading_vars.W - 150, 50);
	this.add(this.container_shop);

	this.shop_panel = new CustomButton(this.scene, 0, 0, this.handler_shop, 'common1', 'btn_skins', 'btn_skins', 'btn_skins', this);
	this.container_shop.add(this.shop_panel);
},

handler_shop() {
	this.emitter.emit('EVENT', {'event': 'show_scene', 'scene_id': 'SHOP'});
},

create_remove_ad_button() {
	this.button_ad = new Phaser.GameObjects.Container(this.scene, 0, 0);
	this.add(this.button_ad);

	this.button_ad2 = new CustomButton(this.scene, loading_vars.W - 250, 50, this.handler_remove_ad, 'common1', 'btn_rem_ad', 'btn_rem_ad', 'btn_rem_ad',  this);
	this.button_ad.add(this.button_ad2);
	this.update_ad_btn();
},

update_ad_btn() {
	this.button_ad.setVisible(game_data['user_data']['payments']['total'] === 0);
},

handler_lang() {
	this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'select_language'});
},

handler_remove_ad() {
	this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'remove_ads'});
},

handler_music(params) {
	game_data['user_data']['music'] = 1 - game_data['user_data']['music'];
	this.update_buttons();
	game_request.request({'set_options': true, 'sound': game_data['user_data']['sound'] , 'music': game_data['user_data']['music']}, function(){});
	game_data['audio_manager'].update_volume();
},

handler_sound(params) {
	game_data['user_data']['sound'] = 1 - game_data['user_data']['sound'];
	this.update_buttons();
	game_request.request({'set_options': true, 'sound': game_data['user_data']['sound'] , 'music': game_data['user_data']['music']}, function(){});
	game_data['audio_manager'].update_volume();
},

update_buttons() {
	this.button_music_on.visible = game_data['user_data']['music'] == 1;
	this.button_music_off.visible = game_data['user_data']['music'] == 0;
	
	this.button_sound_on.visible = game_data['user_data']['sound'] == 1;
	this.button_sound_off.visible = game_data['user_data']['sound'] == 0;
},

reset_music(params = {}) {
	let current_skin = game_data['user_data']['current_skin'];
	if ('id' in params) current_skin = params['id'];
	let tracks = game_data['tracks'];
	
	if (current_skin in tracks && tracks[current_skin]) {
		if (this.prev_track !== tracks[current_skin]) {
			game_data['audio_manager'].sound_event({'stop': true, 'sound_type': 'music', 'audio_kind': 'music'});
			game_data['audio_manager'].sound_event({
				'play': true, 'loop': true, 'sound_type': 'music', 'sound_name': tracks[current_skin], 'audio_kind': 'music', 'map': true
			});
			this.prev_track = tracks[current_skin];
		}
	}
	else if (!tracks[current_skin]) {
		game_data['audio_manager'].sound_event({'stop': true, 'sound_type': 'music', 'audio_kind': 'music'});
		this.prev_track = null;
	}
},

show_map(obj = {}) {
	if (obj['complete']) {
	}
},

handler_event(params) {
	switch (params['event']) {
		case 'start_level':
			this.auto_start_obj = null;
			this.start_level(params)
			break;
		default:
			this.emitter.emit('EVENT', params);
			break;
	}
},

get_money_pt() {
	return game_data['utils'].toGlobal(game_data['game_map'], 
				new Phaser.Geom.Point(this.money_icon.x, this.money_icon.y));
},

update_language() {
},

create_assets() {
	let id = game_data['user_data']['current_skin'];
	let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
	let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, `${bg_key}_bg`);
	bg.setOrigin(0, 0);
	this.add(bg);
	this.bg = bg;

	let main_logo = new Phaser.GameObjects.Image(this.scene, loading_vars['W'] / 2, loading_vars['H'] / 2 - 200, 'main_logo');
	main_logo.setOrigin(0.5);
	this.add(main_logo);
	this.main_logo = main_logo;

	this.game_icon_anim();
},

update_back(params) {
	if (!params['blocked']) {
		let id = game_data['user_data']['current_skin'];
		let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
		this.bg.setTexture(`${bg_key}_bg`);
	}
},

game_icon_anim() {
	if (this.scene) {
		if (!this.lights) {
			this.lights = [];
			while (this.lights.length < 5) {
				img = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'light_star');
				img.scale = 0;
				this.add(img);
				this.lights.push(img);
			}
		}

		for (let i = 0; i < this.lights.length; i++) {
			img = this.lights[i];
			img.scale = 0;
			img.angle = 0;
			img.x = (this.main_logo.x + Math.random() * 200) * (Math.random() < 0.5 ? 1 : -1);
			img.y = (this.main_logo.y + Math.random() * 100) * (Math.random() < 0.5 ? 1 : -1);
			game_data['scene'].tweens.add({targets: img, scale: 2.8, duration: 500, yoyo: true, repeat: 0, delay: 500 + i * 900 , ease: 'Sine.easeOut'});
			game_data['scene'].tweens.add({targets: img, angle: 360 * (Math.random() < 0.5 ? 1 : -1), duration: 800, delay: 500 + i * 900 , ease: 'Sine.easeInOut'});
		}

		this.main_logo_tween = this.scene.tweens.add({
			targets: this.main_logo,
			repeat: 0,
			yoyo: true,
			scale: {from:1, to: 1.1},
			ease: 'Sine.easeInOut',
			duration: 3200,
			onUpdate: () => {
	
			},
			onComplete: () => {
				
				this.game_icon_anim();
			}
		});
	}
},

handler_play() {
	this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'level_start'});
},

update() {
	
},

start_level(_obj) {
	this.game_started++;
},

});