const gameOptions = {
    tile_size: 140, // tile size in pixels
    tile_spacing: 10, // space between tiles in pixels
    board_size: { // board size
        rows: 4, // rows
        cols: 4 // columns
    },
    tween_speed: 50, // time in milliseconds for animations when a tile appears or moves.
    swipe_max_time: 1000, // the maximum amount of time allowed to swipe, in milliseconds
    swipe_min_distance: 20, // the minimum swipe vector magnitude, in pixels
    swipe_min_normal: 0.85 // the minimum length of the longest component
    // of the normalized swipe vector magnitude, in pixels
    // in other words, this value defines right direction of the swipe and can be from 0 to 1.
    // if you set this value to 0.05 then any swipe (even diagonal) will be detected and processed
}

const game_data = {
    'clear_storage': false, // if set true the progress resets
    'test_ad': true, // if set false test ad overlay will no appear
    'allowed_booster_trials': 1, // how many attempts are there to use a booster
    'styles': { // different styles used for the text
		'light_text': {fontSize: 30, color:'#fff', stroke: '#356e1e', strokeThickness: 5},
		'purp_text': {fontSize: 30, color:'#fff', stroke: '#561e6e', strokeThickness: 5},
        'light_text2': {fontSize: 30, color:'#fff', stroke: '#441b0e', strokeThickness: 5},
		'title': { fontSize: 30, color:'#fff5de', stroke: '#40190e', strokeThickness: 5},
        'green_text': {fontSize: 30, color:'#fff', stroke: '#356e1e', strokeThickness: 5},
        'yellow_text': {fontSize: 30, color:'#fff', stroke: '#6d6e1e', strokeThickness: 5},
        'orange_text': {fontSize: 30, color:'#fff', stroke: '#6e491e', strokeThickness: 5},
        'red_text': {fontSize: 30, color:'#fff', stroke: '#6e1e2f', strokeThickness: 5}
	},
    'urls': { // path urls object
		'audio': 'assets/audio/',
		'logo': 'assets/logo/',
		'bgs': 'assets/bgs/',
		'skins': 'assets/skins/',
	},
    'ads': { // configuration of ads
        'interstitial': {
            'event_mult': { 'level_lost': 1, 'level_start': 0.4, 'change_scene': 0 }
		},
        'rewarded': {}
	},
    'langs': ['en', 'fr', 'de', 'es', 'it'], // languages presented in the game
    'shop': { // shop config
        'ad': [ // rewarded ad positions
            {'id': 'popular', 'price': 5},
            {'id': 'solana', 'price': 5},
            {'id': 'ethereum', 'price': 5},
            {'id': 'ton', 'price': 5},
            {'id': 'meme', 'price': 5},
            {'id': 'classic', 'price': 5},
        ],
        'purchase': [ // purchase positions
            {'id': 'remove_ad', 'price': 3.99}
        ]
    },
    'tracks': { // object to assign to any skin a special track that are located in the ./assets/audio/
        'popular': 'default',
        'solana': 'default',
        'ethereum': 'default',
        'classic': null,
        'ton': 'default',
        'meme': 'default',
    },
    'bgs': { // object to assign to any background a special track that are located in the ./assets/bgs/
        'popular': 'default',
        'solana': 'default',
        'ethereum': 'default',
        'classic': 'classic',
        'ton': 'default',
        'meme': 'default',
    },
    // user data object. If saved data exists then here it will be stored. Otherwise, local_user_data will be stored here
    'user_data': {}
}

const local_user_data = {
    'sound': 1, // if 0 sound will be disabled
    'music': 1, // if 0 music will be disabled
    'tutorial': { /* booster_tip: true */ }, // to show booster tip only once
    'ad_watched': { // object to remember how many times rewarded ads were watched for proper skin
        // 'popular': 2,
        // 'ethereum': 2,
        // 'solana': 2
    },
    'tutorial': {}, // object to remember wether tutorial or tip was shown
    'best_score': 0, // best score
    'payments': {'total': 0}, // payments info
    'lang': 'en', // select language
    // 'ad_skins': ['popular', 'ethereum', 'solana'],
    'ad_skins': ['popular'], // skins got due to watching rewarded ad
    'current_skin': 'popular' // current skin
}