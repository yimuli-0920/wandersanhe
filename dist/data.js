(function () {
  "use strict";

  var themes = [
    { id: "water", name: "水岸漫游", short: "水岸", color: "#7ec9c3" },
    { id: "culture", name: "人文故事", short: "人文", color: "#e4ad6b" },
    { id: "architecture", name: "古建街巷", short: "古建", color: "#d5c3a5" },
    { id: "night", name: "夜色灯影", short: "夜色", color: "#9ba7e8" },
    { id: "nature", name: "季节光影", short: "光影", color: "#a8c986" },
    { id: "local", name: "在地生活", short: "生活", color: "#e28a78" }
  ];

  var xhsNotes = {
    mustard: {
      platform: "小红书", author: "芥末上了头", noteId: "6a3a86490000000007029994",
      noteTitle: "三河古镇｜经典一日游路线✨不绕路超省心‼️",
      url: "https://www.xiaohongshu.com/explore/6a3a86490000000007029994",
      scope: "固定134样本", permissionStatus: "待联系作者授权"
    },
    xinqitian: {
      platform: "小红书", author: "昕七天", noteId: "69b03c6b00000000260321fd",
      noteTitle: "三河古镇｜藏在合肥的江南慢时光✨",
      url: "https://www.xiaohongshu.com/explore/69b03c6b00000000260321fd",
      scope: "固定134样本", permissionStatus: "待联系作者授权"
    },
    tuanjingxiaogou: {
      platform: "小红书", author: "抟经小狗", noteId: "6abdd845000000001a029e4c",
      noteTitle: "三河古镇 10.1",
      url: "https://www.xiaohongshu.com/explore/6abdd845000000001a029e4c",
      scope: "补充定向检索", permissionStatus: "待联系作者授权"
    },
    yang: {
      platform: "小红书", author: "月亮爱旅行", noteId: "69ede061000000003502870e",
      noteTitle: "三河古镇杨振宁旧居",
      url: "https://www.xiaohongshu.com/explore/69ede061000000003502870e",
      scope: "补充定向检索", permissionStatus: "待联系作者授权"
    },
    liu: {
      platform: "小红书", author: "汐颍", noteId: "6a841c8f0000000025003a56",
      noteTitle: "肥西：刘同兴老宅&隆庄",
      url: "https://www.xiaohongshu.com/explore/6a841c8f0000000025003a56",
      scope: "补充定向检索", permissionStatus: "待联系作者授权"
    },
    bridges: {
      platform: "小红书", author: "城市情报官", noteId: "6a7a89b00000000029033152",
      noteTitle: "桥的风姿15～肥西三县桥&鹊渚廊桥",
      url: "https://www.xiaohongshu.com/explore/6a7a89b00000000029033152",
      scope: "补充定向检索", permissionStatus: "待联系作者授权"
    }
  };

  function photoSource(note, imageIndex, proof) {
    return Object.assign({}, note, { imageIndex: imageIndex, proof: proof });
  }

  var places = [
    {
      id: "wangyue", name: "望月阁", subtitle: "登高看水乡层次", frequency: 8,
      validationSummary: "临河设置的多层楼阁类参观点，主要构成包括室内楼层、楼梯与外部平台。",
      image: "./assets/photos/xhs/xhs-wangyue-close.webp", map: { x: 55.5, y: 88.5 },
      source: photoSource(xhsNotes.mustard, 4, "画面建筑匾额可见“望月阁”，地点可直接核验。"),
      weights: { water: .45, culture: .55, architecture: .60, night: .80, nature: .85, local: .15 },
      description: "望月阁临小南河而建。登阁后，河网、古街、桥影与白墙黛瓦会在同一视野中展开。",
      tip: "傍晚从望月桥一侧仰拍，再登阁看蓝调时刻，能获得两种完全不同的空间感。",
      experiences: ["登阁俯瞰水陆格局", "观看国粹与地方文化展陈"]
    },
    {
      id: "yang", name: "杨振宁旧居", subtitle: "从人物进入古镇", frequency: 8,
      validationSummary: "位于传统民居内的人物纪念展馆，主要内容包括生平资料与室内展陈。",
      image: "./assets/photos/xhs/xhs-yang-69ede061-01.webp", map: { x: 61.5, y: 73.8 },
      source: photoSource(xhsNotes.yang, 1, "入口匾额直接显示“杨振宁旧居”。"),
      weights: { water: .05, culture: 1, architecture: .40, night: .05, nature: .10, local: .30 },
      description: "一座江淮民居承载着杨振宁的成长记忆与科学人生，也把古镇空间连接到更具体的人物故事。",
      tip: "先看入口木构和匾额，再进入室内展陈；避免只把它当作一处拍照背景。",
      experiences: ["沿生平线索理解科学史", "与一人巷组成短距离步行段"]
    },
    {
      id: "xiaonan", name: "小南河", subtitle: "从白昼走到蓝调", frequency: 8,
      validationSummary: "贯穿古镇的河道与沿岸公共空间，主要活动包括步行、观桥与乘船。",
      image: "./assets/photos/xhs/xhs-xiaonan-boat.webp", map: { x: 34.5, y: 57.5 },
      source: photoSource(xhsNotes.mustard, 2, "原笔记路线与图组语境指向小南河水岸；画面为河道与游船，不据此推断更细地点。"),
      weights: { water: 1, culture: .10, architecture: .15, night: .85, nature: .85, local: .40 },
      description: "白墙、桥影、游船和灯光沿着小南河连续出现，是感受三河水乡节奏最直接的一段。",
      tip: "天色尚未全黑时停留在水边，深蓝天空、暖灯与倒影能同时保留。",
      experiences: ["乘摇橹船从水面看古桥", "沿河等待蓝调与灯影"]
    },
    {
      id: "sanxian", name: "三县桥", subtitle: "桥上仍是日常", frequency: 6,
      validationSummary: "连接古镇街区的石桥通行空间，主要构成包括桥面、石栏与两侧街巷。",
      image: "./assets/photos/xhs/xhs-bridges-6a7a89b0-01.webp", map: { x: 52.5, y: 55.2 },
      source: photoSource(xhsNotes.bridges, 1, "画面石碑直接显示“安徽省文物保护单位 三县桥”。"),
      weights: { water: .55, culture: .35, architecture: .50, night: .10, nature: .30, local: 1 },
      description: "三县桥连接不同区域，也保留着桥面行走、停留和交谈的日常场景。",
      tip: "从桥侧保留石栏作近景，等待行人进入画面，比空无一人的地标照更能说明尺度。",
      experiences: ["了解三县交界的桥名由来", "观察桥头的日常流动"]
    },
    {
      id: "yiren", name: "一人巷", subtitle: "身体感受窄巷尺度", frequency: 6,
      validationSummary: "由两侧砖墙限定的窄巷通道，主要构成包括铺地、墙面与连续转折。",
      image: "./assets/photos/xhs/xhs-yang-69ede061-09.webp", map: { x: 42.5, y: 72.2 },
      source: photoSource(xhsNotes.yang, 9, "画面入口标牌直接显示“一人巷”。"),
      weights: { water: .05, culture: .35, architecture: .95, night: .05, nature: .20, local: .70 },
      description: "近乎只容一人通过的巷道，把视线压缩成一条纵深线，也让传统街巷的尺度变得可感知。",
      tip: "保持机位居中，等待巷内只有一人时，砖墙透视和身体尺度最清楚。",
      experiences: ["穿行窄巷感受空间压缩", "观察砖墙年代与修补痕迹"]
    },
    {
      id: "liu", name: "刘同兴隆庄", subtitle: "走进百年商号", frequency: 5,
      validationSummary: "由临街铺面和多进院落组成的商号建筑，主要内容包括建筑格局与商业历史。",
      image: "./assets/photos/xhs/xhs-liu-6a841c8f-02.webp", map: { x: 48.5, y: 39.2 },
      source: photoSource(xhsNotes.liu, 2, "画面门额直接显示“刘同兴隆庄”。"),
      weights: { water: .05, culture: .90, architecture: .70, night: .05, nature: .10, local: .85 },
      description: "临街商铺与多进院落把三河作为商贸重镇的历史，转化成可以进入和观察的空间。",
      tip: "门额、楹联和斑驳墙面应放在同一画面中，它们共同说明建筑的身份与时间感。",
      experiences: ["从前店后坊理解旧式商业", "连接古街、码头与货物流动"]
    },
    {
      id: "quezhu", name: "鹊渚廊桥", subtitle: "在桥里看见桥外", frequency: 5,
      validationSummary: "由石拱、木构和长亭组成的廊桥空间，主要区域包括桥面、桥亭与临水界面。",
      image: "./assets/photos/xhs/xhs-bridges-6a7a89b0-05.webp", map: { x: 46, y: 27.5 },
      source: photoSource(xhsNotes.bridges, 5, "画面桥亭匾额直接显示“鹊渚廊桥”。"),
      weights: { water: .80, culture: .35, architecture: .80, night: .30, nature: .65, local: .25 },
      description: "石拱、木柱和长亭组成连续节奏。远观是结构，走入桥内则变成遮蔽、框景和停留。",
      tip: "桥外斜侧拍屋顶节奏，桥内用门洞作画框；两种视角适合连成一次短探索。",
      experiences: ["在桥内寻找层层框景", "连接万年台与亲水体验"]
    }
  ];

  var photoStimuli = [
    { id: "p01", pairId: "s01", image: "./assets/photos/xhs/xhs-wangyue-river.webp", weights: { water: .70, culture: .15, architecture: .25, night: .05, nature: 1, local: .10 }, source: photoSource(xhsNotes.mustard, 5, "楼阁、河道与树木同框，用作“高处与自然视野”兴趣刺激；地点在选择前不揭示。") },
    { id: "p02", pairId: "s02", image: "./assets/photos/xhs/xhs-note-69b03c6b-02.webp", weights: { water: .70, culture: .10, architecture: .15, night: 1, nature: .35, local: .10 }, source: photoSource(xhsNotes.xinqitian, 2, "夜间河道、游船与灯光场景，用作“留到入夜”兴趣刺激。") },
    { id: "p03", pairId: "s03", image: "./assets/photos/xhs/xhs-note-69b03c6b-05.webp", weights: { water: .05, culture: .25, architecture: .70, night: .05, nature: .20, local: .85 }, source: photoSource(xhsNotes.xinqitian, 5, "廊下步行与人物活动同框，用作“街巷与日常步行”刺激；不误标具体巷名。") },
    { id: "p04", pairId: "s04", image: "./assets/photos/xhs/xhs-quezhu-close.webp", weights: { water: 1, culture: .20, architecture: .50, night: .10, nature: .55, local: .15 }, source: photoSource(xhsNotes.mustard, 1, "桥、水岸与飞檐同框，用作“沿桥临水”兴趣刺激。") },
    { id: "p05", pairId: "s05", image: "./assets/photos/xhs/xhs-note-6a3a8649-08.jpg", weights: { water: .05, culture: 1, architecture: .40, night: .05, nature: .30, local: .35 }, source: photoSource(xhsNotes.mustard, 8, "传统文化场所与公共活动空间同框，不含具体地点名称，用作“地方文化”兴趣刺激。") },
    { id: "p06", pairId: "s06", image: "./assets/photos/xhs/xhs-note-69b03c6b-04.jpg", weights: { water: .05, culture: .85, architecture: .45, night: .05, nature: .15, local: .70 }, source: photoSource(xhsNotes.xinqitian, 4, "古镇旧墙与手绘字样呈现时间痕迹，不指向结果池中的具体地点，用作“历史痕迹”刺激。") },
    { id: "p07", pairId: "s07", image: "./assets/photos/xhs/xhs-sanhe-fish-lantern-diy.jpg", imagePosition: "center 68%", weights: { water: .05, culture: .95, architecture: .05, night: .05, nature: .05, local: .85 }, source: photoSource(xhsNotes.tuanjingxiaogou, 2, "未完成的鱼灯、颜料与画笔同框，原帖正文明确记录在三河古镇制作鱼灯；画面不含结果池地点名称，用作“传统手作参与”刺激。") },
    { id: "p08", pairId: "s08", image: "./assets/photos/xhs/xhs-note-69b03c6b-07.webp", weights: { water: .65, culture: .05, architecture: .10, night: 1, nature: .85, local: .05 }, source: photoSource(xhsNotes.xinqitian, 7, "夜间灯光、树影与水面倒影同框，用作“等待光线”兴趣刺激；避开带宣传文案的照片。") },
    { id: "p09", pairId: "s09", image: "./assets/photos/xhs/xhs-quezhu-wide.webp", weights: { water: .20, culture: .25, architecture: .80, night: .10, nature: .60, local: .30 }, source: photoSource(xhsNotes.mustard, 6, "廊桥结构与框景关系清晰，用作“进入框景”兴趣刺激。") }
  ];

  var interestStimuli = [
    { id: "i01", pairId: "s01", kicker: "看见全貌", statement: "我喜欢在较高视点观察水岸、树木和聚落形成的整体景观。", weights: photoStimuli[0].weights },
    { id: "i02", pairId: "s02", kicker: "留到入夜", statement: "我愿意把行程留到傍晚，看灯光落在水面，等一段安静的蓝调时刻。", weights: photoStimuli[1].weights },
    { id: "i03", pairId: "s03", kicker: "走进街巷", statement: "我喜欢沿着有生活痕迹的街巷步行，观察空间尺度和日常活动。", weights: photoStimuli[2].weights },
    { id: "i04", pairId: "s04", kicker: "沿桥临水", statement: "古桥、飞檐和水岸连在一起的地方，会让我想停下来仔细看。", weights: photoStimuli[3].weights },
    { id: "i05", pairId: "s05", kicker: "理解传统", statement: "我愿意了解地方信仰、礼俗或传统公共空间背后的文化意义。", weights: photoStimuli[4].weights },
    { id: "i06", pairId: "s06", kicker: "触摸时间", statement: "我会留意旧墙、手绘标识和使用痕迹，理解一个地方经历的时间变化。", weights: photoStimuli[5].weights },
    { id: "i07", pairId: "s07", kicker: "参与手作", statement: "我愿意观察或参与当地传统手作，了解民俗物件是怎样制作出来的。", weights: photoStimuli[6].weights },
    { id: "i08", pairId: "s08", kicker: "等待光线", statement: "我愿意沿河慢走，为灯光、倒影或天气变化多停留一会儿。", weights: photoStimuli[7].weights },
    { id: "i09", pairId: "s09", kicker: "进入框景", statement: "我喜欢走进廊桥或门洞，让建筑的阴影与层层框景引导下一步。", weights: photoStimuli[8].weights }
  ];

  window.SANHE_DATA = {
    version: "5.2.0",
    algorithmVersion: "signed-centered-cosine-v3",
    evidence: {
      fixedIds: 134,
      confirmedRelevant: 102,
      visitorCreator: 86,
      note: "兴趣维度来自134个固定note_id的标题全量编码；正文覆盖度有限，维度用于原型假设而非总体比例推断。134篇表格未保存图片URL或图片—地点映射，精确地点缺图通过补充定向检索获得并单独标识。"
    },
    themes: themes,
    places: places,
    photoStimuli: photoStimuli,
    interestStimuli: interestStimuli
  };
})();
