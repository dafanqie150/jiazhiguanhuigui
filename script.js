const scenes = {
  loss: {
    title: "我刚亏了",
    label: "亏损金额",
    kicker: "亏损现实审判",
    heading: "你亏掉的不是 U，是现实生活被扣款。",
    moneyLabel: "亏损折合人民币",
    action: "生成现实审判",
    heroHint: "别急着点下一单",
    verb: "亏损",
    quote: "你亏掉的不是数字，是早餐、工资、房租和本来可以留住的退路。",
    adviceTitle: "止血动作",
    adviceMain: "今天停止交易。",
    adviceSub: "如果你还想立刻下一单，你现在不是在交易，是在用钱止痛。",
    redlineMain: "把交易软件从首页移走。",
    redlineSub: "先让手指够不到它，再谈理性。真正失控的人，第一反应都是再来一把。",
  },
  profit: {
    title: "我刚赚了",
    label: "盈利金额",
    kicker: "盈利现实审判",
    heading: "盈利如果不离场，很快会变回筹码。",
    moneyLabel: "盈利折合人民币",
    action: "生成落袋账单",
    heroHint: "把利润带回现实",
    verb: "盈利",
    quote: "盈利留在交易所，只是下一次亏损的原材料；提现到生活里，才叫赚钱。",
    adviceTitle: "落袋动作",
    adviceMain: "立刻提取 30%。",
    adviceSub: "用一部分盈利还债、储蓄、买必需品或给家人，别让它只变成更大的仓位。",
    redlineMain: "先提现，再庆祝。",
    redlineSub: "如果你赚了还想马上加倍，说明你真正上瘾的不是赚钱，是下注的刺激。",
  },
  entry: {
    title: "我准备开仓",
    label: "计划投入",
    kicker: "开仓现实审判",
    heading: "按下开仓前，先看见它在现实里的尸检报告。",
    moneyLabel: "计划投入折合人民币",
    action: "确认代价",
    heroHint: "交易前先看现实",
    verb: "计划投入",
    quote: "你可以冒险，但别假装这只是屏幕上的一串数字。",
    adviceTitle: "开仓前确认",
    adviceMain: "亏完会心疼，就减仓。",
    adviceSub: "如果这笔钱会影响吃饭、房租、还款、家人或睡眠，它就不是交易资金。",
    redlineMain: "把金额砍到你不需要隐瞒的程度。",
    redlineSub: "一笔不敢告诉现实生活的仓位，通常已经超过了你的承受能力。",
  },
  recover: {
    title: "我想回本",
    label: "已经亏损",
    kicker: "回本冲动审判",
    heading: "回本不是计划，是亏损在操控你。",
    moneyLabel: "已亏损折合人民币",
    action: "审判回本冲动",
    heroHint: "先离开行情页面",
    verb: "已亏损",
    quote: "不要用更多现实生活，去修复一个数字伤口。",
    adviceTitle: "强制止损",
    adviceMain: "至少 24 小时不交易。",
    adviceSub: "你现在想赢回来的，其实是尊严、懊悔和不甘，不是一个成熟的交易计划。",
    redlineMain: "卸载或退出登录一天。",
    redlineSub: "如果你做不到，问题已经不只是亏钱，而是交易软件正在支配你的行动。",
  },
  allin: {
    title: "我想梭哈",
    label: "准备梭哈",
    kicker: "梭哈现实审判",
    heading: "梭哈听起来像翻身，现实里更像自毁退路。",
    moneyLabel: "梭哈金额折合人民币",
    action: "看清毁灭半径",
    heroHint: "这是失控信号",
    verb: "准备梭哈",
    quote: "真正能翻身的东西，不会要求你把全部退路交出去。",
    adviceTitle: "强制冷静",
    adviceMain: "今天不要交易。",
    adviceSub: "关掉交易软件，离开屏幕，等明天还能用同样理由说服自己再说。",
    redlineMain: "现在就卸载交易软件。",
    redlineSub: "不是永远不能回来，是今天的你已经不适合碰它。",
  },
};

