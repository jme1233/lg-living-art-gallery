/* ES5 only. No modules, fetch, promises, grid, object-fit or framework. */
(function () {
  'use strict';
  var allPieces = window.GALLERY_ARTWORK || [];
  var pieces = [];
  var category = document.getElementById('category');
  var categoryNames = {'classical': 'Classical paintings', 'nature': 'Nature photography', 'dark': 'Dark gallery', 'abstract': 'Abstract / modern'};
  var selectedCategory = 'classical';
  var art = document.getElementById('art');
  var controls = document.getElementById('controls');
  var message = document.getElementById('message');
  var status = document.getElementById('status');
  var interval = document.getElementById('interval');
  var toggle = document.getElementById('toggle');
  var index = -1, target = 0, paused = false, loading = false;
  var rotationTimer = null, hideTimer = null, loadTimer = null;
  var request = 0, width = 0, height = 0, diagnosticOpen = false;
  var ms = 30000, note = '', failed = {}, failureCount = 0;

  function clearRotation() { window.clearTimeout(rotationTimer); rotationTimer = null; }
  function renderStatus() {
    status.textContent = categoryNames[selectedCategory] + ' · ' + (index < 0 ? 'Opening collection' : 'Artwork ' + (index + 1) + ' of ' + pieces.length) + ' · ' + (paused ? 'Paused' : 'Rotating') + ' · ' + (ms / 1000) + ' seconds' + (loading ? ' · Loading' : '') + (note ? ' · ' + note : '');
  }
  function fit() {
    if (!width || !height) { return; }
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var scale = Math.min(vw / width, vh / height);
    var w = Math.round(width * scale), h = Math.round(height * scale);
    art.style.width = w + 'px'; art.style.height = h + 'px';
    art.style.left = Math.round((vw - w) / 2) + 'px';
    art.style.top = Math.round((vh - h) / 2) + 'px';
  }
  function schedule() {
    clearRotation();
    if (!paused && !loading && index >= 0 && pieces.length > 1) {
      rotationTimer = window.setTimeout(function () { show((index + 1) % pieces.length); }, ms);
    }
    renderStatus();
  }
  function showControls() {
    controls.style.display = 'block';
    window.clearTimeout(hideTimer);
    if (!diagnosticOpen) { hideTimer = window.setTimeout(hideControls, 12000); }
  }
  function hideControls() {
    var focused = document.activeElement;
    if (focused && controls.contains(focused) && focused.blur) { focused.blur(); }
    controls.style.display = 'none'; window.clearTimeout(hideTimer);
  }
  function show(n) {
    if (!pieces.length) { message.textContent = 'No artwork configured. Add entries to artwork.js.'; return; }
    n = (n + pieces.length) % pieces.length;
    clearRotation(); window.clearTimeout(loadTimer);
    var token = ++request;
    var image = new Image();
    target = n; loading = true; note = '';
    if (index < 0) { message.style.display = 'block'; message.textContent = 'Loading artwork…'; }
    renderStatus();
    function failedLoad() {
      if (token !== request || !loading) { return; }
      window.clearTimeout(loadTimer); loading = false;
      if (!failed[n]) { failed[n] = true; failureCount++; }
      if (failureCount >= pieces.length) {
        paused = true; toggle.textContent = 'Resume'; note = 'Images could not load; check artwork paths and reload';
        message.style.display = 'block'; message.textContent = 'Artwork could not load. Check the connection and artwork paths, then reload.';
        showControls(); renderStatus(); return;
      }
      note = 'Skipped artwork that could not load'; renderStatus();
      rotationTimer = window.setTimeout(function () { show((n + 1) % pieces.length); }, 1000);
    }
    image.onload = function () {
      if (token !== request || !loading) { return; }
      window.clearTimeout(loadTimer);
      if (!image.naturalWidth || !image.naturalHeight) { failedLoad(); return; }
      width = image.naturalWidth; height = image.naturalHeight;
      art.src = image.src; art.alt = pieces[n].title || 'Artwork';
      art.style.display = 'block'; fit();
      index = n; loading = false; failed = {}; failureCount = 0;
      document.getElementById('title').textContent = pieces[n].title || 'Untitled';
      document.getElementById('artist').textContent = pieces[n].artist || '';
      message.style.display = 'none'; schedule();
    };
    image.onerror = failedLoad;
    loadTimer = window.setTimeout(failedLoad, 20000);
    image.src = pieces[n].src;
  }
  function step(delta) { show((loading ? target : index < 0 ? 0 : index) + delta); }
  function pause() { paused = !paused; toggle.textContent = paused ? 'Resume' : 'Pause'; schedule(); showControls(); }
  function selectCategory(value) {
    selectedCategory = categoryNames[value] ? value : 'classical';
    pieces = [];
    var i;
    for (i = 0; i < allPieces.length; i++) {
      if ((allPieces[i].category || 'classical') === selectedCategory) { pieces.push(allPieces[i]); }
    }
    category.value = selectedCategory;
    clearRotation(); window.clearTimeout(loadTimer);
    request++; index = -1; target = 0; loading = false; failed = {}; failureCount = 0;
    art.style.display = 'none'; width = 0; height = 0;
    document.getElementById('title').textContent = categoryNames[selectedCategory];
    document.getElementById('artist').textContent = '';
    showControls(); show(0);
  }
  category.onchange = function () {
    selectCategory(category.value);
    try { window.localStorage.setItem('living-art-category', selectedCategory); } catch (ignore) {}
  };
  function persist() { try { window.localStorage.setItem('living-art-interval', String(ms)); } catch (ignore) {} }
  function fullScreen() {
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!fn) { note = 'Use the browser menu’s full-screen control'; renderStatus(); showControls(); return; }
    try {
      var result = fn.call(el);
      if (result && typeof result['catch'] === 'function') {
        result['catch'](function () { note = 'Use the browser menu’s full-screen control'; renderStatus(); showControls(); });
      }
    } catch (ignore) { note = 'Use the browser menu’s full-screen control'; renderStatus(); }
  }
  document.getElementById('prev').onclick = function () { step(-1); };
  document.getElementById('next').onclick = function () { step(1); };
  toggle.onclick = pause;
  interval.onchange = function () { ms = parseInt(interval.value, 10); persist(); schedule(); showControls(); };
  document.getElementById('fullscreen').onclick = fullScreen;
  document.getElementById('hide').onclick = hideControls;
  document.getElementById('stage').onclick = showControls;
  controls.onmousedown = showControls;
  document.getElementById('diagnostics').onclick = function () {
    diagnosticOpen = !diagnosticOpen;
    this.setAttribute('aria-expanded', String(diagnosticOpen));
    document.getElementById('diagnostic-panel').style.display = diagnosticOpen ? 'block' : 'none';
    document.getElementById('diagnostic-text').textContent = 'Prototype 01 · ' + document.documentElement.clientWidth + ' × ' + document.documentElement.clientHeight + ' CSS pixels · Loaded JPEG: ' + width + ' × ' + height + ' · Browser: ' + navigator.userAgent;
    showControls();
  };
  document.onkeydown = function (event) {
    event = event || window.event;
    var code = event.keyCode || event.which;
    var tag = event.target && event.target.tagName;
    if (tag === 'SELECT' || tag === 'BUTTON') {
      if (code === 27 || code === 461) { showControls(); }
      return;
    }
    if (code === 37) { step(-1); }
    else if (code === 39) { step(1); }
    else if (code === 32) { pause(); }
    else if (code === 13 || code === 27 || code === 461) { showControls(); }
    else { return; }
    if (event.preventDefault) { event.preventDefault(); }
  };
  window.onresize = fit;
  try {
    var saved = window.localStorage.getItem('living-art-interval');
    var j;
    for (j = 0; j < interval.options.length; j++) {
      if (saved === interval.options[j].value) { interval.value = saved; ms = parseInt(saved, 10); }
    }
  } catch (ignore) {}
  try { selectedCategory = window.localStorage.getItem('living-art-category') || 'classical'; } catch (ignore) {}
  selectCategory(selectedCategory);
}());
