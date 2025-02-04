let LevelStart = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function LevelStart()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },


init(params) {
	game_data['graphics_manager'].get_window('info', this.handler_close, [{ handler: this.handler_replay, type: 'big' }], this, null, true);
	this.button_play = this.buttons[0];
	this.button_close.setVisible(false);
	this.button_play.setVisible(false);
	this.back.setTexture('common1', 'panel14');
    this.create_assets();
},	

create_assets() {
    let add_y = -15;
	let size = 40;
	this.btn_512 = new CustomButton(this.scene, 0, -140 + add_y, () => {
		this.handler_level_start({ mode: '512', target_score: 512 });
		
	}, 'common1', 'btn_green', 'btn_green', 'btn_green', this, null, null, 0.8);
    this.add(this.btn_512);
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, 512, { ...game_data['styles']['green_text'], fontFamily:"font1", fontSize: size, align: 'center' });
	temp.setOrigin(0.5);
    this.btn_512.add(temp);

    this.btn_1024 = new CustomButton(this.scene, 0, -65 + add_y, () => {
		this.handler_level_start({ mode: '1024', target_score: 1024 });
		
	}, 'common1', 'btn_yellow', 'btn_yellow', 'btn_yellow', this, null, null, 0.8);
    this.add(this.btn_1024);
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, 1024, { ...game_data['styles']['yellow_text'], fontFamily:"font1", fontSize: size, align: 'center' });
	temp.setOrigin(0.5);
    this.btn_1024.add(temp);

    this.btn_2048 = new CustomButton(this.scene, 0, 10 + add_y, () => {
		this.handler_level_start({ mode: '2048', target_score: 2048 });
		
	}, 'common1', 'btn_orange', 'btn_orange', 'btn_orange', this, null, null, 0.8);
    this.add(this.btn_2048);
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, 2048, { ...game_data['styles']['orange_text'], fontFamily:"font1", fontSize: size, align: 'center' });
	temp.setOrigin(0.5);
    this.btn_2048.add(temp);

    this.btn_4096 = new CustomButton(this.scene, 0, 85 + add_y, () => {
		this.handler_level_start({ mode: '4096', target_score: 4096 });
		
	}, 'common1', 'btn_red', 'btn_red', 'btn_red', this, null, null, 0.8);
    this.add(this.btn_4096);
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, 4096, { ...game_data['styles']['red_text'], fontFamily:"font1", fontSize: size, align: 'center' });
	temp.setOrigin(0.5);
    this.btn_4096.add(temp);

	this.btn_8192 = new CustomButton(this.scene, 0, 160 + add_y, () => {
		this.handler_level_start({ mode: '8192', target_score: 8192 });
		
	}, 'common1', 'btn_purple', 'btn_purple', 'btn_purple', this, null, null, 0.8);
    this.add(this.btn_8192);
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, '8192', { ...game_data['styles']['purp_text'], fontFamily:"font1", fontSize: size, align: 'center' });
	temp.setOrigin(0.5);
    this.btn_8192.add(temp);


},

handler_level_start({ mode, target_score }) {
	// call of interstitial ad when level start
	game_data['utils'].check_ads('level_start');
    this.emitter.emit('EVENT', {'event': 'start_level', 'mode': mode, 'target_score': target_score});
    this.handler_close();
},

handler_close(params) {  
	this.close_window();
},

close_window(params) {
	this.emitter.emit("EVENT", {'event': 'window_close'});
},

});