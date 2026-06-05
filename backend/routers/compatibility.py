from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Part, Category
from collections import deque
import copy
import redis
import json
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
CACHE_TTL = 60 * 60  # 1 hour

router = APIRouter(prefix="/compatibility", tags=["compatibility"])

# ── Constraint functions ───────────────────────────────────────────────────────

def cpu_mobo(cpu, mobo):
    return cpu["specs"].get("socket") == mobo["specs"].get("socket")

def mobo_ram(mobo, ram):
    return mobo["specs"].get("mem_gen") == ram["specs"].get("mem_gen")

def gpu_psu(gpu, psu):
    return (gpu["specs"].get("tdp", 0) + 150) <= psu["specs"].get("watts", 0) * 0.8

def mobo_case(mobo, case):
    mobo_form = mobo["specs"].get("form")
    case_form = case["specs"].get("form")
    if case_form == "ATX":
        return True
    return mobo_form == case_form

CONSTRAINTS = {
    ("cpu", "motherboard"):  cpu_mobo,
    ("motherboard", "cpu"):  lambda a, b: cpu_mobo(b, a),
    ("motherboard", "ram"):  mobo_ram,
    ("ram", "motherboard"):  lambda a, b: mobo_ram(b, a),
    ("gpu", "psu"):          gpu_psu,
    ("psu", "gpu"):          lambda a, b: gpu_psu(b, a),
    ("motherboard", "case"): mobo_case,
    ("case", "motherboard"): lambda a, b: mobo_case(b, a),
}

# ── AC-3 ──────────────────────────────────────────────────────────────────────

def revise(domains, xi, xj):
    constraint = CONSTRAINTS.get((xi, xj))
    if not constraint:
        return False
    revised = False
    to_remove = [
        v for v in domains[xi]
        if not any(constraint(v, w) for w in domains[xj])
    ]
    for v in to_remove:
        domains[xi].remove(v)
        revised = True
    return revised

def ac3(domains):
    queue = deque(k for k in CONSTRAINTS.keys())
    while queue:
        xi, xj = queue.popleft()
        if xi not in domains or xj not in domains:
            continue
        if revise(domains, xi, xj):
            if not domains[xi]:
                return False
            for (xk, xl) in CONSTRAINTS:
                if xl == xi and xk != xj:
                    queue.append((xk, xi))
    return True

# ── Request / response models ──────────────────────────────────────────────────

class ValidateRequest(BaseModel):
    cpu_id:         str | None = None
    motherboard_id: str | None = None
    ram_id:         str | None = None
    gpu_id:         str | None = None
    psu_id:         str | None = None
    case_id:        str | None = None

class RecommendRequest(BaseModel):
    budget:   float
    use_case: str = "gaming"

# ── Helpers ───────────────────────────────────────────────────────────────────

def part_to_dict(p, slug):
    return {"id": str(p.id), "name": p.name, "brand": p.brand,
            "specs": p.specs, "category": slug}

def load_all_parts(db):
    rows = db.query(Part, Category)\
             .join(Category, Part.category_id == Category.id)\
             .filter(Part.is_active == True).all()
    domains = {}
    for p, c in rows:
        domains.setdefault(c.slug, []).append(part_to_dict(p, c.slug))
    return domains

# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/validate")
def validate_build(req: ValidateRequest, db: Session = Depends(get_db)):
    key_data = json.dumps({
        k: v for k, v in req.dict().items() if v is not None
    }, sort_keys=True)
    cache_key = "validate:" + hashlib.md5(key_data.encode()).hexdigest()

    cached = r.get(cache_key)
    if cached:
        result = json.loads(cached)
        result["cache_hit"] = True
        return result

    all_domains = load_all_parts(db)
    slot_map = {
        "cpu": req.cpu_id, "motherboard": req.motherboard_id,
        "ram": req.ram_id,  "gpu": req.gpu_id,
        "psu": req.psu_id,  "case": req.case_id,
    }
    domains = copy.deepcopy(all_domains)
    for slot, part_id in slot_map.items():
        if part_id and slot in domains:
            match = [p for p in domains[slot] if p["id"] == part_id]
            if not match:
                raise HTTPException(status_code=404, detail=f"{slot} id not found")
            domains[slot] = match

    consistent = ac3(domains)
    result = {
        "consistent": consistent,
        "domain_sizes": {slot: len(parts) for slot, parts in domains.items()},
        "compatible_parts": domains,
        "cache_hit": False,
    }
    r.setex(cache_key, CACHE_TTL, json.dumps(result))
    return result


@router.post("/recommend")
def recommend_build(req: RecommendRequest, db: Session = Depends(get_db)):
    cache_key = f"recommend:{req.use_case}:{int(req.budget)}"

    cached = r.get(cache_key)
    if cached:
        result = json.loads(cached)
        result["cache_hit"] = True
        return result

    all_domains = load_all_parts(db)
    domains = copy.deepcopy(all_domains)

    splits = {
        "gaming":      {"cpu":.20,"motherboard":.13,"ram":.08,"gpu":.42,"psu":.09,"case":.08},
        "workstation": {"cpu":.30,"motherboard":.15,"ram":.15,"gpu":.25,"psu":.09,"case":.06},
        "ml":          {"cpu":.15,"motherboard":.10,"ram":.12,"gpu":.50,"psu":.08,"case":.05},
    }
    alloc = splits.get(req.use_case, splits["gaming"])

    for slot, ratio in alloc.items():
        cap = req.budget * ratio
        if slot in domains:
            domains[slot] = [p for p in domains[slot]
                             if p["specs"].get("price", 9999) <= cap]

    if not ac3(domains):
        raise HTTPException(status_code=400,
                            detail="No compatible build found for this budget and use case.")

    def score(part, slot):
        s = part["specs"]
        price = s.get("price", 1)
        if slot == "cpu":          return s.get("cores", 0) / price
        if slot == "gpu":          return s.get("vram_gb", 0) / price
        if slot == "ram":          return s.get("capacity_gb", 0) / price
        if slot == "psu":          return s.get("watts", 0) / price
        if slot == "motherboard":  return 1 / price
        if slot == "case":         return 1 / price
        return 0

    build = {}
    for slot in ["cpu", "motherboard", "ram", "gpu", "psu", "case"]:
        if domains.get(slot):
            build[slot] = max(domains[slot], key=lambda p: score(p, slot))

    total = sum(p["specs"].get("price", 0) for p in build.values())
    result = {"build": build, "total_price": total, "budget": req.budget, "cache_hit": False}
    r.setex(cache_key, CACHE_TTL, json.dumps(result))
    return result


@router.post("/cache/invalidate")
def invalidate_cache():
    keys = r.keys("recommend:*") + r.keys("validate:*")
    if keys:
        r.delete(*keys)
    return {"invalidated": len(keys), "message": f"Cleared {len(keys)} cached entries"}