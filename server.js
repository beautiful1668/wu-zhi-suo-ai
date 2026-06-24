const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'records.json');
const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads');

// 确保目录存在
['data', 'data/uploads'].forEach(dir => {
  const p = path.join(__dirname, ...dir.split('/'));
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// 初始种子数据
function seedData() {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
      const data = JSON.parse(raw);
      if (data.length > 0) return;
    } catch(e) { /* 数据损坏则重建 */ }
  }

  const seedRecords = [
    {
      id: 'rec_seed_001',
      createdAt: new Date().toISOString(),
      recordType: 'conflict',
      eventDate: '晚间居家时段',
      reviewer: '心理学学习型母亲',
      peopleInvolved: [
        { name: '母亲', role: '复盘者' },
        { name: '父亲', role: '丈夫' },
        { name: '儿子', role: '学龄孩子' }
      ],
      cause: '亲子事前约定：孩子平板使用时长1.5小时；孩子超时使用，共计使用2小时，未主动退出、交还平板。',
      corePrinciples: '不自我审判、不追责伴侣、不定义孩子品行；区分原生情绪/次生情绪、区分自我课题/伴侣课题/孩子课题、区分规则问题/情绪宣泄问题。',
      conflictType: '家庭复合冲突',
      tags: ['平板超时', '压力转嫁', '情绪过载', '课题分离', '亲子约定'],
      mood: '愤怒→失控→内疚→清醒',
      timeline: [
        { stage: 1, title: '事件触发期（孩子违约）', objectiveBehavior: '孩子自愿约定1.5小时平板时间，超时30分钟，沉浸玩乐，无视时间约定，不主动交出设备。', innerThoughts: '孩子内心：玩乐快感大于规则意识，抱有侥幸心理，觉得不会被严厉制止，没有恶意"骗人"，只是自控力不足。' },
        { stage: 2, title: '情绪转嫁期（父亲爆发）', objectiveBehavior: '父亲看到孩子违约，第一时间暴怒，定性孩子"不讲信用、人品有问题"，持续负面评判孩子，同时转头向妻子抱怨、发泄负面情绪。', innerThoughts: '父亲深层心理（非针对孩子、非针对你）：\n1. 职场长期积压高压、疲惫、失控感；\n2. 把【不守规则=失控】绑定，触发内心最深焦虑；\n3. 把自我压力合理化：借管教宣泄职场内耗；\n4. 潜意识依赖妻子：默认妻子承接自己负面情绪。' },
        { stage: 3, title: '母亲夹心承压期', objectiveBehavior: '你被迫站在中间，共情容器被装满。', innerThoughts: '表层：看懂父亲转嫁压力，孩子只是自控力差。\n底层：共情容器装满，理智想温柔，身体濒临崩溃。' },
        { stage: 4, title: '母亲失控行动期', objectiveBehavior: '情绪爆炸，用力敲门高声催促，孩子被迫交出平板。', innerThoughts: '本质：不是管教孩子，是终止丈夫的情绪内耗。发火对象不是孩子，是失控的丈夫。' },
        { stage: 5, title: '事后复盘期', objectiveBehavior: '家庭安静，陷入深度自我攻击。', innerThoughts: '我学心理学，我居然失控伤害孩子，我不够稳定。' }
      ],
      topicSeparation: [
        { party: '孩子的课题', facts: '行为问题（自控力不足），非人格问题。', correctHandling: '事后复盘规则、制定违约后果即可。', responsibility: '孩子承担违约后果，无需全家情绪买单。' },
        { party: '丈夫的课题', facts: '职场创伤投射，人格否定式管教，转嫁压力。', correctHandling: '完全是丈夫的个人课题。共情是自愿给予，不是被迫承接。', responsibility: '你有权不承接他的负面情绪。' },
        { party: '你的课题', facts: '三重压力阈值耗尽，家庭系统连锁反应，非本性暴躁。', correctHandling: '心理学是修复能力，不是永不发火。你本次没有过错，只有过载。', responsibility: '事后自我疗愈，善待疲惫的自己。' }
      ],
      errorPoints: [
        { party: '孩子', errors: '契约意识薄弱，平板超时，自控力欠缺。' },
        { party: '丈夫（家庭矛盾源头）', errors: '1. 行为问题上人格批判；\n2. 工作压力带入家庭；\n3. 育儿甩锅。' },
        { party: '你的行为瑕疵', errors: '1. 次生情绪迁怒孩子；\n2. 未及时阻断丈夫情绪输出。' }
      ],
      lingeringEffects: [
        { title: '系统内耗残留', description: '高强度愤怒氛围，交感神经持续紧绷。' },
        { title: '专业身份自我审判', description: '心理学学习者自带高标准，放大失误。' },
        { title: '无力感残留', description: '无法同时护住所有人，产生深深无力。' }
      ],
      recoveryPlan: [
        { target: '对孩子：亲子修复', actions: '分开行为对错+情绪道歉', script: '宝贝，约定平板1.5小时你超时了，这是要改正的。但妈妈受爸爸情绪影响对你发脾气，是妈妈不对，对不起。之后好好遵守时间，有问题好好沟通。' },
        { target: '对自己：解除苛责', actions: '自我默念疗愈句', script: '我只是情绪容器装满了，我是普通人可以失控；丈夫的压力不是我的责任；我懂得反思修复，就是合格的心理养育者。' },
        { target: '对丈夫：边界沟通', actions: '非指责式沟通', script: '我知道你上班压力大。但下次先不评价孩子人品，不把情绪丢给我。你先独处平复，我们统一温和立规矩。你外放的情绪会让我崩盘，最后伤到孩子。' }
      ],
      optimalFlow: [
        { step: 1, title: '给丈夫划边界', action: '我知道你生气，我们冷静处理，你先管好情绪，不要评价孩子人品。' },
        { step: 2, title: '单独温和找孩子', action: '约定超时了，现在交还平板，明天缩减游玩时长作为违约代价。' },
        { step: 3, title: '不承接丈夫抱怨', action: '你累可以休息，不用跟我倾诉负面情绪，育儿只谈规则不谈情绪。' }
      ],
      finalSummary: [
        { point: 1, content: '本次冲突导火索是孩子超时，真正引爆点是丈夫的压力转嫁。' },
        { point: 2, content: '你的失控是夹心人的本能自保，不是修行不够。' },
        { point: 3, content: '心理学带给你的不是永远温和，是事后看清脉络、及时修复、下次优化。' },
        { point: 4, content: '不用救赎所有人：只需要善待疲惫的自己。' }
      ]
    },
    {
      id: 'rec_seed_002',
      createdAt: new Date().toISOString(),
      recordType: 'warm',
      eventDate: '2024年母亲节',
      title: '儿子送的母亲节贺卡',
      warmType: '节日书信',
      reviewer: '母亲',
      peopleInvolved: [
        { name: '儿子', role: '孩子' },
        { name: '母亲', role: '收信人' }
      ],
      content: '母亲节那天，儿子悄悄在我枕头下放了一张自己画的贺卡。上面用歪歪扭扭的字写着："妈妈我爱你，你是世界上最好的妈妈。"旁边画了一朵小花和一个笑脸。那一刻，所有的疲惫都值得了。',
      photos: [],
      tags: ['母亲节', '贺卡', '感动', '孩子的爱'],
      mood: '感动、温暖、幸福'
    }
  ];

  fs.writeFileSync(DATA_FILE, JSON.stringify(seedRecords, null, 2), 'utf-8');
}

