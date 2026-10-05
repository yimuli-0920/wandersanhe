(function () {
  "use strict";

  var data = window.SANHE_DATA;
  var condition = document.body.dataset.condition === "interest" ? "interest" : "photo";
  var stimuli = condition === "photo" ? data.photoStimuli : data.interestStimuli;
  var storageKey = "jingyou-sanhe-v4:" + condition;
  var toastTimer = null;
  var drag = null;

  var icons = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V21h14V10.5M9 21v-6h6v6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9Z"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    undo: '<path d="M9 7 4 12l5 5"/><path d="M20 17a8 8 0 0 0-8-8H4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    move: '<path d="m5 9-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
    spark: '<path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4ZM5 14l-.9 2.1L2 17l2.1.9L5 20l.9-2.1L8 17l-2.1-.9ZM19 13l-.7 1.8-1.8.7 1.8.7L19 18l.7-1.8 1.8-.7-1.8-.7Z"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || icons.spark) + '</svg>';
  }

  function uid() {
    return "S" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function seededOrder(seed) {
    var hash = 2166136261;
    String(seed).split("").forEach(function (char) { hash = Math.imul(hash ^ char.charCodeAt(0), 16777619); });
    var ids = data.places.map(function (place) { return place.id; });
    function random() {
      hash += 0x6D2B79F5;
      var value = hash;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    }
    for (var i = ids.length - 1; i > 0; i -= 1) {
      var j = Math.floor(random() * (i + 1));
      var temp = ids[i]; ids[i] = ids[j]; ids[j] = temp;
    }
    return ids;
  }

  function freshState() {
    var sessionId = uid();
    return {
      schemaVersion: 4,
      sessionId: sessionId,
      condition: condition,
      current: 0,
      decisions: [],
      background: { visitHistory: null, familiarity: null },
      validationOrder: seededOrder(sessionId),
      independentRatings: {},
      validationEvents: [],
      validationStartedAt: null,
      validationSubmittedAt: null,
      validationDurationMs: null,
      selectedPlaces: [],
      detailClicks: [],
      survey: null,
      startedAt: new Date().toISOString(),
      cardStartedAt: Date.now(),
      onboardingSeen: false,
      currentView: "select"
    };
  }

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(storageKey));
      if (!parsed || parsed.schemaVersion !== 4 || parsed.condition !== condition) return freshState();
      return Object.assign(freshState(), parsed);
    } catch (error) {
      return freshState();
    }
  }

  var state = loadState();

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function sourceCredit(source) {
    if (!source) return "来源待补";
    return "来源：" + source.platform + " @" + source.author + " · 图" + source.imageIndex;
  }

  function conditionCopy() {
    return condition === "photo" ? {
      code: "A", label: "照片条件", eyebrow: "PHOTO CONDITION",
      title: "先被画面吸引，\n再认识一个地方。",
      lead: "判断每幅画面在多大程度上符合你的旅行偏好。选择前不显示具体地点名与笔记标题。",
      no: "不符合我的偏好", yes: "符合我的偏好", onboardingTitle: "别先看攻略。\n先判断什么符合你的偏好。",
      onboardingLead: "你将连续看到 9 张已核验的三河古镇实景。每张都使用同一个二元问题；不符合也会作为负向信号进入推荐。"
    } : {
      code: "B", label: "兴趣条件", eyebrow: "INTEREST CONDITION",
      title: "把旅行偏好，\n说得更清楚一点。",
      lead: "判断每条旅行陈述在多大程度上符合你的旅行偏好。卡片数量、问题和操作节奏与照片条件一致。",
      no: "不符合我的偏好", yes: "符合我的偏好", onboardingTitle: "没有标准答案。\n只判断什么符合你的偏好。",
      onboardingLead: "你将连续看到 9 条旅行兴趣陈述。每条陈述与照片条件一一映射到相同权重；不符合也会作为负向信号进入推荐。"
    };
  }

  var copy = conditionCopy();

  function shellHtml() {
    return '<div class="grain" aria-hidden="true"></div>' +
      '<div class="experience-shell">' +
        '<header class="exp-topbar">' +
          '<a class="exp-brand" href="./index.html" aria-label="返回研究演示台"><span class="brand-seal">镜</span><span><b>镜游三河</b><small>SANHE PREFERENCE LAB</small></span></a>' +
          '<div class="condition-badge"><i>' + copy.code + '</i><span><small>ASSIGNED CONDITION</small><b>' + copy.label + '</b></span></div>' +
          '<div class="top-actions"><button data-dialog="sources-dialog" aria-label="查看数据与素材依据">' + icon("info") + '<span>证据</span></button><button data-dialog="research-dialog" aria-label="查看本次研究记录">' + icon("chart") + '<span>记录</span></button></div>' +
        '</header>' +
        '<main class="exp-main">' +
           '<nav class="step-nav" aria-label="实验步骤">' +
             '<button class="is-active" data-view="select"><i>01</i><span>表达偏好</span></button>' +
              '<button data-view="validation" id="validation-nav"><i>02</i><span>独立判断</span></button>' +
             '<button data-view="results" id="results-nav"><i>03</i><span>推荐结果</span></button>' +
             '<button data-view="map" id="map-nav"><i>04</i><span>地点地图</span></button>' +
          '</nav>' +
          '<section class="exp-view is-active" id="view-select">' +
            '<div class="select-intro"><span class="section-no">01 / ELICITATION</span><h1>' + copy.title.replace("\n", "<br>") + '</h1><p>' + copy.lead + '</p>' +
              '<div class="progress-track"><i id="progress-fill"></i></div><div class="progress-meta"><span id="progress-label">01 / 09</span><button id="undo-button" disabled>' + icon("undo") + '撤销</button></div>' +
            '</div>' +
            '<div class="stimulus-workspace"><div class="stimulus-stack" id="stimulus-stack" aria-live="polite"></div>' +
              '<div class="decision-row" id="decision-row"><button class="decision no" id="no-button">' + icon("x") + '<span>' + copy.no + '</span><kbd>←</kbd></button><button class="decision yes" id="yes-button">' + icon("heart") + '<span>' + copy.yes + '</span><kbd>→</kbd></button></div>' +
              '<p class="gesture-hint">' + icon("move") + '可拖动卡片，也可使用方向键</p>' +
            '</div>' +
            '<aside class="profile-panel"><span class="live-indicator"><i></i>实时构成</span><h2>你的兴趣轮廓</h2><p>两种条件都进入相同的六维偏好空间，符合与不符合共同决定结果。</p><div class="profile-bars" id="profile-bars"></div><div class="profile-foot"><span>已完成 <b id="answered-count">0</b> / 9</span><span>符合 <b id="positive-count">0</b></span></div></aside>' +
           '</section>' +
           '<section class="exp-view" id="view-validation"><div class="validation-head"><div><span class="section-no">02 / PRE-REVEAL PLACE JUDGEMENT</span><h1>推荐揭示前，<br><em>独立判断每个地点。</em></h1><p>这是“推荐结果与推荐揭示前独立地点判断的一致性”基准，不代表所谓“用户真正的偏好”。两组看到完全相同、等长度、等结构的中性说明。</p></div><aside class="validation-rule"><span>统一问题</span><b>如果近期前往三河古镇，<br>你有多想探访这个地点？</b><small>1＝完全不想　7＝非常想；不了解可选“无法判断”</small></aside></div><form id="validation-form"><div class="validation-toolbar"><span id="validation-progress">已回答 0 / 7</span><em>“无法判断”不会换算成中间分 · 提交后锁定</em></div><div class="validation-grid" id="validation-grid"></div><div class="validation-submit"><p>独立判断不参与推荐计算；若推荐前三中有“无法判断”，NDCG@3 将标记为不可计算，而不是擅自按 4 分处理。</p><button class="primary-action" id="submit-validation" type="submit" disabled>锁定判断并查看推荐 <span>↗</span></button></div></form></section>' +
           '<section class="exp-view" id="view-results"><div class="results-head"><div><span class="section-no">03 / RECOMMENDATION</span><h1>你的三河，<br><em>从兴趣开始排序。</em></h1></div><div class="result-method"><span>共享算法</span><b>正负偏好信号 × 地点特征</b><small>独立地点判断不参与推荐计算</small></div></div><div class="results-layout"><div class="recommendation-list" id="recommendation-list"></div><aside class="selection-panel" id="selection-panel"></aside></div></section>' +
           '<section class="exp-view" id="view-map"><div class="map-head"><div><span class="section-no">04 / PLACE MAP</span><h1>把推荐放回古镇里。</h1><p>地图只呈现同一推荐算法排出的前五处地点；数字对应推荐顺序。</p></div><div class="map-legend"><span><i class="dot top"></i>推荐前五</span><span><i class="dot picked"></i>最终选择</span></div></div><div class="map-layout"><div class="map-frame"><img src="./assets/maps/sanhe-handdrawn-map.jpg" alt="三河古镇官方手绘导览图"><div id="map-pins" class="map-pins"></div><span class="map-credit">底图：三河古镇景区手绘导览图</span></div><aside class="map-side" id="map-side"></aside></div></section>' +
         '</main>' +
          '<nav class="mobile-step-nav"><button class="is-active" data-view="select">' + icon("compass") + '<span>偏好</span></button><button data-view="validation">' + icon("sliders") + '<span>判断</span></button><button data-view="results">' + icon("heart") + '<span>推荐</span></button><button data-view="map">' + icon("map") + '<span>地图</span></button></nav>' +
      '</div>' +
        '<div class="onboarding' + (state.onboardingSeen ? ' is-hidden' : '') + '" id="onboarding"><div class="onboarding-card ' + condition + '"><div class="onboarding-preview" id="onboarding-preview"></div><div class="onboarding-copy"><a href="./index.html" class="mini-brand"><span class="brand-seal">镜</span>游三河</a><span class="condition-label"><i>' + copy.code + '</i>' + copy.eyebrow + '</span><h2>' + copy.onboardingTitle.replace("\n", "<br>") + '</h2><p>' + copy.onboardingLead + '</p><form class="background-form" id="background-form"><fieldset><legend>你是否去过三河古镇？</legend><div class="background-options"><label><input type="radio" name="visit-history" value="never" required><span>没有去过</span></label><label><input type="radio" name="visit-history" value="once"><span>去过 1 次</span></label><label><input type="radio" name="visit-history" value="multiple"><span>去过 2 次及以上</span></label></div></fieldset><fieldset><legend>你目前对三河古镇有多熟悉？</legend><div class="familiarity-scale"><span>完全不了解</span>' + [1,2,3,4,5].map(function (n) { return '<label><input type="radio" name="familiarity" value="' + n + '" required><b>' + n + '</b></label>'; }).join("") + '<span>非常熟悉</span></div></fieldset><dl><div><dt>偏好判断</dt><dd>9</dd></div><div><dt>独立判断</dt><dd>7</dd></div><div><dt>数据存储</dt><dd>本机</dd></div></dl><button class="primary-action" id="start-button" type="submit">记录背景并开始 <span>↗</span></button></form><small>去访经历与熟悉度仅作为控制变量，不用于推荐</small></div></div></div>' +
      '<dialog class="detail-dialog" id="detail-dialog"><button class="dialog-close" data-close="detail-dialog" aria-label="关闭">' + icon("x") + '</button><div id="detail-content"></div></dialog>' +
      '<dialog class="panel-dialog" id="sources-dialog"><button class="dialog-close" data-close="sources-dialog" aria-label="关闭">' + icon("x") + '</button><span class="dialog-kicker">EVIDENCE REGISTER</span><h2>数据与素材依据</h2><div id="sources-content"></div></dialog>' +
      '<dialog class="panel-dialog" id="research-dialog"><button class="dialog-close" data-close="research-dialog" aria-label="关闭">' + icon("x") + '</button><span class="dialog-kicker">RESEARCH LOG</span><h2>本次匿名记录</h2><div id="research-content"></div></dialog>' +
      '<dialog class="survey-dialog" id="survey-dialog"><button class="dialog-close" data-close="survey-dialog" aria-label="关闭">' + icon("x") + '</button><span class="dialog-kicker">POST-TASK CHECK</span><h2>最后四个判断</h2><p>请根据刚才的体验选择 1–7 分。数据只保存在当前设备。</p><form id="survey-form"></form></dialog>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
  }

  document.getElementById("app").innerHTML = shellHtml();

  function renderOnboardingPreview() {
    var host = document.getElementById("onboarding-preview");
    if (condition === "photo") {
      var preview = data.photoStimuli[1];
      host.innerHTML = '<img src="' + preview.image + '" alt="小红书三河古镇实景照片"><span class="preview-tag no">不符合</span><span class="preview-tag yes">符合</span><span class="photo-credit onboarding-credit">' + escapeHtml(sourceCredit(preview.source)) + '</span>';
    } else {
      host.innerHTML = '<div class="onboarding-orbit"></div><span>留到入夜</span><blockquote>我愿意把行程留到傍晚，等灯光落在水面。</blockquote><small>不符合我的偏好　—　符合我的偏好</small>';
    }
  }

  function stimulusById(id) {
    return stimuli.find(function (item) { return item.id === id; });
  }

  function likedStimuli() {
    return state.decisions.filter(function (d) { return d.decision === "yes"; }).map(function (d) { return stimulusById(d.stimulusId); }).filter(Boolean);
  }

  function hasPositivePreference() {
    return likedStimuli().length > 0;
  }

  function preferenceSignal() {
    var signal = {};
    data.themes.forEach(function (theme) {
      var numerator = 0;
      var denominator = 0;
      state.decisions.forEach(function (decision) {
        var item = stimulusById(decision.stimulusId);
        var weight = item ? item.weights[theme.id] || 0 : 0;
        denominator += weight;
        numerator += (decision.decision === "yes" ? 1 : -1) * weight;
      });
      signal[theme.id] = denominator ? numerator / denominator : 0;
    });
    return signal;
  }

  function preferenceVector() {
    var signal = preferenceSignal();
    var vector = {};
    data.themes.forEach(function (theme) { vector[theme.id] = state.decisions.length ? (signal[theme.id] + 1) / 2 : 0; });
    return vector;
  }

  function cosine(a, b) {
    var dot = 0, aa = 0, bb = 0;
    data.themes.forEach(function (theme) {
      var av = a[theme.id] || 0, bv = b[theme.id] || 0;
      dot += av * bv; aa += av * av; bb += bv * bv;
    });
    return aa && bb ? dot / (Math.sqrt(aa) * Math.sqrt(bb)) : 0;
  }

  function rankedPlaces() {
    if (!hasPositivePreference()) return [];
    var signal = preferenceSignal();
    return data.places.map(function (place) {
      var centeredPlace = {};
      data.themes.forEach(function (theme) { centeredPlace[theme.id] = (place.weights[theme.id] || 0) * 2 - 1; });
      var similarity = cosine(signal, centeredPlace);
      return { place: place, score: Math.round((similarity + 1) / 2 * 100) };
    }).sort(function (a, b) { return b.score - a.score || a.place.name.localeCompare(b.place.name, "zh-CN"); });
  }

  function isValidationResponse(value) {
    return value === "unknown" || (Number(value) >= 1 && Number(value) <= 7);
  }

  function validationCount() {
    return data.places.filter(function (place) { return isValidationResponse(state.independentRatings[place.id]); }).length;
  }

  function ratedValidationCount() {
    return data.places.filter(function (place) { return Number(state.independentRatings[place.id]) >= 1; }).length;
  }

  function validationComplete() {
    return validationCount() === data.places.length;
  }

  function ndcgAt3() {
    if (!state.validationSubmittedAt || !validationComplete()) return { value: null, valid: false, reason: "not_submitted" };
    if (!hasPositivePreference()) return { value: null, valid: false, reason: "insufficient_positive_signal" };
    var ratings = data.places.map(function (place) { return Number(state.independentRatings[place.id]); }).filter(function (rating) { return rating >= 1; });
    if (ratings.length < 3) return { value: null, valid: false, reason: "insufficient_rated_places" };
    if (new Set(ratings).size < 2) return { value: null, valid: false, reason: "no_preference_variation" };
    function gain(rating, index) {
      var relevance = rating - 1;
      return (Math.pow(2, relevance) - 1) / (Math.log(index + 2) / Math.log(2));
    }
    var systemRatings = rankedPlaces().slice(0, 3).map(function (entry) { return Number(state.independentRatings[entry.place.id]); });
    if (systemRatings.some(function (rating) { return !(rating >= 1); })) return { value: null, valid: false, reason: "recommended_item_unrated" };
    var idealRatings = ratings.slice().sort(function (a, b) { return b - a; }).slice(0, 3);
    var dcg = systemRatings.reduce(function (sum, rating, index) { return sum + gain(rating, index); }, 0);
    var idcg = idealRatings.reduce(function (sum, rating, index) { return sum + gain(rating, index); }, 0);
    if (!idcg) return { value: null, valid: false, reason: "zero_relevance" };
    return { value: Math.round(dcg / idcg * 10000) / 10000, valid: true, reason: null };
  }

  function leadingThemes(place, count) {
    var vector = preferenceVector();
    return data.themes.map(function (theme) {
      return { theme: theme, value: (vector[theme.id] || .1) * (place.weights[theme.id] || 0) };
    }).sort(function (a, b) { return b.value - a.value; }).slice(0, count || 2);
  }

  function renderStimulusCards() {
    var stack = document.getElementById("stimulus-stack");
    stack.innerHTML = "";
    if (state.current >= stimuli.length) {
      var liked = likedStimuli().length;
      stack.innerHTML = hasPositivePreference()
        ? '<div class="completion-card"><div class="completion-rings"><span>' + liked + '</span></div><span class="section-no">PROFILE READY</span><h2>偏好判断已经完成。</h2><p>符合与不符合都已进入算法。下一步先完成 7 个地点的独立判断，推荐名次暂不显示。</p><button class="primary-action" id="show-validation">进入独立判断 <span>↗</span></button><button class="quiet-action" id="replay-button">重新完成本条件</button></div>'
        : '<div class="completion-card insufficient-card"><div class="completion-rings"><span>0</span></div><span class="section-no">INSUFFICIENT SIGNAL</span><h2>偏好信息不足。</h2><p>9 项均为“不符合我的偏好”，系统不会退回热门地点推荐。你仍可完成独立地点判断，结果页将明确标记为未生成推荐。</p><button class="primary-action" id="show-validation">继续完成独立判断 <span>↗</span></button><button class="quiet-action" id="replay-button">重新完成本条件</button></div>';
      document.getElementById("decision-row").hidden = true;
      document.querySelector(".gesture-hint").hidden = true;
      document.getElementById("show-validation").addEventListener("click", function () { goTo("validation"); });
      document.getElementById("replay-button").addEventListener("click", resetExperience);
      updateProgress();
      return;
    }
    document.getElementById("decision-row").hidden = false;
    document.querySelector(".gesture-hint").hidden = false;
    stimuli.slice(state.current, state.current + 3).reverse().forEach(function (item) {
      var index = stimuli.indexOf(item);
      var card = document.createElement("article");
      card.className = "stimulus-card " + (condition === "photo" ? "photo-stimulus" : "interest-stimulus");
      card.dataset.id = item.id;
      if (condition === "photo") {
        card.innerHTML = '<img src="' + item.image + '" alt="一张已核验的小红书三河古镇旅行照片，具体地点将在选择结束后揭示" draggable="false" style="object-position:' + escapeHtml(item.imagePosition || "center") + '"><div class="stimulus-top"><span>FRAME ' + String(index + 1).padStart(2, "0") + '</span><b><i></i>小红书实景已核验</b></div><span class="photo-credit">' + escapeHtml(sourceCredit(item.source)) + '</span><div class="decision-stamp no">不符合</div><div class="decision-stamp yes">符合</div><div class="neutral-prompt"><span>两组统一问题</span><p>这项内容在多大程度上符合你的旅行偏好？</p></div>';
      } else {
        var accent = data.themes[index % data.themes.length].color;
        card.style.setProperty("--card-accent", accent);
        card.innerHTML = '<div class="semantic-grid"></div><div class="semantic-orbit one"></div><div class="semantic-orbit two"></div><div class="stimulus-top"><span>INTEREST ' + String(index + 1).padStart(2, "0") + '</span><b>旅行陈述</b></div><div class="decision-stamp no">不符合</div><div class="decision-stamp yes">符合</div><div class="semantic-copy"><span>' + escapeHtml(item.kicker) + '</span><blockquote>' + escapeHtml(item.statement) + '</blockquote><small>这项内容在多大程度上符合你的旅行偏好？</small></div>';
      }
      stack.appendChild(card);
    });
    bindDrag(stack.lastElementChild);
    updateProgress();
  }

  function bindDrag(card) {
    if (!card) return;
    card.addEventListener("pointerdown", function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      drag = { x: event.clientX, y: event.clientY, id: event.pointerId };
      card.setPointerCapture(event.pointerId);
      card.classList.add("is-dragging");
    });
    card.addEventListener("pointermove", function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      card.style.transform = "translate(" + dx + "px," + Math.min(35, dy * .18) + "px) rotate(" + dx / 24 + "deg)";
      var amount = Math.min(1, Math.abs(dx) / 100);
      card.querySelector(".decision-stamp.yes").style.opacity = dx > 0 ? amount : 0;
      card.querySelector(".decision-stamp.no").style.opacity = dx < 0 ? amount : 0;
    });
    card.addEventListener("pointerup", function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x;
      drag = null;
      card.classList.remove("is-dragging");
      if (Math.abs(dx) > 88) decide(dx > 0 ? "yes" : "no");
      else { card.style.transform = ""; card.querySelectorAll(".decision-stamp").forEach(function (stamp) { stamp.style.opacity = 0; }); }
    });
    card.addEventListener("pointercancel", function () { drag = null; card.classList.remove("is-dragging"); card.style.transform = ""; });
  }

  function decide(decision) {
    if (state.current >= stimuli.length) return;
    var item = stimuli[state.current];
    var top = document.querySelector(".stimulus-stack .stimulus-card:last-child");
    if (!top || top.classList.contains("leave-yes") || top.classList.contains("leave-no")) return;
    state.decisions.push({
      stimulusId: item.id, pairId: item.pairId, decision: decision,
      responseMs: Math.max(0, Date.now() - state.cardStartedAt), at: new Date().toISOString()
    });
    top.classList.add(decision === "yes" ? "leave-yes" : "leave-no");
    window.setTimeout(function () {
      state.current += 1;
      state.cardStartedAt = Date.now();
      saveState();
      renderAll();
      showToast(decision === "yes" ? "已记录：符合我的偏好" : "已记录：不符合我的偏好");
    }, 300);
  }

  function undo() {
    if (!state.decisions.length || state.validationStartedAt) return;
    state.decisions.pop();
    state.current = Math.max(0, state.current - 1);
    state.cardStartedAt = Date.now();
    saveState(); renderAll(); showToast("已撤销上一项判断");
  }

  function updateProgress() {
    var done = Math.min(state.current, stimuli.length);
    var current = Math.min(state.current + 1, stimuli.length);
    document.getElementById("progress-fill").style.width = (done / stimuli.length * 100) + "%";
    document.getElementById("progress-label").textContent = String(current).padStart(2, "0") + " / " + String(stimuli.length).padStart(2, "0");
    document.getElementById("undo-button").disabled = !state.decisions.length || Boolean(state.validationStartedAt);
    document.getElementById("answered-count").textContent = state.decisions.length;
    document.getElementById("positive-count").textContent = likedStimuli().length;
  }

  function renderProfile() {
    var vector = preferenceVector();
    document.getElementById("profile-bars").innerHTML = data.themes.map(function (theme) {
      var value = Math.round((vector[theme.id] || 0) * 100);
      return '<div class="profile-row"><div><span><i style="--theme:' + theme.color + '"></i>' + theme.name + '</span><b>' + (value ? value : "—") + '</b></div><em><i style="width:' + value + '%;--theme:' + theme.color + '"></i></em></div>';
    }).join("");
  }

  function renderValidation() {
    var form = document.getElementById("validation-form");
    if (state.validationSubmittedAt) {
      form.innerHTML = '<div class="validation-locked"><div class="completion-rings">' + icon("check") + '</div><span class="section-no">BASELINE LOCKED</span><h2>7 项独立判断已锁定。</h2><p>其中 ' + ratedValidationCount() + ' 项给出 1–7 分，' + (data.places.length - ratedValidationCount()) + ' 项选择“信息不足／无法判断”。这些回答不会再被推荐名次或解释文案改变。</p><button class="primary-action" type="button" id="reveal-results">查看推荐结果 <span>↗</span></button></div>';
      document.getElementById("reveal-results").addEventListener("click", function () { goTo("results"); });
      return;
    }

    var orderedPlaces = state.validationOrder.map(function (id) { return data.places.find(function (place) { return place.id === id; }); }).filter(Boolean);
    form.innerHTML = '<div class="validation-toolbar"><span id="validation-progress">已回答 ' + validationCount() + ' / ' + data.places.length + ' · 可评分 ' + ratedValidationCount() + '</span><em>序号仅表示随机呈现顺序 · 提交后不可修改</em></div><div class="validation-grid" id="validation-grid">' + orderedPlaces.map(function (place, index) {
      var unknown = state.independentRatings[place.id] === "unknown";
      return '<article class="validation-card"><div class="validation-card-head"><span>地点 ' + String(index + 1).padStart(2, "0") + '</span><h2>' + escapeHtml(place.name) + '</h2></div><p>' + escapeHtml(place.validationSummary) + '</p><fieldset><legend>探访意愿</legend><div class="place-rating">' + [1,2,3,4,5,6,7].map(function (rating) { var checked = Number(state.independentRatings[place.id]) === rating; return '<label><input type="radio" name="rating-' + place.id + '" value="' + rating + '" data-rating="' + place.id + '"' + (checked ? ' checked' : '') + ' required><b>' + rating + '</b></label>'; }).join("") + '</div><div class="rating-ends"><span>完全不想</span><span>非常想</span></div><label class="unknown-rating"><input type="radio" name="rating-' + place.id + '" value="unknown" data-rating="' + place.id + '"' + (unknown ? ' checked' : '') + ' required><span>信息不足／无法判断</span></label></fieldset></article>';
    }).join("") + '</div><div class="validation-submit"><p>这些判断记录推荐揭示前的地点意愿，不会改变随后展示的推荐结果；“无法判断”将原样保留。</p><button class="primary-action" id="submit-validation" type="submit"' + (validationComplete() ? '' : ' disabled') + '>锁定判断并查看推荐 <span>↗</span></button></div>';

    form.querySelectorAll("[data-rating]").forEach(function (input) {
      input.addEventListener("change", function () {
        var rating = input.value === "unknown" ? "unknown" : Number(input.value);
        state.independentRatings[input.dataset.rating] = rating;
        state.validationEvents.push({ placeId: input.dataset.rating, rating: rating, at: new Date().toISOString() });
        saveState();
        document.getElementById("validation-progress").textContent = "已回答 " + validationCount() + " / " + data.places.length + " · 可评分 " + ratedValidationCount();
        document.getElementById("submit-validation").disabled = !validationComplete();
      });
    });

    form.onsubmit = function (event) {
      event.preventDefault();
      if (!validationComplete()) { showToast("请先回答全部 7 个地点；不了解可选“无法判断”"); return; }
      state.validationSubmittedAt = new Date().toISOString();
      state.validationDurationMs = state.validationStartedAt ? Math.max(0, Date.now() - new Date(state.validationStartedAt).getTime()) : null;
      saveState(); renderAll(); goTo("results"); showToast("独立地点判断已锁定，推荐结果现已揭示");
    };
  }

  function renderRecommendations() {
    var rankings = rankedPlaces().slice(0, 5);
    var list = document.getElementById("recommendation-list");
    if (!hasPositivePreference()) {
      list.innerHTML = '<div class="no-recommendation"><span class="section-no">NO RANKING GENERATED</span><h2>未生成地点推荐。</h2><p>你对 9 项刺激均选择了“不符合我的偏好”。系统不会用热门地点或样本频次填补这一空缺。</p><button class="primary-action" type="button" id="retry-elicitation">重新判断偏好 <span>↗</span></button></div>';
      document.getElementById("selection-panel").innerHTML = '<span class="live-indicator"><i></i>结果状态</span><h2>偏好信息不足</h2><p>这不是算法故障，而是预先规定的停止规则。独立地点判断已保留，但不能计算推荐一致性。</p><div class="top-profile"><span>NDCG@3</span><b>不可计算</b></div>';
      document.getElementById("retry-elicitation").addEventListener("click", resetExperience);
      return;
    }
    list.innerHTML = rankings.map(function (entry, index) {
      var place = entry.place;
      var reasons = leadingThemes(place, 2);
      var selected = state.selectedPlaces.indexOf(place.id) !== -1;
      return '<article class="recommendation-card' + (selected ? ' is-selected' : '') + '" data-place="' + place.id + '"><div class="rank">' + String(index + 1).padStart(2, "0") + '</div><div class="place-photo"><img src="' + place.image + '" alt="' + place.name + '"><small>' + escapeHtml(sourceCredit(place.source)) + '</small></div><div class="recommendation-copy"><div class="match-line"><span>相对匹配指数</span><b>' + entry.score + '</b></div><h2>' + place.name + '</h2><p>' + place.subtitle + '</p><div class="reason-tags">' + reasons.map(function (r) { return '<span><i style="--theme:' + r.theme.color + '"></i>' + r.theme.name + '</span>'; }).join("") + '</div></div><div class="recommendation-actions"><button data-detail="' + place.id + '">查看理由</button><button class="pick-button" data-pick="' + place.id + '">' + (selected ? icon("check") + '已选择' : '加入我的三河') + '</button></div></article>';
    }).join("");

    var topThemes = data.themes.map(function (theme) { return { theme: theme, value: preferenceVector()[theme.id] || 0 }; }).sort(function (a, b) { return b.value - a.value; }).slice(0, 3);
    document.getElementById("selection-panel").innerHTML = '<span class="live-indicator"><i></i>结果已生成</span><h2>优先探访意向</h2><p>从前五名中选择最多 3 处最想优先探访的地点；如果没有更多合适地点，可以少选。</p><div class="selected-place-list">' + (state.selectedPlaces.length ? state.selectedPlaces.map(function (id, index) { var p = data.places.find(function (x) { return x.id === id; }); return '<div><span>' + (index + 1) + '</span><b>' + p.name + '</b><button data-pick="' + p.id + '" aria-label="移除' + p.name + '">' + icon("x") + '</button></div>'; }).join("") : '<div class="selection-empty">尚未选择地点</div>') + '</div><div class="top-profile"><span>你的前三项兴趣</span>' + topThemes.map(function (t) { return '<b><i style="--theme:' + t.theme.color + '"></i>' + t.theme.name + '</b>'; }).join("") + '</div><button class="primary-action" id="finish-selection"' + (!state.selectedPlaces.length ? ' disabled' : '') + '>确认选择并评价本次推荐 <span>↗</span></button><button class="quiet-action" data-view="map">先在地图上看位置</button>';

    list.querySelectorAll("[data-detail]").forEach(function (button) { button.addEventListener("click", function () { openDetail(button.dataset.detail); }); });
    document.querySelectorAll("[data-pick]").forEach(function (button) { button.addEventListener("click", function () { togglePlace(button.dataset.pick); }); });
    document.getElementById("selection-panel").querySelector("[data-view=map]").addEventListener("click", function () { goTo("map"); });
    document.getElementById("finish-selection").addEventListener("click", openSurvey);
  }

  function togglePlace(placeId) {
    var exists = state.selectedPlaces.indexOf(placeId);
    if (exists !== -1) state.selectedPlaces.splice(exists, 1);
    else if (state.selectedPlaces.length < 3) state.selectedPlaces.push(placeId);
    else { showToast("最多选择 3 处地点"); return; }
    saveState(); renderRecommendations(); renderMap();
  }

  function renderMap() {
    var rankings = rankedPlaces().slice(0, 5);
    if (!rankings.length) {
      document.getElementById("map-pins").innerHTML = "";
      document.getElementById("map-side").innerHTML = '<div class="map-side-head"><span>推荐落点</span><b>NONE</b></div><div class="map-empty"><h2>没有可映射的推荐</h2><p>全部刺激均被判断为不符合偏好，因此地图不显示热门地点替代结果。</p><button class="quiet-action" data-view="select">返回重新判断</button></div>';
      document.getElementById("map-side").querySelector("[data-view=select]").addEventListener("click", function () { goTo("select"); });
      return;
    }
    document.getElementById("map-pins").innerHTML = rankings.map(function (entry, index) {
      var p = entry.place;
      var selected = state.selectedPlaces.indexOf(p.id) !== -1;
      return '<button class="map-pin' + (selected ? ' is-picked' : '') + '" style="left:' + p.map.x + '%;top:' + p.map.y + '%" data-detail="' + p.id + '" aria-label="查看' + p.name + '"><i>' + (index + 1) + '</i><span>' + p.name + '</span></button>';
    }).join("");
    document.getElementById("map-side").innerHTML = '<div class="map-side-head"><span>推荐落点</span><b>TOP 5</b></div>' + rankings.map(function (entry, index) {
      var selected = state.selectedPlaces.indexOf(entry.place.id) !== -1;
      return '<button data-detail="' + entry.place.id + '" class="map-list-item' + (selected ? ' is-picked' : '') + '"><i>' + (index + 1) + '</i><span><b>' + entry.place.name + '</b><small>' + entry.place.subtitle + '</small></span><em>' + entry.score + '</em></button>';
    }).join("") + '<p class="map-limit">手绘底图适合概念演示，不用于精确导航；正式部署需接入经核验的地图坐标。</p>';
    document.querySelectorAll("#view-map [data-detail]").forEach(function (button) { button.addEventListener("click", function () { openDetail(button.dataset.detail); }); });
  }

  function openDetail(placeId) {
    var place = data.places.find(function (p) { return p.id === placeId; });
    var rank = rankedPlaces().findIndex(function (entry) { return entry.place.id === placeId; }) + 1;
    var reasons = leadingThemes(place, 3);
    state.detailClicks.push({ placeId: placeId, rank: rank, at: new Date().toISOString() });
    saveState();
    document.getElementById("detail-content").innerHTML = '<div class="detail-hero"><img src="' + place.image + '" alt="' + place.name + '"><a class="detail-credit" href="' + escapeHtml(place.source.url) + '" target="_blank" rel="noopener">' + escapeHtml(sourceCredit(place.source)) + ' · ' + escapeHtml(place.source.scope) + '</a><div><span>RECOMMENDATION ' + String(rank).padStart(2, "0") + '</span><h2>' + place.name + '</h2><p>' + place.subtitle + '</p></div></div><div class="detail-body"><div class="detail-main"><h3>为什么推荐给你</h3><div class="reason-grid">' + reasons.map(function (r) { return '<div><i style="--theme:' + r.theme.color + '"></i><b>' + r.theme.name + '</b><span>你的偏好与地点特征重合</span></div>'; }).join("") + '</div><p>' + place.description + '</p><h3>到达后可以怎么体验</h3><ul>' + place.experiences.map(function (item) { return '<li>' + item + '</li>'; }).join("") + '</ul></div><aside><span>现场提示</span><p>' + place.tip + '</p><small>地点提及数来自固定样本文本，不代表实际客流或总体偏好。</small></aside></div>';
    document.getElementById("detail-dialog").showModal();
  }

  function renderSources() {
    function row(item, index, prefix) {
      var source = item.source;
      return '<div class="source-row"><span>' + prefix + String(index + 1).padStart(2, "0") + '</span><div><b>小红书 @' + escapeHtml(source.author) + ' · 图' + source.imageIndex + '</b><p>' + escapeHtml(source.scope + '｜' + source.proof + '｜' + source.permissionStatus) + '</p></div><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener">原笔记 ' + icon("external") + '</a></div>';
    }
    var stimulusRows = data.photoStimuli.map(function (item, index) {
      return row(item, index, "S");
    }).join("");
    var placeRows = data.places.map(function (item, index) {
      return row(item, index, "P");
    }).join("");
    document.getElementById("sources-content").innerHTML = '<div class="evidence-summary"><div><b>134</b><span>固定 note_id</span></div><div><b>09</b><span>偏好刺激</span></div><div><b>07</b><span>地点说明图</span></div></div><p class="evidence-warning">134篇固定样本表未保存图片 URL 或“图片—地点”映射。可追溯图片标为“固定134样本”；为补齐精确地点而另行检索的图片标为“补充定向检索”，不混入134篇文本统计。</p><h3>偏好刺激来源</h3><div class="source-register">' + stimulusRows + '</div><h3 class="source-subhead">地点说明图来源</h3><div class="source-register">' + placeRows + '</div><small class="copyright-note">署名不等于获得授权。当前图片仅作非商业研究原型演示，均标记“待联系作者授权”；公开发表、参赛或长期部署前应取得许可或更换为可授权素材。</small>';
  }

  function renderResearch() {
    var average = state.decisions.length ? Math.round(state.decisions.reduce(function (sum, d) { return sum + d.responseMs; }, 0) / state.decisions.length / 100) / 10 : 0;
    var elapsed = Math.round((Date.now() - new Date(state.startedAt).getTime()) / 1000);
    var ndcg = ndcgAt3();
    var rows = state.decisions.slice().reverse().map(function (d) { return '<div class="log-row"><span>' + d.stimulusId.toUpperCase() + ' · ' + (d.decision === "yes" ? copy.yes : copy.no) + '</span><b>' + (d.responseMs / 1000).toFixed(1) + 's</b></div>'; }).join("");
    var visitLabels = { never: "没有去过", once: "去过 1 次", multiple: "去过 2 次及以上" };
    document.getElementById("research-content").innerHTML = '<div class="session-meta"><span>SESSION</span><b>' + state.sessionId + '</b><em>算法 ' + data.algorithmVersion + '</em></div><div class="background-summary"><span>三河去访经历</span><b>' + escapeHtml(visitLabels[state.background.visitHistory] || "未记录") + '</b><span>当前熟悉度</span><b>' + (state.background.familiarity || "—") + ' / 5</b></div><div class="metric-grid"><div><b>' + state.decisions.length + '</b><span>完成判断</span></div><div><b>' + average + 's</b><span>平均反应</span></div><div><b>' + validationCount() + ' / 7</b><span>独立判断</span></div><div><b>' + (ndcg.valid ? ndcg.value.toFixed(3) : '—') + '</b><span>NDCG@3</span></div><div><b>' + state.detailClicks.length + '</b><span>详情点击</span></div><div><b>' + elapsed + 's</b><span>会话时长</span></div></div><p class="metric-note">NDCG@3 使用有效的独立评分减 1 作为相关性。少于 3 个有效评分、推荐前三中存在“无法判断”、评分无差异或偏好信号不足时，均记为不可计算。</p><div class="research-log">' + (rows || '<p>尚无决策记录</p>') + '</div><div class="dialog-actions"><button id="export-json">' + icon("download") + '导出 JSON</button><button id="export-csv">' + icon("download") + '导出 CSV</button><button class="danger" id="reset-all">' + icon("reset") + '重置本条件</button></div><p class="storage-note">记录仅保存在当前浏览器 localStorage，不上传个人信息。</p>';
    document.getElementById("export-json").addEventListener("click", exportJson);
    document.getElementById("export-csv").addEventListener("click", exportCsv);
    document.getElementById("reset-all").addEventListener("click", function () { if (window.confirm("确定清除本条件的全部本机记录吗？")) resetExperience(); });
  }

  function exportPayload() {
    var ndcg = ndcgAt3();
    return Object.assign({}, state, {
      exportedAt: new Date().toISOString(),
      algorithmVersion: data.algorithmVersion,
      preferenceVector: preferenceVector(),
      preferenceSignal: preferenceSignal(),
      recommendationValid: hasPositivePreference(),
      ranking: rankedPlaces().map(function (entry, index) { return { rank: index + 1, placeId: entry.place.id, score: entry.score }; }),
      validationMetrics: {
        ndcgAt3: ndcg.value,
        validForRanking: ndcg.valid,
        invalidReason: ndcg.reason,
        ratingScale: "1-7",
        relevanceTransform: "rating_minus_1",
        gain: "2^relevance_minus_1",
        discount: "log2_rank_plus_1"
      },
      evidenceScope: data.evidence
    });
  }

  function download(name, content, type) {
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: type }));
    link.download = name; link.click(); URL.revokeObjectURL(link.href);
  }

  function exportJson() {
    download("sanhe-" + condition + "-" + state.sessionId + ".json", JSON.stringify(exportPayload(), null, 2), "application/json");
  }

  function csvCell(value) { return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"'; }

  function exportCsv() {
    var header = ["session_id", "condition", "record_type", "item_id", "pair_id", "value", "response_ms", "rank", "score", "selected", "timestamp"];
    var rows = [
      [state.sessionId, condition, "background", "visit_history", "", state.background.visitHistory, "", "", "", "", state.startedAt],
      [state.sessionId, condition, "background", "familiarity_1_5", "", state.background.familiarity, "", "", "", "", state.startedAt]
    ].concat(state.decisions.map(function (d) { return [state.sessionId, condition, "elicitation_decision", d.stimulusId, d.pairId, d.decision, d.responseMs, "", "", "", d.at]; }));
    data.places.forEach(function (place) {
      if (isValidationResponse(state.independentRatings[place.id])) rows.push([state.sessionId, condition, "independent_place_judgement", place.id, "", state.independentRatings[place.id], "", "", "", "", state.validationSubmittedAt || ""]);
    });
    rankedPlaces().forEach(function (entry, index) {
      rows.push([state.sessionId, condition, "recommendation", entry.place.id, "", "", "", index + 1, entry.score, state.selectedPlaces.indexOf(entry.place.id) !== -1 ? 1 : 0, state.validationSubmittedAt || ""]);
    });
    state.detailClicks.forEach(function (click) {
      rows.push([state.sessionId, condition, "detail_click", click.placeId, "", 1, "", click.rank, "", "", click.at]);
    });
    state.selectedPlaces.forEach(function (placeId, index) {
      rows.push([state.sessionId, condition, "final_selection", placeId, "", 1, "", index + 1, "", 1, state.survey ? state.survey.submittedAt : ""]);
    });
    if (state.survey) ["fit", "confidence", "ease", "explore"].forEach(function (key) {
      rows.push([state.sessionId, condition, "survey", key, "", state.survey[key], "", "", "", "", state.survey.submittedAt]);
    });
    var ndcg = ndcgAt3();
    rows.push([state.sessionId, condition, "metric", "ndcg_at_3", "", ndcg.value == null ? "" : ndcg.value, state.validationDurationMs == null ? "" : state.validationDurationMs, "", "", ndcg.valid ? 1 : 0, state.validationSubmittedAt || ""]);
    download("sanhe-" + condition + "-" + state.sessionId + ".csv", "\ufeff" + [header].concat(rows).map(function (row) { return row.map(csvCell).join(","); }).join("\n"), "text/csv;charset=utf-8");
  }

  function openSurvey() {
    var questions = [
      { id: "fit", text: "推荐地点与我当前表达的旅行偏好相符" },
      { id: "confidence", text: "我对最终地点选择有信心" },
      { id: "ease", text: "表达偏好的过程轻松、清楚" },
      { id: "explore", text: "我愿意继续了解或实际探访这些地点" }
    ];
    document.getElementById("survey-form").innerHTML = questions.map(function (q, qi) {
      return '<fieldset><legend><i>' + (qi + 1) + '</i>' + q.text + '</legend><div class="likert"><span>非常不同意</span>' + [1,2,3,4,5,6,7].map(function (n) { var checked = state.survey && Number(state.survey[q.id]) === n; return '<label><input type="radio" name="' + q.id + '" value="' + n + '"' + (checked ? ' checked' : '') + ' required><b>' + n + '</b></label>'; }).join("") + '<span>非常同意</span></div></fieldset>';
    }).join("") + '<button class="primary-action" type="submit">保存本次评价 <span>↗</span></button>';
    document.getElementById("survey-form").onsubmit = function (event) {
      event.preventDefault(); var form = new FormData(event.target); state.survey = { fit: Number(form.get("fit")), confidence: Number(form.get("confidence")), ease: Number(form.get("ease")), explore: Number(form.get("explore")), submittedAt: new Date().toISOString() }; saveState(); document.getElementById("survey-dialog").close(); showToast("评价已保存在本机研究记录中");
    };
    document.getElementById("survey-dialog").showModal();
  }

  function resetExperience() {
    localStorage.removeItem(storageKey);
    state = freshState(); saveState();
    document.querySelectorAll("dialog[open]").forEach(function (d) { d.close(); });
    document.getElementById("onboarding").classList.remove("is-hidden");
    goTo("select"); renderAll(); showToast("本条件已重新开始");
  }

  function goTo(view) {
    if (view === "validation" && state.current < stimuli.length) { showToast("完成 9 项判断后即可进入独立地点判断"); return; }
    if ((view === "results" || view === "map") && !state.validationSubmittedAt) { showToast("请先完成并锁定 7 个地点的独立判断"); return; }
    if (view === "validation" && !state.validationStartedAt) {
      state.validationStartedAt = new Date().toISOString();
    }
    state.currentView = view; saveState();
    document.querySelectorAll(".exp-view").forEach(function (node) { node.classList.toggle("is-active", node.id === "view-" + view); });
    document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("is-active", button.dataset.view === view); });
    if (view === "validation") renderValidation();
    if (view === "results") renderRecommendations();
    if (view === "map") renderMap();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message) {
    var toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("is-visible");
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2400);
  }

  function renderAll() {
    renderStimulusCards(); renderProfile(); renderValidation(); renderRecommendations(); renderMap(); renderResearch();
    document.getElementById("validation-nav").classList.toggle("is-locked", state.current < stimuli.length);
    document.getElementById("results-nav").classList.toggle("is-locked", !state.validationSubmittedAt);
    document.getElementById("map-nav").classList.toggle("is-locked", !state.validationSubmittedAt);
  }

  document.getElementById("background-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var form = new FormData(event.currentTarget);
    state.background = { visitHistory: form.get("visit-history"), familiarity: Number(form.get("familiarity")) };
    if (!state.background.visitHistory || !(state.background.familiarity >= 1)) { showToast("请先记录去访经历和熟悉度"); return; }
    state.onboardingSeen = true; state.cardStartedAt = Date.now(); saveState(); document.getElementById("onboarding").classList.add("is-hidden");
  });
  document.getElementById("yes-button").addEventListener("click", function () { decide("yes"); });
  document.getElementById("no-button").addEventListener("click", function () { decide("no"); });
  document.getElementById("undo-button").addEventListener("click", undo);
  document.querySelectorAll("[data-view]").forEach(function (button) { button.addEventListener("click", function () { goTo(button.dataset.view); }); });
  document.querySelectorAll("[data-dialog]").forEach(function (button) { button.addEventListener("click", function () { if (button.dataset.dialog === "research-dialog") renderResearch(); document.getElementById(button.dataset.dialog).showModal(); }); });
  document.querySelectorAll("[data-close]").forEach(function (button) { button.addEventListener("click", function () { document.getElementById(button.dataset.close).close(); }); });
  document.querySelectorAll("dialog").forEach(function (dialog) { dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); }); });
  document.addEventListener("keydown", function (event) {
    if (document.querySelector("dialog[open]") || state.currentView !== "select" || state.current >= stimuli.length) return;
    if (event.key === "ArrowLeft") decide("no");
    if (event.key === "ArrowRight") decide("yes");
  });

  renderOnboardingPreview();
  renderSources();
  renderAll();
  if (state.currentView !== "select" && state.current >= stimuli.length) goTo(state.currentView);
})();
