import { useState } from "react"
import axios from "axios"

const API = "https://pc-builder-backend-production-0634.up.railway.app/parts/"

const SLOT_ICONS: Record<string, string> = {
  cpu: "🧠", motherboard: "🖥️", ram: "💾",
  gpu: "🎮", psu: "⚡", case: "📦",
}

// Newegg search links for every part by model name
const NEWEGG_LINKS: Record<string, string> = {
  "i5-13600K":          "https://www.newegg.com/p/N82E16819118416",
  "i7-13700K":          "https://www.newegg.com/p/N82E16819118426",
  "i9-13900K":          "https://www.newegg.com/p/N82E16819118427",
  "i5-12600K":          "https://www.newegg.com/p/N82E16819118373",
  "Ryzen 5 7600X":      "https://www.newegg.com/p/N82E16819113773",
  "Ryzen 7 7700X":      "https://www.newegg.com/p/N82E16819113779",
  "Ryzen 9 7900X":      "https://www.newegg.com/p/N82E16819113780",
  "Ryzen 9 7950X":      "https://www.newegg.com/p/N82E16819113781",
  "ROG Strix Z690-A":   "https://www.newegg.com/p/N82E16813119386",
  "MAG B660 Tomahawk":  "https://www.newegg.com/p/N82E16813144536",
  "B660M DS3H":         "https://www.newegg.com/p/N82E16813145315",
  "ProArt Z790-Creator":"https://www.newegg.com/p/N82E16813119536",
  "MEG X670E ACE":      "https://www.newegg.com/p/N82E16813144570",
  "B650 Aorus Elite":   "https://www.newegg.com/p/N82E16813145388",
  "ROG Crosshair X670E":"https://www.newegg.com/p/N82E16813119499",
  "B650M Pro RS":       "https://www.newegg.com/p/N82E16813157960",
  "Vengeance DDR4-3200":"https://www.newegg.com/p/N82E16820236541",
  "Trident Z DDR4-3600":"https://www.newegg.com/p/N82E16820232865",
  "Fury Beast DDR4-3200":"https://www.newegg.com/p/N82E16820242696",
  "Dominator DDR5-5200":"https://www.newegg.com/p/N82E16820236862",
  "Trident Z5 DDR5-6000":"https://www.newegg.com/p/N82E16820232992",
  "Fury Beast DDR5-5200":"https://www.newegg.com/p/N82E16820242853",
  "RTX 4060":           "https://www.newegg.com/p/pl?d=rtx+4060",
  "RTX 4070":           "https://www.newegg.com/p/pl?d=rtx+4070",
  "RTX 4070 Ti":        "https://www.newegg.com/p/pl?d=rtx+4070+ti",
  "RTX 4080":           "https://www.newegg.com/p/pl?d=rtx+4080",
  "RX 7600":            "https://www.newegg.com/p/pl?d=rx+7600",
  "RX 7700 XT":         "https://www.newegg.com/p/pl?d=rx+7700+xt",
  "RX 7900 XTX":        "https://www.newegg.com/p/pl?d=rx+7900+xtx",
  "RM650x":             "https://www.newegg.com/p/N82E16817139232",
  "RM750x":             "https://www.newegg.com/p/N82E16817139265",
  "Focus GX-850":       "https://www.newegg.com/p/N82E16817151234",
  "Dark Power 1000W":   "https://www.newegg.com/p/N82E16817801042",
  "SuperNOVA 750 G6":   "https://www.newegg.com/p/N82E16817438167",
  "Meshify 2":          "https://www.newegg.com/p/N82E16811352110",
  "PC-O11 Dynamic":     "https://www.newegg.com/p/N82E16811112598",
  "H510":               "https://www.newegg.com/p/N82E16811146327",
  "MasterBox Q300L":    "https://www.newegg.com/p/N82E16811119338",
  "Pop Mini":           "https://www.newegg.com/p/N82E16811352137",
}