seedData();

// 扩大 JSON 限制以支持 base64 图片和视频
app.use(express.json({ limit: '200mb' }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOADS_DIR));

// API: 获取记录（支持按类型筛选）
app.get('/api/records', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    let records = JSON.parse(raw);
    const type = req.query.type;
    if (type === 'conflict' || type === 'warm' || type === 'album') {
      records = records.filter(r => r.recordType === type);
    }
    res.json(records);
  } catch (e) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// API: 获取单条记录
app.get('/api/records/:id', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const records = JSON.parse(raw);
    const record = records.find(r => r.id === req.params.id);
    if (!record) return res.status(404).json({ error: '记录不存在' });
    res.json(record);
  } catch (e) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// API: 创建记录
app.post('/api/records', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const records = JSON.parse(raw);
    const newRecord = {
      ...req.body,
      id: req.body.id || ('rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)),
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    records.push(newRecord);
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
    res.status(201).json(newRecord);
  } catch (e) {
    res.status(500).json({ error: '保存数据失败' });
  }
});

// API: 删除记录
app.delete('/api/records/:id', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    let records = JSON.parse(raw);
    const idx = records.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: '记录不存在' });
    records.splice(idx, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: '删除失败' });
  }
});

// API: 上传图片
app.post('/api/upload', (req, res) => {
  try {
    const { data, name } = req.body;
    if (!data) return res.status(400).json({ error: '未提供图片数据' });

    // 支持 base64 格式: data:image/jpeg;base64,xxxx 或 data:video/mp4;base64,xxxx
    let ext = 'jpg', base64Data = data;
    const imgMatch = data.match(/^data:image\/(\w+);base64,(.+)$/);
    const vidMatch = data.match(/^data:video\/(\w+);base64,(.+)$/);
    if (vidMatch) {
      ext = vidMatch[1] === 'quicktime' ? 'mov' : (vidMatch[1] || 'mp4');
      base64Data = vidMatch[2];
    } else if (imgMatch) {
      ext = imgMatch[1] === 'png' ? 'png' : 'jpg';
      base64Data = imgMatch[2];
    }
    const fileName = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) + '.' + ext;
    const filePath = path.join(UPLOADS_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    res.json({ url: '/uploads/' + fileName });
  } catch (e) {
    res.status(500).json({ error: '上传图片失败' });
  }
});

app.listen(PORT, () => {
  console.log(`🏠 吾之所爱已启动: http://localhost:${PORT}`);
  console.log(`   成长记录 + 温馨记录 + 照片上传`);
});
