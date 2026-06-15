const exchanges = [
  { name: "Binance", status: "可用", latency: "48ms", api: "模拟已连接" },
  { name: "OKX", status: "可用", latency: "62ms", api: "模拟已连接" },
  { name: "Bybit", status: "可用", latency: "55ms", api: "模拟已连接" },
  { name: "Bitget", status: "可用", latency: "71ms", api: "待配置" },
  { name: "Gate", status: "可用", latency: "88ms", api: "待配置" },
];

const traders = [
  {
    id: "t1",
    name: "Alpha 短线",
    tag: "BTC/ETH 高频",
    exchange: "Binance",
    roi: 68.4,
    drawdown: 9.8,
    win: 63,
    followers: 1286,
    risk: "中",
    curve: [28, 34, 31, 42, 48, 45, 52, 58, 56, 64, 72, 78],
  },
  {
    id: "t2",
    name: "稳健趋势",
    tag: "低频趋势",
    exchange: "OKX",
    roi: 41.2,
    drawdown: 5.1,
    win: 59,
    followers: 864,
    risk: "低",
    curve: [22, 24, 26, 31, 33, 35, 37, 40, 42, 45, 47, 50],
  },
  {
    id: "t3",
    name: "Delta 波段",
    tag: "主流币波段",
    exchange: "Bybit",
    roi: 93.7,
    drawdown: 18.5,
    win: 56,
    followers: 2103,
    risk: "高",
    curve: [35, 46, 39, 55, 49, 72, 66, 88, 71, 96, 84, 100],
  },
  {
    id: "t4",
    name: "量化网格",
    tag: "震荡策略",
    exchange: "Bitget",
    roi: 29.5,
    drawdown: 4.8,
    win: 71,
    followers: 542,
    risk: "低",
    curve: [18, 20, 22, 25, 27, 26, 29, 32, 34, 35, 37, 39],
  },
  {
    id: "t5",
    name: "猎手合约",
    tag: "突破追单",
    exchange: "Gate",
    roi: 122.8,
    drawdown: 27.4,
    win: 51,
    followers: 3188,
    risk: "极高",
    curve: [25, 58, 33, 74, 47, 82, 61, 110, 77, 119, 90, 128],
  },
  {
    id: "t6",
    name: "ETH 专注",
    tag: "ETH 永续",
    exchange: "Binance",
    roi: 53.9,
    drawdown: 7.6,
    win: 66,
    followers: 932,
    risk: "中",
    curve: [24, 29, 35, 33, 44, 47, 52, 50, 57, 63, 66, 70],
  },
];

const positions = [
  { symbol: "BTCUSDT", side: "多", exchange: "Binance", margin: 1200, pnl: 86.4, leverage: "5x" },
  { symbol: "ETHUSDT", side: "空", exchange: "OKX", margin: 800, pnl: -23.8, leverage: "3x" },
  { symbol: "SOLUSDT", side: "多", exchange: "Bybit", margin: 600, pnl: 41.2, leverage: "4x" },
];

const defaultTasks = [
  {
    id: 1,
    name: "Alpha BTC 模拟跟单",
    trader: "Alpha 短线",
    exchange: "Binance",
    capital: 5000,
    pnl: 126.4,
    risk: "单日 3%",
    status: "运行中",
  },
  {
    id: 2,
    name: "稳健趋势低频",
    trader: "稳健趋势",
    exchange: "OKX",
    capital: 8000,
    pnl: -38.7,
    risk: "单日 2%",
    status: "暂停",
  },
];

let tasks = JSON.parse(localStorage.getItem("copyDemoTasks") || "null") || defaultTasks;
let activeFilter = "all";

const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const pageTitle = document.querySelector("#pageTitle");
const taskModal = document.querySelector("#taskModal");

const titles = {
  dashboard: "模拟资金跟单控制台",
  market: "交易员市场",
  tasks: "我的跟单任务",
  api: "交易所 API 管理",
  orders: "模拟持仓订单",
  risk: "风控中心",
};

function money(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(value);
}

function percent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function saveTasks() {
  localStorage.setItem("copyDemoTasks", JSON.stringify(tasks));
}

function showView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === id));
  pageTitle.textContent = titles[id];
}

