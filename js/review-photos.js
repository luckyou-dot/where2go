/* 评论配图图库：与帖子封面/图集分开，避免同一地点的帖子图和评论图重复。
   图片来源：百度图片搜索结果（非商业原型演示用），详见 review-photos/CREDITS.md */
(function (window) {
  'use strict';

  window.W = window.W || {};

  var POOLS = {
    food: [
      'review-photos/review-food-01.jpg',
      'review-photos/review-food-03.jpg',
      'review-photos/review-food-04.jpg',
      'review-photos/review-food-05.jpg',
      'review-photos/review-food-06.jpg'
    ],
    nature: [
      'review-photos/review-nature-01.jpg',
      'review-photos/review-nature-02.jpg',
      'review-photos/review-nature-03.jpg',
      'review-photos/review-nature-04.jpg',
      'review-photos/review-nature-05.jpg',
      'review-photos/review-nature-06.jpg'
    ],
    photo: [
      'review-photos/review-photo-01.jpg',
      'review-photos/review-photo-02.jpg',
      'review-photos/review-photo-03.jpg',
      'review-photos/review-photo-04.jpg',
      'review-photos/review-photo-05.jpg',
      'review-photos/review-photo-06.jpg'
    ],
    night: [
      'review-photos/review-night-01.jpg',
      'review-photos/review-night-02.jpg',
      'review-photos/review-night-03.jpg',
      'review-photos/review-night-05.jpg',
      'review-photos/review-night-06.jpg'
    ],
    fun: [
      'review-photos/review-fun-01.jpg',
      'review-photos/review-fun-02.jpg',
      'review-photos/review-fun-03.jpg',
      'review-photos/review-fun-04.jpg',
      'review-photos/review-fun-05.jpg',
      'review-photos/review-fun-06.jpg'
    ],
    other: [
      'review-photos/review-other-01.jpg',
      'review-photos/review-other-02.jpg',
      'review-photos/review-other-03.jpg',
      'review-photos/review-other-04.jpg',
      'review-photos/review-other-05.jpg',
      'review-photos/review-other-06.jpg'
    ],
    ktv: [
      'review-photos/review-ktv-01.jpg',
      'review-photos/review-ktv-02.jpg',
      'review-photos/review-ktv-03.jpg',
      'review-photos/review-ktv-04.jpg',
      'review-photos/review-ktv-05.jpg',
      'review-photos/review-ktv-06.jpg'
    ],
    board: [
      'review-photos/review-board-01.jpg',
      'review-photos/review-board-02.jpg',
      'review-photos/review-board-03.jpg',
      'review-photos/review-board-04.jpg',
      'review-photos/review-board-05.jpg',
      'review-photos/review-board-06.jpg'
    ],
    script: [
      'review-photos/review-script-01.jpg',
      'review-photos/review-script-02.jpg',
      'review-photos/review-script-03.jpg',
      'review-photos/review-script-04.jpg',
      'review-photos/review-script-05.jpg'
    ],
    escape: [
      'review-photos/review-escape-01.jpg',
      'review-photos/review-escape-03.jpg',
      'review-photos/review-escape-04.jpg',
      'review-photos/review-escape-05.jpg',
      'review-photos/review-escape-06.jpg'
    ],
    cinema: [
      'review-photos/review-cinema-01.jpg',
      'review-photos/review-cinema-02.jpg',
      'review-photos/review-cinema-03.jpg',
      'review-photos/review-cinema-04.jpg'
    ],
    livehouse: [
      'review-photos/review-livehouse-01.jpg',
      'review-photos/review-livehouse-02.jpg',
      'review-photos/review-livehouse-03.jpg',
      'review-photos/review-livehouse-04.jpg',
      'review-photos/review-livehouse-05.jpg'
    ],
    arcade: [
      'review-photos/review-arcade-01.jpg',
      'review-photos/review-arcade-02.jpg',
      'review-photos/review-arcade-03.jpg',
      'review-photos/review-arcade-04.jpg',
      'review-photos/review-arcade-05.jpg'
    ]
  };

  function hashId(value) {
    var text = String(value || '');
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash * 31) + text.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function poolFor(category) {
    return POOLS[category] || POOLS.other;
  }

  function forSpot(spot, limit, offset) {
    spot = spot || {};
    var pool = poolFor(spot.category);
    var blocked = [spot.cover].concat(spot.images || []);
    var safe = pool.filter(function (url) {
      return blocked.indexOf(url) < 0;
    });
    if (!safe.length) safe = POOLS.other.slice();
    var count = Math.round(Number(limit));
    if (isNaN(count) || count <= 0) count = 6;
    count = Math.min(count, safe.length);
    var step = Math.round(Number(offset));
    if (isNaN(step)) step = 0;
    var start = (hashId(spot.id) + step) % safe.length;
    var result = [];
    for (var i = 0; i < count; i++) result.push(safe[(start + i) % safe.length]);
    return result;
  }

  function all() {
    var result = [];
    Object.keys(POOLS).forEach(function (key) {
      result = result.concat(POOLS[key]);
    });
    return result;
  }

  window.W.ReviewPhotos = {
    pools: POOLS,
    poolFor: poolFor,
    forSpot: forSpot,
    all: all
  };
})(window);
