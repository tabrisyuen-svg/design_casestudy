import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Instagram,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

// ── 假資料 ──────────────────────────────────────────────
const DESIGNER = {
  name:    '袁設計師',
  title:   '室內設計師 / 創辦人',
  phone:   '9123 4567',
  email:   'design@studio.com',
  address: '香港九龍觀塘',
  ig:      '@designstudio_hk',
  wechat:  'designstudio_hk',
  avatar:  'https://placehold.co/120x120/1e293b/94a3b8?text=袁',
  bio:     '超過 10 年室內設計經驗，專注住宅及商業空間，致力為每位客戶創造獨特而實用的生活空間。',
};

const CATS   = ['全部', '住宅', '商業', '辦公室'];
const STYLES = ['全部風格', '現代簡約', '北歐風', '工業風', '日式'];

const S = {
  page:    { display:'flex', minHeight:'100vh', background:'#0a0f1a', color:'#e2e8f0', fontFamily:'system-ui,sans-serif' },
  sidebar: { width:260, flexShrink:0, background:'#111827', borderRight:'1px solid #1f2937',
             display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflow:'auto' },
  main:    { flex:1, overflow:'auto' },
};

// ── WeChat Icon ──────────────────────────────────────────
function WeChatIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 10.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Z"/>
      <path d="M14 10.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Z"/>
      <path d="M17.5 14.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Z"/>
      <path d="M12.5 14.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Z"/>
      <path d="M21 12c0-4.418-4.03-8-9-8s-9 3.582-9 8c0 1.98.78 3.8 2.07 5.19L4 20l3.29-.82A9.5 9.5 0 0 0 12 20c4.97 0 9-3.582 9-8Z"/>
    </svg>
  );
}

// ── Sidebar ──────────────────────────────────────────────
function Sidebar({ onEnterAdmin }) {
  return (
    <aside style={S.sidebar}>
      <div style={{ padding:28, display:'flex', flexDirection:'column' }}>

        <div style={{ textAlign:'center', marginBottom:24 }}>
          <img src={DESIGNER.avatar} alt="designer"
            style={{ width:100, height:100, borderRadius:'50%', objectFit:'cover',
              border:'3px solid #2563eb', marginBottom:12 }}/>
          <div style={{ fontWeight:800, fontSize:18 }}>{DESIGNER.name}</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{DESIGNER.title}</div>
        </div>

        <div style={{ borderTop:'1px solid #1f2937', marginBottom:20 }}/>

        <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.8, marginBottom:20 }}>
          {DESIGNER.bio}
        </p>

        <div style={{ borderTop:'1px solid #1f2937', marginBottom:20 }}/>

        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>

          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
            <span style={{ color:'#3b82f6', flexShrink:0 }}><Phone size={13}/></span>
            <span>{DESIGNER.phone}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
            <span style={{ color:'#3b82f6', flexShrink:0 }}><Mail size={13}/></span>
            <span>{DESIGNER.email}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
            <span style={{ color:'#3b82f6', flexShrink:0 }}><MapPin size={13}/></span>
            <span>{DESIGNER.address}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
            <span style={{ color:'#3b82f6', flexShrink:0 }}><Instagram size={13}/></span>
            <span>{DESIGNER.ig}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8' }}>
            <span style={{ color:'#3b82f6', flexShrink:0 }}><WeChatIcon/></span>
            <span><span style={{ color:'#64748b', marginRight:4 }}>WeChat:</span>{DESIGNER.wechat}</span>
          </div>

        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:32 }}>
          <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#3b82f6' }}>10+</div>
            <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>年經驗</div>
          </div>
          <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#3b82f6' }}>50+</div>
            <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>完成案例</div>
          </div>
          <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#3b82f6' }}>100%</div>
            <div style={{ fontSize:10, color:'#64748b', marginTop:2 }}>客戶滿意</div>
          </div>
        </div>

        <button
          onClick={onEnterAdmin}
          style={{ width:'100%', padding:'8px 0', background:'transparent',
            border:'1px solid #1f2937', borderRadius:8, color:'#334155',
            fontSize:11, cursor:'pointer', letterSpacing:0.5 }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#64748b';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1f2937';
            e.currentTarget.style.color = '#334155';
          }}>
          ⚙️ 管理後台
        </button>

      </div>
    </aside>
  );
}

