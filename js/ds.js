/* =====================================================================
   ContactSphere — Data Structures (written from scratch, no libraries)
   ---------------------------------------------------------------------
   1. HashMap        -> stores contacts by ID, phone duplicate check  O(1)
   2. Trie           -> prefix search / autocomplete                  O(L)
   3. AVL Tree       -> always-sorted A-Z list (self balancing BST)   O(log n)
   4. Stack          -> Undo history (LIFO)                           O(1)
   5. CircularQueue  -> Recently viewed contacts (FIFO, fixed size)   O(1)
   6. MinHeap        -> Upcoming birthdays (priority queue)           O(log n)
   7. mergeSort      -> sort by date added                            O(n log n)
   ===================================================================== */

/* ---------------------------- 1. HASH MAP ---------------------------- */
class HashMap {
  constructor(capacity = 8) {
    this.buckets = Array.from({ length: capacity }, () => []);
    this.size = 0;
    this.loadFactor = 0.75;
    this.resizes = 0;
  }

  // djb2 string hash -> bucket index
  _hash(key) {
    key = String(key);
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) | 0;
    return Math.abs(h) % this.buckets.length;
  }

  set(key, value) {
    const bucket = this.buckets[this._hash(key)];
    const entry = bucket.find(e => e[0] === key);
    if (entry) { entry[1] = value; return; }
    bucket.push([key, value]);           // separate chaining on collision
    this.size++;
    if (this.size / this.buckets.length > this.loadFactor) this._resize();
  }

  get(key) {
    const entry = this.buckets[this._hash(key)].find(e => e[0] === key);
    return entry ? entry[1] : undefined;
  }

  has(key) { return this.get(key) !== undefined; }

  delete(key) {
    const bucket = this.buckets[this._hash(key)];
    const i = bucket.findIndex(e => e[0] === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    this.size--;
    return true;
  }

  _resize() {
    const old = this.buckets;
    this.buckets = Array.from({ length: old.length * 2 }, () => []);
    this.size = 0;
    this.resizes++;
    for (const bucket of old) for (const [k, v] of bucket) this.set(k, v);
  }

  values() { return this.buckets.flat().map(e => e[1]); }
  keys()   { return this.buckets.flat().map(e => e[0]); }
  clear()  { this.buckets = Array.from({ length: 8 }, () => []); this.size = 0; }
}

/* ------------------------------ 2. TRIE ------------------------------ */
class TrieNode {
  constructor() {
    this.children = new Map();   // char -> TrieNode
    this.ids = new Set();        // every contact whose word passes through here
    this.endIds = new Set();     // contacts whose word ENDS here
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word, id) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
      node.ids.add(id);
    }
    node.endIds.add(id);
  }

  remove(word, id) {
    const path = [this.root];
    let node = this.root;
    for (const ch of word) {
      node = node.children.get(ch);
      if (!node) return;
      path.push(node);
    }
    node.endIds.delete(id);
    for (let i = 1; i < path.length; i++) path[i].ids.delete(id);
    // prune empty branches from bottom to top
    const chars = [...word];
    for (let i = chars.length; i >= 1; i--) {
      if (path[i].ids.size === 0) path[i - 1].children.delete(chars[i - 1]);
      else break;
    }
  }

  nodeAt(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  // O(L) — returns the set of contact ids matching the prefix
  search(prefix) {
    const node = this.nodeAt(prefix);
    return node ? new Set(node.ids) : new Set();
  }

  countNodes(node = this.root) {
    let c = 1;
    for (const ch of node.children.values()) c += this.countNodes(ch);
    return c;
  }
}

