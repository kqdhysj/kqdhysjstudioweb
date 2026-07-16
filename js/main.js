const dateTarget = document.querySelector("#current-date");
const timeTarget = document.querySelector("#current-time");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector("#mainnav-list");
const searchForm = document.querySelector(".site-search");
const searchInput = document.querySelector("#site-search-input");
const searchStatus = document.querySelector(".search-status");
const searchResults = document.querySelector("#site-search-results");
const consultationForm = document.querySelector("#consultation-form");
const consultationStatus = document.querySelector("#consultation-form-status");
const backTop = document.querySelector(".back-top");
const accessibilityModeToggle = document.querySelector("#accessibility-mode-toggle");
const accessibilityPanel = document.querySelector("#accessibility-panel");
const readerToggle = document.querySelector("#reader-toggle");
const readerStatus = document.querySelector("#reader-status");
const seniorModeToggle = document.querySelector("#senior-mode-toggle");
const fontIncrease = document.querySelector("#font-increase");
const fontDecrease = document.querySelector("#font-decrease");
const contrastToggle = document.querySelector("#contrast-toggle");
const accessReset = document.querySelector("#access-reset");
const steamPlaceholderButton = document.querySelector(".steam-placeholder__button");
const steamPlaceholderNote = document.querySelector(".steam-placeholder__note");
const weatherCity = document.querySelector("#weather-city");
const weatherCityList = document.querySelector("#weather-city-list");
const weatherRefresh = document.querySelector("#weather-refresh");
const weatherGeolocation = document.querySelector("#weather-geolocation");
const topWeatherSummary = document.querySelector("#top-weather-summary");
const weatherLocation = document.querySelector("#weather-location");
const weatherTemp = document.querySelector("#weather-temp");
const weatherSummary = document.querySelector("#weather-summary");
const weatherApparent = document.querySelector("#weather-apparent");
const weatherHumidity = document.querySelector("#weather-humidity");
const weatherWind = document.querySelector("#weather-wind");
const weatherUpdated = document.querySelector("#weather-updated");
const languageButtons = [...document.querySelectorAll("[data-language]")];
const navLinks = [...document.querySelectorAll(".mainnav__list a")];
const sections = [...document.querySelectorAll(".section-anchor, #main")];
const locationHighlightIds = new Set(["overview", "services"]);
const locationHighlightTimers = new WeakMap();

const defaultWeatherCity = "北京";

const placeNameAliases = {
  "hong kong": { "zh-Hans": "香港", "zh-Hant": "香港", en: "Hong Kong" },
  hongkong: { "zh-Hans": "香港", "zh-Hant": "香港", en: "Hong Kong" },
  hk: { "zh-Hans": "香港", "zh-Hant": "香港", en: "Hong Kong" },
  macao: { "zh-Hans": "澳门", "zh-Hant": "澳門", en: "Macao" },
  macau: { "zh-Hans": "澳门", "zh-Hant": "澳門", en: "Macau" },
  mo: { "zh-Hans": "澳门", "zh-Hant": "澳門", en: "Macao" },
  taiwan: { "zh-Hans": "台湾", "zh-Hant": "台灣", en: "Taiwan" },
  tw: { "zh-Hans": "台湾", "zh-Hant": "台灣", en: "Taiwan" },
  china: { "zh-Hans": "中国", "zh-Hant": "中國", en: "China" },
  cn: { "zh-Hans": "中国", "zh-Hant": "中國", en: "China" },
  "people's republic of china": { "zh-Hans": "中国", "zh-Hant": "中國", en: "China" },
  guangdong: { "zh-Hans": "广东省", "zh-Hant": "廣東省", en: "Guangdong" },
  gd: { "zh-Hans": "广东省", "zh-Hant": "廣東省", en: "Guangdong" },
  beijing: { "zh-Hans": "北京", "zh-Hant": "北京", en: "Beijing" },
  shanghai: { "zh-Hans": "上海", "zh-Hant": "上海", en: "Shanghai" },
  guangzhou: { "zh-Hans": "广州", "zh-Hant": "廣州", en: "Guangzhou" },
  shenzhen: { "zh-Hans": "深圳", "zh-Hant": "深圳", en: "Shenzhen" },
  dongguan: { "zh-Hans": "东莞", "zh-Hant": "東莞", en: "Dongguan" },
  chengdu: { "zh-Hans": "成都", "zh-Hant": "成都", en: "Chengdu" },
  hangzhou: { "zh-Hans": "杭州", "zh-Hant": "杭州", en: "Hangzhou" },
  wuhan: { "zh-Hans": "武汉", "zh-Hant": "武漢", en: "Wuhan" },
  "xi'an": { "zh-Hans": "西安", "zh-Hant": "西安", en: "Xi'an" },
  xian: { "zh-Hans": "西安", "zh-Hant": "西安", en: "Xi'an" },
  nanjing: { "zh-Hans": "南京", "zh-Hant": "南京", en: "Nanjing" },
  chongqing: { "zh-Hans": "重庆", "zh-Hant": "重慶", en: "Chongqing" },
  tianjin: { "zh-Hans": "天津", "zh-Hant": "天津", en: "Tianjin" },
  urumqi: { "zh-Hans": "乌鲁木齐", "zh-Hant": "烏魯木齊", en: "Urumqi" },
  lhasa: { "zh-Hans": "拉萨", "zh-Hant": "拉薩", en: "Lhasa" },
  mohe: { "zh-Hans": "漠河", "zh-Hant": "漠河", en: "Mohe" },
  sanya: { "zh-Hans": "三亚", "zh-Hant": "三亞", en: "Sanya" },
};

const chinaWeatherCities = [
  "北京", "天津", "上海", "重庆", "香港", "澳门", "台北", "高雄", "基隆", "台中", "台南", "新竹", "嘉义",
  "石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水",
  "太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "忻州", "临汾", "吕梁",
  "呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布", "兴安盟", "锡林郭勒盟", "阿拉善盟",
  "沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛",
  "长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边",
  "哈尔滨", "齐齐哈尔", "鸡西", "鹤岗", "双鸭山", "大庆", "伊春", "佳木斯", "七台河", "牡丹江", "黑河", "绥化", "大兴安岭", "漠河",
  "南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁",
  "杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水",
  "合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "六安", "亳州", "池州", "宣城",
  "福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德",
  "南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶",
  "济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "临沂", "德州", "聊城", "滨州", "菏泽",
  "郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店", "济源",
  "武汉", "黄石", "十堰", "宜昌", "襄阳", "鄂州", "荆门", "孝感", "荆州", "黄冈", "咸宁", "随州", "恩施", "仙桃", "潜江", "天门", "神农架",
  "长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西",
  "广州", "深圳", "珠海", "汕头", "佛山", "韶关", "河源", "梅州", "惠州", "汕尾", "东莞", "中山", "江门", "阳江", "湛江", "茂名", "肇庆", "清远", "潮州", "揭阳", "云浮",
  "南宁", "柳州", "桂林", "梧州", "北海", "防城港", "钦州", "贵港", "玉林", "百色", "贺州", "河池", "来宾", "崇左",
  "海口", "三亚", "三沙", "儋州", "五指山", "文昌", "琼海", "万宁", "东方",
  "成都", "自贡", "攀枝花", "泸州", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山",
  "贵阳", "六盘水", "遵义", "安顺", "毕节", "铜仁", "黔西南", "黔东南", "黔南",
  "昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "楚雄", "红河", "文山", "西双版纳", "大理", "德宏", "怒江", "迪庆",
  "拉萨", "日喀则", "昌都", "林芝", "山南", "那曲", "阿里",
  "西安", "铜川", "宝鸡", "咸阳", "渭南", "延安", "汉中", "榆林", "安康", "商洛",
  "兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "张掖", "平凉", "酒泉", "庆阳", "定西", "陇南", "临夏", "甘南",
  "西宁", "海东", "海北", "黄南", "海南州", "果洛", "玉树", "海西",
  "银川", "石嘴山", "吴忠", "固原", "中卫",
  "乌鲁木齐", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博尔塔拉", "巴音郭楞", "阿克苏", "克孜勒苏", "喀什", "和田", "伊犁", "塔城", "阿勒泰", "石河子", "阿拉尔", "图木舒克", "五家渠", "北屯", "铁门关", "双河", "可克达拉", "昆玉", "胡杨河"
];

const languageMeta = {
  "zh-Hans": { htmlLang: "zh-CN", speechLang: "zh-CN" },
  "zh-Hant": { htmlLang: "zh-Hant", speechLang: "zh-TW" },
  en: { htmlLang: "en", speechLang: "en-US" },
};

const weekdays = {
  "zh-Hans": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  "zh-Hant": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
};

const sectionPageMap = {
  "where-stars-drift.html": "works.html",
};

const protectedEmailParts = {
  primary: ["kqdhysj114514", "163", "com"],
  feedback: ["kqdhysjwebfk", "yeah", "net"],
};

const siteSearchIndex = [
  {
    href: "works.html",
    titleKey: "works.title",
    excerptKeys: ["works.desc", "works.card1.body"],
    keywords: ["作品展示", "作品展示", "works", "game", "glagame", "文游", "文遊", "单机", "單機"],
  },
  {
    href: "where-stars-drift.html",
    titleKey: "workDetail.title",
    excerptKeys: [
      "workDetail.englishTitle",
      "workDetail.desc",
      "workDetail.intro.p1",
    ],
    keywords: [
      "星河流转时",
      "星河流轉時",
      "Where Stars Drift",
      "详情",
      "詳情",
    ],
  },
  {
    href: "where-stars-drift.html#steam-title",
    titleKey: "workDetail.steam.title",
    excerptKeys: [
      "workDetail.title",
      "workDetail.englishTitle",
      "workDetail.steam.desc",
      "workDetail.steam.price",
      "workDetail.steam.button",
    ],
    keywords: [
      "Steam",
      "商店",
      "购买",
      "購買",
      "purchase",
      "价格",
      "價格",
      "price",
      "购买入口",
      "購買入口",
    ],
  },
  {
    href: "contact.html#consultation-form",
    titleKey: "consult.title",
    excerptKeys: ["consult.desc", "contact.desc"],
    keywords: ["咨询", "諮詢", "contact", "inquiry", "合作", "反馈", "反饋", "无障碍", "無障礙"],
  },
];

