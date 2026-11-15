/* =====================================================================
   ContactSphere — application logic + UI
   ===================================================================== */
(() => {
'use strict';

/* ----------------------------- helpers ------------------------------ */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const digits = s => String(s || '').replace(/\D/g, '');
const STORAGE_KEY = 'contactsphere.v1';
const THEME_KEY = 'contactsphere.theme';
const GROUPS = ['Family', 'Friends', 'Work', 'College', 'Other'];
const GROUP_COLORS = { Family: '#f43f5e', Friends: '#f59e0b', Work: '#6366f1', College: '#10b981', Other: '#64748b' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  tree: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  note: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>',
  tag: '<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.3-7.3a1 1 0 0 0 0-1.41Z"/><circle cx="7" cy="7" r="1.5"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};
const icon = (name, size = 18) =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
const hydrateIcons = (root = document) =>
  $$('[data-icon]', root).forEach(el => { el.outerHTML = icon(el.dataset.icon, +el.dataset.size || 18); });

function hashHue(str) {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}
function initials(name) {
  const p = String(name).replace(/^(dr|mr|mrs|ms)\.?\s+/i, '').trim().split(/\s+/);
  return ((p[0]?.[0] || '?') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}
function avatar(c, cls = '') {
  const h = hashHue(c.name);
  const img = c.photo ? `<img src="${esc(c.photo)}" alt="" loading="lazy" onerror="this.remove()">` : '';
  return `<div class="avatar ${cls}" style="--h1:${h};--h2:${(h + 45) % 360}">${esc(initials(c.name))}${img}</div>`;
}
function fmtPhone(p) {
  const d = digits(p);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : p;
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function daysUntilBirthday(dateStr) {
  if (!dateStr) return null;
  const [, m, d] = dateStr.split('-').map(Number);
  if (!m || !d) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), m - 1, d);
  if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d);
  return Math.round((next - today) / 86400000);
}

/* ===================================================================
   ContactBook — glues all data structures together
   =================================================================== */
class ContactBook {
  constructor() { this.reset(); }

  reset() {
    this.store = new HashMap(8);        // id     -> contact
    this.phoneIndex = new HashMap(8);   // phone  -> id
    this.textTrie = new Trie();         // words  -> ids
    this.phoneTrie = new Trie();        // digits -> ids
    this.tree = new AVLTree();          // name   -> sorted
    this.undoStack = new Stack(25);
    this.recent = new CircularQueue(6);
    this.log = [];
  }

  static tokens(c) {
    const name = c.name.toLowerCase().trim().replace(/\s+/g, ' ');
    const set = new Set([name, ...name.split(' ')]);
    if (c.company) { const co = c.company.toLowerCase().trim(); set.add(co); co.split(/\s+/).forEach(w => set.add(w)); }
    if (c.email) set.add(c.email.toLowerCase().trim());
    return [...set].filter(Boolean);
  }
  static key(c) { return c.name.toLowerCase().trim() + '\u0000' + c.id; }
  static newId() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  _index(c) {
    this.store.set(c.id, c);
    this.phoneIndex.set(digits(c.phone), c.id);
    ContactBook.tokens(c).forEach(t => this.textTrie.insert(t, c.id));
    this.phoneTrie.insert(digits(c.phone), c.id);
    this.tree.insert(ContactBook.key(c), c.id);
  }
  _unindex(c) {
    this.store.delete(c.id);
    this.phoneIndex.delete(digits(c.phone));
    ContactBook.tokens(c).forEach(t => this.textTrie.remove(t, c.id));
    this.phoneTrie.remove(digits(c.phone), c.id);
    this.tree.remove(ContactBook.key(c));
  }

  _log(op, ds, cx, t0, detail) {
    this.log.unshift({ op, ds, cx, ms: performance.now() - t0, detail, time: Date.now() });
    if (this.log.length > 40) this.log.pop();
  }

  get(id) { return this.store.get(id); }
  all() { return this.store.values(); }
  get size() { return this.store.size; }

  phoneTaken(phone, exceptId) {
    const owner = this.phoneIndex.get(digits(phone));      // O(1)
    return owner !== undefined && owner !== exceptId;
  }

  add(data, { record = true, log = true } = {}) {
    const t0 = performance.now();
    if (this.phoneTaken(data.phone)) throw new Error('A contact with this phone number already exists');
    const c = {
      name: '', phone: '', email: '', company: '', group: 'Other', birthday: '', address: '', notes: '', favorite: false, photo: '',
      ...data,
      id: data.id || ContactBook.newId(),
      createdAt: data.createdAt || Date.now(),
    };
    this._index(c);
    if (record) this.undoStack.push({ type: 'add', contact: { ...c } });
    if (log) this._log('INSERT', 'HashMap · Trie · AVL', 'O(1) + O(L) + O(log n)', t0, c.name);
    return c;
  }

  update(id, data, { record = true } = {}) {
    const t0 = performance.now();
    const before = this.get(id);
    if (!before) return null;
    if (this.phoneTaken(data.phone ?? before.phone, id)) throw new Error('Another contact already uses this phone number');
    const snapshot = { ...before };
    this._unindex(before);
    const c = { ...before, ...data, id };
    this._index(c);
    if (record) this.undoStack.push({ type: 'update', contact: snapshot });
    this._log('UPDATE', 'Re-index all structures', 'O(L + log n)', t0, c.name);
    return c;
  }

  remove(id, { record = true } = {}) {
    const t0 = performance.now();
    const c = this.get(id);
    if (!c) return null;
    this._unindex(c);
    this.recent.removeWhere(x => x === id);
    if (record) this.undoStack.push({ type: 'delete', contact: { ...c } });
    this._log('DELETE', 'HashMap · Trie · AVL', 'O(1) + O(L) + O(log n)', t0, c.name);
    return c;
  }

  toggleFavorite(id, { record = true } = {}) {
    const t0 = performance.now();
    const c = this.get(id);
    if (!c) return null;
    c.favorite = !c.favorite;
    if (record) this.undoStack.push({ type: 'favorite', contact: { ...c } });
    this._log(c.favorite ? 'FAVOURITE' : 'UNFAVOURITE', 'HashMap get', 'O(1)', t0, c.name);
    return c;
  }

  undo() {
    const t0 = performance.now();
    const a = this.undoStack.pop();
    if (!a) return null;
    const c = a.contact;
    if (a.type === 'add') this.remove(c.id, { record: false });
    else if (a.type === 'delete') this.add(c, { record: false, log: false });
    else if (a.type === 'update') {
      const cur = this.get(c.id);
      if (cur) { this._unindex(cur); this._index({ ...c }); }
    } else if (a.type === 'favorite') this.toggleFavorite(c.id, { record: false });
    this._log('UNDO', 'Stack pop', 'O(1)', t0, `${a.type} · ${c.name}`);
    return a;
  }

  view(id) {
    this.recent.removeWhere(x => x === id);
    this.recent.enqueue(id);
  }

  search(q) {
    const t0 = performance.now();
    q = q.toLowerCase().trim().replace(/\s+/g, ' ');
    const isPhone = /^[+\d][\d\s-]*$/.test(q) && digits(q).length > 0;
    let ids;
    if (isPhone) {
      let d = digits(q);
      if (d.startsWith('91') && d.length > 10) d = d.slice(2);
      ids = this.phoneTrie.search(d);
    } else ids = this.textTrie.search(q);
    const ms = performance.now() - t0;
    this._log('SEARCH', isPhone ? 'Trie (phone)' : 'Trie (text)', 'O(L)', t0, `"${q}" → ${ids.size}`);
    return { ids, ms, ds: isPhone ? 'Phone Trie' : 'Trie' };
  }

  sortedIds(order) {
    const t0 = performance.now();
    let ids;
    if (order === 'az') ids = this.tree.inorder();
    else if (order === 'za') ids = this.tree.reverseInorder();
    else {
      const dir = order === 'new' ? -1 : 1;
      ids = mergeSort(this.all(), (a, b) => dir * (a.createdAt - b.createdAt) || a.name.localeCompare(b.name)).map(c => c.id);
    }
    return { ids, ms: performance.now() - t0 };
  }

  upcomingBirthdays(k = 5) {
    const heap = new MinHeap((a, b) => a.days - b.days);
    for (const c of this.all()) {
      const days = daysUntilBirthday(c.birthday);
      if (days !== null) heap.push({ days, id: c.id });
    }
    const out = [];
    while (out.length < k && heap.size) out.push(heap.pop());
    return { out, heap };
  }

  toJSON() { return { seedVersion: SEED_VERSION, contacts: this.all(), recent: this.recent.toArray() }; }
}

/* ===================================================================
   App state & persistence
   =================================================================== */
const book = new ContactBook();
const state = { view: 'dashboard', query: '', group: 'All', sort: 'az', layout: 'grid', vizTab: 'hashmap', trieQuery: '', avlQuery: '', search: null, openId: null };

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(book.toJSON())); }
  catch (err) { if (err && err.name === 'QuotaExceededError') toast('Browser storage is full — remove some photos', 'error'); }
}
function seed() {
  book.reset();
  const now = Date.now();
  // shuffle so the AVL tree gets a realistic insertion order
  const list = SEED_CONTACTS.map((c, i) => ({ ...c, createdAt: now - (SEED_CONTACTS.length - i) * 3600 * 1000 * 7 }));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  list.forEach(c => book.add(c, { record: false, log: false }));
  const all = book.all();
  [0, 3, 7].forEach(i => all[i] && book.view(all[i].id));
}
function load() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) {}
  if (data && Array.isArray(data.contacts) && data.contacts.length) {
    // upgrade data saved by an older version: new sample photos + new sample contacts
    const outdated = (data.seedVersion || 1) < SEED_VERSION;
    const seedByPhone = new Map(SEED_CONTACTS.map(s => [digits(s.phone), s]));
    data.contacts.forEach(c => {
      const s = seedByPhone.get(digits(c.phone));
      if (s && outdated) {
        if (!c.photo || c.photo.includes('randomuser.me')) c.photo = s.photo || '';
        c.birthday = s.birthday; c.notes = s.notes;
      }
      try { book.add(c, { record: false, log: false }); } catch (_) {}
    });
    if (outdated) SEED_CONTACTS.forEach(s => { if (!book.phoneTaken(s.phone)) book.add(s, { record: false, log: false }); });
    (data.recent || []).forEach(id => book.get(id) && book.recent.enqueue(id));
  } else seed();
}