// ── 案例卡片 ─────────────────────────────────────────────
function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background:'#111827', border:`1px solid ${hovered ? '#2563eb' : '#1f2937'}`,
        borderRadius:12, overflow:'hidden', cursor:'pointer',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition:'all 0.2s',
        boxShadow: hovered ? '0 8px 24px rgba(37,99,235,0.15)' : 'none' }}>
      <div style={{ position:'relative', overflow:'hidden' }}>
        <img src={project.cover} alt={project.title}
          style={{ width:'100%', height:180, objectFit:'cover', display:'block',
            transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform 0.3s' }}/>
        <div style={{ position:'absolute', top:10, left:10, display:'flex', gap:6 }}>
          <span style={{ background:'rgba(37,99,235,0.9)', color:'#fff',
            fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
            {project.category}
          </span>
          <span style={{ background:'rgba(0,0,0,0.7)', color:'#94a3b8',
            fontSize:10, padding:'3px 8px', borderRadius:20 }}>
            {project.style}
          </span>
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
  const [cat,      setCat]      = useState('全部');
  const [style,    setStyle]    = useState('全部風格');
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter(p => {
    const matchCat   = cat   === '全部'    || p.category === cat;
    const matchStyle = style === '全部風格' || p.style    === style;
    return matchCat && matchStyle;
  });

  if (loading) return (
    <div style={{ padding:28, color:'#64748b', fontSize:14 }}>載入中...</div>
  );

  return (
    <div style={{ padding:28 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>設計案例</h1>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#64748b' }}>共 {filtered.length} 個案例</p>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        <div style={{ display:'flex', gap:4, background:'#111827', padding:4,
          borderRadius:10, border:'1px solid #1f2937' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:600,
                background: cat === c ? '#2563eb' : 'transparent',
                color:      cat === c ? '#fff'    : '#64748b' }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:4, background:'#111827', padding:4,
          borderRadius:10, border:'1px solid #1f2937' }}>
          {STYLES.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:600,
                background: style === s ? '#7c3aed' : 'transparent',
                color:      style === s ? '#fff'    : '#64748b' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => onSelect(p)}/>
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
  const [current,  setCurrent]  = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + project.images.length) % project.images.length);
  const next = () => setCurrent(i => (i + 1) % project.images.length);

  return (
    <div style={{ padding:28 }}>
      <button onClick={onBack}
        style={{ display:'flex', alignItems:'center', gap:6, background:'transparent',
          border:'1px solid #1f2937', borderRadius:8, padding:'7px 14px',
          color:'#94a3b8', cursor:'pointer', fontSize:13, marginBottom:24 }}>
        <ChevronLeft size={14}/> 返回案例列表
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:24 }}>

        <div>
          <div style={{ position:'relative', borderRadius:12, overflow:'hidden',
            marginBottom:12, cursor:'pointer' }}
            onClick={() => setLightbox(true)}>
            <img src={project.images[current]} alt=""
              style={{ width:'100%', height:380, objectFit:'cover', display:'block' }}/>
            {project.images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev(); }}
                  style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                    background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%',
                    width:36, height:36, display:'flex', alignItems:'center',
                    justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                  <ChevronLeft size={16}/>
                </button>
                <button onClick={e => { e.stopPropagation(); next(); }}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%',
                    width:36, height:36, display:'flex', alignItems:'center',
                    justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                  <ChevronRight size={16}/>
                </button>
                <div style={{ position:'absolute', bottom:12, right:12,
                  background:'rgba(0,0,0,0.7)', color:'#fff', fontSize:11,
                  padding:'3px 10px', borderRadius:20 }}>
                  {current + 1} / {project.images.length}
                </div>
              </>
            )}
          </div>

          <div style={{ display:'flex', gap:8 }}>
            {project.images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setCurrent(i)}
                style={{ width:70, height:48, objectFit:'cover', borderRadius:6,
                  cursor:'pointer', transition:'all 0.15s',
                  border:`2px solid ${current === i ? '#2563eb' : 'transparent'}`,
                  opacity: current === i ? 1 : 0.6 }}/>
            ))}
          </div>
        </div>

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

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>📍 地點</div>
              <div style={{ fontSize:13, fontWeight:600 }}>{project.location}</div>
            </div>
            <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>🗓 年份</div>
              <div style={{ fontSize:13, fontWeight:600 }}>{project.year}</div>
            </div>
            <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>📐 面積</div>
              <div style={{ fontSize:13, fontWeight:600 }}>{project.area} ft²</div>
            </div>
            <div style={{ background:'#0a0f1a', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>🎨 風格</div>
              <div style={{ fontSize:13, fontWeight:600 }}>{project.style}</div>
            </div>
          </div>

          <div style={{ background:'#0a0f1a', borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>項目描述</div>
            <p style={{ margin:0, fontSize:13, color:'#94a3b8', lineHeight:1.8 }}>{project.desc}</p>
          </div>

          <button style={{ width:'100%', padding:'11px 0', background:'#2563eb',
            color:'#fff', border:'none', borderRadius:10, fontWeight:700,
            fontSize:13, cursor:'pointer' }}>
            📩 查詢此項目
          </button>
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <button onClick={() => setLightbox(false)}
            style={{ position:'absolute', top:20, right:20, background:'rgba(255,255,255,0.1)',
              border:'none', borderRadius:'50%', width:40, height:40, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <X size={18}/>
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position:'absolute', left:20, background:'rgba(255,255,255,0.1)',
              border:'none', borderRadius:'50%', width:44, height:44, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <ChevronLeft size={20}/>
          </button>
          <img src={project.images[current]} alt=""
            style={{ maxWidth:'90vw', maxHeight:'85vh', borderRadius:8, objectFit:'contain' }}
            onClick={e => e.stopPropagation()}/>
          <button onClick={e => { e.stopPropagation(); next(); }}
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

// ── 主體 ─────────────────────────────────────────────────
export default function Frontend({ onEnterAdmin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={S.page}>
      <Sidebar onEnterAdmin={onEnterAdmin}/>
      <main style={S.main}>
        {selected
          ? <ProjectDetail project={selected} onBack={() => setSelected(null)}/>
          : <ProjectList   onSelect={setSelected}/>
        }
      </main>
    </div>
  );
}
