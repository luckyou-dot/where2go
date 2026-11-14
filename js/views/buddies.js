(function () {
  'use strict';

  var W = window.W = window.W || {};
  W.Views = W.Views || {};

  var MAX_DOTS = 4;

  var BUDDY_TYPE_EN = {
    meal: 'MEAL',
    play: 'PLAY',
    travel: 'TRIP',
    sport: 'SPORT',
    other: 'OTHER'
  };

  function fieldRow(UI, label, control) {
    var box = UI.el('div', { class: 'field' });
    box.appendChild(UI.el('label', { class: 'field-label' }, label));
    box.appendChild(control);
    return box;
  }

  function statusInfo(buddy) {
    var memberCount = (buddy.memberIds || []).length;
    if (buddy.status === 'done') return { cls: 'is-done', text: '已结束' };
    if (buddy.status === 'full' || memberCount >= buddy.maxPeople) return { cls: 'is-full', text: '已满员' };
    return { cls: 'is-open', text: '可加入' };
  }

  function memberStack(UI, usersMap, buddy) {
    var ids = buddy.memberIds || [];
    var shown = ids.slice(0, MAX_DOTS);
    var wrap = UI.el('div', { class: 'member-stack' });
    shown.forEach(function (uid) {
      var user = usersMap[uid] || { avatar: '🙂' };
      wrap.appendChild(UI.el('span', { class: 'member-dot', title: user.name || '' }, user.avatar || '🙂'));
    });
    var rest = ids.length - shown.length;
    if (rest > 0) wrap.appendChild(UI.el('span', { class: 'member-more' }, '+' + rest));
    return wrap;
  }

  function buildBuddyCard(UI, usersMap, spotsMap, buddy) {
    var st = statusInfo(buddy);
    var memberCount = (buddy.memberIds || []).length;
    var date = new Date(buddy.meetAt);
    var month = isNaN(date.getTime()) ? '--' : String(date.getMonth() + 1).padStart(2, '0');
    var day = isNaN(date.getTime()) ? '--' : String(date.getDate()).padStart(2, '0');
    var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var spot = buddy.spotId ? spotsMap[buddy.spotId] : null;
    var card = UI.el('article', { class: 'buddy-card v17-buddy-card', dataset: { buddyId: buddy.id } });

    var dateBlock = UI.el('div', { class: 'v17-buddy-date' }, [
      UI.el('span', { class: 'v17-buddy-month' }, month + '月'),
      UI.el('strong', { class: 'v17-buddy-day' }, day),
      UI.el('span', { class: 'v17-buddy-week' }, isNaN(date.getTime()) ? '时间待定' : weekdays[date.getDay()])
    ]);

    var main = UI.el('div', { class: 'v17-buddy-main' });
    main.appendChild(UI.el('div', { class: 'buddy-card-top' }, [
      UI.el('span', { class: 'buddy-type' }, [
        UI.el('span', { class: 'buddy-type-en' }, BUDDY_TYPE_EN[buddy.type] || 'MEET'),
        UI.el('span', { class: 'buddy-type-zh' }, UI.buddyTypeName(buddy.type) || buddy.type)
      ]),
      UI.el('span', { class: 'buddy-status ' + st.cls }, [
        UI.el('i', { class: 'status-dot' }, ''),
        st.text
      ])
    ]));

    main.appendChild(UI.el('h3', { class: 'buddy-card-title' }, buddy.title));

    main.appendChild(UI.el('div', { class: 'buddy-card-info' }, [
      UI.el('div', { class: 'buddy-info-row' }, [
        UI.el('span', { class: 'info-k' }, 'TIME'),
        UI.el('span', { class: 'info-v' }, UI.dateTime(buddy.meetAt))
      ]),
      UI.el('div', { class: 'buddy-info-row' }, [
        UI.el('span', { class: 'info-k' }, 'MEET'),
        UI.el('span', { class: 'info-v' }, buddy.meetPlace)
      ]),
      spot ? UI.el('div', { class: 'v17-buddy-spot' }, [
        UI.el('span', { class: 'v17-buddy-spot-icon', 'aria-hidden': 'true' }),
        UI.el('span', {}, spot.title)
      ]) : null
    ]));

    main.appendChild(UI.el('div', { class: 'buddy-card-foot' }, [
      memberStack(UI, usersMap, buddy),
      UI.el('span', { class: 'buddy-member-count' }, memberCount + ' / ' + buddy.maxPeople + ' 人'),
      UI.el('span', { class: 'buddy-card-cta' + (st.cls !== 'is-open' ? ' is-disabled' : '') },
        st.cls !== 'is-open' ? '已满员' : '查看 →')
    ]));

    card.appendChild(dateBlock);
    card.appendChild(main);

    card.addEventListener('click', function () {
      W.Router.go('#/buddy/' + buddy.id);
    });
    return card;
  }

  W.Views.buddies = {
    render: function (root) {
      var UI = W.UI;
      var Store = W.Store;
      var st = { type: 'all', q: '', formOpen: false, formType: 'play', formCity: '' };

      var usersMap = {};
      (Store.listUsers() || []).forEach(function (u) {
        usersMap[u.id] = u;
      });
      var spotsMap = {};
      (Store.listSpots({}) || []).forEach(function (spot) {
        spotsMap[spot.id] = spot;
      });
      var openCount = (Store.listBuddies({}) || []).filter(function (b) { return b.status !== 'done'; }).length;

      var page = UI.el('div', { class: 'page buddies-page gz-page gz-buddies' });

      page.appendChild(UI.el('header', { class: 'page-head v17-hero v17-hero--buddies' }, [
        UI.el('div', { class: 'page-kicker' }, 'SOCIAL CLUB · 一起出门'),
        UI.el('h1', { class: 'page-title' }, '搭子广场'),
        UI.el('p', { class: 'page-deck' }, '一个人出门是散步，两个人出发才叫旅行。找个同频的人，一起把周末过掉。'),
        UI.el('div', { class: 'v17-hero-foot' }, [
          UI.el('span', {}, String(openCount).padStart(2, '0') + ' 个进行中'),
          UI.el('span', { class: 'v17-hero-foot-line', 'aria-hidden': 'true' }),
          UI.el('span', {}, '本周 · 一起出门')
        ])
      ]));

      var matchStrip = UI.el('button', { type: 'button', class: 'v22-match-strip' }, [
        UI.el('span', { class: 'v22-match-strip-kicker' }, 'MATCHMAKER · 搭子匹配'),
        UI.el('strong', { class: 'v22-match-strip-title' }, '30 秒，找到同频的人。'),
        UI.el('span', { class: 'v22-match-strip-arrow', 'aria-hidden': 'true' }, '↗')
      ]);
      matchStrip.addEventListener('click', openMatch);
      page.appendChild(matchStrip);

      var toolbar = UI.el('div', { class: 'buddies-toolbar' });
      var searchInput = UI.el('input', { class: 'search-input', type: 'search', placeholder: '搜索标题 / 地点 / 备注' });
      searchInput.addEventListener('input', function () {
        st.q = searchInput.value || '';
        renderList();
      });
      toolbar.appendChild(UI.el('div', { class: 'search-field' }, [
        UI.el('span', { class: 'search-icon' }, UI.icon('search')),
        searchInput
      ]));
      var entryBtn = UI.el('button', { type: 'button', class: 'btn btn-primary buddies-entry' }, '＋ 发起搭子');
      toolbar.appendChild(entryBtn);
      page.appendChild(toolbar);

      var formWrap = UI.el('div', { class: 'buddy-form-wrap', style: 'display:none' });
      page.appendChild(formWrap);

      var formBuilt = false;

      function openForm(prefill) {
        st.formOpen = true;
        if (prefill) {
          st.formType = prefill.type || st.formType;
          st.formCity = prefill.city || '';
          formWrap.innerHTML = '';
          formBuilt = false;
        }
        if (!formBuilt) {
          buildForm();
          formBuilt = true;
        }
        formWrap.style.display = 'block';
        entryBtn.textContent = '收起表单 ×';
        if (formWrap.scrollIntoView) formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      entryBtn.addEventListener('click', function () {
        if (st.formOpen) {
          st.formOpen = false;
          formWrap.style.display = 'none';
          entryBtn.textContent = '＋ 发起搭子';
          return;
        }
        openForm();
      });

      var filterBar = UI.el('div', { class: 'buddy-filter' });
      filterBar.appendChild(UI.el('span', { class: 'filter-label' }, '按类型'));
      var typeRow = UI.el('div', { class: 'chip-row' });
      filterBar.appendChild(typeRow);
      page.appendChild(filterBar);

      var countEl = UI.el('div', { class: 'buddy-count' }, '');
      var listWrap = UI.el('div', { class: 'buddy-list' });
      page.appendChild(countEl);
      page.appendChild(listWrap);

      function paintTypeChips() {
        typeRow.innerHTML = '';
        [{ key: 'all', name: '全部' }].concat(UI.buddyTypes || []).forEach(function (t) {
          var chip = UI.el('button', { type: 'button', class: 'chip' + (st.type === t.key ? ' is-active' : '') }, t.name);
          chip.addEventListener('click', function () {
            st.type = t.key;
            paintTypeChips();
            renderList();
          });
          typeRow.appendChild(chip);
        });
      }

      function renderList() {
        var list = Store.listBuddies({ q: st.q, type: st.type === 'all' ? undefined : st.type }) || [];
        countEl.textContent = String(list.length).padStart(2, '0') + ' 个进行中的搭子';
        listWrap.innerHTML = '';
        if (!list.length) {
          listWrap.appendChild(UI.empty(
            '暂无搭子',
            (st.q || st.type !== 'all') ? '换个关键词或类型试试' : '点击「发起搭子」成为第一个发起人',
            '', null
          ));
          return;
        }
        list.forEach(function (buddy) {
          listWrap.appendChild(buildBuddyCard(UI, usersMap, spotsMap, buddy));
        });
      }

      function openMatch() {
        if (document.querySelector('.v22-match-overlay')) return;

        var me = Store.getCurrentUser() || { city: '' };
        var cities = [];
        try {
          if (W.Location && typeof W.Location.listCities === 'function') {
            cities = W.Location.listCities(Store.listSpots({})) || [];
          }
        } catch (e) { cities = []; }
        if (!cities.length) cities = [me.city || '杭州'];
        var state = { type: 'meal', city: me.city || cities[0], persona: 'planner' };
        if (cities.indexOf(state.city) < 0) state.city = cities[0];

        var personas = [
          { key: 'planner', name: '计划控', desc: '路线和时间都要刚刚好' },
          { key: 'easy', name: '随性派', desc: '走到哪算哪，松弛感优先' },
          { key: 'social', name: '气氛组', desc: '人多才热闹，聊天不冷场' },
          { key: 'quiet', name: '安静陪伴', desc: '不赶场，也可以不说话' }
        ];

        var previousOverflow = document.body.style.overflow;
        var overlay = UI.el('div', {
          class: 'v22-match-overlay gz-match',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': '搭子匹配问卷'
        });
        var shell = UI.el('div', { class: 'v22-match-shell' });
        overlay.appendChild(shell);

        function close() {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          document.body.style.overflow = previousOverflow;
        }

        function topBar(overline) {
          return UI.el('div', { class: 'v22-match-top' }, [
            UI.el('span', { class: 'v22-match-overline' }, overline),
            UI.el('button', {
              type: 'button',
              class: 'v22-match-close',
              'aria-label': '关闭匹配问卷',
              onClick: close
            }, '×')
          ]);
        }

        function question(no, title, body) {
          return UI.el('section', { class: 'v22-match-q' }, [
            UI.el('div', { class: 'v22-match-q-head' }, [
              UI.el('span', { class: 'v22-match-q-no' }, no),
              UI.el('div', { class: 'v22-match-q-copy' }, [
                UI.el('h3', { class: 'v22-match-q-title' }, title)
              ])
            ]),
            body
          ]);
        }

        function personaOf(key) {
          for (var i = 0; i < personas.length; i += 1) {
            if (personas[i].key === key) return personas[i];
          }
          return personas[0];
        }

        function renderForm() {
          shell.innerHTML = '';
          shell.appendChild(topBar('MATCHMAKER · 017'));
          shell.appendChild(UI.el('div', { class: 'v22-match-intro' }, [
            UI.el('span', { class: 'v22-match-intro-kicker' }, 'FIND YOUR PEOPLE · 一起出门'),
            UI.el('h2', { class: 'v22-match-intro-title' }, [
              '先回答三个问题，',
              UI.el('em', {}, '看看谁在等你。')
            ]),
            UI.el('p', { class: 'v22-match-intro-desc' }, '不填资料，不划卡片。只按城市、类型和空位，帮你找到现在就能一起出门的人。')
          ]));

          var typeRow = UI.el('div', { class: 'v22-match-chip-row' });
          var typeChips = [];
          function paintTypeChips() {
            typeChips.forEach(function (chip) {
              chip.classList.toggle('is-active', chip.dataset.value === state.type);
            });
          }
          (UI.buddyTypes || []).forEach(function (t) {
            var chip = UI.el('button', { type: 'button', class: 'v22-match-chip', dataset: { value: t.key } }, t.name);
            chip.addEventListener('click', function () {
              state.type = t.key;
              paintTypeChips();
            });
            typeChips.push(chip);
            typeRow.appendChild(chip);
          });
          paintTypeChips();
          shell.appendChild(question('01', '这次，你想找什么搭子？', typeRow));

          var citySelect = UI.el('select', { class: 'v22-match-select', 'aria-label': '选择城市' }, cities.map(function (city) {
            return UI.el('option', { value: city }, city);
          }));
          citySelect.value = state.city;
          citySelect.addEventListener('change', function () {
            state.city = citySelect.value;
          });
          shell.appendChild(question('02', '你在哪座城市？', citySelect));

          var personaRow = UI.el('div', { class: 'v22-match-chip-row v22-match-chip-row--persona' });
          var personaChips = [];
          function paintPersonaChips() {
            personaChips.forEach(function (chip) {
              chip.classList.toggle('is-active', chip.dataset.value === state.persona);
            });
          }
          personas.forEach(function (persona) {
            var chip = UI.el('button', { type: 'button', class: 'v22-match-chip', dataset: { value: persona.key } }, [
              UI.el('strong', { class: 'v22-match-chip-name' }, persona.name),
              UI.el('span', { class: 'v22-match-chip-desc' }, persona.desc)
            ]);
            chip.addEventListener('click', function () {
              state.persona = persona.key;
              paintPersonaChips();
            });
            personaChips.push(chip);
            personaRow.appendChild(chip);
          });
          paintPersonaChips();
          shell.appendChild(question('03', '你是哪种搭子？', personaRow));

          var submit = UI.el('button', { type: 'button', class: 'btn btn-primary btn-block v22-match-submit' }, '生成匹配 →');
          submit.addEventListener('click', renderResults);
          shell.appendChild(submit);
        }

        function scoreBuddy(buddy) {
          var score = 0;
          var reasons = [];
          if (buddy.type === state.type) {
            score += 45;
            reasons.push('同类型');
          }
          if (buddy.city === state.city) {
            score += 30;
            reasons.push('同城');
          }
          var st = statusInfo(buddy);
          if (st.cls === 'is-open') score += 15;
          var text = String(buddy.title || '') + ' ' + String(buddy.note || '');
          var persona = personaOf(state.persona);
          var keywordHit = {
            planner: /计划|安排|攻略|准时|路线/,
            easy: /随性|随意|慢慢|不赶|松弛/,
            social: /热闹|气氛|聊天|认识|一起/,
            quiet: /安静|人少|不吵|陪伴/
          }[state.persona];
          if (keywordHit && keywordHit.test(text)) {
            score += 10;
            reasons.push(persona.name + '友好');
          }
          var meetTs = new Date(buddy.meetAt).getTime();
          if (isFinite(meetTs) && meetTs > Date.now() && meetTs <= Date.now() + 14 * 24 * 60 * 60 * 1000) {
            score += 8;
            reasons.push('近期可约');
          }
          return { buddy: buddy, score: score, reasons: reasons };
        }

        function renderResults() {
          var matches = (Store.listBuddies({}) || []).filter(function (buddy) {
            return statusInfo(buddy).cls === 'is-open';
          }).map(scoreBuddy).filter(function (item) {
            return item.buddy.type === state.type || item.buddy.city === state.city;
          }).sort(function (a, b) {
            return b.score - a.score;
          }).slice(0, 3);

          shell.innerHTML = '';
          shell.appendChild(topBar('MATCHED · ' + String(matches.length).padStart(2, '0') + ' RESULTS'));
          shell.appendChild(UI.el('div', { class: 'v22-match-results-head' }, [
            UI.el('span', { class: 'v22-match-intro-kicker' }, 'YOUR MATCHMAKING'),
            UI.el('h2', { class: 'v22-match-results-title' }, matches.length ? '找到 ' + matches.length + ' 个可能的搭子。' : '这一题，暂时没有答案。'),
            UI.el('p', { class: 'v22-match-intro-desc' }, '按同城、类型、空位和时间排序；点开就能看到完整的搭子信息。')
          ]));

          var persona = personaOf(state.persona);
          shell.appendChild(UI.el('div', { class: 'v22-match-persona' }, [
            UI.el('span', { class: 'v22-match-persona-kicker' }, 'YOUR MATCH TYPE'),
            UI.el('strong', { class: 'v22-match-persona-name' }, persona.name),
            UI.el('span', { class: 'v22-match-persona-desc' }, persona.desc)
          ]));

          if (matches.length) {
            var list = UI.el('div', { class: 'v22-match-list' });
            matches.forEach(function (item, index) {
              var buddy = item.buddy;
              var reason = item.reasons.length ? item.reasons.slice(0, 2).join(' · ') : '可以聊聊看';
              var card = UI.el('article', { class: 'v22-match-card', role: 'button', tabindex: '0' }, [
                UI.el('span', { class: 'v22-match-score' }, String(Math.min(99, item.score)).padStart(2, '0')),
                UI.el('div', { class: 'v22-match-card-body' }, [
                  UI.el('div', { class: 'v22-match-card-top' }, [
                    UI.el('span', { class: 'v22-match-card-type' }, UI.buddyTypeName(buddy.type) || '搭子'),
                    UI.el('span', { class: 'v22-match-card-city' }, buddy.city || '')
                  ]),
                  UI.el('h3', { class: 'v22-match-card-title' }, buddy.title),
                  UI.el('p', { class: 'v22-match-card-meta' }, UI.dateTime(buddy.meetAt) + ' · ' + (buddy.meetPlace || '地点待定')),
                  UI.el('p', { class: 'v22-match-reason' }, reason),
                  UI.el('span', { class: 'v22-match-card-count' }, (buddy.memberIds || []).length + ' / ' + buddy.maxPeople + ' 人')
                ]),
                UI.el('span', { class: 'v22-match-card-arrow' }, '→')
              ]);
              function goBuddy() {
                close();
                W.Router.go('#/buddy/' + buddy.id);
              }
              card.addEventListener('click', goBuddy);
              card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  goBuddy();
                }
              });
              list.appendChild(card);
            });
            shell.appendChild(list);
          } else {
            shell.appendChild(UI.el('div', { class: 'v22-match-empty' }, [
              UI.el('span', { class: 'v22-match-empty-mark' }, '✦'),
              UI.el('h3', { class: 'v22-match-empty-title' }, '换一个城市，或者自己发起一个。'),
              UI.el('p', { class: 'v22-match-empty-desc' }, '现在还没有完全同频的搭子，但你可以成为第一个发出邀请的人。')
            ]));
          }

          var actions = UI.el('div', { class: 'v22-match-actions' }, [
            UI.el('button', { type: 'button', class: 'btn btn-ghost', onClick: renderForm }, '重新填写'),
            UI.el('button', {
              type: 'button',
              class: 'btn btn-primary',
              onClick: function () {
                close();
                openForm({ type: state.type, city: state.city });
              }
            }, '发布同款搭子 →')
          ]);
          shell.appendChild(actions);
        }

        renderForm();
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
      }

      function buildForm() {
        var me = Store.getCurrentUser() || { city: '' };
        var form = UI.el('div', { class: 'card buddy-form' });

        form.appendChild(UI.el('div', { class: 'form-head' }, [
          UI.el('span', { class: 'section-no' }, 'NEW'),
          UI.el('h2', { class: 'form-title' }, '发起一个搭子')
        ]));

        var titleInput = UI.el('input', { class: 'input', type: 'text', maxlength: 40, placeholder: '例如：周六西湖骑行，找 2 个搭子' });

        var chipRow = UI.el('div', { class: 'chip-row' });
        function paintChips() {
          chipRow.innerHTML = '';
          (UI.buddyTypes || []).forEach(function (t) {
            var chip = UI.el('button', { type: 'button', class: 'chip' + (st.formType === t.key ? ' is-active' : '') }, t.name);
            chip.addEventListener('click', function () {
              st.formType = t.key;
              paintChips();
            });
            chipRow.appendChild(chip);
          });
        }
        paintChips();

        var cityInput = UI.el('input', { class: 'input', type: 'text', maxlength: 20, placeholder: '例如：杭州', value: st.formCity || me.city || '' });
        var meetInput = UI.el('input', { class: 'input', type: 'datetime-local' });
        var placeInput = UI.el('input', { class: 'input', type: 'text', maxlength: 60, placeholder: '例如：西湖文化广场地铁站 A 口' });
        var maxInput = UI.el('input', { class: 'input', type: 'number', min: 2, max: 20, value: 4 });

        var spotSelect = UI.el('select', { class: 'input' }, null);
        var defaultOption = UI.el('option', { value: '' }, null);
        defaultOption.textContent = '不关联地点';
        spotSelect.appendChild(defaultOption);
        (Store.listSpots({}) || []).forEach(function (spot) {
          var option = UI.el('option', { value: spot.id }, null);
          option.textContent = spot.title;
          spotSelect.appendChild(option);
        });

        var noteInput = UI.el('textarea', { class: 'input', maxlength: 200, rows: '3', placeholder: '行程安排、装备要求、AA 方式等（选填）' });
        var submitBtn = UI.el('button', { type: 'button', class: 'btn btn-primary btn-block' }, '发布搭子');

        form.appendChild(fieldRow(UI, '标题', titleInput));
        form.appendChild(fieldRow(UI, '类型', chipRow));
        form.appendChild(fieldRow(UI, '城市', cityInput));
        form.appendChild(fieldRow(UI, '集合时间', meetInput));
        form.appendChild(fieldRow(UI, '集合地点', placeInput));
        form.appendChild(fieldRow(UI, '人数上限', maxInput));
        form.appendChild(fieldRow(UI, '关联地点', spotSelect));
        form.appendChild(fieldRow(UI, '备注', noteInput));
        form.appendChild(submitBtn);
        formWrap.appendChild(form);

        submitBtn.addEventListener('click', function () {
          var title = (titleInput.value || '').trim();
          if (!title) {
            UI.toast('请填写搭子标题', 'error');
            titleInput.focus();
            return;
          }
          var meetRaw = meetInput.value || '';
          if (!meetRaw) {
            UI.toast('请选择集合时间', 'error');
            return;
          }
          var meetTs = new Date(meetRaw).getTime();
          if (!isFinite(meetTs)) {
            UI.toast('集合时间格式不正确', 'error');
            return;
          }
          if (meetTs <= Date.now()) {
            UI.toast('集合时间需晚于当前时间', 'error');
            return;
          }
          var place = (placeInput.value || '').trim();
          if (!place) {
            UI.toast('请填写集合地点', 'error');
            placeInput.focus();
            return;
          }
          var maxPeople = parseInt(maxInput.value, 10);
          if (!isFinite(maxPeople) || maxPeople < 2 || maxPeople > 20) {
            UI.toast('人数上限需在 2–20 之间', 'error');
            return;
          }

          submitBtn.disabled = true;
          try {
            var buddy = Store.addBuddy({
              title: title,
              type: st.formType,
              city: (cityInput.value || '').trim(),
              meetAt: new Date(meetTs).toISOString(),
              meetPlace: place,
              spotId: spotSelect.value || null,
              maxPeople: maxPeople,
              note: (noteInput.value || '').trim()
            });
            UI.toast('搭子发布成功', 'ok');
            W.Router.go('#/buddy/' + buddy.id);
          } catch (e) {
            submitBtn.disabled = false;
            UI.toast('发布失败，请检查输入后重试', 'error');
          }
        });
      }

      paintTypeChips();
      renderList();
      root.appendChild(page);
    }
  };
})();