/* ===================================================================
   Rendering
   =================================================================== */
function render() {
  renderCounts();
  if (state.view === 'dashboard') renderDashboard();
  if (state.view === 'contacts' || state.view === 'favorites') renderContacts();
  if (state.view === 'visualizer') renderViz();
  $('#undoCount').textContent = book.undoStack.size;
  $('#undoBtn').disabled = book.undoStack.isEmpty();
}

function renderCounts() {
  const all = book.all();
  $('#navCountAll').textContent = all.length;
  $('#navCountFav').textContent = all.filter(c => c.favorite).length;
}

/* ---------- dashboard ---------- */
function renderDashboard() {
  const all = book.all();
  const now = new Date();
  const hr = now.getHours();
  $('#heroGreeting').textContent = (hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening') + ' 👋';
  $('#heroDate').textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#heroAvatars').innerHTML = all.slice(0, 7).map((c, i) => `<div class="ha ha${i}">${avatar(c)}</div>`).join('');

  const favs = all.filter(c => c.favorite).length;
  const { out: bdays } = book.upcomingBirthdays(5);
  const thisWeek = bdays.filter(b => b.days <= 7).length;
  const stats = [
    { label: 'Total contacts', value: all.length, icon: 'users', tone: 'indigo', foot: `${book.store.buckets.length} hash buckets` },
    { label: 'Favourites', value: favs, icon: 'star', tone: 'amber', foot: `${all.length ? Math.round(favs / all.length * 100) : 0}% of contacts` },
    { label: 'Birthdays this week', value: thisWeek, icon: 'cake', tone: 'pink', foot: 'via Min-Heap' },
    { label: 'AVL tree height', value: book.tree.height(), icon: 'tree', tone: 'emerald', foot: `ideal ⌈log₂(n+1)⌉ = ${Math.ceil(Math.log2(all.length + 1))}` },
  ];
  $('#stats').innerHTML = stats.map(s => `
    <div class="stat tone-${s.tone}">
      <div class="stat-icon">${icon(s.icon, 20)}</div>
      <div class="stat-body"><span>${s.label}</span><strong>${s.value}</strong><small>${s.foot}</small></div>
    </div>`).join('');

  // group bars
  const counts = Object.fromEntries(GROUPS.map(g => [g, 0]));
  all.forEach(c => { counts[c.group] = (counts[c.group] || 0) + 1; });
  const max = Math.max(1, ...Object.values(counts));
  $('#groupBars').innerHTML = GROUPS.map(g => `
    <button class="gbar" data-group-jump="${g}">
      <span class="gbar-label"><i style="background:${GROUP_COLORS[g]}"></i>${g}</span>
      <span class="gbar-track"><span class="gbar-fill" style="width:${counts[g] / max * 100}%;background:${GROUP_COLORS[g]}"></span></span>
      <b>${counts[g]}</b>
    </button>`).join('');

  // recent queue (show newest first)
  const recent = book.recent.toArray().map(id => book.get(id)).filter(Boolean).reverse();
  $('#recentList').innerHTML = recent.length ? recent.map(c => miniRow(c, `<span class="mini-meta">${esc(c.group)}</span>`)).join('')
    : emptyMini('Open any contact to see it here');

  // birthdays
  $('#birthdayList').innerHTML = bdays.length ? bdays.map(b => {
    const c = book.get(b.id);
    const [, m, d] = c.birthday.split('-').map(Number);
    const label = b.days === 0 ? '🎉 Today' : b.days === 1 ? 'Tomorrow' : `in ${b.days} days`;
    return miniRow(c, `<span class="mini-meta ${b.days <= 7 ? 'hot' : ''}">${d} ${MONTHS[m - 1]} · ${label}</span>`);
  }).join('') : emptyMini('Add birthdays to get reminders');

  renderActivity();
}

function miniRow(c, right) {
  return `<button class="mini-row" data-open="${c.id}">${avatar(c, 'sm')}<span class="mini-main"><b>${esc(c.name)}</b><small>${esc(fmtPhone(c.phone))}</small></span>${right}</button>`;
}
const emptyMini = t => `<div class="mini-empty">${icon('inbox', 22)}<span>${t}</span></div>`;

function renderActivity() {
  const el = $('#activityList');
  if (!el) return;
  el.innerHTML = book.log.length ? book.log.slice(0, 7).map(l => `
    <div class="act">
      <span class="act-op op-${l.op.toLowerCase()}">${l.op}</span>
      <span class="act-main"><b>${esc(l.detail)}</b><small>${esc(l.ds)} · <code>${l.cx}</code></small></span>
      <span class="act-time"><b>${l.ms < 0.01 ? '<0.01' : l.ms.toFixed(2)} ms</b><small>${timeAgo(l.time)}</small></span>
    </div>`).join('') : emptyMini('Add, search or edit a contact — every operation is timed here');
}

/* ---------- contacts ---------- */
function currentList() {
  const sorted = book.sortedIds(state.sort);
  let ids = sorted.ids;
  if (state.search) ids = ids.filter(id => state.search.ids.has(id));
  let list = ids.map(id => book.get(id)).filter(Boolean);
  if (state.view === 'favorites') list = list.filter(c => c.favorite);
  if (state.group !== 'All') list = list.filter(c => c.group === state.group);
  return { list, sortMs: sorted.ms };
}

function highlight(text, q) {
  text = String(text || '');
  if (!q) return esc(text);
  const lower = text.toLowerCase();
  let idx = -1, from = 0;
  while ((idx = lower.indexOf(q, from)) !== -1) {
    if (idx === 0 || /[\s.@_-]/.test(lower[idx - 1])) break;
    from = idx + 1;
  }
  if (idx === -1) return esc(text);
  return esc(text.slice(0, idx)) + '<mark>' + esc(text.slice(idx, idx + q.length)) + '</mark>' + esc(text.slice(idx + q.length));
}

function renderContacts() {
  const fav = state.view === 'favorites';
  $('#contactsTitle').textContent = fav ? 'Favourites' : 'All Contacts';
  const { list, sortMs } = currentList();
  const q = state.search ? state.query.toLowerCase().trim().replace(/\s+/g, ' ') : '';
  const sortLabel = { az: 'AVL in-order traversal', za: 'AVL reverse in-order', new: 'Merge Sort', old: 'Merge Sort' }[state.sort];
  $('#contactsSub').innerHTML = state.search
    ? `<b>${list.length}</b> match${list.length === 1 ? '' : 'es'} for “${esc(state.query)}” · found by ${state.search.ds} in <b>${state.search.ms.toFixed(3)} ms</b>`
    : `<b>${list.length}</b> contact${list.length === 1 ? '' : 's'} · sorted by ${sortLabel} in <b>${sortMs.toFixed(3)} ms</b>`;

  // chips
  const base = fav ? book.all().filter(c => c.favorite) : book.all();
  const chipCount = g => g === 'All' ? base.length : base.filter(c => c.group === g).length;
  $('#groupChips').innerHTML = ['All', ...GROUPS].map(g => `
    <button class="chip ${state.group === g ? 'active' : ''}" data-group="${g}">
      ${g !== 'All' ? `<i style="background:${GROUP_COLORS[g]}"></i>` : ''}${g}<em>${chipCount(g)}</em>
    </button>`).join('');

  const wrap = $('#contactsWrap');
  wrap.className = `cards ${state.layout}`;
  if (!list.length) {
    wrap.innerHTML = `<div class="empty">
      <div class="empty-art">${icon(state.search ? 'search' : 'users', 34)}</div>
      <h3>${state.search ? 'No contact found' : fav ? 'No favourites yet' : 'No contacts here'}</h3>
      <p class="muted">${state.search ? 'The Trie has no path for this prefix. Try another name, company or number.' : 'Tap the star on any contact, or add a new one.'}</p>
      <button class="btn btn-primary" data-action="add">${icon('plus')}New contact</button>
    </div>`;
    return;
  }
  wrap.innerHTML = list.map((c, i) => `
    <article class="card" data-open="${c.id}" style="--d:${Math.min(i, 16) * 25}ms">
      <button class="fav ${c.favorite ? 'on' : ''}" data-fav="${c.id}" title="Favourite">${icon('star', 16)}</button>
      <div class="card-top">
        ${avatar(c, 'lg')}
        <div class="card-id">
          <h4>${highlight(c.name, q)}</h4>
          <p>${c.company ? highlight(c.company, q) : '<span class="muted">—</span>'}</p>
        </div>
      </div>
      <div class="card-info">
        <span>${icon('phone', 14)}${state.search && /^\d/.test(q) ? highlight(digits(c.phone), digits(q)) : esc(fmtPhone(c.phone))}</span>
        <span>${icon('mail', 14)}${c.email ? highlight(c.email, q) : '<span class="muted">No email</span>'}</span>
      </div>
      <div class="card-foot">
        <span class="tag" style="--c:${GROUP_COLORS[c.group] || '#64748b'}">${esc(c.group)}</span>
        <div class="card-actions">
          <a class="icon-btn sm" href="tel:${digits(c.phone)}" title="Call" data-stop>${icon('phone', 15)}</a>
          <button class="icon-btn sm" data-edit="${c.id}" title="Edit">${icon('edit', 15)}</button>
          <button class="icon-btn sm danger" data-del="${c.id}" title="Delete">${icon('trash', 15)}</button>
        </div>
      </div>
    </article>`).join('');
}

/* ---------- drawer (details) ---------- */
function openDrawer(id) {
  const c = book.get(id);
  if (!c) return;
  book.view(id);
  save();
  state.openId = id;
  const t0 = performance.now();
  book.store.get(id);
  const lookup = performance.now() - t0;
  const bd = daysUntilBirthday(c.birthday);
  let bdText = '';
  if (c.birthday) {
    const [y, m, d] = c.birthday.split('-').map(Number);
    bdText = `${d} ${MONTHS[m - 1]} ${y}` + (bd === 0 ? ' · 🎉 Today!' : ` · in ${bd} day${bd === 1 ? '' : 's'}`);
  }
  const row = (ic, label, val) => val ? `<div class="d-row">${icon(ic, 16)}<div><small>${label}</small><span>${val}</span></div></div>` : '';
  $('#drawerCard').innerHTML = `
    <div class="d-cover" style="--h1:${hashHue(c.name)};--h2:${(hashHue(c.name) + 45) % 360}">
      <button class="icon-btn glass" data-close-drawer aria-label="Close">${icon('x')}</button>
    </div>
    <div class="d-body">
      ${avatar(c, 'xl')}
      <h3>${esc(c.name)} ${c.favorite ? '<span class="star-inline">★</span>' : ''}</h3>
      <p class="muted">${esc(c.company || 'No company')} · <span class="tag" style="--c:${GROUP_COLORS[c.group]}">${esc(c.group)}</span></p>
      <div class="d-quick">
        <a href="tel:${digits(c.phone)}" class="q q-call">${icon('phone')}<span>Call</span></a>
        <a href="${c.email ? 'mailto:' + esc(c.email) : '#'}" class="q q-mail ${c.email ? '' : 'disabled'}">${icon('mail')}<span>Email</span></a>
        <button class="q q-fav ${c.favorite ? 'on' : ''}" data-fav="${c.id}">${icon('star')}<span>${c.favorite ? 'Starred' : 'Star'}</span></button>
        <button class="q q-edit" data-edit="${c.id}">${icon('edit')}<span>Edit</span></button>
      </div>
      <div class="d-rows">
        ${row('phone', 'Mobile', esc(fmtPhone(c.phone)))}
        ${row('mail', 'Email', esc(c.email))}
        ${row('building', 'Company / College', esc(c.company))}
        ${row('pin', 'Address', esc(c.address))}
        ${row('cake', 'Birthday', esc(bdText))}
        ${row('note', 'Notes', esc(c.notes))}
        ${row('clock', 'Added', new Date(c.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}
      </div>
      <div class="d-ds">${icon('zap', 14)} Fetched from HashMap in <b>${lookup.toFixed(4)} ms</b> · pushed to Recent Queue</div>
      <button class="btn btn-danger-ghost full" data-del="${c.id}">${icon('trash')}Delete contact</button>
    </div>`;
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  if (state.view === 'dashboard') renderDashboard();
  if (state.view === 'visualizer') renderViz();
}
function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true');
  state.openId = null;
}

