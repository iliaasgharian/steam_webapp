// Sample data: games, tags, developers, DLC, comments

/* ================= Sample data ================= */
const GENRE_COLORS = {
  "Action":"#E5384F","Adventure":"#1C86A8","Indie":"#0FA37A","Strategy":"#D98300",
  "RPG":"#6F4FF0","Puzzle":"#2E7FE0","Racing":"#E86A12","Sci-Fi":"#12AFA0",
  "Roguelike":"#CC4452","Turn-Based":"#D98300","Metroidvania":"#0FA37A","Story Rich":"#6F4FF0","Arcade":"#E86A12"
};
function gc(genre){ return GENRE_COLORS[genre] || "#6F4FF0"; }

const GAMES = [
  { id:"embercliff", name:"Embercliff", developer:"Northwake Studio", publisher:"Cinder House", releaseDate:"2026-02-14", genres:["Action","Roguelike"], price:1999, discount:35, players:41230, delta:6.2, reviews:92, reviewCount:20100 },
  { id:"lowtide", name:"Low Tide Harbor", developer:"Moonlit Works", publisher:"Black Harbor", releaseDate:"2025-11-07", genres:["Adventure","Indie"], price:1499, discount:0, players:8890, delta:-2.1, reviews:88, reviewCount:6400 },
  { id:"ironsprawl", name:"Ironsprawl", developer:"Arcvale Labs", publisher:"Arcvale Interactive", releaseDate:"2026-01-22", genres:["Strategy","Sci-Fi"], price:2999, discount:20, players:22110, delta:3.4, reviews:85, reviewCount:15300 },
  { id:"driftloop", name:"Driftloop", developer:"Ember Forge", publisher:"Ember Forge", releaseDate:"2025-08-19", genres:["Racing","Arcade"], price:999, discount:0, players:5410, delta:1.1, reviews:79, reviewCount:3100 },
  { id:"hollowmark", name:"Hollowmark", developer:"Northwake Studio", publisher:"Northwake Studio", releaseDate:"2026-03-05", genres:["Metroidvania","Indie"], price:1799, discount:50, players:31980, delta:14.8, reviews:96, reviewCount:28900 },
  { id:"cinderfall", name:"Cinderfall Tactics", developer:"Cinder House", publisher:"Cinder House", releaseDate:"2025-12-11", genres:["Strategy","Turn-Based"], price:2499, discount:0, players:12770, delta:-0.6, reviews:90, reviewCount:9800 },
  { id:"nightbloom", name:"Nightbloom", developer:"Moonlit Works", publisher:"Northstar Publishing", releaseDate:"2026-04-02", genres:["RPG","Story Rich"], price:3499, discount:15, players:18420, delta:8.9, reviews:94, reviewCount:17200 },
  { id:"quarryrun", name:"Quarry Run", developer:"Ember Forge", publisher:"Ember Forge", releaseDate:"2025-06-28", genres:["Puzzle","Indie"], price:599, discount:0, players:3020, delta:0.4, reviews:81, reviewCount:2200 }
];
const FEATURED = GAMES[0];
const ALL_GENRES = [...new Set(GAMES.flatMap(g=>g.genres))];
const FREE_GAMES = [GAMES[7], {id:"freefall",name:"Freefall Protocol",genres:["Action","Indie"],price:0,discount:0,players:1840,delta:5.2,reviews:86,reviewCount:980}, {id:"starforge",name:"Starforge Arena",genres:["Strategy","Sci-Fi"],price:0,discount:0,players:7210,delta:9.1,reviews:82,reviewCount:5400}, {id:"pixelquest",name:"Pixel Quest Online",genres:["Adventure","RPG"],price:0,discount:0,players:4310,delta:3.8,reviews:89,reviewCount:3200}];
const BUNDLES = [{id:"indie-pack",name:"Indie Discovery Pack",genres:["Indie","Adventure"],price:2999,discount:55,players:0,delta:0,reviews:91,reviewCount:8200},{id:"strategy-core",name:"Strategy Core Bundle",genres:["Strategy","Turn-Based"],price:4499,discount:48,players:0,delta:0,reviews:88,reviewCount:12600},{id:"night-pack",name:"Nightfall Collection",genres:["RPG","Story Rich"],price:3999,discount:42,players:0,delta:0,reviews:94,reviewCount:15100},{id:"arcade-pack",name:"Arcade Rush Bundle",genres:["Racing","Arcade"],price:1899,discount:50,players:0,delta:0,reviews:87,reviewCount:4300}];
const UPCOMING = [{id:"ashenwake",name:"Ashenwake",releaseDate:"2026-10-15",genres:["RPG","Story Rich"],price:3999,discount:0,players:0,delta:0,reviews:0,reviewCount:0},{id:"neonharbor",name:"Neon Harbor",releaseDate:"2026-11-03",genres:["Action","Sci-Fi"],price:2499,discount:0,players:0,delta:0,reviews:0,reviewCount:0},{id:"frostline",name:"Frostline",releaseDate:"2026-12-09",genres:["Adventure","Indie"],price:1999,discount:0,players:0,delta:0,reviews:0,reviewCount:0},{id:"cobaltfront",name:"Cobalt Front",releaseDate:"2027-01-21",genres:["Strategy","Sci-Fi"],price:2999,discount:0,players:0,delta:0,reviews:0,reviewCount:0}];
const POPULAR=[GAMES[0],GAMES[4],GAMES[2],GAMES[6]]; const WEEKLY=[GAMES[4],GAMES[6],GAMES[0],GAMES[2]]; const MONTHLY=[GAMES[4],GAMES[0],GAMES[6],GAMES[5]]; const WISHLISTED=[UPCOMING[0],UPCOMING[1],GAMES[4],UPCOMING[2]];
const DEVELOPERS=["Northwake Studio","Ember Forge","Arcvale Labs","Moonlit Works"]; const PUBLISHERS=["Arcvale Interactive","Black Harbor","Northstar Publishing","Cinder House"];
const GAME_PUBLISHERS={
  embercliff:"Cinder House",
  lowtide:"Black Harbor",
  ironsprawl:"Arcvale Interactive",
  driftloop:"Ember Forge",
  hollowmark:"Northwake Studio",
  cinderfall:"Cinder House",
  nightbloom:"Northstar Publishing",
  quarryrun:"Ember Forge"
};
const DETAIL_TAGS=["Roguelike","Fast-Paced","Difficult","Atmospheric","Replay Value","Singleplayer","Controller Support","Action Roguelike"];
const TAG_META={
  "Action":["⚔️","#E5384F"],"Adventure":["🧭","#1C86A8"],"Arcade":["🕹️","#D98300"],"Atmospheric":["🌌","#6F4FF0"],"Controller Support":["🎮","#0FA37A"],"Difficult":["💀","#E5384F"],"Fast-Paced":["⚡","#D98300"],"Indie":["💎","#6F4FF0"],"Multiplayer":["👥","#0FA37A"],"Metroidvania":["🗺️","#6F4FF0"],"Open World":["🌍","#1C86A8"],"Puzzle":["🧩","#D98300"],"Racing":["🏁","#E5384F"],"Replay Value":["🔁","#0FA37A"],"RPG":["🧙","#6F4FF0"],"Relaxing":["🌿","#0FA37A"],"Roguelike":["♻️","#E5384F"],"Sci-Fi":["🚀","#1C86A8"],"Singleplayer":["👤","#6B7384"],"Story Rich":["📖","#D98300"],"Strategy":["♟️","#6F4FF0"],"Turn-Based":["⏳","#1C86A8"]
};
const GAME_TAG_OVERRIDES={
  embercliff:["Action","Roguelike","Fast-Paced","Difficult","Replay Value","Singleplayer","Controller Support"],
  lowtide:["Adventure","Indie","Atmospheric","Story Rich","Singleplayer","Open World"],
  ironsprawl:["Strategy","Sci-Fi","Multiplayer","Turn-Based","Difficult","Replay Value"],
  driftloop:["Racing","Arcade","Fast-Paced","Replay Value","Controller Support","Multiplayer"],
  hollowmark:["Action","Roguelike","Metroidvania","Difficult","Atmospheric","Singleplayer","Replay Value"],
  cinderfall:["Strategy","Turn-Based","Difficult","Singleplayer","Replay Value"],
  nightbloom:["RPG","Story Rich","Atmospheric","Singleplayer","Open World"],
  quarryrun:["Puzzle","Indie","Relaxing","Singleplayer","Replay Value"]
};
const ALL_TAGS=Object.keys(TAG_META);
const FEATURE_FILTERS=["Singleplayer","Multiplayer","Controller Support","Achievements","Steam Deck Compatible"];
const GAME_FEATURES={
  embercliff:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"],
  lowtide:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"],
  ironsprawl:["Multiplayer","Controller Support","Achievements"],
  driftloop:["Multiplayer","Controller Support","Achievements","Steam Deck Compatible"],
  hollowmark:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"],
  cinderfall:["Singleplayer","Controller Support","Achievements"],
  nightbloom:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"],
  quarryrun:["Singleplayer","Controller Support","Achievements","Steam Deck Compatible"]
};
function featuresForGame(g){return GAME_FEATURES[g.id]||[];}
function tagsForGame(g){return [...new Set([...(g.genres||[]),...(GAME_TAG_OVERRIDES[g.id]||[])])]}
function tagChip(tag){const m=TAG_META[tag]||["🏷️","#6B7384"];return `<span class="tag-chip" style="--tag-color:${m[1]}"><span class="tag-chip-icon">${m[0]}</span>${tag}</span>`;}
function tagChips(arr){return arr.map(tagChip).join("");}
const DLC=["Echoes of the Deep","Ashfall Arsenal","The Lost Coast","Nightfall Pack"]; const COMMENTS=[{u:"MiraK",t:"2 days ago",x:"The combat loop feels great and the analytics make it easy to see how active the game still is."},{u:"PixelPilot",t:"5 days ago",x:"Really liked the atmosphere. The player trend is also surprisingly steady."},{u:"Rook",t:"1 week ago",x:"A solid recommendation if you like short repeatable runs and build variety."}];