const translations = {
  "zh-Hans": {
    "meta.title": "kqdhysj工作室信息门户",
    "meta.description": "kqdhysj工作室信息门户，展示 glagame、文游、单机游戏创作与联系方式。",
    "skip": "跳转到主要内容",
    "status.aria": "实时时间和天气",
    "status.timeLabel": "IP时间",
    "status.weatherLabel": "天气",
    "status.weatherAria": "查看天气信息",
    "tools.aria": "语言与无障碍工具",
    "language.aria": "语言切换",
    "language.zhHans": "简体",
    "language.zhHant": "繁體",
    "language.en": "English",
    "top.home": "网站首页",
    "top.portal": "便民服务",
    "tool.accessibility": "无障碍",
    "tool.care": "长者模式",
    "tool.senior": "长者模式",
    "tool.reader": "指针朗读",
    "tool.zoomIn": "放大",
    "tool.zoomOut": "缩小",
    "tool.contrast": "高对比",
    "tool.reset": "重置",
    "tool.accessHelp": "无障碍服务",
    "accessPanel.aria": "无障碍浏览工具",
    "accessPanel.title": "无障碍浏览工具",
    "accessPanel.opened": "无障碍工具栏已展开。",
    "accessPanel.closed": "无障碍工具栏已收起。",
    "top.email": "邮箱联系",
    "brand.aria": "kqdhysj工作室首页",
    "brand.name": "kqdhysj工作室",
    "brand.subtitle": "glagame、文游与单机游戏信息门户",
    "search.aria": "站内搜索",
    "search.label": "站内搜索",
    "search.input": "请输入关键词",
    "search.button": "搜索",
    "search.empty": "请输入搜索关键词。",
    "search.none": "未找到与“{query}”相关的内容。",
    "search.found": "已定位与“{query}”相关的内容。",
    "search.resultsAria": "搜索建议",
    "search.resultsTitle": "模糊搜索结果",
    "search.resultCount": "找到 {count} 条相关内容",
    "nav.aria": "主导航",
    "nav.toggle": "打开栏目导航",
    "nav.home": "首页",
    "nav.overview": "工作室概况",
    "nav.services": "作品服务",
    "nav.works": "作品展示",
    "nav.portal": "便民服务",
    "nav.weather": "便民天气",
    "nav.news": "工作动态",
    "nav.accessibility": "无障碍服务",
    "nav.public": "信息公开",
    "nav.contact": "联系我们",
    "focus.label": "特别关注",
    "focus.text": "主打 glagame、文游与单机游戏。",
    "hero.kicker": "工作室信息发布",
    "hero.title": "kqdhysj工作室",
    "hero.body": "围绕 glagame、文游与单机，提供剧情玩法支持。",
    "hero.meta.directionLabel": "主打方向",
    "hero.meta.directionValue": "glagame、文游、单机游戏",
    "hero.meta.updateLabel": "信息发布",
    "hero.meta.updateValue": "公告、作品服务、联系渠道",
    "hero.meta.accessLabel": "访问支持",
    "hero.meta.accessValue": "无障碍、关怀版、三语切换",
    "hero.primary": "查看作品服务",
    "hero.secondary": "查看无障碍说明",
    "hero.panelAria": "栏目入口",
    "window.title": "栏目入口",
    "window.directionLabel": "服务方向",
    "window.directionValue": "glagame、文游、单机游戏",
    "window.accessLabel": "无障碍状态",
    "window.accessValue": "三语切换、长者模式、辅助阅读",
    "window.emailLabel": "联系邮箱",
    "weather.title": "便民天气",
    "weather.desc": "自动按 IP 识别所在地，支持全国主要城市搜索，并调用 Open-Meteo 天气 API 提供当前天气参考。",
    "weather.cityLabel": "城市",
    "weather.cityAria": "输入全国城市名",
    "weather.city.shanghai": "上海",
    "weather.city.beijing": "北京",
    "weather.city.guangzhou": "广州",
    "weather.city.chengdu": "成都",
    "weather.city.newyork": "纽约",
    "weather.refresh": "查询天气",
    "weather.location": "使用当前位置",
    "weather.loadingLocation": "天气加载中",
    "weather.loading": "正在请求天气数据",
    "weather.apparent": "体感温度",
    "weather.humidity": "相对湿度",
    "weather.wind": "风速",
    "weather.updated": "更新时间",
    "weather.source": "数据来源：Open-Meteo 天气 API，必要时使用 wttr.in 兜底。",
    "weather.currentLocation": "当前位置",
    "weather.geoUnsupported": "当前浏览器不支持定位，已显示默认城市天气。",
    "weather.geoDenied": "无法获取当前位置，已显示默认城市天气。",
    "weather.ipLoading": "正在根据 IP 自动识别位置",
    "weather.ipLocation": "IP定位",
    "weather.ipFallback": "无法自动获取 IP 位置，已显示默认城市天气和本地时间。",
    "weather.error": "天气数据暂时无法获取，请检查城市名称或稍后再查。",
    "weather.clear": "晴",
    "weather.mainlyClear": "大部晴朗",
    "weather.partlyCloudy": "局部多云",
    "weather.overcast": "阴",
    "weather.fog": "雾",
    "weather.drizzle": "毛毛雨",
    "weather.freezingDrizzle": "冻毛毛雨",
    "weather.rain": "雨",
    "weather.freezingRain": "冻雨",
    "weather.snow": "雪",
    "weather.snowGrains": "米雪",
    "weather.showers": "阵雨",
    "weather.snowShowers": "阵雪",
    "weather.thunderstorm": "雷暴",
    "weather.unknown": "天气状况未知",
    "convenience.title": "便民服务（传送门）",
    "convenience.desc": "汇集常用创作、游戏、图像与工具入口。",
    "convenience.gridAria": "便民服务传送门",
    "portal.touchgal.category": "文游资料",
    "portal.touchgal.title": "TouchGAL",
    "portal.touchgal.desc": "免费的 galgame 下载站",
    "portal.steam.category": "游戏平台",
    "portal.steam.title": "Steam 在线商店",
    "portal.steam.desc": "单机与独立游戏购买入口",
    "portal.gequbao.category": "音乐工具",
    "portal.gequbao.title": "歌曲宝",
    "portal.gequbao.desc": "免费MP3音乐下载",
    "portal.photopea.category": "图像编辑",
    "portal.photopea.title": "Photopea",
    "portal.photopea.desc": "免费的在线图片与 PSD 编辑工具",
    "portal.kuro.category": "云鸣潮",
    "portal.kuro.title": "库洛官方云鸣潮",
    "portal.kuro.desc": "可以玩鸣潮！",
    "portal.pgyer.category": "安卓应用",
    "portal.pgyer.title": "GO安装器",
    "portal.pgyer.desc": "安装谷歌套件",
    "portal.claude.category": "检测 工具",
    "portal.claude.title": "Claude 中国用户检测",
    "portal.claude.desc": "第三方工具访问页面",
    "guide.title": "办事指引",
    "guide.desc": "按信息查询、服务入口、联系反馈和无障碍浏览梳理常用访问路径。",
    "guide.card1.tag": "入口",
    "guide.card1.title": "便民服务传送门",
    "guide.card1.body": "常用创作、游戏、图像与工具入口已独立为相对页面，点击顶部“便民服务”即可进入。",
    "guide.card1.link": "进入传送门",
    "guide.card2.tag": "公告",
    "guide.card2.title": "通知公告查询",
    "guide.card2.body": "统一邮箱、平台主页、联系渠道等正式公告均以 PDF 公文形式发布。",
    "guide.card2.link": "查看公告",
    "guide.card3.tag": "公开",
    "guide.card3.title": "信息公开入口",
    "guide.card3.body": "主办、承办、工作室定位和公开信息集中展示，便于核对站点信息。",
    "guide.card3.link": "查看公开信息",
    "guide.card4.tag": "辅助",
    "guide.card4.title": "无障碍访问支持",
    "guide.card4.body": "提供指针朗读、字号调整、高对比与关怀版，方便不同浏览习惯。",
    "guide.card4.link": "查看无障碍服务",
    "quick.title": "快捷服务",
    "quick.more": "进入",
    "quick.item1": "便民服务（传送门）",
    "quick.tag1": "相对链接",
    "quick.item2": "无障碍服务与指针朗读",
    "quick.tag2": "服务",
    "quick.item3": "主办承办信息公开",
    "quick.tag3": "公开",
    "quick.item4": "邮箱与平台联系方式",
    "quick.tag4": "联系",
    "quick.item5": "作品展示",
    "quick.tag5": "项目",
    "quick.item6": "网站纠错与反馈",
    "quick.tag6": "反馈",
    "quick.item7": "网站地图与访问帮助",
    "quick.tag7": "索引",
    "overview.title": "工作室概况",
    "overview.desc": "以叙事设计、玩法规划与独立发布为核心，建设面向玩家的游戏内容门户。",
    "overview.card1.title": "定位明确",
    "overview.card1.body": "主打 glagame、文游和单机游戏，面向剧情体验、文字互动、选择分支和轻量玩法原型持续创作。",
    "overview.card2.title": "叙事优先",
    "overview.card2.body": "重视世界观、人物关系、剧情节奏与玩家选择，让文本、规则和反馈共同服务游戏体验。",
    "overview.card3.title": "友好访问",
    "overview.card3.body": "提供简体、繁体、英文切换，并加入长者模式和辅助阅读支持，便于不同玩家浏览信息。",
    "services.title": "作品服务",
    "services.desc": "围绕文游与单机项目生命周期，提供从概念到发布的协作支持。",
    "services.card1.title": "glagame 方案策划",
    "services.card1.body": "梳理题材、目标玩家、核心体验、玩法循环和版本边界，形成清晰可执行的项目方案。",
    "services.card2.title": "文游剧情与分支设计",
    "services.card2.body": "规划章节结构、角色弧光、选择后果、结局路线和文本呈现节奏。",
    "services.card3.title": "单机游戏原型打磨",
    "services.card3.body": "支持核心机制验证、关卡节奏、交互说明、可玩版本清单和体验复盘。",
    "services.card4.title": "无障碍与发布协同",
    "services.card4.body": "整理公告、版本信息、玩家说明和多语言内容，让作品信息更容易被阅读和传播。",
    "news.title": "工作动态",
    "news.desc": "集中发布工作室门户、服务与访问支持更新。",
    "news.more": "更多",
    "news.item1": "工作室门户更新为 glagame、文游与单机游戏方向",
    "news.item2": "无障碍服务栏目上线，支持辅助阅读与长者模式",
    "news.item3": "简体、繁体、英文三语切换功能完成配置",
    "news.item4": "主办与承办信息完成公开标注",
    "notice.title": "通知公告",
    "notice.consult": "咨询",
    "notice.item1": "关于公布工作室统一联系邮箱的通知",
    "notice.item2": "关于公开 B 站主页入口的说明",
    "notice.item3": "关于公开 X 平台账号信息的公告",
    "notice.item4": "关于公开 Facebook 联系渠道的公告",
    "access.title": "无障碍服务",
    "access.desc": "页面按语义化结构编写，兼容微软讲述人、Microsoft Edge 朗读与常见辅助阅读工具。",
    "access.card1.title": "辅助阅读",
    "access.card1.body": "打开顶部“无障碍”工具栏，点击“指针朗读”后，鼠标悬停或键盘聚焦到文字、按钮、链接时会朗读对应文本。",
    "access.card2.title": "长者模式",
    "access.card2.body": "放大字号、提高行距、扩大按钮点击区域，让公告、联系方式和服务信息更容易查看。",
    "access.card3.title": "键盘可访问",
    "access.card3.body": "支持跳转到主要内容、清晰焦点轮廓、可键盘操作的导航和工具按钮。",
    "access.card4.title": "三语切换",
    "access.card4.body": "提供简体中文、繁体中文和英文，语言选择会保存在本机浏览器中。",
    "public.title": "信息公开",
    "public.desc": "以下信息用于工作室门户展示与合作沟通。",
    "public.tableAria": "工作室公开信息",
    "public.nameLabel": "单位名称",
    "public.nameValue": "kqdhysj工作室",
    "public.hostLabel": "主办",
    "public.organizerLabel": "承办",
    "public.typeLabel": "主打方向",
    "public.typeValue": "glagame、文游、单机游戏、剧情互动体验",
    "public.emailLabel": "联系邮箱",
    "public.feedbackEmailLabel": "网站反馈邮箱",
    "works.title": "作品展示",
    "works.desc": "当前展示游戏《星河流转时》，介绍文本为占位内容，后续可继续补充。",
    "works.card1.title": "星河流转时",
    "works.card1.body": "占位符：游戏类型待补充；故事简介待补充；玩法特色待补充；开发状态待补充。",
    "works.card1.link": "查看详情",
    "works.contact": "联系工作室",
    "workDetail.metaTitle": "星河流转时 - kqdhysj工作室信息门户",
    "workDetail.metaDescription": "kqdhysj工作室游戏《星河流转时 / Where Stars Drift》作品详情与 Steam 购买占位信息。",
    "workDetail.breadcrumb": "星河流转时",
    "workDetail.noticeLabel": "作品信息",
    "workDetail.title": "星河流转时",
    "workDetail.englishTitle": "Where Stars Drift",
    "workDetail.desc": "本页为作品《星河流转时》的详情展示页，当前内容为占位版本，后续可替换为正式介绍、截图、发行信息与购买链接。",
    "workDetail.metaHeading": "基础信息",
    "workDetail.meta.typeLabel": "作品类型",
    "workDetail.meta.typeValue": "glagame / 文游 / 单机",
    "workDetail.meta.statusLabel": "开发状态",
    "workDetail.meta.statusValue": "占位：制作中",
    "workDetail.meta.platformLabel": "计划平台",
    "workDetail.meta.platformValue": "Windows / Steam",
    "workDetail.meta.releaseLabel": "发行时间",
    "workDetail.meta.releaseValue": "占位：待公布",
    "workDetail.meta.developerLabel": "开发",
    "workDetail.meta.developerValue": "kqdhysj工作室",
    "workDetail.meta.publisherLabel": "发行",
    "workDetail.meta.publisherValue": "占位：待确认",
    "workDetail.meta.languageLabel": "语言支持",
    "workDetail.meta.languageValue": "占位：简体中文、繁体中文、英文",
    "workDetail.intro.title": "作品介绍",
    "workDetail.intro.p1": "占位符：这里将介绍《星河流转时》的世界观、故事背景与核心冲突，让玩家快速理解本作的叙事方向。",
    "workDetail.intro.p2": "占位符：这里将补充主要角色、章节结构、玩家选择与结局分支，后续可替换为正式宣传文案。",
    "workDetail.intro.p3": "占位符：这里将说明玩法节奏、文本演出、存档体验、音乐美术方向以及适合的目标玩家。",
    "workDetail.features.title": "作品特色",
    "workDetail.feature1": "占位符：多章节文字叙事与关键选择分支。",
    "workDetail.feature2": "占位符：以角色关系和时间流转为核心的剧情推进。",
    "workDetail.feature3": "占位符：适合单机游玩的轻量交互与存档流程。",
    "workDetail.feature4": "占位符：后续可加入成就、CG、音乐和多结局说明。",
    "workDetail.steam.title": "Steam 商店页面待上线",
    "workDetail.steam.desc": "以下为 Steam 购买界面占位区，正式商店地址、价格和发行日期确认后可在此替换。",
    "workDetail.steam.statusLabel": "商店状态",
    "workDetail.steam.statusValue": "占位：暂未公开",
    "workDetail.steam.priceLabel": "价格",
    "workDetail.steam.price": "价格待定",
    "workDetail.steam.platformLabel": "购买平台",
    "workDetail.steam.platformValue": "Steam",
    "workDetail.steam.dateLabel": "上线时间",
    "workDetail.steam.dateValue": "待公布",
    "workDetail.steam.button": "购买入口待开放",
    "workDetail.steam.note": "提示：当前按钮为占位状态，不会跳转到外部商店。",
    "workDetail.actions.back": "返回作品展示",
    "feedback.title": "网站纠错与反馈",
    "feedback.desc": "受理页面文字错误、链接失效、排版异常、无障碍访问问题等网站反馈。",
    "feedback.emailLabel": "反馈邮箱",
    "feedback.scopeLabel": "受理范围",
    "feedback.scopeValue": "错别字、失效链接、显示异常、辅助阅读问题、信息更新建议",
    "feedback.formatLabel": "建议内容",
    "feedback.formatValue": "页面名称、问题位置、问题说明、可选截图或浏览器信息",
    "feedback.mailAction": "发送网站反馈",
    "sitemap.title": "网站地图与访问帮助",
    "sitemap.desc": "按栏目汇总站内相对链接，并集中列出无障碍、反馈和联系入口。",
    "sitemap.group1": "主要栏目",
    "sitemap.mainTitle": "内容入口",
    "sitemap.group2": "服务入口",
    "sitemap.serviceTitle": "服务与公开",
    "sitemap.group3": "访问帮助",
    "sitemap.helpTitle": "无障碍与反馈",
    "sitemap.group4": "使用方式",
    "sitemap.accessTitle": "浏览支持",
    "sitemap.accessBody": "可使用顶部无障碍工具栏开启指针朗读、字号调整、高对比和关怀版。",
    "contact.title": "联系我们",
    "contact.desc": "欢迎通过以下公开渠道联系 kqdhysj工作室。",
    "contact.emailLabel": "邮箱",
    "contact.feedbackLabel": "网站反馈",
    "contact.biliLabel": "B 站",
    "contact.biliLink": "进入 B 站主页",
    "contact.facebookLink": "打开 Facebook 联系页",
    "contact.xLink": "打开 X 平台账号",
    "footer.title": "kqdhysj工作室信息门户",
    "footer.host": "主办：kqdhysj",
    "footer.organizer": "承办：kqdhysj",
    "contact.emailAction": "发送工作室联系邮件",
    "contact.emailActionAria": "发送工作室联系邮件",
    "contact.feedbackActionAria": "发送网站反馈邮件",
    "consult.title": "咨询表单",
    "consult.desc": "可提交项目咨询、合作沟通、作品相关问题、网站反馈和无障碍访问问题。",
    "consult.type": "咨询类型",
    "consult.typePlaceholder": "请选择",
    "consult.typeProject": "项目咨询",
    "consult.typeCooperation": "合作沟通",
    "consult.typeWorks": "作品相关",
    "consult.typeWebsite": "网站问题反馈",
    "consult.typeAccessibility": "无障碍访问问题",
    "consult.typeOther": "其他",
    "consult.name": "你的称呼",
    "consult.contact": "联系方式",
    "consult.contactPlaceholder": "请填写邮箱或11位手机号",
    "consult.contactHelp": "仅支持邮箱或 11 位手机号。请确认联系方式真实可用，否则可能无法回复。",
    "consult.contactInvalid": "联系方式格式不正确，请填写邮箱或 11 位手机号。",
    "consult.language": "希望使用的语言",
    "consult.subject": "咨询标题",
    "consult.message": "咨询内容",
    "consult.messagePlaceholder": "请尽量说明事项背景、相关页面或作品名称、希望解决的问题",
    "consult.link": "相关链接",
    "consult.linkPlaceholder": "可选",
    "consult.reply": "是否需要回复",
    "consult.replyYes": "需要回复",
    "consult.replyNo": "仅提交信息，不需要回复",
    "consult.consent": "我确认以上内容真实有效，并同意 kqdhysj工作室仅将本次填写的信息用于联系、咨询处理和网站反馈处理。",
    "consult.submit": "提交咨询",
    "consult.submitting": "正在提交咨询，请稍候。",
    "consult.success": "咨询信息已提交，感谢联系 kqdhysj工作室。",
    "consult.error": "提交未成功，请稍后重试，或使用邮箱联系入口。",
    "consult.ready": "咨询表单已就绪。",
    "footer.email": "联系方式：邮箱联系",
    "footer.feedback": "网站反馈：反馈邮箱",
    "footer.feedbackPage": "网站纠错",
    "footer.sitemap": "网站地图",
    "backtop.aria": "返回顶部",
    "reader.start": "指针辅助阅读已开启。鼠标悬停或键盘聚焦到文字、按钮、链接时，将朗读对应文本。",
    "reader.stop": "指针辅助阅读已关闭。",
    "reader.unsupported": "当前浏览器不支持网页朗读，可使用 Windows 讲述人或 Microsoft Edge 朗读。",
    "reader.hoverPrefix": "正在朗读：",
    "senior.enabled": "长者模式已开启。",
    "senior.disabled": "长者模式已关闭。",
    "contrast.enabled": "高对比模式已开启。",
    "contrast.disabled": "高对比模式已关闭。",
    "font.increased": "字号已放大。",
    "font.decreased": "字号已缩小。",
    "font.reset": "无障碍显示设置已重置。",
    "breadcrumb.current": "当前位置",
    "breadcrumb.home": "首页",
    "page.backHome": "返回首页",
  },
  "zh-Hant": {
    "meta.title": "kqdhysj工作室資訊入口",
    "meta.description": "kqdhysj工作室資訊入口，展示 glagame、文遊、單機遊戲創作與聯絡方式。",
    "skip": "跳至主要內容",
    "status.aria": "即時時間和天氣",
    "status.timeLabel": "IP時間",
    "status.weatherLabel": "天氣",
    "status.weatherAria": "查看天氣資訊",
    "tools.aria": "語言與無障礙工具",
    "language.aria": "語言切換",
    "language.zhHans": "简体",
    "language.zhHant": "繁體",
    "language.en": "English",
    "top.home": "網站首頁",
    "top.portal": "便民服務",
    "tool.accessibility": "無障礙",
    "tool.care": "長者模式",
    "tool.senior": "長者模式",
    "tool.reader": "指標朗讀",
    "tool.zoomIn": "放大",
    "tool.zoomOut": "縮小",
    "tool.contrast": "高對比",
    "tool.reset": "重置",
    "tool.accessHelp": "無障礙服務",
    "accessPanel.aria": "無障礙瀏覽工具",
    "accessPanel.title": "無障礙瀏覽工具",
    "accessPanel.opened": "無障礙工具列已展開。",
    "accessPanel.closed": "無障礙工具列已收起。",
    "top.email": "電郵聯絡",
    "brand.aria": "kqdhysj工作室首頁",
    "brand.name": "kqdhysj工作室",
    "brand.subtitle": "glagame、文遊與單機遊戲資訊入口",
    "search.aria": "站內搜尋",
    "search.label": "站內搜尋",
    "search.input": "請輸入關鍵字",
    "search.button": "搜尋",
    "search.empty": "請輸入搜尋關鍵字。",
    "search.none": "未找到與「{query}」相關的內容。",
    "search.found": "已定位與「{query}」相關的內容。",
    "search.resultsAria": "搜尋建議",
    "search.resultsTitle": "模糊搜尋結果",
    "search.resultCount": "找到 {count} 條相關內容",
    "nav.aria": "主導覽",
    "nav.toggle": "開啟欄目導覽",
    "nav.home": "首頁",
    "nav.overview": "工作室概況",
    "nav.services": "作品服務",
    "nav.works": "作品展示",
    "nav.portal": "便民服務",
    "nav.weather": "便民天氣",
    "nav.news": "工作動態",
    "nav.accessibility": "無障礙服務",
    "nav.public": "資訊公開",
    "nav.contact": "聯絡我們",
    "focus.label": "特別關注",
    "focus.text": "主打 glagame、文遊與單機遊戲。",
    "hero.kicker": "工作室資訊發布",
    "hero.title": "kqdhysj工作室",
    "hero.body": "圍繞 glagame、文遊與單機，提供劇情玩法支援。",
    "hero.meta.directionLabel": "主打方向",
    "hero.meta.directionValue": "glagame、文遊、單機遊戲",
    "hero.meta.updateLabel": "資訊發布",
    "hero.meta.updateValue": "公告、作品服務、聯絡渠道",
    "hero.meta.accessLabel": "訪問支援",
    "hero.meta.accessValue": "無障礙、關懷版、三語切換",
    "hero.primary": "查看作品服務",
    "hero.secondary": "查看無障礙說明",
    "hero.panelAria": "欄目入口",
    "window.title": "欄目入口",
    "window.directionLabel": "服務方向",
    "window.directionValue": "glagame、文遊、單機遊戲",
    "window.accessLabel": "無障礙狀態",
    "window.accessValue": "三語切換、長者模式、輔助閱讀",
    "window.emailLabel": "聯絡電郵",
    "weather.title": "便民天氣",
    "weather.desc": "自動按 IP 識別所在地，支援全國主要城市搜尋，並調用 Open-Meteo 天氣 API 提供當前天氣參考。",
    "weather.cityLabel": "城市",
    "weather.cityAria": "輸入全國城市名",
    "weather.city.shanghai": "上海",
    "weather.city.beijing": "北京",
    "weather.city.guangzhou": "廣州",
    "weather.city.chengdu": "成都",
    "weather.city.newyork": "紐約",
    "weather.refresh": "查詢天氣",
    "weather.location": "使用目前位置",
    "weather.loadingLocation": "天氣載入中",
    "weather.loading": "正在請求天氣資料",
    "weather.apparent": "體感溫度",
    "weather.humidity": "相對濕度",
    "weather.wind": "風速",
    "weather.updated": "更新時間",
    "weather.source": "資料來源：Open-Meteo 天氣 API，必要時使用 wttr.in 備援。",
    "weather.currentLocation": "目前位置",
    "weather.geoUnsupported": "目前瀏覽器不支援定位，已顯示預設城市天氣。",
    "weather.geoDenied": "無法取得目前位置，已顯示預設城市天氣。",
    "weather.ipLoading": "正在根據 IP 自動識別位置",
    "weather.ipLocation": "IP定位",
    "weather.ipFallback": "無法自動取得 IP 位置，已顯示預設城市天氣和本機時間。",
    "weather.error": "天氣資料暫時無法取得，請檢查城市名稱或稍後再查。",
    "weather.clear": "晴",
    "weather.mainlyClear": "大致晴朗",
    "weather.partlyCloudy": "局部多雲",
    "weather.overcast": "陰",
    "weather.fog": "霧",
    "weather.drizzle": "毛毛雨",
    "weather.freezingDrizzle": "凍毛毛雨",
    "weather.rain": "雨",
    "weather.freezingRain": "凍雨",
    "weather.snow": "雪",
    "weather.snowGrains": "米雪",
    "weather.showers": "陣雨",
    "weather.snowShowers": "陣雪",
    "weather.thunderstorm": "雷暴",
    "weather.unknown": "天氣狀況未知",
    "convenience.title": "便民服務（傳送門）",
    "convenience.desc": "匯集常用創作、遊戲、圖像與工具入口。",
    "convenience.gridAria": "便民服務傳送門",
    "portal.touchgal.category": "文遊資料",
    "portal.touchgal.title": "TouchGAL",
    "portal.touchgal.desc": "免費的 galgame 下載站",
    "portal.steam.category": "遊戲平台",
    "portal.steam.title": "Steam 線上商店",
    "portal.steam.desc": "單機與獨立遊戲購買入口",
    "portal.gequbao.category": "音樂工具",
    "portal.gequbao.title": "歌曲寶",
    "portal.gequbao.desc": "免費 MP3 音樂下載",
    "portal.photopea.category": "圖像編輯",
    "portal.photopea.title": "Photopea",
    "portal.photopea.desc": "免費的線上圖片與 PSD 編輯工具",
    "portal.kuro.category": "雲鳴潮",
    "portal.kuro.title": "庫洛官方雲鳴潮",
    "portal.kuro.desc": "可以玩鳴潮！",
    "portal.pgyer.category": "安卓應用",
    "portal.pgyer.title": "GO 安裝器",
    "portal.pgyer.desc": "安裝 Google 套件",
    "portal.claude.category": "檢測工具",
    "portal.claude.title": "Claude 中國用戶檢測",
    "portal.claude.desc": "第三方工具訪問頁面",
    "guide.title": "辦事指引",
    "guide.desc": "按資訊查詢、服務入口、聯絡回饋和無障礙瀏覽梳理常用訪問路徑。",
    "guide.card1.tag": "入口",
    "guide.card1.title": "便民服務傳送門",
    "guide.card1.body": "常用創作、遊戲、圖像與工具入口已獨立為相對頁面，點擊頂部「便民服務」即可進入。",
    "guide.card1.link": "進入傳送門",
    "guide.card2.tag": "公告",
    "guide.card2.title": "通知公告查詢",
    "guide.card2.body": "統一電郵、平台主頁、聯絡渠道等正式公告均以 PDF 公文形式發布。",
    "guide.card2.link": "查看公告",
    "guide.card3.tag": "公開",
    "guide.card3.title": "資訊公開入口",
    "guide.card3.body": "主辦、承辦、工作室定位和公開資訊集中展示，便於核對站點資訊。",
    "guide.card3.link": "查看公開資訊",
    "guide.card4.tag": "輔助",
    "guide.card4.title": "無障礙訪問支援",
    "guide.card4.body": "提供指標朗讀、字號調整、高對比與關懷版，方便不同瀏覽習慣。",
    "guide.card4.link": "查看無障礙服務",
    "quick.title": "快捷服務",
    "quick.more": "進入",
    "quick.item1": "便民服務（傳送門）",
    "quick.tag1": "相對連結",
    "quick.item2": "無障礙服務與指標朗讀",
    "quick.tag2": "服務",
    "quick.item3": "主辦承辦資訊公開",
    "quick.tag3": "公開",
    "quick.item4": "電郵與平台聯絡方式",
    "quick.tag4": "聯絡",
    "quick.item5": "作品展示",
    "quick.tag5": "項目",
    "quick.item6": "網站糾錯與反饋",
    "quick.tag6": "反饋",
    "quick.item7": "網站地圖與訪問幫助",
    "quick.tag7": "索引",
    "overview.title": "工作室概況",
    "overview.desc": "以敘事設計、玩法規劃與獨立發布為核心，建設面向玩家的遊戲內容入口。",
    "overview.card1.title": "定位明確",
    "overview.card1.body": "主打 glagame、文遊和單機遊戲，面向劇情體驗、文字互動、選擇分支和輕量玩法原型持續創作。",
    "overview.card2.title": "敘事優先",
    "overview.card2.body": "重視世界觀、人物關係、劇情節奏與玩家選擇，讓文本、規則和回饋共同服務遊戲體驗。",
    "overview.card3.title": "友好訪問",
    "overview.card3.body": "提供簡體、繁體、英文切換，並加入長者模式和輔助閱讀支援，便於不同玩家瀏覽資訊。",
    "services.title": "作品服務",
    "services.desc": "圍繞文遊與單機項目生命周期，提供從概念到發布的協作支援。",
    "services.card1.title": "glagame 方案策劃",
    "services.card1.body": "梳理題材、目標玩家、核心體驗、玩法循環和版本邊界，形成清晰可執行的項目方案。",
    "services.card2.title": "文遊劇情與分支設計",
    "services.card2.body": "規劃章節結構、角色弧光、選擇後果、結局路線和文本呈現節奏。",
    "services.card3.title": "單機遊戲原型打磨",
    "services.card3.body": "支援核心機制驗證、關卡節奏、互動說明、可玩版本清單和體驗復盤。",
    "services.card4.title": "無障礙與發布協同",
    "services.card4.body": "整理公告、版本資訊、玩家說明和多語言內容，讓作品資訊更容易被閱讀和傳播。",
    "news.title": "工作動態",
    "news.desc": "集中發布工作室入口、服務與訪問支援更新。",
    "news.more": "更多",
    "news.item1": "工作室入口更新為 glagame、文遊與單機遊戲方向",
    "news.item2": "無障礙服務欄目上線，支援輔助閱讀與長者模式",
    "news.item3": "簡體、繁體、英文三語切換功能完成配置",
    "news.item4": "主辦與承辦資訊完成公開標註",
    "notice.title": "通知公告",
    "notice.consult": "諮詢",
    "notice.item1": "關於公布工作室統一聯絡電郵的通知",
    "notice.item2": "關於公開 B 站主頁入口的說明",
    "notice.item3": "關於公開 X 平台帳號資訊的公告",
    "notice.item4": "關於公開 Facebook 聯絡渠道的公告",
    "access.title": "無障礙服務",
    "access.desc": "頁面按語義化結構編寫，兼容微軟講述人、Microsoft Edge 朗讀與常見輔助閱讀工具。",
    "access.card1.title": "輔助閱讀",
    "access.card1.body": "開啟頂部「無障礙」工具列，點擊「指標朗讀」後，滑鼠懸停或鍵盤聚焦到文字、按鈕、連結時會朗讀對應文本。",
    "access.card2.title": "長者模式",
    "access.card2.body": "放大字號、提高行距、擴大按鈕點擊區域，讓公告、聯絡方式和服務資訊更容易查看。",
    "access.card3.title": "鍵盤可訪問",
    "access.card3.body": "支援跳至主要內容、清晰焦點輪廓、可鍵盤操作的導覽和工具按鈕。",
    "access.card4.title": "三語切換",
    "access.card4.body": "提供簡體中文、繁體中文和英文，語言選擇會保存在本機瀏覽器中。",
    "public.title": "資訊公開",
    "public.desc": "以下資訊用於工作室入口展示與合作溝通。",
    "public.tableAria": "工作室公開資訊",
    "public.nameLabel": "單位名稱",
    "public.nameValue": "kqdhysj工作室",
    "public.hostLabel": "主辦",
    "public.organizerLabel": "承辦",
    "public.typeLabel": "主打方向",
    "public.typeValue": "glagame、文遊、單機遊戲、劇情互動體驗",
    "public.emailLabel": "聯絡電郵",
    "public.feedbackEmailLabel": "網站反饋電郵",
    "works.title": "作品展示",
    "works.desc": "目前展示遊戲《星河流轉時》，介紹文本為佔位內容，後續可繼續補充。",
    "works.card1.title": "星河流轉時",
    "works.card1.body": "佔位符：遊戲類型待補充；故事簡介待補充；玩法特色待補充；開發狀態待補充。",
    "works.card1.link": "查看詳情",
    "works.contact": "聯絡工作室",
    "workDetail.metaTitle": "星河流轉時 - kqdhysj工作室資訊入口",
    "workDetail.metaDescription": "kqdhysj工作室遊戲《星河流轉時 / Where Stars Drift》作品詳情與 Steam 購買佔位資訊。",
    "workDetail.breadcrumb": "星河流轉時",
    "workDetail.noticeLabel": "作品資訊",
    "workDetail.title": "星河流轉時",
    "workDetail.englishTitle": "Where Stars Drift",
    "workDetail.desc": "本頁為作品《星河流轉時》的詳情展示頁，目前內容為佔位版本，後續可替換為正式介紹、截圖、發行資訊與購買連結。",
    "workDetail.metaHeading": "基礎資訊",
    "workDetail.meta.typeLabel": "作品類型",
    "workDetail.meta.typeValue": "glagame / 文遊 / 單機",
    "workDetail.meta.statusLabel": "開發狀態",
    "workDetail.meta.statusValue": "佔位：製作中",
    "workDetail.meta.platformLabel": "計劃平台",
    "workDetail.meta.platformValue": "Windows / Steam",
    "workDetail.meta.releaseLabel": "發行時間",
    "workDetail.meta.releaseValue": "佔位：待公布",
    "workDetail.meta.developerLabel": "開發",
    "workDetail.meta.developerValue": "kqdhysj工作室",
    "workDetail.meta.publisherLabel": "發行",
    "workDetail.meta.publisherValue": "佔位：待確認",
    "workDetail.meta.languageLabel": "語言支援",
    "workDetail.meta.languageValue": "佔位：簡體中文、繁體中文、英文",
    "workDetail.intro.title": "作品介紹",
    "workDetail.intro.p1": "佔位符：這裡將介紹《星河流轉時》的世界觀、故事背景與核心衝突，讓玩家快速理解本作的敘事方向。",
    "workDetail.intro.p2": "佔位符：這裡將補充主要角色、章節結構、玩家選擇與結局分支，後續可替換為正式宣傳文案。",
    "workDetail.intro.p3": "佔位符：這裡將說明玩法節奏、文本演出、存檔體驗、音樂美術方向以及適合的目標玩家。",
    "workDetail.features.title": "作品特色",
    "workDetail.feature1": "佔位符：多章節文字敘事與關鍵選擇分支。",
    "workDetail.feature2": "佔位符：以角色關係和時間流轉為核心的劇情推進。",
    "workDetail.feature3": "佔位符：適合單機遊玩的輕量交互與存檔流程。",
    "workDetail.feature4": "佔位符：後續可加入成就、CG、音樂和多結局說明。",
    "workDetail.steam.title": "Steam 商店頁面待上線",
    "workDetail.steam.desc": "以下為 Steam 購買界面佔位區，正式商店地址、價格和發行日期確認後可在此替換。",
    "workDetail.steam.statusLabel": "商店狀態",
    "workDetail.steam.statusValue": "佔位：暫未公開",
    "workDetail.steam.priceLabel": "價格",
    "workDetail.steam.price": "價格待定",
    "workDetail.steam.platformLabel": "購買平台",
    "workDetail.steam.platformValue": "Steam",
    "workDetail.steam.dateLabel": "上線時間",
    "workDetail.steam.dateValue": "待公布",
    "workDetail.steam.button": "購買入口待開放",
    "workDetail.steam.note": "提示：目前按鈕為佔位狀態，不會跳轉到外部商店。",
    "workDetail.actions.back": "返回作品展示",
    "feedback.title": "網站糾錯與反饋",
    "feedback.desc": "受理頁面文字錯誤、連結失效、排版異常、無障礙訪問問題等網站反饋。",
    "feedback.emailLabel": "反饋電郵",
    "feedback.scopeLabel": "受理範圍",
    "feedback.scopeValue": "錯別字、失效連結、顯示異常、輔助閱讀問題、資訊更新建議",
    "feedback.formatLabel": "建議內容",
    "feedback.formatValue": "頁面名稱、問題位置、問題說明、可選截圖或瀏覽器資訊",
    "feedback.mailAction": "發送網站反饋",
    "sitemap.title": "網站地圖與訪問幫助",
    "sitemap.desc": "按欄目匯總站內相對連結，並集中列出無障礙、反饋和聯絡入口。",
    "sitemap.group1": "主要欄目",
    "sitemap.mainTitle": "內容入口",
    "sitemap.group2": "服務入口",
    "sitemap.serviceTitle": "服務與公開",
    "sitemap.group3": "訪問幫助",
    "sitemap.helpTitle": "無障礙與反饋",
    "sitemap.group4": "使用方式",
    "sitemap.accessTitle": "瀏覽支援",
    "sitemap.accessBody": "可使用頂部無障礙工具列開啟指標朗讀、字號調整、高對比和關懷版。",
    "contact.title": "聯絡我們",
    "contact.desc": "歡迎透過以下公開渠道聯絡 kqdhysj工作室。",
    "contact.emailLabel": "電郵",
    "contact.feedbackLabel": "網站反饋",
    "contact.biliLabel": "B 站",
    "contact.biliLink": "進入 B 站主頁",
    "contact.facebookLink": "開啟 Facebook 聯絡頁",
    "contact.xLink": "開啟 X 平台帳號",
    "footer.title": "kqdhysj工作室資訊入口",
    "footer.host": "主辦：kqdhysj",
    "footer.organizer": "承辦：kqdhysj",
    "contact.emailAction": "發送工作室聯絡郵件",
    "contact.emailActionAria": "發送工作室聯絡郵件",
    "contact.feedbackActionAria": "發送網站反饋郵件",
    "consult.title": "諮詢表單",
    "consult.desc": "可提交項目諮詢、合作溝通、作品相關問題、網站反饋和無障礙訪問問題。",
    "consult.type": "諮詢類型",
    "consult.typePlaceholder": "請選擇",
    "consult.typeProject": "項目諮詢",
    "consult.typeCooperation": "合作溝通",
    "consult.typeWorks": "作品相關",
    "consult.typeWebsite": "網站問題反饋",
    "consult.typeAccessibility": "無障礙訪問問題",
    "consult.typeOther": "其他",
    "consult.name": "你的稱呼",
    "consult.contact": "聯絡方式",
    "consult.contactPlaceholder": "請填寫電郵或11位手機號",
    "consult.contactHelp": "僅支持電郵或 11 位手機號。請確認聯絡方式真實可用，否則可能無法回覆。",
    "consult.contactInvalid": "聯絡方式格式不正確，請填寫電郵或 11 位手機號。",
    "consult.language": "希望使用的語言",
    "consult.subject": "諮詢標題",
    "consult.message": "諮詢內容",
    "consult.messagePlaceholder": "請盡量說明事項背景、相關頁面或作品名稱、希望解決的問題",
    "consult.link": "相關連結",
    "consult.linkPlaceholder": "可選",
    "consult.reply": "是否需要回覆",
    "consult.replyYes": "需要回覆",
    "consult.replyNo": "僅提交資訊，不需要回覆",
    "consult.consent": "我確認以上內容真實有效，並同意 kqdhysj工作室僅將本次填寫的資訊用於聯絡、諮詢處理和網站反饋處理。",
    "consult.submit": "提交諮詢",
    "consult.submitting": "正在提交諮詢，請稍候。",
    "consult.success": "諮詢資訊已提交，感謝聯絡 kqdhysj工作室。",
    "consult.error": "提交未成功，請稍後重試，或使用電郵聯絡入口。",
    "consult.ready": "諮詢表單已就緒。",
    "footer.email": "聯絡方式：電郵聯絡",
    "footer.feedback": "網站反饋：反饋電郵",
    "footer.feedbackPage": "網站糾錯",
    "footer.sitemap": "網站地圖",
    "backtop.aria": "返回頂部",
    "reader.start": "指標輔助閱讀已開啟。滑鼠懸停或鍵盤聚焦到文字、按鈕、連結時，將朗讀對應文本。",
    "reader.stop": "指標輔助閱讀已關閉。",
    "reader.unsupported": "目前瀏覽器不支援網頁朗讀，可使用 Windows 講述人或 Microsoft Edge 朗讀。",
    "reader.hoverPrefix": "正在朗讀：",
    "senior.enabled": "長者模式已開啟。",
    "senior.disabled": "長者模式已關閉。",
    "contrast.enabled": "高對比模式已開啟。",
    "contrast.disabled": "高對比模式已關閉。",
    "font.increased": "字號已放大。",
    "font.decreased": "字號已縮小。",
    "font.reset": "無障礙顯示設定已重置。",
    "breadcrumb.current": "目前位置",
    "breadcrumb.home": "首頁",
    "page.backHome": "返回首頁",
  },
  en: {
    "meta.title": "kqdhysj Studio Information Portal",
    "meta.description": "The kqdhysj Studio portal for glagame, text-based games, standalone games, and contact information.",
    "skip": "Skip to main content",
    "status.aria": "Live time and weather",
    "status.timeLabel": "IP time",
    "status.weatherLabel": "Weather",
    "status.weatherAria": "View weather information",
    "tools.aria": "Language and accessibility tools",
    "language.aria": "Language switcher",
    "language.zhHans": "简体",
    "language.zhHant": "繁體",
    "language.en": "English",
    "top.home": "Home",
    "top.portal": "Service Portal",
    "tool.accessibility": "Accessibility",
    "tool.care": "Senior Mode",
    "tool.senior": "Senior mode",
    "tool.reader": "Pointer reading",
    "tool.zoomIn": "Zoom in",
    "tool.zoomOut": "Zoom out",
    "tool.contrast": "High contrast",
    "tool.reset": "Reset",
    "tool.accessHelp": "Accessibility",
    "accessPanel.aria": "Accessibility browsing tools",
    "accessPanel.title": "Accessibility Tools",
    "accessPanel.opened": "Accessibility toolbar expanded.",
    "accessPanel.closed": "Accessibility toolbar collapsed.",
    "top.email": "Email",
    "brand.aria": "kqdhysj Studio home",
    "brand.name": "kqdhysj Studio",
    "brand.subtitle": "glagame, text-based game and standalone game portal",
    "search.aria": "Site search",
    "search.label": "Site search",
    "search.input": "Enter keywords",
    "search.button": "Search",
    "search.empty": "Please enter a search keyword.",
    "search.none": "No content found for \"{query}\".",
    "search.found": "Located content related to \"{query}\".",
    "search.resultsAria": "Search suggestions",
    "search.resultsTitle": "Fuzzy Search Results",
    "search.resultCount": "{count} related items found",
    "nav.aria": "Main navigation",
    "nav.toggle": "Open section navigation",
    "nav.home": "Home",
    "nav.overview": "Overview",
    "nav.services": "Works",
    "nav.works": "Showcase",
    "nav.portal": "Service Portal",
    "nav.weather": "Weather",
    "nav.news": "Updates",
    "nav.accessibility": "Accessibility",
    "nav.public": "Disclosure",
    "nav.contact": "Contact",
    "focus.label": "Featured",
    "focus.text": "Focused on glagame, text-based games, and standalone games.",
    "hero.kicker": "Studio Information Release",
    "hero.title": "kqdhysj Studio",
    "hero.body": "We support glagame, text-based games, and standalone games.",
    "hero.meta.directionLabel": "Focus",
    "hero.meta.directionValue": "glagame, text games, standalone games",
    "hero.meta.updateLabel": "Information",
    "hero.meta.updateValue": "Notices, services, contact channels",
    "hero.meta.accessLabel": "Access",
    "hero.meta.accessValue": "Accessibility, care mode, three languages",
    "hero.primary": "View works services",
    "hero.secondary": "View accessibility",
    "hero.panelAria": "Section links",
    "window.title": "Section Links",
    "window.directionLabel": "Focus",
    "window.directionValue": "glagame, text-based games, standalone games",
    "window.accessLabel": "Accessibility",
    "window.accessValue": "Three languages, senior mode, assistive reading",
    "window.emailLabel": "Email",
    "weather.title": "Weather Service",
    "weather.desc": "Automatically detects the IP location, supports major cities across China, and uses the Open-Meteo API for current weather.",
    "weather.cityLabel": "City",
    "weather.cityAria": "Enter a city name in China",
    "weather.city.shanghai": "Shanghai",
    "weather.city.beijing": "Beijing",
    "weather.city.guangzhou": "Guangzhou",
    "weather.city.chengdu": "Chengdu",
    "weather.city.newyork": "New York",
    "weather.refresh": "Search weather",
    "weather.location": "Use current location",
    "weather.loadingLocation": "Loading weather",
    "weather.loading": "Requesting weather data",
    "weather.apparent": "Feels like",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind speed",
    "weather.updated": "Updated",
    "weather.source": "Source: Open-Meteo weather API, with wttr.in fallback when needed. Weather information is for reference only.",
    "weather.currentLocation": "Current location",
    "weather.geoUnsupported": "Geolocation is not supported. Showing the default city weather.",
    "weather.geoDenied": "Unable to get your location. Showing the default city weather.",
    "weather.ipLoading": "Detecting location from IP",
    "weather.ipLocation": "IP location",
    "weather.ipFallback": "Unable to detect the IP location. Showing the default city weather and local time.",
    "weather.error": "Weather data is temporarily unavailable. Check the city name or try again later.",
    "weather.clear": "Clear",
    "weather.mainlyClear": "Mainly clear",
    "weather.partlyCloudy": "Partly cloudy",
    "weather.overcast": "Overcast",
    "weather.fog": "Fog",
    "weather.drizzle": "Drizzle",
    "weather.freezingDrizzle": "Freezing drizzle",
    "weather.rain": "Rain",
    "weather.freezingRain": "Freezing rain",
    "weather.snow": "Snow",
    "weather.snowGrains": "Snow grains",
    "weather.showers": "Showers",
    "weather.snowShowers": "Snow showers",
    "weather.thunderstorm": "Thunderstorm",
    "weather.unknown": "Unknown weather",
    "convenience.title": "Service Portal",
    "convenience.desc": "Quick links for creation, games, image editing, and tools.",
    "convenience.gridAria": "Service portal links",
    "portal.touchgal.category": "Text games",
    "portal.touchgal.title": "TouchGAL",
    "portal.touchgal.desc": "Free galgame download site",
    "portal.steam.category": "Game platform",
    "portal.steam.title": "Steam Online Store",
    "portal.steam.desc": "Standalone and indie game store",
    "portal.gequbao.category": "Music tool",
    "portal.gequbao.title": "Gequbao",
    "portal.gequbao.desc": "Free MP3 music downloads",
    "portal.photopea.category": "Image editing",
    "portal.photopea.title": "Photopea",
    "portal.photopea.desc": "Free online image and PSD editor",
    "portal.kuro.category": "Cloud Wuthering Waves",
    "portal.kuro.title": "Kuro Official Cloud Wuthering Waves",
    "portal.kuro.desc": "Play Wuthering Waves online.",
    "portal.pgyer.category": "Android App",
    "portal.pgyer.title": "GO Installer",
    "portal.pgyer.desc": "Install Google service components.",
    "portal.claude.category": "Check Tool",
    "portal.claude.title": "Claude China User Check",
    "portal.claude.desc": "Third-party tool access page.",
    "guide.title": "Service Guide",
    "guide.desc": "Common paths for information lookup, service entry, contact feedback, and accessible browsing.",
    "guide.card1.tag": "Portal",
    "guide.card1.title": "Service Portal",
    "guide.card1.body": "Creation, game, image, and tool links now live on a separate relative page. Use the header Service Portal link to enter.",
    "guide.card1.link": "Open portal",
    "guide.card2.tag": "Notice",
    "guide.card2.title": "Notice Lookup",
    "guide.card2.body": "Official notices for the email address, platform pages, and contact channels are published as PDF documents.",
    "guide.card2.link": "View notices",
    "guide.card3.tag": "Disclosure",
    "guide.card3.title": "Disclosure Entry",
    "guide.card3.body": "Host, organizer, studio focus, and public information are centralized for easier site verification.",
    "guide.card3.link": "View disclosure",
    "guide.card4.tag": "Access",
    "guide.card4.title": "Accessible Browsing",
    "guide.card4.body": "Pointer reading, font controls, high contrast, and care mode support different browsing needs.",
    "guide.card4.link": "View accessibility",
    "quick.title": "Quick Services",
    "quick.more": "Open",
    "quick.item1": "Service Portal",
    "quick.tag1": "Relative link",
    "quick.item2": "Accessibility and pointer reading",
    "quick.tag2": "Service",
    "quick.item3": "Host and organizer disclosure",
    "quick.tag3": "Disclosure",
    "quick.item4": "Email and platform contacts",
    "quick.tag4": "Contact",
    "quick.item5": "Works showcase",
    "quick.tag5": "Projects",
    "quick.item6": "Website corrections and feedback",
    "quick.tag6": "Feedback",
    "quick.item7": "Sitemap and access help",
    "quick.tag7": "Index",
    "overview.title": "Studio Overview",
    "overview.desc": "A game content portal centered on narrative design, gameplay planning, and independent release support.",
    "overview.card1.title": "Clear Focus",
    "overview.card1.body": "The studio focuses on glagame, text-based games, and standalone games, with ongoing work in story experiences, player choices, branching routes, and lightweight prototypes.",
    "overview.card2.title": "Narrative First",
    "overview.card2.body": "Worldbuilding, character relationships, pacing, and player decisions guide the text, rules, and feedback of each experience.",
    "overview.card3.title": "Friendly Access",
    "overview.card3.body": "Simplified Chinese, Traditional Chinese, English, senior mode, and assistive reading help more players browse the portal.",
    "services.title": "Works Services",
    "services.desc": "Support for text-based and standalone game projects from concept to release.",
    "services.card1.title": "glagame Planning",
    "services.card1.body": "Define genre, target players, core experience, gameplay loop, and version scope for an executable project plan.",
    "services.card2.title": "Text Game Story Branching",
    "services.card2.body": "Plan chapter structure, character arcs, choice consequences, ending routes, and reading rhythm.",
    "services.card3.title": "Standalone Prototype Polish",
    "services.card3.body": "Support mechanics validation, level pacing, interaction notes, playable build checklists, and experience reviews.",
    "services.card4.title": "Accessibility and Release Support",
    "services.card4.body": "Prepare announcements, version notes, player guidance, and multilingual content so work information is easier to read and share.",
    "news.title": "Studio Updates",
    "news.desc": "Centralized updates for the studio portal, services, and access support.",
    "news.more": "More",
    "news.item1": "The portal has been updated for glagame, text-based games, and standalone games",
    "news.item2": "Accessibility section launched with assistive reading and senior mode",
    "news.item3": "Simplified Chinese, Traditional Chinese, and English switching is configured",
    "news.item4": "Host and organizer information has been publicly marked",
    "notice.title": "Notices",
    "notice.consult": "Contact",
    "notice.item1": "Notice on the studio's public email address",
    "notice.item2": "Notice on the public Bilibili homepage link",
    "notice.item3": "Notice on Disclosure of X Account Information",
    "notice.item4": "Notice on Disclosure of Facebook Contact Channel",
    "access.title": "Accessibility Services",
    "access.desc": "The page uses semantic structure and is designed to work with Microsoft Narrator, Microsoft Edge Read Aloud, and common assistive reading tools.",
    "access.card1.title": "Assistive Reading",
    "access.card1.body": "Open the top Accessibility toolbar, turn on Pointer reading, then hover or focus text, buttons, and links to read the matching text aloud.",
    "access.card2.title": "Senior Mode",
    "access.card2.body": "Larger text, wider line spacing, and bigger controls make notices, contacts, and service information easier to read.",
    "access.card3.title": "Keyboard Access",
    "access.card3.body": "The page supports skip links, visible focus outlines, and keyboard-operable navigation and tool buttons.",
    "access.card4.title": "Three Languages",
    "access.card4.body": "Simplified Chinese, Traditional Chinese, and English are available, and the selected language is saved in this browser.",
    "public.title": "Information Disclosure",
    "public.desc": "The following information is for studio presentation and collaboration only. This is not a government or public agency website.",
    "public.tableAria": "Studio public information",
    "public.nameLabel": "Name",
    "public.nameValue": "kqdhysj Studio",
    "public.hostLabel": "Hosted by",
    "public.organizerLabel": "Organized by",
    "public.typeLabel": "Focus",
    "public.typeValue": "glagame, text-based games, standalone games, story-driven interactive experiences",
    "public.emailLabel": "Email",
    "public.feedbackEmailLabel": "Website feedback email",
    "works.title": "Works Showcase",
    "works.desc": "This page currently shows the game Where Stars Drift; the introduction text is placeholder content for later updates.",
    "works.card1.title": "Where Stars Drift",
    "works.card1.body": "Placeholders: game type to be added; story summary to be added; gameplay features to be added; development status to be added.",
    "works.card1.link": "View Details",
    "works.contact": "Contact the studio",
    "workDetail.metaTitle": "Where Stars Drift - kqdhysj Studio Portal",
    "workDetail.metaDescription": "Details for kqdhysj Studio game Where Stars Drift, with placeholder Steam purchase information.",
    "workDetail.breadcrumb": "Where Stars Drift",
    "workDetail.noticeLabel": "Work Information",
    "workDetail.title": "Where Stars Drift",
    "workDetail.englishTitle": "Where Stars Drift",
    "workDetail.desc": "This is the detail page for Where Stars Drift. Current content is placeholder text and can later be replaced with the official introduction, screenshots, release information, and purchase link.",
    "workDetail.metaHeading": "Basic Information",
    "workDetail.meta.typeLabel": "Type",
    "workDetail.meta.typeValue": "glagame / text-based game / standalone",
    "workDetail.meta.statusLabel": "Development status",
    "workDetail.meta.statusValue": "Placeholder: in production",
    "workDetail.meta.platformLabel": "Planned platform",
    "workDetail.meta.platformValue": "Windows / Steam",
    "workDetail.meta.releaseLabel": "Release date",
    "workDetail.meta.releaseValue": "Placeholder: to be announced",
    "workDetail.meta.developerLabel": "Developer",
    "workDetail.meta.developerValue": "kqdhysj Studio",
    "workDetail.meta.publisherLabel": "Publisher",
    "workDetail.meta.publisherValue": "Placeholder: to be confirmed",
    "workDetail.meta.languageLabel": "Languages",
    "workDetail.meta.languageValue": "Placeholder: Simplified Chinese, Traditional Chinese, English",
    "workDetail.intro.title": "Introduction",
    "workDetail.intro.p1": "Placeholder: this section will introduce the world, story background, and central conflict of Where Stars Drift.",
    "workDetail.intro.p2": "Placeholder: this section will cover main characters, chapter structure, player choices, and ending branches.",
    "workDetail.intro.p3": "Placeholder: this section will describe pacing, text presentation, save flow, music and art direction, and target players.",
    "workDetail.features.title": "Features",
    "workDetail.feature1": "Placeholder: multi-chapter text narrative with key choice branches.",
    "workDetail.feature2": "Placeholder: story progression centered on character relationships and the passage of time.",
    "workDetail.feature3": "Placeholder: lightweight interaction and save flow for standalone play.",
    "workDetail.feature4": "Placeholder: achievements, CG, music, and multiple endings may be added later.",
    "workDetail.steam.title": "Steam Store Page Coming Soon",
    "workDetail.steam.desc": "This is a placeholder purchase area. Replace it with the official Steam URL, price, and release date when confirmed.",
    "workDetail.steam.statusLabel": "Store status",
    "workDetail.steam.statusValue": "Placeholder: not public yet",
    "workDetail.steam.priceLabel": "Price",
    "workDetail.steam.price": "Price TBD",
    "workDetail.steam.platformLabel": "Platform",
    "workDetail.steam.platformValue": "Steam",
    "workDetail.steam.dateLabel": "Launch date",
    "workDetail.steam.dateValue": "To be announced",
    "workDetail.steam.button": "Purchase Entry Pending",
    "workDetail.steam.note": "Note: this button is a placeholder and does not open an external store.",
    "workDetail.actions.back": "Back to Works",
    "feedback.title": "Website Corrections and Feedback",
    "feedback.desc": "Feedback channel for text errors, broken links, layout issues, accessibility problems, and site updates.",
    "feedback.emailLabel": "Feedback email",
    "feedback.scopeLabel": "Scope",
    "feedback.scopeValue": "Typos, broken links, display issues, assistive reading problems, and information update suggestions",
    "feedback.formatLabel": "Suggested details",
    "feedback.formatValue": "Page name, issue location, description, optional screenshot or browser information",
    "feedback.mailAction": "Send website feedback",
    "sitemap.title": "Sitemap and Access Help",
    "sitemap.desc": "Relative links grouped by section, with accessibility, feedback, and contact entries collected in one place.",
    "sitemap.group1": "Main sections",
    "sitemap.mainTitle": "Content entries",
    "sitemap.group2": "Service entries",
    "sitemap.serviceTitle": "Services and disclosure",
    "sitemap.group3": "Access help",
    "sitemap.helpTitle": "Accessibility and feedback",
    "sitemap.group4": "How to use",
    "sitemap.accessTitle": "Browsing support",
    "sitemap.accessBody": "Use the top Accessibility toolbar to turn on pointer reading, font controls, high contrast, and senior mode.",
    "contact.title": "Contact",
    "contact.desc": "You can contact kqdhysj Studio through the public channels below.",
    "contact.emailLabel": "Email",
    "contact.feedbackLabel": "Website feedback",
    "contact.biliLabel": "Bilibili",
    "contact.biliLink": "Open Bilibili page",
    "contact.facebookLink": "Open Facebook contact page",
    "contact.xLink": "Open X account",
    "footer.title": "kqdhysj Studio Information Portal",
    "footer.host": "Hosted by: kqdhysj",
    "footer.organizer": "Organized by: kqdhysj",
    "contact.emailAction": "Send studio email",
    "contact.emailActionAria": "Send studio contact email",
    "contact.feedbackActionAria": "Send website feedback email",
    "consult.title": "Consultation Form",
    "consult.desc": "Submit project inquiries, collaboration messages, work-related questions, website feedback, or accessibility issues.",
    "consult.type": "Inquiry type",
    "consult.typePlaceholder": "Please select",
    "consult.typeProject": "Project inquiry",
    "consult.typeCooperation": "Collaboration",
    "consult.typeWorks": "Work-related",
    "consult.typeWebsite": "Website feedback",
    "consult.typeAccessibility": "Accessibility issue",
    "consult.typeOther": "Other",
    "consult.name": "Your name",
    "consult.contact": "Contact method",
    "consult.contactPlaceholder": "Enter an email address or 11-digit mobile number",
    "consult.contactHelp": "Only an email address or 11-digit mobile number is supported. Make sure it can receive replies, otherwise we may not be able to respond.",
    "consult.contactInvalid": "The contact method is invalid. Enter an email address or 11-digit mobile number.",
    "consult.language": "Preferred language",
    "consult.subject": "Subject",
    "consult.message": "Message",
    "consult.messagePlaceholder": "Please describe the background, related page or work, and the issue you want to resolve",
    "consult.link": "Related link",
    "consult.linkPlaceholder": "Optional",
    "consult.reply": "Reply needed",
    "consult.replyYes": "Reply needed",
    "consult.replyNo": "Submit only, no reply needed",
    "consult.consent": "I confirm the information is accurate and agree that kqdhysj Studio may use it only for contact, inquiry handling, and website feedback handling.",
    "consult.submit": "Submit inquiry",
    "consult.submitting": "Submitting your inquiry. Please wait.",
    "consult.success": "Your inquiry has been submitted. Thank you for contacting kqdhysj Studio.",
    "consult.error": "Submission failed. Please try again later or use the email contact entry.",
    "consult.ready": "The consultation form is ready.",
    "footer.email": "Contact: Email",
    "footer.feedback": "Website feedback: Feedback email",
    "footer.feedbackPage": "Corrections",
    "footer.sitemap": "Sitemap",
    "backtop.aria": "Back to top",
    "reader.start": "Pointer assistive reading is on. Hover with the mouse or focus text, buttons, or links to read the corresponding text.",
    "reader.stop": "Pointer assistive reading is off.",
    "reader.unsupported": "This browser does not support web speech. You can use Windows Narrator or Microsoft Edge Read Aloud.",
    "reader.hoverPrefix": "Reading: ",
    "senior.enabled": "Senior mode is on.",
    "senior.disabled": "Senior mode is off.",
    "contrast.enabled": "High contrast mode is on.",
    "contrast.disabled": "High contrast mode is off.",
    "font.increased": "Text size increased.",
    "font.decreased": "Text size decreased.",
    "font.reset": "Accessibility display settings reset.",
    "breadcrumb.current": "Current location",
    "breadcrumb.home": "Home",
    "page.backHome": "Back to home",
  },
};

