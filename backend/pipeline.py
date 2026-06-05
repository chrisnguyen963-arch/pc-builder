from prefect import flow, task
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Part, PriceHistory, Category
import logging

logger = logging.getLogger(__name__)

# ── Tasks ──────────────────────────────────────────────────────────────────────

@task(retries=3, retry_delay_seconds=30, log_prints=True)
def fetch_prices(category_slug: str) -> list[dict]:
    """
    Fetches updated prices. Currently returns mock data.
    Replace with real httpx scraping logic for production.
    """
    print(f"Fetching prices for: {category_slug}")
    mock_updates = {
        "cpu": [
            {"model": "i5-13600K",    "price": 289.99, "source": "newegg"},
            {"model": "i7-13700K",    "price": 399.99, "source": "newegg"},
            {"model": "Ryzen 5 7600X","price": 239.99, "source": "newegg"},
        ],
        "gpu": [
            {"model": "RTX 4070", "price": 579.99, "source": "newegg"},
            {"model": "RX 7600",  "price": 259.99, "source": "newegg"},
        ],
    }
    return mock_updates.get(category_slug, [])


@task(log_prints=True)
def store_prices(updates: list[dict], category_slug: str) -> int:
    """
    Appends new price records to price_history.
    Never mutates old rows — full history is preserved (SCD-2).
    """
    if not updates:
        print(f"No updates for {category_slug}")
        return 0

    db: Session = SessionLocal()
    stored = 0
    try:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if not cat:
            return 0

        for update in updates:
            part = db.query(Part).filter(
                Part.category_id == cat.id,
                Part.model == update["model"]
            ).first()
            if not part:
                continue

            record = PriceHistory(
                part_id    = part.id,
                price      = update["price"],
                source     = update["source"],
                source_url = f"https://newegg.com/search?q={update['model'].replace(' ', '+')}",
            )
            db.add(record)

            specs = dict(part.specs)
            specs["price"] = float(update["price"])
            part.specs = specs

            stored += 1
            print(f"Stored: {update['model']} → ${update['price']}")

        db.commit()
    finally:
        db.close()

    return stored


@task(log_prints=True)
def invalidate_cache() -> None:
    """
    Clears Redis cache after new prices are stored.
    Event-driven invalidation ensures recommendations always use fresh data.
    """
    import redis, os
    r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
    keys = r.keys("recommend:*") + r.keys("validate:*")
    if keys:
        r.delete(*keys)
    print(f"Cache cleared: {len(keys)} keys removed")


# ── Flow ───────────────────────────────────────────────────────────────────────

@flow(name="pc-builder-price-scraper", log_prints=True)
def scrape_prices():
    """
    Main ETL flow. Run manually or schedule via Prefect cron.
    Pipeline: fetch → store → invalidate cache.
    """
    categories = ["cpu", "gpu", "motherboard", "ram", "psu", "case"]
    total_stored = 0

    for cat in categories:
        updates = fetch_prices(cat)
        stored  = store_prices(updates, cat)
        total_stored += stored

    invalidate_cache()
    print(f"Pipeline complete. {total_stored} price records stored.")
    return total_stored


if __name__ == "__main__":
    scrape_prices()