// ── Token Shop ────────────────────────────────────────────────────────
export interface ShopItem {
  id: string;
  themeId: string;
  name: string;
  desc: string;
  cost: number;
  icon: string; // emoji or SVG string
  type: 'cosmetic' | 'sound' | 'badge';
}

export const SHOP_ITEMS: ShopItem[] = [
  // ── Supernatural ──
  { id:'sn_colt',     themeId:'supernatural', name:"The Colt",          desc:'A legendary revolver that can kill anything',  cost:50,  icon:'🔫', type:'cosmetic' },
  { id:'sn_impala',   themeId:'supernatural', name:'Baby (Impala)',      desc:'1967 Chevrolet Impala — their home',          cost:80,  icon:'🚗', type:'cosmetic' },
  { id:'sn_pentagram',themeId:'supernatural', name:'Devil\'s Trap',      desc:'Demonic binding symbol for the panel',        cost:30,  icon:'⛤', type:'cosmetic' },
  { id:'sn_tape',     themeId:'supernatural', name:'Mixtape',            desc:'"I left it. It\'s a gift."',                 cost:20,  icon:'📼', type:'cosmetic' },
  { id:'sn_pie',      themeId:'supernatural', name:"Dean's Pie",         desc:'He really does love pie',                    cost:10,  icon:'🥧', type:'cosmetic' },

  // ── The Mentalist ──
  { id:'mn_redj',     themeId:'mentalist', name:'Red John Smiley',       desc:'The infamous smiley face on your panel',      cost:60,  icon:'🔴', type:'cosmetic' },
  { id:'mn_tea',      themeId:'mentalist', name:'Jane\'s Tea Set',       desc:'Earl Grey. Always Earl Grey.',                cost:15,  icon:'🫖', type:'cosmetic' },
  { id:'mn_couch',    themeId:'mentalist', name:'The CBI Couch',         desc:'Where Patrick Jane does his best thinking',   cost:25,  icon:'🛋', type:'cosmetic' },
  { id:'mn_card',     themeId:'mentalist', name:'Playing Card',          desc:'"Pick a card, any card."',                   cost:20,  icon:'🃏', type:'cosmetic' },
  { id:'mn_badge',    themeId:'mentalist', name:'CBI Consultant Badge',  desc:'Officially unofficial',                       cost:40,  icon:'🪪', type:'badge'    },

  // ── The Sopranos ──
  { id:'sp_duck',     themeId:'sopranos', name:'Tony\'s Ducks',          desc:'The ones he misses most',                    cost:25,  icon:'🦆', type:'cosmetic' },
  { id:'sp_gabagool',  themeId:'sopranos', name:'Gabagool',              desc:'Capicola for the panel',                     cost:10,  icon:'🥩', type:'cosmetic' },
  { id:'sp_bada',     themeId:'sopranos', name:'Bada Bing! Sign',        desc:'Iconic neon for the dock',                   cost:70,  icon:'✨', type:'cosmetic' },
  { id:'sp_gun',      themeId:'sopranos', name:'Dropped Gun',            desc:'"Leave the gun. Take the cannoli."',         cost:45,  icon:'🔩', type:'cosmetic' },
  { id:'sp_cup',      themeId:'sopranos', name:'Coffee from Satriale\'s',desc:'Strong, black, no questions',                cost:15,  icon:'☕', type:'cosmetic' },

  // ── Dark ──
  { id:'dk_knot',     themeId:'dark', name:'Infinity Knot',              desc:'Time is a loop',                             cost:40,  icon:'♾', type:'cosmetic' },
  { id:'dk_clock',    themeId:'dark', name:'Winden Cave Clock',          desc:'33 years. Again.',                           cost:55,  icon:'⏱', type:'cosmetic' },
  { id:'dk_yellow',   themeId:'dark', name:'Yellow Rain Jacket',         desc:'Mikkel wore it. Jonas wore it.',             cost:30,  icon:'🧥', type:'cosmetic' },
  { id:'dk_letter',   themeId:'dark', name:'Claudia\'s Letter',          desc:'The truth is in the beginning',              cost:20,  icon:'📜', type:'cosmetic' },
  { id:'dk_travel',   themeId:'dark', name:'Time Travel Apparatus',      desc:'Handle with care',                           cost:90,  icon:'🕰', type:'cosmetic' },

  // ── Breaking Bad ──
  { id:'bb_hat',      themeId:'breakingbad', name:'Heisenberg Hat',      desc:'I am the danger.',                           cost:50,  icon:'🎩', type:'cosmetic' },
  { id:'bb_rving',    themeId:'breakingbad', name:'The RV (The Lab)',     desc:'Where it all started',                      cost:70,  icon:'🚐', type:'cosmetic' },
  { id:'bb_crystal',  themeId:'breakingbad', name:'Blue Sky',             desc:'99.1% pure',                                cost:40,  icon:'💎', type:'cosmetic' },
  { id:'bb_chicken',  themeId:'breakingbad', name:'Los Pollos Cup',       desc:'A legitimate business',                     cost:20,  icon:'🍗', type:'cosmetic' },
  { id:'bb_pizza',    themeId:'breakingbad', name:'Roof Pizza',           desc:'Walt threw it up there',                    cost:15,  icon:'🍕', type:'cosmetic' },

  // ── Stranger Things ──
  { id:'st_lights',   themeId:'strangerthings', name:'Christmas Lights',  desc:'Joyce\'s communication system',             cost:25,  icon:'💡', type:'cosmetic' },
  { id:'st_eggo',     themeId:'strangerthings', name:'Eggo Waffles',      desc:'Eleven\'s favourite',                       cost:15,  icon:'🧇', type:'cosmetic' },
  { id:'st_bike',     themeId:'strangerthings', name:'Mike\'s Bike',      desc:'The Party rode everywhere',                 cost:30,  icon:'🚲', type:'cosmetic' },
  { id:'st_walkie',   themeId:'strangerthings', name:'Walkie-Talkie',     desc:'Code: Ghostbusters',                        cost:35,  icon:'📻', type:'cosmetic' },
  { id:'st_dnd',      themeId:'strangerthings', name:'D&D Handbook',      desc:'The Demogorgon is just the beginning',      cost:20,  icon:'🎲', type:'cosmetic' },

  // ── Severance ──
  { id:'sv_finger',  themeId:'severance', name:'Finger Trap',        desc:'"It helps me not to think about it"',         cost:20,  icon:'🪢', type:'cosmetic' },
  { id:'sv_waffle',  themeId:'severance', name:'Waffle Party',        desc:'The reward you have been working toward',    cost:15,  icon:'🧇', type:'cosmetic' },
  { id:'sv_goat',    themeId:'severance', name:'Baby Goat',           desc:'Milchick approved',                          cost:35,  icon:'🐐', type:'cosmetic' },
  { id:'sv_handbook',themeId:'severance', name:'Employee Handbook',   desc:'Lumon Industries. Rule 1: Obey.',            cost:40,  icon:'📋', type:'cosmetic' },
  { id:'sv_eyeball', themeId:'severance', name:"Kier's Portrait",     desc:'"Beloved founder. Chosen one."',             cost:60,  icon:'👁', type:'badge'    },
  { id:'in_watch',    themeId:'interstellar', name:'Cooper\'s Watch',     desc:'Love transcends dimensions',                cost:75,  icon:'⌚', type:'cosmetic' },
  { id:'in_bookshelf',themeId:'interstellar', name:'The Bookshelf',       desc:'Gravity as a message',                      cost:40,  icon:'📚', type:'cosmetic' },
  { id:'du_crysknife',themeId:'dune', name:'Crysknife',                   desc:'Forged from a Maker\'s tooth',              cost:60,  icon:'🗡', type:'cosmetic' },
  { id:'du_spice',    themeId:'dune', name:'Melange Spice',               desc:'The spice must flow',                       cost:30,  icon:'🟤', type:'cosmetic' },
  { id:'mx_pill',     themeId:'matrix', name:'Red Pill',                   desc:'Welcome to the real world',                 cost:35,  icon:'💊', type:'cosmetic' },
  { id:'mx_phone',    themeId:'matrix', name:'Rotary Phone',               desc:'Ring ring',                                 cost:20,  icon:'📞', type:'cosmetic' },
  { id:'br_origami',  themeId:'bladerunner', name:'Gaff\'s Origami',      desc:'A unicorn in the rain',                    cost:55,  icon:'🦄', type:'cosmetic' },
  { id:'ic_totem',    themeId:'inception', name:'Totem',                   desc:'Still spinning?',                          cost:45,  icon:'🪀', type:'cosmetic' },
  { id:'gf_cannoli',  themeId:'godfather', name:'The Cannoli',             desc:'Leave the gun. Take the cannoli.',         cost:20,  icon:'🧁', type:'cosmetic' },
  { id:'gf_offer',    themeId:'godfather', name:'The Offer',               desc:'One he can\'t refuse',                     cost:80,  icon:'🤝', type:'cosmetic' },

  // ── Cyberpunk 2077 ──
  { id:'cp_shard',    themeId:'cyberpunk', name:'Neural Shard',           desc:'Slot it and find out',                      cost:40,  icon:'💾', type:'cosmetic' },
  { id:'cp_jacket',   themeId:'cyberpunk', name:'Samurai Jacket',         desc:'Wake the f*** up',                          cost:70,  icon:'🧥', type:'cosmetic' },
  { id:'cp_katana',   themeId:'cyberpunk', name:'Mantis Blade',           desc:'Hidden in the forearm',                     cost:60,  icon:'⚔️',type:'cosmetic' },
  { id:'cp_ripperdoc',themeId:'cyberpunk', name:'Ripperdoc Token',        desc:'One free cyberware upgrade',                cost:85,  icon:'🔧', type:'badge'    },
  { id:'cp_corpo',    themeId:'cyberpunk', name:'Arasaka Badge',          desc:'The corp never dies',                       cost:30,  icon:'🏢', type:'cosmetic' },

  // ── 2001: A Space Odyssey ──
  { id:'hal_eye',     themeId:'hal9000',   name:'HAL 9000 Lens',          desc:'"I\'m sorry, Dave."',                       cost:80,  icon:'🔴', type:'badge'    },
  { id:'hal_bone',    themeId:'hal9000',   name:'Bone Tool',              desc:'The first weapon. Also the last.',          cost:25,  icon:'🦴', type:'cosmetic' },
  { id:'hal_mono',    themeId:'hal9000',   name:'Monolith Slab',          desc:'Touch it. You know you want to.',           cost:60,  icon:'⬛', type:'cosmetic' },
  { id:'hal_pod',     themeId:'hal9000',   name:'Discovery Pod',          desc:'EVA pod. Don\'t open the bay doors.',       cost:50,  icon:'🛸', type:'cosmetic' },

  // ── Tenet ──
  { id:'tn_invert',   themeId:'tenet',     name:'Inversion Device',       desc:'"Don\'t try to understand it."',            cost:75,  icon:'⏪', type:'cosmetic' },
  { id:'tn_glove',    themeId:'tenet',     name:'Temporal Glove',         desc:'Catches inverted bullets',                  cost:50,  icon:'🧤', type:'cosmetic' },
  { id:'tn_mask',     themeId:'tenet',     name:'Tenet Mask',             desc:'Ignorance is our ammunition',               cost:40,  icon:'🎭', type:'cosmetic' },
  { id:'tn_alg',      themeId:'tenet',     name:'Algorithm Piece',        desc:'One of nine. Keep it safe.',                cost:90,  icon:'🧩', type:'badge'    },

  // ── House of the Dragon ──
  { id:'hd_egg',      themeId:'dragonfire',name:'Dragon Egg',             desc:'Keep it warm. Always warm.',                cost:65,  icon:'🥚', type:'cosmetic' },
  { id:'hd_crown',    themeId:'dragonfire',name:'Iron Crown',             desc:'Heavy is the head',                         cost:90,  icon:'👑', type:'badge'    },
  { id:'hd_sword',    themeId:'dragonfire',name:'Dark Sister',            desc:'Rhaenyra\'s blade',                         cost:70,  icon:'⚔️',type:'cosmetic' },
  { id:'hd_scroll',   themeId:'dragonfire',name:'Valyrian Scroll',        desc:'The succession dispute, written in blood',  cost:35,  icon:'📜', type:'cosmetic' },
  { id:'hd_scale',    themeId:'dragonfire',name:'Dragon Scale',           desc:'From Caraxes himself',                      cost:45,  icon:'🔶', type:'cosmetic' },

  // ── Moon Knight ──
  { id:'mk_scarab',   themeId:'moonknight',name:'Golden Scarab',          desc:'Khonshu\'s most sacred relic',              cost:80,  icon:'🪲', type:'badge'    },
  { id:'mk_cape',     themeId:'moonknight',name:'Moon Knight Cape',       desc:'Made of moonbeams, Marc',                   cost:55,  icon:'🌙', type:'cosmetic' },
  { id:'mk_ankh',     themeId:'moonknight',name:'Ankh Amulet',            desc:'Ancient Egyptian symbol of life',           cost:40,  icon:'☥', type:'cosmetic' },
  { id:'mk_crescent', themeId:'moonknight',name:'Crescent Dart',          desc:'Thrown true by the Fist of Khonshu',        cost:35,  icon:'🌛', type:'cosmetic' },

  // ── One Piece ──
  { id:'op_hat',      themeId:'onepiece',  name:'Straw Hat',              desc:'The treasure of the King of Pirates',        cost:90,  icon:'🎩', type:'badge'    },
  { id:'op_fruit',    themeId:'onepiece',  name:'Gomu Gomu no Mi',        desc:'Eat it and you\'ll never swim again',         cost:60,  icon:'🍎', type:'cosmetic' },
  { id:'op_sword',    themeId:'onepiece',  name:'Zoro\'s Katana',         desc:'Santoryu. Three swords, one legend.',         cost:70,  icon:'⚔️',type:'cosmetic' },
  { id:'op_log',      themeId:'onepiece',  name:'Log Pose',               desc:'Navigating the Grand Line',                  cost:35,  icon:'🧭', type:'cosmetic' },
  { id:'op_jolly',    themeId:'onepiece',  name:'Jolly Roger',            desc:'The Straw Hat crew sail on',                  cost:45,  icon:'🏴‍☠️',type:'cosmetic'},

  // ── Attack on Titan ──
  { id:'aot_wings',   themeId:'attackontitan',name:'Wings of Freedom',    desc:'Survey Corps emblem. Dedicate your heart.',  cost:80,  icon:'🦅', type:'badge'    },
  { id:'aot_gear',    themeId:'attackontitan',name:'ODM Gear',            desc:'Vertical manoeuvring equipment',             cost:65,  icon:'🪝', type:'cosmetic' },
  { id:'aot_key',     themeId:'attackontitan',name:'Basement Key',        desc:'Eren\'s father left it for a reason',        cost:50,  icon:'🗝', type:'cosmetic' },
  { id:'aot_scarf',   themeId:'attackontitan',name:'Red Scarf',           desc:'He tied it around her neck',                 cost:30,  icon:'🧣', type:'cosmetic' },

  // ── Death Note ──
  { id:'dn_note',     themeId:'deathnote', name:'Death Note',             desc:'The human whose name is written in it…',    cost:85,  icon:'📓', type:'badge'    },
  { id:'dn_apple',    themeId:'deathnote', name:'Ryuk\'s Apple',          desc:'Shinigami love apples',                      cost:20,  icon:'🍎', type:'cosmetic' },
  { id:'dn_chip',     themeId:'deathnote', name:'Potato Chip',            desc:'"I\'ll take a potato chip… and eat it!"',    cost:10,  icon:'🍟', type:'cosmetic' },
  { id:'dn_l',        themeId:'deathnote', name:'L\'s Cake',              desc:'I\'ll take the case. But give me cake first.',cost:35, icon:'🍰', type:'cosmetic' },

  // ── Project Hail Mary ──
  { id:'hm_astrophage',themeId:'hailmary', name:'Astrophage Vial',        desc:'The organism that started it all',            cost:65, icon:'🧫', type:'cosmetic' },
  { id:'hm_stratt',   themeId:'hailmary', name:'Stratt\'s Notebook',     desc:'Saving the world, one calculation at a time', cost:40, icon:'📓', type:'cosmetic' },
  { id:'hm_rocky',    themeId:'hailmary', name:'Rocky\'s Carapace',      desc:'The first alien friend',                      cost:80, icon:'🪨', type:'badge'    },
  { id:'hm_tauceti',  themeId:'hailmary', name:'Tau Ceti Star Map',      desc:'The destination. 11.9 light-years away.',     cost:55, icon:'🌟', type:'cosmetic' },

  // ── Evangelion ──
  { id:'ev_unit01',   themeId:'evangelion', name:'Unit-01 Badge',        desc:'The Eva that always fought back',             cost:85, icon:'🤖', type:'badge'    },
  { id:'ev_prog',     themeId:'evangelion', name:'Progressive Knife',    desc:'Standard equipment. Very sharp.',             cost:50, icon:'🗡', type:'cosmetic' },
  { id:'ev_soul',     themeId:'evangelion', name:'Core Crystal',         desc:'Something lives inside the Eva.',             cost:70, icon:'💜', type:'cosmetic' },
  { id:'ev_nerv',     themeId:'evangelion', name:'NERV Keycard',         desc:'God\'s in his heaven — all\'s right with the world.',cost:30,icon:'🪪',type:'cosmetic'},

  // ── Akira ──
  { id:'ak_bike',     themeId:'akira', name:'Kaneda\'s Motorcycle',      desc:'The red bike. Neo-Tokyo, 2019.',              cost:90, icon:'🏍', type:'badge'    },
  { id:'ak_capsules', themeId:'akira', name:'Clown Capsules',            desc:'Don\'t take them all at once.',               cost:20, icon:'💊', type:'cosmetic' },
  { id:'ak_jacket',   themeId:'akira', name:'Capsule Gang Jacket',       desc:'Red. Always red.',                            cost:55, icon:'🧥', type:'cosmetic' },

  { id:'f1rb_trophy', themeId:'redbull',     name:'WCC Trophy',            desc:'World Constructors Champions',             cost:100, icon:'🏆', type:'badge'    },
  { id:'f1rb_helmet', themeId:'redbull',     name:'Max\'s Helmet',         desc:'Blue and red RB design',                  cost:60,  icon:'🪖', type:'cosmetic' },
  { id:'f1fe_horse',  themeId:'ferrari',     name:'Prancing Horse Pin',    desc:'Il Cavallino Rampante',                   cost:60,  icon:'🐎', type:'badge'    },
  { id:'f1fe_cap',    themeId:'ferrari',     name:'Scuderia Cap',          desc:'Red, always red',                         cost:35,  icon:'🧢', type:'cosmetic' },
  { id:'f1me_star',   themeId:'mercedes',    name:'Three-Pointed Star',    desc:'AMG Petronas identity',                   cost:55,  icon:'⭐', type:'badge'    },
  { id:'f1me_tire',   themeId:'mercedes',    name:'Silver Arrow Tyre',     desc:'Still we rise',                           cost:30,  icon:'⭕', type:'cosmetic' },
  { id:'f1mc_papaya', themeId:'mclaren',     name:'Papaya Launch Kit',     desc:'Iconic since 1968',                       cost:50,  icon:'🟠', type:'badge'    },
  { id:'f1mc_wing',   themeId:'mclaren',     name:'Carbon Fibre Wing',     desc:'Aerodynamic perfection',                  cost:40,  icon:'✈', type:'cosmetic' },
  { id:'f1am_dbx',    themeId:'astonmartin', name:'DBX707 Key',            desc:'Power, beauty, soul',                     cost:55,  icon:'🗝', type:'cosmetic' },
  { id:'f1am_green',  themeId:'astonmartin', name:'BRG Enamel Pin',        desc:'British Racing Green',                    cost:35,  icon:'🟢', type:'badge'    },
];

