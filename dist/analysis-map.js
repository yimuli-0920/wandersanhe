(function () {
  "use strict";

  var COLORS = {
    "水岸与桥梁": "#2a9d8f",
    "名人故居与文化": "#d97736",
    "古街巷": "#7b6ba8",
    "地标与服务": "#d4a72c"
  };
  var state = { category: "全部", minCount: 1, verifiedOnly: false, mode: "bubble" };
  var map, markerLayer, heatLayer, data;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
  }

  function percentage(value) { return (value * 100).toFixed(1) + "%"; }
  function filteredPois() {
    return data.pois.filter(function (poi) {
      return (state.category === "全部" || poi.category === state.category) && poi.note_count >= state.minCount && (!state.verifiedOnly || poi.precision === "exact");
    });
  }

  function renderCategoryChips() {
    var host = document.getElementById("category-chips");
    host.innerHTML = data.categories.map(function (category) {
      return '<button type="button" class="' + (state.category === category ? "is-active" : "") + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    }).join("");
    host.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () { state.category = button.dataset.category; renderCategoryChips(); renderMap(); renderRanking(); });
    });
  }

  function markerStyle(poi) {
    var exact = poi.precision === "exact";
    return {
      radius: 5 + Math.sqrt(poi.note_count) * 4.8,
      color: exact ? "#153933" : COLORS[poi.category],
      weight: exact ? 1.8 : 2.4,
      dashArray: exact ? null : "4 3",
      fillColor: COLORS[poi.category],
      fillOpacity: exact ? 0.82 : 0.43,
      opacity: 0.95
    };
  }

  function selectPoi(poi, marker) {
    renderDetail(poi);
    if (marker && state.mode === "bubble") marker.openTooltip();
  }

  function renderMap() {
    var pois = filteredPois();
    markerLayer.clearLayers();
    if (heatLayer) { map.removeLayer(heatLayer); heatLayer = null; }

    pois.forEach(function (poi) {
      var marker = L.circleMarker([poi.lat, poi.lng], markerStyle(poi));
      marker.bindTooltip('<b>' + escapeHtml(poi.name) + '</b><br><span>' + poi.note_count + ' 篇笔记</span>', { className: "poi-tooltip", direction: "top", offset: [0, -8] });
      marker.on("click", function () { selectPoi(poi, marker); });
      if (state.mode === "heat") marker.setStyle({ radius: 5, fillOpacity: 0.16, opacity: 0.35, weight: 1 });
      marker.addTo(markerLayer);
    });

    if (state.mode === "heat" && window.L.heatLayer) {
      heatLayer = L.heatLayer(pois.map(function (p) { return [p.lat, p.lng, p.note_count / 8]; }), {
        radius: 38, blur: 29, minOpacity: 0.35, maxZoom: 18,
        gradient: { 0.15: "#cae7df", 0.4: "#64bbae", 0.68: "#d8b046", 1: "#d26634" }
      }).addTo(map);
      heatLayer.bringToBack && heatLayer.bringToBack();
    }
    document.getElementById("visible-count").textContent = pois.length;
    if (pois.length) {
      var bounds = L.latLngBounds(pois.map(function (p) { return [p.lat, p.lng]; }));
      map.fitBounds(bounds.pad(0.12), { maxZoom: 17, animate: true });
    }
  }

  function renderDetail(poi) {
    var color = COLORS[poi.category];
    var examples = poi.examples.map(function (item) {
      return '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener"><b>' + escapeHtml(item.title) + '</b><span>@' + escapeHtml(item.author) + ' · 查看原笔记 ↗</span></a>';
    }).join("");
    var precisionTitle = poi.precision === "exact" ? "核验点位" : "代表／近似点";
    document.getElementById("detail-panel").innerHTML =
      '<div><span class="detail-kicker">PLACE EVIDENCE</span><h2>' + escapeHtml(poi.name) + '</h2>' +
      '<div class="detail-category" style="--cat:' + color + '"><i></i>' + escapeHtml(poi.category) + '</div></div>' +
      '<div class="detail-metrics"><div><b>' + poi.note_count + '</b><span>去重笔记数</span></div><div><b>' + poi.author_count + '</b><span>去重作者数</span></div><div><b>' + percentage(poi.visitor_share) + '</b><span>访客样本占比 ÷86</span></div><div><b>' + percentage(poi.fixed_share) + '</b><span>固定样本占比 ÷134</span></div></div>' +
      '<div class="precision-badge ' + (poi.precision === "exact" ? "" : "is-approx") + '"><b>' + precisionTitle + '</b>' + escapeHtml(poi.coordinate_status) + '<br>' + poi.lat.toFixed(6) + ', ' + poi.lng.toFixed(6) + '</div>' +
      '<h3>代表性原笔记</h3><div class="evidence-list">' + examples + '</div>' +
      '<a class="source-link" href="' + escapeHtml(poi.coordinate_url) + '" target="_blank" rel="noopener">坐标来源：' + escapeHtml(poi.coordinate_source) + ' ↗</a>' +
      '<div class="missing-photo">地点照片数：不可计算。源数据没有逐张照片到地点的归属关系。</div>';
  }

  function renderRanking() {
    var pois = filteredPois();
    var host = document.getElementById("ranking-table");
    host.innerHTML = '<div class="rank-row header"><span>序号</span><span>地点</span><span>类别</span><span>相对频次</span><span>笔记数</span><span>坐标状态</span></div>' + pois.map(function (poi, index) {
      return '<div class="rank-row"><span class="rank">' + String(index + 1).padStart(2, "0") + '</span><span class="place">' + escapeHtml(poi.name) + '</span><span>' + escapeHtml(poi.category) + '</span><span class="bar"><i style="--width:' + (poi.note_count / 8 * 100) + '%;--color:' + COLORS[poi.category] + '"></i></span><span class="count">' + poi.note_count + ' 篇</span><span class="status">' + (poi.precision === "exact" ? "核验点位" : "代表／近似") + '</span></div>';
    }).join("");
  }

  function bindControls() {
    var slider = document.getElementById("min-count");
    slider.addEventListener("input", function () {
      state.minCount = Number(slider.value);
      document.getElementById("min-count-value").textContent = state.minCount + " 篇";
      renderMap(); renderRanking();
    });
    document.getElementById("verified-only").addEventListener("change", function (event) { state.verifiedOnly = event.target.checked; renderMap(); renderRanking(); });
    document.querySelectorAll("[data-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.mode = button.dataset.mode;
        document.querySelectorAll("[data-mode]").forEach(function (b) { b.classList.toggle("is-active", b === button); });
        renderMap();
      });
    });
    document.getElementById("reset-view").addEventListener("click", function () {
      state = { category: "全部", minCount: 1, verifiedOnly: false, mode: "bubble" };
      slider.value = 1; document.getElementById("min-count-value").textContent = "1 篇"; document.getElementById("verified-only").checked = false;
      document.querySelectorAll("[data-mode]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.mode === "bubble"); });
      renderCategoryChips(); renderMap(); renderRanking(); renderDetail(data.pois[0]);
    });
  }

  function initialize(payload) {
    data = payload;
    map = L.map("analysis-map", { zoomControl: true, preferCanvas: true, minZoom: 14, maxZoom: 19 }).setView([31.5132, 117.2391], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    renderCategoryChips(); bindControls(); renderMap(); renderRanking(); renderDetail(data.pois[0]);
  }

  fetch("./map-data.json?v=20261005").then(function (response) {
    if (!response.ok) throw new Error("地图数据读取失败");
    return response.json();
  }).then(initialize).catch(function (error) {
    document.getElementById("detail-panel").innerHTML = '<div class="detail-empty">' + escapeHtml(error.message) + '，请刷新页面重试。</div>';
  });
})();
