import React, { useState } from "react";
import { Camera, Check, Plus, Trash2, ArrowLeft, Link as LinkIcon, FileText, ShoppingCart, MapPin, Contact as ContactIcon, BookOpen, Receipt, Package, Wallet, Activity } from "lucide-react";
import { useStore } from "./Equivesa";

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
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.bg, display: "flex", flexDirection: "column", animation: "evFade .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`, zIndex: 10 }}>
        <button onClick={onClose} className="ev-tap" style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: C.surface, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          <ArrowLeft size={22} color={C.ink} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: `${color}1f`, color: color, display: "grid", placeItems: "center" }}>
            <Icon size={18} />
          </span>
          <h2 className="ev-display" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.ink }}>{title}</h2>
        </div>
        <div style={{ width: 44 }} />
      </div>
      <div className="ev-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 20px 100px" }}>
        <div style={{ width: "100%", margin: "0 auto", background: C.surface, padding: 30, borderRadius: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}>
          {children}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}`, padding: "16px 20px", display: "flex", gap: 12, justifyContent: "center" }}>
        <div style={{ width: "100%", display: "flex", gap: 12 }}>
          {onDelete && (
            <button onClick={onDelete} className="ev-tap" style={{ flex: 1, padding: 18, borderRadius: 16, border: `1.5px solid ${C.coral}`, background: "transparent", color: C.coral, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Trash2 size={20} /> {t?.delete || "Delete"}
            </button>
          )}
          <button onClick={onSave} className="ev-tap" style={{ flex: onDelete ? 2 : 1, padding: 18, borderRadius: 16, border: "none", background: color, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px ${color}66` }}>
            <Check size={20} /> {t?.save || "Save"}
          </button>
        </div>
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
  const ROLES = ["owner", "vet", "farrier", "rider", "supplier", "trainer", "other"];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Contact"} icon={ContactIcon} color={C.sky} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={ContactIcon} />
      <Field label={t.name || "Name"} required><input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="Full Name" style={inputStyle(err)} /></Field>
      <Field label={t.role || "Role"}>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {ROLES.map(r => (
            <button key={r} type="button" onClick={() => setF({...f, role: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.role === r ? C.sky : C.line}`, background: f.role === r ? C.sky : C.surface, color: f.role === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{t[`role_${r}`] || r}</button>
          ))}
        </div>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label={t.phone || "Phone"}><input value={f.phone || ""} onChange={(e) => setF({...f, phone: e.target.value})} placeholder="+31 6..." style={inputStyle()} /></Field>
        <Field label={t.email || "Email"}><input value={f.email || ""} onChange={(e) => setF({...f, email: e.target.value})} placeholder="mail@..." style={inputStyle()} /></Field>
      </div>
      <Field label={t.company || "Company"}><input value={f.company || ""} onChange={(e) => setF({...f, company: e.target.value})} placeholder="Company Name" style={inputStyle()} /></Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Additional information..." /></Field>
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
  const TYPES = ["stable", "paddock", "arena", "pasture", "clinic", "other"];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Location"} icon={MapPin} color={C.amber} onClose={onClose} onSave={() => f.name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={MapPin} />
      <Field label={t.name || "Name"} required><input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="Main Barn" style={inputStyle(err)} /></Field>
      <Field label="Location Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {TYPES.map(r => (
            <button key={r} type="button" onClick={() => setF({...f, location_type: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.location_type === r ? C.amber : C.line}`, background: f.location_type === r ? C.amber : C.surface, color: f.location_type === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{r.toUpperCase()}</button>
          ))}
        </div>
      </Field>
      <Field label="Capacity (Max Horses)"><input type="number" value={f.capacity || ""} onChange={(e) => setF({...f, capacity: e.target.value})} placeholder="e.g. 20" style={inputStyle()} /></Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Map layout or details..." /></Field>
      <div style={{ marginTop: 24, padding: 20, background: `${C.amber}14`, borderRadius: 16, border: `1px solid ${C.amber}44` }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, color: C.ink }}>Map Editor / Stalbouwer</h3>
        <p style={{ margin: 0, fontSize: 14, color: C.sub }}>The interactive grid layout builder for stalls will be rendered here. Save the location first to start building boxes!</p>
      </div>
    </EditorLayout>
  );
}

