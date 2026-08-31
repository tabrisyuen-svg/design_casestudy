import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Instagram, Facebook,
  ChevronLeft, X, ChevronRight, ChevronLeft as Prev,
  Send, Check
} from 'lucide-react';

// ── 假資料 ──────────────────────────────────────────────
const DESIGNER = {
  name:    '袁設計師',
  title:   '室內設計師 / 創辦人',
  phone:   '9123 4567',
  email:   'design@studio.com',
  address: '香港九龍觀塘',
  ig:      '@designstudio_hk',
  avatar:  'https://placehold.co/120x120/1e293b/94a3b8?text=袁',
  bio:     '超過 10 年室內設計經驗，專注住宅及商業空間，致力為每位客戶創造獨特而實用的生活空間。',
};

const PROJECTS = [
  {
    id:1, title:'九龍灣私人住宅', category:'住宅', style:'現代簡約',
    year:2024, area:850, location:'九龍灣',
    desc:'整個項目以現代簡約風格為主調，充分利用空間採光，打造寬敞明亮的居住環境。開放式廚房與客廳相連，增加互動空間。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=九龍灣住宅',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=客廳',
      'https://placehold.co/800x500/243040/475569?text=主人房',
      'https://placehold.co/800x500/1a2535/475569?text=廚房',
      'https://placehold.co/800x500/1e293b/475569?text=浴室',
    ],
  },
  {
    id:2, title:'中環咖啡店', category:'商業', style:'工業風',
    year:2024, area:420, location:'中環',
    desc:'以工業風為設計主題，裸露天花配合溫暖燈光，營造舒適的咖啡廳氛圍。選用回收木材作為主要裝飾元素。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=中環咖啡店',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=大堂',
      'https://placehold.co/800x500/243040/475569?text=吧枱',
      'https://placehold.co/800x500/1a2535/475569?text=座位區',
    ],
  },
  {
    id:3, title:'沙田辦公室翻新', category:'辦公室', style:'北歐風',
    year:2023, area:1200, location:'沙田',
    desc:'北歐風辦公室設計，以白色為基調配合木紋元素，打造舒適的工作環境，提升員工生產力。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=沙田辦公室',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=開放工作區',
      'https://placehold.co/800x500/243040/475569?text=會議室',
      'https://placehold.co/800x500/1a2535/475569?text=休息室',
    ],
  },
  {
    id:4, title:'屯門複式單位', category:'住宅', style:'日式',
    year:2023, area:950, location:'屯門',
    desc:'日式簡約風格，善用複式結構打造層次感，木材與石材的結合帶出自然溫暖的感覺。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=屯門複式',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=客廳',
      'https://placehold.co/800x500/243040/475569?text=上層睡房',
      'https://placehold.co/800x500/1a2535/475569?text=浴室',
    ],
  },
  {
    id:5, title:'旺角精品店', category:'商業', style:'現代簡約',
    year:2023, area:280, location:'旺角',
    desc:'小空間大利用，以鏡面和燈光效果擴大視覺空間感，突出產品展示效果。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=旺角精品店',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=店面',
      'https://placehold.co/800x500/243040/475569?text=展示區',
    ],
  },
  {
    id:6, title:'將軍澳新居', category:'住宅', style:'工業風',
    year:2022, area:720, location:'將軍澳',
    desc:'工業風住宅設計，黑鐵架與木材的完美結合，打造個性鮮明的居住空間。',
    cover:'https://placehold.co/400x260/1e293b/475569?text=將軍澳新居',
    images:[
      'https://placehold.co/800x500/1e293b/475569?text=客廳',
      'https://placehold.co/800x500/243040/475569?text=書房',
      'https://placehold.co/800x500/1a2535/475569?text=主人房',
    ],
  },
];

const CATS   = ['全部','住宅','商業','辦公室'];
const STYLES = ['全部風格','現代簡約','北歐風','工業風','日式'];

// ── 樣式 ────────────────────────────────────────────────
const S = {
  page:    { display:'flex', minHeight:'100vh', background:'#0a0f1a', color:'#e2e8f0', fontFamily:'system-ui,sans-serif' },

  // 左側欄
  sidebar: {
    width:260, flexShrink:0, background:'#111827',
    borderRight:'1px solid #1f2937',
    display:'flex', flexDirection:'column',
    position:'sticky', top:0, height:'100vh', overflow:'auto',
  },

  // 右主內容
  main: { flex:1, overflow:'auto' },
};