const state = {
  language: localStorage.getItem("kqdhysj-language") || "zh-Hans",
  seniorMode: localStorage.getItem("kqdhysj-senior-mode") === "true",
  accessFontLevel: Number(localStorage.getItem("kqdhysj-access-font-level") || "0"),
  highContrast: localStorage.getItem("kqdhysj-high-contrast") === "true",
  timeZone: "",
  ipLocation: null,
  reading: false,
  pointerReading: false,
  lastReadText: "",
  lastReadAt: 0,
  activeReadTarget: null,
  weather: null,
  weatherCitySuggestTimer: 0,
  sixtySevenWobbleTimer: 0,
  cialloBarrageTimer: 0,
  searchMatches: [],
};

function t(key) {
  return translations[state.language]?.[key] || translations["zh-Hans"][key] || key;
}

function getDateTimeOptions(options = {}) {
  return state.timeZone ? { ...options, timeZone: state.timeZone } : options;
}

function getPart(parts, type) {
  return parts.find((part) => part.type === type)?.value || "";
}

function renderDate() {
  const now = new Date();

  if (timeTarget) {
    timeTarget.textContent = new Intl.DateTimeFormat(languageMeta[state.language].htmlLang, getDateTimeOptions({
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })).format(now);
  }

  if (!dateTarget) return;

  if (state.language === "en") {
    dateTarget.textContent = new Intl.DateTimeFormat("en-US", getDateTimeOptions({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })).format(now);
    return;
  }

  const parts = new Intl.DateTimeFormat(languageMeta[state.language].htmlLang, getDateTimeOptions({
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })).formatToParts(now);
  dateTarget.textContent = `${getPart(parts, "year")}年${getPart(parts, "month")}月${getPart(parts, "day")}日 ${getPart(parts, "weekday")}`;
}