const amountInput = document.querySelector("#amount");
const rateInput = document.querySelector("#rate");
const salaryInput = document.querySelector("#salary");
const rentInput = document.querySelector("#rent");
const form = document.querySelector("#calculatorForm");
const sceneButtons = [...document.querySelectorAll(".scene-card")];
const quickButtons = [...document.querySelectorAll(".quick-row button")];
let currentScene = "loss";

const formatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 0,
});

function numberValue(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function formatMoney(value) {
  return `${formatter.format(Math.round(value))} 元`;
}

function formatCount(value, unit) {
  if (value < 10 && value !== Math.round(value)) {
    return `${value.toFixed(1)} ${unit}`;
  }
  return `${formatter.format(Math.round(value))} ${unit}`;
}

function getRealityItems(rmb, scene) {
  const base = [
    rmb >= 60 ? `${formatCount(rmb / 10, "顿")} 10 元早餐被划走` : "几天早餐钱被划走",
    rmb >= 30 ? `${formatCount(rmb / 30, "份")} 普通外卖被划走` : "一顿正经饭被划走",
    `${formatCount(rmb / 80, "天")} 基础生活费被拿走`,
  ];

  const tiers = [
    [200, "一次认真采购生活用品的机会"],
    [600, "一周基础伙食，或者一双能穿很久的鞋"],
    [1200, "一次体检，或者半个月把日子过稳的预算"],
    [2500, "一部手机、一把好椅子，或者一次不用硬撑的生活改善"],
    [5000, "一台笔记本电脑，或者家里真正能救急的钱"],
    [10000, "几个月房租，或者父母很长一段时间的生活费"],
    [30000, "一笔能改变现金流的储备金，不该被一根 K 线带走"],
  ];

  const matched = tiers.filter(([limit]) => rmb >= limit).slice(-4).map(([, text]) => text);
  const sceneItem = {
    loss: "本来可以留下来的安全感，现在变成了交易记录",
    profit: "这笔钱如果不提现，很可能只是下一次亏损的燃料",
    entry: "如果亏完你会失眠，这笔仓位已经过大",
    recover: "你想追回的不是钱，是不甘心；不甘心最贵",
    allin: "你押上的不是仓位，是未来很久的生活缓冲",
  }[scene];

  return [...base, ...matched, sceneItem].slice(0, 7);
}

function getTruthItems(rmb, scene, workdays, salaryBurn, rentPercent) {
  const common = [
    `这相当于你工作 ${formatCount(workdays, "天")}，不是鼠标点一下就能抹掉的东西。`,
    `这占你月收入的 ${salaryBurn.toFixed(salaryBurn >= 10 ? 0 : 1)}%，现实里没人会把这叫“小钱”。`,
    `这等于你房租/房贷的 ${rentPercent.toFixed(rentPercent >= 10 ? 0 : 1)}%，它本来可以换来一个更稳的晚上。`,
  ];

  const sceneTruth = {
    loss: [
      "你现在最想做的下一单，往往不是机会，而是情绪的续费。",
      "如果你不敢把亏损金额告诉亲近的人，说明你自己也知道它已经越界。",
      "亏损不会因为你盯盘更久而变小，只会让你更难停手。",
    ],
    profit: [
      "赚到钱还不愿意提现，本质上是把胜利继续放回风险里。",
      "真正的盈利会进入银行卡、债务、储蓄和生活，而不是只停在交易所余额。",
      "如果盈利让你觉得自己无敌，那它正在把你带向下一次大亏。",
    ],
    entry: [
      "如果这笔钱亏完会让你编理由、撒谎或睡不着，那就不该开。",
      "你不是在选择方向，你是在选择是否愿意把现实生活拿去换概率。",
      "仓位越需要勇气，越说明它超过了你的真实承受力。",
    ],
    recover: [
      "回本两个字最可怕的地方，是它会让你把风险越开越大。",
      "市场不欠你钱。你越想讨回来，越容易把剩下的也交出去。",
      "现在停手不是认输，是阻止自己继续把生活往洞里推。",
    ],
    allin: [
      "梭哈不是胆量，是没有给明天的自己留选择。",
      "如果一笔交易需要押上全部，它失败时也会拿走全部缓冲。",
      "你不是差一次翻身机会，你是需要立刻从冲动里出来。",
    ],
  }[scene];

  if (rmb >= 10000 && scene !== "profit") {
    return ["这已经不是一次小亏，这是一次现实生活事故。", ...common, ...sceneTruth].slice(0, 6);
  }

  return [...common, ...sceneTruth].slice(0, 6);
}

function riskLevel(rmb, scene) {
  const prefix = scene === "profit" ? "现实改善等级" : "价值观崩塌等级";
  if (scene === "allin") return `${prefix}：红色警报`;
  if (scene === "recover") return `${prefix}：情绪接管`;
  if (rmb >= 30000) return `${prefix}：生活事故`;
  if (rmb >= 10000) return `${prefix}：严重失真`;
  if (rmb >= 3000) return `${prefix}：明显失真`;
  if (rmb >= 800) return `${prefix}：开始麻木`;
  return `${prefix}：轻度偏离`;
}

function updateScene(scene) {
  currentScene = scene;
  const config = scenes[scene];
  document.body.className = `scene-${scene}`;
  sceneButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scene === scene);
  });
  document.querySelector("#sceneTitle").textContent = config.title;
  document.querySelector("#amountLabel").textContent = config.label;
  document.querySelector("#resultKicker").textContent = config.kicker;
  document.querySelector("#resultTitle").textContent = config.heading;
  document.querySelector("#moneyLabel").textContent = config.moneyLabel;
  document.querySelector("#mainAction").textContent = config.action;
  document.querySelector("#adviceTitle").textContent = config.adviceTitle;
  document.querySelector("#adviceMain").textContent = config.adviceMain;
  document.querySelector("#adviceSub").textContent = config.adviceSub;
  document.querySelector("#redlineMain").textContent = config.redlineMain;
  document.querySelector("#redlineSub").textContent = config.redlineSub;
  calculate();
}

