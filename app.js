/* =========================================================
 * 3학년 영어 · Do you like ~ ? · 묻고 답하기 웹 앱
 * - 음성 출력 : Web Speech API (SpeechSynthesis)
 * - 단어 클릭 : 발음 + 뜻 풍선
 * - 묻고 답하기 / 좋아함 서베이 / 듣고 맞히기 / 말하기 연습
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

/* ---------- 실사 이미지 ---------- */
let imageMode = true; // true: 사진, false: 이모지
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 100000;
}
function imageUrl(prompt) {
  const p = encodeURIComponent("a bright, friendly, realistic photo of " + prompt + ", for kids");
  return `https://image.pollinations.ai/prompt/${p}?width=400&height=260&nologo=true&seed=${hashSeed(prompt)}`;
}

/* 카드/선택지의 그림(visual) 요소 만들기
 * 우선순위: 색깔(swatch) > 사진(img, 사진모드) > 이모지 */
function makeVisual(item, cls) {
  cls = cls || {};
  if (item.swatch) {
    const sw = document.createElement("div");
    sw.className = cls.swatch || "swatch";
    sw.style.background = item.swatch;
    return sw;
  }
  if (imageMode && item.img) {
    const img = document.createElement("img");
    img.className = cls.photo || "photo";
    img.loading = "lazy";
    img.alt = item.word || item.en;
    img.src = imageUrl(item.img);
    img.addEventListener("error", () => {
      const em = document.createElement("div");
      em.className = cls.emoji || "emoji";
      em.textContent = item.emoji;
      img.replaceWith(em);
    });
    return img;
  }
  const em = document.createElement("div");
  em.className = cls.emoji || "emoji";
  em.textContent = item.emoji;
  return em;
}

/* 카테고리 라벨 찾기 */
function catLabel(key) {
  const c = CATEGORIES.find(c => c.key === key);
  return c ? c.label : key;
}
/* 전체 아이템(카테고리 표시 포함) 평탄화 */
function allItems() {
  const out = [];
  CATEGORIES.forEach(c => ITEMS[c.key].forEach(it => out.push(Object.assign({ cat: c.key }, it))));
  return out;
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
  const listen = document.createElement("button");
  listen.className = "listen-all";
  listen.textContent = "듣기 ▶";
  listen.addEventListener("click", e => { e.stopPropagation(); speakQ(); });
  top.append(tag, listen);

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

  div.append(top, visual, box, ansRow);
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
 * 2) 좋아함 서베이
 * ========================================================= */
let surveyChoices = {};
try { surveyChoices = JSON.parse(localStorage.getItem("dyl_survey") || "{}") || {}; } catch (e) {}
function surveyKey(it) { return it.cat + "/" + it.en; }
function saveSurvey() { try { localStorage.setItem("dyl_survey", JSON.stringify(surveyChoices)); } catch (e) {} }

function renderSurvey() {
  const wrap = document.getElementById("survey-list");
  wrap.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const title = document.createElement("div");
    title.className = "survey-cat-title";
    title.textContent = cat.label;
    wrap.appendChild(title);

    ITEMS[cat.key].forEach(item => {
      const it = Object.assign({ cat: cat.key }, item);
      const key = surveyKey(it);
      const row = document.createElement("div");
      row.className = "survey-row";

      const face = document.createElement("div");
      face.className = "survey-face";
      if (it.swatch) {
        const s = document.createElement("span");
        s.className = "mini-swatch";
        s.style.background = it.swatch;
        face.appendChild(s);
      } else {
        face.textContent = it.emoji;
      }

      const q = document.createElement("div");
      q.className = "survey-q";
      const en = document.createElement("div");
      en.className = "en";
      en.textContent = it.q;
      const ko = document.createElement("div");
      ko.className = "ko";
      ko.textContent = it.qko;
      q.append(en, ko);

      const listen = document.createElement("button");
      listen.className = "survey-listen";
      listen.textContent = "🔊";
      listen.addEventListener("click", () => speak(it.q));

      const pick = document.createElement("div");
      pick.className = "survey-pick";
      const yes = document.createElement("button");
      yes.className = "pick-yes" + (surveyChoices[key] === "yes" ? " on" : "");
      yes.textContent = "👍";
      yes.title = "Yes, I do.";
      const no = document.createElement("button");
      no.className = "pick-no" + (surveyChoices[key] === "no" ? " on" : "");
      no.textContent = "👎";
      no.title = "No, I don't.";
      yes.addEventListener("click", () => {
        surveyChoices[key] = surveyChoices[key] === "yes" ? undefined : "yes";
        if (!surveyChoices[key]) delete surveyChoices[key];
        saveSurvey(); renderSurvey(); updateSurveyResult();
        if (surveyChoices[key] === "yes") speak(ANSWERS.yes.en);
      });
      no.addEventListener("click", () => {
        surveyChoices[key] = surveyChoices[key] === "no" ? undefined : "no";
        if (!surveyChoices[key]) delete surveyChoices[key];
        saveSurvey(); renderSurvey(); updateSurveyResult();
        if (surveyChoices[key] === "no") speak(ANSWERS.no.en);
      });
      pick.append(yes, no);

      row.append(face, q, listen, pick);
      wrap.appendChild(row);
    });
  });
}