/* ---------- modal (add/edit) ---------- */
const form = $('#contactForm');
let formPhoto = '';
function openModal(id = null) {
  form.reset();
  $$('.field', form).forEach(f => f.classList.remove('invalid'));
  const c = id ? book.get(id) : null;
  $('#modalTitle').textContent = c ? 'Edit contact' : 'New contact';
  $('#modalSub').textContent = c ? 'Old entry is removed and re-indexed in every structure' : 'Inserted into HashMap, Trie & AVL Tree';
  $('#saveBtn').textContent = c ? 'Save changes' : 'Save contact';
  form.id.value = c ? c.id : '';
  if (c) ['name', 'phone', 'email', 'company', 'group', 'birthday', 'address', 'notes'].forEach(k => { form[k].value = c[k] || ''; });
  form.favorite.checked = !!c?.favorite;
  formPhoto = c?.photo || '';
  if (!c && state.group !== 'All') form.group.value = state.group;
  if (!c && state.view === 'favorites') form.favorite.checked = true;
  updateModalAvatar();
  $('#modal').classList.add('open');
  $('#modal').setAttribute('aria-hidden', 'false');
  setTimeout(() => form.name.focus(), 60);
}
function closeModal(sel = '#modal') {
  $(sel).classList.remove('open');
  $(sel).setAttribute('aria-hidden', 'true');
}
function updateModalAvatar() {
  const n = form.name.value.trim();
  const el = $('#modalAvatar');
  el.innerHTML = esc(n ? initials(n) : '?') + (formPhoto ? `<img src="${esc(formPhoto)}" alt="" onerror="this.remove()">` : '');
  $('#photoPrev').innerHTML = el.innerHTML;
  $('#photoPrev').style.cssText = el.style.cssText;
  $('#photoRemove').hidden = !formPhoto;
  $('#photoLabel').textContent = formPhoto ? 'Change photo' : 'Upload photo';
  const h = hashHue(n || '?');
  el.style.setProperty('--h1', h); el.style.setProperty('--h2', (h + 45) % 360);
  $('#photoPrev').style.cssText = el.style.cssText;
}