function fillList(selector, items) {
  const list = document.querySelector(selector);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function calculate() {
  const config = scenes[currentScene];
  const amount = numberValue(amountInput, 0);
  const rate = numberValue(rateInput, 6.8) || 6.8;
  const salary = numberValue(salaryInput, 6000) || 6000;
  const rent = numberValue(rentInput, 1800) || 1800;
  const rmb = amount * rate;
  const workdays = rmb / (salary / 22);
  const breakfast = rmb / 10;
  const meals = rmb / 30;
  const rentPercent = (rmb / rent) * 100;
  const salaryBurn = (rmb / salary) * 100;
  const survivalDays = rmb / 80;
  const familyDays = rmb / 50;

  document.querySelector("#heroAmount").textContent = `${formatter.format(amount)}U`;
  document.querySelector("#heroHint").textContent = config.heroHint;
  document.querySelector("#rmbValue").textContent = formatMoney(rmb);
  document.querySelector("#riskText").textContent = riskLevel(rmb, currentScene);
  document.querySelector("#breakfastValue").textContent = formatCount(breakfast, "顿");
  document.querySelector("#mealValue").textContent = formatCount(meals, "份");
  document.querySelector("#workValue").textContent = formatCount(workdays, "天");
  document.querySelector("#rentValue").textContent = `${rentPercent.toFixed(rentPercent >= 10 ? 0 : 1)}%`;
  document.querySelector("#salaryBurn").textContent = `${salaryBurn.toFixed(salaryBurn >= 10 ? 0 : 1)}%`;
  document.querySelector("#survivalDays").textContent = formatCount(survivalDays, "天");
  document.querySelector("#familyDays").textContent = formatCount(familyDays, "天");

  const intro = {
    loss: `这笔 ${formatter.format(amount)}U 折合 ${formatMoney(rmb)}。它不是行情波动，是你现实生活里被扣掉的一段时间、一批选择和一层安全感。`,
    profit: `这笔 ${formatter.format(amount)}U 折合 ${formatMoney(rmb)}。现在最重要的不是再赚一笔，而是让这笔钱真的离开风险桌面。`,
    entry: `你准备投入 ${formatter.format(amount)}U，折合 ${formatMoney(rmb)}。开仓前先问清楚：亏完以后，你是不是还敢面对房租、账单和明天早上。`,
    recover: `你已经亏损 ${formatter.format(amount)}U，折合 ${formatMoney(rmb)}。你现在不是在找机会，而是在被亏损牵着走。`,
    allin: `你准备押上 ${formatter.format(amount)}U，折合 ${formatMoney(rmb)}。这不是豪气，这是把现实退路交给一根 K 线。`,
  }[currentScene];
  document.querySelector("#resultMessage").textContent = intro;

  fillList("#realityItems", getRealityItems(rmb, currentScene));
  fillList("#truthItems", getTruthItems(rmb, currentScene, workdays, salaryBurn, rentPercent));

  document.querySelector("#shareAmount").textContent = `${config.verb} ${formatter.format(amount)}U = ${formatMoney(rmb)}`;
  document.querySelector("#shareLine").textContent =
    `约等于 ${formatCount(breakfast, "顿")}早餐、${formatCount(workdays, "个")}工作日、${salaryBurn.toFixed(salaryBurn >= 10 ? 0 : 1)}% 月收入。`;
  document.querySelector("#shareQuote").textContent = config.quote;
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

async function copyShareText() {
  const text = [
    "我的币圈现实审判",
    document.querySelector("#shareAmount").textContent,
    document.querySelector("#shareLine").textContent,
    document.querySelector("#shareQuote").textContent,
    document.querySelector("#adviceMain").textContent,
    document.querySelector("#redlineMain").textContent,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("清醒文案已复制");
  } catch {
    showToast("复制失败，请手动选择文案");
  }
}

function downloadShareImage() {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const config = scenes[currentScene];
  const amount = numberValue(amountInput, 0);
  const rate = numberValue(rateInput, 6.8) || 6.8;
  const salary = numberValue(salaryInput, 6000) || 6000;
  const rmb = amount * rate;
  const breakfast = rmb / 10;
  const workdays = rmb / (salary / 22);
  const salaryBurn = (rmb / salary) * 100;

  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = currentScene === "profit" ? "#207b57" : currentScene === "entry" ? "#245b82" : "#c13f32";
  ctx.fillRect(0, 0, width, 30);

  ctx.fillStyle = "#e7ede3";
  ctx.font = "700 34px Microsoft YaHei, Arial";
  ctx.fillText("我的币圈现实审判", 80, 130);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 78px Microsoft YaHei, Arial";
  ctx.fillText(`${config.verb} ${formatter.format(amount)}U`, 80, 285);
  ctx.fillText(`= ${formatMoney(rmb)}`, 80, 390);

  ctx.fillStyle = "#e7ede3";
  ctx.font = "700 42px Microsoft YaHei, Arial";
  ctx.fillText(`约等于 ${formatCount(breakfast, "顿")}早餐`, 80, 560);
  ctx.fillText(`约等于 ${formatCount(workdays, "个")}工作日`, 80, 635);
  ctx.fillText(`约占月收入 ${salaryBurn.toFixed(salaryBurn >= 10 ? 0 : 1)}%`, 80, 710);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 42px Microsoft YaHei, Arial";
  wrapCanvasText(ctx, config.quote, 80, 900, 900, 60);

  ctx.fillStyle = "#8e9a8f";
  ctx.font = "700 28px Microsoft YaHei, Arial";
  ctx.fillText("币圈价值观回归器", 80, 1240);

  const link = document.createElement("a");
  link.download = "crypto-reality-judgement.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  for (const char of text) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, x, y);
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => updateScene(button.dataset.scene));
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    amountInput.value = button.dataset.amount;
    calculate();
  });
});

[amountInput, rateInput, salaryInput, rentInput].forEach((input) => {
  input.addEventListener("input", calculate);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
  document.querySelector(".result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  amountInput.value = 100;
  rateInput.value = 6.8;
  salaryInput.value = 6000;
  rentInput.value = 1800;
  updateScene("loss");
});

document.querySelector("#copyBtn").addEventListener("click", copyShareText);
document.querySelector("#downloadBtn").addEventListener("click", downloadShareImage);

updateScene("loss");