function applyLanguage(language) {
  state.language = translations[language] ? language : "zh-Hans";
  localStorage.setItem("kqdhysj-language", state.language);

  document.documentElement.lang = languageMeta[state.language].htmlLang;
  document.title = t(document.body?.dataset.pageTitle || "meta.title");
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    t(document.body?.dataset.pageDescription || "meta.description")
  );

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-src]").forEach((element) => {
    const sourceTemplate = element.dataset.i18nSrc;
    if (sourceTemplate) {
      element.setAttribute("src", sourceTemplate.replace("{lang}", state.language));
    }
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === state.language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderDate();
  renderWeather();
  updateSteamPlaceholderButton();
  if (searchInput?.value.trim()) {
    updateSearchSuggestions();
  }
}

function buildProtectedEmail(key) {
  const parts = protectedEmailParts[key];
  if (!parts) return "";
  const [localPart, domainName, topLevelDomain] = parts;
  return `${localPart}${String.fromCharCode(64)}${domainName}.${topLevelDomain}`;
}

function handleProtectedEmailClick(event) {
  const trigger = event.currentTarget;
  const email = buildProtectedEmail(trigger.dataset.protectedEmail);
  if (!email) return;

  event.preventDefault();
  window.location.href = `mailto:${email}`;
}

function setupProtectedEmailActions() {
  document.querySelectorAll("[data-protected-email]").forEach((trigger) => {
    if (trigger.dataset.emailReady === "true") return;
    trigger.dataset.emailReady = "true";
    trigger.setAttribute("rel", "nofollow");
    trigger.addEventListener("click", handleProtectedEmailClick);
  });
}