// ── 左側欄：設計師資料 ───────────────────────────────────
function Sidebar({ onContact }) {
  return (
    <aside style={S.sidebar}>
      <div style={{ padding:28, display:'flex', flexDirection:'column', gap:0 }}>

        {/* 相片 + 名字 */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <img src={DESIGNER.avatar} alt="designer"
            style={{ width:100, height:100, borderRadius:'50%', objectFit:'cover',
              border:'3px solid #2563eb', marginBottom:12 }}/>
          <div style={{ fontWeight:800, fontSize:18, letterSpacing:0.5 }}>{DESIGNER.name}</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{DESIGNER.title}</div>
        </div>

        {/* 分隔線 */}
        <div style={{ borderTop:'1px solid #1f2937', marginBottom:20 }}/>

        {/* 簡介 */}
        <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.8, marginBottom:20 }}>
          {DESIGNER.bio}
        </p>

        {/* 分隔線 */}
        <div style={{ borderTop:'1px solid #1f2937', marginBottom:20 }}/>

        {/* 聯絡資訊 */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
          {[
            { icon:<Phone size={13}/>,   text:DESIGNER.phone   },
            { icon:<Mail size={13}/>,    text:DESIGNER.email   },
            { icon:<MapPin size={13}/>,  text:DESIGNER.address },
            { icon:<Instagram size={13}/>, text:DESIGNER.ig    },
          ].map(({icon,text})=>(
            <div key={text} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
              <span style={{ color:'#3b82f6', flexShrink:0 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* 聯絡按鈕 */}
        <button onClick={onContact}
          style={{ width:'100%', padding:'10px 0', background:'#2563eb', color:'#fff',
            border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer',
            letterSpacing:0.5 }}>
          ✉️ 聯絡我
        </button>

        {/* 統計 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:24 }}>
          {[['10+','年經驗'],['50+','完成案例'],['100%','客戶滿意']].map(([val,lab])=>(
            <div key={lab} style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:800, color:'#3b82f6' }}>{val}</div>
              <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>{lab}</div>
            </div>
          ))}
        </div>

      </div>
    </aside>
  );
}

// ── 案例卡片 ─────────────────────────────────────────────
function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:'#111827', border:`1px solid ${hovered?'#2563eb':'#1f2937'}`,
        borderRadius:12, overflow:'hidden', cursor:'pointer',
        transform: hovered?'translateY(-4px)':'none',
        transition:'all 0.2s', boxShadow: hovered?'0 8px 24px rgba(37,99,235,0.15)':'none' }}>
      <div style={{ position:'relative', overflow:'hidden' }}>
        <img src={project.cover} alt={project.title}
          style={{ width:'100%', height:180, objectFit:'cover', display:'block',
            transform: hovered?'scale(1.05)':'scale(1)', transition:'transform 0.3s' }}/>
        <div style={{ position:'absolute', top:10, left:10, display:'flex', gap:6 }}>
          <span style={{ background:'rgba(37,99,235,0.9)', color:'#fff', fontSize:10,
            fontWeight:700, padding:'3px 8px', borderRadius:20 }}>{project.category}</span>
          <span style={{ background:'rgba(0,0,0,0.7)', color:'#94a3b8', fontSize:10,
            padding:'3px 8px', borderRadius:20 }}>{project.style}</span>
        </div>
      </div>
      <div style={{ padding:'14px 16px' }}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{project.title}</div>
        <div style={{ display:'flex', gap:12, fontSize:11, color:'#64748b' }}>
          <span>📍 {project.location}</span>
          <span>📐 {project.area} ft²</span>
          <span>🗓 {project.year}</span>
        </div>
      </div>
    </div>
  );
}

// ── 案例列表 ─────────────────────────────────────────────
function ProjectList({ onSelect }) {
  const [cat,   setCat]   = useState('全部');
  const [style, setStyle] = useState('全部風格');

  const filtered = PROJECTS.filter(p => {
    const matchCat   = cat   === '全部'    || p.category === cat;
    const matchStyle = style === '全部風格' || p.style    === style;
    return matchCat && matchStyle;
  });

  return (
    <div style={{ padding:28 }}>

      {/* 頁面標題 */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>設計案例</h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#64748b' }}>
          共 {filtered.length} 個案例
        </p>
      </div>

      {/* 篩選 */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {/* 分類 */}
        <div style={{ display:'flex', gap:4, background:'#111827', padding:4, borderRadius:10, border:'1px solid #1f2937' }}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:600,
                background: cat===c?'#2563eb':'transparent',
                color:      cat===c?'#fff':'#64748b' }}>
              {c}
            </button>
          ))}
        </div>

        {/* 風格 */}
        <div style={{ display:'flex', gap:4, background:'#111827', padding:4, borderRadius:10, border:'1px solid #1f2937' }}>
          {STYLES.map(s=>(
            <button key={s} onClick={()=>setStyle(s)}
              style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:600,
                background: style===s?'#7c3aed':'transparent',
                color:      style===s?'#fff':'#64748b' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 卡片格 */}
      {filtered.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
          {filtered.map(p=>(
            <ProjectCard key={p.id} project={p} onClick={()=>onSelect(p)}/>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', color:'#475569', padding:'60px 0', fontSize:14 }}>
          沒有符合的案例
        </div>
      )}
    </div>
  );
}

// ── 案例詳情 ─────────────────────────────────────────────
function ProjectDetail({ project, onBack }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + project.images.length) % project.images.length);
  const next = () => setCurrent(i => (i + 1) % project.images.length);

  return (
    <div style={{ padding:28 }}>

      {/* 返回 */}
      <button onClick={onBack}
        style={{ display:'flex', alignItems:'center', gap:6, background:'transparent',
          border:'1px solid #1f2937', borderRadius:8, padding:'7px 14px',
          color:'#94a3b8', cursor:'pointer', fontSize:13, marginBottom:24 }}>
        <ChevronLeft size={14}/> 返回案例列表
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:24 }}>

        {/* 左：圖片 Gallery */}
        <div>
          {/* 主圖 */}
          <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:12, cursor:'pointer' }}
            onClick={()=>setLightbox(true)}>
            <img src={project.images[current]} alt=""
              style={{ width:'100%', height:380, objectFit:'cover', display:'block' }}/>
            {/* 箭頭 */}
            {project.images.length > 1 && <>
              <button onClick={e=>{e.stopPropagation();prev();}}
                style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                  background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%',
                  width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', color:'#fff' }}>
                <Prev size={16}/>
              </button>
              <button onClick={e=>{e.stopPropagation();next();}}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%',
                  width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', color:'#fff' }}>
                <ChevronRight size={16}/>
              </button>
              {/* 頁數 */}
              <div style={{ position:'absolute', bottom:12, right:12,
                background:'rgba(0,0,0,0.7)', color:'#fff', fontSize:11,
                padding:'3px 10px', borderRadius:20 }}>
                {current+1} / {project.images.length}
              </div>
            </>}
          </div>

          {/* 縮圖列 */}
          <div style={{ display:'flex', gap:8 }}>
            {project.images.map((img,i)=>(
              <img key={i} src={img} alt="" onClick={()=>setCurrent(i)}
                style={{ width:70, height:48, objectFit:'cover', borderRadius:6, cursor:'pointer',
                  border:`2px solid ${current===i?'#2563eb':'transparent'}`,
                  opacity: current===i?1:0.6, transition:'all 0.15s' }}/>
            ))}
          </div>
        </div>

        {/* 右：項目資料 */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={{ display:'flex', gap:6, marginBottom:10 }}>
              <span style={{ background:'rgba(37,99,235,0.2)', color:'#60a5fa',
                fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                {project.category}
              </span>
              <span style={{ background:'rgba(124,58,237,0.2)', color:'#a78bfa',
                fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                {project.style}
              </span>
            </div>
            <h2 style={{ margin:'0 0 8px', fontSize:20, fontWeight:800 }}>{project.title}</h2>
          </div>

          {/* 資料格 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              ['📍 地點', project.location],
              ['🗓 年份',  project.year],
              ['📐 面積',  `${project.area} ft²`],
              ['🎨 風格',  project.style],
            ].map(([k,v])=>(
              <div key={k} style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* 描述 */}
          <div style={{ background:'#0a0f1a', borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>項目描述</div>
            <p style={{ margin:0, fontSize:13, color:'#94a3b8', lineHeight:1.8 }}>{project.desc}</p>
          </div>

          {/* 查詢按鈕 */}
          <button style={{ width:'100%', padding:'11px 0', background:'#2563eb',
            color:'#fff', border:'none', borderRadius:10, fontWeight:700,
            fontSize:13, cursor:'pointer' }}>
            📩 查詢此項目
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={()=>setLightbox(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <button onClick={()=>setLightbox(false)}
            style={{ position:'absolute', top:20, right:20, background:'rgba(255,255,255,0.1)',
              border:'none', borderRadius:'50%', width:40, height:40, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <X size={18}/>
          </button>
          <button onClick={e=>{e.stopPropagation();prev();}}
            style={{ position:'absolute', left:20, background:'rgba(255,255,255,0.1)',
              border:'none', borderRadius:'50%', width:44, height:44, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <Prev size={20}/>
          </button>
          <img src={project.images[current]} alt=""
            style={{ maxWidth:'90vw', maxHeight:'85vh', borderRadius:8, objectFit:'contain' }}
            onClick={e=>e.stopPropagation()}/>
          <button onClick={e=>{e.stopPropagation();next();}}
            style={{ position:'absolute', right:20, background:'rgba(255,255,255,0.1)',
              border:'none', borderRadius:'50%', width:44, height:44, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <ChevronRight size={20}/>
          </button>
        </div>
      )}
    </div>
  );
}

// ── 聯絡表單 Modal ───────────────────────────────────────
function ContactModal({ onClose }) {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:500, padding:20 }}>
      <div style={{ background:'#111827', border:'1px solid #1f2937', borderRadius:16,
        width:'100%', maxWidth:440, padding:28, position:'relative' }}>

        <button onClick={onClose}
          style={{ position:'absolute', top:16, right:16, background:'transparent',
            border:'none', color:'#64748b', cursor:'pointer' }}>
          <X size={18}/>
        </button>

        {sent ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ width:56, height:56, background:'rgba(34,197,94,0.1)',
              borderRadius:'50%', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 16px' }}>
              <Check size={24} color="#22c55e"/>
            </div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>已成功傳送！</div>
            <div style={{ color:'#64748b', fontSize:13 }}>我們會盡快與你聯絡</div>
          </div>
        ) : (
          <>
            <h3 style={{ margin:'0 0 20px', fontSize:17, fontWeight:800 }}>聯絡我們</h3>

            {[
              { label:'姓名',    placeholder:'你的名字',       type:'text'  },
              { label:'電話',    placeholder:'9123 4567',      type:'tel'   },
              { label:'電郵',    placeholder:'email@example.com', type:'email' },
            ].map(({label,placeholder,type})=>(
              <div key={label} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:600, color:'#64748b',
                  display:'block', marginBottom:5 }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  style={{ width:'100%', background:'#0a0f1a', border:'1px solid #1f2937',
                    borderRadius:8, padding:'9px 12px', color:'#e2e8f0',
                    fontSize:13, outline:'none', boxSizing:'border-box' }}/>
              </div>
            ))}

            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, fontWeight:600, color:'#64748b',
                display:'block', marginBottom:5 }}>查詢內容</label>
              <textarea placeholder="請描述你的裝修需求、面積、預算等..." rows={3}
                style={{ width:'100%', background:'#0a0f1a', border:'1px solid #1f2937',
                  borderRadius:8, padding:'9px 12px', color:'#e2e8f0', fontSize:13,
                  outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </div>

            <button onClick={()=>setSent(true)}
              style={{ width:'100%', padding:'11px 0', background:'#2563eb',
                color:'#fff', border:'none', borderRadius:10, fontWeight:700,
                fontSize:13, cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', gap:8 }}>
              <Send size={13}/> 傳送查詢
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── 主體 ─────────────────────────────────────────────────
export default function Frontend() {
  const [selected, setSelected] = useState(null);
  const [contact,  setContact]  = useState(false);

  return (
    <div style={S.page}>
      <Sidebar onContact={()=>setContact(true)}/>

      <main style={S.main}>
        {selected
          ? <ProjectDetail project={selected} onBack={()=>setSelected(null)}/>
          : <ProjectList   onSelect={setSelected}/>
        }
      </main>

      {contact && <ContactModal onClose={()=>setContact(false)}/>}
    </div>
  );
}
