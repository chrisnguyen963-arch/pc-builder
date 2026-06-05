from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from models import Part, Category

router = APIRouter(prefix="/parts", tags=["parts"])

@router.get("/")
def get_parts(
    category: str | None = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Part, Category).join(Category, Part.category_id == Category.id).filter(Part.is_active == True)
    if category:
        q = q.filter(Category.slug == category)
    results = q.all()
    return [
        {
            "id":       str(p.id),
            "name":     p.name,
            "brand":    p.brand,
            "model":    p.model,
            "specs":    p.specs,
            "category": c.slug,
        }
        for p, c in results
    ]

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).all()
    return [{"id": str(c.id), "name": c.name, "slug": c.slug} for c in cats]

@router.get("/{part_id}")
def get_part(part_id: str, db: Session = Depends(get_db)):
    p = db.query(Part).filter(Part.id == part_id).first()
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Part not found")
    return {"id": str(p.id), "name": p.name, "brand": p.brand, "specs": p.specs}