function setConsultationStatus(messageKey, mode = "info") {
  if (!consultationStatus) return;
  consultationStatus.textContent = t(messageKey);
  consultationStatus.dataset.status = mode;
  setReaderStatus(t(messageKey));
}

function setConsultationSubmitting(isSubmitting) {
  const submitButton = consultationForm?.querySelector('button[type="submit"]');
  if (!submitButton) return;
  submitButton.disabled = isSubmitting;
  submitButton.textContent = t(isSubmitting ? "consult.submitting" : "consult.submit");
  submitButton.setAttribute("aria-busy", String(isSubmitting));
}

function isValidConsultationContact(value) {
  const contact = String(value || "").trim();
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const mainlandMobilePattern = /^1[3-9]\d{9}$/;
  return emailPattern.test(contact) || mainlandMobilePattern.test(contact);
}

function validateConsultationContact(showMessage = true) {
  const contactInput = consultationForm?.querySelector('[name="visitor_contact"]');
  if (!contactInput) return true;

  const isValid = isValidConsultationContact(contactInput.value);
  contactInput.setCustomValidity(isValid ? "" : t("consult.contactInvalid"));
  contactInput.setAttribute("aria-invalid", String(!isValid));

  if (!isValid && showMessage) {
    setConsultationStatus("consult.contactInvalid", "error");
    contactInput.reportValidity?.();
  }

  return isValid;
}