/* ---------------------------- 3. AVL TREE ---------------------------- */
class AVLNode {
  constructor(key, id) {
    this.key = key; this.id = id;
    this.left = null; this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() { this.root = null; this.size = 0; this.rotations = 0; }

  _h(n) { return n ? n.height : 0; }
  _update(n) { n.height = 1 + Math.max(this._h(n.left), this._h(n.right)); }
  balanceOf(n) { return n ? this._h(n.left) - this._h(n.right) : 0; }

  _rotateRight(y) {
    const x = y.left; y.left = x.right; x.right = y;
    this._update(y); this._update(x); this.rotations++;
    return x;
  }
  _rotateLeft(x) {
    const y = x.right; x.right = y.left; y.left = x;
    this._update(x); this._update(y); this.rotations++;
    return y;
  }

  _rebalance(n) {
    this._update(n);
    const b = this.balanceOf(n);
    if (b > 1) {                                   // Left heavy
      if (this.balanceOf(n.left) < 0) n.left = this._rotateLeft(n.left);   // LR
      return this._rotateRight(n);                                         // LL
    }
    if (b < -1) {                                  // Right heavy
      if (this.balanceOf(n.right) > 0) n.right = this._rotateRight(n.right); // RL
      return this._rotateLeft(n);                                            // RR
    }
    return n;
  }

  insert(key, id) { this.root = this._insert(this.root, key, id); }
  _insert(n, key, id) {
    if (!n) { this.size++; return new AVLNode(key, id); }
    if (key < n.key) n.left = this._insert(n.left, key, id);
    else if (key > n.key) n.right = this._insert(n.right, key, id);
    else return n;
    return this._rebalance(n);
  }

  remove(key) { this.root = this._remove(this.root, key); }
  _remove(n, key) {
    if (!n) return null;
    if (key < n.key) n.left = this._remove(n.left, key);
    else if (key > n.key) n.right = this._remove(n.right, key);
    else {
      if (!n.left || !n.right) { this.size--; return n.left || n.right; }
      let s = n.right;                    // in-order successor
      while (s.left) s = s.left;
      n.key = s.key; n.id = s.id;
      n.right = this._remove(n.right, s.key);
    }
    return this._rebalance(n);
  }

  // Iterative in-order traversal -> sorted ids (A-Z)
  inorder() {
    const out = [], stack = [];
    let cur = this.root;
    while (cur || stack.length) {
      while (cur) { stack.push(cur); cur = cur.left; }
      cur = stack.pop();
      out.push(cur.id);
      cur = cur.right;
    }
    return out;
  }

  // Reverse in-order -> Z-A
  reverseInorder() {
    const out = [], stack = [];
    let cur = this.root;
    while (cur || stack.length) {
      while (cur) { stack.push(cur); cur = cur.right; }
      cur = stack.pop();
      out.push(cur.id);
      cur = cur.left;
    }
    return out;
  }

  height() { return this._h(this.root); }

  // Path followed while searching for a name prefix (for visualizer)
  searchPath(prefix) {
    const path = [];
    let n = this.root, found = null;
    while (n) {
      path.push(n);
      if (n.key.startsWith(prefix)) { found = n; break; }
      n = prefix < n.key ? n.left : n.right;
    }
    return { path, found };
  }
}

/* ------------------------------ 4. STACK ----------------------------- */
class Stack {
  constructor(limit = 25) { this.items = []; this.limit = limit; }
  push(x) { this.items.push(x); if (this.items.length > this.limit) this.items.shift(); }
  pop()   { return this.items.pop(); }
  peek()  { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  get size() { return this.items.length; }
  toArray() { return [...this.items].reverse(); }   // top first
}

/* -------------------------- 5. CIRCULAR QUEUE ------------------------ */
class CircularQueue {
  constructor(capacity = 6) {
    this.buf = new Array(capacity);
    this.capacity = capacity;
    this.front = 0; this.count = 0;
  }
  enqueue(x) {
    if (this.count === this.capacity) this.dequeue();      // overwrite oldest
    this.buf[(this.front + this.count) % this.capacity] = x;
    this.count++;
  }
  dequeue() {
    if (!this.count) return undefined;
    const x = this.buf[this.front];
    this.buf[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return x;
  }
  toArray() {                                            // front -> rear
    const out = [];
    for (let i = 0; i < this.count; i++) out.push(this.buf[(this.front + i) % this.capacity]);
    return out;
  }
  removeWhere(pred) {
    const keep = this.toArray().filter(x => !pred(x));
    this.buf = new Array(this.capacity); this.front = 0; this.count = 0;
    keep.forEach(x => this.enqueue(x));
  }
  get size() { return this.count; }
}

/* ------------------------- 6. MIN HEAP (PQ) -------------------------- */
class MinHeap {
  constructor(compare = (a, b) => a - b) { this.a = []; this.cmp = compare; }
  get size() { return this.a.length; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {                                   // sift up
      const p = (i - 1) >> 1;
      if (this.cmp(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return undefined;
    const top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {                                      // sift down
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
        if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]]; i = m;
      }
    }
    return top;
  }
}

/* --------------------------- 7. MERGE SORT --------------------------- */
function mergeSort(arr, cmp) {
  if (arr.length <= 1) return arr.slice();
  const mid = arr.length >> 1;
  const L = mergeSort(arr.slice(0, mid), cmp);
  const R = mergeSort(arr.slice(mid), cmp);
  const out = [];
  let i = 0, j = 0;
  while (i < L.length && j < R.length) out.push(cmp(L[i], R[j]) <= 0 ? L[i++] : R[j++]);
  return out.concat(L.slice(i), R.slice(j));
}
