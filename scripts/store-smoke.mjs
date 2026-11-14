import fs from 'node:fs';
import vm from 'node:vm';

const storage = new Map();
const localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

globalThis.window = globalThis;
globalThis.localStorage = localStorage;
globalThis.W = {};
const context = vm.createContext(globalThis);
for (const file of ['js/seed.js', 'js/store.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const S = W.Store;
const assert = (cond, msg) => {
  if (!cond) throw new Error('FAIL: ' + msg);
  console.log('ok - ' + msg);
};

S.init();
assert(S.getPassport('u1').total === 2, 'u1 baseline passport total 2');
assert(S.getPassport('u1').checkins.length === 2, 'u1 baseline checkins 2');
assert(S.getPassport('u1').earnedCount === 1, 'u1 baseline badge 1');
assert(S.getCheckinStats('s1').userCount === 2, 's1 local checkin users 2');
assert(S.getCheckinStats('s1').nationalUserCount === 5, 'national checkin users 5');

const first = S.checkinSpot('s3', 'u1');
assert(first.ok && first.created === true, 'first checkin creates');
assert(S.getPassport('u1').total === 3, 'passport total 3 after checkin');
const again = S.checkinSpot('s3', 'u1');
assert(again.ok && again.created === false, 'second checkin idempotent');
assert(S.getPassport('u1').checkins.length === 3, 'no duplicate checkin saved');

const post = S.addLivePost('s4', { userId: 'u1', content: '现场实况测试', photos: ['assets/photos/westlake-sunset.jpg'] });
assert(post && post.id.startsWith('lv_'), 'add live post');
assert(S.listLivePosts('s4').length === 1, 'list live post after add');
assert(S.deleteLivePost('s4', post.id, 'u1') === true, 'delete own live post');
assert(S.listLivePosts('s4').length === 0, 'live post gone');

assert(S.setWarn('s4', { userId: 'u1', tags: ['排队太久', '交通不便'], content: '测试' }).ok === true, 'set warn');
const wi = S.getWarnInfo('s4', 'u1');
assert(wi.count === 1 && wi.tags.length === 2 && wi.myWarn, 'warn info count/tags/mine');
assert(S.setWarn('s4', { userId: 'u1', tags: [] }).ok === false, 'empty tags rejected');
assert(S.removeWarn('s4', 'u1').removed === true, 'remove warn');

S.reset();
assert(S.getPassport('u1').total === 2, 'reset restores passport baseline');
assert(S.getCheckinStats('s1').userCount === 2, 'reset restores checkins');
console.log('ALL PASS');
