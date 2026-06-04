import React, { useState } from "react";
import { Camera, Check, Plus, Trash2, ArrowLeft, Link as LinkIcon, FileText, ShoppingCart, MapPin, Contact as ContactIcon, BookOpen, Receipt, Package, Wallet, Activity, Users, Carrot, AlertTriangle, AlertOctagon } from "lucide-react";
import { useStore } from "./Equivesa";
import { MapEditor } from "./MapEditor";

const C = {
  bg: "#F2F5F8", surface: "#FFFFFF", line: "#E3E8EE",
  ink: "#0E151E", sub: "#64748B", field: "#F8FAFC",
  mint: "#2FB6A0", mintSoft: "#E0F5F2", coral: "#FF8C70", sky: "#5AB2FF", amber: "#FFB03A"
};

const inputStyle = (err) => ({
  width: "100%", padding: "16px 20px", borderRadius: 16,
  border: `1.5px solid ${err ? C.coral : C.line}`, background: err ? "#fff" : C.field,
  fontSize: 16, color: C.ink, transition: "border .2s, box-shadow .2s",
  outline: "none"
});

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label} {required && <span style={{ color: C.coral }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export function PhotoUpload({ url, onChange, uploading, setUploading, icon: Icon = Camera }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "equivesa_uploads");
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daj1lyfgk";
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) onChange(data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
      <label style={{
        width: 140, height: 140, borderRadius: "30%", border: `2px dashed ${C.line}`,
        background: C.field, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: C.sub, gap: 8, overflow: "hidden", position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
      }}>
        {url ? (
          <img src={url} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : uploading ? (
          <span style={{ fontSize: 14, fontWeight: 600 }}>Up...</span>
        ) : (
          <>
            <Icon size={36} strokeWidth={1.5} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Upload</span>
          </>
        )}
        <input type="file" accept="image/*,application/pdf" onChange={handleUpload} style={{ display: "none" }} />
      </label>
    </div>
  );
}

export function EditorLayout({ t, title, icon: Icon, color, onClose, onSave, onDelete, children }) {
  return (
    <div style={{ background: C.field, borderRadius: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 180px)", animation: "evFade .2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 24px", background: C.surface, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}>
        <span style={{ width: 48, height: 48, borderRadius: 16, display: "grid", placeItems: "center", background: `${color}1c`, color: color, flexShrink: 0 }}>
          <Icon size={22} />
        </span>
        <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</h2>
        <button onClick={onClose} className="ev-tap" style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={26} color={C.ink} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", gap: 24 }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 24px", background: C.surface, borderTop: `1px solid ${C.line}`, flexShrink: 0, display: "flex", gap: 12 }}>
        {onDelete && (
          <button onClick={onDelete} className="ev-tap" style={{ padding: "18px", borderRadius: 16, border: `1.5px solid ${C.coral}`, background: "transparent", color: C.coral, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Trash2 size={20} />
          </button>
        )}
        <button onClick={onSave} className="ev-tap" style={{ flex: 1, padding: "18px", borderRadius: 16, border: "none", background: color, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${color}55` }}>
          <Check size={20} strokeWidth={2.5} /> {t?.save || "Save"}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Specific Editors
// ----------------------------------------------------------------------

export function ContactEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { name: "", company: "", email: "", phone: "", role: "other", website: "", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const ROLES = [
    { id: "owner", emoji: "👑" },
    { id: "vet", emoji: "🩺" },
    { id: "farrier", emoji: "🔨" },
    { id: "rider", emoji: "🏇" },
    { id: "supplier", emoji: "📦" },
    { id: "trainer", emoji: "🎓" },
    { id: "other", emoji: "👤" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Contact"} icon={ContactIcon} color={C.sky} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={ContactIcon} />
      
      <Field label={t.role || "Role"}>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {ROLES.map(r => {
            const isSel = f.role === r.id;
            return (
              <button key={r.id} type="button" onClick={() => setF({...f, role: r.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{r.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{t[`role_${r.id}`] || r.id.charAt(0).toUpperCase() + r.id.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={t.name || "Name"} required>
        <input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. John Doe" style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label={t.company || "Company"}>
          <input value={f.company || ""} onChange={(e) => setF({...f, company: e.target.value})} placeholder="Company Name" style={{...inputStyle(), background: C.surface}} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.phone || "Phone"}>
            <input value={f.phone || ""} onChange={(e) => setF({...f, phone: e.target.value})} placeholder="+31 6..." style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label={t.email || "Email"}>
            <input value={f.email || ""} onChange={(e) => setF({...f, email: e.target.value})} placeholder="mail@..." style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Additional information..." />
      </Field>
    </EditorLayout>
  );
}

export function ClientEditor(props) {
  return <ContactEditor {...props} />;
}

export function LocationEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { name: "", location_type: "stable", capacity: "", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const TYPES = [
    { id: "stable", label: "Stable / Barn", emoji: "🏠" },
    { id: "paddock", label: "Paddock", emoji: "🌳" },
    { id: "arena", label: "Arena", emoji: "🏇" },
    { id: "pasture", label: "Pasture", emoji: "🌾" },
    { id: "clinic", label: "Clinic", emoji: "🏥" },
    { id: "other", label: "Other", emoji: "📍" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Location"} icon={MapPin} color={C.amber} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={MapPin} />
      
      <Field label="Location Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {TYPES.map(cat => {
            const isSel = f.location_type === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, location_type: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.amber : C.line}`, background: isSel ? C.amber : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={t.name || "Name"} required>
        <input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. Main Barn..." style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Capacity (Max Horses)">
          <input type="number" value={f.capacity || ""} onChange={(e) => setF({...f, capacity: e.target.value})} placeholder="e.g. 20" style={{...inputStyle(), background: C.surface}} />
        </Field>
        <Field label={t.notes || "Notes"}>
          <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.surface }} placeholder="Additional information..." />
        </Field>
      </div>
      {initialData && initialData.id && (
        <MapEditor locationId={initialData.id} />
      )}
    </EditorLayout>
  );
}

export function DocumentEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  // DB columns: name, url, category, notes, horse_id, file_type
  const [f, setF] = useState(initialData || { name: "", category: "passport", horse_id: "", url: "", notes: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const TYPES = [
    { id: "passport", label: "Passport", emoji: "🛂" },
    { id: "contract", label: "Contract", emoji: "📝" },
    { id: "vet_report", label: "Vet Report", emoji: "🩺" },
    { id: "invoice", label: "Invoice", emoji: "🧾" },
    { id: "registration", label: "Registration", emoji: "🎖️" },
    { id: "pedigree", label: "Pedigree", emoji: "🧬" },
    { id: "other", label: "Other", emoji: "📁" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Document"} icon={FileText} color={C.mint} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.url} onChange={(url) => setF({...f, url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      
      <Field label="Document Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {TYPES.map(cat => {
            const isSel = f.category === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, category: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.mint : C.line}`, background: isSel ? C.mint : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Document Name" required>
          <input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. Purchase Contract" style={{...inputStyle(err), background: C.surface}} />
        </Field>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Extra info..." />
      </Field>
    </EditorLayout>
  );
}


export function SupplyEditor({ t, initialData, lang, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { item_name: "", quantity: "", requested_by: "", notes: "", photo_url: "", amazon_link: "", report_type: "supply" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const COMMON = {
    nl: ["Hooi", "Stro", "Houtkrullen", "Vlas", "Biks", "Muesli", "Slobber", "Wortels", "Appels", "Liksteen", "Zalf", "Shampoo", "Tape", "Watten", "Vliegenspray", "Huidolie"],
    en: ["Hay", "Straw", "Shavings", "Flax", "Pellets", "Muesli", "Mash", "Carrots", "Apples", "Salt block", "Ointment", "Shampoo", "Tape", "Cotton", "Fly spray", "Skin oil"],
    es: ["Heno", "Paja", "Virutas", "Lino", "Pellets", "Muesli", "Papilla", "Zanahorias", "Manzanas", "Bloque de sal", "Pomada", "Champú", "Cinta", "Algodón", "Aerosol para moscas", "Aceite para la piel"]
  };
  const suggestions = COMMON[lang] || COMMON.en;

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addSupply || "Add Supply Request"} icon={ShoppingCart} color={C.coral} onClose={onClose} onSave={() => f.item_name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      
      <Field label={t.supplyItem || "Item"} required>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, item_name: s}); setErr(false); }}
              className="ev-tap"
              style={{
                flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.item_name === s ? C.coral : C.line}`,
                background: f.item_name === s ? C.coral : C.surface, color: f.item_name === s ? "#fff" : C.sub,
                fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.item_name} onChange={(e) => { setF({...f, item_name: e.target.value}); setErr(false); }} placeholder="Or type custom item..." style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.qty || "Qty"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => setF({...f, quantity: Math.max(1, (parseInt(f.quantity) || 1) - 1).toString()})} style={{ width: 48, height: 48, borderRadius: 14, border: `1px solid ${C.line}`, background: C.surface, cursor: "pointer", fontSize: 20 }}>-</button>
              <input value={f.quantity || "1"} onChange={(e) => setF({...f, quantity: e.target.value})} style={{ ...inputStyle(), textAlign: "center", padding: "14px 0", flex: 1, background: C.surface }} />
              <button type="button" onClick={() => setF({...f, quantity: ((parseInt(f.quantity) || 0) + 1).toString()})} style={{ width: 48, height: 48, borderRadius: 14, border: `1px solid ${C.line}`, background: C.surface, cursor: "pointer", fontSize: 20 }}>+</button>
            </div>
          </Field>
          <Field label={t.requestedBy || "Requested By"}>
            <input value={f.requested_by || ""} onChange={(e) => setF({...f, requested_by: e.target.value})} placeholder="Your name..." style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>

        <Field label="Amazon / Webshop Link">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.coral}14`, display: "grid", placeItems: "center", color: C.coral, flexShrink: 0 }}><LinkIcon size={20} /></div>
            <input value={f.amazon_link || ""} onChange={(e) => setF({...f, amazon_link: e.target.value})} placeholder="https://amazon..." style={{ ...inputStyle(), flex: 1, background: C.surface }} />
          </div>
        </Field>
      </div>

      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Extra info..." /></Field>

    </EditorLayout>
  );
}

export function FinanceEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { type: "expense", category: "catFeed", amount: "", description: "", reference: "", horse_id: "", date: new Date().toISOString().split("T")[0], receipt_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const CATS = [
    { id: "catFeed", emoji: "🌾" },
    { id: "catVet", emoji: "🩺" },
    { id: "catFarrier", emoji: "🔨" },
    { id: "catBoard", emoji: "🏠" },
    { id: "catConcours", emoji: "🏆" },
    { id: "catOther", emoji: "🛒" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addTransaction || "Add Transaction"} icon={Wallet} color={C.mint} onClose={onClose} onSave={() => f.amount && f.description.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.receipt_url} onChange={(url) => setF({...f, receipt_url: url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      
      <Field label="Transaction Type">
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button type="button" onClick={() => setF({...f, type: "income"})} className="ev-tap"
            style={{ flex: 1, padding: "18px", borderRadius: 16, border: `2px solid ${f.type === "income" ? C.mint : C.line}`, background: f.type === "income" ? C.mint : C.surface, color: f.type === "income" ? "#fff" : C.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
            <span style={{ fontSize: 28 }}>📈</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{t.income || "Income"}</span>
          </button>
          <button type="button" onClick={() => setF({...f, type: "expense"})} className="ev-tap"
            style={{ flex: 1, padding: "18px", borderRadius: 16, border: `2px solid ${f.type === "expense" ? C.coral : C.line}`, background: f.type === "expense" ? C.coral : C.surface, color: f.type === "expense" ? "#fff" : C.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
            <span style={{ fontSize: 28 }}>📉</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{t.expenses || "Expense"}</span>
          </button>
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.amount || "Amount (€)"} required>
            <input type="number" step="0.01" value={f.amount} onChange={(e) => { setF({...f, amount: e.target.value}); setErr(false); }} placeholder="0.00" style={{...inputStyle(err && !f.amount), background: C.surface, fontSize: 18, fontWeight: 700, color: f.type === "income" ? C.mint : C.coral}} />
          </Field>
          <Field label="Date" required>
            <input type="date" value={f.date || ""} onChange={(e) => setF({...f, date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
        <Field label={t.description || "Description"} required>
          <input value={f.description} onChange={(e) => { setF({...f, description: e.target.value}); setErr(false); }} placeholder="e.g. New saddle" style={{...inputStyle(err && !f.description), background: C.surface}} />
        </Field>
      </div>

      <Field label={t.fCategory || "Category"}>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {CATS.map(r => {
            const isSel = f.category === r.id;
            return (
              <button key={r.id} type="button" onClick={() => setF({...f, category: r.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.mint : C.line}`, background: isSel ? C.mint : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{r.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{t[r.id] || r.id.replace("cat", "")}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={t.reference || "Reference"}>
        <input value={f.reference || ""} onChange={(e) => setF({...f, reference: e.target.value})} placeholder="Invoice #..." style={inputStyle()} />
      </Field>
    </EditorLayout>
  );
}

export function TaskEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { title: "", description: "", due_date: "", start_time: "", end_time: "", category: "general", horse_id: null, photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Quick suggestions for tasks to save typing
  const SUGGESTIONS = {
    general: ["Clean stable", "Sweep aisle", "Wash blankets", "Order feed", "Fix fence", "Clean tack"],
    horse: ["Turnout", "Lunging", "Riding", "Grooming", "Hand walking", "Blanket change"]
  };
  const activeSuggestions = SUGGESTIONS[f.category] || SUGGESTIONS.general;

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addTask || "Add Task"} icon={Check} color={C.amber} onClose={onClose} onSave={() => f.title.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      
      <Field label={t.category || "Task Type"}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button type="button" onClick={() => setF({...f, category: "general", horse_id: null})} className="ev-tap"
            style={{ flex: 1, padding: "18px", borderRadius: 16, border: `2px solid ${f.category === "general" ? C.amber : C.line}`, background: f.category === "general" ? C.amber : C.surface, color: f.category === "general" ? "#fff" : C.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
            <Activity size={28} />
            <span style={{ fontSize: 15, fontWeight: 700 }}>{t.general || "General"}</span>
          </button>
          <button type="button" onClick={() => setF({...f, category: "horse"})} className="ev-tap"
            style={{ flex: 1, padding: "18px", borderRadius: 16, border: `2px solid ${f.category === "horse" ? C.amber : C.line}`, background: f.category === "horse" ? C.amber : C.surface, color: f.category === "horse" ? "#fff" : C.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
            <span style={{ fontSize: 28 }}>🐴</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{t.horses || "Horse"}</span>
          </button>
        </div>
      </Field>

      {f.category === "horse" && horses && horses.length > 0 && (
        <div style={{ marginBottom: 24, background: C.bg, padding: 16, borderRadius: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.sub, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Select Horse</label>
          <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8 }}>
            {horses.map(h => {
              const isSel = f.horse_id === h.id;
              return (
                <button key={h.id} type="button" onClick={() => setF({...f, horse_id: h.id})} className="ev-tap"
                  style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 100, border: `1.5px solid ${isSel ? C.amber : C.line}`, background: isSel ? `${C.amber}1f` : C.surface, color: isSel ? C.ink : C.sub, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: h.color_hex || C.sub, border: `2px solid #fff`, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                  {h.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Field label={t.taskTitle || "Title"} required>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, marginBottom: 12, paddingBottom: 4 }}>
          {activeSuggestions.map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, title: s}); setErr(false); }} className="ev-tap"
              style={{ flexShrink: 0, padding: "10px 16px", borderRadius: 12, border: `1px solid ${f.title === s ? C.amber : C.line}`, background: f.title === s ? C.amber : C.surface, color: f.title === s ? "#fff" : C.sub, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.title} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }} placeholder="Or type a custom task..." style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label={t.taskDue || "Date"}><input type="date" value={f.due_date || ""} onChange={(e) => setF({...f, due_date: e.target.value})} style={{...inputStyle(), background: C.surface}} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.timeStart || "Start Time"}><input type="time" value={f.start_time || ""} onChange={(e) => setF({...f, start_time: e.target.value})} style={{...inputStyle(), background: C.surface}} /></Field>
          <Field label={t.timeEnd || "End Time"}><input type="time" value={f.end_time || ""} onChange={(e) => setF({...f, end_time: e.target.value})} style={{...inputStyle(), background: C.surface}} /></Field>
        </div>
      </div>

      <Field label={t.taskDesc || "Description"}>
        <textarea value={f.description || ""} onChange={(e) => setF({...f, description: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Extra details..." />
      </Field>
    </EditorLayout>
  );
}

export function HealthEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { horse_id: "", scheduled_date: "", notes: "", performed_by: "", cost: "", category: "generalCare", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Health Categories
  const HEALTH_CATS = [
    { id: "generalCare", label: t?.generalCare || "General Care", emoji: "🩺" },
    { id: "vaccination", label: t?.vaccination || "Vaccine", emoji: "💉" },
    { id: "deworming", label: t?.deworming || "Deworming", emoji: "🐛" },
    { id: "farrier", label: t?.farrier || "Farrier", emoji: "🔨" },
    { id: "dentist", label: t?.dentist || "Dentist", emoji: "🦷" },
    { id: "injury", label: t?.injury || "Injury", emoji: "🩹" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addRecord || "Add Health Record"} icon={Activity} color={C.coral} onClose={onClose} onSave={() => f.scheduled_date && f.horse_id ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      
      {horses && horses.length > 0 && (
        <div style={{ marginBottom: 24, background: C.bg, padding: 16, borderRadius: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: err && !f.horse_id ? C.coral : C.sub, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Select Horse {err && !f.horse_id && "*"}
          </label>
          <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8 }}>
            {horses.map(h => {
              const isSel = f.horse_id === h.id;
              return (
                <button key={h.id} type="button" onClick={() => { setF({...f, horse_id: h.id}); setErr(false); }} className="ev-tap"
                  style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 100, border: `1.5px solid ${isSel ? C.coral : C.line}`, background: isSel ? `${C.coral}1f` : C.surface, color: isSel ? C.ink : C.sub, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: h.color_hex || C.sub, border: `2px solid #fff`, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                  {h.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Field label={t.category || "Record Category"}>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {HEALTH_CATS.map(cat => {
            const isSel = f.category === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, category: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.coral : C.line}`, background: isSel ? C.coral : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.recordDate || "Date"} required>
            <input type="date" value={f.scheduled_date || ""} onChange={(e) => { setF({...f, scheduled_date: e.target.value}); setErr(false); }} style={{...inputStyle(err && !f.scheduled_date), background: C.surface}} />
          </Field>
          <Field label={t.cost || "Cost (€)"}>
            <input type="number" step="0.01" value={f.cost || ""} onChange={(e) => setF({...f, cost: e.target.value})} placeholder="0.00" style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
        <Field label={t.performedBy || "Performed By"}>
          <input value={f.performed_by || ""} onChange={(e) => setF({...f, performed_by: e.target.value})} placeholder="e.g. Dr. Smith, Farrier Joe..." style={{...inputStyle(), background: C.surface}} />
        </Field>
      </div>

      <Field label={t.notes || "Diagnosis / Treatment Details"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 140, resize: "vertical", background: C.field }} placeholder="Extra details..." />
      </Field>
    </EditorLayout>
  );
}

export function BookingEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { date: "", status: "pending", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const STATUSES = [
    { id: "pending", emoji: "⏳" },
    { id: "confirmed", emoji: "✅" },
    { id: "cancelled", emoji: "❌" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Booking"} icon={BookOpen} color={C.sky} onClose={onClose} onSave={() => f.date ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      
      <Field label="Status">
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {STATUSES.map(cat => {
            const isSel = f.status === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, status: cat.id})} className="ev-tap"
                style={{ flex: 1, padding: "14px 10px", borderRadius: 16, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Date" required>
          <input type="date" value={f.date || ""} onChange={(e) => { setF({...f, date: e.target.value}); setErr(false); }} style={{...inputStyle(err && !f.date), background: C.surface}} />
        </Field>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Booking details..." />
      </Field>
    </EditorLayout>
  );
}

export function InvoiceEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { invoice_number: "", amount: "", due_date: "", status: "draft", file_url: "", notes: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const STATUSES = [
    { id: "draft", emoji: "📝" },
    { id: "sent", emoji: "📨" },
    { id: "paid", emoji: "💳" },
    { id: "overdue", emoji: "⚠️" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Invoice"} icon={Receipt} color={C.sky} onClose={onClose} onSave={() => f.amount ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.file_url} onChange={(url) => setF({...f, file_url: url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      
      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {STATUSES.map(cat => {
            const isSel = f.status === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, status: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Invoice Number">
          <input value={f.invoice_number || ""} onChange={(e) => setF({...f, invoice_number: e.target.value})} placeholder="INV-2026-..." style={{...inputStyle(), background: C.surface}} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Amount (€)" required>
            <input type="number" step="0.01" value={f.amount || ""} onChange={(e) => { setF({...f, amount: e.target.value}); setErr(false); }} placeholder="0.00" style={{...inputStyle(err && !f.amount), background: C.surface, fontSize: 18, fontWeight: 700, color: C.sky}} />
          </Field>
          <Field label="Due Date">
            <input type="date" value={f.due_date || ""} onChange={(e) => setF({...f, due_date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Notes..." />
      </Field>
    </EditorLayout>
  );
}

export function CatalogEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { name: "", description: "", price: "", stock: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Catalog Item"} icon={Package} color={C.sky} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      
      <Field label="Product Name" required>
        <input value={f.name || ""} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. Leather Halter" style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Price (€)">
            <input type="number" step="0.01" value={f.price || ""} onChange={(e) => setF({...f, price: e.target.value})} placeholder="0.00" style={{...inputStyle(), background: C.surface, fontSize: 18, fontWeight: 700, color: C.sky}} />
          </Field>
          <Field label="Stock Level">
            <input type="number" value={f.stock || ""} onChange={(e) => setF({...f, stock: e.target.value})} placeholder="0" style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
      </div>

      <Field label="Description">
        <textarea value={f.description || ""} onChange={(e) => setF({...f, description: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical", background: C.field }} placeholder="Product details..." />
      </Field>
    </EditorLayout>
  );
}

export function UserEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { name: "", email: "", role: "roleStaff", perms: [] });
  const [err, setErr] = useState(false);
  const ROLE_KEYS = ["roleAdmin", "roleManager", "roleStaff", "roleVet", "roleOwner"];
  const PERM_KEYS = ["permContacts", "permHorses", "permCalendar", "permTasks", "permHealth", "permFeeding", "permSettings"];

  const togglePerm = (p) => setF((s) => ({ ...s, perms: s.perms.includes(p) ? s.perms.filter((x) => x !== p) : [...s.perms, p] }));
  const allOn = f.perms.length === PERM_KEYS.length;
  const toggleAll = () => setF((s) => ({ ...s, perms: allOn ? [] : [...PERM_KEYS] }));

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addUser || "Add User"} icon={Users} color={C.sky} onClose={onClose} onSave={() => f.name.trim() && f.email.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <Field label={t.name || "Name"} required><input value={f.name || ""} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="Full Name" style={inputStyle(err && !f.name.trim())} /></Field>
      <Field label={t.email || "Email"} required><input value={f.email || ""} onChange={(e) => { setF({...f, email: e.target.value}); setErr(false); }} placeholder="naam@mail.com" style={inputStyle(err && !f.email.trim())} /></Field>
      
      <Field label={t.role || "Role"}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {ROLE_KEYS.map((r) => (
            <button key={r} type="button" onClick={() => setF({ ...f, role: r })} className="ev-tap"
              style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.role === r ? C.sky : C.line}`, background: f.role === r ? C.sky : C.surface, color: f.role === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              {t[r] || r}
            </button>
          ))}
        </div>
      </Field>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <label style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.sub }}>{t.permissions || "Permissions"}</label>
        <button onClick={toggleAll} className="ev-tap" style={{ border: "none", background: "transparent", cursor: "pointer", color: C.mint, fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>{t.selectAll || "Select All"}</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {PERM_KEYS.map((p) => {
          const on = f.perms.includes(p);
          return (
            <button key={p} onClick={() => togglePerm(p)} className="ev-tap" style={{
              flexShrink: 0, border: `1.5px solid ${on ? C.sky : C.line}`, cursor: "pointer", fontFamily: "inherit",
              background: on ? C.sky + "1f" : C.surface, color: on ? C.sky : C.sub,
              padding: "16px 24px", borderRadius: 16, fontSize: 16, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8 }}>
              {on && <Check size={14} />}{t[p] || p}
            </button>
          );
        })}
      </div>
    </EditorLayout>
  );
}

export function FeedingEditor({ t, initialData, slot, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { product: "", qty: "" });
  const [err, setErr] = useState(false);
  const COMMON = {
    nl: ["Hooi", "Stro", "Houtkrullen", "Vlas", "Biks", "Muesli", "Slobber"],
    en: ["Hay", "Straw", "Shavings", "Flax", "Pellets", "Muesli", "Mash"],
    es: ["Heno", "Paja", "Virutas", "Lino", "Pellets", "Muesli", "Papilla"],
  };
  const suggestions = COMMON[t.code?.toLowerCase()] || COMMON.en;

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : `${t.addProduct || "Add Product"} · ${t[slot] || slot}`} icon={Carrot} color={C.amber} onClose={onClose} onSave={() => f.product.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <Field label={t.product || "Product"} required>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8, marginBottom: 4 }}>
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, product: s}); setErr(false); }}
              className="ev-tap"
              style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.product === s ? C.amber : C.line}`, background: f.product === s ? C.amber : C.surface, color: f.product === s ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.product || ""} onChange={(e) => { setF({...f, product: e.target.value}); setErr(false); }} placeholder="e.g. Muesli" style={inputStyle(err)} />
      </Field>
      <Field label={t.qty || "Quantity"}><input value={f.qty || ""} onChange={(e) => setF({...f, qty: e.target.value})} placeholder="2 kg" style={inputStyle()} /></Field>
    </EditorLayout>
  );
}

export function QuickReportEditor({ t, onClose, onSave }) {
  const [f, setF] = useState({ report_type: "supply", item_name: "", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={t.reportIssue || "Report Issue"} icon={AlertTriangle} color={C.coral} onClose={onClose} onSave={() => f.item_name.trim() ? onSave({ ...f, quantity: "1", requested_by: "Groom", status: "pending" }) : setErr(true)}>
      <Field label={t.whatIsWrong || "What is wrong?"}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          {["supply", "defect"].map(type => (
            <button key={type} type="button" onClick={() => setF({...f, report_type: type})} className="ev-tap"
              style={{ flex: 1, padding: "20px", borderRadius: 16, border: `1.5px solid ${f.report_type === type ? C.coral : C.line}`, background: f.report_type === type ? C.coral : C.surface, color: f.report_type === type ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {type === "supply" ? <ShoppingCart size={28} /> : <AlertOctagon size={28} />}
              {type === "supply" ? (t.issueSupply || "I need supplies") : (t.issueDefect || "Something is broken")}
            </button>
          ))}
        </div>
      </Field>
      
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />

      <Field label={t.taskTitle || "Title"} required>
        <input value={f.item_name || ""} onChange={(e) => { setF({...f, item_name: e.target.value}); setErr(false); }} placeholder={f.report_type === "supply" ? "e.g. Dish soap, Tape" : "e.g. Broken halter horse X"} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.required || "Required"}</div>}

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({ ...f, notes: e.target.value })} style={{ ...inputStyle(), resize: "vertical", minHeight: 140 }} placeholder={t.notesHint || "Any additional details..."} />
      </Field>
    </EditorLayout>
  );
}

export function MareEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { stallion_name: "", service_date: "", expected_foal_date: "", status: "inseminated" });
  const [err, setErr] = useState(false);
  const STATUSES = [
    { id: "inseminated", emoji: "💉", label: "Inseminated" },
    { id: "confirmed_pregnant", emoji: "✅", label: "Pregnant" },
    { id: "empty", emoji: "❌", label: "Empty" },
    { id: "aborted", emoji: "⚠️", label: "Aborted" },
    { id: "foaled", emoji: "🐴", label: "Foaled" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Mare Record"} icon={Heart} color={C.pink} onClose={onClose} onSave={() => f.stallion_name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <Field label="Stallion Name" required>
        <input value={f.stallion_name || ""} onChange={(e) => { setF({...f, stallion_name: e.target.value}); setErr(false); }} placeholder="e.g. Chacco-Blue" style={inputStyle(err)} />
      </Field>

      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {STATUSES.map(cat => {
            const isSel = f.status === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, status: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.pink : C.line}`, background: isSel ? C.pink : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{t[cat.id] || cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Service Date">
            <input type="date" value={f.service_date || ""} onChange={(e) => setF({...f, service_date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label="Expected Foal Date">
            <input type="date" value={f.expected_foal_date || ""} onChange={(e) => setF({...f, expected_foal_date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
      </div>
    </EditorLayout>
  );
}

export function EmbryoEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { stallion_name: "", flush_date: "", status: "frozen" });
  const [err, setErr] = useState(false);
  const STATUSES = [
    { id: "frozen", emoji: "❄️", label: "Frozen" },
    { id: "transferred", emoji: "🧬", label: "Transferred" },
    { id: "pregnant", emoji: "✅", label: "Pregnant" },
    { id: "failed", emoji: "❌", label: "Failed" }
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Embryo"} icon={Sparkles} color={C.pink} onClose={onClose} onSave={() => f.stallion_name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <Field label="Stallion Name" required>
        <input value={f.stallion_name || ""} onChange={(e) => { setF({...f, stallion_name: e.target.value}); setErr(false); }} placeholder="e.g. Cornet Obolensky" style={inputStyle(err)} />
      </Field>

      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8, marginBottom: 16 }}>
          {STATUSES.map(cat => {
            const isSel = f.status === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, status: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${isSel ? C.pink : C.line}`, background: isSel ? C.pink : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{t[cat.id] || cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Flush Date">
          <input type="date" value={f.flush_date || ""} onChange={(e) => setF({...f, flush_date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
        </Field>
      </div>
    </EditorLayout>
  );
}

export function FoalEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { name: "", birthdate: "" });
  const [err, setErr] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Foal"} icon={Heart} color={C.pink} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <Field label="Foal Name" required>
        <input value={f.name || ""} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. Thunder" style={inputStyle(err)} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Birthdate">
          <input type="date" value={f.birthdate || ""} onChange={(e) => setF({...f, birthdate: e.target.value})} style={{...inputStyle(), background: C.surface}} />
        </Field>
      </div>
    </EditorLayout>
  );
}
