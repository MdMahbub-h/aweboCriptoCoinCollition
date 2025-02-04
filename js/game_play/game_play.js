let GamePlay = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function GamePlay (scene)
	{
		this.scene = game_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
		this.emitter = new Phaser.Events.EventEmitter();
        this.booster_active = false;
        this.booster_uses = 0;
        this.colors = {
            'classic': {
                '2': {
                    bg_color: '#eee4da',
                    txt_color: '#222222',
                },
                '4': {
                    bg_color: '#ede0c8',
                    txt_color: '#222222',
                },
                '8': {
                    bg_color: '#f2b179',
                    txt_color: '#f9f6f2',
                },
                '16': {
                    bg_color: '#f59563',
                    txt_color: '#f9f6f2',
                },
                '32': {
                    bg_color: '#f67c5f',
                    txt_color: '#f9f6f2',
                },
                '64': {
                    bg_color: '#f65e3b',
                    txt_color: '#f9f6f2',
                },
                '128': {
                    bg_color: '#edcf72',
                    txt_color: '#f9f6f2',
                },
                '256': {
                    bg_color: '#edcc61',
                    txt_color: '#f9f6f2',
                },
                '512': {
                    bg_color: '#edc850',
                    txt_color: '#f9f6f2',
                },
                '1024': {
                    bg_color: '#edc53f',
                    txt_color: '#f9f6f2',
                },
                '2048': {
                    bg_color: '#edc22e',
                    txt_color: '#f9f6f2',
                },
                '4096': {
                    bg_color: '#3c3a32',
                    txt_color: '#f9f6f2',
                },
                '8192': {
                    bg_color: '#3c3a32',
                    txt_color: '#f9f6f2',
                }
            },
            'default': {
                '2': {
                    txt_color: '#ffffff',
                    stroke_color: '#2a8ed4'
                },
                '4': {
                    txt_color: '#ffffff',
                    stroke_color: '#d4462a'
                },
                '8': {
                    txt_color: '#ffffff',
                    stroke_color: '#3ed42a'
                },
                '16': {
                    txt_color: '#ffffff',
                    stroke_color: '#8a2ad4'
                },
                '32': {
                    txt_color: '#ffffff',
                    stroke_color: '#2abad4'
                },
                '64': {
                    txt_color: '#ffffff',
                    stroke_color: '#d42a7e'
                },
                '128': {
                    txt_color: '#ffffff',
                    stroke_color: '#6e2ad4'
                },
                '256': {
                    txt_color: '#ffffff',
                    stroke_color: '#d42a36'
                },
                '512': {
                    txt_color: '#ffffff',
                    stroke_color: '#5a2ad4'
                },
                '1024': {
                    txt_color: '#ffffff',
                    stroke_color: '#2a5ed4'
                },
                '2048': {
                    txt_color: '#ffffff',
                    stroke_color: '#d4622a'
                },
                '4096': {
                    txt_color: '#ffffff',
                    stroke_color: '#5ed42a'
                },
                '8192': {
                    txt_color: '#ffffff',
                    stroke_color: '#d42a5e'
                }
            }
        };
	},

	init(params) {
        this.mode = 2048;
        game_data['game_play'] = this;
        let temp;
        let id = game_data['user_data']['current_skin'];
        let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
        let back = new Phaser.GameObjects.Image(this.scene, 0, 0, `${bg_key}_bg`);
        // back.setTintFill(0x000000)
        back.setInteractive();
        back.setOrigin(0, 0);
        this.add(back);
        this.bg = back;

        let field_bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'field_bg');
        field_bg.y = loading_vars.H / 2 + 30;
        field_bg.x = loading_vars.W / 2;
        field_bg.setInteractive();
        this.add(field_bg);
        this.field_bg = field_bg;
        // field_bg.alpha = 0;
        

        this.field_cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.add(this.field_cont);

        this.tile_cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.add(this.tile_cont);

        let res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        let dx = 40;
        this.score_cont = new Phaser.GameObjects.Container(this.scene, loading_vars['W'] * 0.15 + dx, loading_vars['H'] * 0.155).setScale(0.8);
        this.add(this.score_cont);
        back = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel2');
        back.setInteractive({useHandCursor: true});
        back.on('pointerdown', () => {
            if (!this.booster_active) {
                let pt = game_data['utils'].toGlobal(this.score_cont, new Phaser.Geom.Point(0, 0));
                game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'tip', 'phrase_id': '1', 'values': []});
            }
        }, this);
        this.score_cont.add(back);
        temp = new Phaser.GameObjects.Text(this.scene, 0, -30, res['text'], {fontFamily:"font1", fontSize: res['size'], stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.score_cont.add(temp);
        this.score_info = temp;
        this.score_text = new Phaser.GameObjects.Text(this.scene, 0, 20, '0', {fontFamily:"font1", fontSize: 40, stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.score_text.setOrigin(0.5);
        this.score_cont.add(this.score_text);
        textXY = this.get_tile_position(-0.92, 1.1);
        this.bestScore = game_data['user_data']['best_score'];
        if(this.bestScore == null){
            this.bestScore = 0;
        }
        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'best_score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        
        this.best_score_cont = new Phaser.GameObjects.Container(this.scene, loading_vars['W'] * 0.44 + dx, loading_vars['H'] * 0.155).setScale(0.8);
        this.add(this.best_score_cont);
        back = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel2');
        back.setInteractive({useHandCursor: true});
        back.on('pointerdown', () => {
            if (!this.booster_active) {
                let pt = game_data['utils'].toGlobal(this.best_score_cont, new Phaser.Geom.Point(0, 0));
                game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'tip', 'phrase_id': '2', 'values': []});
            }
        }, this);
        this.best_score_cont.add(back);
        temp = new Phaser.GameObjects.Text(this.scene, 0, -30, res['text'], {fontFamily:"font1", fontSize: res['size'], stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.best_score_info = temp;
        this.best_score_cont.add(temp);
        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'target_score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.best_score_text = new Phaser.GameObjects.Text(this.scene, 0, 20, this.bestScore.toString(), {fontFamily:"font1", fontSize: 40, stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.best_score_text.setOrigin(0.5);
        this.best_score_cont.add(this.best_score_text);

        this.target_cont = new Phaser.GameObjects.Container(this.scene, loading_vars['W'] * 0.73 + dx, loading_vars['H'] * 0.155).setScale(0.8);
        this.add(this.target_cont);
        back = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel2');
        back.setInteractive({useHandCursor: true});
        back.on('pointerdown', () => {
            if (!this.booster_active) {
                let pt = game_data['utils'].toGlobal(this.target_cont, new Phaser.Geom.Point(0, 0));
                game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'tip', 'phrase_id': '3', 'values': []});
            }
        }, this);
        this.target_cont.add(back);
        temp = new Phaser.GameObjects.Text(this.scene, 0, -30, res['text'], {fontFamily:"font1", fontSize: res['size'], stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.target_score_info = temp;
        this.target_cont.add(temp);
        this.target_score = new Phaser.GameObjects.Text(this.scene, 0, 20, '', {fontFamily:"font1", fontSize: 40, stroke: '#000', strokeThickness: 5}).setOrigin(0.5);
        this.target_score.setOrigin(0.5);
        this.target_cont.add(this.target_score);

        this.btn_restart = new CustomButton(this.scene, 50, 915, this.handler_restart, 'common1', 'btn_restart', 'btn_restart', 'btn_restart', this);
        this.add(this.btn_restart);

        this.btn_hint = new CustomButton(this.scene, loading_vars.W * 0.92, 915, this.handler_hint, 'common1', 'btn_hint', 'btn_hint', 'btn_hint', this);
        this.add(this.btn_hint);

        let ico = new Phaser.GameObjects.Image(this.scene, -30, 20, 'common1', 'rewarded_ad');
        this.btn_hint.add(ico);

        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'hint', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.booster_txt = new Phaser.GameObjects.Text(this.scene, loading_vars.W / 2, loading_vars.H * 0.92, res['text'], {fontFamily:"font1", fontSize: res['size'], stroke: '#000', strokeThickness: 5, align: 'center',  wordWrap: {'width': 350}}).setOrigin(0.5);
        this.add(this.booster_txt);
        this.booster_txt.setVisible(false);

        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'tutorial', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.tutorial_txt = new Phaser.GameObjects.Text(this.scene, loading_vars.W / 2, loading_vars.H * 0.92, res['text'], {fontFamily:"font1", fontSize: res['size'], stroke: '#000', strokeThickness: 5, align: 'center',  wordWrap: {'width': 350}}).setOrigin(0.5);
        this.add(this.tutorial_txt);
        this.tut_tween = this.scene.tweens.add({
            targets: this.tutorial_txt,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            ease: 'Cubic.easeInOut',
            repeat: -1
        });
        
    },

    update_back(params) {
        if (!params['blocked']) {
            let id = game_data['user_data']['current_skin'];
            let bg_key = id in game_data['bgs'] ? game_data['bgs'][id] : 'default';
            this.bg.setTexture(`${bg_key}_bg`);
        }
    },    

    start_level({ mode, target_score }) {
        let test = false;
        this.tutorial_txt.setVisible(true);
        this.booster_uses = 0;
        this.mode = mode;
        this.skin_id = game_data['user_data']['current_skin'];
        // this.field_bg.alpha = this.skin_id === 'classic';
        // this.skin_id = "emoji";
        // this.skin_id = "classic";
        this.target_score_val = target_score;
        this.score = 0;
        this.score_text.setText(0);
        this.bestScore = game_data['user_data']['best_score'];
        if(this.bestScore == null){
            this.bestScore = 0;
        }
        this.best_score_text.setText(this.bestScore.toString());
        this.target_score.setText(this.target_score_val.toString());
        
        this.can_move = false;
        this.board_array = [];
        this.tiles = [];
        let rows = gameOptions.board_size.rows;
        let cols = gameOptions.board_size.cols;


        let tile_size = gameOptions.tile_size;
        let field_width = tile_size * rows;
        let field_height = tile_size * cols;
        let max_width = 560;
        let max_height = 700;
        let scale = 1;
        if (field_width > max_width) {
            scale = max_width / field_width;
        }
        else if (field_height > max_height) {
            scale = max_height / field_height;
        }
        if (field_width < max_width) {
            
            this.field_cont.x = (max_width - field_width) * 0.5;
            this.tile_cont.x = this.field_cont.x;
        }
        this.level_scale = scale;
        this.field_cont.setScale(scale);
        this.tile_cont.setScale(scale);
        this.field_cont.y = (1 - this.level_scale) * 500;
        this.tile_cont.y = this.field_cont.y;

        if (test) {
            this.tutorial_txt.setVisible(false);
            this.score_cont.setVisible(false);
            this.best_score_cont.setVisible(false);
            this.target_cont.setVisible(false);
            this.test_example_level();
        }
        else {
            for(let i = 0; i < rows; i++){
                this.board_array[i] = [];
                for(let j = 0; j < cols; j++){
                    let tilePosition = this.get_tile_position(i, j);
                    let emptytile = this.scene.add.image(tilePosition.x, tilePosition.y, "common1", "emptytile");
                    this.field_cont.add(emptytile);
                    let tile = new Phaser.GameObjects.Container(this.scene, tilePosition.x, tilePosition.y);
                    this.tile_cont.add(tile);
                    tile.visible = false;
                    this.board_array[i][j] = {
                        tile_value: 0,
                        tile_sprite: tile,
                        upgraded: false
                    }
    
                    tile.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel');
                    tile.add(tile.bg);
                    tile.bg.setInteractive({useHandCursor: true});
                    tile.bg.on('pointerdown', () => {
                        this.tile_click(tile);
                    }, this)
                    tile.ico = new Phaser.GameObjects.Image(this.scene, 0, 0, this.skin_id, "2");
                    tile.add(tile.ico);
                    let color = ('default' in this.colors && 'txt_color' in this.colors['default']['2']) ? this.colors['default']['2']['txt_color'] : '#ffffff';
                    let stroke = ('default' in this.colors && 'stroke_color' in this.colors['default']['2']) ? this.colors['default']['2']['stroke_color'] : '#ffffff';
                    
                    tile.txt = new Phaser.GameObjects.Text(this.scene, 65, -50, '2', {fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5}).setOrigin(1, 0.5);
                    tile.add(tile.txt);
    
                    tile.booster_overlay = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel');
                    tile.add(tile.booster_overlay);
                    tile.booster_overlay.setTint(0x000000);
                    tile.booster_overlay.alpha = 0.7;
                    tile.booster_overlay.setVisible(false);
    
                    this.tiles.push(tile);
    
                    if (this.skin_id in this.colors) {
                        color = ('txt_color' in this.colors[this.skin_id]['2']) ? this.colors[this.skin_id]['2']['txt_color'] : '#ffffff';
                        stroke = ('stroke_color' in this.colors[this.skin_id]['2']) ? this.colors[this.skin_id]['2']['stroke_color'] : '#ffffff';
                        tile.txt.setStyle({fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5});
                    }
    
                    if (this.skin_id === 'classic') {
                        tile.bg.alpha = 0.01;
                        tile.txt.x = 0;
                        tile.txt.y = 0;
                        tile.txt.setOrigin(0.5);
                        tile.txt.setStyle({fontFamily:"font2", fontSize: 56, color: color, stroke: stroke, strokeThickness: 0});
                    }
                }
            }
            this.add_tile();
            this.add_tile();
            this.scene.input.keyboard.on("keydown", this.handle_key, this);
            this.scene.input.on("pointerup", this.handle_swipe, this);
            this.update_booster();
        }
    },

    tile_click(tile) {
        if (this.booster_active) {
            let tiles_selected = this.tiles.filter(tile => !tile.booster_overlay.visible);
            if (tiles_selected.includes(tile)) {
                tile.booster_overlay.setVisible(true);
            }
            else {
                tile.booster_overlay.setVisible(false);
                tiles_selected.push(tile);
                
                if (tiles_selected.length === 2) {
                    let tile1;
                    let tile2;
    
                    for(let i = 0; i < gameOptions.board_size.rows; i++){
                        for(let j = 0; j < gameOptions.board_size.cols; j++){
                            if (this.board_array[i][j].tile_sprite === tiles_selected[0]) {
                                tile1 = this.board_array[i][j];
                            }
                            else if (this.board_array[i][j].tile_sprite === tiles_selected[1]) {
                                tile2 = this.board_array[i][j];
                            }
                        }
                    }
    
                    // swap tiles
                    if (tile1 && tile2) {
                        [tile1.tile_sprite.x,  tile2.tile_sprite.x] = [tile2.tile_sprite.x,  tile1.tile_sprite.x];
                        [tile1.tile_sprite.y,  tile2.tile_sprite.y] = [tile2.tile_sprite.y,  tile1.tile_sprite.y];
    
                        [tile1.tile_sprite,  tile2.tile_sprite] = [tile2.tile_sprite,  tile1.tile_sprite];
                        [tile1.upgraded,  tile2.upgraded] = [tile2.upgraded,  tile1.upgraded];
                        [tile1.tile_value,  tile2.tile_value] = [tile2.tile_value,  tile1.tile_value];
    
                        this.booster_uses++;
                        this.booster_active = false;
                        this.update_booster();
                    }
    
    
                }
            }
        }
    },
    
    add_tile(){
        let empty_tiles = [];
        for(let i = 0; i < gameOptions.board_size.rows; i++){
            for(let j = 0; j < gameOptions.board_size.cols; j++){
                if(this.board_array[i][j].tile_value == 0){
                    empty_tiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        if(empty_tiles.length > 0){
            let chosen_tile = Phaser.Utils.Array.RemoveRandomElement(empty_tiles);
            this.board_array[chosen_tile.row][chosen_tile.col].tile_value = 1;
            this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.visible = true;
            this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.ico.setFrame(0);
            this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.txt.setText('2');
            let color = ('default' in this.colors && 'txt_color' in this.colors['default']['2']) ? this.colors['default']['2']['txt_color'] : '#ffffff';
            let stroke = ('default' in this.colors && 'stroke_color' in this.colors['default']['2']) ? this.colors['default']['2']['stroke_color'] : '#ffffff';
            if (this.skin_id in this.colors) {
                color = ('txt_color' in this.colors[this.skin_id]['2']) ? this.colors[this.skin_id]['2']['txt_color'] : '#ffffff';
                stroke = ('stroke_color' in this.colors[this.skin_id]['2']) ? this.colors[this.skin_id]['2']['stroke_color'] : '#ffffff';
            }


            if (this.skin_id === 'classic') {
                this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.txt.setStyle({fontFamily:"font2", fontSize: 56, color: color, stroke: stroke, strokeThickness: 0});
            }
            else {
                this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.txt.setStyle({fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5});
            }
            
            this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite.alpha = 0;
            this.scene.tweens.add({
                targets: [this.board_array[chosen_tile.row][chosen_tile.col].tile_sprite],
                alpha: 1,
                duration: gameOptions.tween_speed,
                callbackScope: this,
                onComplete: () => {
                    this.can_move = true;
                    let is_win = this.check_win();
                    if (!is_win) this.check_game_over();
                }
            });
        }
    },
    get_tile_position(row, col){
        let posX = gameOptions.tile_spacing * (col + 1) + gameOptions.tile_size * (col + 0.5);
        let posY = gameOptions.tile_spacing * (row + 1) + gameOptions.tile_size * (row + 0.5);
        let board_height = gameOptions.board_size.rows * gameOptions.tile_size;
        board_height += (gameOptions.board_size.rows + 1) * gameOptions.tile_spacing;
        let offsetY = (phaser_game.config.height - board_height) / 2 + 30;
        posY += offsetY;
        posX += 15;
        return new Phaser.Geom.Point(posX, posY);
    },
    handle_key(e){
        if (game_data['current_scene'] === 'GAME_PLAY' && !this.booster_active) {
            if(this.can_move){
                switch(e.code){
                    case "KeyA":
                    case "ArrowLeft":
                        this.make_move(LEFT);
                        break;
                    case "KeyD":
                    case "ArrowRight":
                        this.make_move(RIGHT);
                        break;
                    case "KeyW":
                    case "ArrowUp":
                        this.make_move(UP);
                        break;
                    case "KeyS":
                    case "ArrowDown":
                        this.make_move(DOWN);
                        break;
                }
            }
        }
    },
    handle_swipe(e){
        if (game_data['current_scene'] === 'GAME_PLAY' && !this.booster_active) {
            if(this.can_move){
                let swipeTime = e.upTime - e.downTime;
                let fastEnough = swipeTime < gameOptions.swipe_max_time;
                let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
                let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
                let longEnough = swipeMagnitude > gameOptions.swipe_min_distance;
                if(longEnough && fastEnough){
                    Phaser.Geom.Point.SetMagnitude(swipe, 1);
                    if(swipe.x > gameOptions.swipe_min_normal){
                        this.make_move(RIGHT);
                    }
                    if(swipe.x < -gameOptions.swipe_min_normal){
                        this.make_move(LEFT);
                    }
                    if(swipe.y > gameOptions.swipe_min_normal){
                        this.make_move(DOWN);
                    }
                    if(swipe.y < -gameOptions.swipe_min_normal){
                        this.make_move(UP);
                    }
                }
            }
        }
    },
    make_move(d){
        this.moving_tiles = 0;
        let d_row = (d == LEFT || d == RIGHT) ? 0 : d == UP ? -1 : 1;
        let d_col = (d == UP || d == DOWN) ? 0 : d == LEFT ? -1 : 1;
        this.can_move = false;
        let first_row = (d == UP) ? 1 : 0;
        let last_row = gameOptions.board_size.rows - ((d == DOWN) ? 1 : 0);
        let first_col = (d == LEFT) ? 1 : 0;
        let last_col = gameOptions.board_size.cols - ((d == RIGHT) ? 1 : 0);
        for(let i = first_row; i < last_row; i++){
            for(let j = first_col; j < last_col; j++){
                let cur_row = d_row == 1 ? (last_row - 1) - i : i;
                let cur_col = d_col == 1 ? (last_col - 1) - j : j;
                let tile_value = this.board_array[cur_row][cur_col].tile_value;
                if(tile_value != 0){
                    let new_row = cur_row;
                    let new_col = cur_col;
                    while(this.is_legal_position(new_row + d_row, new_col + d_col, tile_value)){
                        new_row += d_row;
                        new_col += d_col;
                    }
                    if(new_row != cur_row || new_col != cur_col){
                        let newPos = this.get_tile_position(new_row, new_col);
                        let willUpdate = this.board_array[new_row][new_col].tile_value == tile_value;
                        this.move_tile(this.board_array[cur_row][cur_col].tile_sprite, newPos, willUpdate);
                        this.board_array[cur_row][cur_col].tile_value = 0;
                        if(willUpdate){
                            this.board_array[new_row][new_col].tile_value ++;
                            this.score += Math.pow(2, this.board_array[new_row][new_col].tile_value);
                            this.board_array[new_row][new_col].upgraded = true;
                        }
                        else{
                            this.board_array[new_row][new_col].tile_value = tile_value;
                        }
                    }
                }
            }
        }
        if(this.moving_tiles == 0){
            this.can_move = true;
        }
        else{
            game_data['audio_manager'].sound_event({'play': true, 'sound_name': 'move'});
        }
        this.tutorial_txt.setVisible(false);
    },
    move_tile(tile, point, upgrade){
        this.moving_tiles ++;
        tile.depth = this.moving_tiles;
        let distance = Math.abs(tile.x - point.x) + Math.abs(tile.y - point.y);
        this.scene.tweens.add({
            targets: [tile],
            x: point.x,
            y: point.y,
            duration: gameOptions.tween_speed * distance / gameOptions.tile_size,
            callbackScope: this,
            onComplete: () => {
                if(upgrade){
                    this.upgrade_tile(tile);
                }
                else{
                    this.end_tween(tile);
                }
            }
        })
    },
    upgrade_tile(tile){
        game_data['audio_manager'].sound_event({'play': true, 'sound_name': 'grow'});
        this.end_tween(tile);
    },
    end_tween(tile){
        this.moving_tiles --;
        tile.depth = 0;
        if(this.moving_tiles == 0){
            this.refresh_board();
        }
    },
    refresh_board(){
        this.score_text.text = this.score.toString();
        if(this.score > this.bestScore){
            this.bestScore = this.score;
            this.best_score_text.text = this.bestScore.toString();
        }
        for(let i = 0; i < gameOptions.board_size.rows; i++){
            for(let j = 0; j < gameOptions.board_size.cols; j++){
                let sprite_position = this.get_tile_position(i, j);
                this.board_array[i][j].tile_sprite.x = sprite_position.x;
                this.board_array[i][j].tile_sprite.y = sprite_position.y;
                let tile_value = this.board_array[i][j].tile_value;
                if(tile_value > 0){
                    this.board_array[i][j].tile_sprite.visible = true;
                    let val = Math.pow(2, tile_value);
                    this.board_array[i][j].tile_sprite.ico.setFrame(val);
                    this.board_array[i][j].tile_sprite.txt.setText(val);
                    let color = ('default' in this.colors && 'txt_color' in this.colors['default'][val]) ? this.colors['default'][val]['txt_color'] : '#ffffff';
                    let stroke = ('default' in this.colors && 'stroke_color' in this.colors['default'][val]) ? this.colors['default'][val]['stroke_color'] : '#ffffff';
                    if (this.skin_id in this.colors) {
                        color = ('txt_color' in this.colors[this.skin_id][val]) ? this.colors[this.skin_id][val]['txt_color'] : '#ffffff';
                        stroke = ('stroke_color' in this.colors[this.skin_id][val]) ? this.colors[this.skin_id][val]['stroke_color'] : '#ffffff';
                    }
        
                    if (this.skin_id === 'classic') {
                        this.board_array[i][j].tile_sprite.txt.setStyle({fontFamily:"font2", fontSize: 56, color: color, stroke: stroke, strokeThickness: 0});
                    }
                    else {
                        this.board_array[i][j].tile_sprite.txt.setStyle({fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5});
                    }
                    this.board_array[i][j].upgraded = false;

                    if (val === 64 && !('booster_tip' in game_data['user_data']['tutorial'])) {
                        let pt = game_data['utils'].toGlobal(this.btn_hint, new Phaser.Geom.Point(0, 0));
                        game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'booster_tip', 'phrase_id': '1', 'values': []});
                        game_request.request({'update_tutorial': true, 'tutorial_id': 'booster_tip'}, ()=>{});
                    }
                }
                else{
                    this.board_array[i][j].tile_sprite.visible = false;
                }
            }
        }
        this.add_tile();
    },
    is_legal_position(row, col, value){
        let row_inside = row >= 0 && row < gameOptions.board_size.rows;
        let col_inside = col >= 0 && col < gameOptions.board_size.cols;
        if(!row_inside || !col_inside){
            return false;
        }
        if(this.board_array[row][col].tile_value == 12){
            return false;
        }
        let empty_spot = this.board_array[row][col].tile_value == 0;
        let same_value = this.board_array[row][col].tile_value == value;
        let already_upgraded = this.board_array[row][col].upgraded;
        return empty_spot || (same_value && !already_upgraded);
    },

    check_win() {
        // loop through the entire board
        for(let i = 0; i < gameOptions.board_size.rows; i++){
            for(let j = 0; j < gameOptions.board_size.cols; j++){
                let val = Math.pow(2, this.board_array[i][j].tile_value);
                // check level complete
                if (val === this.target_score_val) {
                    // level_complete
                    this.level_complete();
                    return true;
                }
            }
        }

        return false;
    },

    check_game_over(){
        // loop through the entire board
        for(let i = 0; i < gameOptions.board_size.rows; i++){
            for(let j = 0; j < gameOptions.board_size.cols; j++){
                // if there is an empty tile, it's not game over
                if(this.board_array[i][j].tile_value == 0){
                    return;
                }
                
                // if there are two vertical adjacent tiles with the same value, it's not game over
                if((i < 3) && this.board_array[i][j].tile_value == this.board_array[i + 1][j].tile_value){
                    return;
                }
 
                // if there are two horizontal adjacent tiles with the same value, it's not game over
                if((j < 3) && this.board_array[i][j].tile_value == this.board_array[i][j + 1].tile_value){
                    return
                }
            }
        }
 
        // ok, it's definitively game over :(
        // alert("no more moves");
        this.level_failed();
    },

    level_complete() {
        this.confetti_anim();
        this.scene.time.addEvent({
            delay: 1500,
            callbackScope: this,
            callback: function() {
                this.stop_confetti();
            }
        });
        game_data['audio_manager'].sound_event({'play': true, 'sound_name': 'level_complete4'});
        game_request.request({'level_complete': true, 'score': this.score}, res => {
            if (res && res['success']) {
                this.emitter.emit('EVENT', {
                    'event': 'show_window',
                    'window_id': 'level_complete',
                    'score': this.score,
                    'mode': this.mode
                });
            }
        });
    },

    level_failed() {
        game_request.request({'level_failed': true, 'score': this.score }, params => {
            this.level_finished();
        });
    },

    confetti_anim() {
        this.confetti_time = game_request.get_time();
        let shape = new Phaser.Geom.Rectangle(0, -50, loading_vars['W'], -20);
        let emitter = this.scene.add.particles(0, 0, 'common1', {
            frame: { frames: [ 'con1', 'con2', 'con3',  'con4', 'con5', 'con6']},
            alpha: { start: 1, end: 0.7 },
            scaleX: { start: 1.2, end: -1 },
            scaleY: { start: 1, end: 0.8 },
            speed: { min: -100, max: 100 },
            lifespan: 3500,
            gravityY: 250,
            rotate: { onEmit: ()=> { return Math.random()*360; } },
            onUpdate: (particle) => {
                return particle.angle + 1
                },
            blendMode: 'NORMAL',
            emitZone: { type: 'random', source: shape },
        });
        game_data['moving_holder'].add(emitter);
        this.confetti_emitter = emitter;
    },

    stop_confetti() {
        let now = game_request.get_time();
        let timeout = 10;
        if (now - this.confetti_time < 2000) timeout = now - this.confetti_time;
        if (timeout < 0) timeout = 10;
        setTimeout(() => {
            if (this.confetti_emitter) {
                this.confetti_emitter.stop();
                setTimeout(() => {
                    if (this.confetti_emitter) this.confetti_emitter.destroy();
                }, 2800);
            }
        }, timeout);
    },

    level_finished() {
        this.emitter.emit('EVENT', {'event': 'show_window', 'window_id': 'level_finished', 'score': this.score, 'mode': this.mode});
    },

    update(){
        if (this.level_active) {}
    },

    pause_timer() {
        if (this.level_active) {
            if (this.timerEvent) this.timerEvent.paused = true;
        }
    },

    resume_timer() {
        if (this.level_active) {
            if (this.timerEvent) this.timerEvent.paused = false;
        }
    },

    update_language() {
        let res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'hint', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.booster_txt.setText(res['text']);
        this.booster_txt.setFontSize(res['size']);

        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'tutorial', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.tutorial_txt.setText(res['text']);
        this.tutorial_txt.setFontSize(res['size']);

        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.score_info.setText(res['text']);
        this.score_info.setFontSize(res['size']);
        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'best_score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.best_score_info.setText(res['text']);
        this.best_score_info.setFontSize(res['size']);
        res = game_data['utils'].generate_string({'scene_id': 'game_play', 'item_id': 'target_score', 'phrase_id': '1', 'values': [], 'base_size': 40});
        this.target_score_info.setText(res['text']);
        this.target_score_info.setFontSize(res['size']);
    },

    handler_restart() {
        if (!this.booster_active) {
            game_data['utils'].check_ads('level_lost');
            this.destroy_level();
            this.start_level({ mode: this.mode, target_score: this.target_score_val });
        }
    },

    handler_hint() {
        this.tutorial_txt.setVisible(false);
        if (this.booster_uses < game_data['allowed_booster_trials']) {
            game_data['utils'].show_rewarded_ad(res => {
                if (res['success']) {
                    if (!this.booster_active) {
                        game_data['audio_manager'].sound_event({'play': true, 'sound_name': 'hint'});
                        this.booster_active = true;
                        this.update_booster();
                    }
                }
                else {
                    let pt = game_data['utils'].toGlobal(this.btn_hint, new Phaser.Geom.Point(0, 0));
                    
                    game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'shop', 'phrase_id': '2', 'values': []});
                }
            });
        }
        else if (!this.booster_active) {
            let pt = game_data['utils'].toGlobal(this.btn_hint, new Phaser.Geom.Point(0, 0));
            game_data['utils'].show_tip({'pt': pt, 'scene_id': 'game_tip', 'item_id': 'booster_tip', 'phrase_id': '2', 'values': []});
            game_request.request({'update_tutorial': true, 'tutorial_id': 'booster_tip'}, ()=>{});
        }
    },

    update_booster() {
        this.tiles.forEach(item => {
            item.booster_overlay.setVisible(this.booster_active);
        });
        this.booster_txt.setVisible(this.booster_active);
        this.btn_hint.alpha = this.booster_uses < game_data['allowed_booster_trials'] ? 1 : 0.5;
    },

    level_quit() {
        game_request.request({'level_failed': true, 'score': this.score }, params => {
            if (params['new_score'] && 'global_score' in params) game_data['utils'].update_score(params['global_score']);
            game_data['utils'].check_ads('level_lost');
            this.destroy_level();
            this.emitter.emit('EVENT', {'event': 'show_scene', 'scene_id': 'MAP', 'failed': true, 'score': this.score});
        });
    },

    // I use this method to draw all possible tiles for logo
    // this is test function
    test_example_level() {
        let ind = 0
        let base_val = 2;
        for(let i = 0; i < gameOptions.board_size.rows; i++){
            this.board_array[i] = [];
            for(let j = 0; j < gameOptions.board_size.cols; j++){
                let tilePosition = this.get_tile_position(i, j);
                let emptytile = this.scene.add.image(tilePosition.x, tilePosition.y, "common1", "emptytile");
                this.field_cont.add(emptytile);
                let cur_val = Math.pow(base_val, ind + 1);
                if (cur_val <= 8192) {
                    let tile = new Phaser.GameObjects.Container(this.scene, tilePosition.x, tilePosition.y);
                    this.tile_cont.add(tile);
                    this.board_array[i][j] = {
                        tile_value: 0,
                        tile_sprite: tile,
                        upgraded: false
                    }
    
                    tile.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel');
                    tile.add(tile.bg);
                    tile.bg.setInteractive({useHandCursor: true});
                    
                    tile.ico = new Phaser.GameObjects.Image(this.scene, 0, 0, this.skin_id, cur_val);
                    tile.add(tile.ico);
                    let color = ('default' in this.colors && 'txt_color' in this.colors['default'][cur_val]) ? this.colors['default'][cur_val]['txt_color'] : '#ffffff';
                    let stroke = ('default' in this.colors && 'stroke_color' in this.colors['default'][cur_val]) ? this.colors['default'][cur_val]['stroke_color'] : '#ffffff';
                    
                    tile.txt = new Phaser.GameObjects.Text(this.scene, 65, -50, cur_val, {fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5}).setOrigin(1, 0.5);
                    tile.add(tile.txt);
    
                    tile.booster_overlay = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'panel');
                    tile.add(tile.booster_overlay);
                    tile.booster_overlay.setTint(0x000000);
                    tile.booster_overlay.alpha = 0.7;
                    tile.booster_overlay.setVisible(false);
    
                    this.tiles.push(tile);
    
                    if (this.skin_id in this.colors) {
                        
                        color = ('txt_color' in this.colors[this.skin_id][cur_val]) ? this.colors[this.skin_id][cur_val]['txt_color'] : '#ffffff';
                        stroke = ('stroke_color' in this.colors[this.skin_id][cur_val]) ? this.colors[this.skin_id][cur_val]['stroke_color'] : '#ffffff';
                        tile.txt.setStyle({fontFamily:"font2", fontSize: 30, color: color, stroke: stroke, strokeThickness: 5});
                    }
    
                    if (this.skin_id === 'classic') {
                        tile.bg.alpha = 0.01;
                        tile.txt.x = 0;
                        tile.txt.y = 0;
                        tile.txt.setOrigin(0.5);
                        tile.txt.setStyle({fontFamily:"font2", fontSize: 56, color: color, stroke: stroke, strokeThickness: 0});
                    }
                    ind++;
                }

            }
        }
    },

    destroy_level() {
        this.score = 0;
        this.level_active = false;
        this.field_cont.removeAll(true);
        this.tile_cont.removeAll(true);
    },
});