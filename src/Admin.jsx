import React, { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, MessageSquare, LogOut,
  Plus, Search, Eye, EyeOff, Star, Pencil, Trash2,
  Upload, X, ChevronRight, Image, CheckCircle
} from 'lucide-react';

// ── 假資料 ──────────────────────────────────────────────
const MOCK_PROJECTS = [
  { id: 1, title: '九龍灣私人住宅', category: '住宅',   style: '現代簡約', year: 2024, area: 850,  published: true,  featured: true,  cover: 'https://placehold.co/120x80/1e293b/94a3b8?text=住宅'  },
  { id: 2, title: '中環咖啡店',     category: '商業',   style: '工業風',   year: 2024, area: 420,  published: true,  featured: false, cover: 'https://placehold.co/120x80/1e293b/94a3b8?text=商業'  },
  { id: 3, title: '沙田辦公室翻新', category: '辦公室', style: '北歐風',   year: 2023, area: 1200, published: false, featured: false, cover: 'https://placehold.co/120x80/1e293b/94a3b8?text=辦公室' },
  { id: 4, title: '屯門複式單位',   category: '住宅',   style: '日式',     year: 2023, area: 950,  published: true,  featured: false, cover: 'https://placehold.co/120x80/1e293b/94a3b8?text=住宅'  },
];

const MOCK_INQUIRIES = [
  { id: 1, name: '陳先生', phone: '9123 4567', email: 'chan@email.com',  message: '想了解住宅翻新報價', date: '2026-08-28', read: false },
  { id: 2, name: '李小姐', phone: '9234 5678', email: 'lee@email.com',   message: '商業空間設計查詢',   date: '2026-08-27', read: true  },
  { id: 3, name: '張生',   phone: '9345 6789', email: 'zhang@email.com', message: '辦公室裝修 800呎',   date: '2026-08-25', read: true  },
];

const NAV = [
  { id: 'dashboard', label: '儀表板',   icon: LayoutDashboard },
  { id: 'projects',  label: '案例管理', icon: FolderOpen       },
  { id: 'inquiries', label: '客戶查詢', icon: MessageSquare    },
];

// ── 共用樣式 ────────────────────────────────────────────
const S = {
  page:    { display:'flex', height:'100vh', background:'#0f172a', color:'#e2e8f0', fontFamily:'system-ui,sans-serif' },
  sidebar: { width:220, background:'#1e293b', display:'flex', flexDirection:'column', flexShrink:0, borderRight:'1px solid #334155' },
  main:    { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  header:  { height:56, background:'#1e293b', borderBottom:'1px solid #334155', display:'flex', alignItems:'center', padding:'0 24px', justifyContent:'space-between', flexShrink:0 },
  content: { flex:1, overflow:'auto', padding:24 },
  card:    { background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:20 },
  btn:     { display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600 },
  input:   { width:'100%', background:'#0f172a', border:'1px solid #334155', borderRadius:8, padding:'10px 12px', color:'#e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' },
  label:   { fontSize:12, fontWeight:600, color:'#94a3b8', marginBottom:6, display:'block' },
  badge:   (color) => ({
    display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
    background: color==='green'?'#052e16' : color==='yellow'?'#1c1917' : color==='purple'?'#1e1b4b' : '#172554',
    color:      color==='green'?'#4ade80' : color==='yellow'?'#fb923c' : color==='purple'?'#818cf8' : '#93c5fd',
  }),
};

// ── 儀表板 ──────────────────────────────────────────────
function Dashboard({ setView }) {
  const stats = [
    { label:'總案例數', value: MOCK_PROJECTS.length,                        color:'#3b82f6' },
    { label:'已發布',   value: MOCK_PROJECTS.filter(p=>p.published).length, color:'#22c55e' },
    { label:'精選案例', value: MOCK_PROJECTS.filter(p=>p.featured).length,  color:'#f59e0b' },
    { label:'新查詢',   value: MOCK_INQUIRIES.filter(i=>!i.read).length,    color:'#ec4899' },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>儀表板</h2>
        <button style={{ ...S.btn, background:'#2563eb', color:'#fff' }} onClick={()=>setView('new')}>
          <Plus size={14}/> 新增案例
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ ...S.card, borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontWeight:700 }}>最近案例</span>
          <button onClick={()=>setView('projects')}
            style={{ ...S.btn, background:'transparent', color:'#60a5fa', padding:'4px 8px' }}>
            查看全部 <ChevronRight size={14}/>
          </button>
        </div>
        <ProjectTable projects={MOCK_PROJECTS.slice(0,3)} compact />
      </div>
    </div>
  );
}