async function handleConsultationSubmit(event) {
  event.preventDefault();
  if (!consultationForm || consultationForm.dataset.submitting === "true") return;

  if (!validateConsultationContact()) return;

  const formData = new FormData(consultationForm);
  if (formData.get("botcheck")) {
    setConsultationStatus("consult.success", "success");
    consultationForm.reset();
    return;
  }

  consultationForm.dataset.submitting = "true";
  setConsultationSubmitting(true);
  setConsultationStatus("consult.submitting");

  try {
    const response = await fetch(consultationForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Form submission failed");
    }

    consultationForm.reset();
    const replyDefault = consultationForm.querySelector('input[name="need_reply"][value="需要回复"]');
    if (replyDefault) {
      replyDefault.checked = true;
    }
    setConsultationStatus("consult.success", "success");
  } catch (error) {
    setConsultationStatus("consult.error", "error");
  } finally {
    consultationForm.dataset.submitting = "false";
    setConsultationSubmitting(false);
  }
}

function setupConsultationForm() {
  if (!consultationForm) return;
  const contactInput = consultationForm.querySelector('[name="visitor_contact"]');
  contactInput?.addEventListener("input", () => validateConsultationContact(false));
  contactInput?.addEventListener("blur", () => validateConsultationContact(false));
  consultationForm.addEventListener("submit", handleConsultationSubmit);
}

function closeNav() {
  navList?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "");
}

function getSearchTokens(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[\s,，.。;；:：、/\\|]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function getEditDistance(a, b, limit = 2) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let rowMin = current[0];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > limit) return limit + 1;
    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function getSequentialScore(query, text) {
  let cursor = 0;
  let gaps = 0;
  for (const char of query) {
    const foundAt = text.indexOf(char, cursor);
    if (foundAt === -1) return 0;
    gaps += Math.max(0, foundAt - cursor);
    cursor = foundAt + 1;
  }
  return Math.max(20, 70 - gaps);
}

function getSearchTitle(item) {
  const titleSource = item.querySelector("h1, h2, h3, strong, a") || item;
  return titleSource.textContent.trim().replace(/\s+/g, " ").slice(0, 42);
}

function getSearchExcerpt(item, title) {
  const text = item.textContent.trim().replace(/\s+/g, " ");
  const excerpt = text.startsWith(title) ? text.slice(title.length).trim() : text;
  return (excerpt || text).slice(0, 78);
}

function getSearchScore(query, rawText) {
  const text = rawText.toLowerCase();
  const compactText = normalizeSearchText(rawText);
  const compactQuery = normalizeSearchText(query);
  const tokens = getSearchTokens(query);
  let score = 0;

  if (!compactQuery || !compactText) return null;
  if (text.includes(query.toLowerCase())) score = Math.max(score, 120);
  if (compactText.includes(compactQuery)) score = Math.max(score, 105);
  if (tokens.length && tokens.every((token) => text.includes(token))) score = Math.max(score, 92);
  if (compactQuery.length > 1) score = Math.max(score, getSequentialScore(compactQuery, compactText));

  if (compactQuery.length >= 3 && compactQuery.length <= 24) {
    const words = text.match(/[a-z0-9\u3400-\u9fff]+/gi) || [];
    const distanceLimit = compactQuery.length <= 5 ? 1 : 2;
    const hasCloseWord = words.some((word) => {
      const compactWord = normalizeSearchText(word);
      if (compactWord.length < 2) return false;
      return getEditDistance(compactQuery, compactWord, distanceLimit) <= distanceLimit;
    });
    if (hasCloseWord) score = Math.max(score, 76);
  }

  return score || null;
}

function scoreSearchItem(query, item, index) {
  const rawText = item.textContent.trim().replace(/\s+/g, " ");
  const score = getSearchScore(query, rawText);
  if (!score) return null;

  const title = getSearchTitle(item);
  return {
    item,
    score,
    title,
    excerpt: getSearchExcerpt(item, title),
    index,
  };
}

function getSiteSearchEntryText(entry) {
  return [
    t(entry.titleKey),
    ...(entry.excerptKeys || []).map((key) => t(key)),
    ...(entry.keywords || []),
  ].filter(Boolean).join(" ");
}

function scoreSiteSearchEntry(query, entry, index) {
  const title = t(entry.titleKey);
  const excerpt = (entry.excerptKeys || [])
    .map((key) => t(key))
    .filter(Boolean)
    .join(" ")
    .slice(0, 78);
  const score = getSearchScore(query, getSiteSearchEntryText(entry));
  if (!score) return null;

  return {
    href: entry.href,
    score: score - 1,
    title,
    excerpt,
    index: 1000 + index,
  };
}

function getSearchMatches(query) {
  const searchableItems = [...document.querySelectorAll(".searchable")];
  searchableItems.forEach((item) => item.classList.remove("is-highlighted"));
  const pageMatches = searchableItems.map((item, index) => scoreSearchItem(query, item, index));
  const siteMatches = siteSearchIndex.map((entry, index) => scoreSiteSearchEntry(query, entry, index));

  return [...pageMatches, ...siteMatches]
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 6);
}

function hideSearchResults() {
  if (!searchResults) return;
  searchResults.hidden = true;
  searchResults.replaceChildren();
}

function renderSearchResults(matches) {
  if (!searchResults) return;
  searchResults.replaceChildren();
  if (!matches.length) {
    searchResults.hidden = true;
    return;
  }

  const head = document.createElement("div");
  head.className = "search-results__head";
  const headTitle = document.createElement("span");
  headTitle.textContent = t("search.resultsTitle");
  const headCount = document.createElement("small");
  headCount.textContent = t("search.resultCount").replace("{count}", String(matches.length));
  head.append(headTitle, headCount);

  const list = document.createElement("div");
  list.className = "search-results__list";
  matches.forEach((match, index) => {
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    button.setAttribute("role", "option");
    button.dataset.searchIndex = String(index);
    const title = document.createElement("strong");
    title.textContent = match.title;
    const excerpt = document.createElement("span");
    excerpt.textContent = match.excerpt;
    button.append(title, excerpt);
    button.addEventListener("click", () => locateSearchMatch(match));
    list.append(button);
  });

  searchResults.append(head, list);
  searchResults.hidden = false;
}

function triggerSixtySevenWobble(query) {
  const normalizedQuery = query.replace(/[\s\-_－—]+/g, "");
  if (normalizedQuery !== "67") return;

  document.body.classList.remove("is-sixty-seven-wobbling");
  void document.body.offsetWidth;
  document.body.classList.add("is-sixty-seven-wobbling");
  window.clearTimeout(state.sixtySevenWobbleTimer);
  state.sixtySevenWobbleTimer = window.setTimeout(() => {
    document.body.classList.remove("is-sixty-seven-wobbling");
  }, 3000);
}