function renderStats() {
  const pnl = tasks.reduce((sum, task) => sum + task.pnl, 0);
  const equity = 100000 + pnl;
  const dailyPct = (pnl / 100000) * 100;
  const running = tasks.filter((task) => task.status === "运行中").length;
  const risk = pnl < -1000 ? "预警" : "正常";

  document.querySelector("#equityValue").textContent = money(equity);
  document.querySelector("#sideEquity").textContent = `${money(equity)} USDT`;
  document.querySelector("#todayPnl").textContent = percent(dailyPct);
  document.querySelector("#todayPnl").className = pnl >= 0 ? "positive" : "negative";
  document.querySelector("#todayPnlMoney").textContent = `${pnl >= 0 ? "+" : ""}${pnl.toFixed(1)} USDT`;
  document.querySelector("#runningTasks").textContent = running;
  document.querySelector("#riskState").textContent = risk;
}

function renderChart() {
  const chart = document.querySelector("#equityChart");
  const points = [72, 76, 73, 81, 85, 83, 91];
  chart.innerHTML = points
    .map(
      (value, index) => `
        <div class="bar-wrap">
          <div class="bar" style="height:${value}%"></div>
          <span class="bar-label">D${index + 1}</span>
        </div>
      `,
    )
    .join("");
}

function renderExchanges() {
  const html = exchanges
    .map(
      (item) => `
        <article class="exchange-card">
          <div>
            <strong>${item.name}</strong>
            <span>${item.api} · 延迟 ${item.latency}</span>
          </div>
          <span class="status-pill good">${item.status}</span>
        </article>
      `,
    )
    .join("");
  document.querySelector("#exchangeGrid").innerHTML = html;
  document.querySelector("#apiList").innerHTML = exchanges
    .map(
      (item) => `
        <article class="api-card">
          <div>
            <strong>${item.name} 模拟 API</strong>
            <span>${item.api} · 只读/交易权限演示</span>
          </div>
          <span class="status-pill ${item.api.includes("已") ? "good" : "warn"}">${item.api.includes("已") ? "正常" : "未连接"}</span>
        </article>
      `,
    )
    .join("");
}

function traderCard(trader, featured = false) {
  return `
    <article class="trader-card">
      <div class="trader-top">
        <div class="avatar-line">
          <span class="avatar">${trader.name.slice(0, 1)}</span>
          <div>
            <strong>${trader.name}</strong>
            <span>${trader.tag} · ${trader.exchange}</span>
          </div>
        </div>
        <span class="status-pill ${trader.risk === "低" ? "good" : trader.risk === "极高" ? "bad" : "warn"}">风险 ${trader.risk}</span>
      </div>
      <div class="sparkline">${trader.curve.map((height) => `<i style="height:${height}%"></i>`).join("")}</div>
      <div class="trader-metrics">
        <article><span>收益率</span><strong class="positive">+${trader.roi}%</strong></article>
        <article><span>最大回撤</span><strong>${trader.drawdown}%</strong></article>
        <article><span>胜率</span><strong>${trader.win}%</strong></article>
      </div>
      <button class="primary-btn ${featured ? "small" : ""}" type="button" data-follow="${trader.id}">模拟跟单</button>
    </article>
  `;
}

function renderTraders() {
  const keyword = document.querySelector("#traderSearch")?.value.trim().toLowerCase() || "";
  const filtered = traders.filter((trader) => {
    const matchesExchange = activeFilter === "all" || trader.exchange === activeFilter;
    const matchesKeyword = !keyword || `${trader.name}${trader.tag}`.toLowerCase().includes(keyword);
    return matchesExchange && matchesKeyword;
  });

  document.querySelector("#featuredTraders").innerHTML = traders.slice(0, 3).map((trader) => traderCard(trader, true)).join("");
  document.querySelector("#traderGrid").innerHTML = filtered.map((trader) => traderCard(trader)).join("");
}

function renderTaskTable() {
  const body = document.querySelector("#taskTable");
  if (!tasks.length) {
    body.innerHTML = `<tr><td colspan="8">暂无跟单任务，先去交易员市场创建一个模拟任务。</td></tr>`;
    return;
  }

  body.innerHTML = tasks
    .map(
      (task) => `
        <tr>
          <td><strong>${task.name}</strong></td>
          <td>${task.trader}</td>
          <td>${task.exchange}</td>
          <td>${money(task.capital)} USDT</td>
          <td class="${task.pnl >= 0 ? "positive" : "negative"}">${task.pnl >= 0 ? "+" : ""}${task.pnl.toFixed(1)} USDT</td>
          <td>${task.risk}</td>
          <td><span class="status-pill ${task.status === "运行中" ? "good" : "warn"}">${task.status}</span></td>
          <td><button class="action-link" type="button" data-toggle-task="${task.id}">${task.status === "运行中" ? "暂停" : "启动"}</button></td>
        </tr>
      `,
    )
    .join("");
}

