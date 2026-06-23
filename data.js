/* =========================================================
 * 3학년 영어 · Do you like ~ ? · 데이터
 * - 핵심 표현: "Do you like ___?" / "Yes, I do." / "No, I don't."
 * - 3개 주제(카테고리)
 *    🍎 음식·과일 : 사과·바나나·포도·빵·샐러드·피자·아이스크림·오렌지 (수업에서 한 서베이)
 *    🐶 동물      : 개·고양이·오리·호랑이·토끼·원숭이·코끼리·사자 (8가지)
 *    🎨 색깔      : 빨강·파랑·노랑·초록·분홍·보라·검정·하양 (추천 주제)
 * - 단어를 누르면 뜻·발음을 알 수 있어요.
 * ========================================================= */

/* ===== 대답 (정해진 두 가지) ===== */
const ANSWERS = {
  yes: { en: "Yes, I do.",   ko: "응, 좋아해.",     emoji: "👍" },
  no:  { en: "No, I don't.", ko: "아니, 안 좋아해.", emoji: "👎" },
};

/* ===== 주제(카테고리) ===== */
const CATEGORIES = [
  { key: "food",   label: "🍎 음식·과일", title: "음식·과일" },
  { key: "animal", label: "🐶 동물",      title: "동물" },
  { key: "color",  label: "🎨 색깔",      title: "색깔" },
];

/* ===== 낱말 카드 =====
 * en  : "Do you like ___?" 안에 들어가는 말 (예: apples)
 * word: 화면에 크게 보여줄 한 낱말 (발음 연습용)
 * ko  : 우리말 뜻
 * q   : 질문 전체 문장
 * qko : 질문 우리말 뜻
 * emoji: 그림 이모지
 * img : 실사 사진 검색어 (없으면 이모지/색칠로 보여줌)
 * swatch: 색깔 카드일 때 보여줄 색(HEX)
 */
const ITEMS = {
  food: [
    { en: "apples",     word: "apple",     ko: "사과",       q: "Do you like apples?",     qko: "너는 사과를 좋아하니?",       emoji: "🍎", img: "fresh red apples" },
    { en: "bananas",    word: "banana",    ko: "바나나",     q: "Do you like bananas?",    qko: "너는 바나나를 좋아하니?",     emoji: "🍌", img: "a bunch of yellow bananas" },
    { en: "grapes",     word: "grapes",    ko: "포도",       q: "Do you like grapes?",     qko: "너는 포도를 좋아하니?",       emoji: "🍇", img: "fresh purple grapes" },
    { en: "bread",      word: "bread",     ko: "빵",         q: "Do you like bread?",      qko: "너는 빵을 좋아하니?",         emoji: "🍞", img: "a loaf of fresh bread" },
    { en: "salad",      word: "salad",     ko: "샐러드",     q: "Do you like salad?",      qko: "너는 샐러드를 좋아하니?",     emoji: "🥗", img: "a bowl of fresh green salad" },
    { en: "pizza",      word: "pizza",     ko: "피자",       q: "Do you like pizza?",      qko: "너는 피자를 좋아하니?",       emoji: "🍕", img: "a cheese pizza" },
    { en: "ice cream",  word: "ice cream", ko: "아이스크림", q: "Do you like ice cream?",  qko: "너는 아이스크림을 좋아하니?", emoji: "🍨", img: "ice cream in a cup" },
    { en: "oranges",    word: "orange",    ko: "오렌지",     q: "Do you like oranges?",    qko: "너는 오렌지를 좋아하니?",     emoji: "🍊", img: "fresh orange fruits" },
  ],
  animal: [
    { en: "dogs",       word: "dog",       ko: "개",         q: "Do you like dogs?",       qko: "너는 개를 좋아하니?",         emoji: "🐶", img: "a cute happy dog" },
    { en: "cats",       word: "cat",       ko: "고양이",     q: "Do you like cats?",       qko: "너는 고양이를 좋아하니?",     emoji: "🐱", img: "a cute kitten" },
    { en: "ducks",      word: "duck",      ko: "오리",       q: "Do you like ducks?",      qko: "너는 오리를 좋아하니?",       emoji: "🦆", img: "a yellow duck on water" },
    { en: "tigers",     word: "tiger",     ko: "호랑이",     q: "Do you like tigers?",     qko: "너는 호랑이를 좋아하니?",     emoji: "🐯", img: "a tiger in the wild" },
    { en: "rabbits",    word: "rabbit",    ko: "토끼",       q: "Do you like rabbits?",    qko: "너는 토끼를 좋아하니?",       emoji: "🐰", img: "a cute white rabbit" },
    { en: "monkeys",    word: "monkey",    ko: "원숭이",     q: "Do you like monkeys?",    qko: "너는 원숭이를 좋아하니?",     emoji: "🐵", img: "a funny monkey" },
    { en: "elephants",  word: "elephant",  ko: "코끼리",     q: "Do you like elephants?",  qko: "너는 코끼리를 좋아하니?",     emoji: "🐘", img: "a big elephant" },
    { en: "lions",      word: "lion",      ko: "사자",       q: "Do you like lions?",      qko: "너는 사자를 좋아하니?",       emoji: "🦁", img: "a lion with a mane" },
  ],
  color: [
    { en: "red",        word: "red",       ko: "빨강",       q: "Do you like red?",        qko: "너는 빨간색을 좋아하니?",     emoji: "🔴", swatch: "#ef4444" },
    { en: "blue",       word: "blue",      ko: "파랑",       q: "Do you like blue?",       qko: "너는 파란색을 좋아하니?",     emoji: "🔵", swatch: "#3b82f6" },
    { en: "yellow",     word: "yellow",    ko: "노랑",       q: "Do you like yellow?",     qko: "너는 노란색을 좋아하니?",     emoji: "🟡", swatch: "#facc15" },
    { en: "green",      word: "green",     ko: "초록",       q: "Do you like green?",      qko: "너는 초록색을 좋아하니?",     emoji: "🟢", swatch: "#22c55e" },
    { en: "pink",       word: "pink",      ko: "분홍",       q: "Do you like pink?",       qko: "너는 분홍색을 좋아하니?",     emoji: "🩷", swatch: "#ec4899" },
    { en: "purple",     word: "purple",    ko: "보라",       q: "Do you like purple?",     qko: "너는 보라색을 좋아하니?",     emoji: "🟣", swatch: "#a855f7" },
    { en: "black",      word: "black",     ko: "검정",       q: "Do you like black?",      qko: "너는 검은색을 좋아하니?",     emoji: "⚫", swatch: "#1f2937" },
    { en: "white",      word: "white",     ko: "하양",       q: "Do you like white?",      qko: "너는 흰색을 좋아하니?",       emoji: "⚪", swatch: "#f3f4f6" },
  ],
};