// Product images — using publicly accessible static images per category
// as fallback when model-specific images aren't available
const PART_IMAGES: Record<string, string> = {
  // CPUs
  "i5-13600K":            "/images/cpu-i5-13600K.png",
  "i7-13700K":            "/images/cpu-i7-13700K.png",
  "i9-13900K":            "/images/cpu-i9-13900K.png",
  "i5-12600K":            "/images/cpu-i5-12600K.png",
  "Ryzen 5 7600X":        "/images/cpu-ryzen5-7600X.png",
  "Ryzen 7 7700X":        "/images/cpu-ryzen7-7700X.png",
  "Ryzen 9 7900X":        "/images/cpu-ryzen9-7900X.png",
  "Ryzen 9 7950X":        "/images/cpu-ryzen9-7950X.png",
  // Motherboards
  "ROG Strix Z690-A":     "/images/mobo-z690-rog.png",
  "MAG B660 Tomahawk":    "/images/mobo-b660-tomahawk.png",
  "B660M DS3H":           "/images/mobo-b660m-ds3h.png",
  "ProArt Z790-Creator":  "/images/mobo-z790-proart.png",
  "MEG X670E ACE":        "/images/mobo-x670e-ace.png",
  "B650 Aorus Elite":     "/images/mobo-b650-aorus.png",
  "ROG Crosshair X670E":  "/images/mobo-x670e-crosshair.png",
  "B650M Pro RS":         "/images/mobo-b650m-profs.png",
  // RAM
  "Vengeance DDR4-3200":  "/images/ram-vengeance-ddr4.png",
  "Trident Z DDR4-3600":  "/images/ram-tridentz-ddr4.png",
  "Fury Beast DDR4-3200": "/images/ram-furybeast-ddr4.png",
  "Dominator DDR5-5200":  "/images/ram-dominator-ddr5.png",
  "Trident Z5 DDR5-6000": "/images/ram-tridentz5-ddr5.png",
  "Fury Beast DDR5-5200": "/images/ram-furybeast-ddr5.png",
  // GPUs
  "RTX 4060":             "/images/gpu-rtx4060.png",
  "RTX 4070":             "/images/gpu-rtx4070.png",
  "RTX 4070 Ti":          "/images/gpu-rtx4070ti.png",
  "RTX 4080":             "/images/gpu-rtx4080.png",
  "RX 7600":              "/images/gpu-rx7600.png",
  "RX 7700 XT":           "/images/gpu-rx7700xt.png",
  "RX 7900 XTX":          "/images/gpu-rx7900xtx.png",
  // PSUs
  "RM650x":               "/images/psu-rm650x.png",
  "RM750x":               "/images/psu-rm750x.png",
  "Focus GX-850":         "/images/psu-focus-gx850.png",
  "Dark Power 1000W":     "/images/psu-dark-power-1000.png",
  "SuperNOVA 750 G6":     "/images/psu-supernova-750.png",
  // Cases
  "Meshify 2":            "/images/case-meshify2.png",
  "PC-O11 Dynamic":       "/images/case-o11-dynamic.png",
  "H510":                 "/images/case-h510.png",
  "MasterBox Q300L":      "/images/case-q300l.png",
  "Pop Mini":             "/images/case-pop-mini.png",
}

// Fallback icons per category if image fails to load
const CATEGORY_FALLBACK: Record<string, string> = {
  cpu: "🧠", motherboard: "🖥️", ram: "💾",
  gpu: "🎮", psu: "⚡", case: "📦",
}

type Part = {
  id: string
  name: string
  brand: string
  model: string
  specs: Record<string, string | number>
  category: string
}

