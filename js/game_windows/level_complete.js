let LevelComplete = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function LevelComplete()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },

    init(params) {
        let add_y = 10;
        this.mode = params['mode'];
        this.score = params['score'];
        this.closed = false;
        let temp = {'scene_id': 'game_windows', 'item_id': 'level_finished', 'phrase_id': '1', 'values': [], 'base_size': 50};
        game_data['graphics_manager'].get_window('info', this.handler_close, [{ handler: this.handler_close, type: 'big', scale: 0.7 }], this, null, true);
        this.button_play = this.buttons[0];
        this.button_close.setVisible(false);
        this.back.setTexture('common1', 'panel14');

        temp = new Phaser.GameObjects.Text(this.scene, 0, -170, this.mode, {fontFamily:"font1", fontSize: 50, color: '#fff', stroke: '#000', strokeThickness: 5})
        temp.setOrigin(0.5);
        this.add(temp);

        let res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_finished', 'phrase_id': '2', 'values': [], 'base_size': 35});
        temp = new Phaser.GameObjects.Text(this.scene, 0, -120 + add_y, res['text'], {...game_data['styles']['title'], fontFamily:"font1", fontSize: res['size']})
        temp.setOrigin(0.5);
        this.add(temp);

        let best_score = game_data['user_data']['best_score'];
        temp = new Phaser.GameObjects.Text(this.scene, 0, -60 + add_y, best_score, {fontFamily:"font1", fontSize: 75, color: '#40190e', stroke: '#fff5de', strokeThickness: 5})
        temp.setOrigin(0.5);
        this.add(temp);

        res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_finished', 'phrase_id': '3', 'values': [], 'base_size': 35});
        temp = new Phaser.GameObjects.Text(this.scene, 0, 0 + add_y, res['text'], {...game_data['styles']['title'], fontFamily:"font1", fontSize: res['size']})
        temp.setOrigin(0.5);
        this.add(temp);

        temp = new Phaser.GameObjects.Text(this.scene, 0, 60 + add_y, this.score, {fontFamily:"font1", fontSize: 75, color: '#40190e', stroke: '#fff5de', strokeThickness: 5})
        temp.setOrigin(0.5);
        this.add(temp);

        res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_finished', 'phrase_id': '4', 'values': [], 'base_size': 35});
        let button_txt = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], {...game_data['styles']['green_text'], fontFamily:"font1", fontSize: res['size']});
        button_txt.setOrigin(0.5);
        this.button_play.add(button_txt);
    },

    handler_close(params) {
        if (!this.closed) {
            this.closed = true;
            this.emitter.emit('EVENT', {'event': 'destroy_level'});
            this.emitter.emit('EVENT', {'event': 'show_scene', 'scene_id': 'MAP', 'complete': true});
            this.close_window();
        }
        
    },
    
    close_window(event = {}) {
        game_data['utils'].hide_tip();
        game_data['utils'].check_ads('level_lost');
        this.emitter.emit('EVENT', {'event': 'window_close'});
    },	
});