/* ===== 단어 뜻 사전 ===== */
function wordKey(w) {
  return w.toLowerCase().replace(/^[^a-z']+/, "").replace(/[^a-z']+$/, "");
}

const WORD_MEANINGS = {
  "do": "(질문을 만드는 말) ~하니?",
  "you": "너, 너는",
  "like": "좋아하다",
  "yes": "응, 네",
  "no": "아니, 아니요",
  "i": "나는",
  "don't": "~하지 않아 (do not)",
  // 음식·과일
  "apple": "사과",
  "apples": "사과 (여러 개)",
  "banana": "바나나",
  "bananas": "바나나 (여러 개)",
  "grape": "포도 알",
  "grapes": "포도",
  "bread": "빵",
  "salad": "샐러드",
  "pizza": "피자",
  "ice": "얼음 (ice cream: 아이스크림)",
  "cream": "크림 (ice cream: 아이스크림)",
  "orange": "오렌지; 주황색",
  "oranges": "오렌지 (여러 개)",
  // 동물
  "dog": "개",
  "dogs": "개 (여러 마리)",
  "cat": "고양이",
  "cats": "고양이 (여러 마리)",
  "duck": "오리",
  "ducks": "오리 (여러 마리)",
  "tiger": "호랑이",
  "tigers": "호랑이 (여러 마리)",
  "rabbit": "토끼",
  "rabbits": "토끼 (여러 마리)",
  "monkey": "원숭이",
  "monkeys": "원숭이 (여러 마리)",
  "elephant": "코끼리",
  "elephants": "코끼리 (여러 마리)",
  "lion": "사자",
  "lions": "사자 (여러 마리)",
  // 색깔
  "red": "빨간색",
  "blue": "파란색",
  "yellow": "노란색",
  "green": "초록색",
  "pink": "분홍색",
  "purple": "보라색",
  "black": "검은색",
  "white": "흰색",
};
