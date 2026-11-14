/* 城市锚点、最近城市与距离排序：window.W.Location（契约 C-LOCATION@1） */
(function (window) {
  'use strict';

  window.W = window.W || {};

  var DEFAULT_CITY = '广州';
  var DEFAULT_CENTER = { lat: 23.1200966, lng: 113.3522594 };
  var CITY_ORDER = ['广州', '佛山', '深圳', '杭州', '成都', '上海', '北京', '长沙', '重庆', '西安', '南京', '武汉', '厦门', '青岛', '苏州', '天津', '昆明', '大理', '丽江', '桂林', '三亚', '石家庄', '太原', '呼和浩特', '沈阳', '长春', '哈尔滨', '郑州', '合肥', '南昌', '贵阳', '拉萨', '兰州', '西宁', '银川', '乌鲁木齐'];
  var CITY_CENTERS = {
    '广州': { lat: 23.1200966, lng: 113.3522594 },
    '佛山': { lat: 23.0218, lng: 113.1219 },
    '深圳': { lat: 22.5431, lng: 114.0579 },
    '杭州': { lat: 30.2741, lng: 120.1551 },
    '成都': { lat: 30.5728, lng: 104.0668 },
    '上海': { lat: 31.2304, lng: 121.4737 },
    '北京': { lat: 39.9042, lng: 116.4074 },
    '长沙': { lat: 28.2282, lng: 112.9388 },
    '重庆': { lat: 29.5630, lng: 106.5516 },
    '西安': { lat: 34.3416, lng: 108.9398 },
    '南京': { lat: 32.0603, lng: 118.7969 },
    '武汉': { lat: 30.5928, lng: 114.3055 },
    '厦门': { lat: 24.4798, lng: 118.0894 },
    '青岛': { lat: 36.0671, lng: 120.3826 },
    '苏州': { lat: 31.2989, lng: 120.5853 },
    '天津': { lat: 39.0842, lng: 117.2009 },
    '昆明': { lat: 25.0389, lng: 102.7183 },
    '大理': { lat: 25.6065, lng: 100.2676 },
    '丽江': { lat: 26.8550, lng: 100.2278 },
    '桂林': { lat: 25.2736, lng: 110.2900 },
    '三亚': { lat: 18.2528, lng: 109.5119 },
    '石家庄': { lat: 38.0428, lng: 114.5149 },
    '太原': { lat: 37.8706, lng: 112.5489 },
    '呼和浩特': { lat: 40.8424, lng: 111.7490 },
    '沈阳': { lat: 41.8057, lng: 123.4315 },
    '长春': { lat: 43.8171, lng: 125.3235 },
    '哈尔滨': { lat: 45.8038, lng: 126.5349 },
    '郑州': { lat: 34.7466, lng: 113.6254 },
    '合肥': { lat: 31.8206, lng: 117.2272 },
    '南昌': { lat: 28.6820, lng: 115.8579 },
    '贵阳': { lat: 26.6470, lng: 106.6302 },
    '拉萨': { lat: 29.6520, lng: 91.1721 },
    '兰州': { lat: 36.0611, lng: 103.8343 },
    '西宁': { lat: 36.6171, lng: 101.7782 },
    '银川': { lat: 38.4872, lng: 106.2309 },
    '乌鲁木齐': { lat: 43.8256, lng: 87.6168 }
  };

  function spotList(spots) {
    return Array.isArray(spots) ? spots : [];
  }

  function cityName(spot) {
    if (!spot || spot.city === null || spot.city === undefined || spot.city === '') return null;
    var city = String(spot.city);
    return city.trim() ? city : null;
  }

  function coordinateNumber(value) {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (typeof value === 'string' && !value.trim()) return null;
    var number = Number(value);
    return isFinite(number) ? number : null;
  }

  function coordinates(lat, lng) {
    var latitude = coordinateNumber(lat);
    var longitude = coordinateNumber(lng);
    if (latitude === null || longitude === null) return null;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
    return { lat: latitude, lng: longitude };
  }

  function centerCoordinates(center) {
    if (!center || typeof center !== 'object') return null;
    return coordinates(center.lat, center.lng);
  }

  function spotCoordinates(spot) {
    if (!spot || typeof spot !== 'object') return null;
    return coordinates(spot.lat, spot.lng);
  }

  function copyCenter(center) {
    return { lat: center.lat, lng: center.lng };
  }

  function knownCenter(city) {
    if (!Object.prototype.hasOwnProperty.call(CITY_CENTERS, city)) return null;
    return CITY_CENTERS[city];
  }

  function averageCenter(city, spots) {
    var list = spotList(spots);
    var latTotal = 0;
    var lngTotal = 0;
    var count = 0;

    for (var i = 0; i < list.length; i++) {
      if (cityName(list[i]) !== city) continue;
      var point = spotCoordinates(list[i]);
      if (!point) continue;
      latTotal += point.lat;
      lngTotal += point.lng;
      count++;
    }

    if (!count) return null;
    return { lat: latTotal / count, lng: lngTotal / count };
  }

  function listCities(spots) {
    var list = spotList(spots);
    var present = [];

    for (var i = 0; i < list.length; i++) {
      var city = cityName(list[i]);
      if (city !== null && present.indexOf(city) === -1) present.push(city);
    }

    var cities = [];
    for (var j = 0; j < CITY_ORDER.length; j++) {
      if (present.indexOf(CITY_ORDER[j]) !== -1) cities.push(CITY_ORDER[j]);
    }
    for (var k = 0; k < present.length; k++) {
      if (CITY_ORDER.indexOf(present[k]) === -1) cities.push(present[k]);
    }
    return cities;
  }

  function centerForCity(city, spots) {
    if (city === 'all' || city === null || city === undefined || city === '') {
      return copyCenter(DEFAULT_CENTER);
    }

    var name = String(city);
    var known = knownCenter(name);
    if (known) return copyCenter(known);

    var average = averageCenter(name, spots);
    return average ? average : copyCenter(DEFAULT_CENTER);
  }

  function nearestCity(lat, lng, spots) {
    var center = coordinates(lat, lng);
    if (!center) return null;

    var cities = listCities(spots);
    var nearest = null;
    var shortest = null;

    for (var i = 0; i < cities.length; i++) {
      var anchor = knownCenter(cities[i]) || averageCenter(cities[i], spots);
      if (!anchor) continue;

      var distance = window.W.UI.distanceKm(center.lat, center.lng, anchor.lat, anchor.lng);
      if (typeof distance !== 'number' || !isFinite(distance)) continue;
      if (shortest === null || distance < shortest) {
        nearest = cities[i];
        shortest = distance;
      }
    }

    return nearest;
  }

  function cloneSpot(spot) {
    var clone = {};
    if (!spot || typeof spot !== 'object') return clone;
    Object.keys(spot).forEach(function (key) {
      clone[key] = spot[key];
    });
    return clone;
  }

  function createdTime(spot) {
    if (!spot || spot.createdAt === null || spot.createdAt === undefined || spot.createdAt === '') {
      return null;
    }
    var time = new Date(spot.createdAt).getTime();
    return isNaN(time) ? null : time;
  }

  function rankByDistance(spots, center) {
    var list = spotList(spots);
    var validCenter = centerCoordinates(center);

    var ranked = list.map(function (spot, index) {
      var clone = cloneSpot(spot);
      var point = validCenter ? spotCoordinates(spot) : null;
      clone.distKm = point
        ? window.W.UI.distanceKm(validCenter.lat, validCenter.lng, point.lat, point.lng)
        : null;
      return {
        spot: clone,
        distance: clone.distKm,
        createdAt: createdTime(spot),
        index: index
      };
    });

    if (!validCenter) {
      return ranked.map(function (item) { return item.spot; });
    }

    ranked.sort(function (a, b) {
      var aValid = typeof a.distance === 'number' && isFinite(a.distance);
      var bValid = typeof b.distance === 'number' && isFinite(b.distance);
      if (aValid !== bValid) return aValid ? -1 : 1;

      if (aValid && a.distance !== b.distance) return a.distance - b.distance;

      if (a.createdAt !== b.createdAt) {
        if (a.createdAt === null) return 1;
        if (b.createdAt === null) return -1;
        return b.createdAt - a.createdAt;
      }

      var aId = a.spot.id === null || a.spot.id === undefined ? '' : String(a.spot.id);
      var bId = b.spot.id === null || b.spot.id === undefined ? '' : String(b.spot.id);
      if (aId !== bId) return aId < bId ? -1 : 1;
      return a.index - b.index;
    });

    return ranked.map(function (item) { return item.spot; });
  }

  /* 跨页内存定位会话：不写 localStorage、不发网络（契约 C-LOCATION-SESSION@1） */
  var session = { city: null, lat: null, lng: null, located: false };

  function normalizeSessionCity(city) {
    if (typeof city !== 'string') return null;
    if (city === '' || city === 'all') return null;
    return city;
  }

  function getSession() {
    return { city: session.city, lat: session.lat, lng: session.lng, located: session.located };
  }

  function setSession(next) {
    var input = next && typeof next === 'object' ? next : {};
    var city = normalizeSessionCity(input.city);
    var point = coordinates(input.lat, input.lng);
    session = {
      city: city,
      lat: point ? point.lat : null,
      lng: point ? point.lng : null,
      located: !!(city && point && input.located)
    };
    try {
      if (window.W.App && typeof window.W.App.syncLocationCity === 'function') {
        window.W.App.syncLocationCity();
      }
    } catch (e) {}
    return getSession();
  }

  function currentCity(fallback) {
    return session.city || fallback || DEFAULT_CITY;
  }

  window.W.Location = {
    DEFAULT_CITY: DEFAULT_CITY,
    DEFAULT_CENTER: DEFAULT_CENTER,
    CITY_ORDER: CITY_ORDER,
    CITY_CENTERS: CITY_CENTERS,
    listCities: listCities,
    centerForCity: centerForCity,
    nearestCity: nearestCity,
    rankByDistance: rankByDistance,
    getSession: getSession,
    setSession: setSession,
    currentCity: currentCity
  };
})(window);