// ── Persistence ───────────────────────────────────────────────────────
const TOKENS_KEY   = 'sc_tokens';
const OWNED_KEY    = 'sc_owned_items';
const EQUIPPED_KEY = 'sc_equipped';

export function getTokens(): number {
  return parseInt(localStorage.getItem(TOKENS_KEY) ?? '0');
}
export function addTokens(n: number) {
  localStorage.setItem(TOKENS_KEY, String(getTokens() + n));
}
export function getOwned(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(OWNED_KEY) ?? '[]')); } catch { return new Set(); }
}
export function getEquipped(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(EQUIPPED_KEY) ?? '[]')); } catch { return new Set(); }
}
export function buyItem(id: string): 'ok' | 'already' | 'poor' {
  const owned = getOwned();
  if (owned.has(id)) return 'already';
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return 'already';
  if (getTokens() < item.cost) return 'poor';
  addTokens(-item.cost);
  owned.add(id);
  localStorage.setItem(OWNED_KEY, JSON.stringify([...owned]));
  return 'ok';
}
export function toggleEquip(id: string) {
  const eq = getEquipped();
  eq.has(id) ? eq.delete(id) : eq.add(id);
  localStorage.setItem(EQUIPPED_KEY, JSON.stringify([...eq]));
}
export function getItemsForTheme(themeId: string): ShopItem[] {
  return SHOP_ITEMS.filter(i => i.themeId === themeId);
}
