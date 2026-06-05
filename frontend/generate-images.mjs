import { createCanvas } from "canvas"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, "public", "images")

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const PARTS = {
  // CPUs
  "cpu-i5-13600K.png":        { label: "i5-13600K",     sub: "14 cores · LGA1700",    color: "#1a6fc4", icon: "CPU" },
  "cpu-i7-13700K.png":        { label: "i7-13700K",     sub: "16 cores · LGA1700",    color: "#1a6fc4", icon: "CPU" },
  "cpu-i9-13900K.png":        { label: "i9-13900K",     sub: "24 cores · LGA1700",    color: "#1a6fc4", icon: "CPU" },
  "cpu-i5-12600K.png":        { label: "i5-12600K",     sub: "10 cores · LGA1700",    color: "#1a6fc4", icon: "CPU" },
  "cpu-ryzen5-7600X.png":     { label: "Ryzen 5 7600X", sub: "6 cores · AM5",         color: "#e05c00", icon: "CPU" },
  "cpu-ryzen7-7700X.png":     { label: "Ryzen 7 7700X", sub: "8 cores · AM5",         color: "#e05c00", icon: "CPU" },
  "cpu-ryzen9-7900X.png":     { label: "Ryzen 9 7900X", sub: "12 cores · AM5",        color: "#e05c00", icon: "CPU" },
  "cpu-ryzen9-7950X.png":     { label: "Ryzen 9 7950X", sub: "16 cores · AM5",        color: "#e05c00", icon: "CPU" },
  // Motherboards
  "mobo-z690-rog.png":        { label: "ROG Z690-A",    sub: "LGA1700 · DDR4 · ATX",  color: "#7c3aed", icon: "MOBO" },
  "mobo-b660-tomahawk.png":   { label: "B660 Tomahawk", sub: "LGA1700 · DDR4 · ATX",  color: "#7c3aed", icon: "MOBO" },
  "mobo-b660m-ds3h.png":      { label: "B660M DS3H",    sub: "LGA1700 · DDR4 · mATX", color: "#7c3aed", icon: "MOBO" },
  "mobo-z790-proart.png":     { label: "Z790 ProArt",   sub: "LGA1700 · DDR4 · ATX",  color: "#7c3aed", icon: "MOBO" },
  "mobo-x670e-ace.png":       { label: "X670E ACE",     sub: "AM5 · DDR5 · ATX",      color: "#7c3aed", icon: "MOBO" },
  "mobo-b650-aorus.png":      { label: "B650 Aorus",    sub: "AM5 · DDR5 · ATX",      color: "#7c3aed", icon: "MOBO" },
  "mobo-x670e-crosshair.png": { label: "X670E Crosshair",sub: "AM5 · DDR5 · ATX",     color: "#7c3aed", icon: "MOBO" },
  "mobo-b650m-profs.png":     { label: "B650M Pro RS",  sub: "AM5 · DDR5 · mATX",     color: "#7c3aed", icon: "MOBO" },
  // RAM
  "ram-vengeance-ddr4.png":   { label: "Vengeance",     sub: "DDR4-3200 · 16GB",      color: "#0e7490", icon: "RAM" },
  "ram-tridentz-ddr4.png":    { label: "Trident Z",     sub: "DDR4-3600 · 32GB",      color: "#0e7490", icon: "RAM" },
  "ram-furybeast-ddr4.png":   { label: "Fury Beast",    sub: "DDR4-3200 · 16GB",      color: "#0e7490", icon: "RAM" },
  "ram-dominator-ddr5.png":   { label: "Dominator",     sub: "DDR5-5200 · 32GB",      color: "#0891b2", icon: "RAM" },
  "ram-tridentz5-ddr5.png":   { label: "Trident Z5",    sub: "DDR5-6000 · 32GB",      color: "#0891b2", icon: "RAM" },
  "ram-furybeast-ddr5.png":   { label: "Fury Beast",    sub: "DDR5-5200 · 16GB",      color: "#0891b2", icon: "RAM" },
  // GPUs
  "gpu-rtx4060.png":          { label: "RTX 4060",      sub: "8GB VRAM · 115W",       color: "#16a34a", icon: "GPU" },
  "gpu-rtx4070.png":          { label: "RTX 4070",      sub: "12GB VRAM · 200W",      color: "#16a34a", icon: "GPU" },
  "gpu-rtx4070ti.png":        { label: "RTX 4070 Ti",   sub: "12GB VRAM · 285W",      color: "#16a34a", icon: "GPU" },
  "gpu-rtx4080.png":          { label: "RTX 4080",      sub: "16GB VRAM · 320W",      color: "#16a34a", icon: "GPU" },
  "gpu-rx7600.png":           { label: "RX 7600",       sub: "8GB VRAM · 165W",       color: "#dc2626", icon: "GPU" },
  "gpu-rx7700xt.png":         { label: "RX 7700 XT",    sub: "12GB VRAM · 245W",      color: "#dc2626", icon: "GPU" },
  "gpu-rx7900xtx.png":        { label: "RX 7900 XTX",   sub: "24GB VRAM · 355W",      color: "#dc2626", icon: "GPU" },
  // PSUs
  "psu-rm650x.png":           { label: "RM650x",        sub: "650W · Gold",           color: "#b45309", icon: "PSU" },
  "psu-rm750x.png":           { label: "RM750x",        sub: "750W · Gold",           color: "#b45309", icon: "PSU" },
  "psu-focus-gx850.png":      { label: "Focus GX-850",  sub: "850W · Gold",           color: "#b45309", icon: "PSU" },
  "psu-dark-power-1000.png":  { label: "Dark Power",    sub: "1000W · Platinum",      color: "#b45309", icon: "PSU" },
  "psu-supernova-750.png":    { label: "SuperNOVA 750", sub: "750W · Gold",           color: "#b45309", icon: "PSU" },
  // Cases
  "case-meshify2.png":        { label: "Meshify 2",     sub: "ATX · Full Mesh",       color: "#475569", icon: "CASE" },
  "case-o11-dynamic.png":     { label: "O11 Dynamic",   sub: "ATX · Glass",           color: "#475569", icon: "CASE" },
  "case-h510.png":            { label: "H510",          sub: "ATX · Compact",         color: "#475569", icon: "CASE" },
  "case-q300l.png":           { label: "Q300L",         sub: "mATX · Budget",         color: "#475569", icon: "CASE" },
  "case-pop-mini.png":        { label: "Pop Mini",      sub: "mATX · Fractal",        color: "#475569", icon: "CASE" },
}

