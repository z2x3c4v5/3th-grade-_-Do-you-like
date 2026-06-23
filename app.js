/* =========================================================
 * 3학년 영어 · Do you like ~ ? · 묻고 답하기 웹 앱
 * - 음성 출력 : Web Speech API (SpeechSynthesis)
 * - 단어 클릭 : 발음 + 뜻 풍선
 * - 묻고 답하기 / 내 문장 연습(⭐로 담은 문장 녹음·정확도)
 * ========================================================= */

/* ---------- 음성 합성 (TTS) ---------- */
const synth = window.speechSynthesis;
let enVoice = null;
let speakRate = 0.85;

function pickVoice() {
  const voices = synth.getVoices();
  enVoice =
    voices.find(v => /en[-_]US/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null;
  const status = document.querySelector(".toolbar #voice-status");
  if (status) status.textContent = enVoice ? `음성: ${enVoice.name}` : "영어 음성을 찾는 중...";
}
pickVoice();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

function speak(text, rate, onStart, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate || speakRate;
  u.pitch = 1.08;
  if (enVoice) u.voice = enVoice;
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
}

/* ---------- 단어 뜻 풍선 ---------- */
const popup = document.createElement("div");
popup.className = "word-popup hidden";
popup.innerHTML = `
  <div class="wp-word"></div>
  <div class="wp-meaning"></div>
  <button class="wp-listen">단어 다시 듣기</button>`;
document.body.appendChild(popup);

popup.querySelector(".wp-listen").addEventListener("click", e => {
  e.stopPropagation();
  if (popup.dataset.word) speak(popup.dataset.word, 0.8);
});

function showWordPopup(wordEl, rawWord) {
  const key = wordKey(rawWord);
  const meaning = WORD_MEANINGS[key] || "(뜻 정보 없음)";
  popup.dataset.word = key || rawWord;
  popup.querySelector(".wp-word").textContent = rawWord.replace(/[.,!?]+$/, "");
  popup.querySelector(".wp-meaning").textContent = meaning;

  popup.classList.remove("hidden");
  const r = wordEl.getBoundingClientRect();
  const pw = popup.offsetWidth;
  let left = r.left + r.width / 2 - pw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  popup.style.left = left + "px";
  popup.style.top = r.bottom + 8 + window.scrollY + "px";

  speak(key || rawWord, 0.8);
}
function hidePopup() { popup.classList.add("hidden"); }
document.addEventListener("click", e => {
  if (!popup.contains(e.target) && !e.target.classList.contains("word")) hidePopup();
});

/* ---------- 클릭 가능한 단어로 문장 만들기 ---------- */
function buildWords(sentence) {
  const frag = document.createDocumentFragment();
  sentence.split(/\s+/).forEach((w, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    span.addEventListener("click", e => { e.stopPropagation(); showWordPopup(span, w); });
    frag.appendChild(span);
  });
  return frag;
}

/* ---------- 그림(이모지) ---------- */
/* 카드 그림(visual) 요소 만들기 : 이모지로 크고 또렷하게 */
function makeVisual(item, cls) {
  cls = cls || {};
  const em = document.createElement("div");
  em.className = cls.emoji || "emoji";
  em.textContent = item.emoji;
  return em;
}

/* =========================================================
 * 연습 목록 (⭐로 담은 문장)  ※ 참고 페이지와 같은 방식
 * ========================================================= */
let selected = new Map();
try { (JSON.parse(localStorage.getItem("dyl_selected") || "[]") || []).forEach(it => selected.set(it.en, it)); } catch (e) {}
function persistSelected() { try { localStorage.setItem("dyl_selected", JSON.stringify([...selected.values()])); } catch (e) {} }
function isSelected(en) { return selected.has(en); }
function toggleSelect(item) {
  if (selected.has(item.en)) selected.delete(item.en);
  else selected.set(item.en, { en: item.en, ko: item.ko, emoji: item.emoji, img: item.img, word: item.word });
  persistSelected();
  updatePracticeBadge();
  renderQA();
  if (document.getElementById("tab-practice").classList.contains("active")) renderPractice();
}
function updatePracticeBadge() {
  const c = document.getElementById("practice-count");
  if (c) c.textContent = selected.size;
}

/* =========================================================
 * 1) 묻고 답하기
 * ========================================================= */
let qaCat = "food";

function makeQACard(item, tone) {
  const div = document.createElement("div");
  div.className = "card tone-" + (tone % 6);

  function speakQ() {
    speak(item.q, null, () => div.classList.add("speaking"), () => div.classList.remove("speaking"));
  }

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = item.ko;
  top.append(tag);

  const visual = makeVisual(item);

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.q));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.qko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "질문 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => { e.stopPropagation(); speakQ(); });
  box.append(txt, speakBtn);

  const ansRow = document.createElement("div");
  ansRow.className = "answer-row";
  ["yes", "no"].forEach(kind => {
    const a = ANSWERS[kind];
    const btn = document.createElement("button");
    btn.className = "ans-btn " + kind;
    btn.innerHTML = `${a.emoji} ${a.en}<span class="ans-ko">${a.ko}</span>`;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      ansRow.querySelectorAll(".ans-btn").forEach(b => b.classList.remove("chosen"));
      btn.classList.add("chosen");
      speak(a.en);
    });
    ansRow.appendChild(btn);
  });

  // ⭐ 연습 목록에 담기 (질문 문장)
  const practiceItem = { en: item.q, ko: item.qko, emoji: item.emoji, img: item.img, word: item.word };
  const sel = document.createElement("button");
  sel.className = "select-btn";
  const on = isSelected(item.q);
  sel.classList.toggle("on", on);
  sel.textContent = on ? "✓ 연습 목록에 있음" : "⭐ 연습 목록에 추가";
  sel.addEventListener("click", e => { e.stopPropagation(); toggleSelect(practiceItem); });

  div.append(top, visual, box, ansRow, sel);
  return div;
}

