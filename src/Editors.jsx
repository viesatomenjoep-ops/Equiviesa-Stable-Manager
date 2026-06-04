import React, { useState } from "react";
import { Camera, Check, Plus, Trash2, ArrowLeft, Link as LinkIcon, FileText, ShoppingCart, MapPin, Contact as ContactIcon, BookOpen, Receipt, Package, Wallet, Activity, Users, Carrot, AlertTriangle, AlertOctagon, Heart, Sparkles } from "lucide-react";
import { useStore } from "./Equivesa";
import { MapEditor } from "./MapEditor";

const C = {
  bg: "#F2F5F8", surface: "#FFFFFF", line: "#E3E8EE",
  ink: "#0E151E", sub: "#64748B", field: "#F8FAFC",
  mint: "#2FB6A0", mintSoft: "#E0F5F2", coral: "#FF8C70", sky: "#5AB2FF", amber: "#FFB03A",
  pink: "#E879A0", lilac: "#9B7FD4"
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

export function PhotoUpload({ url, onChange, uploading, setUploading, icon: Icon = Camera, accept = "image/*,video/*,application/pdf", label = "Upload" }) {
  const [error, setError] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 50MB for videos)
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large — max 50 MB");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "equivesa_uploads");

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daj1lyfgk";
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    try {
      setProgress(40);
      const res = await fetch(endpoint, { method: "POST", body: formData });
      setProgress(80);
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
        setProgress(100);
      } else if (data.error) {
        // Cloudinary returned an error
        setError(`Upload error: ${data.error.message}`);
      } else {
        setError("Upload failed — check Cloudinary preset settings");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Network error — check your connection");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const isPdf = url && url.toLowerCase().includes(".pdf");
  const isVideo = url && url.match(/\.(mp4|mov|webm)$/i);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28, gap: 10 }}>
      <label style={{
        width: 150, height: 150, borderRadius: "28%",
        border: `2px ${url ? "solid" : "dashed"} ${error ? C.coral : url ? C.mint : C.line}`,
        background: uploading ? `${C.mint}10` : url ? C.surface : C.field,
        cursor: "pointer", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: C.sub, gap: 8, overflow: "hidden", position: "relative",
        boxShadow: url ? "0 8px 24px rgba(47,182,160,.18)" : "0 4px 12px rgba(0,0,0,.04)",
        transition: "all .2s",
      }}>
        {url && isVideo ? (
          <video src={url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : url && !isPdf ? (
          <img src={url} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : url && isPdf ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12 }}>
            <span style={{ fontSize: 38 }}>📄</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.mint, textAlign: "center" }}>PDF</span>
          </div>
        ) : uploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `3px solid ${C.mint}40`, borderTopColor: C.mint, animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.mint }}>{progress}%</span>
          </div>
        ) : (
          <>
            <Icon size={28} color={C.sub} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</span>
          </>
        )}
        <input type="file" accept={accept} onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
      </label>

      {/* Error message */}
      {error && (
        <div style={{ fontSize: 12, color: C.coral, fontWeight: 600, textAlign: "center", maxWidth: 200 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Clear button when image is uploaded */}
      {url && !uploading && (
        <button type="button" onClick={() => { onChange(""); setError(null); }}
          style={{ fontSize: 12, color: C.sub, background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline", fontFamily: "inherit" }}>
          🗑️ Verwijder foto
        </button>
      )}
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


export function SupplyEditor({ t, initialData, lang, staffMembers, onClose, onSave, onDelete }) {
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
            <select value={f.requested_by || ""} onChange={(e) => setF({...f, requested_by: e.target.value})} style={{...inputStyle(), background: C.surface}}>
              <option value="">Selecteer...</option>
              {staffMembers && staffMembers.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
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

export function TaskEditor({ t, initialData, horses, staffMembers, onClose, onSave, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState(initialData || { title: "", description: "", due_date: today, start_time: "", end_time: "", category: "general", horse_id: null, staff_id: null, photo_url: "" });
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
        <input value={f.title || ""} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }} placeholder="Or type a custom task..." style={inputStyle(err)} />
      </Field>

      {staffMembers && staffMembers.length > 0 && (
        <Field label={t.assignedTo || "Assigned To"}>
          <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 8 }}>
            <button type="button" onClick={() => setF({...f, staff_id: null})} className="ev-tap"
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 100, border: `1.5px solid ${!f.staff_id ? C.amber : C.line}`, background: !f.staff_id ? `${C.amber}1f` : C.surface, color: !f.staff_id ? C.ink : C.sub, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
              🤷 Anyone
            </button>
            {staffMembers.map(st => {
              const isSel = f.staff_id === st.id;
              return (
                <button key={st.id} type="button" onClick={() => setF({...f, staff_id: st.id})} className="ev-tap"
                  style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 100, border: `1.5px solid ${isSel ? C.amber : C.line}`, background: isSel ? `${C.amber}1f` : C.surface, color: isSel ? C.ink : C.sub, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: C.sub, border: `2px solid #fff`, overflow: "hidden", display: "grid", placeItems: "center" }}>
                    {st.photo_url ? <img src={st.photo_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <User size={14} color="#fff"/>}
                  </div>
                  {st.name}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.taskDue || "Date"}><input type="date" value={f.due_date || ""} onChange={(e) => setF({...f, due_date: e.target.value})} style={{...inputStyle(), background: C.surface}} /></Field>
          <Field label={t.repeat || "Repeat"}>
            <select value={f.recurrence_rule || "none"} onChange={(e) => setF({...f, recurrence_rule: e.target.value})} style={{...inputStyle(), background: C.surface}}>
              <option value="none">Geen herhaling</option>
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
              <option value="monthly">Maandelijks</option>
              <option value="yearly">Jaarlijks</option>
            </select>
          </Field>
        </div>
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

export function HealthEditor({ t, initialData, horses, staffMembers, onClose, onSave, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState(initialData || { horse_id: "", scheduled_date: today, notes: "", performed_by: "", cost: "", category: "generalCare", photo_url: "", recurrence_rule: "none" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Health Categories — IDs must match DB check constraint exactly
  const HEALTH_CATS = [
    { id: "generalCare",   label: t?.generalCare   || "General Care", emoji: "🩺" },
    { id: "vaccinations",  label: t?.vaccinations  || "Vaccine",      emoji: "💉" },
    { id: "deworming",     label: t?.deworming     || "Deworming",    emoji: "🐛" },
    { id: "farrier",       label: t?.farrier       || "Farrier",      emoji: "🔨" },
    { id: "dental",        label: t?.dentist       || "Dental",       emoji: "🦷" },
    { id: "treatments",    label: t?.treatments    || "Treatment",    emoji: "🩹" },
    { id: "appointments",  label: t?.appointments  || "Appointment",  emoji: "📋" },
    { id: "medication",    label: t?.medication    || "Medication",   emoji: "💊" },
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
          <Field label={t.repeat || "Repeat"}>
            <select value={f.recurrence_rule || "none"} onChange={(e) => setF({...f, recurrence_rule: e.target.value})} style={{...inputStyle(), background: C.surface}}>
              <option value="none">Geen herhaling</option>
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
              <option value="monthly">Maandelijks</option>
              <option value="yearly">Jaarlijks</option>
            </select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label={t.performedBy || "Performed By"}>
            <select value={f.performed_by || ""} onChange={(e) => setF({...f, performed_by: e.target.value})} style={{...inputStyle(), background: C.surface}}>
              <option value="">Selecteer...</option>
              <option value="Dierenarts (Vet)">Dierenarts (Vet)</option>
              <option value="Smid (Farrier)">Smid (Farrier)</option>
              {staffMembers && staffMembers.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </Field>
          <Field label={t.cost || "Cost (€)"}>
            <input type="number" step="0.01" value={f.cost || ""} onChange={(e) => setF({...f, cost: e.target.value})} placeholder="0.00" style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
        </div>
      </div>

      <Field label={t.notes || "Diagnosis / Treatment Details"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 140, resize: "vertical", background: C.field }} placeholder="Extra details..." />
      </Field>
    </EditorLayout>
  );
}

export function BookingEditor({ t, initialData, onClose, onSave, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  // DB columns: title (required), booking_type (required), booking_date (required), status, notes
  const [f, setF] = useState(initialData || { title: "", booking_type: "other", booking_date: today, start_time: "09:00", end_time: "10:00", status: "pending", location: "", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const TYPES = [
    { id: "arena",        emoji: "🏟️",  label: "Arena" },
    { id: "lesson",       emoji: "🎓",  label: "Lesson" },
    { id: "training",     emoji: "🏇",  label: "Training" },
    { id: "vet_visit",    emoji: "🩺",  label: "Vet" },
    { id: "farrier_visit",emoji: "🔨",  label: "Farrier" },
    { id: "competition",  emoji: "🏆",  label: "Competition" },
    { id: "transport",    emoji: "🚛",  label: "Transport" },
    { id: "other",        emoji: "📅",  label: "Other" },
  ];
  const STATUSES = [
    { id: "pending",   emoji: "⏳", label: "Pending" },
    { id: "confirmed", emoji: "✅", label: "Confirmed" },
    { id: "cancelled", emoji: "❌", label: "Cancelled" },
    { id: "completed", emoji: "🏁", label: "Completed" },
  ];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Booking"} icon={BookOpen} color={C.sky} onClose={onClose} onSave={() => f.title.trim() && f.booking_date ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />

      <Field label="Booking Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8, marginBottom: 16 }}>
          {TYPES.map(cat => {
            const isSel = f.booking_type === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setF({...f, booking_type: cat.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "12px 18px", borderRadius: 14, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Status">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {STATUSES.map(s => {
            const isSel = f.status === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setF({...f, status: s.id})} className="ev-tap"
                style={{ padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{s.emoji}</span><span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <Field label="Title" required>
          <input value={f.title} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }} placeholder="e.g. Arena session..." style={{...inputStyle(err && !f.title.trim())}} />
        </Field>
        <Field label="Date" required>
          <input type="date" value={f.booking_date || ""} onChange={(e) => { setF({...f, booking_date: e.target.value}); setErr(false); }} style={{...inputStyle(err && !f.booking_date), background: C.surface}} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Start">
            <input type="time" value={f.start_time || ""} onChange={(e) => setF({...f, start_time: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label="End">
            <input type="time" value={f.end_time || ""} onChange={(e) => setF({...f, end_time: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
        <Field label="Location">
          <input value={f.location || ""} onChange={(e) => setF({...f, location: e.target.value})} placeholder="e.g. Main Arena..." style={{...inputStyle(), background: C.surface}} />
        </Field>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 100, resize: "vertical", background: C.field }} placeholder="Booking details..." />
      </Field>
    </EditorLayout>
  );
}

export function InvoiceEditor({ t, initialData, onClose, onSave, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const due30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  // DB columns: invoice_number, client_name (required), invoice_date, due_date (required), total, status, notes
  const [f, setF] = useState(initialData || { invoice_number: "", client_name: "", invoice_date: today, due_date: due30, total: "", subtotal: "", tax_rate: 21, status: "draft", notes: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const STATUSES = [
    { id: "draft",   emoji: "📝", label: "Draft" },
    { id: "sent",    emoji: "📨", label: "Sent" },
    { id: "paid",    emoji: "💳", label: "Paid" },
    { id: "overdue", emoji: "⚠️", label: "Overdue" },
    { id: "partial", emoji: "🔄", label: "Partial" },
  ];

  // Auto-calc total incl. BTW
  const subtotalNum = parseFloat(f.subtotal) || 0;
  const taxAmt = parseFloat(((subtotalNum * (parseFloat(f.tax_rate) || 21)) / 100).toFixed(2));
  const totalNum = parseFloat((subtotalNum + taxAmt).toFixed(2));

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Invoice"} icon={Receipt} color={C.sky} onClose={onClose}
      onSave={() => f.client_name.trim() && f.due_date ? onSave({ ...f, total: totalNum || parseFloat(f.total) || 0, tax_amount: taxAmt, invoice_date: f.invoice_date || today }) : setErr(true)}
      onDelete={initialData ? onDelete : null}>

      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8, marginBottom: 16 }}>
          {STATUSES.map(s => {
            const isSel = f.status === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setF({...f, status: s.id})} className="ev-tap"
                style={{ flexShrink: 0, padding: "12px 20px", borderRadius: 14, border: `1.5px solid ${isSel ? C.sky : C.line}`, background: isSel ? C.sky : C.surface, color: isSel ? "#fff" : C.sub, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, background: C.bg, padding: 20, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Invoice Number">
            <input value={f.invoice_number || ""} onChange={(e) => setF({...f, invoice_number: e.target.value})} placeholder="INV-2026-001" style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label="Client Name" required>
            <input value={f.client_name || ""} onChange={(e) => { setF({...f, client_name: e.target.value}); setErr(false); }} placeholder="Client..." style={{...inputStyle(err && !f.client_name.trim()), background: C.surface}} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Invoice Date">
            <input type="date" value={f.invoice_date || ""} onChange={(e) => setF({...f, invoice_date: e.target.value})} style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label="Due Date" required>
            <input type="date" value={f.due_date || ""} onChange={(e) => { setF({...f, due_date: e.target.value}); setErr(false); }} style={{...inputStyle(err && !f.due_date), background: C.surface}} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Subtotal (€)">
            <input type="number" step="0.01" value={f.subtotal || ""} onChange={(e) => setF({...f, subtotal: e.target.value})} placeholder="0.00" style={{...inputStyle(), background: C.surface}} />
          </Field>
          <Field label="BTW %">
            <input type="number" value={f.tax_rate ?? 21} onChange={(e) => setF({...f, tax_rate: e.target.value})} placeholder="21" style={{...inputStyle(), background: C.surface}} />
          </Field>
        </div>
        {/* Total preview */}
        <div style={{ background: C.sky, borderRadius: 14, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Totaal incl. BTW</span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>€ {totalNum.toFixed(2)}</span>
        </div>
        <button type="button" onClick={() => {
          const inv = { ...f, total: totalNum, tax_amount: taxAmt };
          const win = window.open('', '_blank');
          win.document.write(`
            <html>
              <head>
                <title>Invoice ${inv.invoice_number}</title>
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 40px; }
                  h1 { margin: 0; color: #1f2d3a; }
                  .details { margin-bottom: 40px; display: flex; justify-content: space-between; }
                  .box { background: #f9f9f9; padding: 15px; border-radius: 8px; width: 45%; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                  th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
                  th { background: #f4f4f4; }
                  .totals { text-align: right; font-size: 18px; }
                  .totals div { margin-bottom: 8px; }
                  .total { font-size: 24px; font-weight: bold; color: #2FB6A0; }
                  @media print { body { padding: 0; } @page { margin: 1cm; } }
                </style>
              </head>
              <body>
                <div class="header">
                  <div><h1>Equiviesa</h1><p>Stable Management</p></div>
                  <div style="text-align: right"><h2 style="margin:0; color:#555">INVOICE</h2><strong>${inv.invoice_number || 'DRAFT'}</strong></div>
                </div>
                <div class="details">
                  <div class="box"><p style="margin:0 0 5px; color:#777">Billed To:</p><strong style="font-size:18px">${inv.client_name || 'Client'}</strong></div>
                  <div class="box" style="text-align: right">
                    <div><span style="color:#777">Date:</span> <strong>${inv.invoice_date}</strong></div>
                    <div><span style="color:#777">Due Date:</span> <strong>${inv.due_date}</strong></div>
                    <div><span style="color:#777">Status:</span> <strong style="text-transform:uppercase">${inv.status}</strong></div>
                  </div>
                </div>
                <table>
                  <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
                  <tbody><tr><td>Services rendered</td><td style="text-align:right">€ ${parseFloat(inv.subtotal || 0).toFixed(2)}</td></tr></tbody>
                </table>
                <div class="totals">
                  <div>Subtotal: € ${parseFloat(inv.subtotal || 0).toFixed(2)}</div>
                  <div>BTW (${inv.tax_rate || 21}%): € ${parseFloat(inv.tax_amount || 0).toFixed(2)}</div>
                  <div class="total">Total: € ${parseFloat(inv.total || 0).toFixed(2)}</div>
                </div>
                ${inv.notes ? `<div style="margin-top:50px; padding:15px; background:#f9f9f9; border-left:4px solid #ccc"><p style="margin:0;color:#555"><strong>Notes:</strong><br/>${inv.notes.replace(/\n/g, '<br/>')}</p></div>` : ''}
                <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
              </body>
            </html>
          `);
          win.document.close();
        }} className="ev-tap" style={{ width: "100%", padding: "14px", background: `${C.sky}1a`, color: C.sky, border: `1.5px solid ${C.sky}`, borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>

      <Field label={t.notes || "Notes"}>
        <textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 100, resize: "vertical", background: C.field }} placeholder="Notes..." />
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
