from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import parts, compatibility

app = FastAPI(title="PC Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parts.router)
app.include_router(compatibility.router)

@app.get("/health")
def health():
    return {"status": "ok"}