function renderQA() {
  const grid = document.getElementById("qa-grid");
  grid.innerHTML = "";
  const list = ITEMS[qaCat];
  document.getElementById("qa-count").textContent = list.length + "개";
  list.forEach((it, i) => grid.appendChild(makeQACard(it, i)));
}

/* =========================================================
 * 2) 내 문장 연습 (마이크 정확도)
 * ========================================================= */
let stats = {};
try { stats = JSON.parse(localStorage.getItem("dyl_stats") || "{}") || {}; } catch (e) {}
function saveStats() { try { localStorage.setItem("dyl_stats", JSON.stringify(stats)); } catch (e) {} }

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const srSupported = !!SR;
let rec = srSupported ? new SR() : null;
if (rec) { rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; }
let recBusy = false;

function normalize(s) { return s.toLowerCase().replace(/[^a-z\s']/g, "").replace(/\s+/g, " ").trim(); }
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordsClose(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  return Math.abs(a.length - b.length) <= 1 && levenshtein(a, b) <= 1;
}
const STOPWORDS = new Set(["a", "an", "the", "to", "of", "on", "in", "at", "for", "but", "i"]);
function scoreMatch(target, heard) {
  const t = normalize(target).split(" ").filter(Boolean);
  const h = normalize(heard).split(" ").filter(Boolean);
  let content = t.filter(w => !STOPWORDS.has(w));
  if (!content.length) content = t;
  let hit = 0;
  content.forEach(w => { if (h.some(x => wordsClose(x, w))) hit++; });
  let score = hit / content.length;
  if (score >= 0.5) score = Math.min(1, score + 0.12);
  return score;
}
function practiceAttempt(target, cb) {
  if (!rec || recBusy) { cb.onend && cb.onend(); return; }
  recBusy = true;
  let score = 0, heard = "", errCode = null;
  rec.onresult = e => {
    const alts = e.results[0];
    for (let i = 0; i < alts.length; i++) {
      const s = scoreMatch(target, alts[i].transcript);
      if (s > score) { score = s; heard = alts[i].transcript; }
    }
  };
  rec.onerror = ev => { errCode = ev.error; };
  rec.onend = () => {
    recBusy = false;
    if (errCode && score === 0) cb.onerror && cb.onerror(errCode);
    else cb.onresult && cb.onresult(Math.round(score * 100), heard);
    cb.onend && cb.onend();
  };
  try { rec.start(); } catch (e) { recBusy = false; cb.onend && cb.onend(); }
}

function makePracticeCard(item) {
  const div = document.createElement("div");
  div.className = "card pcard";

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = item.word || "";
  const remove = document.createElement("button");
  remove.className = "premove";
  remove.setAttribute("aria-label", "목록에서 빼기");
  remove.textContent = "✕";
  remove.addEventListener("click", () => {
    selected.delete(item.en);
    persistSelected();
    updatePracticeBadge();
    renderPractice();
    renderQA();
  });
  top.append(tag, remove);

  const visual = makeVisual(item);

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", () => speak(item.en));
  box.append(txt, speakBtn);

  const micArea = document.createElement("div");
  micArea.className = "mic-area";
  const mic = document.createElement("button");
  mic.className = "mic-btn";
  mic.setAttribute("aria-label", "말하기");
  mic.textContent = "🎙️";
  const micLabel = document.createElement("div");
  micLabel.className = "mic-label";
  micLabel.textContent = "마이크를 누르고 말해보세요";
  micArea.append(mic, micLabel);

  const statsEl = document.createElement("div");
  statsEl.className = "pstats";
  const fb = document.createElement("div");
  fb.className = "mic-feedback";

  function renderStats(last) {
    const s = stats[item.en] || { attempts: 0, best: 0 };
    statsEl.innerHTML =
      `정확도 <b class="acc">${last != null ? last + "%" : "--"}</b>` +
      ` · 최고 <b class="best">${s.best ? s.best + "%" : "--"}</b>` +
      ` · 연습 <b>${s.attempts}</b>회`;
  }
  renderStats(null);

  if (!srSupported) { mic.disabled = true; mic.title = "이 브라우저는 음성 인식을 지원하지 않아요 (크롬 권장)"; }

  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording");
    micLabel.textContent = "🔴 녹음 중... 말해보세요";
    fb.textContent = "또박또박 말해보세요!";
    fb.className = "mic-feedback";
    practiceAttempt(item.en, {
      onresult: (score, heard) => {
        const s = stats[item.en] || { attempts: 0, best: 0 };
        s.attempts++; s.best = Math.max(s.best, score);
        stats[item.en] = s; saveStats();
        renderStats(score);
        if (score >= 70) { fb.className = "mic-feedback good"; fb.innerHTML = `⭐ 훌륭해요! (${score}%)<br><span class="heard">내 발음: ${heard}</span>`; }
        else if (score >= 40) { fb.className = "mic-feedback good"; fb.innerHTML = `👍 좋아요! 한 번 더! (${score}%)<br><span class="heard">내 발음: ${heard}</span>`; }
        else { fb.className = "mic-feedback bad"; fb.innerHTML = `🔁 다시 또박또박! (${score}%)<br><span class="heard">내 발음: ${heard || "(못 들었어요)"}</span>`; }
      },
      onerror: err => {
        fb.className = "mic-feedback bad";
        fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요.";
      },
      onend: () => { mic.classList.remove("recording"); micLabel.textContent = "마이크를 누르고 말해보세요"; }
    });
  });

  div.append(top, visual, box, micArea, statsEl, fb);
  return div;
}

function renderPractice() {
  const list = document.getElementById("practice-list");
  const empty = document.getElementById("practice-empty");
  const items = [...selected.values()];
  if (!items.length) {
    empty.style.display = "block";
    list.innerHTML = "";
    updatePracticeBadge();
    return;
  }
  empty.style.display = "none";
  list.innerHTML = "";
  items.forEach(it => list.appendChild(makePracticeCard(it)));
  updatePracticeBadge();
}

/* =========================================================
 * 주제(카테고리) 버튼 만들기
 * ========================================================= */
function buildCatButtons(containerId, current, onPick) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = "";
  CATEGORIES.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (c.key === current() ? " active" : "");
    btn.textContent = c.label;
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      synth.cancel(); hidePopup();
      onPick(c.key);
    });
    wrap.appendChild(btn);
  });
}

buildCatButtons("qa-cats", () => qaCat, k => { qaCat = k; renderQA(); });

/* ---------- 말하기 속도 ---------- */
document.getElementById("rate").addEventListener("input", e => { speakRate = parseFloat(e.target.value); });

/* ---------- 탭 전환 ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById("tab-" + tab).classList.add("active");
    synth.cancel(); hidePopup();
    if (tab === "practice") renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 첫 화면 ---------- */
renderQA();
updatePracticeBadge();
