window.W = window.W || {};
window.W.Views = window.W.Views || {};

(function () {
  'use strict';

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function currentCitySafe(fallback) {
    try {
      if (W.Location && typeof W.Location.currentCity === 'function') {
        return W.Location.currentCity(fallback);
      }
    } catch (err) {}
    return fallback;
  }

  function toNumber(value) {
    var raw = trim(value);
    if (raw === '') return NaN;
    return Number(raw);
  }

  function parseTags(value) {
    return trim(value)
      .split(/[,，]/)
      .map(function (tag) { return tag.trim(); })
      .filter(function (tag) { return tag.length > 0; });
  }

  function sectionHead(UI, no, title, en, extra) {
    var head = UI.el('div', { class: 'form-section-head' }, [
      UI.el('span', { class: 'form-section-no' }, no),
      UI.el('h2', { class: 'form-section-title' }, title),
      UI.el('span', { class: 'form-section-en' }, en)
    ]);
    if (extra) head.appendChild(extra);
    return head;
  }

  W.Views.publish = {
    render: function (root) {
      var UI = W.UI;
      var Store = W.Store;

      var state = { category: '', images: [] };

      var titleInput = UI.el('input', { class: 'input', type: 'text', placeholder: '例如：西湖边的宝藏咖啡馆' });
      var cityInput = UI.el('input', { class: 'input', type: 'text', placeholder: '城市', value: currentCitySafe('广州') });
      var addressInput = UI.el('input', { class: 'input', type: 'text', placeholder: '详细地址' });
      var latInput = UI.el('input', { class: 'input', type: 'text', placeholder: '30.2741' });
      var lngInput = UI.el('input', { class: 'input', type: 'text', placeholder: '120.1551' });
      var priceInput = UI.el('input', { class: 'input', type: 'number', min: '0', placeholder: '0 表示免费', value: '0' });
      var descArea = UI.el('textarea', { class: 'input', rows: '4', placeholder: '说说这里有什么好玩的、适合什么时候来…' });
      var tagsInput = UI.el('input', { class: 'input', type: 'text', placeholder: '用逗号分隔，如：免费,适合拍照' });

      var titleError = UI.el('div', { class: 'field-error' }, '');
      var categoryError = UI.el('div', { class: 'field-error' }, '');
      var addressError = UI.el('div', { class: 'field-error' }, '');
      var coordsError = UI.el('div', { class: 'field-error' }, '');
      var priceError = UI.el('div', { class: 'field-error' }, '');

      function showFieldError(node, msg) {
        node.textContent = msg || '';
        node.classList.toggle('is-visible', !!msg);
      }
      function clearFieldErrors() {
        [titleError, categoryError, addressError, coordsError, priceError].forEach(function (node) {
          showFieldError(node, '');
        });
      }

      var categoryChips = UI.categories
        .filter(function (item) { return item.key !== 'all'; })
        .map(function (item) {
          var chip = UI.el('button', { type: 'button', class: 'chip' }, item.name);
          chip.addEventListener('click', function () {
            state.category = item.key;
            categoryChips.forEach(function (other) {
              other.classList.toggle('is-active', other === chip);
            });
            showFieldError(categoryError, '');
            refreshPreview();
          });
          return chip;
        });

      var picNote = UI.el('span', { class: 'form-section-note' }, '已选 0 张');
      var picGrid = UI.el('div', { class: 'pic-grid pic-grid--publish' });
      var picGridWrap = UI.el('div', { class: 'v17-pic-grid-wrap' }, [picGrid]);

      var previewCover = UI.el('div', { class: 'v17-preview-cover' }, [
        UI.el('span', { class: 'v17-preview-stamp', 'aria-hidden': 'true' }, '投稿')
      ]);
      var previewTitle = UI.el('h2', { class: 'v17-preview-title' }, '一个还没写名字的地方');
      var previewMeta = UI.el('p', { class: 'v17-preview-meta' }, '广州 · 分类待选 · 免费');
      var preview = UI.el('section', { class: 'v17-publish-preview' }, [
        previewCover,
        UI.el('div', { class: 'v17-preview-body' }, [
          UI.el('p', { class: 'v17-preview-caption' }, 'LIVE PREVIEW · 你的投稿卡'),
          previewTitle,
          previewMeta
        ])
      ]);

      function refreshPreview() {
        var title = trim(titleInput.value);
        var city = trim(cityInput.value) || currentCitySafe('广州');
        var price = trim(priceInput.value) === '' ? 0 : toNumber(priceInput.value);
        previewTitle.textContent = title || '一个还没写名字的地方';
        previewMeta.textContent = city + ' · ' + (state.category ? UI.categoryName(state.category) : '分类待选') + ' · ' +
          (!isFinite(price) || price <= 0 ? '免费' : '¥' + price);
        if (state.images[0]) {
          previewCover.style.backgroundImage = 'url("' + state.images[0] + '")';
          previewCover.classList.add('has-image');
        } else {
          previewCover.style.backgroundImage = '';
          previewCover.classList.remove('has-image');
        }
      }

      titleInput.addEventListener('input', refreshPreview);
      cityInput.addEventListener('input', refreshPreview);
      priceInput.addEventListener('input', refreshPreview);

      var MAX_PHOTOS = 9;
      var picCells = [];

      function registerPicCell(url, cell) {
        picCells.push({ el: cell, url: url });
      }

      UI.pics.forEach(function (url, index) {
        var cell = UI.el('button', {
          class: 'pic-cell',
          type: 'button',
          'aria-label': '内置图库图片 ' + (index + 1)
        }, [
          UI.el('img', { src: url, alt: '内置图库图片 ' + (index + 1), loading: 'lazy' }),
          UI.el('span', { class: 'pic-check' }, '✓'),
          UI.el('span', { class: 'pic-order' }, '')
        ]);
        cell.addEventListener('click', function () {
          var at = state.images.indexOf(url);
          if (at >= 0) state.images.splice(at, 1);
          else {
            if (state.images.length >= MAX_PHOTOS) {
              UI.toast('最多选择 ' + MAX_PHOTOS + ' 张照片', 'error');
              return;
            }
            state.images.push(url);
          }
          syncPics();
        });
        picGrid.appendChild(cell);
        registerPicCell(url, cell);
      });

      var uploadInput = UI.el('input', {
        type: 'file',
        accept: 'image/*',
        multiple: '',
        class: 'v17-pic-file',
        'aria-label': '选择本地照片'
      });
      var uploadTile = UI.el('button', {
        type: 'button',
        class: 'pic-cell v17-pic-add',
        'aria-label': '添加本地照片'
      }, [
        UI.el('span', { class: 'v17-pic-add-plus', 'aria-hidden': 'true' }, '+'),
        UI.el('span', { class: 'v17-pic-add-label' }, '添加照片')
      ]);
      uploadTile.addEventListener('click', function () {
        if (uploadTile.classList.contains('is-loading')) return;
        if (state.images.length >= MAX_PHOTOS) {
          UI.toast('最多选择 ' + MAX_PHOTOS + ' 张照片', 'error');
          return;
        }
        uploadInput.click();
      });
      uploadInput.addEventListener('change', handleUpload);
      picGrid.appendChild(uploadInput);
      picGridWrap.appendChild(uploadTile);

      function addCustomCell(url) {
        var cell = UI.el('button', {
          class: 'pic-cell v17-custom-pic',
          type: 'button',
          'aria-label': '已上传照片'
        }, [
          UI.el('img', { src: url, alt: '已上传照片' }),
          UI.el('span', { class: 'pic-check' }, '✓'),
          UI.el('span', { class: 'pic-order' }, ''),
          UI.el('span', { class: 'v17-pic-remove', 'aria-hidden': 'true' }, '×')
        ]);
        cell.addEventListener('click', function (event) {
          if (event.target && event.target.classList && event.target.classList.contains('v17-pic-remove')) {
            event.preventDefault();
            event.stopPropagation();
            var removeAt = state.images.indexOf(url);
            if (removeAt >= 0) state.images.splice(removeAt, 1);
            for (var i = picCells.length - 1; i >= 0; i--) {
              if (picCells[i].url === url) {
                picCells.splice(i, 1);
                break;
              }
            }
            cell.remove();
            syncPics();
            return;
          }
          var at = state.images.indexOf(url);
          if (at >= 0) state.images.splice(at, 1);
          else {
            if (state.images.length >= MAX_PHOTOS) {
              UI.toast('最多选择 ' + MAX_PHOTOS + ' 张照片', 'error');
              return;
            }
            state.images.push(url);
          }
          syncPics();
        });
        picGrid.appendChild(cell);
        registerPicCell(url, cell);
      }

      function readAndCompress(file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () {
            var image = new Image();
            image.onload = function () {
              var maxSide = 1280;
              var scale = Math.min(1, maxSide / Math.max(image.width, image.height));
              var canvas = document.createElement('canvas');
              canvas.width = Math.max(1, Math.round(image.width * scale));
              canvas.height = Math.max(1, Math.round(image.height * scale));
              var ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(reader.result);
                return;
              }
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              try {
                resolve(canvas.toDataURL('image/jpeg', 0.82));
              } catch (err) {
                resolve(reader.result);
              }
            };
            image.onerror = function () { reject(new Error('图片读取失败')); };
            image.src = reader.result;
          };
          reader.onerror = function () { reject(new Error('文件读取失败')); };
          reader.readAsDataURL(file);
        });
      }

      function handleUpload() {
        var files = Array.prototype.slice.call(uploadInput.files || []);
        uploadInput.value = '';
        if (!files.length) return;
        var room = MAX_PHOTOS - state.images.length;
        if (room <= 0) {
          UI.toast('最多选择 ' + MAX_PHOTOS + ' 张照片', 'error');
          return;
        }
        if (files.length > room) {
          files = files.slice(0, room);
          UI.toast('最多还能添加 ' + room + ' 张照片', 'error');
        }
        uploadTile.classList.add('is-loading');
        Promise.all(files.map(readAndCompress)).then(function (urls) {
          urls.forEach(function (url) {
            addCustomCell(url);
            state.images.push(url);
          });
          syncPics();
          UI.toast('已添加 ' + urls.length + ' 张照片', 'ok');
        }).catch(function () {
          UI.toast('照片读取失败，请换一张试试', 'error');
        }).then(function () {
          uploadTile.classList.remove('is-loading');
        });
      }

      function syncPics() {
        picCells.forEach(function (cell) {
          var index = state.images.indexOf(cell.url);
          cell.el.classList.toggle('is-selected', index >= 0);
          var order = cell.el.querySelector('.pic-order');
          if (order) order.textContent = index >= 0 ? String(index + 1).padStart(2, '0') : '';
        });
        picNote.textContent = '已选 ' + state.images.length + ' 张';
        refreshPreview();
      }
      syncPics();

      var locateBtn = UI.el('button', {
        type: 'button',
        class: 'publish-locate-btn',
        'aria-label': '使用当前位置自动填写详细地址和坐标'
      }, '定位');
      locateBtn.addEventListener('click', function () {
        if (!navigator.geolocation) {
          UI.toast('当前浏览器不支持定位，请手动填写地址和坐标', 'error');
          return;
        }
        locateBtn.disabled = true;
        navigator.geolocation.getCurrentPosition(function (pos) {
          var latitude = pos.coords.latitude;
          var longitude = pos.coords.longitude;
          latInput.value = latitude.toFixed(4);
          lngInput.value = longitude.toFixed(4);
          showFieldError(coordsError, '');
          W.MapView.reverseGeocode(latitude, longitude).then(function (address) {
            addressInput.value = address;
            showFieldError(addressError, '');
            locateBtn.disabled = false;
            UI.toast('已自动填写详细地址和坐标', 'ok');
          }, function () {
            locateBtn.disabled = false;
            showFieldError(addressError, '请手动填写详细地址');
            UI.toast('地址解析失败，请手动填写详细地址', 'error');
          });
        }, function () {
          locateBtn.disabled = false;
          UI.toast('定位失败，请手动填写地址和坐标', 'error');
        }, { timeout: 5000 });
      });

      var submitBtn = UI.el('button', { type: 'button', class: 'btn btn-primary btn-block publish-submit' }, '发布地点');

      function collectErrors() {
        var list = [];
        var title = trim(titleInput.value);
        if (title.length < 2 || title.length > 40) list.push([titleError, '地点名称需为 2-40 个字符']);
        if (!state.category) list.push([categoryError, '请选择分类']);
        if (!trim(addressInput.value)) list.push([addressError, '请填写地址']);

        var lat = toNumber(latInput.value);
        var lng = toNumber(lngInput.value);
        if (!isFinite(lat) || !isFinite(lng)) list.push([coordsError, '请填写经纬度坐标']);
        else if (lat < -90 || lat > 90) list.push([coordsError, '纬度需为 -90 ~ 90 之间的数字']);
        else if (lng < -180 || lng > 180) list.push([coordsError, '经度需为 -180 ~ 180 之间的数字']);

        var price = trim(priceInput.value) === '' ? 0 : toNumber(priceInput.value);
        if (!isFinite(price) || price < 0) list.push([priceError, '价格需为不小于 0 的数字']);
        return list;
      }

      submitBtn.addEventListener('click', function () {
        if (submitBtn.disabled) return;
        clearFieldErrors();
        var errors = collectErrors();
        if (errors.length) {
          errors.forEach(function (item) { showFieldError(item[0], item[1]); });
          UI.toast(errors[0][1], 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '发布中…';

        try {
          var spot = Store.addSpot({
            title: trim(titleInput.value),
            category: state.category,
            city: trim(cityInput.value) || currentCitySafe('广州'),
            address: trim(addressInput.value),
            lat: toNumber(latInput.value),
            lng: toNumber(lngInput.value),
            price: trim(priceInput.value) === '' ? 0 : toNumber(priceInput.value),
            cover: state.images[0] || '',
            images: state.images.slice(),
            description: trim(descArea.value),
            tags: parseTags(tagsInput.value)
          });
          UI.toast('发布成功', 'ok');
          W.Router.go('#/spot/' + spot.id);
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = '发布地点';
          UI.toast('发布失败：' + (err && err.message ? err.message : '未知错误'), 'error');
        }
      });

      var page = UI.el('div', { class: 'page publish-page gz-page gz-publish' });

      page.appendChild(UI.el('header', { class: 'page-head v17-hero v17-hero--publish' }, [
        UI.el('div', { class: 'page-kicker' }, 'CONTRIBUTE · 城市投稿'),
        UI.el('h1', { class: 'page-title' }, ['发布一个', UI.el('br', null, null), '好玩的地方']),
        UI.el('p', { class: 'page-deck' }, '把你私藏的地点写进这本城市手册。真实、具体、有细节，比滤镜更重要。'),
        UI.el('div', { class: 'v17-hero-foot' }, [
          UI.el('span', {}, 'OPEN CALL · 2026'),
          UI.el('span', { class: 'v17-hero-foot-line', 'aria-hidden': 'true' }),
          UI.el('span', {}, '写下来，就是一本城市手册')
        ])
      ]));

      page.appendChild(preview);

      page.appendChild(UI.el('section', { class: 'form-section' }, [
        sectionHead(UI, '01', '基本信息', 'BASICS'),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '地点名称'),
          titleInput,
          titleError
        ]),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '分类'),
          UI.el('div', { class: 'chip-row chip-row--wrap' }, categoryChips),
          categoryError
        ]),
        UI.el('div', { class: 'grid-2' }, [
          UI.el('div', { class: 'field' }, [
            UI.el('label', { class: 'field-label' }, '城市'),
            cityInput
          ]),
          UI.el('div', { class: 'field' }, [
            UI.el('label', { class: 'field-label' }, '价格（元）'),
            priceInput,
            priceError
          ])
        ])
      ]));

      page.appendChild(UI.el('section', { class: 'form-section' }, [
        sectionHead(UI, '02', '位置', 'LOCATION', locateBtn),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '地址'),
          addressInput,
          addressError
        ]),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '经纬度'),
          UI.el('div', { class: 'grid-2' }, [
            UI.el('div', { class: 'field field--tight' }, [
              UI.el('label', { class: 'field-label field-label--small' }, '纬度 LAT'),
              latInput
            ]),
            UI.el('div', { class: 'field field--tight' }, [
              UI.el('label', { class: 'field-label field-label--small' }, '经度 LNG'),
              lngInput
            ])
          ]),
          coordsError
        ])
      ]));

      page.appendChild(UI.el('section', { class: 'form-section' }, [
        sectionHead(UI, '03', '图片', 'PHOTOS', picNote),
        picGridWrap
      ]));

      page.appendChild(UI.el('section', { class: 'form-section' }, [
        sectionHead(UI, '04', '描述与标签', 'STORY'),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '描述'),
          descArea
        ]),
        UI.el('div', { class: 'field' }, [
          UI.el('label', { class: 'field-label' }, '标签'),
          tagsInput
        ])
      ]));

      page.appendChild(UI.el('div', { class: 'form-actions' }, [
        submitBtn
      ]));

      root.appendChild(page);
    }
  };
})();