// Icon shapes drawn with canvas
function drawIcon(ctx, type, cx, cy, size, color) {
  ctx.strokeStyle = color
  ctx.fillStyle = color + "33"
  ctx.lineWidth = 2

  if (type === "CPU") {
    // Square chip with pins
    const s = size * 0.45
    ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
    ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)
    // Inner square
    ctx.strokeStyle = color
    ctx.strokeRect(cx - s * 0.55, cy - s * 0.55, s * 1.1, s * 1.1)
    // Pins
    const pins = 4, pinLen = s * 0.25, gap = (s * 1.6) / (pins + 1)
    for (let i = 0; i < pins; i++) {
      const offset = -s * 0.8 + gap * (i + 1)
      ctx.beginPath(); ctx.moveTo(cx + offset, cy - s); ctx.lineTo(cx + offset, cy - s - pinLen); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + offset, cy + s); ctx.lineTo(cx + offset, cy + s + pinLen); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - s, cy + offset); ctx.lineTo(cx - s - pinLen, cy + offset); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + s, cy + offset); ctx.lineTo(cx + s + pinLen, cy + offset); ctx.stroke()
    }

  } else if (type === "MOBO") {
    // Rectangle board with slots
    const w = size * 0.85, h = size * 0.75
    ctx.fillRect(cx - w/2, cy - h/2, w, h)
    ctx.strokeRect(cx - w/2, cy - h/2, w, h)
    // RAM slots
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = color
      ctx.fillRect(cx - w/2 + w*0.6 + i*8, cy - h/2 + 6, 5, h * 0.55)
    }
    // CPU socket
    ctx.fillStyle = color + "66"
    ctx.fillRect(cx - w/2 + 8, cy - h/2 + 8, w*0.4, w*0.4)
    ctx.strokeRect(cx - w/2 + 8, cy - h/2 + 8, w*0.4, w*0.4)

  } else if (type === "RAM") {
    // Tall stick shape
    const w = size * 0.22, h = size * 0.75
    for (let i = 0; i < 2; i++) {
      const x = cx - w*1.3 + i * w * 1.6
      ctx.fillRect(x, cy - h/2, w, h)
      ctx.strokeRect(x, cy - h/2, w, h)
      // Notch
      ctx.fillStyle = "#111"
      ctx.fillRect(x + w*0.3, cy + h/2 - 10, w*0.4, 10)
      ctx.fillStyle = color + "33"
    }

  } else if (type === "GPU") {
    // Wide card shape
    const w = size * 0.9, h = size * 0.45
    ctx.fillRect(cx - w/2, cy - h/2, w, h)
    ctx.strokeRect(cx - w/2, cy - h/2, w, h)
    // Fan circles
    for (let i = 0; i < 2; i++) {
      ctx.beginPath()
      ctx.arc(cx - w/4 + i * w/2, cy, h * 0.32, 0, Math.PI * 2)
      ctx.fillStyle = color + "44"
      ctx.fill()
      ctx.strokeStyle = color
      ctx.stroke()
    }
    // PCIe connector at bottom
    ctx.fillStyle = color
    ctx.fillRect(cx - w/2, cy + h/2, w * 0.6, 6)

  } else if (type === "PSU") {
    // Box with fan grill
    const s = size * 0.6
    ctx.fillRect(cx - s, cy - s*0.65, s*2, s*1.3)
    ctx.strokeRect(cx - s, cy - s*0.65, s*2, s*1.3)
    // Fan circle
    ctx.beginPath()
    ctx.arc(cx - s*0.3, cy, s*0.35, 0, Math.PI*2)
    ctx.strokeStyle = color; ctx.stroke()
    // Vents
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + s*0.15, cy - s*0.45 + i * s*0.28)
      ctx.lineTo(cx + s*0.85, cy - s*0.45 + i * s*0.28)
      ctx.stroke()
    }

  } else if (type === "CASE") {
    // Tower shape
    const w = size * 0.55, h = size * 0.82
    ctx.fillRect(cx - w/2, cy - h/2, w, h)
    ctx.strokeRect(cx - w/2, cy - h/2, w, h)
    // Drive bays
    for (let i = 0; i < 3; i++) {
      ctx.strokeRect(cx - w/2 + 6, cy - h/2 + 12 + i*18, w - 12, 12)
    }
    // Power button
    ctx.beginPath()
    ctx.arc(cx, cy + h*0.28, 6, 0, Math.PI*2)
    ctx.fillStyle = color; ctx.fill()
  }
}

function generate(filename, { label, sub, color, icon }) {
  const W = 280, H = 200
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = "#111111"
  ctx.fillRect(0, 0, W, H)

  // Subtle gradient overlay
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.7)
  grad.addColorStop(0, color + "18")
  grad.addColorStop(1, "transparent")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Border
  ctx.strokeStyle = color + "44"
  ctx.lineWidth = 1
  ctx.strokeRect(1, 1, W-2, H-2)

  // Draw icon
  drawIcon(ctx, icon, W/2, H/2 - 14, 52, color)

  // Label
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 13px sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(label, W/2, H - 34)

  // Sub label
  ctx.fillStyle = color + "cc"
  ctx.font = "10px sans-serif"
  ctx.fillText(sub, W/2, H - 18)

  // Save
  const dest = path.join(OUT, filename)
  fs.writeFileSync(dest, canvas.toBuffer("image/png"))
  console.log(`  ✓ ${filename}`)
}

console.log(`\nGenerating ${Object.keys(PARTS).length} part images...\n`)
for (const [filename, data] of Object.entries(PARTS)) {
  generate(filename, data)
}
console.log(`\nDone! All images saved to public/images/\n`)