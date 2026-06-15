# 币圈价值观回归器

一个把 USDT 翻译成人间生活的静态网站。

它不是交易工具，而是现实感校准器：输入亏损、盈利、准备开仓、想回本或想梭哈的金额，页面会把这笔 U 换算成早餐、外卖、工作日、房租占比、月收入占比和现实生活代价。

## 当前功能

- 支持亏损、盈利、准备开仓、想回本、想梭哈五种场景。
- 输入 USDT 金额、汇率、月收入、月房租后，换算现实生活等价物。
- 输出现实扣款单：工资被拿走、现金退路、家庭生活重量。
- 输出清醒问题与场景化行动建议。
- 支持复制清醒文案与下载现实审判分享图。
- 适配桌面端与 H5 手机端。

## 本地预览

直接打开 `index.html`，或启动一个本地静态服务器：

```bash
python -m http.server 5173
```

然后访问：

```text
http://127.0.0.1:5173/index.html
```

## 上线

这是纯静态网站，可以直接部署到 GitHub Pages、Vercel、Netlify 或 Cloudflare Pages。

GitHub Pages 推荐设置：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

发布后地址通常是：

```text
https://dafanqie150.github.io/jiazhiguanhuigui/
```
