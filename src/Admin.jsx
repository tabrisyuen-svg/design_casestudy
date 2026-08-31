import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, FolderOpen, MessageSquare, LogOut,
  Plus, Search, Pencil, Trash2, Upload, X, ChevronRight, CheckCircle
} from 'lucide-react';
import { supabase } from './supabase';

async function uploadImage(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const name = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('Design_case').upload(name, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('Design_case').getPublicUrl(name);
  return publicUrl;
}

const NAV = [
  { id:'dashboard', label:'儀表板',   icon:LayoutDashboard },
  { id:'projects',  label:'案例管理', icon:FolderOpen      },
  { id:'inquiries', label:'客戶查詢', icon:MessageSquare   },
];

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
  badge:   (c) => ({
    display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
    background: c==='green'?'#052e16':c==='yellow'?'#1c1917':c==='purple'?'#1e1b4b':'#172554',
    color:      c==='green'?'#4ade80':c==='yellow'?'#fb923c':c==='purple'?'#818cf8':'#93c5fd',
  }),
};
function LoginPage({ onLogin }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { data, error } = await supabase.from('designers').select('admin_password').limit(1).maybeSingle();
    console.log('data:', data);
    console.log('error:', error);
    if (data?.admin_password === pw) { onLogin(); }
    else { setErr('密碼錯誤'); }
    setBusy(false);
  }
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f172a', color:'#e2e8f0' }}>
      <div style={{ background:'#1e293b', borderRadius:16, padding:36, width:340, border:'1px solid #334155' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🔐</div>
          <div style={{ fontWeight:800, fontSize:18 }}>管理後台</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>請輸入管理員密碼</div>
        </div>
        <form onSubmit={handle}>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="密碼"
            style={{ ...S.input, marginBottom:12 }}/>
          {err && <div style={{ color:'#f87171', fontSize:12, marginBottom:12 }}>{err}</div>}
          <button type="submit" disabled={busy}
            style={{ width:'100%', background:'#2563eb', color:'#fff', border:'none',
              borderRadius:8, padding:'11px 0', fontWeight:700, cursor:'pointer', opacity:busy?0.7:1 }}>
            {busy ? '驗證中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ projects, inquiries, setView }) {
  const stats = [
    { label:'總案例數', value:projects.length,                           color:'#3b82f6' },
    { label:'已發布',   value:projects.filter(p=>p.is_published).length, color:'#22c55e' },
    { label:'精選案例', value:projects.filter(p=>p.is_featured).length,  color:'#f59e0b' },
    { label:'新查詢',   value:inquiries.filter(i=>!i.is_read).length,    color:'#ec4899' },
  ];
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>儀表板</h2>
        <button style={{ ...S.btn, background:'#2563eb', color:'#fff' }} onClick={()=>setView('new')}>
          <Plus size={14}/> 新增案例
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ ...S.card, borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontWeight:700 }}>最近案例</span>
          <button onClick={()=>setView('projects')}
            style={{ ...S.btn, background:'transparent', color:'#60a5fa', padding:'4px 8px' }}>
            查看全部 <ChevronRight size={14}/>
          </button>
        </div>
        <ProjectTable projects={projects.slice(0,3)} compact/>
      </div>
    </div>
  );
}

