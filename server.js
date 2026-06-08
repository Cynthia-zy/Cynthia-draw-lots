const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const TOTAL_GROUPS = 11, PER_GROUP = 12;
let records = [];
let slots = [];

function initSlots() {
  slots = [];
  for (let g = 1; g <= TOTAL_GROUPS; g++)
    for (let o = 1; o <= PER_GROUP; o++)
      slots.push({ group: g, order: o, taken: false });
}
initSlots();

function getFreeSlot() {
  const free = slots.filter(s => !s.taken);
  if (!free.length) return null;
  return free[Math.floor(Math.random() * free.length)];
}

function pickTopic() {
  const r = Math.random();
  return r < .30 ? '艾瑞康晚期一线case' : r < .60 ? '艾瑞康早期case' : '双艾case';
}

function getStats() {
  let full = 0;
  for (let g = 1; g <= TOTAL_GROUPS; g++) {
    if (slots.filter(s => s.group === g && s.taken).length === PER_GROUP) full++;
  }
  return { total: records.length, left: TOTAL_GROUPS * PER_GROUP - records.length, full };
}

app.use(express.static('public'));
app.use(express.json());

app.get('/api/records', (req, res) => res.json({ records, stats: getStats() }));

app.post('/api/draw', (req, res) => {
  const { name, office } = req.body;
  if (!name || !office) return res.status(400).json({ error: '姓名和办事处不能为空' });
  const slot = getFreeSlot();
  if (!slot) return res.status(400).json({ error: '所有名额已满' });
  const topic = pickTopic();
  slot.taken = true;
  const ts = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const rec = { id: Date.now(), name, office, group: slot.group, order: slot.order, topic, time: ts };
  records.push(rec);
  io.emit('new_draw', { rec, stats: getStats() });
  res.json({ rec, stats: getStats() });
});

app.delete('/api/records/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = records.findIndex(r => r.id === id);
  if (idx < 0) return res.status(404).json({ error: '未找到' });
  const rec = records[idx];
  const s = slots.find(s => s.group === rec.group && s.order === rec.order);
  if (s) s.taken = false;
  records.splice(idx, 1);
  io.emit('record_deleted', { id, stats: getStats() });
  res.json({ ok: true });
});

app.delete('/api/records', (req, res) => {
  records = [];
  initSlots();
  io.emit('records_cleared', { stats: getStats() });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
