/* 路线串点页：window.W.Views.routes（阶段 16 · R11） */
(function (window) {
  'use strict';

  window.W = window.W || {};
  window.W.Views = window.W.Views || {};

  var state = {
    city: '',
    recipeKey: 'half',
    variant: 0,
    savedId: null,
    startSpot: null
  };
  var refs = {};
  var cities = [];

  function el(tag, attrs, children) {
    return window.W.UI.el(tag, attrs, children);
  }

  function spots() {
    return window.W.Store.listSpots();
  }

  function currentUser() {
    return window.W.Store.getCurrentUser();
  }

  function citySpots(city) {
    return spots().filter(function (spot) { return spot.city === city; });
  }

  function centerFor(city) {
    return window.W.Location.centerForCity(city, spots());
  }

  function initState(params) {
    cities = window.W.Location.listCities(spots());
    var session = window.W.Location.getSession ? window.W.Location.getSession() : null;
    var fallback = window.W.Location.currentCity ? window.W.Location.currentCity('广州') : '广州';
    state.city = session && session.city ? session.city : fallback;
    if (cities.indexOf(state.city) < 0) state.city = cities[0] || '广州';
    state.recipeKey = 'half';
    state.variant = 0;
    state.savedId = null;
    state.startSpot = null;

    var startId = params && params.startSpotId ? params.startSpotId : '';
    if (!startId && window.W.RouteIntent && window.W.RouteIntent.startSpotId) {
      startId = window.W.RouteIntent.startSpotId;
    }
    window.W.RouteIntent = null;
    if (startId) {
      var start = window.W.Store.getSpot(startId);
      if (start) {
        state.startSpot = start;
        if (start.city) state.city = start.city;
      }
    }
  }

  function currentRoute() {
    if (state.savedId) {
      var saved = window.W.Store.getRoute(state.savedId);
      if (saved) {
        var built = window.W.Route.fromIds(spots(), saved.spotIds, {
          city: saved.city,
          cityName: saved.city,
          recipeKey: saved.durationKey,
          title: saved.title,
          note: saved.note
        });
        if (built) {
          built.savedId = saved.id;
          return built;
        }
      }
      state.savedId = null;
    }
    var startPoint = null;
    if (state.startSpot) {
      startPoint = {
        lat: state.startSpot.lat,
        lng: state.startSpot.lng,
        title: state.startSpot.title
      };
    } else {
      var center = centerFor(state.city);
      startPoint = { lat: center.lat, lng: center.lng, title: '市中心' };
    }
    return window.W.Route.generate(spots(), {
      city: state.city,
      cityName: state.city,
      recipeKey: state.recipeKey,
      variant: state.variant,
      startPoint: startPoint,
      startSpot: state.startSpot
    });
  }

  function sectionHead(no, title, en, meta) {
    return el('div', { class: 'section-head' }, [
      el('div', { class: 'section-head-left' }, [
        el('span', { class: 'section-no' }, no),
        el('h2', { class: 'section-title' }, title),
        el('span', { class: 'section-en' }, en)
      ]),
      meta ? el('span', { class: 'section-meta' }, meta) : null
    ]);
  }

  function buildHero() {
    return el('section', { class: 'route-hero v18-route-hero' }, [
      el('span', { class: 'route-hero-mark', 'aria-hidden': 'true' }, 'ROUTE'),
      el('div', { class: 'route-kicker' }, 'CITY ROUTES · 路线串点'),
      el('h1', { class: 'route-title' }, ['把一天，', el('br'), el('em', {}, '串成一条线。')]),
      el('p', { class: 'route-deck' }, '选一种走法，剩下的交给距离。不赶景点，只把顺路的地方串成一天。'),
      el('div', { class: 'route-hero-meta' }, [
        el('span', {}, spots().length + ' 个地点'),
        el('span', { class: 'route-dot-sep' }, '·'),
        el('span', {}, cities.length + ' 座城市'),
        el('span', { class: 'route-dot-sep' }, '·'),
        el('span', {}, 'R11 / ROUTE')
      ])
    ]);
  }

  function buildCityBar() {
    var select = el('select', {
      class: 'route-city-select',
      'aria-label': '选择出发城市',
      onChange: function (event) {
        state.city = event.target.value;
        state.startSpot = null;
        state.savedId = null;
        state.variant = 0;
        paintAll();
      }
    }, cities.map(function (city) {
      return el('option', { value: city, selected: city === state.city }, city);
    }));

    return el('div', { class: 'route-city-bar' }, [
      el('div', { class: 'route-city-bar-label' }, [
        el('span', { class: 'route-city-bar-en' }, 'DEPART FROM'),
        el('span', {}, '从哪座城市出发')
      ]),
      el('div', { class: 'route-city-select-wrap' }, [
        select,
        el('span', { class: 'route-select-arrow', 'aria-hidden': 'true' }, '▾')
      ]),
      refs.cityCount = el('span', { class: 'route-city-count' }, citySpots(state.city).length + ' 个地点可串')
    ]);
  }

  function buildRecipeCard(recipe) {
    var active = !state.savedId && recipe.key === state.recipeKey;
    return el('button', {
      class: 'route-recipe-card' + (active ? ' is-active' : ''),
      type: 'button',
      'aria-pressed': active ? 'true' : 'false',
      onClick: function () {
        state.recipeKey = recipe.key;
        state.variant = 0;
        state.savedId = null;
        state.startSpot = null;
        paintAll();
      }
    }, [
      el('span', { class: 'route-recipe-top' }, [
        el('span', { class: 'route-recipe-en' }, recipe.en),
        el('span', { class: 'route-recipe-badge' }, recipe.count + ' 站')
      ]),
      el('strong', { class: 'route-recipe-name' }, recipe.name),
      el('span', { class: 'route-recipe-foot' }, [
        el('span', { class: 'route-recipe-time' }, textOfMinutes(recipe.start) + ' 出发'),
        el('span', { class: 'route-recipe-arrow' }, '→')
      ])
    ]);
  }

  function textOfMinutes(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
  }

  function buildRecipeSection() {
    return el('section', { class: 'route-recipes' }, [
      sectionHead('01', '选一种走法', 'ROUTE RECIPES', '点一下 · 换条线'),
      el('div', { class: 'route-recipe-grid' }, window.W.Route.recipes.map(buildRecipeCard))
    ]);
  }

  function statItem(label, value, note) {
    return el('div', { class: 'route-stat' }, [
      el('span', { class: 'route-stat-label' }, label),
      el('strong', { class: 'route-stat-value' }, value),
      note ? el('span', { class: 'route-stat-note' }, note) : null
    ]);
  }

  function buildSketch(route) {
    var width = 340;
    var height = 210;
    var padX = 34;
    var padY = 34;
    var points = [];

    if (route.startPoint) {
      var firstStop = route.stops[0];
      var sameAsFirst = firstStop && firstStop.spot &&
        Math.abs(Number(firstStop.spot.lat) - Number(route.startPoint.lat)) < 0.0001 &&
        Math.abs(Number(firstStop.spot.lng) - Number(route.startPoint.lng)) < 0.0001;
      if (!sameAsFirst) {
        points.push({ lat: route.startPoint.lat, lng: route.startPoint.lng, start: true });
      }
    }
    route.stops.forEach(function (stop, index) {
      points.push({ lat: stop.spot.lat, lng: stop.spot.lng, index: index + 1 });
    });
    if (points.length < 2) return el('div', { class: 'route-sketch-empty' }, '缺少坐标，暂时画不出路线图');

    var minLat = Math.min.apply(null, points.map(function (p) { return p.lat; }));
    var maxLat = Math.max.apply(null, points.map(function (p) { return p.lat; }));
    var minLng = Math.min.apply(null, points.map(function (p) { return p.lng; }));
    var maxLng = Math.max.apply(null, points.map(function (p) { return p.lng; }));
    var spanLat = maxLat - minLat || 0.002;
    var spanLng = maxLng - minLng || 0.002;
    var scale = Math.min((width - padX * 2) / spanLng, (height - padY * 2) / spanLat);
    var usedW = spanLng * scale;
    var usedH = spanLat * scale;
    var left = padX + (width - padX * 2 - usedW) / 2;
    var top = padY + (height - padY * 2 - usedH) / 2;

    var projected = points.map(function (point) {
      return {
        x: left + (point.lng - minLng) * scale,
        y: top + (maxLat - point.lat) * scale,
        start: point.start,
        index: point.index
      };
    });

    var grid = '';
    for (var gx = 24; gx < width; gx += 32) {
      grid += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + height + '" stroke="rgba(17,17,16,.055)" stroke-width="1"/>';
    }
    for (var gy = 24; gy < height; gy += 32) {
      grid += '<line x1="0" y1="' + gy + '" x2="' + width + '" y2="' + gy + '" stroke="rgba(17,17,16,.055)" stroke-width="1"/>';
    }

    var path = projected.map(function (point, i) {
      return (i ? 'L' : 'M') + point.x.toFixed(1) + ' ' + point.y.toFixed(1);
    }).join(' ');

    var marks = projected.map(function (point) {
      if (point.start) {
        return '<circle cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="4.5" fill="#e85d2a"/>' +
          '<text x="' + (point.x + 9).toFixed(1) + '" y="' + (point.y + 3).toFixed(1) + '" fill="#8a4a2e" font-size="7" font-family="monospace" letter-spacing="1">START</text>';
      }
      return '<circle cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="11" fill="#f1efea" stroke="#111110" stroke-width="1"/>' +
        '<text x="' + point.x.toFixed(1) + '" y="' + (point.y + 3).toFixed(1) + '" text-anchor="middle" fill="#111110" font-size="8" font-family="monospace">' + point.index + '</text>';
    }).join('');

    var svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="路线示意图" preserveAspectRatio="xMidYMid meet">' +
      grid +
      '<path d="' + path + '" fill="none" stroke="rgba(232,93,42,.18)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + path + '" fill="none" stroke="#111110" stroke-width="1.2" stroke-dasharray="3 4" stroke-linecap="round" stroke-linejoin="round"/>' +
      marks +
      '<text x="' + (width - 22) + '" y="20" text-anchor="middle" fill="#8c8a84" font-size="7" font-family="monospace">N</text>' +
      '<path d="M' + (width - 22) + ' 24 l0 12 m-3 -4 l3 -4 l3 4" fill="none" stroke="#8c8a84" stroke-width="1"/>' +
      '</svg>';

    var sketchCanvas = el('div', { class: 'route-sketch-canvas' });
    sketchCanvas.innerHTML = svg;
    return el('div', { class: 'route-sketch' }, [
      sketchCanvas,
      el('div', { class: 'route-sketch-caption' }, '路线示意图 · 按实际坐标排布，非道路导航')
    ]);
  }

  function buildStop(stop, index, total) {
    var spot = stop.spot;
    var rating = window.W.Route.scoreSpot ? spotRating(spot) : 0;
    var photo = spot.cover || (spot.images && spot.images[0]) || (window.W.UI.pics && window.W.UI.pics[0]) || '';
    var card = el('button', {
      class: 'route-stop-card',
      type: 'button',
      onClick: function () { window.W.Router.go('#/spot/' + encodeURIComponent(spot.id)); }
    }, [
      el('span', { class: 'route-stop-thumb' }, [
        photo ? el('img', { src: photo, alt: spot.title, loading: 'lazy' }) : null,
        el('span', { class: 'route-stop-thumb-no' }, '0' + (index + 1))
      ]),
      el('span', { class: 'route-stop-body' }, [
        el('span', { class: 'route-stop-kicker' }, 'STOP 0' + (index + 1) + ' · ' + window.W.UI.categoryName(spot.category)),
        el('strong', { class: 'route-stop-title' }, spot.title),
        el('span', { class: 'route-stop-meta' }, [
          rating ? el('span', { class: 'route-stop-rating' }, rating.toFixed(1) + ' ★') : null,
          el('span', {}, window.W.UI.money(spot.price) || '免费'),
          el('span', { class: 'route-stop-address' }, spot.address || spot.city || '')
        ]),
        el('span', { class: 'route-stop-link' }, '查看地点 →')
      ])
    ]);

    var children = [
      el('div', { class: 'route-stop-time' }, [
        el('strong', {}, stop.arriveText),
        el('span', {}, stop.leaveText + ' 离开')
      ]),
      el('div', { class: 'route-stop-rail' }, [
        el('span', { class: 'route-stop-dot' }, String(index + 1))
      ]),
      el('div', { class: 'route-stop-main' }, [
        (index > 0 || stop.legKm > 0) ? el('div', { class: 'route-leg' }, [
          el('span', { class: 'route-leg-dash' }, '↳'),
          el('span', {}, stop.travelMode === 'taxi' ? '打车' : (stop.travelMode === 'walk' ? '步行' : '出发')),
          el('span', {}, stop.travelMinutes + ' 分钟'),
          el('span', { class: 'route-leg-km' }, stop.legKm + ' km')
        ]) : null,
        card
      ])
    ];
    return el('div', { class: 'route-stop' + (index === total - 1 ? ' is-last' : '') }, children);
  }

  function spotRating(spot) {
    var comments = spot.comments || [];
    var total = 0;
    var count = 0;
    comments.forEach(function (comment) {
      if (typeof comment.rating === 'number') {
        total += comment.rating;
        count += 1;
      }
    });
    return count ? total / count : 0;
  }

  function buildDetail(route) {
    if (!route) {
      return el('section', { class: 'route-detail route-detail-empty' }, [
        window.W.UI.empty('这座城市还串不成路线', '换一座城市，或先去「发布」添几个地点。', '回到首页', function () {
          window.W.Router.go('#/home');
        })
      ]);
    }

    var savedMode = !!route.savedId;
    var latest = window.W.Store.getRoute(route.savedId);
    var title = savedMode && latest ? latest.title : route.recipeName;
    var variantNo = ('00' + ((Number(route.variant) || 0) + 1)).slice(-3);
    var detailNo = savedMode ? 'SAVED ROUTE' : 'ROUTE NO. ' + variantNo;

    var stats = el('div', { class: 'route-stats' }, [
      statItem('总时长', window.W.Route.durationText(route.totalMinutes), route.startText + '–' + route.endText),
      statItem('总路程', route.totalKm + ' km', route.stopCount + ' 段'),
      statItem('门票预算', route.totalCost > 0 ? '¥' + route.totalCost : '¥0', '不含吃喝'),
      statItem('路线', route.stopCount + ' 站', savedMode ? '已保存' : '为你排好')
    ]);

    var actions = el('div', { class: 'route-actions' }, [
      savedMode
        ? el('button', { class: 'btn btn-primary route-save is-saved', type: 'button', disabled: true }, '已保存 ✓')
        : el('button', {
          class: 'btn btn-primary route-save',
          type: 'button',
          onClick: function () { saveCurrent(route); }
        }, '保存这条路线'),
      el('button', {
        class: 'btn btn-ghost route-swap',
        type: 'button',
        onClick: function () {
          if (savedMode) {
            state.savedId = null;
            state.recipeKey = 'half';
            state.variant = 0;
            state.startSpot = null;
            paintAll();
          } else {
            state.variant += 1;
            paintDetail();
          }
        }
      }, savedMode ? '回到推荐' : '换一条 ↻')
    ]);

    var amap = window.W.Route.amapUrl(route);
    if (amap) {
      actions.appendChild(el('a', {
        class: 'route-amap-link',
        href: amap,
        target: '_blank',
        rel: 'noopener',
        onClick: function () {
          // 外部导航可能被浏览器拦截，给用户一个明确反馈
          window.W.UI.toast('正在打开高德地图…', 'info', 1600);
        }
      }, '在高德地图打开整条路线 ↗'));
    }

    var detail = el('section', { class: 'route-detail' + (savedMode ? ' is-saved' : '') }, [
      el('div', { class: 'route-detail-head' }, [
        el('div', { class: 'route-detail-kicker' }, [
          el('span', { class: 'route-detail-no' }, detailNo),
          el('span', {}, savedMode ? '你保存的路线' : '为你排好 · ' + (route.startPoint ? '从' + route.startPoint.title + '出发' : '从市中心出发'))
        ]),
        el('div', { class: 'route-detail-title-row' }, [
          el('h2', { class: 'route-detail-title' }, title),
          el('span', { class: 'route-detail-city' }, route.city)
        ]),
        el('p', { class: 'route-detail-note' }, route.note || '按距离从近到远排好，走起来不绕路。'),
        stats
      ]),
      buildSketch(route),
      el('div', { class: 'route-timeline' }, route.stops.map(function (stop, index) {
        return buildStop(stop, index, route.stops.length);
      })),
      actions
    ]);
    return detail;
  }

  function saveCurrent(route) {
    try {
      var saved = window.W.Store.saveRoute({
        title: route.city + ' · ' + route.recipeName,
        city: route.city,
        theme: route.theme,
        durationKey: route.recipeKey,
        spotIds: route.stops.map(function (stop) { return stop.spot.id; }),
        note: route.note
      });
      state.savedId = saved.id;
      window.W.UI.toast('路线已存进「我的路线」', 'ok', 2200);
      paintAll();
      if (refs.detail) refs.detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      window.W.UI.toast('保存失败，至少需要两个地点', 'error', 2400);
    }
  }

  function paintDetail() {
    if (!refs.detail) return;
    var route = currentRoute();
    refs.detail.innerHTML = '';
    refs.detail.appendChild(buildDetail(route));
  }

  function buildSavedSection() {
    var list = window.W.Store.listMyRoutes(currentUser() ? currentUser().id : undefined);
    var section = el('section', { class: 'route-saved' }, [
      sectionHead('03', '我的路线', 'SAVED ROUTES', list.length ? list.length + ' 条' : '还没保存')
    ]);

    if (!list.length) {
      section.appendChild(el('div', { class: 'route-saved-empty' }, [
        el('span', { class: 'route-saved-empty-mark' }, '✦'),
        el('div', {}, [
          el('strong', {}, '还没有保存的路线'),
          el('span', {}, '生成一条后点「保存这条路线」，下次就能直接翻出来走。')
        ])
      ]));
      return section;
    }

    var items = el('div', { class: 'route-saved-list' });
    list.forEach(function (route) {
      var recipe = window.W.Route.recipe(route.durationKey);
      var item = el('div', { class: 'route-saved-item' + (state.savedId === route.id ? ' is-active' : '') }, [
        el('button', {
          class: 'route-saved-main',
          type: 'button',
          onClick: function () {
            state.savedId = route.id;
            state.variant = 0;
            paintAll();
            if (refs.detail) refs.detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, [
          el('span', { class: 'route-saved-kicker' }, [route.city, '·', recipe ? recipe.en : 'ROUTE', '·', route.spotIds.length + ' 站']),
          el('strong', { class: 'route-saved-title' }, route.title),
          el('span', { class: 'route-saved-meta' }, window.W.UI.dateTime(route.createdAt) + ' 保存')
        ]),
        el('div', { class: 'route-saved-actions' }, [
          el('button', {
            class: 'route-mini',
            type: 'button',
            onClick: function () {
              state.savedId = route.id;
              state.variant = 0;
              paintAll();
              if (refs.detail) refs.detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, '查看'),
          el('button', {
            class: 'route-mini route-mini-danger',
            type: 'button',
            onClick: function () {
              window.W.UI.confirm('删除「' + route.title + '」？').then(function (ok) {
                if (!ok) return;
                window.W.Store.deleteRoute(route.id, currentUser() ? currentUser().id : undefined);
                if (state.savedId === route.id) state.savedId = null;
                paintAll();
                window.W.UI.toast('已删除这条路线', 'ok', 1800);
              });
            }
          }, '删除')
        ])
      ]);
      items.appendChild(item);
    });
    section.appendChild(items);
    return section;
  }

  function paintSaved() {
    if (!refs.saved) return;
    refs.saved.innerHTML = '';
    refs.saved.appendChild(buildSavedSection());
  }

  function paintRecipes() {
    if (!refs.recipes) return;
    refs.recipes.innerHTML = '';
    refs.recipes.appendChild(buildRecipeSection());
  }

  function paintAll() {
    if (refs.cityCount) {
      refs.cityCount.textContent = citySpots(state.city).length + ' 个地点可串';
    }
    paintRecipes();
    paintDetail();
    paintSaved();
  }

  function render(root, params) {
    initState(params || {});
    root.innerHTML = '';
    refs = {};
    var page = el('div', { class: 'route-page' });
    page.appendChild(buildHero());
    page.appendChild(buildCityBar());
    page.appendChild(el('div', { class: 'route-recipe-slot' }));
    page.appendChild(el('div', { class: 'route-detail-slot' }));
    page.appendChild(el('div', { class: 'route-saved-slot' }));
    root.appendChild(page);

    refs.recipes = page.querySelector('.route-recipe-slot');
    refs.detail = page.querySelector('.route-detail-slot');
    refs.saved = page.querySelector('.route-saved-slot');

    paintAll();
    window.scrollTo(0, 0);
  }

  window.W.Views.routes = { render: render };
})(window);