function renderPositions() {
  document.querySelector("#positionGrid").innerHTML = positions
    .map(
      (item) => `
        <article class="position-card">
          <div class="position-head">
            <strong>${item.symbol}</strong>
            <span class="status-pill ${item.side === "多" ? "good" : "warn"}">${item.side}</span>
          </div>
          <dl>
            <div><dt>交易所</dt><dd>${item.exchange}</dd></div>
            <div><dt>保证金</dt><dd>${item.margin} USDT</dd></div>
            <div><dt>杠杆</dt><dd>${item.leverage}</dd></div>
            <div><dt>浮动盈亏</dt><dd class="${item.pnl >= 0 ? "positive" : "negative"}">${item.pnl >= 0 ? "+" : ""}${item.pnl} USDT</dd></div>
          </dl>
        </article>
      `,
    )
    .join("");
}

function renderRisk() {
  const items = [
    ["全局最大杠杆", "模拟账户限制 10x，新任务默认 5x。", "good"],
    ["单日亏损熔断", "当日亏损超过 5% 暂停新增开仓。", "good"],
    ["连续亏损暂停", "同一任务连续亏损 3 单自动冷却。", "warn"],
    ["API 权限检测", "真实版本必须拒绝提现权限 API Key。", "good"],
  ];

  document.querySelector("#riskList").innerHTML = items
    .map(
      ([title, desc, state]) => `
        <article class="risk-card">
          <div>
            <strong>${title}</strong>
            <span>${desc}</span>
          </div>
          <span class="status-pill ${state}">${state === "good" ? "启用" : "观察"}</span>
        </article>
      `,
    )
    .join("");
}

function openTaskModal(traderId) {
  const select = document.querySelector("#taskTrader");
  select.innerHTML = traders.map((trader) => `<option value="${trader.id}">${trader.name}</option>`).join("");
  if (traderId) {
    select.value = traderId;
    const trader = traders.find((item) => item.id === traderId);
    document.querySelector("#taskExchange").value = trader.exchange;
  }
  taskModal.showModal();
}

function createTask(event) {
  event.preventDefault();
  const trader = traders.find((item) => item.id === document.querySelector("#taskTrader").value);
  const capital = Number(document.querySelector("#taskCapital").value) || 5000;
  const leverage = Number(document.querySelector("#taskLeverage").value) || 5;
  const stop = document.querySelector("#taskStop").value;
  const next = {
    id: Date.now(),
    name: `${trader.name} ${leverage}x 模拟`,
    trader: trader.name,
    exchange: document.querySelector("#taskExchange").value,
    capital,
    pnl: Number((capital * (trader.roi / 100) * 0.012 - trader.drawdown).toFixed(1)),
    risk: `单日 ${stop}`,
    status: "运行中",
  };
  tasks = [next, ...tasks];
  saveTasks();
  taskModal.close();
  renderAll();
  showView("tasks");
}

function resetDemo() {
  tasks = defaultTasks;
  saveTasks();
  renderAll();
  showView("dashboard");
}

function renderAll() {
  renderStats();
  renderChart();
  renderExchanges();
  renderTraders();
  renderTaskTable();
  renderPositions();
  renderRisk();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  const jump = event.target.closest("[data-jump]");
  const follow = event.target.closest("[data-follow]");
  const toggle = event.target.closest("[data-toggle-task]");

  if (nav) showView(nav.dataset.view);
  if (jump) showView(jump.dataset.jump);
  if (follow) openTaskModal(follow.dataset.follow);
  if (toggle) {
    const id = Number(toggle.dataset.toggleTask);
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, status: task.status === "运行中" ? "暂停" : "运行中" } : task,
    );
    saveTasks();
    renderAll();
  }
});

document.querySelector("#exchangeFilter").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll("#exchangeFilter button").forEach((item) => item.classList.toggle("active", item === button));
  renderTraders();
});

document.querySelector("#traderSearch").addEventListener("input", renderTraders);
document.querySelector("#openCreateTask").addEventListener("click", () => openTaskModal());
document.querySelector("#openCreateTask2").addEventListener("click", () => openTaskModal());
document.querySelector("#closeModal").addEventListener("click", () => taskModal.close());
document.querySelector("#cancelModal").addEventListener("click", () => taskModal.close());
document.querySelector("#taskForm").addEventListener("submit", createTask);
document.querySelector("#resetDemo").addEventListener("click", resetDemo);

renderAll();