// read an image file, crop to square and shrink to 200px JPEG (keeps localStorage small)
function resizeImage(file, size = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const cv = document.createElement('canvas');
        cv.width = cv.height = size;
        cv.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(cv.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
$('#photoInput').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('Please choose an image file', 'error'); return; }
  try { formPhoto = await resizeImage(file); updateModalAvatar(); }
  catch (_) { toast('Could not read that image', 'error'); }
});
$('#photoRemove').addEventListener('click', () => { formPhoto = ''; updateModalAvatar(); });
form.name.addEventListener('input', updateModalAvatar);

function setErr(name, msg) {
  const f = form[name].closest('.field');
  f.classList.toggle('invalid', !!msg);
  $('.err', f).textContent = msg || '';
  return !msg;
}
function validate() {
  const id = form.id.value || null;
  const name = form.name.value.trim();
  const phone = digits(form.phone.value);
  const email = form.email.value.trim();
  let ok = true;
  ok = setErr('name', name.length < 2 ? 'Please enter a name (min 2 letters)' : '') && ok;
  let pErr = '';
  if (!phone) pErr = 'Phone number is required';
  else if (phone.length !== 10 || !/^[6-9]/.test(phone)) pErr = 'Enter a valid 10-digit Indian mobile number';
  else if (book.phoneTaken(phone, id)) pErr = `Already saved as “${book.get(book.phoneIndex.get(phone)).name}” (HashMap O(1) check)`;
  ok = setErr('phone', pErr) && ok;
  ok = setErr('email', email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? 'Enter a valid email address' : '') && ok;
  return ok;
}
['name', 'phone', 'email'].forEach(n => form[n].addEventListener('blur', () => form[n].value && validate()));

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) { $('.field.invalid input', form)?.focus(); return; }
  const data = {
    name: form.name.value.trim().replace(/\s+/g, ' '),
    phone: digits(form.phone.value),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    group: form.group.value,
    birthday: form.birthday.value,
    address: form.address.value.trim(),
    notes: form.notes.value.trim(),
    favorite: form.favorite.checked,
    photo: formPhoto,
  };
  try {
    const id = form.id.value;
    const c = id ? book.update(id, data) : book.add(data);
    save();
    closeModal();
    toast(id ? `Updated <b>${esc(c.name)}</b>` : `Added <b>${esc(c.name)}</b>`, 'success', true);
    refreshSearch();
    render();
    if (state.openId === c.id) openDrawer(c.id);
  } catch (err) { toast(esc(err.message), 'error'); }
});