export function DocumentEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { title: "", document_type: "passport", horse_id: "", file_url: "", notes: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const TYPES = ["passport", "contract", "vet_report", "invoice", "other"];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Document"} icon={FileText} color={C.mint} onClose={onClose} onSave={() => f.title.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.file_url} onChange={(url) => setF({...f, file_url: url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      <Field label="Document Title" required><input value={f.title} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }} placeholder="e.g. Purchase Contract" style={inputStyle(err)} /></Field>
      <Field label="Document Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {TYPES.map(r => (
            <button key={r} type="button" onClick={() => setF({...f, document_type: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.document_type === r ? C.mint : C.line}`, background: f.document_type === r ? C.mint : C.surface, color: f.document_type === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{r.replace("_", " ").toUpperCase()}</button>
          ))}
        </div>
      </Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Extra info..." /></Field>
    </EditorLayout>
  );
}

export function SupplyEditor({ t, initialData, lang, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { item_name: "", quantity: "", requested_by: "", notes: "", photo_url: "", amazon_link: "", report_type: "supply" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addSupply || "Add Supply Request"} icon={ShoppingCart} color={C.coral} onClose={onClose} onSave={() => f.item_name.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      <Field label={t.supplyItem || "Item"} required><input value={f.item_name} onChange={(e) => { setF({...f, item_name: e.target.value}); setErr(false); }} placeholder="Custom item..." style={inputStyle(err)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label={t.qty || "Qty"}><input value={f.quantity || ""} onChange={(e) => setF({...f, quantity: e.target.value})} placeholder="Amount" style={inputStyle()} /></Field>
        <Field label={t.requestedBy || "Requested By"}><input value={f.requested_by || ""} onChange={(e) => setF({...f, requested_by: e.target.value})} placeholder="Name" style={inputStyle()} /></Field>
      </div>
      <Field label="Amazon / Webshop Link">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.coral}14`, display: "grid", placeItems: "center", color: C.coral, flexShrink: 0 }}><LinkIcon size={20} /></div>
          <input value={f.amazon_link || ""} onChange={(e) => setF({...f, amazon_link: e.target.value})} placeholder="https://amazon..." style={{ ...inputStyle(), flex: 1 }} />
        </div>
      </Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Extra info..." /></Field>
    </EditorLayout>
  );
}

