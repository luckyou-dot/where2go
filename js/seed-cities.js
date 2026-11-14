/* 城市扩展种子：重庆 / 西安 / 南京 / 武汉 / 厦门 / 青岛 / 苏州 / 天津 / 昆明 / 大理 / 丽江 / 桂林 / 三亚
   说明：新增城市地点使用 city-photos/ 中已核对地点的实景图，文案为演示数据。 */
(function (window) {
  'use strict';

  window.W = window.W || {};

  var USER_NAMES = { u1: '小来', u2: '阿茶', u3: 'Momo', u4: '大熊', u5: '阿广' };

  function minutesAgo(m) {
    return Date.now() - m * 60000;
  }

  function hoursAgo(h) {
    return Date.now() - h * 3600000;
  }

  /* 按类别给出的三句兜底评论，让每个新增地点都有可读的推荐内容 */
  var REVIEWS = {
    food: [
      ['u2', 5, '小吃密度很高，边走边吃最合适，建议空着肚子来。'],
      ['u5', 4, '周末饭点排队会久一点，错开正午体验更好。'],
      ['u1', 5, '人均不贵，几个人分着点能多试几样。']
    ],
    nature: [
      ['u1', 5, '傍晚的风很舒服，沿步道慢慢走一圈很治愈。'],
      ['u4', 4, '树荫多、视野开阔，记得穿舒服的鞋，带瓶水。'],
      ['u2', 5, '适合安排半天，走累了在附近找家店坐坐正好。']
    ],
    photo: [
      ['u4', 5, '下午的光线最好，建筑和街角的层次都拍得出来。'],
      ['u1', 4, '人多的时候要等机位，建议早一点到，慢慢找角度。'],
      ['u5', 5, '不用刻意摆拍，随手一张就很有城市感。']
    ],
    night: [
      ['u4', 5, '亮灯后氛围完全不一样，建议日落前先到附近逛逛。'],
      ['u2', 4, '夜景很出片，江风有点大，带件薄外套会更舒服。'],
      ['u1', 5, '沿水边慢慢走一圈，灯光和倒影都很好看。']
    ],
    other: [
      ['u1', 5, '老街区适合慢慢逛，拐进小巷常能发现有意思的小店。'],
      ['u3', 4, '商业化不算重，走走停停比赶景点舒服。'],
      ['u5', 4, '周边吃的不少，安排成半日 citywalk 刚好。']
    ],
    fun: [
      ['u3', 5, '现场比想象中好玩，朋友一起会更热闹。'],
      ['u2', 4, '排队不算久，建议提前看一下场次和价格。'],
      ['u4', 4, '体验感不错，周边吃饭和逛街也方便。']
    ]
  };

  function makeComments(category, index, customReview, gallery) {
    var rows = (REVIEWS[category] || REVIEWS.other).slice(0, 3);
    if (customReview) rows[0] = [rows[0][0], rows[0][1], customReview];
    return rows.map(function (row, i) {
      return {
        id: 'c' + (300 + index * 3 + i),
        userId: row[0],
        userName: USER_NAMES[row[0]],
        rating: row[1],
        content: row[2],
        createdAt: minutesAgo(35 + index * 11 + i * 47),
        photos: i === 0 ? [gallery[0]] : (i === 2 && gallery[1] ? [gallery[1]] : [])
      };
    });
  }

  function makeSpot(index, item, city) {
    var gallery = item.gallery || [item.cover];
    return {
      id: 's' + (201 + index),
      title: item.title,
      category: item.category,
      city: city,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      price: item.price || 0,
      cover: item.cover,
      images: gallery,
      description: item.description,
      tags: item.tags,
      creatorId: item.creatorId || ['u1', 'u2', 'u3', 'u4', 'u5'][index % 5],
      createdAt: hoursAgo(3 + index * 2),
      views: 180 + index * 17,
      favorites: [index % 2 ? 'u3' : 'u4', 'u1'],
      likes: [index % 3 ? 'u2' : 'u5', 'u4'],
      comments: makeComments(item.category, index, item.review, gallery),
      live: [],
      warns: []
    };
  }

  var groups = [
    {
      city: '重庆',
      spots: [
        {
          title: '洪崖洞·千厮门大桥夜景', category: 'night',
          address: '渝中区嘉陵江滨江路 88 号', lat: 29.5625, lng: 106.5786, price: 0,
          cover: 'city-photos/s201.jpg', gallery: ['city-photos/s201.jpg'],
          description: '从千厮门大桥看洪崖洞的吊脚楼灯海，层层叠叠一直铺到江边；亮灯后沿江走一段，能看到桥、江和山城同时入镜。',
          tags: ['夜景', '洪崖洞', '拍照', '免费'],
          review: '亮灯后从桥面往下拍，灯海比照片还震撼；人很多，建议提前到桥上占位。'
        },
        {
          title: '解放碑·八一好吃街', category: 'food',
          address: '渝中区民权路八一好吃街', lat: 29.5576, lng: 106.5773, price: 50,
          cover: 'city-photos/s202.jpg', gallery: ['city-photos/s202.jpg'],
          description: '解放碑步行街旁的小吃街，酸辣粉、小面、冰粉和烤串一路排开，适合逛街后直接坐下来吃一轮。',
          tags: ['小吃', '解放碑', '夜宵', '酸辣粉'],
          review: '酸辣粉和小面都很香，分量不大可以一路吃过去，人均五十就能吃撑。'
        },
        {
          title: '磁器口古镇', category: 'other',
          address: '沙坪坝区磁南街 1 号', lat: 29.5810, lng: 106.4490, price: 0,
          cover: 'city-photos/s203.jpg', gallery: ['city-photos/s203.jpg'],
          description: '嘉陵江边的老码头古镇，主街热闹，拐进小巷还能看到老房子和茶馆；陈麻花和毛血旺是常见的伴手礼与午餐选择。',
          tags: ['古镇', '茶馆', '麻花', '免费'],
          review: '主街商业化，拐进小巷能看到老房子和茶馆，麻花可以买一点当伴手礼。'
        },
        {
          title: '鹅岭二厂文创公园', category: 'photo',
          address: '渝中区鹅岭正街 1 号', lat: 29.5534, lng: 106.5360, price: 0,
          cover: 'city-photos/s204.jpg', gallery: ['city-photos/s204.jpg'],
          description: '旧工厂改的文创园，天台可以看两江和城市天际线，楼里的咖啡店、书店和小展览适合慢慢消磨一个下午。',
          tags: ['文创', '工业风', '天台', '咖啡'],
          review: '天台看两江和城市天际线很开阔，旧厂房改造的细节适合慢慢拍。'
        },
        {
          title: '南山一棵树观景台', category: 'photo',
          address: '南岸区龙黄公路南山风景区', lat: 29.5330, lng: 106.5980, price: 30,
          cover: 'city-photos/s205.jpg', gallery: ['city-photos/s205.jpg'],
          description: '南山半山腰的观景平台，正对渝中半岛；日落前到可以看城市从金色变成蓝色，是重庆夜景的经典机位。',
          tags: ['夜景', '观景台', '日落', '重庆'],
          review: '日落前到最好，能看到城市从金色变成蓝色，山顶风大记得带外套。'
        },
        {
          title: '长江索道', category: 'fun',
          address: '渝中区新华路 151 号', lat: 29.5561, lng: 106.5811, price: 20,
          cover: 'city-photos/s206.jpg', gallery: ['city-photos/s206.jpg'],
          description: '横跨长江的空中索道，单程几分钟，靠窗能看到江面和两岸楼群；建议提前在小程序取号，避开傍晚高峰。',
          tags: ['索道', '长江', '体验', '排队'],
          review: '单程几分钟，靠窗能看到江面和两岸楼群，建议提前在小程序取号。'
        }
      ]
    },
    {
      city: '西安',
      spots: [
        {
          title: '西安城墙·永宁门', category: 'other',
          address: '碑林区南大街永宁门', lat: 34.2583, lng: 108.9539, price: 54,
          cover: 'city-photos/s207.jpg', gallery: ['city-photos/s207.jpg'],
          description: '保存完整的古城墙，从永宁门登城可以骑车绕一圈；傍晚灯光亮起后，城楼和护城河一起入镜。',
          tags: ['城墙', '古迹', '骑行', '夜景'],
          review: '从永宁门上去租辆自行车，绕城墙骑一圈大概两小时，傍晚风景最好。'
        },
        {
          title: '回民街·洒金桥', category: 'food',
          address: '莲湖区北院门回民街', lat: 34.2670, lng: 108.9400, price: 60,
          cover: 'city-photos/s208.jpg', gallery: ['city-photos/s208.jpg'],
          description: '西安老城的小吃集中地，肉夹馍、羊肉泡馍、甑糕和酸梅汤一路吃过去；洒金桥比主街更本地一些。',
          tags: ['小吃', '回民街', '肉夹馍', '泡馍'],
          review: '洒金桥比主街更本地，肉夹馍和甑糕都值得试，晚上人很多要看好随身物品。'
        },
        {
          title: '大雁塔·大唐不夜城', category: 'night',
          address: '雁塔区慈恩路 1 号', lat: 34.2180, lng: 108.9640, price: 0,
          cover: 'city-photos/s209.jpg', gallery: ['city-photos/s209.jpg'],
          description: '大雁塔南广场连接大唐不夜城，晚上有灯光装置和街头表演；从玄奘像一路走到开元广场，适合夜游。',
          tags: ['夜景', '大雁塔', '步行街', '免费'],
          review: '晚上灯亮起来很有盛唐氛围，街头表演不少，建议从大雁塔北广场一路往南走。'
        },
        {
          title: '陕西历史博物馆', category: 'photo',
          address: '雁塔区小寨东路 91 号', lat: 34.2250, lng: 108.9530, price: 0,
          cover: 'city-photos/s210.jpg', gallery: ['city-photos/s210.jpg'],
          description: '西安必看的博物馆之一，周秦汉唐文物密度很高；免费预约，建议留出两三个小时慢慢看。',
          tags: ['博物馆', '历史', '免费', '预约'],
          review: '何家村窖藏和唐代壁画很震撼，免费预约要提前抢，周一闭馆别跑空。'
        },
        {
          title: '华清宫·骊山', category: 'nature',
          address: '临潼区华清路 38 号', lat: 34.3650, lng: 109.2130, price: 120,
          cover: 'city-photos/s211.jpg', gallery: ['city-photos/s211.jpg'],
          description: '骊山脚下的皇家园林，既有温泉遗址也有山路可以慢慢爬；和兵马俑安排在同一天比较顺路。',
          tags: ['骊山', '园林', '爬山', '临潼'],
          review: '园区比想象中大，先逛宫殿遗址再上骊山，傍晚下山时风景很好。'
        },
        {
          title: '书院门·碑林', category: 'other',
          address: '碑林区书院门步行街', lat: 34.2550, lng: 108.9520, price: 0,
          cover: 'city-photos/s212.jpg', gallery: ['city-photos/s212.jpg'],
          description: '城墙根下的书画一条街，笔墨纸砚、印章和碑帖小店一字排开，适合慢慢淘一张喜欢的字帖。',
          tags: ['书院门', '碑林', '书画', '老街'],
          review: '街上很多卖毛笔和印章的小店，慢慢逛能淘到有意思的东西，旁边就是碑林博物馆。'
        }
      ]
    },
    {
      city: '南京',
      spots: [
        {
          title: '玄武湖·环湖步道', category: 'nature',
          address: '玄武区玄武巷 1 号', lat: 32.0740, lng: 118.7950, price: 0,
          cover: 'city-photos/s213.jpg', gallery: ['city-photos/s213.jpg'],
          description: '南京城北的大湖，环湖步道连接台城、解放门和情侣园；傍晚从湖边看城墙和紫金山，风很舒服。',
          tags: ['玄武湖', '环湖', '散步', '免费'],
          review: '从解放门进沿着湖走，城墙和湖面同框很好看，走累了可以坐游船。'
        },
        {
          title: '夫子庙·秦淮河', category: 'night',
          address: '秦淮区贡院街 1 号', lat: 32.0200, lng: 118.7880, price: 0,
          cover: 'city-photos/s214.jpg', gallery: ['city-photos/s214.jpg'],
          description: '秦淮河边的老城南街区，晚上灯船和牌坊一起亮起来；可以逛夫子庙、吃鸭血粉丝，再坐船看两岸夜景。',
          tags: ['秦淮河', '夫子庙', '夜景', '小吃'],
          review: '灯船和牌坊亮起来很有金陵味道，建议傍晚先逛老门东再走过来坐船。'
        },
        {
          title: '中山陵·音乐台', category: 'nature',
          address: '玄武区石象路 7 号', lat: 32.0640, lng: 118.8480, price: 0,
          cover: 'city-photos/s215.jpg', gallery: ['city-photos/s215.jpg'],
          description: '钟山风景区里的中山陵和音乐台，林荫路很长，适合安排半天慢慢走；音乐台的鸽子和弧形台阶很出片。',
          tags: ['中山陵', '钟山', '音乐台', '徒步'],
          review: '从博爱坊一路走到祭堂，台阶比想象中多，但山顶视野很开阔，音乐台适合歇脚。'
        },
        {
          title: '老门东·箍桶巷', category: 'other',
          address: '秦淮区剪子巷 54 号', lat: 32.0120, lng: 118.7890, price: 0,
          cover: 'city-photos/s216.jpg', gallery: ['city-photos/s216.jpg'],
          description: '老城南的街巷改造区，青砖小瓦、木格窗和文创小店混在一起；晚上灯笼亮起后比白天更有味道。',
          tags: ['老门东', '老街', '文创', '夜景'],
          review: '巷子不长但很好逛，小吃和手作店都不少，晚上灯笼亮起来很适合拍照。'
        },
        {
          title: '南京博物院', category: 'photo',
          address: '玄武区中山东路 321 号', lat: 32.0430, lng: 118.8220, price: 0,
          cover: 'city-photos/s217.jpg', gallery: ['city-photos/s217.jpg'],
          description: '中国三大博物馆之一，历史馆、特展馆和民国馆都值得看；民国馆的街景复原很适合拍照。',
          tags: ['博物院', '历史', '民国馆', '免费'],
          review: '民国馆的街景复原很有意思，像走进老电影；免费预约，建议留半天。'
        },
        {
          title: '颐和路·梧桐公馆区', category: 'photo',
          address: '鼓楼区颐和路公馆区', lat: 32.0710, lng: 118.7730, price: 0,
          cover: 'city-photos/s218.jpg', gallery: ['city-photos/s218.jpg'],
          description: '颐和路一带保留了大量民国公馆和梧桐树，街道安静，适合散步和拍建筑；秋天落叶时最好看。',
          tags: ['颐和路', '梧桐', '民国建筑', '散步'],
          review: '梧桐树影落在老洋房墙上，整条路都很安静，适合慢慢走一下午。'
        }
      ]
    },
    {
      city: '武汉',
      spots: [
        {
          title: '黄鹤楼·蛇山', category: 'photo',
          address: '武昌区蛇山西山坡特 1 号', lat: 30.5440, lng: 114.3020, price: 70,
          cover: 'city-photos/s219.jpg', gallery: ['city-photos/s219.jpg'],
          description: '江南名楼黄鹤楼立在蛇山上，登楼可以看长江和武汉三镇；从西门进沿山路走，途中还有不少碑刻和亭台。',
          tags: ['黄鹤楼', '长江', '古迹', '登楼'],
          review: '登楼看长江大桥和两岸城市很开阔，建议上午来，光线和视野都更清楚。'
        },
        {
          title: '东湖绿道·磨山', category: 'nature',
          address: '武昌区沿湖大道 16 号', lat: 30.5560, lng: 114.4180, price: 0,
          cover: 'city-photos/s220.jpg', gallery: ['city-photos/s220.jpg'],
          description: '东湖绿道串起听涛、磨山和落雁景区，沿湖骑车或散步都很舒服；春天樱花、秋天水杉各有颜色。',
          tags: ['东湖', '绿道', '骑行', '免费'],
          review: '租辆自行车沿湖骑最舒服，磨山段树荫多，傍晚湖风很凉快。'
        },
        {
          title: '江汉路步行街', category: 'fun',
          address: '江汉区江汉路步行街', lat: 30.5840, lng: 114.2890, price: 0,
          cover: 'city-photos/s221.jpg', gallery: ['city-photos/s221.jpg'],
          description: '武汉老牌商业街，百年建筑和现代商场混在一起；从江汉关一路逛到循礼门，晚上灯光亮起更有气氛。',
          tags: ['江汉路', '步行街', '建筑', '购物'],
          review: '老建筑保存得很好，逛街吃东西都方便，走到江汉关可以顺便看江滩夜景。'
        },
        {
          title: '汉口江滩·夜景', category: 'night',
          address: '江岸区沿江大道汉口江滩', lat: 30.5930, lng: 114.3050, price: 0,
          cover: 'city-photos/s222.jpg', gallery: ['city-photos/s222.jpg'],
          description: '长江边的开放式江滩公园，晚上对岸灯光和长江大桥一起亮起来；沿江步道很长，适合饭后散步。',
          tags: ['江滩', '夜景', '长江', '免费'],
          review: '江风很舒服，对岸灯光和长江大桥一起亮起来，沿江走多远都不会腻。'
        },
        {
          title: '武汉大学·樱花大道', category: 'nature',
          address: '武昌区珞珈山武汉大学', lat: 30.5400, lng: 114.3610, price: 0,
          cover: 'city-photos/s223.jpg', gallery: ['city-photos/s223.jpg'],
          description: '珞珈山上的校园，春天的樱花大道和秋天的银杏都很出名；老图书馆和行政楼一带的建筑也值得慢慢看。',
          tags: ['武大', '樱花', '校园', '免费'],
          review: '樱花季人很多，需要提前预约；平时沿着珞珈山走一圈，老建筑和树荫都很舒服。'
        },
        {
          title: '湖北省博物馆', category: 'photo',
          address: '武昌区东湖路 160 号', lat: 30.5630, lng: 114.3730, price: 0,
          cover: 'city-photos/s224.jpg', gallery: ['city-photos/s224.jpg'],
          description: '看曾侯乙编钟和越王勾践剑的地方，编钟演奏每天有固定场次；和东湖绿道安排在同一天很顺路。',
          tags: ['博物馆', '编钟', '曾侯乙', '免费'],
          review: '编钟演奏很震撼，提前看好场次；展厅动线清楚，两三个小时能看得很满足。'
        }
      ]
    },
    {
      city: '厦门',
      spots: [
        {
          title: '鼓浪屿·日光岩', category: 'photo',
          address: '思明区鼓浪屿日光岩', lat: 24.4470, lng: 118.0670, price: 50,
          cover: 'city-photos/s225.jpg', gallery: ['city-photos/s225.jpg'],
          description: '鼓浪屿岛上的制高点，登顶可以看全岛红屋顶和厦门海岸线；沿路的老别墅、钢琴博物馆也值得慢慢逛。',
          tags: ['鼓浪屿', '日光岩', '海岛', '老别墅'],
          review: '登顶视野很好，红屋顶和海面一起入镜；岛上坡路多，穿舒服的鞋慢慢走。'
        },
        {
          title: '环岛路·白城沙滩', category: 'nature',
          address: '思明区环岛南路白城沙滩', lat: 24.4380, lng: 118.0970, price: 0,
          cover: 'city-photos/s226.jpg', gallery: ['city-photos/s226.jpg'],
          description: '厦门大学旁的沙滩和环岛路，海边木栈道适合骑车或散步；傍晚看日落，海风很舒服。',
          tags: ['环岛路', '沙滩', '日落', '骑行'],
          review: '傍晚沿着海边骑共享单车很舒服，沙滩不算拥挤，带条薄外套防风。'
        },
        {
          title: '曾厝垵·文创村', category: 'food',
          address: '思明区曾厝垵社', lat: 24.4320, lng: 118.1220, price: 50,
          cover: 'city-photos/s227.jpg', gallery: ['city-photos/s227.jpg'],
          description: '海边的小渔村改成的文创村，巷子里挤满小吃摊、咖啡馆和民宿；沙茶面、海蛎煎和花生汤都可以试试。',
          tags: ['曾厝垵', '小吃', '文创', '民宿'],
          review: '巷子很窄但很有烟火气，沙茶面和海蛎煎都好吃，晚上比白天更热闹。'
        },
        {
          title: '沙坡尾·避风坞', category: 'photo',
          address: '思明区沙坡尾避风坞', lat: 24.4440, lng: 118.0850, price: 0,
          cover: 'city-photos/s228.jpg', gallery: ['city-photos/s228.jpg'],
          description: '老厦门渔港改造的街区，避风坞里停着小船，周边有艺术西区、咖啡店和海鲜排档；适合傍晚来散步拍照。',
          tags: ['沙坡尾', '避风坞', '艺术西区', '咖啡'],
          review: '避风坞的旧渔船和远处双子塔同框很有意思，艺术西区里的小店也值得逛。'
        },
        {
          title: '厦门大学·芙蓉湖', category: 'nature',
          address: '思明区思明南路 422 号', lat: 24.4380, lng: 118.0920, price: 0,
          cover: 'city-photos/s229.jpg', gallery: ['city-photos/s229.jpg'],
          description: '靠海的校园，芙蓉湖、上弦场和建南大礼堂都很有代表性；需要提前预约入校，慢慢走半天刚好。',
          tags: ['厦门大学', '芙蓉湖', '校园', '预约'],
          review: '芙蓉湖和上弦场很适合拍照，校园里树很多，走累了在湖边坐一会儿很舒服。'
        },
        {
          title: '中山路步行街', category: 'food',
          address: '思明区中山路步行街', lat: 24.4550, lng: 118.0820, price: 0,
          cover: 'city-photos/s230.jpg', gallery: ['city-photos/s230.jpg'],
          description: '厦门老城区的骑楼商业街，花生汤、沙茶面和海蛎煎都能找到；晚上骑楼灯光亮起，和老建筑很搭。',
          tags: ['中山路', '骑楼', '小吃', '夜逛'],
          review: '骑楼建筑很有味道，小吃店密集，晚上灯亮后比白天更适合逛街。'
        }
      ]
    },
    {
      city: '青岛',
      spots: [
        {
          title: '栈桥·回澜阁', category: 'photo',
          address: '市南区太平路 12 号', lat: 36.0610, lng: 120.3190, price: 0,
          cover: 'city-photos/s231.jpg', gallery: ['city-photos/s231.jpg'],
          description: '青岛老城的地标，栈桥一直伸进海里，尽头是回澜阁；冬天有海鸥，夏天傍晚吹海风很舒服。',
          tags: ['栈桥', '海鸥', '海边', '免费'],
          review: '冬天海鸥很多，站在栈桥边吹海风很舒服；人多的时候往两侧走走更好拍。'
        },
        {
          title: '八大关·花石楼', category: 'other',
          address: '市南区八大关风景区', lat: 36.0550, lng: 120.3520, price: 0,
          cover: 'city-photos/s232.jpg', gallery: ['city-photos/s232.jpg'],
          description: '青岛老别墅最集中的街区，梧桐、红瓦和各国建筑风格混在一起；花石楼靠海，秋天落叶时最好看。',
          tags: ['八大关', '老别墅', '梧桐', '散步'],
          review: '每条路种的树都不一样，慢慢走能看一下午；花石楼外面拍照的人比较多。'
        },
        {
          title: '小鱼山·观景台', category: 'photo',
          address: '市南区福山支路 24 号', lat: 36.0580, lng: 120.3350, price: 15,
          cover: 'city-photos/s233.jpg', gallery: ['city-photos/s233.jpg'],
          description: '小鱼山不高，但观景台能俯瞰老城红屋顶和海湾；从山顶下来可以顺路逛福山路、黄县路一带的小店。',
          tags: ['小鱼山', '红屋顶', '观景台', '老城'],
          review: '爬上去不到十分钟，红屋顶和海湾一起入镜，下午光线最好。'
        },
        {
          title: '青岛啤酒博物馆', category: 'fun',
          address: '市北区登州路 56 号', lat: 36.0860, lng: 120.3430, price: 60,
          cover: 'city-photos/s234.jpg', gallery: ['city-photos/s234.jpg'],
          description: '在青岛啤酒老厂区里，能看到酿造流程和历史展，门票含一杯原浆或纯生；适合和台东步行街安排在一起。',
          tags: ['啤酒博物馆', '青岛啤酒', '老厂', '体验'],
          review: '原浆比瓶装香很多，参观完在院子里喝一杯很舒服；喜欢拍照的别错过老设备。'
        },
        {
          title: '台东步行街', category: 'food',
          address: '市北区台东三路步行街', lat: 36.0830, lng: 120.3460, price: 50,
          cover: 'city-photos/s235.jpg', gallery: ['city-photos/s235.jpg'],
          description: '青岛本地人常逛的夜市步行街，烤鱿鱼、海鲜和啤酒屋密集；晚上灯牌亮起来很有烟火气。',
          tags: ['台东', '夜市', '海鲜', '啤酒'],
          review: '小吃摊很多，烤鱿鱼和海鲜都不错，晚上人多但气氛很热闹。'
        },
        {
          title: '小麦岛公园', category: 'nature',
          address: '崂山区东海东路小麦岛', lat: 36.0650, lng: 120.4190, price: 0,
          cover: 'city-photos/s236.jpg', gallery: ['city-photos/s236.jpg'],
          description: '海边的小岛公园，环岛步道可以看礁石、草坡和日落；草坪上适合野餐，风大时记得带外套。',
          tags: ['小麦岛', '海边', '日落', '野餐'],
          review: '草坡和海面连在一起，日落时很适合拍照；岛上风大，带件外套和野餐垫。'
        }
      ]
    }
  ];

  var extraGroups = [
    {
      city: '苏州',
      spots: [
        {
          title: '拙政园·园林半日', category: 'other',
          address: '姑苏区东北街 178 号', lat: 31.3240, lng: 120.6290, price: 80,
          cover: 'city-photos/s237.jpg', gallery: ['city-photos/s237.jpg'],
          description: '苏州园林里最经典的一座，亭台水榭和借景手法都值得慢慢看；建议开园就到，避开旅行团。',
          tags: ['拙政园', '园林', '古城', '世界遗产'],
          review: '水榭和假山的层次比照片丰富，早上去人少，能安静看一会儿。'
        },
        {
          title: '平江路·水巷慢走', category: 'other',
          address: '姑苏区平江路历史街区', lat: 31.3140, lng: 120.6290, price: 0,
          cover: 'city-photos/s238.jpg', gallery: ['city-photos/s238.jpg'],
          description: '沿着平江河的小巷，白墙黛瓦、石桥和评弹馆一路排开；适合从南端慢慢走到北端，中途找家茶馆坐下。',
          tags: ['平江路', '水巷', '评弹', '免费'],
          review: '清早的平江路很安静，桥边和阿婆聊天比逛主街更有意思。'
        },
        {
          title: '苏州博物馆·贝聿铭设计', category: 'photo',
          address: '姑苏区东北街 204 号', lat: 31.3230, lng: 120.6280, price: 0,
          cover: 'city-photos/s239.jpg', gallery: ['city-photos/s239.jpg'],
          description: '贝聿铭设计的博物馆，几何屋顶和庭院光影很出片；馆藏书画与吴地文物也值得慢慢看，需提前预约。',
          tags: ['苏州博物馆', '建筑', '免费', '预约'],
          review: '建筑本身就是展品，下午光线穿过庭院时最好看，记得提前预约。'
        },
        {
          title: '山塘街·七里山塘夜游', category: 'night',
          address: '姑苏区山塘街 177 号', lat: 31.3200, lng: 120.5880, price: 0,
          cover: 'city-photos/s240.jpg', gallery: ['city-photos/s240.jpg'],
          description: '从阊门到虎丘的七里水街，晚上灯笼亮起后最像古画；可以坐游船，也可以沿河吃一碗苏式汤面。',
          tags: ['山塘街', '夜景', '游船', '小吃'],
          review: '亮灯后沿河走很漂亮，游船排队不长，汤面和小笼可以一起安排。'
        },
        {
          title: '金鸡湖·湖滨步道', category: 'nature',
          address: '工业园区金鸡湖景区', lat: 31.3140, lng: 120.7000, price: 0,
          cover: 'city-photos/s241.jpg', gallery: ['city-photos/s241.jpg'],
          description: '苏州新城的湖滨步道，白天看湖、傍晚看东方之门亮灯；沿湖骑行或散步都很舒服。',
          tags: ['金鸡湖', '湖滨', '日落', '免费'],
          review: '傍晚从湖东走到湖西，东方之门和晚霞一起入镜，风很舒服。'
        },
        {
          title: '同里古镇·退思园', category: 'other',
          address: '吴江区同里古镇', lat: 31.1560, lng: 120.7180, price: 80,
          cover: 'city-photos/s242.jpg', gallery: ['city-photos/s242.jpg'],
          description: '比周庄安静一些的水乡古镇，退思园和三桥是核心；住一晚可以看清晨没有游客的河道。',
          tags: ['同里', '古镇', '退思园', '水乡'],
          review: '退思园小巧精致，早上在河边吃一碗馄饨，古镇才真正安静下来。'
        },
        {
          title: '狮子林·假山迷宫', category: 'other',
          address: '姑苏区园林路 23 号', lat: 31.3230, lng: 120.6250, price: 40,
          cover: 'city-photos/s243.jpg', gallery: ['city-photos/s243.jpg'],
          description: '以假山闻名的苏州园林，石峰洞壑像一座立体迷宫；带小朋友来会玩得很开心。',
          tags: ['狮子林', '假山', '园林', '亲子'],
          review: '假山里钻来钻去很有意思，穿双防滑鞋，石阶有点陡。'
        },
        {
          title: '观前街·苏式小吃', category: 'food',
          address: '姑苏区观前街', lat: 31.3120, lng: 120.6200, price: 50,
          cover: 'city-photos/s244.jpg', gallery: ['city-photos/s244.jpg'],
          description: '苏州老城中心的步行街，松鹤楼、采芝斋和各类苏式小吃都集中在这里；适合和拙政园安排在同一天。',
          tags: ['观前街', '苏式面', '小吃', '步行街'],
          review: '焖肉面和哑巴生煎都好吃，街上老字号多，买伴手礼很方便。'
        }
      ]
    },
    {
      city: '天津',
      spots: [
        {
          title: '五大道·洋楼漫步', category: 'photo',
          address: '和平区五大道风景区', lat: 39.1160, lng: 117.2010, price: 0,
          cover: 'city-photos/s245.jpg', gallery: ['city-photos/s245.jpg'],
          description: '天津最集中的洋楼历史街区，梧桐树下的英式、法式和意式建筑各有细节；适合租辆自行车慢慢逛。',
          tags: ['五大道', '洋楼', '梧桐', '免费'],
          review: '从民园广场一路骑到睦南道，老洋房和树影很漂亮，下午人也不多。'
        },
        {
          title: '意式风情区·马可波罗广场', category: 'photo',
          address: '河北区意式风情区', lat: 39.1360, lng: 117.2080, price: 0,
          cover: 'city-photos/s246.jpg', gallery: ['city-photos/s246.jpg'],
          description: '海河边的意式建筑群，红顶拱廊和露天咖啡座很像欧洲小镇；晚上灯光亮起后适合吃饭散步。',
          tags: ['意风区', '海河', '咖啡', '夜景'],
          review: '建筑颜色很上镜，找家露天座位喝咖啡，看广场上人来人往很惬意。'
        },
        {
          title: '天津之眼·摩天轮', category: 'night',
          address: '河北区李公祠大街与五马路交口', lat: 39.1530, lng: 117.1920, price: 70,
          cover: 'city-photos/s247.jpg', gallery: ['city-photos/s247.jpg'],
          description: '建在海河上的摩天轮，转到最高处可以看天津城的夜景；建议提前预约，日落前上轮最漂亮。',
          tags: ['天津之眼', '摩天轮', '夜景', '海河'],
          review: '日落前上去能看到城市从金色变成蓝色，轿厢里拍照要贴玻璃。'
        },
        {
          title: '古文化街·天后宫', category: 'other',
          address: '南开区通北路古文化街', lat: 39.1430, lng: 117.1930, price: 0,
          cover: 'city-photos/s248.jpg', gallery: ['city-photos/s248.jpg'],
          description: '津门故里的老街区，天后宫、泥人张和杨柳青年画都在附近；适合买一点天津麻花当伴手礼。',
          tags: ['古文化街', '天后宫', '泥人张', '免费'],
          review: '泥人张的小店很有意思，天后宫门口拍照也好看，麻花别买太多容易腻。'
        },
        {
          title: '瓷房子·赤峰道', category: 'photo',
          address: '和平区赤峰道 72 号', lat: 39.1250, lng: 117.2020, price: 50,
          cover: 'city-photos/s249.jpg', gallery: ['city-photos/s249.jpg'],
          description: '用瓷片和古董装饰起来的小楼，外墙的图案在阳光下很特别；适合路过拍照，不用留太久。',
          tags: ['瓷房子', '建筑', '拍照', '赤峰道'],
          review: '外墙细节多得看不完，路过拍几张就好，门票看个人兴趣。'
        },
        {
          title: '津湾广场·海河夜景', category: 'night',
          address: '和平区津湾广场', lat: 39.1330, lng: 117.2050, price: 0,
          cover: 'city-photos/s250.jpg', gallery: ['city-photos/s250.jpg'],
          description: '海河转弯处的城市广场，对岸是天津站和意风区；晚上沿河走一段，灯光和倒影一起很好看。',
          tags: ['津湾广场', '海河', '夜景', '免费'],
          review: '从解放桥走到津湾广场，夜景层次很好，坐在台阶上吹风很舒服。'
        },
        {
          title: '海河夜游·天津站码头', category: 'night',
          address: '河北区海河东路天津站码头', lat: 39.1360, lng: 117.2070, price: 100,
          cover: 'city-photos/s251.jpg', gallery: ['city-photos/s251.jpg'],
          description: '从天津站码头登船，沿河看意风区、津湾广场和解放桥；夜航约一小时，适合带第一次来天津的朋友。',
          tags: ['海河', '游船', '夜景', '天津站'],
          review: '船上风很舒服，解放桥和两岸灯光一次看全，比走路省力。'
        },
        {
          title: '西北角·天津早点', category: 'food',
          address: '红桥区西北角回民小区', lat: 39.1440, lng: 117.1640, price: 30,
          cover: 'city-photos/s252.jpg', gallery: ['city-photos/s252.jpg'],
          description: '天津本地人排队吃早点的地方，煎饼果子、锅巴菜、老豆腐和炸糕都很地道；建议早上九点前到。',
          tags: ['西北角', '早点', '煎饼果子', '锅巴菜'],
          review: '煎饼果子要加馃箅儿，锅巴菜配烧饼很好吃，排队比想象中快。'
        }
      ]
    },
    {
      city: '昆明',
      spots: [
        {
          title: '滇池·海埂大坝', category: 'nature',
          address: '西山区滇池路海埂大坝', lat: 25.0470, lng: 102.6650, price: 0,
          cover: 'city-photos/s253.jpg', gallery: ['city-photos/s253.jpg'],
          description: '冬天有红嘴鸥的滇池岸边，沿大坝散步可以看西山和湖面；傍晚风大，带件外套。',
          tags: ['滇池', '海埂大坝', '海鸥', '免费'],
          review: '冬天海鸥很多，买一袋鸥粮就能喂半天，日落时湖面颜色很好看。'
        },
        {
          title: '翠湖公园·云南大学', category: 'nature',
          address: '五华区翠湖南路 67 号', lat: 25.0520, lng: 102.7020, price: 0,
          cover: 'city-photos/s254.jpg', gallery: ['city-photos/s254.jpg'],
          description: '昆明市中心的免费公园，冬天也有海鸥；从翠湖走到云南大学老校区，梧桐和会泽院很适合拍照。',
          tags: ['翠湖', '云南大学', '海鸥', '免费'],
          review: '翠湖边上晒晒太阳很舒服，穿过云大校园走到文林街，一路都有小吃。'
        },
        {
          title: '云南大学·会泽院', category: 'photo',
          address: '五华区翠湖北路 2 号', lat: 25.0530, lng: 102.7030, price: 0,
          cover: 'city-photos/s255.jpg', gallery: ['city-photos/s255.jpg'],
          description: '云南大学老校区依山而建，会泽院、银杏道和钟楼都有民国校园的气质；秋天银杏黄时最好看。',
          tags: ['云南大学', '校园', '银杏', '免费'],
          review: '银杏季的校园很漂亮，会泽院前的台阶适合拍照，注意不要打扰上课。'
        },
        {
          title: '篆新农贸市场', category: 'food',
          address: '五华区新闻路篆新农贸市场', lat: 25.0460, lng: 102.7080, price: 40,
          cover: 'city-photos/s256.jpg', gallery: ['city-photos/s256.jpg'],
          description: '昆明最有烟火气的菜市场，野生菌、鲜花、米线和各类腌菜都能看到；适合空着肚子来扫街。',
          tags: ['篆新', '菜市场', '米线', '小吃'],
          review: '市场里什么都有，豆花米线和烤豆腐好吃，买水果也比景区便宜。'
        },
        {
          title: '石林·大小石林', category: 'nature',
          address: '石林彝族自治县石林风景区', lat: 24.8140, lng: 103.3240, price: 130,
          cover: 'city-photos/s257.jpg', gallery: ['city-photos/s257.jpg'],
          description: '喀斯特石峰群，大小石林之间有步道连接；景区很大，建议坐观光车，穿防滑鞋。',
          tags: ['石林', '喀斯特', '自然', '一日游'],
          review: '石峰比照片里更密，穿行在石缝里很有探险感；景区大，留足半天时间。'
        },
        {
          title: '西山龙门·滇池全景', category: 'photo',
          address: '西山区西山风景区', lat: 25.0360, lng: 102.6330, price: 40,
          cover: 'city-photos/s258.jpg', gallery: ['city-photos/s258.jpg'],
          description: '从西山龙门俯瞰滇池和昆明城，山路贴着崖壁开凿，视野很震撼；可以坐索道上山节省体力。',
          tags: ['西山', '龙门', '滇池', '索道'],
          review: '龙门石窟的栈道贴着崖壁，往下看滇池很开阔，恐高的人要慢慢走。'
        },
        {
          title: '斗南花市·亚洲花都', category: 'other',
          address: '呈贡区斗南花卉市场', lat: 24.8860, lng: 102.7950, price: 0,
          cover: 'city-photos/s259.jpg', gallery: ['city-photos/s259.jpg'],
          description: '亚洲最大的鲜花交易市场，晚上拍卖和夜市最热闹；玫瑰、绣球和向日葵按扎卖，价格很友好。',
          tags: ['斗南', '花市', '夜市', '鲜花'],
          review: '晚上去花市最热闹，几十块能抱一大束花，记得带个袋子。'
        },
        {
          title: '官渡古镇·金刚塔', category: 'other',
          address: '官渡区官渡古镇', lat: 24.9640, lng: 102.7500, price: 0,
          cover: 'city-photos/s260.jpg', gallery: ['city-photos/s260.jpg'],
          description: '昆明老城南边的古镇，金刚塔、土主庙和官渡粑粑都值得看；游客不多，适合慢慢逛。',
          tags: ['官渡古镇', '金刚塔', '粑粑', '免费'],
          review: '金刚塔很小众但很有味道，官渡粑粑趁热吃，古镇商业化不重。'
        }
      ]
    },
    {
      city: '大理',
      spots: [
        {
          title: '洱海生态廊道', category: 'nature',
          address: '大理市洱海生态廊道', lat: 25.6800, lng: 100.1900, price: 0,
          cover: 'city-photos/s261.jpg', gallery: ['city-photos/s261.jpg'],
          description: '沿洱海西岸的骑行步道，从龙龛码头到喜洲一路都是湖景；租电动车或自行车慢慢骑最舒服。',
          tags: ['洱海', '骑行', '生态廊道', '免费'],
          review: '从才村骑到龙龛，湖风吹着很舒服，沿途都有停下来的观景台。'
        },
        {
          title: '大理古城·人民路', category: 'other',
          address: '大理市古城人民路', lat: 25.6930, lng: 100.1610, price: 0,
          cover: 'city-photos/s262.jpg', gallery: ['city-photos/s262.jpg'],
          description: '大理古城的主街之一，白天有手作店和咖啡馆，晚上小酒馆和路边摊热闹；可以住在附近慢慢逛。',
          tags: ['大理古城', '人民路', '咖啡', '夜生活'],
          review: '人民路比洋人街安静，手作店和咖啡店都好逛，晚上去小酒馆听歌很舒服。'
        },
        {
          title: '喜洲古镇·白族民居', category: 'other',
          address: '大理市喜洲镇', lat: 25.8530, lng: 100.1300, price: 0,
          cover: 'city-photos/s263.jpg', gallery: ['city-photos/s263.jpg'],
          description: '保存完好的白族民居群，青瓦白墙和木雕照壁很精致；喜洲粑粑和稻田风光也不能错过。',
          tags: ['喜洲', '白族', '民居', '粑粑'],
          review: '转角楼和稻田都好拍，喜洲粑粑甜的咸的各买一个，刚出炉最好吃。'
        },
        {
          title: '双廊·洱海东岸', category: 'photo',
          address: '大理市双廊镇', lat: 25.9000, lng: 100.1950, price: 0,
          cover: 'city-photos/s264.jpg', gallery: ['city-photos/s264.jpg'],
          description: '洱海东岸的小镇，临水民宿和玻璃观景台很多；日落时对岸苍山和湖面颜色最美。',
          tags: ['双廊', '洱海', '日落', '民宿'],
          review: '下午坐在海边看苍山，日落时整片湖面都是金色，住一晚很值。'
        },
        {
          title: '苍山·感通索道', category: 'nature',
          address: '大理市苍山感通索道', lat: 25.6400, lng: 100.1300, price: 110,
          cover: 'city-photos/s265.jpg', gallery: ['city-photos/s265.jpg'],
          description: '坐索道上苍山，沿玉带云游路走一段可以俯瞰洱海；山上气温低，带件外套。',
          tags: ['苍山', '索道', '玉带路', '徒步'],
          review: '索道上去后云就在脚边，玉带路走起来不累，山顶比山下冷很多。'
        },
        {
          title: '崇圣寺三塔', category: 'photo',
          address: '大理市崇圣寺三塔文化旅游区', lat: 25.7020, lng: 100.1490, price: 75,
          cover: 'city-photos/s266.jpg', gallery: ['city-photos/s266.jpg'],
          description: '大理标志性的三塔倒影，背后是苍山；景区很大，建议坐电瓶车到主塔再慢慢走下来。',
          tags: ['三塔', '崇圣寺', '苍山', '拍照'],
          review: '三塔倒影池拍照最好看，景区比想象中大，电瓶车能省不少脚力。'
        },
        {
          title: '龙龛码头·日出', category: 'photo',
          address: '大理市龙龛码头', lat: 25.6700, lng: 100.1900, price: 0,
          cover: 'city-photos/s267.jpg', gallery: ['city-photos/s267.jpg'],
          description: '洱海西岸看日出的码头，早上湖面很安静，远处苍山云雾散开；住附近可以骑车过来。',
          tags: ['龙龛码头', '日出', '洱海', '免费'],
          review: '六点多到码头等日出，湖面和苍山一起亮起来，比照片更安静。'
        },
        {
          title: '才村·湖边骑行', category: 'nature',
          address: '大理市才村码头', lat: 25.6750, lng: 100.1800, price: 0,
          cover: 'city-photos/s268.jpg', gallery: ['city-photos/s268.jpg'],
          description: '洱海西岸的村子，湖边有草坪和骑行道；适合租车从这里出发，一路骑到喜洲。',
          tags: ['才村', '洱海', '骑行', '草坪'],
          review: '从才村租电动车很方便，沿湖骑到喜洲大概一小时，路上风景不断。'
        }
      ]
    },
    {
      city: '丽江',
      spots: [
        {
          title: '丽江古城·四方街', category: 'other',
          address: '古城区丽江古城', lat: 26.8720, lng: 100.2340, price: 0,
          cover: 'city-photos/s269.jpg', gallery: ['city-photos/s269.jpg'],
          description: '世界文化遗产古城，石板路、纳西民居和水系交错；清晨和晚上各有一番味道，建议住古城边缘。',
          tags: ['丽江古城', '四方街', '纳西', '免费'],
          review: '清晨的古城几乎没人，沿着水渠走到四方街，才看出古城本来的样子。'
        },
        {
          title: '玉龙雪山·冰川公园', category: 'nature',
          address: '玉龙纳西族自治县玉龙雪山景区', lat: 27.1000, lng: 100.1750, price: 140,
          cover: 'city-photos/s270.jpg', gallery: ['city-photos/s270.jpg'],
          description: '纳西族的神山，坐大索道到冰川公园需要提前预约；海拔高，带氧气瓶和厚外套。',
          tags: ['玉龙雪山', '索道', '冰川', '高海拔'],
          review: '大索道上去后有点缺氧，慢慢走别跑，雪山在云里露出来的时候很震撼。'
        },
        {
          title: '蓝月谷·镜潭湖', category: 'nature',
          address: '玉龙雪山景区蓝月谷', lat: 27.0950, lng: 100.1900, price: 0,
          cover: 'city-photos/s271.jpg', gallery: ['city-photos/s271.jpg'],
          description: '玉龙雪山脚下的蓝色湖水，晴天时像一块宝石；沿栈道走到镜潭湖，和雪山同框很出片。',
          tags: ['蓝月谷', '雪山', '湖水', '拍照'],
          review: '水颜色真的很蓝，坐景区车到蓝月谷后沿栈道走，雪山一直就在背后。'
        },
        {
          title: '束河古镇·茶马古道', category: 'other',
          address: '古城区束河古镇', lat: 26.9170, lng: 100.2080, price: 0,
          cover: 'city-photos/s272.jpg', gallery: ['city-photos/s272.jpg'],
          description: '比丽江古城安静的茶马古道小镇，青龙桥、四方街和九鼎龙潭都值得走；适合住一晚慢慢逛。',
          tags: ['束河', '茶马古道', '古镇', '免费'],
          review: '束河比大研安静很多，青龙桥边的咖啡馆坐着发呆一下午很舒服。'
        },
        {
          title: '白沙古镇·雪山脚下', category: 'photo',
          address: '玉龙纳西族自治县白沙古镇', lat: 26.9580, lng: 100.2080, price: 0,
          cover: 'city-photos/s273.jpg', gallery: ['city-photos/s273.jpg'],
          description: '玉龙雪山脚下的纳西古镇，白沙壁画和扎染小店很有味道；抬头就能看到雪山，比束河更安静。',
          tags: ['白沙', '壁画', '扎染', '雪山'],
          review: '古镇不大但很松弛，扎染店里可以自己动手，抬头就是玉龙雪山。'
        },
        {
          title: '拉市海·湿地骑马', category: 'nature',
          address: '玉龙纳西族自治县拉市海湿地', lat: 26.8600, lng: 100.1200, price: 60,
          cover: 'city-photos/s274.jpg', gallery: ['city-photos/s274.jpg'],
          description: '丽江城西的湿地保护区，冬天有很多候鸟；可以骑马走茶马古道，也可以在湖边慢慢走。',
          tags: ['拉市海', '湿地', '骑马', '候鸟'],
          review: '湖边风很大，候鸟成群飞起来很好看，骑马项目记得先谈好价格。'
        },
        {
          title: '木府·纳西土司府', category: 'photo',
          address: '古城区丽江古城木府', lat: 26.8740, lng: 100.2330, price: 40,
          cover: 'city-photos/s275.jpg', gallery: ['city-photos/s275.jpg'],
          description: '丽江古城里的纳西土司府邸，建筑沿山势层层升高，登上万卷楼可以俯瞰古城屋顶。',
          tags: ['木府', '纳西', '古城', '建筑'],
          review: '从木府高处俯瞰古城屋顶很漂亮，讲解能听到不少纳西历史。'
        },
        {
          title: '狮子山·万古楼', category: 'photo',
          address: '古城区狮子山公园', lat: 26.8720, lng: 100.2320, price: 50,
          cover: 'city-photos/s276.jpg', gallery: ['city-photos/s276.jpg'],
          description: '古城制高点，万古楼可以看丽江古城全景和远处的玉龙雪山；傍晚上去等日落最合适。',
          tags: ['狮子山', '万古楼', '古城全景', '日落'],
          review: '傍晚在万古楼看古城灯一盏盏亮起来，远处雪山还没完全暗，视野很开阔。'
        }
      ]
    },
    {
      city: '桂林',
      spots: [
        {
          title: '漓江竹筏·杨堤到兴坪', category: 'nature',
          address: '阳朔县杨堤码头', lat: 25.0900, lng: 110.4600, price: 120,
          cover: 'city-photos/s277.jpg', gallery: ['city-photos/s277.jpg'],
          description: '漓江最精华的一段水路，竹筏从杨堤漂到兴坪，九马画山和黄布倒影一路都能看到。',
          tags: ['漓江', '竹筏', '兴坪', '山水'],
          review: '竹筏比大船安静，水面倒影清楚，二十元人民币背景就在兴坪段。'
        },
        {
          title: '象鼻山·漓江边', category: 'photo',
          address: '象山区滨江路象鼻山景区', lat: 25.2670, lng: 110.2960, price: 55,
          cover: 'city-photos/s278.jpg', gallery: ['city-photos/s278.jpg'],
          description: '桂林城徽象鼻山，山形像大象伸鼻饮水；从訾洲公园隔江看角度最好，傍晚光线柔和。',
          tags: ['象鼻山', '桂林', '漓江', '拍照'],
          review: '隔江看象鼻山更像大象，公园里走走很舒服，不用赶着登顶。'
        },
        {
          title: '阳朔西街·夜生活', category: 'night',
          address: '阳朔县西街', lat: 24.7780, lng: 110.4960, price: 0,
          cover: 'city-photos/s279.jpg', gallery: ['city-photos/s279.jpg'],
          description: '阳朔最热闹的老街，酒吧、餐馆和手作店挤在一起；晚上灯亮后很有烟火气，适合住一晚慢慢逛。',
          tags: ['阳朔西街', '夜生活', '酒吧', '小吃'],
          review: '晚上西街很热闹，找家小馆吃啤酒鱼，再去清吧听歌很放松。'
        },
        {
          title: '遇龙河·竹筏漂流', category: 'nature',
          address: '阳朔县遇龙河景区', lat: 24.7600, lng: 110.4300, price: 100,
          cover: 'city-photos/s280.jpg', gallery: ['city-photos/s280.jpg'],
          description: '比漓江更安静的田园河流，竹筏慢慢穿过古桥和水车；沿岸可以骑行，春天油菜花最好看。',
          tags: ['遇龙河', '竹筏', '田园', '骑行'],
          review: '遇龙河的水很清，竹筏师傅会慢慢撑，沿河骑行也舒服，适合安排半天。'
        },
        {
          title: '龙脊梯田·金坑大寨', category: 'nature',
          address: '龙胜各族自治县龙脊梯田', lat: 25.7500, lng: 110.1100, price: 80,
          cover: 'city-photos/s281.jpg', gallery: ['city-photos/s281.jpg'],
          description: '壮族瑶族山区的梯田群，金坑大寨的观景台看日出和云海最壮观；山路多，建议住山上。',
          tags: ['龙脊梯田', '金坑', '日出', '徒步'],
          review: '清晨的梯田像一面面镜子，云雾散开后层层叠叠，住一晚才不会错过。'
        },
        {
          title: '东西巷·靖江王府', category: 'other',
          address: '秀峰区东西巷', lat: 25.2780, lng: 110.2960, price: 0,
          cover: 'city-photos/s282.jpg', gallery: ['city-photos/s282.jpg'],
          description: '桂林老城的历史街区，青砖灰瓦的小店和靖江王府连在一起；适合和象鼻山安排同一天。',
          tags: ['东西巷', '靖江王府', '老街', '免费'],
          review: '东西巷晚上灯亮起来很有味道，靖江王府的城墙可以一起逛。'
        },
        {
          title: '两江四湖·夜游', category: 'night',
          address: '秀峰区两江四湖景区', lat: 25.2830, lng: 110.2900, price: 100,
          cover: 'city-photos/s283.jpg', gallery: ['city-photos/s283.jpg'],
          description: '桂林市区的环城水系夜游，日月双塔、玻璃桥和沿岸灯光都能看到；坐船比走路省力。',
          tags: ['两江四湖', '夜游', '日月双塔', '游船'],
          review: '夜游船经过日月双塔时最漂亮，导游会讲桂林老城的故事，值得坐一次。'
        },
        {
          title: '十里画廊·骑行', category: 'photo',
          address: '阳朔县十里画廊', lat: 24.7600, lng: 110.4700, price: 0,
          cover: 'city-photos/s284.jpg', gallery: ['city-photos/s284.jpg'],
          description: '阳朔到月亮山的一段乡间公路，喀斯特山峰一路相伴；租电动车或自行车慢慢骑，随时停下来拍照。',
          tags: ['十里画廊', '骑行', '阳朔', '喀斯特'],
          review: '骑电动车最省力，沿途月亮山和大榕树都值得停，路边阿姨卖的桂花凉粉好吃。'
        }
      ]
    },
    {
      city: '三亚',
      spots: [
        {
          title: '亚龙湾·沙滩', category: 'nature',
          address: '吉阳区亚龙湾国家旅游度假区', lat: 18.2300, lng: 109.6300, price: 0,
          cover: 'city-photos/s285.jpg', gallery: ['city-photos/s285.jpg'],
          description: '三亚最细的白沙滩之一，海水清透，适合游泳和晒太阳；早上人少，傍晚光线柔和。',
          tags: ['亚龙湾', '沙滩', '游泳', '度假'],
          review: '沙子和海水都很干净，早上来几乎没人，带条毛巾和防晒就够了。'
        },
        {
          title: '蜈支洲岛·环岛栈道', category: 'nature',
          address: '海棠区蜈支洲岛', lat: 18.3100, lng: 109.7600, price: 140,
          cover: 'city-photos/s286.jpg', gallery: ['city-photos/s286.jpg'],
          description: '三亚外海的度假小岛，海水能见度高，环岛栈道和情人桥很出片；建议早班船上岛避开人流。',
          tags: ['蜈支洲岛', '海岛', '潜水', '栈道'],
          review: '海水颜色分层特别好看，环岛走一圈大约两小时，早去能避开旅行团。'
        },
        {
          title: '天涯海角·海边石刻', category: 'photo',
          address: '天涯区天涯海角游览区', lat: 18.2900, lng: 109.3800, price: 68,
          cover: 'city-photos/s287.jpg', gallery: ['city-photos/s287.jpg'],
          description: '三亚老牌海边景区，天涯石、海角石和南天一柱在沙滩尽头；傍晚看日落比正午舒服很多。',
          tags: ['天涯海角', '海边', '日落', '拍照'],
          review: '下午四点以后光线最好，走到天涯石那边人少一点，日落很漂亮。'
        },
        {
          title: '南山文化旅游区·海上观音', category: 'other',
          address: '崖州区南山文化旅游区', lat: 18.3000, lng: 109.1300, price: 108,
          cover: 'city-photos/s288.jpg', gallery: ['city-photos/s288.jpg'],
          description: '南山脚下的佛教文化景区，108 米海上观音像很震撼；园区很大，建议坐电瓶车。',
          tags: ['南山', '海上观音', '文化', '电瓶车'],
          review: '海上观音像比照片高大很多，园区很大，电瓶车能省不少时间。'
        },
        {
          title: '椰梦长廊·三亚湾日落', category: 'nature',
          address: '天涯区三亚湾路', lat: 18.2700, lng: 109.4700, price: 0,
          cover: 'city-photos/s289.jpg', gallery: ['city-photos/s289.jpg'],
          description: '三亚湾沿海的椰林步道，傍晚可以看太阳从海面落下；一路都有长椅和观景平台。',
          tags: ['椰梦长廊', '三亚湾', '日落', '免费'],
          review: '傍晚沿着海边走，椰影和晚霞一起很好看，记得带防蚊水。'
        },
        {
          title: '大东海·城市海湾', category: 'nature',
          address: '吉阳区大东海旅游区', lat: 18.2400, lng: 109.5200, price: 0,
          cover: 'city-photos/s290.jpg', gallery: ['city-photos/s290.jpg'],
          description: '离市区最近的海湾，沙滩边餐厅和酒吧很多；适合下午游泳，晚上在海边吃烧烤。',
          tags: ['大东海', '海滩', '游泳', '夜宵'],
          review: '住在市区走过来很方便，傍晚海水不晒，沙滩边吃烧烤很舒服。'
        },
        {
          title: '鹿回头·山顶夜景', category: 'photo',
          address: '吉阳区鹿回头风景区', lat: 18.2300, lng: 109.5000, price: 45,
          cover: 'city-photos/s291.jpg', gallery: ['city-photos/s291.jpg'],
          description: '三亚港边的山顶公园，可以俯瞰整个三亚湾和城市灯光；傍晚上山看日落和夜景最合适。',
          tags: ['鹿回头', '夜景', '观景台', '日落'],
          review: '傍晚上山看太阳落到海面，城市灯光慢慢亮起来，山顶风很舒服。'
        },
        {
          title: '后海村·冲浪小店', category: 'fun',
          address: '海棠区后海村', lat: 18.3300, lng: 109.7400, price: 0,
          cover: 'city-photos/s292.jpg', gallery: ['city-photos/s292.jpg'],
          description: '海棠湾边的冲浪村，海边有很多冲浪店和小餐馆；适合初学者报一节体验课，晚上在村里吃海鲜。',
          tags: ['后海村', '冲浪', '海边', '小馆'],
          review: '第一次冲浪就在后海，教练很有耐心，傍晚在村里吃海鲜很放松。'
        }
      ]
    }
  ];

  groups = groups.concat(extraGroups);

  var spots = [];
  var index = 0;
  groups.forEach(function (group) {
    group.spots.forEach(function (item) {
      spots.push(makeSpot(index, item, group.city));
      index += 1;
    });
  });

  window.W.SeedCities = { spots: spots };
})(window);
