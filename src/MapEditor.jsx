import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Check, X, GripHorizontal } from "lucide-react";
import { useStore } from "./Equivesa";

const C = {
  bg: "#F2F5F8", surface: "#FFFFFF", line: "#E3E8EE",
  ink: "#0E151E", sub: "#64748B", field: "#F8FAFC",
  mint: "#2FB6A0", mintSoft: "#E0F5F2", coral: "#FF8C70", sky: "#5AB2FF", amber: "#FFB03A"
};

export function MapEditor({ locationId }) {
  const { stalls, addStall, editStall, deleteStall, horses } = useStore();
  const locationStalls = stalls.filter(s => s.location_id === locationId);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  
  const handleAdd = () => {
    addStall({
      location_id: locationId,
      name: `Box ${locationStalls.length + 1}`,
      grid_x: 0,
      grid_y: 0,
      width: 2,
      height: 2,
      horse_id: null
    });
  };

  const handlePointerDown = (e, stall) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDragging({
      id: stall.id,
      startX: e.clientX,
      startY: e.clientY,
      origGridX: stall.grid_x,
      origGridY: stall.grid_y,
      currentX: stall.grid_x,
      currentY: stall.grid_y
    });
    setSelected(stall);
  };

  const handlePointerMove = (e, stall) => {
    if (!dragging || dragging.id !== stall.id) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    const gridDx = Math.round(dx / 40);
    const gridDy = Math.round(dy / 40);
    setDragging(prev => ({
      ...prev,
      currentX: Math.max(0, prev.origGridX + gridDx),
      currentY: Math.max(0, prev.origGridY + gridDy)
    }));
  };

  const handlePointerUp = (e, stall) => {
    if (!dragging || dragging.id !== stall.id) return;
    e.target.releasePointerCapture(e.pointerId);
    if (dragging.currentX !== dragging.origGridX || dragging.currentY !== dragging.origGridY) {
      editStall(stall.id, { grid_x: dragging.currentX, grid_y: dragging.currentY });
    }
    setDragging(null);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: C.ink }}>Stable Map Builder</h3>
        <button type="button" onClick={handleAdd} className="ev-tap" style={{ display: "flex", alignItems: "center", gap: 6, background: C.amber, color: "#fff", border: "none", padding: "8px 14px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> Add Box
        </button>
      </div>

      <div style={{ position: "relative", width: "100%", height: 500, background: C.field, border: `2px dashed ${C.line}`, borderRadius: 24, overflow: "hidden" }}>
        {/* Basic CSS Grid system for drag/drop feel. For simplicity in this demo, we'll render absolutely positioned blocks that act like grid items */}
        {locationStalls.map(stall => {
          const isSel = selected?.id === stall.id;
          const isDrag = dragging?.id === stall.id;
          const gx = isDrag ? dragging.currentX : stall.grid_x;
          const gy = isDrag ? dragging.currentY : stall.grid_y;
          const horse = horses.find(h => h.id === stall.horse_id);
          return (
            <div key={stall.id}
              onClick={() => setSelected(stall)}
              onPointerDown={(e) => handlePointerDown(e, stall)}
              onPointerMove={(e) => handlePointerMove(e, stall)}
              onPointerUp={(e) => handlePointerUp(e, stall)}
              onPointerCancel={(e) => handlePointerUp(e, stall)}
              style={{
                position: "absolute",
                left: gx * 40,
                top: gy * 40,
                width: stall.width * 40,
                height: stall.height * 40,
                background: isSel ? C.amber : C.surface,
                border: `2px solid ${isSel ? "#fff" : C.line}`,
                borderRadius: 12,
                boxShadow: isDrag ? `0 12px 30px ${C.amber}80` : isSel ? `0 8px 20px ${C.amber}66` : "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: isDrag ? "grabbing" : "grab", transition: isDrag ? "none" : "all .2s", zIndex: isSel ? 10 : 1, padding: 8, color: isSel ? "#fff" : C.ink,
                touchAction: "none"
              }}>
              <div style={{ fontWeight: 700, fontSize: 14, pointerEvents: "none" }}>{stall.name}</div>
              {horse && <div style={{ fontSize: 11, background: "rgba(0,0,0,0.1)", padding: "2px 6px", borderRadius: 6, marginTop: 4, pointerEvents: "none" }}>{horse.name}</div>}
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: 16, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>Edit {selected.name}</h4>
            <button type="button" onClick={() => setSelected(null)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={C.sub} /></button>
          </div>
          
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input value={selected.name} onChange={e => editStall(selected.id, { name: e.target.value })} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.line}`, outline: "none" }} />
            <select value={selected.horse_id || ""} onChange={e => editStall(selected.id, { horse_id: e.target.value || null })} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.line}`, outline: "none", background: "#fff" }}>
              <option value="">-- No Horse --</option>
              {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => editStall(selected.id, { grid_x: Math.max(0, selected.grid_x - 1) })} style={btn}>←</button>
              <button type="button" onClick={() => editStall(selected.id, { grid_x: selected.grid_x + 1 })} style={btn}>→</button>
              <button type="button" onClick={() => editStall(selected.id, { grid_y: Math.max(0, selected.grid_y - 1) })} style={btn}>↑</button>
              <button type="button" onClick={() => editStall(selected.id, { grid_y: selected.grid_y + 1 })} style={btn}>↓</button>
            </div>
            <div style={{ width: 1, height: 24, background: C.line }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => editStall(selected.id, { width: Math.max(1, selected.width - 1) })} style={btn}>W-</button>
              <button type="button" onClick={() => editStall(selected.id, { width: selected.width + 1 })} style={btn}>W+</button>
              <button type="button" onClick={() => editStall(selected.id, { height: Math.max(1, selected.height - 1) })} style={btn}>H-</button>
              <button type="button" onClick={() => editStall(selected.id, { height: selected.height + 1 })} style={btn}>H+</button>
            </div>
            <button type="button" onClick={() => { deleteStall(selected.id); setSelected(null); }} style={{ marginLeft: "auto", border: "none", background: "transparent", color: C.coral, cursor: "pointer", padding: 8 }}><Trash2 size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const btn = { border: `1px solid ${C.line}`, background: C.surface, padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, color: C.ink };