// ── 案例列表 ─────────────────────────────────────────────
function ProjectsPage({ setView }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('全部');
  const cats = ['全部','住宅','商業','辦公室'];

  const filtered = MOCK_PROJECTS.filter(p => {
    const matchCat    = filter === '全部' || p.category === filter;
    const matchSearch = p.title.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>案例管理</h2>
        <button style={{ ...S.btn, background:'#2563eb', color:'#fff' }} onClick={()=>setView('new')}>
          <Plus size={14}/> 新增案例
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:16, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:280 }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#64748b' }}/>
          <input style={{ ...S.input, paddingLeft:32 }} placeholder="搜尋案例名稱..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{ display:'flex', gap:4, background:'#0f172a', padding:4, borderRadius:8 }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              style={{ ...S.btn, padding:'5px 12px',
                background: filter===c ? '#2563eb' : 'transparent',
                color:      filter===c ? '#fff'    : '#94a3b8' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <ProjectTable projects={filtered} setView={setView}/>
      </div>
    </div>
  );
}

// ── 案例表格 ─────────────────────────────────────────────
function ProjectTable({ projects, compact, setView }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ borderBottom:'1px solid #334155' }}>
          {['封面','案例名稱','分類','年份','面積','狀態', compact?'':'操作'].map(h=>(
            <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'#64748b', fontWeight:600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map(p=>(
          <tr key={p.id} style={{ borderBottom:'1px solid #1e293b' }}>
            <td style={{ padding:'10px 12px' }}>
              <img src={p.cover} alt="" style={{ width:60, height:40, borderRadius:6, objectFit:'cover' }}/>
            </td>
            <td style={{ padding:'10px 12px' }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{p.title}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{p.style}</div>
            </td>
            <td style={{ padding:'10px 12px' }}>
              <span style={S.badge('blue')}>{p.category}</span>
            </td>
            <td style={{ padding:'10px 12px', fontSize:13, color:'#94a3b8' }}>{p.year}</td>
            <td style={{ padding:'10px 12px', fontSize:13, color:'#94a3b8' }}>{p.area} ft²</td>
            <td style={{ padding:'10px 12px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={S.badge(p.published?'green':'yellow')}>
                  {p.published ? '✓ 已發布' : '草稿'}
                </span>
                {p.featured && <span style={S.badge('purple')}>⭐ 精選</span>}
              </div>
            </td>
            {!compact && (
              <td style={{ padding:'10px 12px' }}>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>setView('edit')}
                    style={{ ...S.btn, background:'#1e3a5f', color:'#60a5fa', padding:'5px 10px' }}>
                    <Pencil size={12}/>
                  </button>
                  <button style={{ ...S.btn, background:'#2d1515', color:'#f87171', padding:'5px 10px' }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── 新增/編輯表單 ─────────────────────────────────────────
function ProjectForm({ setView, isEdit }) {
  const [published, setPublished] = useState(isEdit ? true  : false);
  const [featured,  setFeatured]  = useState(isEdit ? false : false);

  const Field = ({ label, children }) => (
    <div><label style={S.label}>{label}</label>{children}</div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={()=>setView('projects')}
          style={{ ...S.btn, background:'#1e293b', color:'#94a3b8', padding:'6px 12px' }}>
          ← 返回
        </button>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>
          {isEdit ? '編輯案例' : '新增案例'}
        </h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>

        {/* ── 左欄 ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* 基本資料 */}
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>📋 基本資料</div>
            <div style={{ marginBottom:16 }}>
              <Field label="案例名稱">
                <input style={S.input} placeholder="例：九龍灣私人住宅翻新"
                  defaultValue={isEdit ? '九龍灣私人住宅' : ''}/>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <Field label="分類">
                <select style={S.input}>
                  {['住宅','商業','辦公室'].map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="設計風格">
                <select style={S.input}>
                  {['現代簡約','北歐風','工業風','日式','古典'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <Field label="地點">
                <input style={S.input} placeholder="例：九龍灣" defaultValue={isEdit ? '九龍灣' : ''}/>
              </Field>
              <Field label="完成年份">
                <input style={S.input} type="number" defaultValue={2024}/>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <Field label="面積 (ft²)">
                <input style={S.input} type="number" placeholder="850" defaultValue={isEdit ? 850 : ''}/>
              </Field>
              <Field label="預算範圍">
                <select style={S.input}>
                  <option>$50-80萬</option>
                  <option>$80-120萬</option>
                  <option>$120萬以上</option>
                </select>
              </Field>
            </div>
            <Field label="案例描述">
              <textarea style={{ ...S.input, height:100, resize:'vertical' }}
                placeholder="描述這個案例的設計理念、特色..."
                defaultValue={isEdit ? '整個項目以現代簡約風格為主調，充分利用空間採光...' : ''}/>
            </Field>
          </div>

          {/* 圖片上傳 */}
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>🖼️ 案例圖片</div>
            <div
              style={{ border:'2px dashed #334155', borderRadius:10, padding:32, textAlign:'center', cursor:'pointer', marginBottom:16 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#2563eb'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#334155'}>
              <Upload size={28} style={{ color:'#64748b', marginBottom:8 }}/>
              <div style={{ color:'#94a3b8', fontSize:13 }}>拖曳圖片至此，或點擊上傳</div>
              <div style={{ color:'#64748b', fontSize:11, marginTop:4 }}>JPG / PNG，自動壓縮至 ≤1MB</div>
            </div>
            {isEdit && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {[1,2,3,4].map(i=>(
                  <div key={i} style={{ position:'relative', borderRadius:8, overflow:'hidden' }}>
                    <img src={`https://placehold.co/160x100/1e293b/475569?text=圖片${i}`}
                      style={{ width:'100%', display:'block' }}/>
                    <button style={{ position:'absolute', top:4, right:4, background:'#ef4444',
                      border:'none', borderRadius:4, padding:2, cursor:'pointer',
                      display:'flex', alignItems:'center' }}>
                      <X size={10} color="#fff"/>
                    </button>
                    {i===1 && (
                      <div style={{ position:'absolute', bottom:0, left:0, right:0,
                        background:'#2563eb', fontSize:9, textAlign:'center',
                        padding:'2px 0', fontWeight:700 }}>封面</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 右欄 ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* 發布設定 */}
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>⚙️ 發布設定</div>

            {/* 公開發布 Toggle */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontSize:13 }}>公開發布</span>
              <div onClick={()=>setPublished(!published)}
                style={{ width:40, height:22, borderRadius:11, cursor:'pointer', position:'relative', transition:'background 0.2s',
                  background: published ? '#2563eb' : '#334155' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3, transition:'left 0.2s',
                  left: published ? 21 : 3 }}/>
              </div>
            </div>

            {/* 置頂精選 Toggle */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontSize:13 }}>置頂精選</span>
              <div onClick={()=>setFeatured(!featured)}
                style={{ width:40, height:22, borderRadius:11, cursor:'pointer', position:'relative', transition:'background 0.2s',
                  background: featured ? '#f59e0b' : '#334155' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3, transition:'left 0.2s',
                  left: featured ? 21 : 3 }}/>
              </div>
            </div>

            <div style={{ borderTop:'1px solid #334155', paddingTop:14, display:'flex', flexDirection:'column', gap:8 }}>
              <button style={{ ...S.btn, background:'#2563eb', color:'#fff', justifyContent:'center' }}>
                <CheckCircle size={14}/> {isEdit ? '儲存更改' : '發布案例'}
              </button>
              <button style={{ ...S.btn, background:'transparent', color:'#94a3b8', justifyContent:'center', border:'1px solid #334155' }}>
                儲存草稿
              </button>
            </div>
          </div>

          {/* 標籤 */}
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:12, fontSize:14 }}>🏷️ 標籤</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
              {['翻新','新裝','開放式廚房','主人套房','玄關設計'].map(t=>(
                <span key={t} style={{ ...S.badge('blue'), cursor:'pointer' }}>{t} ×</span>
              ))}
            </div>
            <input style={S.input} placeholder="輸入標籤後按 Enter"/>
          </div>

          {/* 前台預覽 */}
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:12, fontSize:14 }}>👁 前台預覽</div>
            <div style={{ background:'#0f172a', borderRadius:8, overflow:'hidden' }}>
              <img src="https://placehold.co/280x160/0f172a/334155?text=封面圖片"
                style={{ width:'100%', display:'block' }}/>
              <div style={{ padding:12 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>
                  {isEdit ? '九龍灣私人住宅' : '案例名稱'}
                </div>
                <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>
                  現代簡約 · 850 ft² · 2024
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── 客戶查詢 ─────────────────────────────────────────────
function InquiriesPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h2 style={{ margin:'0 0 24px', fontSize:20, fontWeight:700 }}>客戶查詢</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16 }}>

        {/* 列表 */}
        <div style={S.card}>
          {MOCK_INQUIRIES.map(inq=>(
            <div key={inq.id} onClick={()=>setSelected(inq)}
              style={{ display:'flex', gap:12, padding:'12px 8px', borderBottom:'1px solid #1e293b',
                cursor:'pointer', alignItems:'flex-start', borderRadius:6,
                background: selected?.id===inq.id ? 'rgba(37,99,235,0.1)' : 'transparent' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#334155',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:700, fontSize:13, flexShrink:0 }}>
                {inq.name[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{inq.name}</span>
                  <span style={{ fontSize:11, color:'#64748b' }}>{inq.date}</span>
                </div>
                <div style={{ fontSize:12, color:'#94a3b8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {inq.message}
                </div>
              </div>
              {!inq.read && (
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#3b82f6', flexShrink:0, marginTop:4 }}/>
              )}
            </div>
          ))}
        </div>

        {/* 詳情 */}
        <div style={S.card}>
          {selected ? (
            <>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>查詢詳情</div>
              {[['姓名', selected.name], ['電話', selected.phone], ['電郵', selected.email]].map(([k,v])=>(
                <div key={k} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, color:'#64748b' }}>{k}</div>
                  <div style={{ fontSize:13, marginTop:2 }}>{v}</div>
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, color:'#64748b' }}>訊息</div>
                <div style={{ fontSize:13, marginTop:2, background:'#0f172a',
                  padding:10, borderRadius:8, lineHeight:1.6 }}>
                  {selected.message}
                </div>
              </div>
              <div style={{ fontSize:11, color:'#64748b', marginBottom:16 }}>日期：{selected.date}</div>
              <button style={{ ...S.btn, background:'#2563eb', color:'#fff', width:'100%', justifyContent:'center' }}>
                標記已回覆
              </button>
            </>
          ) : (
            <div style={{ color:'#475569', textAlign:'center', marginTop:60, fontSize:13 }}>
              ← 選擇查詢查看詳情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 主體 ─────────────────────────────────────────────────
export default function Admin({ onBack }) {
  const [view, setView] = useState('dashboard');

  const activeNav = view==='projects'||view==='new'||view==='edit'
    ? 'projects'
    : view==='inquiries'
    ? 'inquiries'
    : 'dashboard';

  const titles = {
    dashboard: '儀表板',
    projects:  '案例管理',
    inquiries: '客戶查詢',
    new:       '新增案例',
    edit:      '編輯案例',
  };

  return (
    <div style={S.page}>

      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid #334155' }}>
          <div style={{ fontWeight:800, fontSize:16 }}>🏠 設計管理系統</div>
          <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>Admin Panel</div>
        </div>

        <nav style={{ flex:1, padding:'12px 8px' }}>
          {NAV.map(({ id, label, icon:Icon })=>(
            <button key={id} onClick={()=>setView(id)}
              style={{ ...S.btn, width:'100%', justifyContent:'flex-start', marginBottom:2,
                background:   activeNav===id ? 'rgba(37,99,235,0.2)' : 'transparent',
                color:        activeNav===id ? '#60a5fa'              : '#94a3b8',
                borderLeft:   activeNav===id ? '2px solid #3b82f6'   : '2px solid transparent' }}>
              <Icon size={15}/> {label}
              {id==='inquiries' && (
                <span style={{ marginLeft:'auto', background:'#3b82f6', color:'#fff',
                  borderRadius:10, padding:'1px 6px', fontSize:10 }}>1</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding:'12px 8px', borderTop:'1px solid #334155' }}>
          <button style={{ ...S.btn, width:'100%', justifyContent:'flex-start', color:'#94a3b8', background:'transparent' }}>
            <LogOut size={14}/> 登出
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={S.main}>

        {/* Header */}
        <header style={S.header}>
          <span style={{ fontWeight:600, fontSize:14 }}>{titles[view]}</span>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>

            {/* 返回前台按鈕 */}
            <button onClick={onBack}
              style={{ display:'flex', alignItems:'center', gap:6,
                background:'transparent', border:'1px solid #334155',
                borderRadius:8, padding:'5px 12px', color:'#94a3b8',
                fontSize:12, cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#60a5fa'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#334155'; e.currentTarget.style.color='#94a3b8'; }}>
              ← 返回前台
            </button>

            <div style={{ fontSize:12, color:'#64748b' }}>管理員 · tabrisyuen</div>
          </div>
        </header>

        {/* Content */}
        <div style={S.content}>
          {view==='dashboard' && <Dashboard  setView={setView}/>}
          {view==='projects'  && <ProjectsPage setView={setView}/>}
          {view==='new'       && <ProjectForm setView={setView} isEdit={false}/>}
          {view==='edit'      && <ProjectForm setView={setView} isEdit={true}/>}
          {view==='inquiries' && <InquiriesPage/>}
        </div>

      </main>
    </div>
  );
}