export function FinanceEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { type: "expense", category: "catFeed", amount: "", description: "", reference: "", horse_id: "", date: new Date().toISOString().split("T")[0], receipt_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const CATS = ["catFeed", "catVet", "catFarrier", "catBoard", "catConcours", "catOther"];

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addTransaction || "Add Transaction"} icon={Wallet} color={C.mint} onClose={onClose} onSave={() => f.amount && f.description.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.receipt_url} onChange={(url) => setF({...f, receipt_url: url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      <Field label="Transaction Type">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {["expense", "income"].map(r => (
            <button key={r} type="button" onClick={() => setF({...f, type: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.type === r ? C.mint : C.line}`, background: f.type === r ? C.mint : C.surface, color: f.type === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{r.toUpperCase()}</button>
          ))}
        </div>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label={t.amount || "Amount (€)"} required><input type="number" step="0.01" value={f.amount} onChange={(e) => { setF({...f, amount: e.target.value}); setErr(false); }} placeholder="0.00" style={inputStyle(err && !f.amount)} /></Field>
        <Field label="Date" required><input type="date" value={f.date || ""} onChange={(e) => setF({...f, date: e.target.value})} style={inputStyle()} /></Field>
      </div>
      <Field label={t.description || "Description"} required><input value={f.description} onChange={(e) => { setF({...f, description: e.target.value}); setErr(false); }} placeholder="e.g. New saddle" style={inputStyle(err && !f.description)} /></Field>
      <Field label={t.fCategory || "Category"}>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {CATS.map(r => (
            <button key={r} type="button" onClick={() => setF({...f, category: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.category === r ? C.mint : C.line}`, background: f.category === r ? C.mint : C.surface, color: f.category === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{t[r] || r.replace("cat", "")}</button>
          ))}
        </div>
      </Field>
      <Field label={t.reference || "Reference"}><input value={f.reference || ""} onChange={(e) => setF({...f, reference: e.target.value})} placeholder="Invoice #..." style={inputStyle()} /></Field>
    </EditorLayout>
  );
}

export function TaskEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { title: "", description: "", due_date: "", start_time: "", end_time: "", category: "general", horse_id: null, photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addTask || "Add Task"} icon={Check} color={C.amber} onClose={onClose} onSave={() => f.title.trim() ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      <Field label={t.taskTitle || "Title"} required><input value={f.title} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }} placeholder="e.g. Clean stable" style={inputStyle(err)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label={t.timeStart || "Start Time"}><input type="time" value={f.start_time || ""} onChange={(e) => setF({...f, start_time: e.target.value})} style={inputStyle()} /></Field>
        <Field label={t.timeEnd || "End Time"}><input type="time" value={f.end_time || ""} onChange={(e) => setF({...f, end_time: e.target.value})} style={inputStyle()} /></Field>
      </div>
      <Field label={t.taskDue || "Date"}><input type="date" value={f.due_date || ""} onChange={(e) => setF({...f, due_date: e.target.value})} style={inputStyle()} /></Field>
      <Field label={t.taskDesc || "Description"}><textarea value={f.description || ""} onChange={(e) => setF({...f, description: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Extra details..." /></Field>
    </EditorLayout>
  );
}

export function HealthEditor({ t, initialData, horses, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { horse_id: "", scheduled_date: "", notes: "", performed_by: "", cost: "", category: "generalCare", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.addRecord || "Add Health Record"} icon={Activity} color={C.coral} onClose={onClose} onSave={() => f.scheduled_date ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label={t.recordDate || "Date"} required><input type="date" value={f.scheduled_date || ""} onChange={(e) => { setF({...f, scheduled_date: e.target.value}); setErr(false); }} style={inputStyle(err && !f.scheduled_date)} /></Field>
        <Field label={t.cost || "Cost (€)"}><input type="number" step="0.01" value={f.cost || ""} onChange={(e) => setF({...f, cost: e.target.value})} placeholder="0.00" style={inputStyle()} /></Field>
      </div>
      <Field label={t.performedBy || "Performed By"}><input value={f.performed_by || ""} onChange={(e) => setF({...f, performed_by: e.target.value})} placeholder="e.g. Dr. Smith" style={inputStyle()} /></Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Treatment details..." /></Field>
    </EditorLayout>
  );
}

export function BookingEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { date: "", status: "pending", notes: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Booking"} icon={BookOpen} color={C.sky} onClose={onClose} onSave={() => f.date ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.photo_url} onChange={(url) => setF({...f, photo_url: url})} uploading={uploading} setUploading={setUploading} icon={Camera} />
      <Field label="Date" required><input type="date" value={f.date || ""} onChange={(e) => { setF({...f, date: e.target.value}); setErr(false); }} style={inputStyle(err && !f.date)} /></Field>
      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {["pending", "confirmed", "cancelled"].map(r => (
            <button key={r} type="button" onClick={() => setF({...f, status: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.status === r ? C.sky : C.line}`, background: f.status === r ? C.sky : C.surface, color: f.status === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{r.toUpperCase()}</button>
          ))}
        </div>
      </Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Booking details..." /></Field>
    </EditorLayout>
  );
}

export function InvoiceEditor({ t, initialData, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initialData || { invoice_number: "", amount: "", due_date: "", status: "draft", file_url: "", notes: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <EditorLayout t={t} title={initialData ? t.edit || "Edit" : t.add || "Add Invoice"} icon={Receipt} color={C.sky} onClose={onClose} onSave={() => f.amount ? onSave(f) : setErr(true)} onDelete={initialData ? onDelete : null}>
      <PhotoUpload url={f.file_url} onChange={(url) => setF({...f, file_url: url})} uploading={uploading} setUploading={setUploading} icon={FileText} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Invoice Number"><input value={f.invoice_number || ""} onChange={(e) => setF({...f, invoice_number: e.target.value})} placeholder="INV-2026-..." style={inputStyle()} /></Field>
        <Field label="Amount (€)" required><input type="number" step="0.01" value={f.amount || ""} onChange={(e) => { setF({...f, amount: e.target.value}); setErr(false); }} placeholder="0.00" style={inputStyle(err && !f.amount)} /></Field>
      </div>
      <Field label="Due Date"><input type="date" value={f.due_date || ""} onChange={(e) => setF({...f, due_date: e.target.value})} style={inputStyle()} /></Field>
      <Field label="Status">
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
          {["draft", "sent", "paid", "overdue"].map(r => (
            <button key={r} type="button" onClick={() => setF({...f, status: r})} className="ev-tap" style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.status === r ? C.sky : C.line}`, background: f.status === r ? C.sky : C.surface, color: f.status === r ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>{r.toUpperCase()}</button>
          ))}
        </div>
      </Field>
      <Field label={t.notes || "Notes"}><textarea value={f.notes || ""} onChange={(e) => setF({...f, notes: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Notes..." /></Field>
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
      <Field label="Product Name" required><input value={f.name || ""} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }} placeholder="e.g. Leather Halter" style={inputStyle(err)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Price (€)"><input type="number" step="0.01" value={f.price || ""} onChange={(e) => setF({...f, price: e.target.value})} placeholder="0.00" style={inputStyle()} /></Field>
        <Field label="Stock Level"><input type="number" value={f.stock || ""} onChange={(e) => setF({...f, stock: e.target.value})} placeholder="0" style={inputStyle()} /></Field>
      </div>
      <Field label="Description"><textarea value={f.description || ""} onChange={(e) => setF({...f, description: e.target.value})} style={{ ...inputStyle(), minHeight: 120, resize: "vertical" }} placeholder="Product details..." /></Field>
    </EditorLayout>
  );
}
