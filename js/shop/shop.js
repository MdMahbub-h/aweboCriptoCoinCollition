let Shop = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function Shop(scene)
	{
		this.scene = game_data['scene'];
		Phaser.GameObjects.Container.call(this, scene, 0, 0);        
		this.emitter = new Phaser.Events.EventEmitter();
	},

    init(params) {
		this.ad_items = JSON.parse(JSON.stringify(game_data['shop']['ad']));
		this.items_all = [
			...this.ad_items
		];
		let all_ad_ids = this.items_all.map(({id}) => id);
		this.ad_pages = Math.ceil(this.ad_items.length / 9);
		this.total_pages = this.ad_pages;
		this.pages = [];
		this.items = [];
		this.current_id = game_data['user_data']['current_skin'];
		this.current_page = all_ad_ids.indexOf(this.current_id);
		if (this.current_page === -1) this.current_page = 0;
		this.btn_allow_click = true;
		this.loaded_materials = {};
		this.loaded_materials[this.current_id] = true;
		this.create_assets();
    },

    create_assets(params) {
		let res;
		let id = game_data['user_data']['current_skin'];
        let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
		let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, `${bg_key}_bg`);
		bg.setOrigin(0, 0);
		this.add(bg);
		this.bg = bg;

		this.cont_current_skin = new Phaser.GameObjects.Container(this.scene, loading_vars.W / 2, 435);
		this.add(this.cont_current_skin);

		let luchi = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'luchi');
		luchi.scale = 3;
		// window.luchi= luchi;
		this.cont_current_skin.add(luchi);
		game_data.scene.tweens.add({
			targets: luchi, 
			angle: 360,
			repeat: -1,
			duration: 10000,
			onComplete: () => {
			}
		});
		this.title = new Phaser.GameObjects.Text(this.scene, 0, -250, '', {...game_data['styles']['title'], fontFamily:"font2", fontSize: 70});
		this.title.setOrigin(0.5);
		this.cont_current_skin.add(this.title);

		this.current_skin = new Phaser.GameObjects.Image(this.scene, 0, 0);
		this.cont_current_skin.add(this.current_skin);

		this.cont_knives = new Phaser.GameObjects.Container(this.scene, 0, 470);
		this.add(this.cont_knives);

		this.loader_holder = new Phaser.GameObjects.Container(this.scene, loading_vars['W'] / 2, loading_vars['H'] / 2 - 45);
		this.add(this.loader_holder);

		this.load_logo(this.current_id, key => {
			this.current_skin.setTexture(`${key}_logo`);
		});
		
		this.btn_left = new CustomButton(this.scene, loading_vars.W * 0.1, this.cont_current_skin.y, this.handler_left, 'common1', 'btn_play1', 'btn_play1', 'btn_play1', this, null, null, 1);
		this.add(this.btn_left);
		this.btn_left.setScale(-0.7, 0.7);

		this.btn_right = new CustomButton(this.scene, loading_vars.W * 0.9, this.cont_current_skin.y, this.handler_right, 'common1', 'btn_play1', 'btn_play1', 'btn_play1', this, null, null, 1);
		this.add(this.btn_right);
		this.btn_right.setScale(0.7, 0.7);

		this.btn_back = new CustomButton(this.scene, 50, loading_vars.H * 0.95, this.handler_back, 'common1', 'btn_arrow', 'btn_arrow', 'btn_arrow', this, null, null, 1);
		this.add(this.btn_back);

		this.btn_ad = new CustomButton(this.scene, loading_vars.W / 2, loading_vars.H * 0.8, this.handler_buy_ad_item, 'common1', 'btn_purple', 'btn_purple', 'btn_purple', this, null, null, 1);
		this.add(this.btn_ad);

		txt = new Phaser.GameObjects.Text(this.scene, 0, -3, '', {...game_data['styles']['purp_text'], fontFamily:"font2", fontSize: 24});
		this.btn_ad.add(txt);
		txt.setOrigin(0.5);
		res = game_data['utils'].generate_string({
			'scene_id': 'shop', 'item_id': 'shop', 'phrase_id': '2', 'values': [], 'base_size': 24
		});
		txt.setText(res['text']);
		this.btn_ad.txt = txt;
		this.btn_ad.ico = new Phaser.GameObjects.Image(this.scene, 0, -2, 'common1', 'rewarded_ad');
		this.btn_ad.ico.setOrigin(0, 0.5);
		this.btn_ad.ico.x = this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;
		this.btn_ad.ico.setScale(1);
		this.btn_ad.add(this.btn_ad.ico);
		this.update_btn_text();
		this.update_buttons({});
    },

	handler_buy_ad_item() {
		game_data['utils'].show_rewarded_ad(res => {
			if (res['success']) {
				let current_item = this.get_current_item();
				game_request.request({'buy_item': true, 'type': 'ad', 'id': current_item.id}, res => {
					if (res['success']) {
						this.update_btn_text();
						if (res['ad_skins'].includes(res['id'])) {
							this.current_id = res['id'];
							this.show_explosion(() => {
								this.set_active();
							});
							if (this.btn_ad) this.btn_ad.setVisible(false);
						}
					}
					else {
						let pt = game_data['utils'].toGlobal(this.btn_ad, new Phaser.Geom.Point(0, 0));
						game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'shop', 'phrase_id': '2', 'values': []});
					}
				});
			}
			else {
				// transferring a point from a local coordinate system to a global one
				let pt = game_data['utils'].toGlobal(this.btn_ad, new Phaser.Geom.Point(0, 0));
				
				game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'shop', 'phrase_id': '2', 'values': []});
			}
		});
		
	},

	show_explosion(on_complete = null) {
        let frames;
            frames = [
            "btn_arrow",
            ];
		let config = {
			frame: frames,
			x: 0,
			y: 0,
			lifespan: 1300,
			blendMode: 'ADD',
			alpha: { start: 0.4, end: 1 },
			scale: { start: 0.7, end: 0 },
			speed: { min: -300, max: 300 },
			quantity: 30
		};
		let emitter =  game_data['scene'].add.particles(0, 0, 'common1', config);
		this.cont_current_skin.add(emitter);

		let emitZone0 = {
			source: new Phaser.Geom.Rectangle(-20, -20, 300, 300),
			type: 'random',
			quantity: 2
		};
		emitter.setEmitZone(emitZone0);
		emitter.explode();

		let count = 0;
		let timer = this.scene.time.addEvent({
			delay: 40,
			repeat: 8,
			callbackScope: this,
			callback: ()=>{
				count++;
				let size =  50 + 35 * count;
				let emitZone = {
					source: new Phaser.Geom.Rectangle(-size/2, -size/2, size, size),
					type: 'random',
					quantity: 10 + count * 4,

				};						
				emitter.setEmitZone(emitZone);
				emitter.explode();
			},
		});
		timer.paused = false;
		game_data['audio_manager'].sound_event({'play': true, 'sound_name': 'collect_pers'});
		setTimeout(() => {
			emitter.stop();
			emitter.destroy();
			if (on_complete) on_complete();
		}, 1500);
	},

	create_page({ type }) {
		let cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
		cont.type = type;
		
		this.cont_knives.add(cont);
		this.pages.push(cont);

		return cont;
	},

	set_active() {
		let item = this.get_current_item();
		let id = game_data['user_data']['current_skin'];
		this.emitter.emit('EVENT', {'event': 'update_back', id});
		this.update_btn_text(item);
		this.update_buttons({});
	},

	update_btn_text() {
		if (this.btn_ad && this.btn_ad.txt) {
			let item = this.get_current_item();
			
			let remaider = item.id in game_data['user_data']['ad_watched'] ? game_data['user_data']['ad_watched'][item.id] : 0;
			let price_remained = item.price - remaider;
			let res = game_data['utils'].generate_string({
				'scene_id': 'shop',
				'item_id': 'shop',
				'phrase_id': '2',
				'values': [price_remained],
				'base_size': 24
			});
			this.btn_ad.txt.setText(res['text']);
			this.btn_ad.txt.setFontSize(res['size']);
			if (this.btn_ad.ico) {
				this.btn_ad.ico.x = this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;
			}
			
		}
	},

	show_page(page) {
		this.btn_allow_click = false;
		page.alpha = 0;
		game_data['scene'].tweens.add({targets:[page],  alpha: 1, duration: 500, ease: 'Sine.easeInOut', onComplete: () => {
			this.btn_allow_click = true;
		}});
	},

	handler_left() {
		if (this.btn_allow_click) {
			this.current_page--;
			if (!(this.current_page in this.items_all)) this.current_page = this.items_all.length - 1;
			let item = this.get_current_item();
			if (game_data['user_data']['ad_skins'].includes(item['id'])) {
				this.current_id = item['id'];
				game_request.request({'update_current_skin': true, 'current_skin': this.current_id}, res => {
					if (res['success']) {
						this.load_logo(item['id'], key => {
							this.current_skin.setTexture(`${key}_logo`);
						});
					}
				});
			}
			else {
				this.load_logo(item['id'], key => {
					this.current_skin.setTexture(`${key}_logo`);
				});
			}
			this.update_buttons({ only_switch: true });
		}
		
	},

	handler_right() {
		if (this.btn_allow_click) {
			this.current_page++;
			if (!(this.current_page in this.items_all)) this.current_page = 0;
			let item = this.get_current_item();

			if (game_data['user_data']['ad_skins'].includes(item['id'])) {
				this.current_id = item['id'];
				game_request.request({'update_current_skin': true, 'current_skin': this.current_id}, res => {
					if (res['success']) {
						this.load_logo(item['id'], key => {
							this.current_skin.setTexture(`${key}_logo`);
						});
					}
				});
			}
			else {
				this.load_logo(item['id'], key => {
					this.current_skin.setTexture(`${key}_logo`);
				});
			}
			this.update_buttons({ only_switch: true });
		}
		
	},

	update_buttons({ only_switch = false }) {
		let current_item = this.get_current_item();
		let id = current_item['id'];
		let ad_ids = this.ad_items.map(({id}) => id);
		if (game_data['user_data']['ad_skins'].includes(id)) {
			if (this.btn_ad) this.btn_ad.setVisible(false);
		}
		else {
			if (ad_ids.includes(id)) {
				if (this.btn_ad) this.btn_ad.setVisible(true);
			}
		}
		
		let res = game_data['utils'].generate_string({'scene_id': 'shop', 'item_id': 'shop', 'phrase_id': id, 'values': [], 'base_size': 70});
		this.title.setText(res['text']);
		this.title.setFontSize(res['size']);
		this.update_btn_text();
	},
	
	get_current_item() {
		return this.items_all[this.current_page];
	},

	handler_back() {
		game_data['utils'].check_ads('change_scene');
		this.emitter.emit('EVENT', {'event': 'reset_music'});
		this.emitter.emit('EVENT', {'event': 'show_scene', 'scene_id': 'MAP'});
	},

    show_shop(params) {
		this.items.forEach(item => {
			if (item.id === game_data['user_data']['current_skin']) {
				let page_ind = this.pages.indexOf(item.page);
				page_ind = page_ind !== -1 ? page_ind : 0;
				this.current_page = page_ind;
				this.set_active(item);
			}
		});
		let id = this.items_all[this.current_page]['id'];
		this.emitter.emit('EVENT', {'event': 'reset_music', id});
		this.update_buttons({});
    },

	update_language() {
		let current_item = this.get_current_item();
		let res;

		let remaider = current_item.id in game_data['user_data']['ad_watched'] ? game_data['user_data']['ad_watched'][current_item.id] : 0;
		let price_remained = current_item.price - remaider;
		res = game_data['utils'].generate_string({'scene_id': 'shop', 'item_id': 'shop', 'phrase_id': '2', 'values': [price_remained], 'base_size': 24});
		this.btn_ad.txt.setText(res['text']);
		this.btn_ad.txt.setFontSize(res['size']);
		this.btn_ad.ico.x = this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;

		res = game_data['utils'].generate_string({'scene_id': 'shop', 'item_id': 'shop', 'phrase_id': game_data['user_data']['current_skin'], 'values': [], 'base_size': 70});
		this.title.setText(res['text']);
		this.title.setFontSize(res['size']);
	},

	load_logo(id, on_complete = () => {}) {
		let blocked = !game_data['user_data']['ad_skins'].includes(id);
		if (!(id in this.loaded_materials)) {
			let loader_id = game_data['utils'].show_loader(new Phaser.Geom.Point(0, 0), this.loader_holder);
		
			game_data['utils'].load_skin(id, key => {
				game_data['utils'].hide_loader(loader_id);
				this.loaded_materials[id] = true;
				this.emitter.emit('EVENT', {'event': 'update_back', blocked, id});
				this.emitter.emit('EVENT', {'event': 'reset_music', id});
				on_complete(key);
			});
		}
		else {
			this.emitter.emit('EVENT', {'event': 'update_back', blocked, id});
			this.emitter.emit('EVENT', {'event': 'reset_music', id});
			
			on_complete(id);
		}
	
	},

	update_back(params) {
		let id = params['id'];
		let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
		this.bg.setTexture(`${bg_key}_bg`);
	},

});