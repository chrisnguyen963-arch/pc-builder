import sys
import os
import unittest.mock as mock

# Mock out database/dotenv before any imports touch them
sys.modules['database'] = mock.MagicMock()
sys.modules['models'] = mock.MagicMock()
sys.modules['redis'] = mock.MagicMock()

# Now we can safely import just the pure CSP functions
from routers.compatibility import (
    cpu_mobo, mobo_ram, gpu_psu, mobo_case, ac3
)

import pytest

# ── Fixture helpers ────────────────────────────────────────────────────────────

def make_cpu(socket, tdp=125):
    return {"id": "cpu-1", "specs": {"socket": socket, "tdp": tdp}, "category": "cpu"}

def make_mobo(socket, mem_gen, form="ATX"):
    return {"id": "mobo-1", "specs": {"socket": socket, "mem_gen": mem_gen, "form": form}, "category": "motherboard"}

def make_ram(mem_gen):
    return {"id": "ram-1", "specs": {"mem_gen": mem_gen}, "category": "ram"}

def make_gpu(tdp):
    return {"id": "gpu-1", "specs": {"tdp": tdp}, "category": "gpu"}

def make_psu(watts):
    return {"id": "psu-1", "specs": {"watts": watts}, "category": "psu"}

def make_case(form):
    return {"id": "case-1", "specs": {"form": form}, "category": "case"}

# ── CPU + Motherboard ──────────────────────────────────────────────────────────

def test_cpu_mobo_matching_socket():
    assert cpu_mobo(make_cpu("LGA1700"), make_mobo("LGA1700", "DDR4")) is True

def test_cpu_mobo_mismatched_socket():
    assert cpu_mobo(make_cpu("LGA1700"), make_mobo("AM5", "DDR5")) is False

def test_cpu_mobo_am5_compatible():
    assert cpu_mobo(make_cpu("AM5"), make_mobo("AM5", "DDR5")) is True

# ── Motherboard + RAM ──────────────────────────────────────────────────────────

def test_mobo_ram_ddr4_match():
    assert mobo_ram(make_mobo("LGA1700", "DDR4"), make_ram("DDR4")) is True

def test_mobo_ram_ddr4_ddr5_mismatch():
    assert mobo_ram(make_mobo("LGA1700", "DDR4"), make_ram("DDR5")) is False

def test_mobo_ram_ddr5_match():
    assert mobo_ram(make_mobo("AM5", "DDR5"), make_ram("DDR5")) is True

# ── GPU + PSU ──────────────────────────────────────────────────────────────────

def test_gpu_psu_sufficient():
    assert gpu_psu(make_gpu(200), make_psu(750)) is True

def test_gpu_psu_insufficient():
    assert gpu_psu(make_gpu(355), make_psu(600)) is False

def test_gpu_psu_at_limit_fails():
    assert gpu_psu(make_gpu(200), make_psu(437)) is False

# ── Motherboard + Case ─────────────────────────────────────────────────────────

def test_mobo_case_atx_atx():
    assert mobo_case(make_mobo("LGA1700", "DDR4", "ATX"), make_case("ATX")) is True

def test_mobo_case_matx_fits_atx_case():
    assert mobo_case(make_mobo("LGA1700", "DDR4", "mATX"), make_case("ATX")) is True

def test_mobo_case_atx_matx_fails():
    assert mobo_case(make_mobo("LGA1700", "DDR4", "ATX"), make_case("mATX")) is False

def test_mobo_case_matx_matx():
    assert mobo_case(make_mobo("LGA1700", "DDR4", "mATX"), make_case("mATX")) is True

# ── AC-3 integration ───────────────────────────────────────────────────────────

def test_ac3_consistent_build():
    domains = {
        "cpu":         [make_cpu("LGA1700")],
        "motherboard": [make_mobo("LGA1700", "DDR4", "ATX")],
        "ram":         [make_ram("DDR4")],
        "gpu":         [make_gpu(200)],
        "psu":         [make_psu(750)],
        "case":        [make_case("ATX")],
    }
    assert ac3(domains) is True

def test_ac3_socket_mismatch_fails():
    domains = {
        "cpu":         [make_cpu("LGA1700")],
        "motherboard": [make_mobo("AM5", "DDR5", "ATX")],
        "ram":         [make_ram("DDR5")],
        "gpu":         [make_gpu(200)],
        "psu":         [make_psu(750)],
        "case":        [make_case("ATX")],
    }
    result = ac3(domains)
    assert result is False or len(domains["cpu"]) == 0 or len(domains["motherboard"]) == 0

def test_ac3_prunes_incompatible_ram():
    domains = {
        "cpu":         [make_cpu("LGA1700")],
        "motherboard": [make_mobo("LGA1700", "DDR4", "ATX")],
        "ram":         [make_ram("DDR4"), make_ram("DDR5")],
        "gpu":         [make_gpu(150)],
        "psu":         [make_psu(750)],
        "case":        [make_case("ATX")],
    }
    ac3(domains)
    assert all(r["specs"]["mem_gen"] == "DDR4" for r in domains["ram"])
    assert len(domains["ram"]) == 1