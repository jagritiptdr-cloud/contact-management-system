# ContactSphere — Contact Management System

Data Structures mini project. Ye ek **static web app** hai (HTML + CSS + JavaScript). Isme koi server ya database nahi hai, aur har operation ek hath se likhe gaye data structure se chalta hai.

## Kaise chalayein
`index.html` par double-click karein. Ye Chrome ya Edge mein khul jayega. Internet ki zaroorat nahi hai (bas font online se aata hai; offline hone par system font use hoga).

Data browser ke **localStorage** mein save hota hai. Pehli baar kholne par 24 sample contacts load hote hain. *About Project → Reset demo data* dabane se ye wapas aa jate hain.

## Data structures (sab `js/ds.js` mein, scratch se likhe hue)

| Data structure | Kahan use hua | Complexity |
|---|---|---|
| **HashMap** (djb2 hash + chaining) | ID se contact store karna, duplicate phone check | O(1) |
| **Trie** | Search box mein live prefix search | O(L) |
| **AVL Tree** | Contacts ko A→Z / Z→A sorted rakhna | O(log n) |
| **Stack** | Undo (Ctrl + Z) | O(1) |
| **Circular Queue** | Recently viewed contacts | O(1) |
| **Min-Heap** | Aane wale birthdays | O(log n) |
| **Merge Sort** | Newest / oldest sort | O(n log n) |

## Presentation flow (5–7 min)
1. **Dashboard**: stats, groups, recently viewed (Queue), birthdays (Heap), aur activity log jisme har operation ka time ms mein dikhta hai.
2. **Search**: search box mein `ar`, `inf` ya `98` type karein. Har letter par result turant aata hai (Trie).
3. **Add contact**: koi existing phone number daalein, to duplicate wala error aayega (HashMap O(1) check).
4. **Delete karke Undo dabayein**: contact wapas aa jayega (Stack).
5. **DS Visualizer**: har structure live dikhega.
   - HashMap ke buckets aur collisions
   - Trie mein prefix type karke tree dekhein
   - AVL tree mein naam search karke comparison path dekhein
   - Stack, Queue (front/rear pointers), Heap ka tree aur array
   - Complexity tab mein array se comparison
6. **About Project**: objective, problem statement, features, tech stack, future scope.

## Photos
Sample contacts ki photos [Unsplash](https://unsplash.com) se hain (free Unsplash License), isliye unke liye internet chahiye. Internet na ho to rangeen initials wala avatar dikhega. Form mein **Upload photo** se apni photo bhi daal sakte hain, jo offline bhi dikhegi.

## Shortcuts
`/` se search, `N` se naya contact, `Ctrl+Z` se undo, `Esc` se close.

## Files
```
index.html      → saari screens
css/style.css   → design (light/dark, responsive)
js/ds.js        → saare data structures
js/data.js      → sample contacts
js/app.js       → ContactBook logic + UI
```