/* ---------- delete confirm ---------- */
let pendingDelete = null;
function askDelete(id) {
  const c = book.get(id);
  if (!c) return;
  pendingDelete = id;
  $('#confirmTitle').textContent = `Delete ${c.name}?`;
  $('#confirmText').innerHTML = 'It will be removed from the HashMap, Trie and AVL Tree.<br>You can bring it back with <b>Undo</b>.';
  $('#confirm').classList.add('open');
  $('#confirm').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#confirmOk').focus(), 50);
}
$('#confirmOk').addEventListener('click', () => {
  if (!pendingDelete) return;
  const c = book.remove(pendingDelete);
  pendingDelete = null;
  save();
  closeModal('#confirm');
  if (state.openId === c?.id) closeDrawer();
  toast(`Deleted <b>${esc(c.name)}</b>`, 'info', true);
  refreshSearch();
  render();
});

/* ---------- undo ---------- */
function doUndo() {
  let a;
  try { a = book.undo(); } catch (err) { toast(esc(err.message), 'error'); render(); return; }
  if (!a) { toast('Nothing to undo — stack is empty', 'info'); return; }
  save();
  const verb = { add: 'Removed newly added', delete: 'Restored', update: 'Reverted changes to', favorite: 'Reverted favourite on' }[a.type];
  toast(`${verb} <b>${esc(a.contact.name)}</b>`, 'success');
  refreshSearch();
  if (state.openId) { book.get(state.openId) ? openDrawer(state.openId) : closeDrawer(); }
  render();
}

/* ---------- toasts ---------- */
function toast(html, type = 'info', withUndo = false) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const ic = { success: 'check', error: 'alert', info: 'info' }[type];
  el.innerHTML = `<span class="toast-ic">${icon(ic, 16)}</span><span class="toast-msg">${html}</span>${withUndo ? '<button class="toast-undo">Undo</button>' : ''}`;
  $('#toasts').appendChild(el);
  el.querySelector('.toast-undo')?.addEventListener('click', () => { doUndo(); el.remove(); });
  setTimeout(() => el.classList.add('out'), 3800);
  setTimeout(() => el.remove(), 4200);
}

/* ---------- search ---------- */
function refreshSearch() {
  const q = state.query.trim();
  state.search = q ? book.search(q) : null;
  const meta = $('#searchMeta');
  if (state.search) {
    meta.innerHTML = `${state.search.ids.size} found · ${state.search.ms.toFixed(3)} ms`;
    meta.classList.add('show');
  } else meta.classList.remove('show');
}
const searchInput = $('#searchInput');
searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  refreshSearch();
  if (state.query.trim() && state.view !== 'contacts' && state.view !== 'favorites') { setView('contacts'); return; }
  if (state.view === 'visualizer') renderViz();
  render();
});

/* ===================================================================
   Visualizer
   =================================================================== */
function layoutGeneric(root) {
  let leaf = 0, depth = 0;
  const nodes = [], edges = [];
  (function walk(n, d) {
    n.depth = d; depth = Math.max(depth, d);
    if (!n.children?.length) n.x = leaf++;
    else {
      n.children.forEach(ch => walk(ch, d + 1));
      n.x = (n.children[0].x + n.children[n.children.length - 1].x) / 2;
    }
    nodes.push(n);
    n.children?.forEach(ch => edges.push([n, ch]));
  })(root, 0);
  return { nodes, edges, cols: Math.max(leaf, 1), depth };
}

function treeSVG({ nodes, edges, cols, depth }, { gx = 64, gy = 76, r = 20, wide = false } = {}) {
  const pad = 36;
  const W = Math.max(cols * gx + pad * 2 - gx, 320), H = depth * gy + pad * 2;
  const X = n => pad + n.x * gx, Y = n => pad + n.depth * gy;
  const e = edges.map(([a, b]) => `<path class="edge ${b.cls || ''}" d="M${X(a)},${Y(a) + r} C${X(a)},${Y(a) + gy / 2} ${X(b)},${Y(b) - gy / 2} ${X(b)},${Y(b) - r}"/>`).join('');
  const n = nodes.map((nd, i) => {
    const rw = wide ? Math.max(r, nd.label.length * 4 + 12) : r;
    const shape = wide
      ? `<rect x="${X(nd) - rw}" y="${Y(nd) - r}" width="${rw * 2}" height="${r * 2}" rx="${r}"/>`
      : `<circle cx="${X(nd)}" cy="${Y(nd)}" r="${r}"/>`;
    return `<g class="node ${nd.cls || ''}" style="--i:${i}">${nd.title ? `<title>${esc(nd.title)}</title>` : ''}${shape}
      <text x="${X(nd)}" y="${Y(nd) + 4}">${esc(nd.label)}</text>
      ${nd.sub !== undefined ? `<text class="sub" x="${X(nd)}" y="${Y(nd) + r + 14}">${esc(nd.sub)}</text>` : ''}</g>`;
  }).join('');
  return `<svg class="tree-svg" viewBox="0 0 ${W} ${H + 10}" width="${W}" height="${H + 10}">${e}${n}</svg>`;
}