export default function App() {
  const [slots, setSlots]             = useState<Record<string, string>>({})
  const [partOptions, setPartOptions] = useState<Record<string, Part[]>>({})
  const [allParts, setAllParts]       = useState<Record<string, Part[]>>({})
  const [loaded, setLoaded]           = useState(false)
  const [validating, setValidating]   = useState(false)
  const [error, setError]             = useState<string | null>(null)

  async function loadParts() {
    if (loaded) return
    const cats = ["cpu", "motherboard", "ram", "gpu", "psu", "case"]
    const results = await Promise.all(
      cats.map(c => axios.get(`${API}/parts?category=${c}`))
    )
    const options: Record<string, Part[]> = {}
    cats.forEach((c, i) => { options[c] = results[i].data })
    setPartOptions(options)
    setAllParts(options)
    setLoaded(true)
  }

  async function validateBuild(newSlots: Record<string, string>) {
    if (Object.keys(newSlots).length === 0) return
    setValidating(true)
    setError(null)
    try {
      const body: Record<string, string> = {}
      Object.entries(newSlots).forEach(([slot, id]) => {
        body[`${slot}_id`] = id
      })
      const res = await axios.post(`${API}/compatibility/validate`, body)
      setPartOptions(res.data.compatible_parts)
    } catch (e: any) {
      setError(e.response?.data?.detail ?? "Validation failed")
    } finally {
      setValidating(false)
    }
  }

  function selectPart(slot: string, id: string) {
    // Toggle off if already selected
    const newSlots = slots[slot] === id
      ? (() => { const s = { ...slots }; delete s[slot]; return s })()
      : { ...slots, [slot]: id }
    setSlots(newSlots)
    validateBuild(newSlots)
  }

  function reset() {
    setSlots({})
    setPartOptions(allParts)
    setError(null)
  }

  const manualTotal = ["cpu", "motherboard", "ram", "gpu", "psu", "case"].reduce((sum, slot) => {
    const part = allParts[slot]?.find(p => p.id === slots[slot])
    return sum + (Number(part?.specs?.price) || 0)
  }, 0)

  const selectedCount = Object.keys(slots).length
  const allSelected   = selectedCount === 6

  // Load parts on first render
  if (!loaded) { loadParts() }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>PC Builder</h1>
            <p style={styles.subtitle}>
              Pick any part — incompatible options disappear automatically
            </p>
          </div>
          {selectedCount > 0 && (
            <button onClick={reset} style={styles.resetBtn}>
              ↺ Reset
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div style={styles.progressWrap}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${(selectedCount / 6) * 100}%` }} />
          </div>
          <span style={styles.progressLabel}>{selectedCount} / 6 parts selected</span>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {validating && <div style={styles.validating}>⚡ Running compatibility check...</div>}

        {/* Slots */}
        {["cpu", "motherboard", "ram", "gpu", "psu", "case"].map(slot => {
          const chosen = allParts[slot]?.find(p => p.id === slots[slot])
          const options = partOptions[slot] ?? []
          return (
            <div key={slot} style={styles.slotSection}>

              {/* Slot header */}
              <div style={styles.slotHeader}>
                <span style={styles.slotIcon}>{SLOT_ICONS[slot]}</span>
                <span style={styles.slotName}>{slot}</span>
                {chosen && (
                  <span style={styles.slotChosen}>✓ {chosen.name}</span>
                )}
                {options.length === 0 && !chosen && (
                  <span style={styles.slotEmpty}>No compatible options</span>
                )}
              </div>

              {/* Part cards */}
              <div style={styles.optionRow}>
                {options.map(part => {
                  const isChosen  = slots[slot] === part.id
                  const imgSrc    = PART_IMAGES[part.model]
                  const neweggUrl = NEWEGG_LINKS[part.model]
                  return (
                    <div
                      key={part.id}
                      style={isChosen ? styles.partCardActive : styles.partCard}
                      onClick={() => selectPart(slot, part.id)}
                    >
                      {/* Part image */}
                      <div style={styles.imgWrap}>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={part.name}
                            style={styles.partImg}
                            onError={e => {
                              const img = e.target as HTMLImageElement
                              img.style.display = "none"
                              const fallback = img.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = "block"
                            }}
                          />
                        ) : null}
                        <span style={{ display: imgSrc ? "none" : "block", fontSize: 32 }}>
                          {CATEGORY_FALLBACK[slot]}
                        </span>
                      </div>

                      {/* Info */}
                      <div style={styles.partInfo}>
                        <div style={styles.partBrand}>{part.brand}</div>
                        <div style={styles.partName}>{part.name}</div>

                        {/* Key specs */}
                        <div style={styles.specRow}>
                          {Object.entries(part.specs)
                            .filter(([k]) => k !== "price")
                            .slice(0, 3)
                            .map(([k, v]) => (
                              <span key={k} style={styles.spec}>
                                {k}: {String(v)}
                              </span>
                            ))}
                        </div>

                        {/* Price + Newegg link */}
                        <div style={styles.partFooter}>
                          <span style={styles.partPrice}>
                            ${Number(part.specs.price).toLocaleString()}
                          </span>
                          {neweggUrl && <a href={neweggUrl} target="_blank" rel="noopener noreferrer" style={styles.neweggLink} onClick={(e) => e.stopPropagation()}>Newegg ↗</a>}
                        </div>
                      </div>

                      {/* Selected checkmark */}
                      {isChosen && <div style={styles.checkmark}>✓</div>}
                    </div>
                  )
                })}

                {options.length === 0 && (
                  <p style={styles.noOptions}>
                    Change an earlier selection to unlock options here
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {/* Total bar — shows when any part selected */}
        {selectedCount > 0 && (
          <div style={styles.totalBar}>
            <div>
              <div style={styles.totalLabel}>Build total</div>
              <div style={styles.totalAmount}>${manualTotal.toLocaleString()}</div>
            </div>
            <div style={styles.totalRight}>
              <span style={styles.totalParts}>{selectedCount} of 6 parts</span>
              {allSelected && (
                <span style={styles.completeBadge}>✓ Complete build</span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#e8e8e8",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 16px 120px",
  },
  container:    { maxWidth: 1100, margin: "0 auto" },
  headerRow:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title:        { fontSize: 32, fontWeight: 600, margin: "0 0 6px", color: "#fff" },
  subtitle:     { fontSize: 14, color: "#666", margin: 0 },
  resetBtn: {
    padding: "8px 18px", borderRadius: 8, border: "1px solid #3a3a3a",
    background: "#1a1a1a", color: "#888", cursor: "pointer", fontSize: 13,
    flexShrink: 0,
  },
  progressWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 },
  progressBar:  { flex: 1, height: 4, background: "#2a2a2a", borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", background: "#7c6ff7", borderRadius: 99, transition: "width 0.3s ease" },
  progressLabel:{ fontSize: 12, color: "#555", whiteSpace: "nowrap" },
  error: {
    background: "#2a1515", border: "1px solid #5a2020", borderRadius: 8,
    padding: "12px 16px", color: "#f08080", marginBottom: 20, fontSize: 13,
  },
  validating:   { fontSize: 12, color: "#7c6ff7", marginBottom: 16 },
  slotSection:  { marginBottom: 36 },
  slotHeader:   { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  slotIcon:     { fontSize: 16 },
  slotName: {
    fontSize: 11, color: "#555", textTransform: "uppercase",
    letterSpacing: "0.08em", fontWeight: 500,
  },
  slotChosen:   { fontSize: 12, color: "#7c6ff7", marginLeft: "auto" },
  slotEmpty:    { fontSize: 12, color: "#5a2020", marginLeft: "auto" },
  optionRow:    { display: "flex", flexWrap: "wrap", gap: 12 },
  partCard: {
    width: 160, background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: 10, padding: 12, cursor: "pointer", position: "relative",
    transition: "border-color 0.15s",
  },
  partCardActive: {
    width: 160, background: "#1a1a1a", border: "2px solid #7c6ff7",
    borderRadius: 10, padding: 12, cursor: "pointer", position: "relative",
  },
  imgWrap: {
    width: "100%", height: 90, display: "flex", alignItems: "center",
    justifyContent: "center", marginBottom: 10,
    background: "#111", borderRadius: 6, overflow: "hidden",
  },
  partImg:      { width: "100%", height: "100%", objectFit: "contain" },
  partInfo:     { display: "flex", flexDirection: "column", gap: 4 },
  partBrand:    { fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" },
  partName:     { fontSize: 12, fontWeight: 500, color: "#ddd", lineHeight: 1.3 },
  specRow:      { display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 },
  spec: {
    fontSize: 10, padding: "1px 5px", borderRadius: 3,
    background: "#222", color: "#666", border: "1px solid #2a2a2a",
  },
  partFooter:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  partPrice:    { fontSize: 15, fontWeight: 600, color: "#a09cf7" },
  neweggLink: {
    fontSize: 10, color: "#555", textDecoration: "none",
    border: "1px solid #2a2a2a", borderRadius: 4, padding: "2px 6px",
  },
  checkmark: {
    position: "absolute", top: 8, right: 8, width: 18, height: 18,
    background: "#7c6ff7", borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff",
  },
  noOptions:    { fontSize: 12, color: "#5a2020", fontStyle: "italic", padding: "8px 0" },
  totalBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: "#111", borderTop: "1px solid #2a2a2a",
    padding: "16px 32px", display: "flex", justifyContent: "space-between",
    alignItems: "center", zIndex: 100,
  },
  totalLabel:   { fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 },
  totalAmount:  { fontSize: 24, fontWeight: 600, color: "#fff" },
  totalRight:   { display: "flex", alignItems: "center", gap: 12 },
  totalParts:   { fontSize: 13, color: "#555" },
  completeBadge: {
    fontSize: 12, padding: "5px 12px", borderRadius: 20,
    background: "#1a3a1a", border: "1px solid #2a5a2a", color: "#6abf6a",
  },
}