function ProjectsPage({ projects, setView, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('全部');
  const cats = ['全部','住宅','商業','辦公室'];

  const filtered = projects.filter(p =>
    (filter==='全部'||p.category===filter) && p.title.includes(search)
  );

  async function handleDelete(id) {
    if (!window.confirm('確定刪除此案例？')) return;
    await supabase.from('projects').delete().eq('id', id);
    onDelete(id);
  }

  async function handleToggle(p) {
    const val = !p.is_published;
    await supabase.from('projects').update({ is_published: val }).eq('id', p.id);
    onToggle({ ...p, is_published: val });
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>案例管理</h2>
        <button style={{ ...S.btn, background:'#2563eb', color:'#fff' }} onClick={()=>setView('new')}>
          <Plus size={14}/> 新增案例
        </button>
      </div>
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
                background:filter===c?'#2563eb':'transparent',
                color:filter===c?'#fff':'#94a3b8' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <ProjectTable projects={filtered} onEdit={onEdit} onDelete={handleDelete} onToggle={handleToggle}/>
      </div>
    </div>
  );
}

function ProjectTable({ projects, compact, onEdit, onDelete, onToggle }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ borderBottom:'1px solid #334155' }}>
          {['封面','案例名稱','分類','年份','面積','狀態', compact?null:'操作'].filter(Boolean).map(h=>(
            <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'#64748b', fontWeight:600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map(p=>(
          <tr key={p.id} style={{ borderBottom:'1px solid #1e293b' }}>
            <td style={{ padding:'10px 12px' }}>
              <img src={p.cover_image_url||'https://placehold.co/60x40/1e293b/475569?text=無'} alt=""
                style={{ width:60, height:40, borderRadius:6, objectFit:'cover' }}/>
            </td>
            <td style={{ padding:'10px 12px' }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{p.title}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{p.style}</div>
            </td>
            <td style={{ padding:'10px 12px' }}><span style={S.badge('blue')}>{p.category}</span></td>
            <td style={{ padding:'10px 12px', fontSize:13, color:'#94a3b8' }}>{p.year}</td>
            <td style={{ padding:'10px 12px', fontSize:13, color:'#94a3b8' }}>{p.area} ft²</td>
            <td style={{ padding:'10px 12px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={S.badge(p.is_published?'green':'yellow')}>
                  {p.is_published?'✓ 已發布':'草稿'}
                </span>
                {p.is_featured && <span style={S.badge('purple')}>⭐ 精選</span>}
              </div>
            </td>
            {!compact && (
              <td style={{ padding:'10px 12px' }}>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>onToggle(p)}
                    style={{ ...S.btn, background:'#1a2535', color:'#94a3b8', padding:'5px 10px', fontSize:11 }}>
                    {p.is_published?'下架':'發布'}
                  </button>
                  <button onClick={()=>onEdit(p)}
                    style={{ ...S.btn, background:'#1e3a5f', color:'#60a5fa', padding:'5px 10px' }}>
                    <Pencil size={12}/>
                  </button>
                  <button onClick={()=>onDelete(p.id)}
                    style={{ ...S.btn, background:'#2d1515', color:'#f87171', padding:'5px 10px' }}>
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

function ProjectForm({ setView, isEdit, editProject, onSaved }) {
  const [form, setForm] = useState({
    title:        isEdit ? editProject.title        : '',
    category:     isEdit ? editProject.category     : '住宅',
    style:        isEdit ? editProject.style        : '現代簡約',
    location:     isEdit ? editProject.location     : '',
    year:         isEdit ? (editProject.year||'2024') : '2024',
    area:         isEdit ? editProject.area         : '',
    description:  isEdit ? editProject.description  : '',
    is_published: isEdit ? editProject.is_published : false,
    is_featured:  isEdit ? editProject.is_featured  : false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles,       setNewFiles]       = useState([]);
  const [saving,         setSaving]         = useState(false);
  const [msg,            setMsg]            = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (isEdit && editProject) {
      supabase.from('project_images').select('*')
        .eq('project_id', editProject.id).order('sort_order')
        .then(({ data }) => setExistingImages(data||[]));
    }
  }, []);

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    setNewFiles(prev=>[...prev, ...files.map(f=>({ file:f, preview:URL.createObjectURL(f) }))]);
  }

  async function removeExisting(img) {
    await supabase.from('project_images').delete().eq('id', img.id);
    setExistingImages(prev=>prev.filter(i=>i.id!==img.id));
  }

  async function handleSave(draft=false) {
    if (!form.title) { setMsg('請填寫案例名稱'); return; }
    setSaving(true); setMsg('');
    try {
      const payload = { ...form, is_published: draft ? false : form.is_published };
      let pid = isEdit ? editProject.id : null;

      if (isEdit) {
        await supabase.from('projects').update(payload).eq('id', pid);
      } else {
        const { data: np, error } = await supabase.from('projects').insert(payload).select().single();
        if (error) throw error;
        pid = np.id;
      }

      for (let i=0; i<newFiles.length; i++) {
        const url = await uploadImage(newFiles[i].file);
        await supabase.from('project_images').insert({ project_id:pid, image_url:url, sort_order:existingImages.length+i });
        if (existingImages.length===0 && i===0) {
          await supabase.from('projects').update({ cover_image_url:url }).eq('id', pid);
        }
      }

      setMsg('✅ 儲存成功');
      setTimeout(() => { onSaved(); setView('projects'); }, 800);
    } catch(e) {
      setMsg('❌ 儲存失敗：'+e.message);
    }
    setSaving(false);
  }

  const Field = ({ label, children }) => (
    <div><label style={S.label}>{label}</label>{children}</div>
  );

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={()=>setView('projects')}
          style={{ ...S.btn, background:'#1e293b', color:'#94a3b8', padding:'6px 12px' }}>← 返回</button>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>{isEdit?'編輯案例':'新增案例'}</h2>
        {msg && <span style={{ fontSize:13, color:msg.startsWith('✅')?'#4ade80':'#f87171' }}>{msg}</span>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        {/* 左欄 */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>📋 基本資料</div>
            <div style={{ marginBottom:16 }}>
              <Field label="案例名稱">
                <input style={S.input} value={form.title} onChange={e=>setF('title',e.target.value)} placeholder="例：九龍灣私人住宅翻新"/>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <Field label="分類">
                <select style={S.input} value={form.category} onChange={e=>setF('category',e.target.value)}>
                  {['住宅','商業','辦公室'].map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="設計風格">
                <select style={S.input} value={form.style} onChange={e=>setF('style',e.target.value)}>
                  {['現代簡約','北歐風','工業風','日式','古典'].map(s=><option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <Field label="地點">
                <input style={S.input} value={form.location} onChange={e=>setF('location',e.target.value)} placeholder="例：九龍灣"/>
              </Field>
              <Field label="完成年份">
                <input style={S.input} value={form.year} onChange={e=>setF('year',e.target.value)} placeholder="2024"/>
              </Field>
            </div>
            <div style={{ marginBottom:16 }}>
              <Field label="面積 (ft²)">
                <input style={S.input} value={form.area} onChange={e=>setF('area',e.target.value)} placeholder="850"/>
              </Field>
            </div>
            <Field label="案例描述">
              <textarea style={{ ...S.input, height:100, resize:'vertical' }}
                value={form.description} onChange={e=>setF('description',e.target.value)}
                placeholder="描述這個案例的設計理念、特色..."/>
            </Field>
          </div>

          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>🖼️ 案例圖片</div>
            <div onClick={()=>fileRef.current.click()}
              style={{ border:'2px dashed #334155', borderRadius:10, padding:32, textAlign:'center', cursor:'pointer', marginBottom:16 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#2563eb'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#334155'}>
              <Upload size={28} style={{ color:'#64748b', marginBottom:8 }}/>
              <div style={{ color:'#94a3b8', fontSize:13 }}>點擊上傳圖片</div>
              <div style={{ color:'#64748b', fontSize:11, marginTop:4 }}>JPG / PNG / WEBP</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFiles}/>

            {existingImages.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>現有圖片</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {existingImages.map((img,i)=>(
                    <div key={img.id} style={{ position:'relative', borderRadius:8, overflow:'hidden' }}>
                      <img src={img.image_url} style={{ width:'100%', height:70, objectFit:'cover', display:'block' }}/>
                      <button onClick={()=>removeExisting(img)}
                        style={{ position:'absolute', top:3, right:3, background:'#ef4444', border:'none',
                          borderRadius:4, padding:2, cursor:'pointer', display:'flex', alignItems:'center' }}>
                        <X size={10} color="#fff"/>
                      </button>
                      {i===0 && (
                        <div style={{ position:'absolute', bottom:0, left:0, right:0,
                          background:'#2563eb', fontSize:9, textAlign:'center', padding:'2px 0', fontWeight:700 }}>
                          封面
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newFiles.length > 0 && (
              <div>
                <div style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>待上傳</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {newFiles.map((f,i)=>(
                    <div key={i} style={{ position:'relative', borderRadius:8, overflow:'hidden' }}>
                      <img src={f.preview} style={{ width:'100%', height:70, objectFit:'cover', display:'block' }}/>
                      <button onClick={()=>setNewFiles(prev=>prev.filter((_,j)=>j!==i))}
                        style={{ position:'absolute', top:3, right:3, background:'#ef4444', border:'none',
                          borderRadius:4, padding:2, cursor:'pointer', display:'flex', alignItems:'center' }}>
                        <X size={10} color="#fff"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右欄 */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={S.card}>
            <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>⚙️ 發布設定</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontSize:13 }}>公開發布</span>
              <div onClick={()=>setF('is_published',!form.is_published)}
                style={{ width:40, height:22, borderRadius:11, cursor:'pointer', position:'relative', transition:'background 0.2s',
                  background:form.is_published?'#2563eb':'#334155' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3, transition:'left 0.2s',
                  left:form.is_published?21:3 }}/>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontSize:13 }}>置頂精選</span>
              <div onClick={()=>setF('is_featured',!form.is_featured)}
                style={{ width:40, height:22, borderRadius:11, cursor:'pointer', position:'relative', transition:'background 0.2s',
                  background:form.is_featured?'#f59e0b':'#334155' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3, transition:'left 0.2s',
                  left:form.is_featured?21:3 }}/>
              </div>
            </div>
            <div style={{ borderTop:'1px solid #334155', paddingTop:14, display:'flex', flexDirection:'column', gap:8 }}>
              <button onClick={()=>handleSave(false)} disabled={saving}
                style={{ ...S.btn, background:'#2563eb', color:'#fff', justifyContent:'center', opacity:saving?0.7:1 }}>
                <CheckCircle size={14}/> {isEdit?'儲存更改':'發布案例'}
              </button>
              <button onClick={()=>handleSave(true)} disabled={saving}
                style={{ ...S.btn, background:'transparent', color:'#94a3b8', justifyContent:'center',
                  border:'1px solid #334155', opacity:saving?0.7:1 }}>
                儲存草稿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InquiriesPage({ inquiries, onMarkRead }) {
  const [selected, setSelected] = useState(null);

  async function handleSelect(inq) {
    setSelected(inq);
    if (!inq.is_read) {
      await supabase.from('contact_submissions').update({ is_read:true }).eq('id', inq.id);
      onMarkRead(inq.id);
    }
  }

  return (
    <div>
      <h2 style={{ margin:'0 0 24px', fontSize:20, fontWeight:700 }}>客戶查詢</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16 }}>
        <div style={S.card}>
          {inquiries.length===0 && (
            <div style={{ color:'#475569', textAlign:'center', padding:'40px 0', fontSize:13 }}>暫無查詢</div>
          )}
          {inquiries.map(inq=>(
            <div key={inq.id} onClick={()=>handleSelect(inq)}
              style={{ display:'flex', gap:12, padding:'12px 8px', borderBottom:'1px solid #1e293b',
                cursor:'pointer', alignItems:'flex-start', borderRadius:6,
                background:selected?.id===inq.id?'rgba(37,99,235,0.1)':'transparent' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#334155',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:700, fontSize:13, flexShrink:0 }}>
                {(inq.sender_name||'?')[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{inq.sender_name}</span>
                  <span style={{ fontSize:11, color:'#64748b' }}>
                    {new Date(inq.created_at).toLocaleDateString('zh-HK')}
                  </span>
                </div>
                <div style={{ fontSize:12, color:'#94a3b8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {inq.message}
                </div>
                {inq.project_title && (
                  <div style={{ fontSize:11, color:'#3b82f6', marginTop:2 }}>📁 {inq.project_title}</div>
                )}
              </div>
              {!inq.is_read && (
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#3b82f6', flexShrink:0, marginTop:4 }}/>
              )}
            </div>
          ))}
        </div>

        <div style={S.card}>
          {selected ? (
            <>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>查詢詳情</div>
              {[['姓名',selected.sender_name],['電話',selected.sender_phone],['電郵',selected.sender_email],['項目',selected.project_title]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, color:'#64748b' }}>{k}</div>
                  <div style={{ fontSize:13, marginTop:2 }}>{v}</div>
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, color:'#64748b' }}>訊息</div>
                <div style={{ fontSize:13, marginTop:2, background:'#0f172a', padding:10, borderRadius:8, lineHeight:1.6 }}>
                  {selected.message}
                </div>
              </div>
              <div style={{ fontSize:11, color:'#64748b' }}>
                {new Date(selected.created_at).toLocaleString('zh-HK')}
              </div>
            </>
          ) : (
            <div style={{ color:'#475569', textAlign:'center', marginTop:60, fontSize:13 }}>← 選擇查詢查看詳情</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admin({ onBack }) {
  const [loggedIn,   setLoggedIn]   = useState(false);
  const [view,       setView]       = useState('dashboard');
  const [projects,   setProjects]   = useState([]);
  const [inquiries,  setInquiries]  = useState([]);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (!loggedIn) return;
    async function load() {
      const [{ data:p }, { data:i }] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending:false }),
      ]);
      if (p) setProjects(p);
      if (i) setInquiries(i);
    }
    load();
  }, [loggedIn]);

  if (!loggedIn) return <LoginPage onLogin={()=>setLoggedIn(true)}/>;

  const activeNav = view==='projects'||view==='new'||view==='edit' ? 'projects'
    : view==='inquiries' ? 'inquiries' : 'dashboard';

  const titles = { dashboard:'儀表板', projects:'案例管理', inquiries:'客戶查詢', new:'新增案例', edit:'編輯案例' };

  function handleEdit(p) { setEditTarget(p); setView('edit'); }
  function handleDelete(id) { setProjects(prev=>prev.filter(p=>p.id!==id)); }
  function handleToggle(updated) { setProjects(prev=>prev.map(p=>p.id===updated.id?updated:p)); }
  function handleMarkRead(id) { setInquiries(prev=>prev.map(i=>i.id===id?{...i,is_read:true}:i)); }
  async function handleSaved() {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    if (data) setProjects(data);
  }

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid #334155' }}>
          <div style={{ fontWeight:800, fontSize:16 }}>🏠 設計管理系統</div>
          <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>Admin Panel</div>
        </div>
        <nav style={{ flex:1, padding:'12px 8px' }}>
          {NAV.map(({ id, label, icon:Icon })=>(
            <button key={id} onClick={()=>setView(id)}
              style={{ ...S.btn, width:'100%', justifyContent:'flex-start', marginBottom:2,
                background:   activeNav===id?'rgba(37,99,235,0.2)':'transparent',
                color:        activeNav===id?'#60a5fa':'#94a3b8',
                borderLeft:   activeNav===id?'2px solid #3b82f6':'2px solid transparent' }}>
              <Icon size={15}/> {label}
              {id==='inquiries' && inquiries.filter(i=>!i.is_read).length > 0 && (
                <span style={{ marginLeft:'auto', background:'#3b82f6', color:'#fff',
                  borderRadius:10, padding:'1px 6px', fontSize:10 }}>
                  {inquiries.filter(i=>!i.is_read).length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding:'12px 8px', borderTop:'1px solid #334155' }}>
          <button onClick={()=>setLoggedIn(false)}
            style={{ ...S.btn, width:'100%', justifyContent:'flex-start', color:'#94a3b8', background:'transparent' }}>
            <LogOut size={14}/> 登出
          </button>
        </div>
      </aside>

      <main style={S.main}>
        <header style={S.header}>
          <span style={{ fontWeight:600, fontSize:14 }}>{titles[view]}</span>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={onBack}
              style={{ display:'flex', alignItems:'center', gap:6, background:'transparent',
                border:'1px solid #334155', borderRadius:8, padding:'5px 12px',
                color:'#94a3b8', fontSize:12, cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#60a5fa'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#334155'; e.currentTarget.style.color='#94a3b8'; }}>
              ← 返回前台
            </button>
            <div style={{ fontSize:12, color:'#64748b' }}>管理員</div>
          </div>
        </header>

        <div style={S.content}>
          {view==='dashboard' && <Dashboard projects={projects} inquiries={inquiries} setView={setView}/>}
          {view==='projects'  && <ProjectsPage projects={projects} setView={setView} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle}/>}
          {view==='new'       && <ProjectForm setView={setView} isEdit={false} editProject={null} onSaved={handleSaved}/>}
          {view==='edit'      && <ProjectForm setView={setView} isEdit={true}  editProject={editTarget} onSaved={handleSaved}/>}
          {view==='inquiries' && <InquiriesPage inquiries={inquiries} onMarkRead={handleMarkRead}/>}
        </div>
      </main>
    </div>
  );
}
