// REAL SAMPLE DATA — 20 well-known Steam games, for testing the UI with real names and numbers.
// Load order: data.js → data-real.js → utils.js → ...
//
// REAL_DATA_MODE:  "add"  = append these games to the fake sample games (default)
//                  "only" = use ONLY these 10 games (fake games removed from lists and collections)
//                  "off"  = ignore this file
//
// Where the data comes from (be careful — most of it is NOT verified):
//  • Looked up online (Oct 2026): players for CS2, Dota 2, PUBG (Steam official stats page, Oct 9 2026) and Stardew Valley (steamcharts.com, undated).
//  • Written from memory, NOT checked against Steam: appid, developer, publisher, releaseDate, price, features, reviews %, reviewCount.
//    CS2 uses the 2012 Steam page date; the CS2 update itself launched 2023-09-27.
//  • My own choices: genres (e.g. "FPS", "MOBA", "Battle Royale" are my labels) and tags (not Steam's real user-tag lists).
//  • Estimates / placeholders: players for all games except the 4 above, delta (0), discount (0), reviewCount rounding.
//  • Images: NOT stored in the project. gameBg() in utils.js builds them from `appid` (local file first, then Steam CDN hosts,
//    then the generated placeholder art). Run tools/download_images.py once (needs internet) to save real images locally.
const REAL_DATA_MODE = "add";