function updateSurveyResult() {
  const items = allItems();
  const total = items.length;
  const answered = items.filter(it => surveyChoices[surveyKey(it)]).length;

  // 진행 막대
  const prog = document.getElementById("survey-progress");
  const pct = Math.round((answered / total) * 100);
  prog.innerHTML =
    `📝 <b>${answered}</b> / ${total} 개 대답했어요!` +
    `<div class="bar"><span style="width:${pct}%"></span></div>`;

  document.getElementById("survey-count").textContent = answered;

  // 결과
  const box = document.getElementById("survey-result");
  if (answered === 0) {
    box.className = "survey-result";
    box.innerHTML = "";
    return;
  }
  const likes = items.filter(it => surveyChoices[surveyKey(it)] === "yes");
  const dislikes = items.filter(it => surveyChoices[surveyKey(it)] === "no");

  function liEmoji(it) { return it.swatch ? "🎨" : it.emoji; }
  function listHtml(arr) {
    if (!arr.length) return `<li class="none">아직 없어요</li>`;
    return arr.map(it => `<li>${liEmoji(it)} ${it.word} <b>(${it.ko})</b></li>`).join("");
  }

  box.className = "survey-result show";
  box.innerHTML =
    `<div class="rtitle">🌟 나의 좋아함 결과 🌟</div>` +
    `<div class="result-cols">` +
      `<div class="result-box like"><h4>👍 I like… (${likes.length})</h4><ul>${listHtml(likes)}</ul></div>` +
      `<div class="result-box dislike"><h4>👎 I don't like… (${dislikes.length})</h4><ul>${listHtml(dislikes)}</ul></div>` +
    `</div>`;
}

document.getElementById("survey-reset").addEventListener("click", () => {
  surveyChoices = {};
  saveSurvey();
  renderSurvey();
  updateSurveyResult();
});

/* =========================================================
 * 3) 듣고 맞히기 게임
 * ========================================================= */
let quizCat = "all";
let quizTarget = null;
let quizScore = 0, quizStreak = 0, quizTotal = 0;
let quizLocked = false;

function quizPool() {
  return quizCat === "all" ? allItems() : ITEMS[quizCat].map(it => Object.assign({ cat: quizCat }, it));
}
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newQuiz() {
  const pool = quizPool();
  quizLocked = false;
  document.getElementById("quiz-next").style.display = "none";
  const fb = document.getElementById("quiz-feedback");
  fb.className = "quiz-feedback"; fb.textContent = "";

  quizTarget = pool[Math.floor(Math.random() * pool.length)];
  const others = shuffle(pool.filter(it => it.en !== quizTarget.en)).slice(0, 3);
  const choices = shuffle([quizTarget, ...others]);

  document.getElementById("quiz-question").innerHTML = "잘 듣고 골라요! 🎧";

  const wrap = document.getElementById("quiz-choices");
  wrap.innerHTML = "";
  choices.forEach(it => {
    const btn = document.createElement("button");
    btn.className = "quiz-choice";
    const v = makeVisual(it, { swatch: "qc-swatch", photo: "qc-photo", emoji: "qc-visual" });
    const label = document.createElement("div");
    label.className = "qc-label";
    label.textContent = it.word;
    btn.append(v, label);
    btn.addEventListener("click", () => answerQuiz(it, btn));
    wrap.appendChild(btn);
  });

  setTimeout(() => speak(quizTarget.q), 300);
}