const VIZ = {
  hashmap() {
    const m = book.store;
    const cap = m.buckets.length, lf = m.size / cap;
    const collisions = m.buckets.filter(b => b.length > 1).length;
    const longest = Math.max(0, ...m.buckets.map(b => b.length));
    return `
      ${vizIntro('HashMap — contact storage', 'Each contact ID is passed through the <b>djb2 hash function</b> to get a bucket index. Collisions are handled with <b>separate chaining</b> (a list inside the bucket). When the load factor crosses <b>0.75</b> the table doubles and every entry is re-hashed.',
        [['Capacity', cap], ['Entries', m.size], ['Load factor', lf.toFixed(2)], ['Collided buckets', collisions], ['Longest chain', longest], ['Resizes', m.resizes]])}
      <div class="buckets">
        ${m.buckets.map((b, i) => `
          <div class="bucket ${b.length > 1 ? 'collide' : ''} ${b.length === 0 ? 'empty' : ''}">
            <span class="b-idx">${i}</span>
            <div class="b-chain">${b.length ? b.map(([k, c]) => `<button class="b-item ${state.openId === k ? 'hl' : ''}" data-open="${k}" title="${esc(k)}">${esc(c.name.split(' ')[0])}</button>`).join('<span class="b-arrow">→</span>') : '<span class="b-null">null</span>'}</div>
          </div>`).join('')}
      </div>`;
  },

  trie() {
    const q = state.trieQuery.toLowerCase();
    const t = book.textTrie;
    const node = t.nodeAt(q);
    const depthLimit = q.length === 0 ? 1 : 3;
    const MAXC = q ? 9 : 26;
    const build = (n, label, d, cls) => {
      const out = { label, cls, children: [], title: `${n.ids.size} contact(s) pass through` };
      if (n.endIds.size) out.cls = (cls ? cls + ' ' : '') + 'end';
      if (d >= depthLimit) { if (n.children.size) out.children.push({ label: `+${n.children.size}`, cls: 'more', children: [] }); return out; }
      const kids = [...n.children.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      kids.slice(0, MAXC).forEach(([ch, nn]) => out.children.push(build(nn, ch === ' ' ? '␣' : ch, d + 1, '')));
      if (kids.length > MAXC) out.children.push({ label: `+${kids.length - MAXC}`, cls: 'more', children: [] });
      return out;
    };
    let body;
    if (!node) body = `<div class="viz-empty">No path for “${esc(q)}” — the search stops here, so the result is empty.</div>`;
    else {
      const rootLabel = q ? (q.slice(-1) === ' ' ? '␣' : q.slice(-1)) : 'root';
      const tree = build(node, rootLabel, 0, 'hl root');
      body = `<div class="svg-scroll">${treeSVG(layoutGeneric(tree), { gx: 46, gy: 70, r: 17, wide: !q })}</div>`;
    }
    const matches = node ? [...node.ids].map(id => book.get(id)).filter(Boolean) : [];
    const pathChips = ['root', ...[...q].map(c => c === ' ' ? '␣' : c)].map((c, i, a) =>
      `<span class="pchip ${i === a.length - 1 ? 'last' : ''}">${esc(c)}</span>`).join('<span class="parrow">→</span>');
    return `
      ${vizIntro('Trie — instant prefix search', 'Every word of a contact (first name, last name, full name, company, email) is inserted character by character. Each node remembers which contacts pass through it, so searching just <b>walks L characters</b> — the time does not grow with the number of contacts.',
        [['Total nodes', t.countNodes()], ['Words indexed', book.all().reduce((s, c) => s + ContactBook.tokens(c).length, 0)], ['Prefix length', q.length], ['Matches', matches.length]])}
      <div class="viz-controls">
        <label class="viz-input">${icon('search', 16)}<input id="trieInput" placeholder="Type a prefix, e.g. ar, pri, inf…" value="${esc(state.trieQuery)}" autocomplete="off" /></label>
        <div class="path-chips">${pathChips}</div>
      </div>
      ${body}
      <div class="legend"><span><i class="lgd hl"></i>Current prefix node</span><span><i class="lgd end"></i>Word ends here</span><span><i class="lgd more"></i>More children hidden</span></div>
      ${matches.length ? `<div class="match-row">${matches.slice(0, 14).map(c => `<button class="m-chip" data-open="${c.id}">${avatar(c, 'xs')}${esc(c.name)}</button>`).join('')}${matches.length > 14 ? `<span class="muted">+${matches.length - 14} more</span>` : ''}</div>` : ''}`;
  },

  avl() {
    const t = book.tree;
    const q = state.avlQuery.toLowerCase().trim();
    const { path, found } = q ? t.searchPath(q) : { path: [], found: null };
    const onPath = new Set(path);
    let i = 0;
    const build = n => {
      if (!n) return null;
      const left = build(n.left);
      const me = { n, x: i++ };
      const right = build(n.right);
      const c = book.get(n.id);
      const bf = t.balanceOf(n);
      return {
        x: me.x,
        label: (c?.name.replace(/^dr\.?\s+/i, '').split(' ')[0] || '?').slice(0, 7),
        title: `${c?.name}\nheight ${n.height} · balance factor ${bf}`,
        sub: `bf ${bf > 0 ? '+' : ''}${bf}`,
        cls: n === found ? 'found' : onPath.has(n) ? 'hl' : '',
        children: [left, right].filter(Boolean),
      };
    };
    const root = build(t.root);
    let body = '<div class="viz-empty">Tree is empty — add a contact.</div>';
    if (root) {
      const nodes = [], edges = [];
      let depth = 0;
      (function walk(n, d) { n.depth = d; depth = Math.max(depth, d); nodes.push(n); n.children.forEach(ch => { edges.push([n, ch]); walk(ch, d + 1); }); })(root, 0);
      body = `<div class="svg-scroll">${treeSVG({ nodes, edges, cols: i, depth }, { gx: 58, gy: 82, r: 24, wide: false })}</div>`;
    }
    const steps = path.map(n => book.get(n.id)?.name.split(' ')[0]);
    return `
      ${vizIntro('AVL Tree — always sorted', 'Contacts are kept in a <b>self-balancing binary search tree</b> keyed by name. After each insert or delete the <b>balance factor</b> (left height − right height) is checked and LL / RR / LR / RL <b>rotations</b> keep it between −1 and +1. An in-order traversal gives the A→Z list directly.',
        [['Nodes', t.size], ['Height', t.height()], ['Ideal height', Math.ceil(Math.log2(t.size + 1))], ['Rotations so far', t.rotations]])}
      <div class="viz-controls">
        <label class="viz-input">${icon('search', 16)}<input id="avlInput" placeholder="Search a name in the BST, e.g. priya" value="${esc(state.avlQuery)}" autocomplete="off" /></label>
        ${q ? `<div class="path-chips">${steps.map((s, k) => `<span class="pchip ${k === steps.length - 1 && found ? 'last' : ''}">${esc(s)}</span>`).join('<span class="parrow">→</span>')}${found ? `<span class="ok-note">found in ${path.length} comparison${path.length === 1 ? '' : 's'}</span>` : '<span class="bad-note">not found</span>'}</div>` : ''}
      </div>
      ${body}
      <div class="legend"><span><i class="lgd hl"></i>Search path</span><span><i class="lgd found"></i>Found</span><span><i class="lgd plain"></i>bf = balance factor</span></div>`;
  },

  stack() {
    const items = book.undoStack.toArray();
    const label = { add: 'ADD', delete: 'DELETE', update: 'EDIT', favorite: 'FAVOURITE' };
    return `
      ${vizIntro('Stack — Undo history (LIFO)', 'Every add, edit, delete and favourite action is <b>pushed</b> on top of the stack with a snapshot of the contact. Pressing <b>Undo</b> (or Ctrl + Z) <b>pops</b> the most recent action and reverses it. Last In → First Out.',
        [['Size', items.length], ['Limit', book.undoStack.limit], ['Push / Pop', 'O(1)']])}
      <div class="stack-wrap">
        <div class="stack">
          ${items.length ? items.map((a, k) => `
            <div class="s-item ${k === 0 ? 'top' : ''}" style="--i:${k}">
              <span class="s-op op-${a.type}">${label[a.type]}</span>
              <span>${esc(a.contact.name)}</span>
              ${k === 0 ? '<span class="s-top">← TOP</span>' : ''}
            </div>`).join('') : '<div class="viz-empty small">Stack is empty. Add or edit a contact to push an action.</div>'}
          <div class="s-base"></div>
        </div>
        <div class="stack-side">
          <button class="btn btn-primary" data-action="undo" ${items.length ? '' : 'disabled'}>${icon('undo')}Pop (Undo)</button>
          <button class="btn btn-ghost" data-action="add">${icon('plus')}Push (Add contact)</button>
        </div>
      </div>`;
  },

  queue() {
    const q = book.recent;
    const ids = q.toArray();
    const slots = [];
    for (let k = 0; k < q.capacity; k++) {
      const pos = (k - q.front + q.capacity) % q.capacity;
      const id = pos < q.count ? q.buf[k] : undefined;
      slots.push({ k, id, isFront: q.count && k === q.front, isRear: q.count && k === (q.front + q.count - 1) % q.capacity });
    }
    return `
      ${vizIntro('Circular Queue — Recently viewed', 'Opening a contact <b>enqueues</b> it at the rear. The queue has a fixed capacity; when full, the oldest item at the front is <b>dequeued</b> automatically. Front and rear pointers wrap around the array, so nothing is ever shifted.',
        [['Capacity', q.capacity], ['Count', q.count], ['Front index', q.front], ['Rear index', q.count ? (q.front + q.count - 1) % q.capacity : '—']])}
      <h4 class="viz-sub">Logical order (front → rear)</h4>
      <div class="queue">
        <span class="q-end">FRONT<br><small>dequeue</small></span>
        ${ids.length ? ids.map(id => { const c = book.get(id); return c ? `<button class="q-item" data-open="${id}">${avatar(c, 'sm')}<span>${esc(c.name.split(' ')[0])}</span></button>` : ''; }).join('<span class="q-arrow">→</span>') : '<div class="viz-empty small">Empty — open any contact.</div>'}
        <span class="q-end">REAR<br><small>enqueue</small></span>
      </div>
      <h4 class="viz-sub">Underlying circular array</h4>
      <div class="ring">
        ${slots.map(s => { const c = s.id && book.get(s.id); return `
          <div class="slot ${c ? 'filled' : ''}">
            <small>[${s.k}]</small>
            <b>${c ? esc(c.name.split(' ')[0]) : '—'}</b>
            <span class="ptrs">${s.isFront ? '<em class="f">F</em>' : ''}${s.isRear ? '<em class="r">R</em>' : ''}</span>
          </div>`; }).join('')}
      </div>`;
  },

  heap() {
    const { heap } = book.upcomingBirthdays(0);
    const arr = heap.a;
    const build = k => {
      if (k >= arr.length) return null;
      const c = book.get(arr[k].id);
      return { label: String(arr[k].days), sub: c?.name.split(' ')[0], title: `${c?.name} — birthday in ${arr[k].days} day(s)`, cls: k === 0 ? 'found' : '', children: [build(2 * k + 1), build(2 * k + 2)].filter(Boolean) };
    };
    const root = build(0);
    return `
      ${vizIntro('Min-Heap — Birthday reminders', 'Each contact is pushed into a <b>priority queue</b> with priority = days until their next birthday. The smallest value always sits at the <b>root</b>, so the nearest birthday is popped first. Parent ≤ children at every level.',
        [['Heap size', arr.length], ['Height', arr.length ? Math.floor(Math.log2(arr.length)) + 1 : 0], ['Push / Pop', 'O(log n)'], ['Peek min', 'O(1)']])}
      ${root ? `<div class="svg-scroll">${treeSVG(layoutGeneric(root), { gx: 56, gy: 84, r: 20 })}</div>` : '<div class="viz-empty">No birthdays saved yet.</div>'}
      <div class="legend"><span><i class="lgd found"></i>Root = next birthday</span><span><i class="lgd plain"></i>Number = days left</span></div>
      <h4 class="viz-sub">Array representation</h4>
      <div class="heap-arr">${arr.map((x, k) => `<div class="ha-cell ${k === 0 ? 'min' : ''}"><small>${k}</small><b>${x.days}</b></div>`).join('')}</div>`;
  },

  complexity() {
    const rows = [
      ['Add contact', 'HashMap + Trie + AVL', 'O(1) + O(L) + O(log n)', 'O(n)'],
      ['Delete contact', 'HashMap + Trie + AVL', 'O(1) + O(L) + O(log n)', 'O(n)'],
      ['Search by prefix', 'Trie', 'O(L)', 'O(n · L)'],
      ['Find by ID', 'HashMap', 'O(1)', 'O(n)'],
      ['Duplicate phone check', 'HashMap', 'O(1)', 'O(n)'],
      ['List A → Z', 'AVL in-order traversal', 'O(n)', 'O(n log n)'],
      ['Sort by date', 'Merge Sort', 'O(n log n)', 'O(n log n)'],
      ['Undo last action', 'Stack', 'O(1)', '—'],
      ['Recently viewed', 'Circular Queue', 'O(1)', 'O(n) shift'],
      ['Next birthday', 'Min-Heap', 'O(log n)', 'O(n log n)'],
    ];
    const n = book.size;
    const L = 5;
    const bars = [
      ['Array linear scan', n, 'O(n)'],
      ['AVL / BST search', Math.ceil(Math.log2(n + 1)), 'O(log n)'],
      ['Trie search (L = 5)', L, 'O(L)'],
      ['HashMap lookup', 1, 'O(1)'],
    ];
    const mx = Math.max(...bars.map(b => b[1]), 1);
    return `
      ${vizIntro('Time complexity summary', 'L = length of the search text, n = number of contacts. The right column shows what the same operation would cost with a plain array — this is why each structure was chosen.', [['n (contacts)', n]])}
      <div class="table-wrap"><table class="ds-table">
        <thead><tr><th>Operation</th><th>Structure used</th><th>Our cost</th><th>With plain array</th></tr></thead>
        <tbody>${rows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><code class="good">${r[2]}</code></td><td><code class="bad">${r[3]}</code></td></tr>`).join('')}</tbody>
      </table></div>
      <h4 class="viz-sub">Steps needed to find one contact right now (n = ${n})</h4>
      <div class="cbars">${bars.map(b => `<div class="cbar"><span>${b[0]}</span><div class="cbar-track"><div class="cbar-fill" style="width:${Math.max(b[1] / mx * 100, 3)}%"></div></div><b>${b[1]} <small>${b[2]}</small></b></div>`).join('')}</div>`;
  },
};

function vizIntro(title, text, metrics) {
  return `<div class="viz-intro">
    <div><h3>${title}</h3><p>${text}</p></div>
    <div class="metrics">${metrics.map(([k, v]) => `<div class="metric"><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  </div>`;
}

function renderViz() {
  $$('#vizTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === state.vizTab));
  const active = document.activeElement?.id;
  const caret = document.activeElement?.selectionStart;
  $('#vizBody').innerHTML = VIZ[state.vizTab]();
  if (active === 'trieInput' || active === 'avlInput') {
    const el = $('#' + active);
    if (el) { el.focus(); el.setSelectionRange(caret, caret); }
  }
}

/* ===================================================================
   Navigation & events
   =================================================================== */
function setView(v) {
  state.view = v;
  if (v !== 'contacts' && v !== 'favorites' && state.query) {
    state.query = ''; searchInput.value = ''; refreshSearch();
  }
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  const section = v === 'favorites' ? 'contacts' : v;
  $$('.view').forEach(s => s.classList.toggle('active', s.id === `view-${section}`));
  if (v === 'contacts' || v === 'favorites') state.group = state.group || 'All';
  document.body.classList.remove('nav-open');
  window.scrollTo({ top: 0 });
  $('.main').scrollTop = 0;
  render();
}

document.addEventListener('click', e => {
  const t = e.target;
  const el = sel => t.closest(sel);
  let x;
  if ((x = el('[data-close]'))) { closeModal('#' + x.closest('.modal').id); return; }
  if (el('[data-close-drawer]') || t.id === 'drawer') { closeDrawer(); return; }
  if (t.classList.contains('modal')) { closeModal('#' + t.id); return; }
  if ((x = el('.nav-item'))) { setView(x.dataset.view); return; }
  if ((x = el('[data-goto]'))) { setView(x.dataset.goto); return; }
  if ((x = el('[data-group-jump]'))) { state.group = x.dataset.groupJump; setView('contacts'); return; }
  if ((x = el('[data-fav]'))) {
    e.stopPropagation();
    const c = book.toggleFavorite(x.dataset.fav);
    save();
    toast(c.favorite ? `⭐ <b>${esc(c.name)}</b> added to favourites` : `Removed <b>${esc(c.name)}</b> from favourites`, 'info');
    if (state.openId === c.id) openDrawer(c.id);
    render();
    return;
  }
  if ((x = el('[data-edit]'))) { e.stopPropagation(); openModal(x.dataset.edit); return; }
  if ((x = el('[data-del]'))) { e.stopPropagation(); askDelete(x.dataset.del); return; }
  if (el('[data-stop]')) { e.stopPropagation(); return; }
  if ((x = el('[data-action]'))) {
    if (x.dataset.action === 'add') openModal();
    if (x.dataset.action === 'undo') doUndo();
    return;
  }
  if ((x = el('[data-open]'))) { openDrawer(x.dataset.open); return; }
  if ((x = el('[data-group]'))) { state.group = x.dataset.group; renderContacts(); return; }
  if ((x = el('#vizTabs button'))) { state.vizTab = x.dataset.tab; renderViz(); return; }
  if ((x = el('#layoutSeg button'))) {
    state.layout = x.dataset.layout;
    $$('#layoutSeg button').forEach(b => b.classList.toggle('active', b === x));
    renderContacts();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'trieInput') { state.trieQuery = e.target.value; renderViz(); }
  if (e.target.id === 'avlInput') { state.avlQuery = e.target.value; renderViz(); }
});

$('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderContacts(); });
$('#addBtn').addEventListener('click', () => openModal());
$('#undoBtn').addEventListener('click', doUndo);
$('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
$('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));

// theme
function applyTheme(t) { document.documentElement.dataset.theme = t; }
try { const saved = localStorage.getItem(THEME_KEY); if (saved) applyTheme(saved); else if (matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark'); } catch (_) {}
$('#themeToggle').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(t);
  try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
});

// export / import / reset
$('#exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(book.all(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `contacts-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Exported <b>${book.size}</b> contacts`, 'success');
});
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const list = Array.isArray(data) ? data : data.contacts;
    if (!Array.isArray(list)) throw new Error('bad');
    let added = 0, skipped = 0;
    list.forEach(c => {
      if (!c || !c.name || !c.phone) { skipped++; return; }
      try { const { id, ...rest } = c; book.add({ ...rest, id: book.get(id) ? undefined : id }, { record: false, log: false }); added++; } catch (_) { skipped++; }
    });
    save(); render();
    toast(`Imported <b>${added}</b> contacts${skipped ? ` · ${skipped} skipped (duplicates)` : ''}`, 'success');
  } catch (_) { toast('That file is not a valid contacts JSON', 'error'); }
  e.target.value = '';
});
$('#resetBtn').addEventListener('click', () => {
  seed(); save(); state.query = ''; searchInput.value = ''; refreshSearch(); closeDrawer();
  toast('Demo data restored', 'success');
  render();
});

// keyboard shortcuts
document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if (e.key === 'Escape') {
    if ($('#confirm').classList.contains('open')) closeModal('#confirm');
    else if ($('#modal').classList.contains('open')) closeModal('#modal');
    else if ($('#drawer').classList.contains('open')) closeDrawer();
    else if (document.activeElement === searchInput && searchInput.value) { searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); doUndo(); return; }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); searchInput.focus(); }
  if (e.key.toLowerCase() === 'n') { e.preventDefault(); openModal(); }
});

/* ------------------------------ boot ------------------------------- */
hydrateIcons();
load();
save();
render();
setInterval(() => { if (state.view === 'dashboard') renderActivity(); }, 30000);
})();
