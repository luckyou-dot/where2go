/* 省份内容补齐种子：石家庄 / 太原 / 呼和浩特 / 沈阳 / 长春 / 哈尔滨 / 郑州 / 合肥 / 南昌 / 贵阳 / 拉萨 / 兰州 / 西宁 / 银川 / 乌鲁木齐
   说明：新增 15 个省会/首府城市，每城 6 个地点，覆盖此前没有地点标记的省级区域；
   图片均来自 Wikimedia Commons 的公开授权素材，逐张记录在 city-photos/CREDITS.md。 */
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
        id: 'c' + (600 + index * 3 + i),
        userId: row[0],
        userName: USER_NAMES[row[0]],
        rating: row[1],
        content: row[2],
        createdAt: minutesAgo(35 + index * 11 + i * 47),
        photos: i === 0 && gallery.length ? [gallery[0]] : (i === 2 && gallery[1] ? [gallery[1]] : [])
      };
    });
  }

  function makeSpot(index, item, city, cover) {
    return {
      id: 's' + (293 + index),
      title: item.title,
      category: item.category,
      city: city,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      price: item.price || 0,
      cover: cover,
      images: [cover],
      description: item.description,
      tags: item.tags,
      creatorId: ['u1', 'u2', 'u3', 'u4', 'u5'][index % 5],
      createdAt: hoursAgo(3 + index * 2),
      views: 180 + index * 17,
      favorites: [index % 2 ? 'u3' : 'u4', 'u1'],
      likes: [index % 3 ? 'u2' : 'u5', 'u4'],
      comments: makeComments(item.category, index, item.review, [cover]),
      live: [],
      warns: []
    };
  }

  var groups = [
    {
      city: "石家庄",
      spots: [
        {
          title: "正定古城·隆兴寺", category: "other",
          address: "正定县中山东路 109 号", lat: 38.146, lng: 114.577, price: 50,
          cover: "city-photos/s293.jpg",
          description: "正定古城里的千年古刹，摩尼殿、大悲阁和转轮藏都值得细看；逛完沿城墙走一段，古城的轮廓很完整。",
          tags: ["正定古城", "隆兴寺", "古建", "古城"],
          review: "摩尼殿的倒坐观音很震撼，寺里很安静，建议上午来，顺路把古城墙也走一圈。"
        },
        {
          title: "赵州桥", category: "other",
          address: "赵县赵州镇洨河上", lat: 37.75, lng: 114.776, price: 40,
          cover: "city-photos/s294.jpg",
          description: "隋代修建的石拱桥，桥身的敞肩拱和栏板雕刻一直保存到今天；景区不大，适合和柏林禅寺一起安排半天。",
          tags: ["赵州桥", "古桥", "隋代", "赵县"],
          review: "桥比想象中更有分量，站在桥头看洨河很安静，适合带孩子来补一节历史课。"
        },
        {
          title: "河北博物院", category: "photo",
          address: "长安区东大街 4 号", lat: 38.036, lng: 114.517, price: 0,
          cover: "city-photos/s295.jpg",
          description: "河北博物院的长信宫灯、金缕玉衣和中山国文物是镇馆之宝；展厅动线清楚，两三个小时能看得很充实。",
          tags: ["博物院", "长信宫灯", "金缕玉衣", "免费"],
          review: "长信宫灯实物比课本上精致太多，免费预约就能进，周一闭馆记得避开。"
        },
        {
          title: "苍岩山", category: "nature",
          address: "井陉县苍岩山镇", lat: 37.833, lng: 114.017, price: 70,
          cover: "city-photos/s296.jpg",
          description: "太行山里的峡谷和悬空寺，桥楼殿横跨两崖之间；山道石阶多，穿防滑鞋慢慢走。",
          tags: ["苍岩山", "悬空寺", "太行山", "爬山"],
          review: "桥楼殿架在两座山崖之间，照片拍不出那种悬空感，秋天山里颜色最好。"
        },
        {
          title: "西柏坡", category: "other",
          address: "平山县西柏坡镇", lat: 38.335, lng: 113.94, price: 0,
          cover: "city-photos/s297.jpg",
          description: "中国革命圣地之一，旧址群和纪念馆都在山坳里；适合安排半天，安静地了解那段历史。",
          tags: ["西柏坡", "纪念馆", "红色旅游", "免费"],
          review: "纪念馆的史料很扎实，旧址群保存得完整，山里空气也好，适合慢慢看。"
        },
        {
          title: "火车头步行街", category: "food",
          address: "桥西区中山西路老火车站片区", lat: 38.043, lng: 114.505, price: 0,
          cover: "city-photos/s298.jpg",
          description: "石家庄老火车站附近的商业街区，复古火车头和夜市摊位是标志；晚上来吃小吃、拍照都合适。",
          tags: ["火车头", "夜市", "小吃", "拍照"],
          review: "火车头前拍照的人不少，夜市小吃价格实在，晚上来更有气氛。"
        }
      ]
    },
    {
      city: "太原",
      spots: [
        {
          title: "晋祠", category: "other",
          address: "晋源区晋祠镇", lat: 37.708, lng: 112.43, price: 80,
          cover: "city-photos/s299.jpg",
          description: "晋祠的圣母殿、鱼沼飞梁和难老泉是宋代园林与建筑的精华；古树很多，夏天也很凉快。",
          tags: ["晋祠", "宋代建筑", "难老泉", "古树"],
          review: "圣母殿的宋代彩塑很细腻，难老泉边坐一会儿很舒服，建议留足半天。"
        },
        {
          title: "山西博物院", category: "photo",
          address: "万柏林区滨河西路北段 13 号", lat: 37.858, lng: 112.517, price: 0,
          cover: "city-photos/s300.jpg",
          description: "山西博物院的鸟尊、晋侯青铜器和北朝壁画都值得看；免费预约，展馆很大，慢慢逛要半天。",
          tags: ["博物院", "鸟尊", "青铜器", "免费"],
          review: "鸟尊比想象中精致，青铜器展厅值得慢慢看，记得提前预约。"
        },
        {
          title: "双塔寺·永祚寺", category: "photo",
          address: "迎泽区郝庄镇郝庄村", lat: 37.842, lng: 112.594, price: 30,
          cover: "city-photos/s301.jpg",
          description: "太原城东南的明代双塔，登塔可以看城市全景；寺里的牡丹和砖雕也值得顺路一看。",
          tags: ["双塔寺", "永祚寺", "明代", "登塔"],
          review: "登塔的台阶有点窄，但上去后看太原城很开阔，春天牡丹开的时候最好看。"
        },
        {
          title: "蒙山大佛", category: "other",
          address: "晋源区寺底村", lat: 37.741, lng: 112.443, price: 70,
          cover: "city-photos/s302.jpg",
          description: "北齐开凿的摩崖大佛，佛首后来修复，山谷里的步道很安静；和晋祠可以安排在同一天。",
          tags: ["蒙山大佛", "北齐", "摩崖", "徒步"],
          review: "大佛在山谷里很安静，沿路树荫多，走上去大概半小时，和晋祠顺路。"
        },
        {
          title: "柳巷·钟楼街", category: "food",
          address: "迎泽区柳巷、钟楼街", lat: 37.87, lng: 112.562, price: 0,
          cover: "city-photos/s303.jpg",
          description: "太原老城的商业街，钟楼街改造后老字号和新店混在一起；晚上灯亮起来适合边逛边吃。",
          tags: ["柳巷", "钟楼街", "小吃", "夜逛"],
          review: "晚上钟楼街灯一亮很有老太原的味道，老鼠窟的元宵和六味斋都能顺路吃到。"
        },
        {
          title: "汾河公园", category: "nature",
          address: "迎泽区汾河两岸", lat: 37.865, lng: 112.545, price: 0,
          cover: "city-photos/s304.jpg",
          description: "汾河穿城而过的带状公园，傍晚沿河骑车或散步很舒服；两岸步道连起来很长，可以只走一段。",
          tags: ["汾河", "公园", "骑行", "免费"],
          review: "傍晚在汾河边骑车很舒服，水面和城市灯光一起亮起来，风也凉快。"
        }
      ]
    },
    {
      city: "呼和浩特",
      spots: [
        {
          title: "大召寺", category: "other",
          address: "玉泉区大召前街", lat: 40.797, lng: 111.657, price: 35,
          cover: "city-photos/s305.jpg",
          description: "呼和浩特最早兴建的藏传佛教寺院之一，银佛、龙雕和壁画是看点；门口就是塞上老街。",
          tags: ["大召寺", "藏传佛教", "银佛", "古街"],
          review: "大召的银佛和壁画很精致，出来就是塞上老街，可以一起逛。"
        },
        {
          title: "塞上老街", category: "food",
          address: "玉泉区塞上老街", lat: 40.798, lng: 111.655, price: 0,
          cover: "city-photos/s306.jpg",
          description: "大召寺旁的老街，青砖灰瓦的铺面卖奶制品、牛肉干和手工艺品；适合边逛边吃。",
          tags: ["塞上老街", "奶制品", "手工艺", "小吃"],
          review: "奶皮子和奶豆腐都能试吃，街上还有卖马头琴的小店，慢慢逛挺有意思。"
        },
        {
          title: "内蒙古博物院", category: "photo",
          address: "新城区新华东街 27 号", lat: 40.842, lng: 111.73, price: 0,
          cover: "city-photos/s307.jpg",
          description: "看恐龙化石、匈奴和鲜卑文物的地方，草原文化展厅很系统；免费预约，适合安排半天。",
          tags: ["内蒙古博物院", "恐龙化石", "草原文化", "免费"],
          review: "恐龙展厅比想象中大，草原文化部分很有收获，免费预约很方便。"
        },
        {
          title: "昭君博物院", category: "other",
          address: "玉泉区南郊大黑河畔", lat: 40.733, lng: 111.651, price: 30,
          cover: "city-photos/s308.jpg",
          description: "以王昭君墓为核心的文化园区，封土堆和青冢的故事在草原边上；和市区的大召寺可以一天串起来。",
          tags: ["昭君墓", "青冢", "历史", "文化"],
          review: "青冢在草原边很开阔，展馆讲昭君出塞的故事，适合和历史一起看。"
        },
        {
          title: "敕勒川草原", category: "nature",
          address: "新城区呼和塔拉草原", lat: 40.9, lng: 111.8, price: 0,
          cover: "city-photos/s309.jpg",
          description: "呼和浩特城北的草原，夏天草绿时很适合骑车和野餐；傍晚看日落很开阔。",
          tags: ["敕勒川", "草原", "骑行", "日落"],
          review: "夏天草绿的时候很舒服，租个自行车骑一圈，傍晚日落特别开阔。"
        },
        {
          title: "宽巷子·回民区小吃", category: "food",
          address: "回民区宽巷子", lat: 40.815, lng: 111.665, price: 30,
          cover: "city-photos/s310.jpg",
          description: "呼和浩特回民区的老小吃街，烧麦、羊杂碎和焙子都是本地人的早餐；早上来最热闹。",
          tags: ["宽巷子", "烧麦", "羊杂碎", "早点"],
          review: "烧麦皮薄馅大，配一碗羊杂碎很满足，早上人最多，要早点去。"
        }
      ]
    },
    {
      city: "沈阳",
      spots: [
        {
          title: "沈阳故宫", category: "other",
          address: "沈河区沈阳路 171 号", lat: 41.796, lng: 123.456, price: 50,
          cover: "city-photos/s311.jpg",
          description: "清朝入关前的皇宫，大政殿、十王亭和凤凰楼保留着满族宫殿格局；比北京故宫小，细节却很密。",
          tags: ["沈阳故宫", "清初皇宫", "大政殿", "古建"],
          review: "大政殿和十王亭的布局很特别，人比北京故宫少，可以慢慢看。"
        },
        {
          title: "张氏帅府", category: "other",
          address: "沈河区朝阳街少帅府巷 46 号", lat: 41.792, lng: 123.458, price: 48,
          cover: "city-photos/s312.jpg",
          description: "张作霖、张学良父子的官邸和私宅，大青楼、小青楼和赵四小姐楼连成一片；近代史细节很多。",
          tags: ["张氏帅府", "大青楼", "少帅", "近代史"],
          review: "大青楼的房间和家具保存得很好，讲解能听到不少奉系往事，建议请讲解。"
        },
        {
          title: "北陵公园·昭陵", category: "nature",
          address: "皇姑区泰山路 12 号", lat: 41.85, lng: 123.43, price: 20,
          cover: "city-photos/s313.jpg",
          description: "清太宗皇太极的昭陵在公园深处，松林和古建筑连成一片；春天樱花、秋天银杏都好看。",
          tags: ["北陵", "昭陵", "松林", "公园"],
          review: "从公园门口走到昭陵很舒服，松树很老，秋天银杏黄的时候特别好看。"
        },
        {
          title: "中街步行街", category: "food",
          address: "沈河区中街", lat: 41.798, lng: 123.458, price: 0,
          cover: "city-photos/s314.jpg",
          description: "沈阳老牌商业街，老字号、商场和小吃店集中；晚上灯亮起来适合逛吃。",
          tags: ["中街", "步行街", "老字号", "小吃"],
          review: "中街很长，老边饺子和中街大果都值得试，晚上比白天热闹。"
        },
        {
          title: "西塔韩国风情街", category: "food",
          address: "和平区西塔街", lat: 41.808, lng: 123.425, price: 60,
          cover: "city-photos/s315.jpg",
          description: "沈阳西塔一带的朝鲜族街区，烤肉、冷面和打糕店密集；晚上霓虹灯亮起来很有气氛。",
          tags: ["西塔", "朝鲜族", "烤肉", "冷面"],
          review: "西塔的烤肉和冷面都很地道，街上韩语招牌很多，晚上来更有气氛。"
        },
        {
          title: "沈阳世博园", category: "nature",
          address: "浑南区双园路 301 号", lat: 41.733, lng: 123.633, price: 50,
          cover: "city-photos/s316.jpg",
          description: "浑河边的园林博览园，百合塔、花海和各个城市展园适合散步拍照；春天郁金香开的时候最好看。",
          tags: ["世博园", "百合塔", "花海", "亲子"],
          review: "园区很大，租个代步车比较省力，春天花开的时候很适合拍照。"
        }
      ]
    },
    {
      city: "长春",
      spots: [
        {
          title: "伪满皇宫博物院", category: "other",
          address: "宽城区光复北路 5 号", lat: 43.905, lng: 125.353, price: 70,
          cover: "city-photos/s317.jpg",
          description: "溥仪在长春的宫廷旧址，勤民楼、缉熙楼和同德殿记录着伪满时期的历史；展陈很细，建议留半天。",
          tags: ["伪满皇宫", "溥仪", "近代史", "博物馆"],
          review: "同德殿和缉熙楼保存完整，展览资料很多，看完对那段历史理解更深。"
        },
        {
          title: "净月潭国家森林公园", category: "nature",
          address: "南关区净月大街 5840 号", lat: 43.766, lng: 125.463, price: 30,
          cover: "city-photos/s318.jpg",
          description: "长春东南的大片森林和水库，环潭路适合骑行和徒步；秋天层林尽染，冬天有雪景。",
          tags: ["净月潭", "森林", "骑行", "徒步"],
          review: "环潭骑行一圈很过瘾，树荫多空气好，秋天颜色最丰富。"
        },
        {
          title: "长影旧址博物馆", category: "photo",
          address: "朝阳区红旗街 1118 号", lat: 43.861, lng: 125.289, price: 90,
          cover: "city-photos/s319.jpg",
          description: "长春电影制片厂的老厂区，洗印车间、摄影棚和道具展讲述新中国电影史；适合电影迷慢慢看。",
          tags: ["长影", "电影", "摄影棚", "博物馆"],
          review: "老摄影棚和道具展很有意思，能了解新中国电影怎么拍出来的。"
        },
        {
          title: "南湖公园", category: "nature",
          address: "朝阳区工农大路 2715 号", lat: 43.86, lng: 125.304, price: 0,
          cover: "city-photos/s320.jpg",
          description: "长春市区的老公园，湖面很大，夏天划船、冬天冰上活动都热闹；傍晚沿湖走一圈很舒服。",
          tags: ["南湖公园", "划船", "冰上", "免费"],
          review: "湖面比想象中大，夏天傍晚沿湖散步很舒服，冬天还能滑冰。"
        },
        {
          title: "桂林路美食街", category: "food",
          address: "朝阳区桂林路", lat: 43.855, lng: 125.3, price: 40,
          cover: "city-photos/s321.jpg",
          description: "长春年轻人常去的商业街，烤串、麻辣烫和甜品店密集；晚上灯亮后适合边走边吃。",
          tags: ["桂林路", "小吃", "烧烤", "夜逛"],
          review: "桂林路吃的很多，烤串和甜品都不错，晚上学生多很热闹。"
        },
        {
          title: "这有山", category: "fun",
          address: "朝阳区红旗街 959 号", lat: 43.862, lng: 125.297, price: 0,
          cover: "city-photos/s322.jpg",
          description: "商场里做成的山城街区，顺着坡道往上逛，小店、餐饮和展览混在一起；适合下雨天或晚上来。",
          tags: ["这有山", "文创", "商场", "拍照"],
          review: "室内做成山坡很有意思，一层层逛上去有小店和吃的，拍照也好看。"
        }
      ]
    },
    {
      city: "哈尔滨",
      spots: [
        {
          title: "中央大街", category: "other",
          address: "道里区中央大街", lat: 45.773, lng: 126.617, price: 0,
          cover: "city-photos/s323.jpg",
          description: "哈尔滨最热闹的百年步行街，面包石路面两侧是巴洛克和折衷主义建筑；冬天有冰雕，夏天有街头音乐。",
          tags: ["中央大街", "面包石", "欧式建筑", "步行街"],
          review: "面包石路走起来很有年代感，两侧老建筑保存很好，马迭尔冰棍一定要吃。"
        },
        {
          title: "圣索菲亚大教堂", category: "photo",
          address: "道里区透笼街 88 号", lat: 45.771, lng: 126.621, price: 20,
          cover: "city-photos/s324.jpg",
          description: "拜占庭风格的东正教堂，绿色穹顶和红砖墙是哈尔滨的标志；广场上拍全景最好看。",
          tags: ["索菲亚教堂", "拜占庭", "建筑", "拍照"],
          review: "教堂广场拍照很出片，进去看老照片展也能了解哈尔滨的过去。"
        },
        {
          title: "松花江·防洪纪念塔", category: "nature",
          address: "道里区中央大街北端松花江畔", lat: 45.782, lng: 126.618, price: 0,
          cover: "city-photos/s325.jpg",
          description: "中央大街走到头就是松花江边的防洪纪念塔，夏天江风很舒服，冬天江面结冰可以玩冰上项目。",
          tags: ["松花江", "防洪纪念塔", "江边", "免费"],
          review: "从中央大街走到江边很近，夏天吹江风很舒服，冬天江上全是冰上活动。"
        },
        {
          title: "太阳岛", category: "nature",
          address: "松北区太阳岛风景区", lat: 45.792, lng: 126.596, price: 30,
          cover: "city-photos/s326.jpg",
          description: "松花江北岸的公园岛，夏天草坪和湿地适合野餐，冬天有雪博会；坐缆车或轮渡过江都方便。",
          tags: ["太阳岛", "湿地", "雪博会", "野餐"],
          review: "岛上绿地很大，夏天野餐很舒服，坐缆车过江还能看松花江全景。"
        },
        {
          title: "老道外·中华巴洛克", category: "other",
          address: "道外区靖宇街", lat: 45.768, lng: 126.648, price: 0,
          cover: "city-photos/s327.jpg",
          description: "老道外的中华巴洛克街区，前店后院的商住建筑和浮雕外墙很有味道；适合找一家老字号吃顿东北菜。",
          tags: ["老道外", "中华巴洛克", "老街", "东北菜"],
          review: "建筑外墙的浮雕很特别，街区里老字号不少，吃一顿锅包肉很满足。"
        },
        {
          title: "冰雪大世界", category: "night",
          address: "松北区松北大道", lat: 45.815, lng: 126.59, price: 300,
          cover: "city-photos/s328.jpg",
          description: "冬天用松花江冰块搭起来的冰雪主题园，晚上灯光亮起像一座冰城；一定要穿厚衣服和防滑鞋。",
          tags: ["冰雪大世界", "冰雕", "夜景", "冬季"],
          review: "晚上灯亮起来很震撼，冰滑梯要排队，穿最厚的衣服去才不会冻透。"
        }
      ]
    },
    {
      city: "郑州",
      spots: [
        {
          title: "河南博物院", category: "photo",
          address: "金水区农业路 8 号", lat: 34.79, lng: 113.673, price: 0,
          cover: "city-photos/s329.jpg",
          description: "河南博物院的莲鹤方壶、贾湖骨笛和妇好鸮尊都值得看；华夏古乐演出每天有场次。",
          tags: ["河南博物院", "莲鹤方壶", "骨笛", "免费"],
          review: "莲鹤方壶比照片精致，古乐演出很惊喜，免费预约要提前。"
        },
        {
          title: "二七广场·德化街", category: "food",
          address: "二七区德化街", lat: 34.752, lng: 113.665, price: 0,
          cover: "city-photos/s330.jpg",
          description: "郑州老城中心的商业区，二七纪念塔和德化街步行街连在一起；晚上小吃和商场都热闹。",
          tags: ["二七广场", "德化街", "小吃", "步行街"],
          review: "二七塔晚上灯光好看，德化街小吃多，逛街吃夜宵都方便。"
        },
        {
          title: "郑州黄河文化公园", category: "nature",
          address: "惠济区黄河南岸", lat: 34.93, lng: 113.43, price: 60,
          cover: "city-photos/s331.jpg",
          description: "黄河边的文化公园，炎黄二帝巨塑、黄河碑林和河岸风光都在这里；坐索道可以看黄河全景。",
          tags: ["黄河", "炎黄二帝", "索道", "文化"],
          review: "炎黄二帝巨塑很震撼，坐索道看黄河很开阔，风大记得带外套。"
        },
        {
          title: "只有河南·戏剧幻城", category: "fun",
          address: "中牟县大孟镇", lat: 34.76, lng: 113.95, price: 290,
          cover: "city-photos/s332.jpg",
          description: "以河南历史为题材的沉浸式戏剧园，十几个剧场在夯土墙之间展开；一天看不完，建议选重点场次。",
          tags: ["只有河南", "戏剧幻城", "沉浸式", "演出"],
          review: "剧场一个接一个，演员很投入，夯土墙的建筑本身也很震撼，值得留一整天。"
        },
        {
          title: "嵩山少林寺", category: "other",
          address: "登封市嵩山少林景区", lat: 34.507, lng: 112.935, price: 80,
          cover: "city-photos/s333.jpg",
          description: "嵩山脚下的禅宗祖庭和少林功夫发源地，塔林、常住院和武术表演是看点；从郑州出发约一个半小时。",
          tags: ["少林寺", "嵩山", "塔林", "武术"],
          review: "塔林很安静，武术表演时间要提前看好，景区大，穿舒服的鞋。"
        },
        {
          title: "方中山胡辣汤·顺城街", category: "food",
          address: "管城回族区顺城街", lat: 34.748, lng: 113.67, price: 15,
          cover: "city-photos/s334.jpg",
          description: "郑州人早餐排队喝的胡辣汤老店，配油馍头和水煎包最地道；早上七点前到不用等太久。",
          tags: ["胡辣汤", "方中山", "早餐", "本地"],
          review: "胡辣汤又辣又香，配油馍头很过瘾，早上排队的人很多，要早点去。"
        }
      ]
    },
    {
      city: "合肥",
      spots: [
        {
          title: "包公园", category: "other",
          address: "包河区芜湖路 72 号", lat: 31.858, lng: 117.293, price: 50,
          cover: "city-photos/s335.jpg",
          description: "纪念包拯的园林景区，包公祠、清风阁和浮庄沿包河展开；夏天荷花开了很好看。",
          tags: ["包公园", "包公祠", "荷花", "园林"],
          review: "包公祠和清风阁都能逛，河边荷花夏天很漂亮，适合慢慢走半天。"
        },
        {
          title: "安徽博物院", category: "photo",
          address: "蜀山区怀宁路 87 号", lat: 31.81, lng: 117.22, price: 0,
          cover: "city-photos/s336.jpg",
          description: "安徽博物院的楚大鼎、徽州古建筑和文房四宝展都值得看；新馆空间大，建议留两三个小时。",
          tags: ["安徽博物院", "楚大鼎", "徽州", "免费"],
          review: "徽州建筑展厅做得很有味道，楚大鼎很震撼，免费预约就能进。"
        },
        {
          title: "三河古镇", category: "other",
          address: "肥西县三河镇", lat: 31.51, lng: 117.25, price: 0,
          cover: "city-photos/s337.jpg",
          description: "肥西的水乡古镇，三河交汇，古街、城隍庙和一人巷都保留着；米饺和酥鸭是本地小吃。",
          tags: ["三河古镇", "水乡", "古街", "米饺"],
          review: "古镇不大但很完整，沿河走一圈很舒服，三河米饺趁热吃最好。"
        },
        {
          title: "巢湖·姥山岛", category: "nature",
          address: "巢湖市中庙镇", lat: 31.6, lng: 117.45, price: 60,
          cover: "city-photos/s338.jpg",
          description: "巢湖湖心的姥山岛，坐船上岛后可以环岛走一圈，文峰塔和湖景都值得看；湖风大，带件外套。",
          tags: ["巢湖", "姥山岛", "坐船", "湖景"],
          review: "坐船上岛很舒服，文峰塔上能看到整个巢湖，湖边风大记得带外套。"
        },
        {
          title: "罍街", category: "food",
          address: "包河区宁国南路", lat: 31.835, lng: 117.3, price: 50,
          cover: "city-photos/s339.jpg",
          description: "合肥的夜市美食街，小龙虾、烧烤和安徽小吃集中；晚上灯亮后适合和朋友边吃边聊。",
          tags: ["罍街", "夜市", "小龙虾", "烧烤"],
          review: "晚上罍街很热闹，小龙虾和烧烤都不错，价格比景区实在。"
        },
        {
          title: "逍遥津公园", category: "nature",
          address: "庐阳区寿春路 16 号", lat: 31.866, lng: 117.29, price: 0,
          cover: "city-photos/s340.jpg",
          description: "合肥老城区的公园，三国逍遥津的古战场故事和湖面、游乐设施混在一起；适合带孩子来。",
          tags: ["逍遥津", "公园", "三国", "亲子"],
          review: "湖边走走很舒服，游乐设施适合带小朋友，春天花开的时候最好看。"
        }
      ]
    },
    {
      city: "南昌",
      spots: [
        {
          title: "滕王阁", category: "other",
          address: "东湖区仿古街 58 号", lat: 28.68, lng: 115.881, price: 50,
          cover: "city-photos/s341.jpg",
          description: "江南三大名楼之一，滕王阁立在赣江边，登楼可以看江景和南昌城；晚上灯光亮起更壮观。",
          tags: ["滕王阁", "赣江", "名楼", "夜景"],
          review: "登楼看赣江很开阔，阁里的《滕王阁序》相关展陈值得看，傍晚来最好。"
        },
        {
          title: "八一广场·八一起义纪念馆", category: "other",
          address: "西湖区中山路 380 号", lat: 28.676, lng: 115.89, price: 0,
          cover: "city-photos/s342.jpg",
          description: "南昌的城市中心，八一南昌起义纪念塔和纪念馆记录着那段历史；广场周边商场和小吃也多。",
          tags: ["八一广场", "八一起义", "纪念馆", "免费"],
          review: "纪念塔很壮观，纪念馆的史料很扎实，看完在周边吃点东西很方便。"
        },
        {
          title: "万寿宫历史文化街区", category: "photo",
          address: "西湖区船山路", lat: 28.672, lng: 115.885, price: 0,
          cover: "city-photos/s343.jpg",
          description: "南昌老城的万寿宫街区，青砖马头墙和赣派建筑里开着茶馆、小吃和手作店；晚上灯笼亮起很有味道。",
          tags: ["万寿宫", "赣派建筑", "老街", "夜景"],
          review: "街区的老建筑修得很好，晚上灯笼亮起来很适合拍照，小吃也不少。"
        },
        {
          title: "秋水广场·赣江夜景", category: "night",
          address: "红谷滩区赣江中大道", lat: 28.686, lng: 115.858, price: 0,
          cover: "city-photos/s344.jpg",
          description: "赣江边的市民广场，晚上有音乐喷泉和两岸灯光秀；江风很舒服，适合饭后散步。",
          tags: ["秋水广场", "喷泉", "赣江", "夜景"],
          review: "晚上喷泉和两岸灯光一起亮，江风很舒服，记得看喷泉开放时间。"
        },
        {
          title: "南昌之星摩天轮", category: "fun",
          address: "红谷滩区赣江南大道", lat: 28.65, lng: 115.845, price: 50,
          cover: "city-photos/s345.jpg",
          description: "赣江边的摩天轮，转一圈约半小时，轿厢里可以看南昌城和江景；日落前上轮最好看。",
          tags: ["摩天轮", "南昌之星", "日落", "江景"],
          review: "日落前上去能看到城市慢慢亮灯，轿厢很稳，适合两个人慢慢坐一圈。"
        },
        {
          title: "绳金塔美食街", category: "food",
          address: "西湖区绳金塔街", lat: 28.665, lng: 115.886, price: 40,
          cover: "city-photos/s346.jpg",
          description: "绳金塔旁的老美食街，瓦罐汤、拌粉和白糖糕都能找到；适合晚上来吃一顿南昌味。",
          tags: ["绳金塔", "瓦罐汤", "拌粉", "小吃"],
          review: "瓦罐汤和拌粉都很地道，绳金塔晚上灯光也好看，适合边吃边逛。"
        }
      ]
    },
    {
      city: "贵阳",
      spots: [
        {
          title: "甲秀楼", category: "photo",
          address: "南明区翠微巷 8 号", lat: 26.566, lng: 106.716, price: 0,
          cover: "city-photos/s347.jpg",
          description: "南明河上的明代楼阁，浮玉桥和甲秀楼的倒影是贵阳的标志；晚上灯光亮起后最好看。",
          tags: ["甲秀楼", "南明河", "夜景", "免费"],
          review: "晚上甲秀楼和浮玉桥的灯光倒影很漂亮，河边散步很舒服。"
        },
        {
          title: "黔灵山公园", category: "nature",
          address: "云岩区枣山路 187 号", lat: 26.596, lng: 106.7, price: 5,
          cover: "city-photos/s348.jpg",
          description: "贵阳市区的山地公园，猕猴、弘福寺和黔灵湖是主要看点；山路多，注意别喂猴子。",
          tags: ["黔灵山", "猕猴", "弘福寺", "爬山"],
          review: "山上的猴子很多，别拿塑料袋容易抢，弘福寺很安静，爬到山顶看贵阳全景。"
        },
        {
          title: "青岩古镇", category: "other",
          address: "花溪区青岩镇", lat: 26.33, lng: 106.68, price: 10,
          cover: "city-photos/s349.jpg",
          description: "贵阳南郊的明清古镇，青石板路、古城墙和状元府保存完整；卤猪脚和玫瑰糖是本地特产。",
          tags: ["青岩古镇", "明清建筑", "卤猪脚", "古镇"],
          review: "古镇的石板路很有年代感，卤猪脚和糕粑稀饭都好吃，周末人多建议早去。"
        },
        {
          title: "花溪公园", category: "nature",
          address: "花溪区花溪大道南段", lat: 26.41, lng: 106.67, price: 0,
          cover: "city-photos/s350.jpg",
          description: "贵阳南郊的老公园，花溪河穿园而过，草坪和树林适合野餐；夏天很凉快。",
          tags: ["花溪公园", "草坪", "野餐", "免费"],
          review: "河边草坪很舒服，夏天带块野餐垫能坐一下午，水很清。"
        },
        {
          title: "贵州省博物馆", category: "photo",
          address: "观山湖区林城东路 107 号", lat: 26.65, lng: 106.625, price: 0,
          cover: "city-photos/s351.jpg",
          description: "贵州省博物馆的民族服饰、银饰和古生物化石都很有特色；新馆建筑本身也值得看。",
          tags: ["贵州省博物馆", "民族服饰", "银饰", "免费"],
          review: "少数民族服饰和银饰展厅很惊艳，免费预约，建筑拍照也好看。"
        },
        {
          title: "二七路小吃街", category: "food",
          address: "南明区二七路", lat: 26.57, lng: 106.715, price: 30,
          cover: "city-photos/s352.jpg",
          description: "贵阳老城区的小吃街，肠旺面、丝娃娃、豆腐圆子和烤脑花都能找到；晚上最热闹。",
          tags: ["二七路", "肠旺面", "丝娃娃", "小吃"],
          review: "肠旺面和丝娃娃都值得试，晚上摊位全开很热闹，价格也便宜。"
        }
      ]
    },
    {
      city: "拉萨",
      spots: [
        {
          title: "布达拉宫", category: "other",
          address: "城关区北京中路 35 号", lat: 29.658, lng: 91.117, price: 200,
          cover: "city-photos/s353.jpg",
          description: "红山上的宫堡式建筑群，白宫、红宫和灵塔殿层层叠叠；门票需要提前预约，参观时注意高原反应。",
          tags: ["布达拉宫", "红宫", "世界遗产", "预约"],
          review: "从广场看布达拉宫就很震撼，进去参观要慢慢走，台阶多注意高反。"
        },
        {
          title: "大昭寺·八廓街", category: "other",
          address: "城关区八廓西街", lat: 29.653, lng: 91.132, price: 85,
          cover: "city-photos/s354.jpg",
          description: "藏传佛教最重要的寺院之一，释迦牟尼十二岁等身像和转经道都很神圣；八廓街适合慢慢逛。",
          tags: ["大昭寺", "八廓街", "转经", "藏文化"],
          review: "大昭寺里酥油灯的味道很浓，跟着转经的人走一圈，能感受到拉萨的日常。"
        },
        {
          title: "罗布林卡", category: "nature",
          address: "城关区罗布林卡路 21 号", lat: 29.655, lng: 91.1, price: 60,
          cover: "city-photos/s355.jpg",
          description: "历代达赖喇嘛的夏宫园林，宫殿、草坪和古树在拉萨河边；夏天有雪顿节活动。",
          tags: ["罗布林卡", "夏宫", "园林", "雪顿节"],
          review: "园子里树很多，夏天很凉快，宫殿的壁画很精致，适合慢慢逛半天。"
        },
        {
          title: "色拉寺", category: "other",
          address: "城关区色拉路 1 号", lat: 29.7, lng: 91.133, price: 50,
          cover: "city-photos/s356.jpg",
          description: "拉萨北郊的三大寺之一，辩经场每天下午很热闹；寺后的山路上可以看拉萨城。",
          tags: ["色拉寺", "辩经", "藏传佛教", "寺庙"],
          review: "下午的辩经很生动，虽然听不懂但气氛很感染人，寺里很安静。"
        },
        {
          title: "宗角禄康公园", category: "nature",
          address: "城关区布达拉宫背后", lat: 29.66, lng: 91.115, price: 0,
          cover: "city-photos/s357.jpg",
          description: "布达拉宫背后的公园，龙王潭水面上能拍到布达拉宫的倒影；清晨有很多本地人转经散步。",
          tags: ["宗角禄康", "龙王潭", "倒影", "免费"],
          review: "清晨在龙王潭边拍布达拉宫倒影最美，公园里转经的人很多，很安静。"
        },
        {
          title: "光明港琼甜茶馆", category: "food",
          address: "城关区藏医院路", lat: 29.652, lng: 91.125, price: 15,
          cover: "city-photos/s358.jpg",
          description: "拉萨老城的甜茶馆，一壶甜茶配藏面就是本地人的早餐；店里热闹又便宜。",
          tags: ["甜茶馆", "藏面", "甜茶", "本地"],
          review: "甜茶一壶几块钱，藏面很香，店里都是本地人，坐着发呆很舒服。"
        }
      ]
    },
    {
      city: "兰州",
      spots: [
        {
          title: "中山桥·黄河风情线", category: "photo",
          address: "城关区滨河路", lat: 36.066, lng: 103.822, price: 0,
          cover: "city-photos/s359.jpg",
          description: "黄河上第一座铁桥，百年桥身连接两岸，傍晚灯光亮起后在桥上走很舒服；沿黄河风情线可以一路散步。",
          tags: ["中山桥", "黄河", "铁桥", "夜景"],
          review: "中山桥晚上灯光很好看，沿着黄河边走一段，风很舒服。"
        },
        {
          title: "甘肃省博物馆", category: "photo",
          address: "七里河区西津西路 3 号", lat: 36.066, lng: 103.78, price: 0,
          cover: "city-photos/s360.jpg",
          description: "甘肃省博物馆的铜奔马、彩陶和丝绸之路文物是看点；免费预约，建议留两三个小时。",
          tags: ["甘肃省博物馆", "铜奔马", "彩陶", "免费"],
          review: "铜奔马实物很生动，丝绸之路展厅很有意思，免费预约记得提前。"
        },
        {
          title: "白塔山公园", category: "nature",
          address: "城关区北滨河中路", lat: 36.07, lng: 103.82, price: 0,
          cover: "city-photos/s361.jpg",
          description: "黄河北岸的山头公园，白塔和寺庙依山而建，山顶可以俯瞰中山桥和兰州城；傍晚上去看日落最好。",
          tags: ["白塔山", "俯瞰", "日落", "免费"],
          review: "爬上去大概半小时，山顶看中山桥和黄河转弯很开阔，傍晚风很凉快。"
        },
        {
          title: "五泉山公园", category: "nature",
          address: "城关区五泉南路", lat: 36.045, lng: 103.835, price: 0,
          cover: "city-photos/s362.jpg",
          description: "兰州老公园，五眼泉水和山上的寺庙群是主要看点；早晨有很多人爬山锻炼。",
          tags: ["五泉山", "泉水", "爬山", "免费"],
          review: "早上爬山的人很多，五眼泉的水很清，山上寺庙也值得顺路看看。"
        },
        {
          title: "正宁路夜市", category: "food",
          address: "城关区正宁路", lat: 36.058, lng: 103.83, price: 40,
          cover: "city-photos/s363.jpg",
          description: "兰州最有名的夜市，牛奶鸡蛋醪糟、烤羊肉和酿皮一路排开；晚上人多，注意看好随身物品。",
          tags: ["正宁路", "夜市", "醪糟", "烤串"],
          review: "牛奶鸡蛋醪糟一定要喝，烤羊肉串也很香，晚上人很多但气氛很好。"
        },
        {
          title: "大众巷·兰州牛肉面", category: "food",
          address: "城关区大众巷", lat: 36.062, lng: 103.827, price: 15,
          cover: "city-photos/s364.jpg",
          description: "兰州老城的小吃巷，牛肉面、灰豆子和甜醅子都能找到；早上来一碗头锅牛肉面最地道。",
          tags: ["兰州牛肉面", "大众巷", "灰豆子", "早餐"],
          review: "牛肉面汤清面筋，早上来一碗很满足，巷子里还有灰豆子和甜醅子。"
        }
      ]
    },
    {
      city: "西宁",
      spots: [
        {
          title: "塔尔寺", category: "other",
          address: "湟中区鲁沙尔镇", lat: 36.49, lng: 101.57, price: 70,
          cover: "city-photos/s365.jpg",
          description: "藏传佛教格鲁派六大寺院之一，酥油花、壁画和堆绣被称为艺术三绝；从西宁出发约一小时。",
          tags: ["塔尔寺", "酥油花", "藏传佛教", "湟中"],
          review: "酥油花馆的细节太精致，寺院依山而建，慢慢走要半天，注意尊重当地习俗。"
        },
        {
          title: "东关清真大寺", category: "other",
          address: "城关区东关大街", lat: 36.62, lng: 101.795, price: 0,
          cover: "city-photos/s366.jpg",
          description: "西宁老城的清真大寺，建筑融合中式与伊斯兰风格；周边是回民聚居区，小吃很多。",
          tags: ["东关清真大寺", "清真", "建筑", "免费"],
          review: "寺庙建筑很有特色，周围的清真小吃也值得尝，进去注意着装。"
        },
        {
          title: "青海省博物馆", category: "photo",
          address: "城西区西关大街 58 号", lat: 36.63, lng: 101.76, price: 0,
          cover: "city-photos/s367.jpg",
          description: "青海省博物馆的彩陶、民族服饰和藏传佛教文物很有特色；免费预约，适合先来了解青海。",
          tags: ["青海省博物馆", "彩陶", "民族", "免费"],
          review: "彩陶和民族服饰展厅很丰富，先来博物馆再逛青海会更有感觉。"
        },
        {
          title: "莫家街", category: "food",
          address: "城中区莫家街", lat: 36.615, lng: 101.79, price: 40,
          cover: "city-photos/s368.jpg",
          description: "西宁老牌小吃街，酿皮、手抓羊肉、酸奶和甜醅都能找到；晚上最热闹。",
          tags: ["莫家街", "酿皮", "酸奶", "小吃"],
          review: "老酸奶和酿皮都好吃，手抓羊肉很实在，晚上来最有气氛。"
        },
        {
          title: "南山公园", category: "nature",
          address: "城中区凤凰山路", lat: 36.61, lng: 101.785, price: 0,
          cover: "city-photos/s369.jpg",
          description: "西宁南边的山地公园，凤凰亭可以俯瞰整座城市；傍晚来看日落和城市灯光很舒服。",
          tags: ["南山公园", "俯瞰", "日落", "免费"],
          review: "爬上凤凰亭看西宁全景很开阔，傍晚日落和城市灯光都好看。"
        },
        {
          title: "水井巷", category: "food",
          address: "城中区水井巷", lat: 36.62, lng: 101.785, price: 30,
          cover: "city-photos/s370.jpg",
          description: "西宁市中心的老市场，藏饰、虫草、牛肉干和各类小吃混在一起；适合买点伴手礼。",
          tags: ["水井巷", "市场", "伴手礼", "小吃"],
          review: "市场里什么都有，牛肉干和酸奶可以尝，买藏饰记得砍价。"
        }
      ]
    },
    {
      city: "银川",
      spots: [
        {
          title: "西夏王陵", category: "other",
          address: "西夏区贺兰山东麓", lat: 38.43, lng: 106.0, price: 75,
          cover: "city-photos/s371.jpg",
          description: "贺兰山下的西夏皇家陵园，夯土陵塔在戈壁里很有苍凉感；博物馆里的西夏文文物值得看。",
          tags: ["西夏王陵", "西夏", "贺兰山", "世界遗产"],
          review: "戈壁里的陵塔很震撼，博物馆能补上西夏历史，风大记得防晒。"
        },
        {
          title: "镇北堡西部影城", category: "photo",
          address: "西夏区镇北堡镇", lat: 38.63, lng: 106.07, price: 100,
          cover: "city-photos/s372.jpg",
          description: "由明清城堡改成的影视基地，《大话西游》等电影在这里取景；黄土城墙和月亮门很适合拍照。",
          tags: ["镇北堡", "西部影城", "大话西游", "拍照"],
          review: "月亮门和土城墙很有电影感，租套服装拍照很出片，园区比想象中大。"
        },
        {
          title: "贺兰山岩画", category: "other",
          address: "贺兰县贺兰山岩画景区", lat: 38.9, lng: 105.9, price: 70,
          cover: "city-photos/s373.jpg",
          description: "贺兰山口的古代岩画，太阳神、动物和人面像刻在石壁上；山里步道不长，适合慢慢看。",
          tags: ["贺兰山岩画", "太阳神", "石刻", "徒步"],
          review: "太阳神岩画很神秘，沿山谷走能看到不少岩画，人少很安静。"
        },
        {
          title: "沙湖", category: "nature",
          address: "平罗县沙湖景区", lat: 38.8, lng: 106.3, price: 120,
          cover: "city-photos/s374.jpg",
          description: "沙漠和湖泊连在一起的景区，坐船穿过芦苇荡可以看到沙丘；适合安排一天。",
          tags: ["沙湖", "沙漠", "芦苇", "坐船"],
          review: "一半湖水一半沙丘很特别，坐船看芦苇荡很舒服，夏天注意防晒。"
        },
        {
          title: "鼓楼·宁园", category: "other",
          address: "兴庆区解放东街", lat: 38.47, lng: 106.28, price: 0,
          cover: "city-photos/s375.jpg",
          description: "银川老城的鼓楼和宁园，周边是商业街和夜市；晚上灯亮后适合散步。",
          tags: ["鼓楼", "宁园", "老城", "免费"],
          review: "鼓楼一带晚上很热闹，宁园里坐坐很安静，周边小吃也多。"
        },
        {
          title: "怀远夜市", category: "food",
          address: "西夏区怀远西路", lat: 38.49, lng: 106.19, price: 30,
          cover: "city-photos/s376.jpg",
          description: "银川本地人爱去的夜市，辣糊糊、烤羊肉串和手工辣条都很有名；晚上人多要排队。",
          tags: ["怀远夜市", "辣糊糊", "烤串", "小吃"],
          review: "辣糊糊和烤串都好吃，价格便宜，晚上学生很多很热闹。"
        }
      ]
    },
    {
      city: "乌鲁木齐",
      spots: [
        {
          title: "新疆国际大巴扎", category: "other",
          address: "天山区解放南路 8 号", lat: 43.78, lng: 87.62, price: 0,
          cover: "city-photos/s377.jpg",
          description: "乌鲁木齐最具代表性的集市，干果、地毯、乐器和中亚风格建筑都集中在这里；晚上灯光亮起很热闹。",
          tags: ["国际大巴扎", "干果", "地毯", "夜景"],
          review: "大巴扎的建筑很有中亚风情，干果和葡萄干可以试吃，晚上灯光最好看。"
        },
        {
          title: "红山公园", category: "nature",
          address: "水磨沟区红山路", lat: 43.81, lng: 87.61, price: 0,
          cover: "city-photos/s378.jpg",
          description: "乌鲁木齐市中心的红山，山顶可以俯瞰整座城市和远处的雪山；傍晚来散步最舒服。",
          tags: ["红山公园", "俯瞰", "雪山", "免费"],
          review: "爬上红山看城市全景很开阔，天气好能看到远处的雪山，傍晚风很舒服。"
        },
        {
          title: "新疆维吾尔自治区博物馆", category: "photo",
          address: "沙依巴克区西北路 581 号", lat: 43.82, lng: 87.59, price: 0,
          cover: "city-photos/s379.jpg",
          description: "新疆博物馆的干尸、丝路文物和民族服饰展厅很有特色；免费预约，适合先了解新疆。",
          tags: ["新疆博物馆", "丝路", "干尸", "免费"],
          review: "丝路文物和民族服饰很丰富，干尸展厅有点震撼，免费预约很方便。"
        },
        {
          title: "天山天池", category: "nature",
          address: "昌吉州阜康市天池景区", lat: 43.89, lng: 88.13, price: 155,
          cover: "city-photos/s380.jpg",
          description: "天山博格达峰下的高山湖泊，湖水蓝绿，沿湖栈道可以走到西王母庙；从乌鲁木齐出发约两小时。",
          tags: ["天山天池", "高山湖", "雪山", "一日游"],
          review: "天池的水颜色很漂亮，坐区间车上山后沿湖走一圈，雪山倒影很震撼。"
        },
        {
          title: "水磨沟公园", category: "nature",
          address: "水磨沟区水磨沟路", lat: 43.8, lng: 87.65, price: 0,
          cover: "city-photos/s381.jpg",
          description: "乌鲁木齐东郊的公园，溪水、树林和山泉在城里很少见；夏天很凉快，适合散步。",
          tags: ["水磨沟", "公园", "溪水", "免费"],
          review: "公园里树很多，溪水很凉快，夏天来避暑散步很舒服。"
        },
        {
          title: "五一星光夜市", category: "food",
          address: "沙依巴克区五一西路", lat: 43.8, lng: 87.59, price: 40,
          cover: "city-photos/s382.jpg",
          description: "乌鲁木齐的老夜市，烤羊肉串、手抓饭、大盘鸡和酸奶都能吃到；晚上灯亮后很有烟火气。",
          tags: ["五一星光夜市", "烤串", "手抓饭", "小吃"],
          review: "烤羊肉串和手抓饭都很香，夜市气氛很热闹，记得空着肚子来。"
        }
      ]
    }
  ];

  var spots = [];
  var index = 0;
  groups.forEach(function (group) {
    group.spots.forEach(function (item) {
      var number = 293 + index;
      var cover = 'city-photos/s' + number + '.jpg';
      spots.push(makeSpot(index, item, group.city, cover));
      index += 1;
    });
  });

  window.W.SeedProvinces = { spots: spots };
})(window);