// To add a game: copy an entry, change id/appid/name/... (appid = the number in the game's Steam store URL).
const REAL_GAMES = [
  { id:"cs2", appid:730, name:"Counter-Strike 2", developer:"Valve", publisher:"Valve", releaseDate:"2012-08-21",
    genres:["FPS","Action"], price:0, discount:0, players:498594, delta:0, reviews:86, reviewCount:9000000,
    tags:["Shooter","Multiplayer","Competitive","Team-Based","Tactical","Esports","Fast-Paced"], features:["Multiplayer"] },
  { id:"dota2", appid:570, name:"Dota 2", developer:"Valve", publisher:"Valve", releaseDate:"2013-07-09",
    genres:["MOBA","Strategy"], price:0, discount:0, players:461060, delta:0, reviews:82, reviewCount:2300000,
    tags:["Multiplayer","Competitive","Team-Based","Esports","Difficult","Replay Value"], features:["Multiplayer"] },
  { id:"pubg", appid:578080, name:"PUBG: BATTLEGROUNDS", developer:"KRAFTON, Inc.", publisher:"KRAFTON, Inc.", releaseDate:"2017-12-21",
    genres:["Battle Royale","Action"], price:0, discount:0, players:144617, delta:0, reviews:57, reviewCount:2500000,
    tags:["Shooter","Multiplayer","Survival","Open World","Competitive","Team-Based"], features:["Multiplayer"] },
  { id:"eldenring", appid:1245620, name:"ELDEN RING", developer:"FromSoftware, Inc.", publisher:"Bandai Namco Entertainment", releaseDate:"2022-02-25",
    genres:["RPG","Action"], price:5999, discount:0, players:45000, delta:0, reviews:92, reviewCount:900000,
    tags:["Souls-like","Open World","Difficult","Fantasy","Atmospheric","Singleplayer","Multiplayer","Story Rich"], features:["Singleplayer","Multiplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"bg3", appid:1086940, name:"Baldur's Gate 3", developer:"Larian Studios", publisher:"Larian Studios", releaseDate:"2023-08-03",
    genres:["RPG","Turn-Based","Story Rich"], price:5999, discount:0, players:50000, delta:0, reviews:96, reviewCount:700000,
    tags:["Fantasy","Co-op","Multiplayer","Singleplayer","Replay Value","Strategy","Atmospheric"], features:["Singleplayer","Multiplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"cyberpunk", appid:1091500, name:"Cyberpunk 2077", developer:"CD PROJEKT RED", publisher:"CD PROJEKT RED", releaseDate:"2020-12-10",
    genres:["RPG","Sci-Fi","Action"], price:5999, discount:0, players:30000, delta:0, reviews:87, reviewCount:720000,
    tags:["Open World","FPS","Story Rich","Atmospheric","Singleplayer","Controller Support"], features:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"stardew", appid:413150, name:"Stardew Valley", developer:"ConcernedApe", publisher:"ConcernedApe", releaseDate:"2016-02-26",
    genres:["Simulation","Indie","RPG"], price:1499, discount:0, players:56499, delta:0, reviews:98, reviewCount:700000,
    tags:["Farming Sim","Relaxing","Pixel Graphics","Co-op","Crafting","Singleplayer","Multiplayer","Replay Value"], features:["Singleplayer","Multiplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"hollowknight", appid:367520, name:"Hollow Knight", developer:"Team Cherry", publisher:"Team Cherry", releaseDate:"2017-02-24",
    genres:["Metroidvania","Indie","Action"], price:1499, discount:0, players:12000, delta:0, reviews:97, reviewCount:380000,
    tags:["Platformer","Difficult","Atmospheric","Pixel Graphics","Singleplayer","Controller Support","Replay Value"], features:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"hades", appid:1145360, name:"Hades", developer:"Supergiant Games", publisher:"Supergiant Games", releaseDate:"2020-09-17",
    genres:["Roguelike","Action","Indie"], price:2499, discount:0, players:4500, delta:0, reviews:98, reviewCount:245000,
    tags:["Fast-Paced","Story Rich","Replay Value","Singleplayer","Controller Support","Atmospheric"], features:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"terraria", appid:105600, name:"Terraria", developer:"Re-Logic", publisher:"Re-Logic", releaseDate:"2011-05-16",
    genres:["Survival","Adventure","Indie"], price:999, discount:0, players:30000, delta:0, reviews:97, reviewCount:1000000,
    tags:["Sandbox","Crafting","Pixel Graphics","Co-op","Open World","Multiplayer","Singleplayer","Replay Value"], features:["Singleplayer","Multiplayer","Controller Support","Achievements","Steam Deck Compatible"] },
  { id:"apex", appid:1172470, name:"Apex Legends", developer:"Respawn Entertainment", publisher:"Electronic Arts", releaseDate:"2020-11-04",
    genres:["Battle Royale","FPS","Action"], price:0, discount:0, players:90000, delta:0, reviews:80, reviewCount:1000000,
    tags:["Shooter","Multiplayer","Competitive","Team-Based","Fast-Paced","Free to Play"], features:["Multiplayer","Achievements"] },
  { id:"tf2", appid:440, name:"Team Fortress 2", developer:"Valve", publisher:"Valve", releaseDate:"2007-10-10",
    genres:["FPS","Action"], price:0, discount:0, players:55000, delta:0, reviews:92, reviewCount:1000000,
    tags:["Shooter","Multiplayer","Team-Based","Class-Based","Fast-Paced","Free to Play"], features:["Multiplayer","Achievements"] },
  { id:"rust", appid:252490, name:"Rust", developer:"Facepunch Studios", publisher:"Facepunch Studios", releaseDate:"2018-02-08",
    genres:["Survival","Action","Adventure"], price:3999, discount:0, players:90000, delta:0, reviews:87, reviewCount:700000,
    tags:["Open World","Multiplayer","Crafting","Competitive","Difficult"], features:["Multiplayer"] },
  { id:"portal2", appid:620, name:"Portal 2", developer:"Valve", publisher:"Valve", releaseDate:"2011-04-18",
    genres:["Puzzle","Adventure"], price:999, discount:0, players:6000, delta:0, reviews:98, reviewCount:380000,
    tags:["Co-op","Sci-Fi","Atmospheric","Story Rich","Singleplayer","Multiplayer"], features:["Singleplayer","Multiplayer","Controller Support","Achievements"] },
  { id:"rdr2", appid:1174180, name:"Red Dead Redemption 2", developer:"Rockstar Games", publisher:"Rockstar Games", releaseDate:"2019-12-05",
    genres:["Action","Adventure"], price:5999, discount:0, players:18000, delta:0, reviews:92, reviewCount:600000,
    tags:["Open World","Story Rich","Atmospheric","Singleplayer","Multiplayer","Controller Support"], features:["Singleplayer","Multiplayer","Controller Support","Achievements"] },
  { id:"witcher3", appid:292030, name:"The Witcher 3: Wild Hunt", developer:"CD PROJEKT RED", publisher:"CD PROJEKT RED", releaseDate:"2015-05-18",
    genres:["RPG","Action"], price:3999, discount:0, players:40000, delta:0, reviews:96, reviewCount:800000,
    tags:["Open World","Story Rich","Fantasy","Atmospheric","Singleplayer","Controller Support"], features:["Singleplayer","Controller Support","Achievements"] },
  { id:"sekiro", appid:814380, name:"Sekiro: Shadows Die Twice", developer:"FromSoftware, Inc.", publisher:"Activision", releaseDate:"2019-03-22",
    genres:["Action","Adventure"], price:5999, discount:0, players:9000, delta:0, reviews:94, reviewCount:270000,
    tags:["Souls-like","Difficult","Fast-Paced","Atmospheric","Singleplayer","Controller Support"], features:["Singleplayer","Controller Support","Achievements"] },
  { id:"civ6", appid:289070, name:"Sid Meier's Civilization VI", developer:"Firaxis Games", publisher:"2K", releaseDate:"2016-10-21",
    genres:["Strategy","Turn-Based"], price:5999, discount:0, players:30000, delta:0, reviews:83, reviewCount:280000,
    tags:["Replay Value","Multiplayer","Singleplayer"], features:["Singleplayer","Multiplayer","Achievements"] },
  { id:"slaythespire", appid:646570, name:"Slay the Spire", developer:"Mega Crit", publisher:"Mega Crit", releaseDate:"2019-01-23",
    genres:["Roguelike","Strategy","Indie"], price:2499, discount:0, players:10000, delta:0, reviews:97, reviewCount:150000,
    tags:["Turn-Based","Card Game","Replay Value","Difficult","Singleplayer"], features:["Singleplayer","Controller Support","Achievements"] },
  { id:"helldivers2", appid:553850, name:"HELLDIVERS 2", developer:"Arrowhead Game Studios", publisher:"Sony Interactive Entertainment", releaseDate:"2024-02-08",
    genres:["Action","Shooter"], price:3999, discount:0, players:20000, delta:0, reviews:83, reviewCount:620000,
    tags:["Co-op","Multiplayer","Fast-Paced","Sci-Fi","Team-Based","Controller Support"], features:["Multiplayer","Controller Support","Achievements"] }
];

(function applyRealData(){
  if (REAL_DATA_MODE === "off") return;
  const only = REAL_DATA_MODE === "only";
  const swap = (arr, items) => { arr.splice(0, arr.length, ...items); };
  const uniq = a => [...new Set(a)];

  // new genres + tags used by the real games (colors/emojis are optional — fallbacks exist)
  Object.assign(GENRE_COLORS, { FPS:"#E5384F", MOBA:"#2E7FE0", "Battle Royale":"#E86A12", Simulation:"#0FA37A", Survival:"#CC4452", Platformer:"#12AFA0", Shooter:"#E5384F" });
  const newTags = { FPS:["🎯","#E5384F"], MOBA:["🧙","#2E7FE0"], "Battle Royale":["🪂","#E86A12"], Shooter:["🔫","#E5384F"], Competitive:["🏆","#D98300"],
    "Team-Based":["🤝","#0FA37A"], Tactical:["♟️","#2E7FE0"], Esports:["📺","#6F4FF0"], Survival:["🏕️","#CC4452"], Simulation:["🧑‍🌾","#0FA37A"],
    Platformer:["🪜","#12AFA0"], "Free to Play":["🆓","#0FA37A"], "Class-Based":["🧑‍🔧","#D98300"], "Card Game":["🃏","#6F4FF0"], "Co-op":["👥","#0FA37A"], "Souls-like":["🗡️","#CC4452"], Fantasy:["🐉","#6F4FF0"], Crafting:["🛠️","#D98300"],
    "Pixel Graphics":["🟦","#2E7FE0"], Sandbox:["🏖️","#D98300"], "Farming Sim":["🌾","#0FA37A"] };
  for (const [t, m] of Object.entries(newTags)) if (!TAG_META[t]) TAG_META[t] = m;

  // games
  const games = REAL_GAMES.map(({ tags, features, ...g }) => g);
  if (only) swap(GAMES, games); else GAMES.push(...games);
  for (const g of REAL_GAMES) {
    GAME_TAG_OVERRIDES[g.id] = g.tags;
    GAME_FEATURES[g.id] = g.features;
    GAME_PUBLISHERS[g.id] = g.publisher;
  }
  swap(ALL_GENRES, uniq([...(only ? [] : ALL_GENRES), ...GAMES.flatMap(g => g.genres)]));
  swap(ALL_TAGS, uniq([...(only ? [] : ALL_TAGS), ...GAMES.flatMap(tagsForGame)]).sort());
  swap(DEVELOPERS, uniq([...(only ? [] : DEVELOPERS), ...games.map(g => g.developer)]));
  swap(PUBLISHERS, uniq([...(only ? [] : PUBLISHERS), ...games.map(g => g.publisher)]));

  if (only) {   // rebuild the collections that pointed at fake games
    const top = (key, n = 4) => [...GAMES].sort((a, b) => b[key] - a[key]).slice(0, n);
    swap(POPULAR, top("players"));  swap(WEEKLY, top("players"));  swap(MONTHLY, top("reviewCount"));
    swap(FREE_GAMES, GAMES.filter(g => g.price === 0));
    FEATURED = GAMES[0];
  }
})();
