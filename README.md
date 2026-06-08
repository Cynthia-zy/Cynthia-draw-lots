# 抽签小程序 — 部署指南

## 方法一：部署到 Render.com（推荐，免费）

1. 注册 https://render.com（免费，无需信用卡）
2. 点击 New → Web Service
3. 选择 "Deploy from Git" → 先把这个文件夹上传到 GitHub
4. 填写：
   - Name: lottery-app（随意）
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
5. 点击 Create Web Service
6. 等待 2-3 分钟，即可获得公网链接

## 方法二：上传到 GitHub 后一键部署

点击下方按钮（在 GitHub 页面）：
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## 方法三：本地运行（局域网内多人使用）

```bash
npm install
npm start
```

然后手机和电脑连同一个 WiFi，用电脑的局域网 IP 访问，如 http://192.168.1.100:3000