function removeCialloBarrage() {
  window.clearTimeout(state.cialloBarrageTimer);
  document.querySelector(".ciallo-barrage")?.remove();
}

function triggerCialloBarrage(query) {
  const normalizedQuery = String(query || "").trim().toLowerCase().replace(/[\s\-_~!]+/g, "");
  if (normalizedQuery !== "ciallo") return false;

  removeCialloBarrage();

  const barrage = document.createElement("div");
  barrage.className = "ciallo-barrage";
  barrage.setAttribute("aria-hidden", "true");

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const compactViewport = window.matchMedia?.("(max-width: 720px)").matches;
  const cialloBarrageCount = prefersReducedMotion ? 18 : compactViewport ? 48 : 72;
  const colors = ["#b60009", "#c99a33", "#ffffff", "#ffe8a3", "#7a0010"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < cialloBarrageCount; index += 1) {
    const item = document.createElement("span");
    item.className = "ciallo-barrage__item";
    item.textContent = index % 4 === 0 ? "ciallo~~" : "ciallo~";
    const top = (index * (100 / cialloBarrageCount) + Math.random() * 4.8) % 100;
    const duration = prefersReducedMotion ? 0.01 : 2.8 + Math.random() * 2.2;
    const delay = prefersReducedMotion ? 0 : Math.random() * 1.05;

    item.style.setProperty("--ciallo-top", `${top.toFixed(2)}vh`);
    item.style.setProperty("--ciallo-size", `${Math.round(16 + Math.random() * 18)}px`);
    item.style.setProperty("--ciallo-color", colors[index % colors.length]);
    item.style.setProperty("--ciallo-duration", `${duration.toFixed(2)}s`);
    item.style.setProperty("--ciallo-delay", `${delay.toFixed(2)}s`);
    const tilt = Math.random() * 8 - 4;
    item.style.setProperty("--ciallo-tilt", `${tilt.toFixed(2)}deg`);
    item.style.setProperty("--ciallo-end-tilt", `${(-tilt).toFixed(2)}deg`);
    fragment.append(item);
  }

  barrage.append(fragment);
  document.body.append(barrage);
  state.cialloBarrageTimer = window.setTimeout(removeCialloBarrage, prefersReducedMotion ? 900 : 5600);
  return true;
}

function locateSearchMatch(match) {
  if (!match) return;
  if (match.href) {
    if (searchStatus) searchStatus.textContent = t("search.found").replace("{query}", searchInput.value.trim());
    hideSearchResults();
    window.location.href = match.href;
    return;
  }

  match.item.classList.add("is-highlighted");
  match.item.scrollIntoView({ behavior: "smooth", block: "center" });
  searchStatus.textContent = t("search.found").replace("{query}", searchInput.value.trim());
  hideSearchResults();
}

function updateSearchSuggestions() {
  if (!searchInput) return;
  const query = searchInput.value.trim();
  triggerSixtySevenWobble(query);
  if (triggerCialloBarrage(query)) {
    hideSearchResults();
    if (searchStatus) searchStatus.textContent = "";
    return;
  }
  if (!query) {
    hideSearchResults();
    if (searchStatus) searchStatus.textContent = "";
    return;
  }
  state.searchMatches = getSearchMatches(query);
  renderSearchResults(state.searchMatches);
  searchStatus.textContent = state.searchMatches.length
    ? t("search.resultCount").replace("{count}", String(state.searchMatches.length))
    : t("search.none").replace("{query}", query);
}

function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    hideSearchResults();
    searchStatus.textContent = t("search.empty");
    searchInput.focus();
    return;
  }

  state.searchMatches = getSearchMatches(query);
  if (triggerCialloBarrage(query)) {
    hideSearchResults();
    if (searchStatus) searchStatus.textContent = "";
    return;
  }
  if (!state.searchMatches.length) {
    hideSearchResults();
    searchStatus.textContent = t("search.none").replace("{query}", query);
    return;
  }

  renderSearchResults(state.searchMatches);
  locateSearchMatch(state.searchMatches[0]);
}

function updateBackTop() {
  backTop?.classList.toggle("is-visible", window.scrollY > 520);
}

function scrollHashTargetIntoView() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  window.setTimeout(() => {
    target.scrollIntoView({ block: "start" });
    if (target.hasAttribute("tabindex")) {
      target.focus({ preventScroll: true });
    }
    highlightLocationTarget(id);
  }, 120);
}

function getAnchorIdFromHref(href) {
  if (!href) return "";
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return "";
  return href.slice(hashIndex + 1);
}

function highlightLocationTarget(id) {
  if (!locationHighlightIds.has(id)) return;
  const target = document.getElementById(id);
  if (!target) return;

  window.clearTimeout(locationHighlightTimers.get(target));
  target.classList.remove("is-location-highlighted");
  void target.offsetWidth;
  target.classList.add("is-location-highlighted");
  locationHighlightTimers.set(target, window.setTimeout(() => {
    target.classList.remove("is-location-highlighted");
  }, 2000));
}

function getCurrentPageName() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function getCurrentSectionPageName() {
  const pageName = getCurrentPageName();
  return sectionPageMap[pageName] || pageName;
}

function getNavTarget(link) {
  const href = link.getAttribute("href") || "";
  if (href === "index.html" || href === "./" || href === "/") return "main";
  if (href.startsWith("index.html#")) return href.split("#")[1] || "main";
  if (href.startsWith("#")) return href.slice(1) || "main";
  return href;
}

function setActiveNav() {
  const currentPage = getCurrentPageName();
  if (currentPage !== "index.html") {
    const currentSectionPage = getCurrentSectionPageName();
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", getNavTarget(link) === currentSectionPage);
    });
    return;
  }

  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 110)
    .at(-1);

  if (!current) return;

  const id = current.id === "main" ? "main" : current.id;
  navLinks.forEach((link) => {
    const target = getNavTarget(link);
    link.classList.toggle("is-active", target === id);
  });
}

function applySeniorMode() {
  document.body.classList.toggle("senior-mode", state.seniorMode);
  seniorModeToggle?.setAttribute("aria-pressed", String(state.seniorMode));
  localStorage.setItem("kqdhysj-senior-mode", String(state.seniorMode));
}

function applyAccessDisplaySettings() {
  state.accessFontLevel = Math.max(0, Math.min(2, state.accessFontLevel));
  document.body.classList.toggle("access-font-large", state.accessFontLevel === 1);
  document.body.classList.toggle("access-font-larger", state.accessFontLevel === 2);
  document.body.classList.toggle("high-contrast", state.highContrast);
  contrastToggle?.setAttribute("aria-pressed", String(state.highContrast));
  localStorage.setItem("kqdhysj-access-font-level", String(state.accessFontLevel));
  localStorage.setItem("kqdhysj-high-contrast", String(state.highContrast));
}

function setAccessibilityPanel(open) {
  if (!accessibilityPanel || !accessibilityModeToggle) return;
  accessibilityPanel.hidden = !open;
  accessibilityModeToggle.setAttribute("aria-expanded", String(open));
  setReaderStatus(t(open ? "accessPanel.opened" : "accessPanel.closed"));
}

function getWeatherSummaryKey(code) {
  if (code === 0) return "weather.clear";
  if ([1].includes(code)) return "weather.mainlyClear";
  if ([2].includes(code)) return "weather.partlyCloudy";
  if ([3].includes(code)) return "weather.overcast";
  if ([45, 48].includes(code)) return "weather.fog";
  if ([51, 53, 55].includes(code)) return "weather.drizzle";
  if ([56, 57].includes(code)) return "weather.freezingDrizzle";
  if ([61, 63, 65].includes(code)) return "weather.rain";
  if ([66, 67].includes(code)) return "weather.freezingRain";
  if ([71, 73, 75].includes(code)) return "weather.snow";
  if (code === 77) return "weather.snowGrains";
  if ([80, 81, 82].includes(code)) return "weather.showers";
  if ([85, 86].includes(code)) return "weather.snowShowers";
  if ([95, 96, 99].includes(code)) return "weather.thunderstorm";
  return "weather.unknown";
}

function getWttrSummaryKey(description = "") {
  const value = description.toLowerCase().trim();
  if (!value) return "weather.unknown";
  if (value.includes("sunny") || value === "clear") return "weather.clear";
  if (value.includes("mainly clear")) return "weather.mainlyClear";
  if (value.includes("partly cloudy")) return "weather.partlyCloudy";
  if (value.includes("cloudy") || value.includes("overcast")) return "weather.overcast";
  if (value.includes("fog") || value.includes("mist") || value.includes("haze")) return "weather.fog";
  if (value.includes("drizzle")) return "weather.drizzle";
  if (value.includes("thunder")) return "weather.thunderstorm";
  if (value.includes("snow")) return "weather.snow";
  if (value.includes("shower")) return "weather.showers";
  if (value.includes("rain")) return "weather.rain";
  if (value.includes("雷")) return "weather.thunderstorm";
  if (value.includes("阵雨")) return "weather.showers";
  if (value.includes("雪")) return "weather.snow";
  if (value.includes("冻雨")) return "weather.freezingRain";
  if (value.includes("毛毛雨")) return "weather.drizzle";
  if (value.includes("雨")) return "weather.rain";
  if (value.includes("雾") || value.includes("霾")) return "weather.fog";
  if (value.includes("局部多云") || value.includes("少云")) return "weather.partlyCloudy";
  if (value.includes("多云")) return "weather.partlyCloudy";
  if (value.includes("阴")) return "weather.overcast";
  if (value.includes("晴")) return "weather.clear";
  return "weather.unknown";
}

function getWttrDescription(current) {
  const weatherCode = Number(current?.weatherCode);
  if (Number.isFinite(weatherCode)) {
    return t(getWeatherSummaryKey(weatherCode));
  }

  const chineseDescription = current?.lang_zh?.[0]?.value || "";
  const apiDescription = chineseDescription || current?.weatherDesc?.[0]?.value || "";
  if (state.language !== "en" && chineseDescription) {
    const summaryKey = getWttrSummaryKey(chineseDescription);
    return summaryKey === "weather.unknown" ? chineseDescription : t(summaryKey);
  }
  return t(getWttrSummaryKey(apiDescription));
}

