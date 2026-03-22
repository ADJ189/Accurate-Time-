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

  // ── F1 Teams ──
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
