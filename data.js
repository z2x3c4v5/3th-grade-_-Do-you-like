/* =========================================================
 * 3학년 영어 · Do you like ~ ? · 데이터
 * - 핵심 표현: "Do you like ___?" / "Yes, I do." / "No, I don't."
 * - 3개 주제(카테고리)
 *    🍎 음식·과일 : 사과·바나나·포도·빵·샐러드·피자·아이스크림·오렌지·딸기 (수업에서 한 서베이)
 *    🐶 동물      : 개·고양이·오리·호랑이·토끼·원숭이·코끼리·사자·곰 (9가지)
 *    ✏️ 학용품·물건 : 연필·펜·크레용·책·공책·가방·자·가위·물감 (9가지)
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
  { key: "thing",  label: "✏️ 학용품·물건", title: "학용품·물건" },
];

/* ===== 낱말 카드 =====
 * en  : "Do you like ___?" 안에 들어가는 말 (예: apples)
 * word: 화면에 크게 보여줄 한 낱말 (발음 연습용)
 * ko  : 우리말 뜻
 * q   : 질문 전체 문장
 * qko : 질문 우리말 뜻
 * emoji: 그림 이모지
 * img : 실사 사진 검색어 (없으면 이모지로 보여줌)
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
    { en: "strawberries", word: "strawberry", ko: "딸기",   q: "Do you like strawberries?", qko: "너는 딸기를 좋아하니?",     emoji: "🍓", img: "fresh red strawberries" },
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
    { en: "bears",      word: "bear",      ko: "곰",         q: "Do you like bears?",      qko: "너는 곰을 좋아하니?",         emoji: "🐻", img: "a cute brown bear" },
  ],
  thing: [
    { en: "pencils",    word: "pencil",    ko: "연필",       q: "Do you like pencils?",    qko: "너는 연필을 좋아하니?",       emoji: "✏️", img: "colorful pencils" },
    { en: "pens",       word: "pen",       ko: "펜",         q: "Do you like pens?",       qko: "너는 펜을 좋아하니?",         emoji: "🖊️", img: "colorful pens" },
    { en: "crayons",    word: "crayon",    ko: "크레용",     q: "Do you like crayons?",    qko: "너는 크레용을 좋아하니?",     emoji: "🖍️", img: "a box of colorful crayons" },
    { en: "books",      word: "book",      ko: "책",         q: "Do you like books?",      qko: "너는 책을 좋아하니?",         emoji: "📚", img: "a stack of colorful books" },
    { en: "notebooks",  word: "notebook",  ko: "공책",       q: "Do you like notebooks?",  qko: "너는 공책을 좋아하니?",       emoji: "📓", img: "colorful school notebooks" },
    { en: "bags",       word: "bag",       ko: "가방",       q: "Do you like bags?",       qko: "너는 가방을 좋아하니?",       emoji: "🎒", img: "a colorful school backpack" },
    { en: "rulers",     word: "ruler",     ko: "자",         q: "Do you like rulers?",     qko: "너는 자를 좋아하니?",         emoji: "📏", img: "colorful rulers" },
    { en: "scissors",   word: "scissors",  ko: "가위",       q: "Do you like scissors?",   qko: "너는 가위를 좋아하니?",       emoji: "✂️", img: "a pair of colorful scissors" },
    { en: "paints",     word: "paint",     ko: "물감",       q: "Do you like paints?",     qko: "너는 물감을 좋아하니?",       emoji: "🎨", img: "a colorful paint palette" },
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
  "strawberry": "딸기",
  "strawberries": "딸기 (여러 개)",
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
  "bear": "곰",
  "bears": "곰 (여러 마리)",
  // 학용품·물건
  "pencil": "연필",
  "pencils": "연필 (여러 개)",
  "pen": "펜",
  "pens": "펜 (여러 개)",
  "crayon": "크레용",
  "crayons": "크레용 (여러 개)",
  "book": "책",
  "books": "책 (여러 권)",
  "notebook": "공책",
  "notebooks": "공책 (여러 권)",
  "bag": "가방",
  "bags": "가방 (여러 개)",
  "ruler": "자",
  "rulers": "자 (여러 개)",
  "scissors": "가위",
  "paint": "물감",
  "paints": "물감 (여러 색)",
};
