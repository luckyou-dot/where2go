/* 路线串点：window.W.Route（阶段 16 · R11）
 * 只做纯计算：从地点池里按主题选点、按距离排顺、排出时间轴。
 */
(function (window) {
  'use strict';

  window.W = window.W || {};

  var RECIPES = [
    {
      key: 'half',
      name: '半日经典',
      en: 'HALF DAY',
      desc: '一个下午，四站刚好',
      start: 13 * 60 + 30,
      count: 4,
      theme: 'classic',
      badge: '4 站 · 半天'
    },
    {
      key: 'full',
      name: '一日漫游',
      en: 'FULL DAY',
      desc: '从早逛到晚，六站成线',
      start: 10 * 60,
      count: 6,
      theme: 'classic',
      badge: '6 站 · 一天'
    },
    {
      key: 'photo',
      name: '出片路线',
      en: 'PHOTO WALK',
      desc: '光影、街角与好看的地方',
      start: 14 * 60,
      count: 4,
      theme: 'photo',
      badge: '4 站 · 半天'
    },
    {
      key: 'night',
      name: '夜游小环线',
      en: 'NIGHT LOOP',
      desc: '天黑以后，城市才刚醒',
      start: 18 * 60 + 30,
      count: 4,
      theme: 'night',
      badge: '4 站 · 夜游'
    },
    {
      key: 'play',
      name: '玩点新鲜',
      en: 'PLAY ROUTE',
      desc: '密室、桌游、电玩一次玩够',
      start: 14 * 60,
      count: 4,
      theme: 'play',
      badge: '4 站 · 半天'
    }
  ];

  var THEME_CATEGORIES = {
    classic: ['photo', 'nature', 'food', 'fun', 'cinema', 'other'],
    photo: ['photo', 'nature', 'night'],
    night: ['night', 'livehouse', 'food', 'cinema', 'other'],
    play: ['escape', 'script', 'ktv', 'board', 'arcade', 'fun', 'cinema']
  };

  var STAY_MINUTES = {
    food: 60,
    fun: 75,
    ktv: 90,
    script: 120,
    escape: 75,
    board: 90,
    arcade: 45,
    cinema: 105,
    livehouse: 75,
    nature: 60,
    photo: 35,
    night: 50,
    other: 50
  };

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toText(minutes) {
    var m = Math.max(0, Math.round(minutes));
    return pad2(Math.floor(m / 60) % 24) + ':' + pad2(m % 60);
  }

  function recipeOf(key) {
    for (var i = 0; i < RECIPES.length; i++) {
      if (RECIPES[i].key === key) return RECIPES[i];
    }
    return RECIPES[0];
  }

  function hasCoord(spot) {
    return spot && typeof spot.lat === 'number' && typeof spot.lng === 'number' && isFinite(spot.lat) && isFinite(spot.lng);
  }

  function ratingOf(spot) {
    if (typeof spot.rating === 'number' && spot.rating > 0) return spot.rating;
    var comments = spot.comments || [];
    if (comments.length) {
      var total = 0;
      var count = 0;
      comments.forEach(function (comment) {
        if (typeof comment.rating === 'number') {
          total += comment.rating;
          count += 1;
        }
      });
      if (count) return total / count;
    }
    return 0;
  }

  function scoreSpot(spot) {
    var rating = ratingOf(spot);
    var comments = (spot.comments || []).length;
    var favorites = (spot.favorites || []).length;
    var views = Number(spot.views) || 0;
    var likes = (spot.likes || []).length;
    return rating * 2.2 + Math.min(comments, 30) * 0.55 + Math.min(favorites, 20) * 0.9 + Math.min(views, 4000) / 300 + Math.min(likes, 30) * 0.15;
  }

  function distanceKm(a, b) {
    if (!hasCoord(a) || !hasCoord(b)) return 0;
    var rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad;
    var dLng = (b.lng - a.lng) * rad;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  function travelOf(km) {
    if (km < 0.05) {
      return { mode: 'none', minutes: 0, label: '' };
    }
    if (km <= 1.2) {
      return { mode: 'walk', minutes: Math.max(6, Math.round(km / 4.5 * 60)), label: '步行' };
    }
    return { mode: 'taxi', minutes: Math.max(8, Math.round(km / 22 * 60)), label: '打车' };
  }

  function pickDiverse(ranked, count, themeCats) {
    var preferred = themeCats && themeCats.length ? themeCats : null;
    var buckets = {};
    var order = [];
    ranked.forEach(function (spot) {
      var category = spot.category || 'other';
      if (!buckets[category]) {
        buckets[category] = [];
        order.push(category);
      }
      buckets[category].push(spot);
    });
    if (preferred) {
      order.sort(function (a, b) {
        var ia = preferred.indexOf(a);
        var ib = preferred.indexOf(b);
        if (ia < 0 && ib < 0) return 0;
        if (ia < 0) return 1;
        if (ib < 0) return -1;
        return ia - ib;
      });
    }
    var picked = [];
    var used = {};
    var guard = 0;
    while (picked.length < count && guard < 60) {
      var moved = false;
      for (var i = 0; i < order.length && picked.length < count; i++) {
        var bucket = buckets[order[i]];
        if (!bucket || !bucket.length) continue;
        var candidate = bucket.shift();
        if (!candidate || used[candidate.id]) continue;
        used[candidate.id] = true;
        picked.push(candidate);
        moved = true;
      }
      guard += 1;
      if (!moved) break;
    }
    if (picked.length < count) {
      ranked.forEach(function (spot) {
        if (picked.length >= count || used[spot.id]) return;
        used[spot.id] = true;
        picked.push(spot);
      });
    }
    return picked;
  }

  function orderByNearest(start, spots) {
    if (!start || !hasCoord(start) || !spots.length) {
      spots.forEach(function (spot) { spot.__legKm = 0; });
      return spots.slice();
    }
    var remaining = spots.slice();
    var ordered = [];
    var current = start;
    while (remaining.length) {
      var bestIndex = 0;
      var bestDistance = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        var km = distanceKm(current, remaining[i]);
        if (km < bestDistance - 0.001) {
          bestDistance = km;
          bestIndex = i;
        }
      }
      var next = remaining.splice(bestIndex, 1)[0];
      next.__legKm = bestDistance;
      ordered.push(next);
      current = next;
    }
    return ordered;
  }

  function buildRoute(spots, recipe, startPoint, meta, preserveOrder) {
    if (!spots || spots.length < 2) return null;
    var ordered;
    if (preserveOrder) {
      ordered = spots.slice();
      var previous = hasCoord(startPoint) ? startPoint : null;
      ordered.forEach(function (spot) {
        spot.__legKm = previous ? distanceKm(previous, spot) : 0;
        previous = spot;
      });
    } else {
      ordered = orderByNearest(startPoint, spots);
    }
    var startMinutes = recipe.start;
    var cursor = startMinutes;
    var totalKm = 0;
    var totalCost = 0;
    var stops = [];

    ordered.forEach(function (spot, index) {
      var legKm = Number(spot.__legKm) || 0;
      var travel = travelOf(legKm);
      if (index === 0 && !hasCoord(startPoint)) {
        legKm = 0;
        travel = { mode: 'none', minutes: 0, label: '' };
      }
      cursor += travel.minutes;
      var stay = STAY_MINUTES[spot.category] || STAY_MINUTES.other;
      if (recipe.key === 'photo' && spot.category === 'photo') stay = 50;
      var arrive = cursor;
      var leave = arrive + stay;
      totalKm += legKm;
      totalCost += Number(spot.price) || 0;
      stops.push({
        spot: spot,
        arriveMin: arrive,
        leaveMin: leave,
        arriveText: toText(arrive),
        leaveText: toText(leave),
        stayMinutes: stay,
        legKm: Math.round(legKm * 10) / 10,
        travelMinutes: travel.minutes,
        travelMode: travel.mode,
        travelLabel: travel.label
      });
      cursor = leave;
    });

    var endMinutes = cursor;
    return {
      city: meta.city || '',
      cityName: meta.cityName || meta.city || '',
      recipeKey: recipe.key,
      recipeName: recipe.name,
      recipeEn: recipe.en,
      theme: recipe.theme,
      title: meta.title || recipe.name,
      note: meta.note || recipe.desc,
      startText: toText(startMinutes),
      endText: toText(endMinutes),
      totalMinutes: endMinutes - startMinutes,
      totalKm: Math.round(totalKm * 10) / 10,
      totalCost: Math.round(totalCost),
      stopCount: stops.length,
      stops: stops,
      startPoint: hasCoord(startPoint) ? { lat: startPoint.lat, lng: startPoint.lng, title: startPoint.title || '出发点' } : null
    };
  }

  function generate(spots, options) {
    options = options || {};
    var city = options.city || '';
    var recipe = recipeOf(options.recipeKey || 'half');
    var pool = (spots || []).filter(function (spot) {
      return spot && hasCoord(spot) && (!city || spot.city === city);
    });
    if (pool.length < 2) return null;

    var themeCats = THEME_CATEGORIES[recipe.theme] || [];
    var themed = themeCats.length
      ? pool.filter(function (spot) { return themeCats.indexOf(spot.category) >= 0; })
      : pool.slice();

    var ranked = themed.slice().sort(function (a, b) {
      return scoreSpot(b) - scoreSpot(a);
    });
    var variant = Math.max(0, Math.round(Number(options.variant) || 0));
    if (variant > 0 && ranked.length > recipe.count) {
      var shift = (variant * 2) % ranked.length;
      ranked = ranked.slice(shift).concat(ranked.slice(0, shift));
    }

    var selected = pickDiverse(ranked, recipe.count, themeCats);
    if (selected.length < recipe.count) {
      pool.forEach(function (spot) {
        if (selected.length >= recipe.count) return;
        var exists = selected.some(function (item) { return item.id === spot.id; });
        if (!exists) selected.push(spot);
      });
    }

    var anchor = options.startSpot && hasCoord(options.startSpot) ? options.startSpot : null;
    if (anchor) {
      selected = selected.filter(function (spot) { return spot.id !== anchor.id; });
      selected.unshift(anchor);
      while (selected.length > recipe.count) selected.pop();
    }
    if (selected.length < 2) return null;

    var startPoint = anchor || (options.startPoint && hasCoord(options.startPoint) ? options.startPoint : null);
    var route = buildRoute(selected, recipe, startPoint, {
      city: city,
      cityName: options.cityName || city,
      title: options.title,
      note: options.note
    });
    if (route) route.variant = variant;
    return route;
  }

  function fromIds(spots, ids, options) {
    options = options || {};
    var map = {};
    (spots || []).forEach(function (spot) { map[spot.id] = spot; });
    var selected = [];
    (ids || []).forEach(function (id) {
      if (map[id]) selected.push(map[id]);
    });
    if (selected.length < 2) return null;
    var recipe = recipeOf(options.recipeKey || 'half');
    var startPoint = options.startPoint && hasCoord(options.startPoint) ? options.startPoint : null;
    return buildRoute(selected, recipe, startPoint, {
      city: options.city,
      cityName: options.cityName,
      title: options.title || '我的路线',
      note: options.note || '按你保存的顺序走。'
    }, true);
  }

  function amapUrl(route) {
    if (!route || !route.stops || route.stops.length < 2) return '';
    var stops = route.stops.map(function (item) { return item.spot; }).filter(hasCoord);
    if (stops.length < 2) return '';
    function point(spot) {
      return spot.lng + ',' + spot.lat + ',' + encodeURIComponent(spot.title || '地点');
    }
    var from = stops[0];
    var to = stops[stops.length - 1];
    var middle = stops.slice(1, -1).map(point).join(';');
    var url = 'https://uri.amap.com/navigation?from=' + point(from) + '&to=' + point(to);
    if (middle) url += '&waypoints=' + middle;
    url += '&mode=car&policy=1&src=wqwn&coordinate=gaode&callnative=1';
    return url;
  }

  function durationText(minutes) {
    var m = Math.max(0, Math.round(Number(minutes) || 0));
    var h = Math.floor(m / 60);
    var rest = m % 60;
    if (h && rest) return h + ' 小时 ' + rest + ' 分';
    if (h) return h + ' 小时';
    return rest + ' 分';
  }

  window.W.Route = {
    recipes: RECIPES,
    recipe: recipeOf,
    generate: generate,
    fromIds: fromIds,
    amapUrl: amapUrl,
    durationText: durationText,
    distanceKm: distanceKm,
    scoreSpot: scoreSpot
  };
})(window);