function answerQuiz(picked, btn) {
  if (quizLocked) return;
  quizLocked = true;
  quizTotal++;
  const fb = document.getElementById("quiz-feedback");
  const buttons = [...document.querySelectorAll(".quiz-choice")];

  if (picked.en === quizTarget.en) {
    quizScore++; quizStreak++;
    btn.classList.add("correct");
    buttons.forEach(b => { if (b !== btn) b.classList.add("dim"); });
    fb.className = "quiz-feedback good";
    fb.textContent = `⭐ 정답이에요! ${quizTarget.q} → Yes! (${quizTarget.ko})`;
    speak(quizTarget.q);
    setTimeout(() => { if (quizLocked) newQuiz(); }, 1600);
  } else {
    quizStreak = 0;
    btn.classList.add("wrong");
    buttons.forEach(b => {
      const lbl = b.querySelector(".qc-label").textContent;
      if (lbl === quizTarget.word) b.classList.add("correct");
      else if (b !== btn) b.classList.add("dim");
    });
    fb.className = "quiz-feedback bad";
    fb.innerHTML = `🔁 다시 들어봐요! 정답은 <b>${quizTarget.word}</b> (${quizTarget.ko}) 예요.`;
    document.getElementById("quiz-next").style.display = "inline-block";
  }
  document.getElementById("quiz-score").textContent = quizScore;
  document.getElementById("quiz-streak").textContent = quizStreak;
  document.getElementById("quiz-total").textContent = quizTotal;
  document.getElementById("quiz-question").textContent = quizTarget.q;
}

document.getElementById("quiz-replay").addEventListener("click", () => {
  if (quizTarget) speak(quizTarget.q);
  else newQuiz();
});
document.getElementById("quiz-next").addEventListener("click", newQuiz);

/* =========================================================
 * 4) 말하기 연습 (마이크 정확도)
 * ========================================================= */
let speakCat = "food";
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

function makePracticeCard(item, tone) {
  // item: { en(문장), ko, emoji, swatch?, img?, word? }
  const div = document.createElement("div");
  div.className = "card pcard tone-" + (tone % 6);

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = item.tag || "";
  const listen = document.createElement("button");
  listen.className = "listen-all";
  listen.textContent = "듣기 ▶";
  listen.addEventListener("click", () => speak(item.en));
  top.append(tag, listen);

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

  div.append(top, box, micArea, statsEl, fb);
  return div;
}

function renderSpeak() {
  // 대답 연습 (고정 2개)
  const ansWrap = document.getElementById("speak-answers");
  ansWrap.innerHTML = "";
  [
    { en: ANSWERS.yes.en, ko: ANSWERS.yes.ko, tag: "대답" },
    { en: ANSWERS.no.en, ko: ANSWERS.no.ko, tag: "대답" },
  ].forEach((it, i) => ansWrap.appendChild(makePracticeCard(it, i + 3)));

  // 질문 연습 (선택한 주제)
  const grid = document.getElementById("speak-grid");
  grid.innerHTML = "";
  ITEMS[speakCat].forEach((item, i) => {
    grid.appendChild(makePracticeCard({ en: item.q, ko: item.qko, tag: item.ko }, i));
  });
}

/* =========================================================
 * 주제(카테고리) 버튼 만들기
 * ========================================================= */
function buildCatButtons(containerId, includeAll, current, onPick) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = "";
  const cats = includeAll
    ? [{ key: "all", label: "🌈 모두" }, ...CATEGORIES]
    : CATEGORIES.slice();
  cats.forEach(c => {
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

buildCatButtons("qa-cats", false, () => qaCat, k => { qaCat = k; renderQA(); });
buildCatButtons("quiz-cats", true, () => quizCat, k => { quizCat = k; newQuiz(); });
buildCatButtons("speak-cats", false, () => speakCat, k => { speakCat = k; renderSpeak(); });

/* ---------- 사진/이모지 토글 ---------- */
document.getElementById("img-toggle").addEventListener("click", () => {
  imageMode = !imageMode;
  const btn = document.getElementById("img-toggle");
  btn.textContent = imageMode ? "🖼️ 사진" : "😀 그림";
  renderQA();
  if (document.getElementById("tab-quiz").classList.contains("active")) newQuiz();
});

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
    if (tab === "survey") { renderSurvey(); updateSurveyResult(); }
    if (tab === "quiz" && !quizTarget) newQuiz();
    if (tab === "speak") renderSpeak();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 첫 화면 ---------- */
renderQA();
updateSurveyResult();
