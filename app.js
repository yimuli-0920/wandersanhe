(function () {
  "use strict";

  var STORAGE_KEY = "jingyou-sanhe-v1";

  var places = {
    wangyue: {
      id: "wangyue",
      name: "望月阁",
      subtitle: "古镇制高点 · 国粹楼",
      frequency: 8,
      map: { x: 55.5, y: 88.5 },
      description: "望月阁临小南河而建，是三河古镇的标志性高层建筑。登阁可以俯瞰河网、古街与白墙黛瓦，也能把照片中的桥、塔与水乡层次放进同一画面。",
      tip: "春季可借花枝做前景；傍晚从望月桥一侧仰拍，桥的弧线能自然引向阁楼。",
      experiences: [
        { title: "登阁俯瞰", note: "从高处理解三河的水陆格局", icon: "activity" },
        { title: "国粹展陈", note: "在楼内观看古代艺术藏品", icon: "sparkles" }
      ]
    },
    yang: {
      id: "yang",
      name: "杨振宁旧居",
      subtitle: "科学人文 · 古民居",
      frequency: 8,
      map: { x: 61.5, y: 73.8 },
      description: "旧居以江淮民居空间承载杨振宁的成长记忆与科学人生。它让三河不只是一处“好拍”的古镇，也成为可以沿人物线索继续理解的文化地点。",
      tip: "入口木构细节适合正面、低畸变构图；避免过度广角，保留匾额与花格窗的比例。",
      experiences: [
        { title: "科学家生平展", note: "从生活史进入科学史", icon: "sparkles" },
        { title: "一人巷联游", note: "沿旧居旁的街巷继续步行", icon: "route" }
      ]
    },
    xiaonan: {
      id: "xiaonan",
      name: "小南河",
      subtitle: "水乡轴线 · 夜景",
      frequency: 7,
      map: { x: 34.5, y: 57.5 },
      description: "小南河是三河古镇最直观的水乡线索。沿河的白墙、桥影、游船与夜间灯光不断改变画面，适合从白天一直拍到蓝调时刻。",
      tip: "夜景建议在天色尚未全黑时拍摄，让深蓝天空与暖色灯光同时保留；靠近水面能获得更完整的倒影。",
      experiences: [
        { title: "摇橹船", note: "从水面重新观看古桥与民居", icon: "route" },
        { title: "蓝调夜游", note: "记录灯光与水面倒影", icon: "camera" }
      ]
    },
    sanxian: {
      id: "sanxian",
      name: "三县桥",
      subtitle: "三县交界 · 石桥",
      frequency: 6,
      map: { x: 52.5, y: 55.2 },
      description: "三县桥因连接肥西、舒城、庐江三地而得名。石栏、桥面和街巷生活形成比“地标正面照”更具日常感的观察视角。",
      tip: "从桥侧保留石狮与栏杆作近景，等待行人进入画面，可以同时呈现尺度与生活气息。",
      experiences: [
        { title: "三县交界故事", note: "理解桥名与区域交通历史", icon: "map" },
        { title: "桥头街拍", note: "观察桥面的人与日常流动", icon: "camera" }
      ]
    },
    yiren: {
      id: "yiren",
      name: "一人巷",
      subtitle: "窄巷空间 · 纵深构图",
      frequency: 6,
      map: { x: 42.5, y: 72.2 },
      description: "一人巷以近乎只容一人通过的尺度形成独特空间体验。高耸砖墙把视线压缩成一条纵深线，也让身体真实感受到传统街巷的尺度。",
      tip: "保持机位居中并略微压低，让两侧砖墙形成强烈透视；等待巷内只有一人时，尺度感最清楚。",
      experiences: [
        { title: "窄巷穿行", note: "用身体感受传统街巷尺度", icon: "route" },
        { title: "砖墙细节观察", note: "寻找墙体年代与修补痕迹", icon: "camera" }
      ]
    },
    liu: {
      id: "liu",
      name: "刘同兴隆庄",
      subtitle: "百年商号 · 商贸文化",
      frequency: 5,
      map: { x: 48.5, y: 39.2 },
      description: "刘同兴隆庄既是商铺，也是商人宅院。临街店面与多进院落把三河作为商贸重镇的历史转化为可进入、可观察的空间。",
      tip: "正面拍摄门额与楹联，适当保留斑驳墙面；它们共同说明建筑的商号身份与时间感。",
      experiences: [
        { title: "百年商号空间", note: "从前店后坊理解旧式商业", icon: "activity" },
        { title: "江淮商贸文化", note: "连接古街、码头与货物流动", icon: "sparkles" }
      ]
    },
    quezhu: {
      id: "quezhu",
      name: "鹊渚廊桥",
      subtitle: "古廊桥 · 临水休憩",
      frequency: 5,
      map: { x: 46, y: 27.5 },
      description: "鹊渚廊桥横跨小南河外河，以石拱、木柱和飞檐长亭构成连续节奏。桥内外是两种不同体验：远观结构，进入后则感受遮蔽与框景。",
      tip: "外部适合斜侧构图表现连续屋顶；进入廊桥后可用门洞做画框，等待人物经过增强纵深。",
      experiences: [
        { title: "廊桥框景", note: "在桥内寻找层层门洞与光影", icon: "camera" },
        { title: "万年台与游船", note: "连接邻近戏台和亲水体验", icon: "route" }
      ]
    }
  };

  var photos = [
    {
      id: "p01", placeId: "wangyue", image: "./assets/photos/wangyue-tower.jpg",
      title: "飞檐越过春花", prompt: "如果一座楼能把整个水乡收进视野，你会想登上去吗？",
      tags: ["建筑", "春日", "登高"],
      sourceName: "去哪儿攻略 · 国粹楼",
      sourceUrl: "https://touch.travel.qunar.com/comment/10141504612",
      proof: "页面明确标注国粹楼 / 望月阁"
    },
    {
      id: "p02", placeId: "xiaonan", image: "./assets/photos/xiaonan-night.jpg",
      title: "灯火落进一条河", prompt: "你愿意为一段蓝调时刻，把行程留到入夜吗？",
      tags: ["水乡", "夜景", "倒影"],
      sourceName: "太平洋摄影部落 · 夜色小南河",
      sourceUrl: "https://dp.pconline.com.cn/photo/list_3320424.html",
      proof: "作品标题直接标注夜色小南河"
    },
    {
      id: "p03", placeId: "yiren", image: "./assets/photos/yiren-alley.jpg",
      title: "只容一人的光", prompt: "两面砖墙把世界压成一条线，这种空间会吸引你吗？",
      tags: ["街巷", "纵深", "人文"],
      sourceName: "搜狐 · 三河古镇一人巷",
      sourceUrl: "https://www.sohu.com/a/272590118_100168271",
      proof: "画面内可见“一人巷”中英文标牌"
    },
    {
      id: "p04", placeId: "quezhu", image: "./assets/photos/quezhu-bridge.jpg",
      title: "檐角一重又一重", prompt: "连续的屋顶、石拱与灯笼，哪一种节奏先抓住你？",
      tags: ["古桥", "建筑", "水岸"],
      sourceName: "去哪儿攻略 · 鹊渚廊桥",
      sourceUrl: "https://touch.travel.qunar.com/comment/10090916392",
      proof: "页面与图注均明确标注鹊渚廊桥"
    },
    {
      id: "p05", placeId: "yang", image: "./assets/photos/yang-residence-entrance.jpg",
      title: "一块匾额，一段人生", prompt: "你会因为一个人的故事，走进一座安静的旧宅吗？",
      tags: ["名人", "木构", "展陈"],
      sourceName: "搜狐 · 寻访杨振宁旧居",
      sourceUrl: "https://www.sohu.com/a/553018191_121106991",
      proof: "画面匾额直接显示“杨振宁旧居”"
    },
    {
      id: "p06", placeId: "liu", image: "./assets/photos/liu-manor.jpg",
      title: "墙面记得旧商号", prompt: "比起崭新的景点，你是否更喜欢有时间痕迹的门面？",
      tags: ["商贸", "旧宅", "纹理"],
      sourceName: "同程旅行 · 刘同兴隆庄",
      sourceUrl: "https://www.ly.com/scenery/BookSceneryTicket_680671.html",
      proof: "画面门额直接显示“刘同兴隆庄”"
    },
    {
      id: "p07", placeId: "sanxian", image: "./assets/photos/sanxian-bridge.jpg",
      title: "桥上仍是日常", prompt: "不是宏大的全景，而是人们真实走过的桥面，会让你停下吗？",
      tags: ["石桥", "日常", "街拍"],
      sourceName: "去哪儿攻略 · 三县桥",
      sourceUrl: "https://touch.travel.qunar.com/comment/10141482796",
      proof: "页面明确标注三县桥，画面特征一致"
    },
    {
      id: "p08", placeId: "xiaonan", image: "./assets/photos/xiaonan-bridge.jpg",
      title: "桥洞把夕光分成三份", prompt: "如果你能从水边等待这一束光，会把它加入行程吗？",
      tags: ["水乡", "古桥", "夕光"],
      sourceName: "搜狐 · 三河古镇小南河",
      sourceUrl: "https://www.sohu.com/a/450970668_120455300",
      proof: "正文明确说明桥体横跨小南河"
    },
    {
      id: "p09", placeId: "quezhu", image: "./assets/photos/quezhu-corridor.jpg",
      title: "从桥外走进桥里", prompt: "你更想远看一座桥，还是走进它的阴影与框景？",
      tags: ["廊桥", "框景", "行走"],
      sourceName: "去哪儿攻略 · 鹊渚清廊",
      sourceUrl: "https://touch.travel.qunar.com/comment/10071704493",
      proof: "画面匾额可读“鹊渚清廊”"
    }
  ];

  var icons = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/>',
    sparkles: '<path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4ZM5 14l-.9 2.1L2 17l2.1.9L5 20l.9-2.1L8 17l-2.1-.9ZM19 13l-.7 1.8-1.8.7 1.8.7L19 18l.7-1.8 1.8-.7-1.8-.7Z"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    undo: '<path d="M9 7 4 12l5 5"/><path d="M20 17a8 8 0 0 0-8-8H4"/>',
    move: '<path d="m5 9-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    images: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    camera: '<path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3Z"/><circle cx="12" cy="13" r="4"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a4 4 0 0 0 4-4v-6a4 4 0 0 1 3-4"/>',
    external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || icons.sparkles) + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (node) {
      node.innerHTML = svgIcon(node.getAttribute("data-icon"));
    });
  }

  function defaultState() {
    return {
      current: 0,
      saved: [],
      decisions: [],
      experienceClicks: [],
      startedAt: Date.now(),
      cardStartedAt: Date.now(),
      onboardingSeen: false
    };
  }

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Object.assign(defaultState(), parsed || {});
    } catch (error) {
      return defaultState();
    }
  }

  var state = loadState();
  var currentView = "discover";
  var drag = null;
  var toastTimer = null;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function photoById(id) {
    return photos.find(function (photo) { return photo.id === id; });
  }

  function uniqueSavedPlaceIds() {
    var ids = state.saved.map(function (id) { return photoById(id).placeId; });
    return ids.filter(function (id, index) { return ids.indexOf(id) === index; });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function renderCards() {
    var stack = document.getElementById("card-stack");
    stack.innerHTML = "";

    if (state.current >= photos.length) {
      var count = uniqueSavedPlaceIds().length;
      stack.innerHTML =
        '<div class="completion-card">' +
          '<div class="completion-orbit"><span>' + count + '</span></div>' +
          '<span class="section-index">VISUAL ROUTE READY</span>' +
          '<h3>你的三河，不从热门榜开始。</h3>' +
          '<p>你收藏了 ' + state.saved.length + ' 张画面，解锁 ' + count + ' 处真实地点。现在让照片替你生成一张地图。</p>' +
          '<div class="completion-actions">' +
            '<button class="secondary-button" id="replay-button">' + svgIcon("rotate") + '重新浏览</button>' +
            '<button class="primary-button" data-view="map">打开我的地图 ' + svgIcon("arrow") + '</button>' +
          '</div>' +
        '</div>';
      var replay = document.getElementById("replay-button");
      if (replay) replay.addEventListener("click", replayCards);
      bindViewButtons(stack);
      document.getElementById("decision-controls").style.visibility = "hidden";
      updateProgress();
      return;
    }

    document.getElementById("decision-controls").style.visibility = "visible";
    var visible = photos.slice(state.current, state.current + 3).reverse();
    visible.forEach(function (photo) {
      var card = document.createElement("article");
      card.className = "photo-card";
      card.dataset.photoId = photo.id;
      card.innerHTML =
        '<img src="' + photo.image + '" alt="一张已核验的三河古镇旅行照片，地点将在选择后显示" draggable="false">' +
        '<div class="card-top">' +
          '<span class="photo-number">FRAME ' + String(photos.indexOf(photo) + 1).padStart(2, "0") + '</span>' +
          '<span class="photo-proof"><i></i>实景已核验</span>' +
        '</div>' +
        '<div class="decision-stamp save">想去</div>' +
        '<div class="decision-stamp skip">略过</div>' +
        '<div class="card-bottom">' +
          '<div class="photo-tags">' + photo.tags.map(function (tag) { return '<span class="photo-tag">' + escapeHtml(tag) + '</span>'; }).join("") + '</div>' +
          '<h3>' + escapeHtml(photo.title) + '</h3>' +
          '<p>' + escapeHtml(photo.prompt) + '</p>' +
        '</div>';
      stack.appendChild(card);
    });

    var top = stack.lastElementChild;
    if (top) bindDrag(top);
    updateProgress();
  }

  function updateProgress() {
    var currentHuman = Math.min(state.current + 1, photos.length);
    document.getElementById("progress-label").textContent = String(currentHuman).padStart(2, "0") + " / " + String(photos.length).padStart(2, "0");
    document.getElementById("progress-fill").style.width = Math.max(11.1, state.current / photos.length * 100) + "%";
    document.getElementById("undo-button").disabled = state.decisions.length === 0;
  }

  function bindDrag(card) {
    card.addEventListener("pointerdown", function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      drag = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      card.setPointerCapture(event.pointerId);
      card.classList.add("is-dragging");
    });
    card.addEventListener("pointermove", function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      card.style.transform = "translate(" + dx + "px," + Math.min(40, dy * .22) + "px) rotate(" + dx / 24 + "deg)";
      var amount = Math.min(1, Math.abs(dx) / 110);
      card.querySelector(".decision-stamp.save").style.opacity = dx > 0 ? amount : 0;
      card.querySelector(".decision-stamp.skip").style.opacity = dx < 0 ? amount : 0;
    });
    card.addEventListener("pointerup", function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      var dx = event.clientX - drag.x;
      drag = null;
      card.classList.remove("is-dragging");
      if (Math.abs(dx) > 90) {
        decide(dx > 0 ? "save" : "skip");
      } else {
        card.style.transform = "";
        card.querySelectorAll(".decision-stamp").forEach(function (stamp) { stamp.style.opacity = 0; });
      }
    });
    card.addEventListener("pointercancel", function () {
      drag = null;
      card.classList.remove("is-dragging");
      card.style.transform = "";
    });
  }

  function decide(action) {
    if (state.current >= photos.length) return;
    var photo = photos[state.current];
    var top = document.querySelector(".card-stack .photo-card:last-child");
    if (!top || top.classList.contains("is-leaving-right") || top.classList.contains("is-leaving-left")) return;
    var latency = Math.max(0, Date.now() - state.cardStartedAt);
    state.decisions.push({
      photoId: photo.id,
      placeId: photo.placeId,
      decision: action,
      latencyMs: latency,
      at: new Date().toISOString()
    });
    if (action === "save" && state.saved.indexOf(photo.id) === -1) state.saved.push(photo.id);
    top.classList.add(action === "save" ? "is-leaving-right" : "is-leaving-left");
    window.setTimeout(function () {
      state.current += 1;
      state.cardStartedAt = Date.now();
      saveState();
      renderAll();
      showToast(action === "save"
        ? "已收藏 · 这张照片来自 <b>" + places[photo.placeId].name + "</b>"
        : "已略过 · 这张照片来自 <b>" + places[photo.placeId].name + "</b>");
    }, 330);
  }

  function undo() {
    var last = state.decisions.pop();
    if (!last) return;
    state.current = Math.max(0, state.current - 1);
    if (last.decision === "save") {
      state.saved = state.saved.filter(function (id) { return id !== last.photoId; });
    }
    state.cardStartedAt = Date.now();
    saveState();
    renderAll();
    showToast("已撤销上一项选择");
  }

  function replayCards() {
    state.current = 0;
    state.saved = [];
    state.decisions = [];
    state.experienceClicks = [];
    state.startedAt = Date.now();
    state.cardStartedAt = Date.now();
    saveState();
    renderAll();
  }

  function showToast(html) {
    var toast = document.getElementById("toast");
    toast.innerHTML = html;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  function aggregateTags() {
    var counts = {};
    state.saved.forEach(function (id) {
      photoById(id).tags.forEach(function (tag) { counts[tag] = (counts[tag] || 0) + 1; });
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).map(function (key) {
      return { name: key, count: counts[key] };
    });
  }

  function renderProfile() {
    var tags = aggregateTags();
    var empty = document.getElementById("empty-insight");
    var profile = document.getElementById("visual-profile");
    var max = tags.length ? tags[0].count : 1;
    empty.hidden = tags.length > 0;
    profile.hidden = tags.length === 0;
    profile.innerHTML = tags.slice(0, 5).map(function (item) {
      return '<div class="profile-bar"><div class="profile-bar-head"><span>' + escapeHtml(item.name) + '</span><b>' + item.count + '</b></div><div class="profile-track"><span style="width:' + (item.count / max * 100) + '%"></span></div></div>';
    }).join("");
    var placeCount = uniqueSavedPlaceIds().length;
    document.getElementById("place-count").textContent = placeCount;
    document.getElementById("quick-map").disabled = placeCount === 0;
  }

  function renderCollection() {
    var grid = document.getElementById("collection-grid");
    var empty = document.getElementById("collection-empty");
    var summary = document.getElementById("collection-summary");
    var savedPhotos = state.saved.map(photoById).filter(Boolean);
    empty.style.display = savedPhotos.length ? "none" : "flex";
    grid.style.display = savedPhotos.length ? "grid" : "none";
    summary.classList.toggle("is-visible", savedPhotos.length > 0);
    var tags = aggregateTags();
    summary.innerHTML =
      '<div class="summary-stat"><strong>' + savedPhotos.length + '</strong><span>张心动画面</span></div>' +
      '<div class="summary-stat"><strong>' + uniqueSavedPlaceIds().length + '</strong><span>处真实地点</span></div>' +
      '<div class="summary-tags">' + tags.slice(0, 4).map(function (tag) { return '<span># ' + escapeHtml(tag.name) + '</span>'; }).join("") + '</div>';
    grid.innerHTML = savedPhotos.map(function (photo) {
      var place = places[photo.placeId];
      return '<article class="collection-card" data-place-id="' + place.id + '">' +
        '<img src="' + photo.image + '" alt="' + escapeHtml(place.name) + '">' +
        '<button class="collection-remove" data-remove-photo="' + photo.id + '" aria-label="移除收藏">' + svgIcon("x") + '</button>' +
        '<div class="collection-card-copy"><small>' + escapeHtml(place.subtitle) + '</small><h3>' + escapeHtml(place.name) + '</h3><p>小红书样本提及 ' + place.frequency + ' 次 · 点击查看</p></div>' +
      '</article>';
    }).join("");

    grid.querySelectorAll("[data-place-id]").forEach(function (card) {
      card.addEventListener("click", function () { openPlace(card.dataset.placeId); });
    });
    grid.querySelectorAll("[data-remove-photo]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        state.saved = state.saved.filter(function (id) { return id !== button.dataset.removePhoto; });
        saveState();
        renderAll();
        showToast("已从收藏中移除");
      });
    });
  }

  function renderMap() {
    var ids = uniqueSavedPlaceIds();
    var pins = document.getElementById("map-pins");
    var list = document.getElementById("map-place-list");
    document.getElementById("map-empty").hidden = ids.length > 0;
    document.getElementById("map-place-count").textContent = ids.length + " 处";
    pins.innerHTML = ids.map(function (id, index) {
      var place = places[id];
      return '<button class="map-pin" data-place-id="' + id + '" style="left:' + place.map.x + '%;top:' + place.map.y + '%" aria-label="查看' + escapeHtml(place.name) + '">' +
        '<span class="map-pin-pulse"></span><span class="map-pin-core"><span>' + (index + 1) + '</span></span><span class="map-pin-label">' + escapeHtml(place.name) + '</span></button>';
    }).join("");
    if (!ids.length) {
      list.innerHTML = '<div class="map-list-empty">目前还没有地点。<br>照片被收藏后才会在这里出现。</div>';
    } else {
      list.innerHTML = ids.map(function (id) {
        var place = places[id];
        var photo = photos.find(function (item) { return item.placeId === id && state.saved.indexOf(item.id) >= 0; }) || photos.find(function (item) { return item.placeId === id; });
        return '<button class="map-place-item" data-place-id="' + id + '"><img src="' + photo.image + '" alt=""><span><h4>' + escapeHtml(place.name) + '</h4><small>' + escapeHtml(place.subtitle) + '</small></span>' + svgIcon("chevron") + '</button>';
      }).join("");
    }
    document.querySelectorAll("#map-pins [data-place-id], #map-place-list [data-place-id]").forEach(function (button) {
      button.addEventListener("click", function () { openPlace(button.dataset.placeId); });
    });
  }

  function renderSources() {
    document.getElementById("source-list").innerHTML = photos.map(function (photo) {
      var place = places[photo.placeId];
      return '<div class="source-item"><img src="' + photo.image + '" alt=""><span><h4>' + escapeHtml(place.name) + ' · ' + escapeHtml(photo.title) + '</h4><p>' + escapeHtml(photo.proof) + '</p></span><a href="' + photo.sourceUrl + '" target="_blank" rel="noreferrer" aria-label="打开来源">' + svgIcon("external") + '</a></div>';
    }).join("");
  }

  function renderResearch() {
    var avg = state.decisions.length
      ? Math.round(state.decisions.reduce(function (sum, item) { return sum + item.latencyMs; }, 0) / state.decisions.length / 100) / 10
      : 0;
    var completion = Math.round(state.current / photos.length * 100);
    document.getElementById("metric-grid").innerHTML =
      '<div class="metric"><strong>' + completion + '%</strong><span>浏览完成率</span></div>' +
      '<div class="metric"><strong>' + state.saved.length + '</strong><span>收藏照片数</span></div>' +
      '<div class="metric"><strong>' + avg + 's</strong><span>平均决策时间</span></div>';
    document.getElementById("research-log").innerHTML = state.decisions.length
      ? state.decisions.slice().reverse().map(function (item) {
          return '<div class="log-row"><span><b>' + (item.decision === "save" ? "收藏" : "略过") + '</b> · ' + escapeHtml(places[item.placeId].name) + '</span><span>' + (item.latencyMs / 1000).toFixed(1) + ' 秒</span></div>';
        }).join("")
      : '<div class="map-list-empty">完成第一张照片选择后，记录会显示在这里。</div>';
  }

  function renderCounts() {
    var count = state.saved.length;
    document.getElementById("nav-count").textContent = count || "";
    document.getElementById("mobile-count").textContent = count || "";
    document.getElementById("mobile-count").style.display = count ? "grid" : "none";
  }

  function renderAll() {
    renderCards();
    renderProfile();
    renderCollection();
    renderMap();
    renderResearch();
    renderCounts();
  }

  function openPlace(placeId) {
    var place = places[placeId];
    if (!place) return;
    var savedPhoto = photos.find(function (photo) { return photo.placeId === placeId && state.saved.indexOf(photo.id) >= 0; });
    var hero = savedPhoto || photos.find(function (photo) { return photo.placeId === placeId; });
    var navUrl = "https://uri.amap.com/search?keyword=" + encodeURIComponent("三河古镇 " + place.name);
    var content = document.getElementById("place-sheet-content");
    content.innerHTML =
      '<div class="place-hero"><img src="' + hero.image + '" alt="' + escapeHtml(place.name) + '"><div class="place-title"><small>' + escapeHtml(place.subtitle) + '</small><h2>' + escapeHtml(place.name) + '</h2></div></div>' +
      '<div class="place-body">' +
        '<div class="place-facts"><span>样本提及 ' + place.frequency + ' 次</span><span>照片来源已核验</span><span>候选地点池 TOP 7</span></div>' +
        '<p class="place-description">' + escapeHtml(place.description) + '</p>' +
        '<p class="detail-label">拍摄提示</p><div class="shoot-tip">' + svgIcon("camera") + '<span>' + escapeHtml(place.tip) + '</span></div>' +
        '<p class="detail-label" style="margin-top:28px">附近可以继续探索</p>' +
        '<div class="experience-list">' + place.experiences.map(function (item, index) {
          return '<button class="experience-item" data-experience="' + index + '"><span class="experience-icon">' + svgIcon(item.icon) + '</span><span><h4>' + escapeHtml(item.title) + '</h4><p>' + escapeHtml(item.note) + '</p></span>' + svgIcon("chevron") + '</button>';
        }).join("") + '</div>' +
        '<div class="place-actions"><a class="secondary-button" href="' + hero.sourceUrl + '" target="_blank" rel="noreferrer">' + svgIcon("external") + '查看图片来源</a><a class="primary-button" href="' + navUrl + '" target="_blank" rel="noreferrer">' + svgIcon("route") + '在高德地图搜索</a></div>' +
      '</div>';
    content.querySelectorAll("[data-experience]").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = place.experiences[Number(button.dataset.experience)];
        state.experienceClicks.push({ placeId: placeId, experience: item.title, at: new Date().toISOString() });
        saveState();
        renderResearch();
        showToast("已记录体验兴趣 · <b>" + escapeHtml(item.title) + "</b>");
      });
    });
    document.getElementById("place-sheet").showModal();
  }

  function showView(view) {
    if (!document.getElementById("view-" + view)) return;
    currentView = view;
    document.querySelectorAll(".view").forEach(function (section) { section.classList.remove("is-active"); });
    document.getElementById("view-" + view).classList.add("is-active");
    document.querySelectorAll("[data-view]").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.view === view);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "map") {
      renderMap();
      var ids = uniqueSavedPlaceIds();
      if (ids.length) {
        window.setTimeout(function () {
          var frame = document.getElementById("map-frame");
          var canvas = frame.querySelector(".map-canvas");
          var first = places[ids[0]];
          frame.scrollTo({ top: Math.max(0, canvas.scrollHeight * first.map.y / 100 - frame.clientHeight * .35), behavior: "smooth" });
        }, 80);
      }
    }
  }

  function bindViewButtons(root) {
    (root || document).querySelectorAll("[data-view]").forEach(function (button) {
      if (button.dataset.bound === "1") return;
      button.dataset.bound = "1";
      button.addEventListener("click", function () { showView(button.dataset.view); });
    });
  }

  function exportResearch() {
    var payload = {
      prototype: "镜游三河",
      exportedAt: new Date().toISOString(),
      sessionStartedAt: new Date(state.startedAt).toISOString(),
      summary: {
        completedPhotos: state.current,
        totalPhotos: photos.length,
        savedPhotos: state.saved.length,
        discoveredPlaces: uniqueSavedPlaceIds().map(function (id) { return places[id].name; })
      },
      decisions: state.decisions,
      experienceClicks: state.experienceClicks
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jingyou-sanhe-session.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("研究记录已导出");
  }

  function resetExperience() {
    var keepOnboarding = state.onboardingSeen;
    state = defaultState();
    state.onboardingSeen = keepOnboarding;
    saveState();
    document.getElementById("research-sheet").close();
    showView("discover");
    renderAll();
    showToast("体验已重置");
  }

  function registerWebMCP() {
    var context = document.modelContext;
    if (!context || typeof context.registerTool !== "function") return;
    var safeRegister = function (tool) {
      try { Promise.resolve(context.registerTool(tool)).catch(function () {}); } catch (error) {}
    };
    safeRegister({
      name: "get_photo_discovery_state",
      title: "读取照片发现进度",
      description: "读取当前已浏览照片数、收藏照片、解锁地点和当前页面，不修改原型状态。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: function () {
        return {
          view: currentView,
          completed: state.current,
          total: photos.length,
          savedPhotoIds: state.saved.slice(),
          discoveredPlaces: uniqueSavedPlaceIds().map(function (id) { return places[id].name; })
        };
      }
    });
    safeRegister({
      name: "record_current_photo_decision",
      title: "选择当前照片",
      description: "对当前可见照片执行“收藏”或“略过”，并同步更新可见卡片、收藏与地图。",
      inputSchema: {
        type: "object",
        properties: { decision: { type: "string", enum: ["save", "skip"] } },
        required: ["decision"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async function (input) {
        if (!input || (input.decision !== "save" && input.decision !== "skip")) throw new Error("decision 必须是 save 或 skip");
        if (state.current >= photos.length) throw new Error("所有照片已完成选择");
        var photo = photos[state.current];
        decide(input.decision);
        await new Promise(function (resolve) { window.setTimeout(resolve, 380); });
        return { accepted: true, photoId: photo.id, decision: input.decision, placeRevealed: places[photo.placeId].name };
      }
    });
    safeRegister({
      name: "navigate_photo_prototype",
      title: "切换原型页面",
      description: "切换到发现、收藏或地图页面，并同步更新可见界面。",
      inputSchema: {
        type: "object",
        properties: { view: { type: "string", enum: ["discover", "collection", "map"] } },
        required: ["view"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: function (input) {
        if (!input || ["discover", "collection", "map"].indexOf(input.view) < 0) throw new Error("未知页面");
        showView(input.view);
        return { view: input.view };
      }
    });
  }

  function init() {
    hydrateIcons();
    renderSources();
    renderAll();
    bindViewButtons();

    document.getElementById("skip-button").addEventListener("click", function () { decide("skip"); });
    document.getElementById("save-button").addEventListener("click", function () { decide("save"); });
    document.getElementById("undo-button").addEventListener("click", undo);
    document.getElementById("collection-map-button").addEventListener("click", function () { showView("map"); });
    document.getElementById("sources-button").addEventListener("click", function () { document.getElementById("sources-sheet").showModal(); });
    document.getElementById("research-button").addEventListener("click", function () { renderResearch(); document.getElementById("research-sheet").showModal(); });
    document.getElementById("export-button").addEventListener("click", exportResearch);
    document.getElementById("reset-button").addEventListener("click", resetExperience);
    document.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () { document.getElementById(button.dataset.close).close(); });
    });
    document.querySelectorAll("dialog").forEach(function (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
    });

    var onboarding = document.getElementById("onboarding");
    if (state.onboardingSeen) onboarding.classList.add("is-hidden");
    document.getElementById("start-button").addEventListener("click", function () {
      state.onboardingSeen = true;
      state.startedAt = Date.now();
      state.cardStartedAt = Date.now();
      saveState();
      onboarding.classList.add("is-hidden");
    });

    document.addEventListener("keydown", function (event) {
      if (!onboarding.classList.contains("is-hidden")) return;
      if (document.querySelector("dialog[open]")) return;
      if (currentView !== "discover") return;
      if (event.key === "ArrowLeft") decide("skip");
      if (event.key === "ArrowRight") decide("save");
    });

    registerWebMCP();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