function normalizePlaceName(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizePlaceNameAlias(value = "") {
  return normalizePlaceName(value).replace(
    /\s+(province|city|municipality|autonomous region|special administrative region)$/u,
    ""
  );
}

function localizeRegionCode(code) {
  const normalized = normalizePlaceName(code).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";

  try {
    const regionNames = new Intl.DisplayNames([languageMeta[state.language].htmlLang], { type: "region" });
    return regionNames.of(normalized) || "";
  } catch {
    return "";
  }
}

function localizePlaceName(value = "") {
  const rawValue = String(value).trim();
  if (!rawValue) return "";

  const normalized = normalizePlaceName(rawValue);
  const alias = placeNameAliases[normalized] || placeNameAliases[normalizePlaceNameAlias(rawValue)];
  if (alias) return alias[state.language] || alias["zh-Hans"];

  return localizeRegionCode(rawValue) || rawValue;
}

function uniqueLocationParts(parts) {
  const seen = new Set();
  return parts.filter((part) => {
    const value = String(part).trim();
    const key = normalizePlaceName(value);
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isChinaRegionCode(code = "") {
  return ["CN", "HK", "MO", "TW"].includes(String(code).toUpperCase());
}

function getCoordinateQuery(query = "") {
  const match = String(query).trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

function getGeocodeLocationLabel(result) {
  if (!result) return "";
  const includeCountry = !isChinaRegionCode(result.country_code);
  return uniqueLocationParts([
    localizePlaceName(result.name),
    localizePlaceName(result.admin1),
    includeCountry ? localizePlaceName(result.country_code || result.country) : "",
  ]).join("，");
}

function selectBestGeocodeResult(results = [], query = "") {
  const normalizedQuery = normalizePlaceName(query);
  const chinaResults = results.filter((result) => isChinaRegionCode(result.country_code));
  const preferredResults = chinaResults.length ? chinaResults : results;

  return (
    preferredResults.find((result) => normalizePlaceName(result.name) === normalizedQuery) ||
    preferredResults.find((result) => normalizePlaceName(result.name).includes(normalizedQuery)) ||
    preferredResults[0] ||
    null
  );
}

function toOpenMeteoCurrent(current = {}) {
  return {
    temp_C: current.temperature_2m,
    FeelsLikeC: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windspeedKmph: current.wind_speed_10m,
    weatherCode: current.weather_code,
  };
}

function syncWeatherCityList(extraCities = []) {
  if (!weatherCityList) return;

  const cities = [...chinaWeatherCities, ...extraCities]
    .map((city) => String(city || "").trim())
    .filter(Boolean);
  const uniqueCities = [...new Set(cities)];

  weatherCityList.replaceChildren(
    ...uniqueCities.map((city) => {
      const option = document.createElement("option");
      option.value = city;
      return option;
    })
  );
}

async function geocodeWeatherCity(cityName, count = 8) {
  const query = String(cityName || "").trim();
  if (!query) return null;

  const params = new URLSearchParams({
    name: query,
    count: String(count),
    language: state.language === "en" ? "en" : "zh",
    format: "json",
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];
  return selectBestGeocodeResult(results, query);
}

async function updateWeatherCitySuggestions() {
  const query = weatherCity?.value.trim() || "";
  if (query.length < 2) {
    syncWeatherCityList();
    return;
  }

  try {
    const params = new URLSearchParams({
      name: query,
      count: "12",
      language: state.language === "en" ? "en" : "zh",
      format: "json",
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    if (!response.ok) return;

    const data = await response.json();
    const suggestions = (data.results || [])
      .filter((result) => isChinaRegionCode(result.country_code))
      .map((result) => localizePlaceName(result.name))
      .filter(Boolean);
    syncWeatherCityList(suggestions);
  } catch (error) {
    console.warn(error);
  }
}

function getIpLocationLabel(data) {
  const city = localizePlaceName(data.city);
  const region = localizePlaceName(data.region);
  const country = localizePlaceName(data.country_code || data.country);
  const parts = uniqueLocationParts([city, region]);

  if (!["HK", "MO", "TW"].includes(String(data.country_code || "").toUpperCase()) && country) {
    parts.push(country);
  }

  return parts.join("，");
}

function getIpWeatherQuery(data) {
  const latitude = Number(data.latitude);
  const longitude = Number(data.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `${latitude},${longitude}`;
  }
  return data.city || defaultWeatherCity;
}

function setWeatherLoading(label = t("weather.loadingLocation")) {
  if (topWeatherSummary) topWeatherSummary.textContent = `${label} ${t("weather.loading")}`;
  if (weatherLocation) weatherLocation.textContent = label;
  if (weatherTemp) weatherTemp.textContent = "--°C";
  if (weatherSummary) weatherSummary.textContent = t("weather.loading");
  if (weatherApparent) weatherApparent.textContent = "--°C";
  if (weatherHumidity) weatherHumidity.textContent = "--%";
  if (weatherWind) weatherWind.textContent = "-- km/h";
  if (weatherUpdated) weatherUpdated.textContent = "--";
}

function renderWeather(weatherState = state.weather) {
  if (!weatherState) return;
  const { current, locationLabel, locationKey, locationPrefixKey, updatedAt } = weatherState;
  const summary = getWttrDescription(current);
  const baseLocation = locationKey ? t(locationKey) : locationLabel;
  const displayedLocation = locationPrefixKey ? `${t(locationPrefixKey)}: ${baseLocation}` : baseLocation;
  const temperature = `${Math.round(Number(current.temp_C))}°C`;

  if (topWeatherSummary) topWeatherSummary.textContent = `${displayedLocation} ${temperature} ${summary}`;
  if (weatherLocation) weatherLocation.textContent = displayedLocation;
  if (weatherTemp) weatherTemp.textContent = temperature;
  if (weatherSummary) weatherSummary.textContent = summary;
  if (weatherApparent) weatherApparent.textContent = `${Math.round(Number(current.FeelsLikeC))}°C`;
  if (weatherHumidity) weatherHumidity.textContent = `${Math.round(Number(current.humidity))}%`;
  if (weatherWind) weatherWind.textContent = `${Math.round(Number(current.windspeedKmph))} km/h`;
  if (weatherUpdated) {
    const date = new Date(updatedAt);
    weatherUpdated.textContent = Number.isNaN(date.getTime())
      ? "--"
      : new Intl.DateTimeFormat(languageMeta[state.language].htmlLang, getDateTimeOptions({
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })).format(date);
  }
}

async function fetchOpenMeteoWeather({ latitude, longitude, locationLabel, locationKey, locationPrefixKey }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.current) {
    throw new Error("Open-Meteo response missing current data");
  }

  state.weather = {
    current: toOpenMeteoCurrent(data.current),
    locationLabel,
    locationKey,
    locationPrefixKey,
    updatedAt: new Date().toISOString(),
  };
  renderWeather();
}

async function fetchWttrWeather({ query, locationLabel, locationKey, locationPrefixKey }) {
  const params = new URLSearchParams({ format: "j1", lang: "zh" });
  const weatherQuery = encodeURI(query);
  const response = await fetch(`https://wttr.in/${weatherQuery}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`wttr.in weather request failed: ${response.status}`);
  }

  const data = await response.json();
  const current = data.current_condition?.[0];
  if (!current) {
    throw new Error("wttr.in response missing current data");
  }

  state.weather = { current, locationLabel, locationKey, locationPrefixKey, updatedAt: new Date().toISOString() };
  renderWeather();
}

async function fetchWeather({ query, locationLabel, locationKey, locationPrefixKey }) {
  setWeatherLoading(locationKey ? t(locationKey) : locationLabel);

  try {
    const coordinates = getCoordinateQuery(query);
    if (coordinates) {
      await fetchOpenMeteoWeather({ ...coordinates, locationLabel, locationKey, locationPrefixKey });
      return;
    }

    const geocodeResult = await geocodeWeatherCity(query);
    if (!geocodeResult) {
      throw new Error("No geocoding result for selected city");
    }

    await fetchOpenMeteoWeather({
      latitude: geocodeResult.latitude,
      longitude: geocodeResult.longitude,
      locationLabel: getGeocodeLocationLabel(geocodeResult) || locationLabel,
      locationKey,
      locationPrefixKey,
    });
  } catch (openMeteoError) {
    console.warn(openMeteoError);
    try {
      await fetchWttrWeather({ query, locationLabel, locationKey, locationPrefixKey });
    } catch (fallbackError) {
      console.error(fallbackError);
      if (topWeatherSummary) topWeatherSummary.textContent = t("weather.error");
      if (weatherSummary) weatherSummary.textContent = t("weather.error");
    }
  }
}

function loadWeatherForSelectedCity() {
  const savedCity = localStorage.getItem("kqdhysj-weather-city") || defaultWeatherCity;
  const cityName = (weatherCity?.value || savedCity).trim() || defaultWeatherCity;
  if (weatherCity) {
    weatherCity.value = cityName;
  }
  localStorage.setItem("kqdhysj-weather-city", cityName);
  fetchWeather({ query: cityName, locationLabel: localizePlaceName(cityName) });
}

async function loadWeatherAndTimeFromIp() {
  setWeatherLoading(t("weather.ipLoading"));

  try {
    const response = await fetch("https://ipwho.is/");
    if (!response.ok) {
      throw new Error(`IP location request failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "IP location request was not successful");
    }

    state.ipLocation = data;
    state.timeZone = data.timezone?.id || "";
    renderDate();

    const locationLabel = getIpLocationLabel(data) || t("weather.currentLocation");
    if (weatherCity && data.city) {
      weatherCity.value = localizePlaceName(data.city);
    }

    fetchWeather({
      query: getIpWeatherQuery(data),
      locationLabel,
      locationPrefixKey: "weather.ipLocation",
    });
  } catch (error) {
    console.error(error);
    state.timeZone = "";
    renderDate();
    setReaderStatus(t("weather.ipFallback"));
    loadWeatherForSelectedCity();
  }
}

function loadWeatherForCurrentLocation() {
  if (!navigator.geolocation) {
    setReaderStatus(t("weather.geoUnsupported"));
    loadWeatherForSelectedCity();
    return;
  }

  setWeatherLoading(t("weather.currentLocation"));
  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather({
        query: `${position.coords.latitude},${position.coords.longitude}`,
        locationLabel: t("weather.currentLocation"),
        locationKey: "weather.currentLocation",
      });
    },
    () => {
      setReaderStatus(t("weather.geoDenied"));
      loadWeatherForSelectedCity();
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
  );
}

function setReaderStatus(message) {
  if (readerStatus) {
    readerStatus.textContent = message;
  }
}

function cancelSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  state.reading = false;
}

function stopReading() {
  cancelSpeech();
  state.pointerReading = false;
  state.activeReadTarget?.classList.remove("reader-hover-target");
  state.activeReadTarget = null;
  readerToggle?.setAttribute("aria-pressed", "false");
  setReaderStatus(t("reader.stop"));
}

function getPreferredVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const targetLang = languageMeta[state.language].speechLang.toLowerCase();
  const languageVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(targetLang.split("-")[0]));
  return languageVoices.find((voice) => voice.name.toLowerCase().includes("microsoft")) || languageVoices[0] || null;
}

function findReadableTarget(target) {
  if (!(target instanceof Element)) return null;
  return target.closest(
    "a, button, label, h1, h2, h3, p, li, dt, dd, th, td, option, .weather-main, .overview-item, .service-card, .guide-card, .side-panel, .portal-service-card, .accessibility-card, .contact-link"
  );
}

function getElementReadText(element) {
  if (!element || element.closest("[aria-hidden='true']")) return "";
  const text = element.getAttribute("aria-label") || element.innerText || element.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 220);
}

function speakText(text, target) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    setReaderStatus(t("reader.unsupported"));
    return;
  }

  const now = Date.now();
  if (!text || (text === state.lastReadText && now - state.lastReadAt < 1400)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getPreferredVoice();
  utterance.lang = languageMeta[state.language].speechLang;
  utterance.rate = state.seniorMode ? 0.86 : 0.95;
  utterance.pitch = 1;
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onend = () => {
    state.reading = false;
  };

  utterance.onerror = () => {
    state.reading = false;
    setReaderStatus(t("reader.unsupported"));
  };

  state.activeReadTarget?.classList.remove("reader-hover-target");
  state.activeReadTarget = target;
  state.activeReadTarget?.classList.add("reader-hover-target");
  state.lastReadText = text;
  state.lastReadAt = now;
  state.reading = true;
  setReaderStatus(`${t("reader.hoverPrefix")}${text}`);
  window.speechSynthesis.speak(utterance);
}

function handlePointerRead(event) {
  if (!state.pointerReading) return;
  const target = findReadableTarget(event.target);
  const text = getElementReadText(target);
  speakText(text, target);
}

function startReading() {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    setReaderStatus(t("reader.unsupported"));
    return;
  }

  state.pointerReading = true;
  readerToggle?.setAttribute("aria-pressed", "true");
  setReaderStatus(t("reader.start"));
}

function updateSteamPlaceholderButton() {
  if (steamPlaceholderButton) {
    steamPlaceholderButton.textContent = t("workDetail.steam.button");
    steamPlaceholderButton.setAttribute("aria-label", `${t("workDetail.steam.button")}，${t("workDetail.steam.note")}`);
  }
  if (steamPlaceholderNote) {
    steamPlaceholderNote.textContent = t("workDetail.steam.note");
    steamPlaceholderNote.setAttribute("aria-live", "polite");
  }
}

function setupSteamPlaceholderButton() {
  if (!steamPlaceholderButton) return;
  steamPlaceholderButton.disabled = false;
  steamPlaceholderButton.setAttribute("aria-disabled", "true");
  updateSteamPlaceholderButton();
  steamPlaceholderButton.addEventListener("click", (event) => {
    event.preventDefault();
    setReaderStatus(t("workDetail.steam.note"));
    steamPlaceholderButton.classList.remove("is-highlighted");
    void steamPlaceholderButton.offsetWidth;
    steamPlaceholderButton.classList.add("is-highlighted");
  });
}

applyLanguage(state.language);
setupProtectedEmailActions();
setupConsultationForm();
applySeniorMode();
applyAccessDisplaySettings();
setupSteamPlaceholderButton();
syncWeatherCityList();
loadWeatherAndTimeFromIp();

navToggle?.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
    const anchorId = getAnchorIdFromHref(link.getAttribute("href"));
    if (getCurrentPageName() === "index.html" && locationHighlightIds.has(anchorId)) {
      window.setTimeout(() => highlightLocationTarget(anchorId), 160);
    }
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.reading || state.pointerReading) {
      stopReading();
    }
    applyLanguage(button.dataset.language);
  });
});

accessibilityModeToggle?.addEventListener("click", () => {
  setAccessibilityPanel(accessibilityPanel?.hidden !== false);
});

seniorModeToggle?.addEventListener("click", () => {
  state.seniorMode = !state.seniorMode;
  applySeniorMode();
  setReaderStatus(t(state.seniorMode ? "senior.enabled" : "senior.disabled"));
});

fontIncrease?.addEventListener("click", () => {
  state.accessFontLevel += 1;
  applyAccessDisplaySettings();
  setReaderStatus(t("font.increased"));
});

fontDecrease?.addEventListener("click", () => {
  state.accessFontLevel -= 1;
  applyAccessDisplaySettings();
  setReaderStatus(t("font.decreased"));
});

contrastToggle?.addEventListener("click", () => {
  state.highContrast = !state.highContrast;
  applyAccessDisplaySettings();
  setReaderStatus(t(state.highContrast ? "contrast.enabled" : "contrast.disabled"));
});

accessReset?.addEventListener("click", () => {
  if (state.pointerReading) {
    stopReading();
  }
  state.accessFontLevel = 0;
  state.highContrast = false;
  applyAccessDisplaySettings();
  setReaderStatus(t("font.reset"));
});

weatherCity?.addEventListener("change", loadWeatherForSelectedCity);
weatherCity?.addEventListener("input", () => {
  window.clearTimeout(state.weatherCitySuggestTimer);
  state.weatherCitySuggestTimer = window.setTimeout(updateWeatherCitySuggestions, 280);
});
weatherCity?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  loadWeatherForSelectedCity();
});
weatherRefresh?.addEventListener("click", loadWeatherForSelectedCity);
weatherGeolocation?.addEventListener("click", loadWeatherForCurrentLocation);

readerToggle?.addEventListener("click", () => {
  if (state.pointerReading) {
    stopReading();
    return;
  }
  startReading();
});

document.addEventListener("pointerover", handlePointerRead);
document.addEventListener("focusin", handlePointerRead);
document.addEventListener("pointerout", (event) => {
  if (!state.pointerReading || event.target !== state.activeReadTarget) return;
  state.activeReadTarget.classList.remove("reader-hover-target");
  state.activeReadTarget = null;
});

searchForm?.addEventListener("submit", handleSearch);
searchInput?.addEventListener("input", updateSearchSuggestions);
searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideSearchResults();
    return;
  }
  if (event.key !== "ArrowDown" || searchResults?.hidden) return;
  event.preventDefault();
  searchResults.querySelector(".search-result")?.focus();
});
searchResults?.addEventListener("keydown", (event) => {
  const current = event.target.closest(".search-result");
  if (!current) return;
  const results = [...searchResults.querySelectorAll(".search-result")];
  const currentIndex = results.indexOf(current);

  if (event.key === "Escape") {
    hideSearchResults();
    searchInput?.focus();
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + results.length) % results.length;
    results[nextIndex]?.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!searchForm || searchForm.contains(event.target)) return;
  hideSearchResults();
});

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateBackTop();
  setActiveNav();
}, { passive: true });

window.addEventListener("load", scrollHashTargetIntoView);
window.addEventListener("hashchange", scrollHashTargetIntoView);
scrollHashTargetIntoView();

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

window.setInterval(renderDate, 1000);
updateBackTop();
setActiveNav();
