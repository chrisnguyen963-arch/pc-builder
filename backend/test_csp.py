import pytest
from routers.compatibility import (
    cpu_mobo, mobo_ram, gpu_psu, mobo_case, ac3
)

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

# ── Constraint unit tests ──────────────────────────────────────────────────────

class TestCpuMobo:
    def test_matching_socket_compatible(self):
        assert cpu_mobo(make_cpu("LGA1700"), make_mobo("LGA1700", "DDR4")) is True

    def test_mismatched_socket_incompatible(self):
        assert cpu_mobo(make_cpu("LGA1700"), make_mobo("AM5", "DDR5")) is False

    def test_am5_to_am5_compatible(self):
        assert cpu_mobo(make_cpu("AM5"), make_mobo("AM5", "DDR5")) is True


class TestMoboRam:
    def test_ddr4_mobo_ddr4_ram_compatible(self):
        assert mobo_ram(make_mobo("LGA1700", "DDR4"), make_ram("DDR4")) is True

    def test_ddr4_mobo_ddr5_ram_incompatible(self):
        assert mobo_ram(make_mobo("LGA1700", "DDR4"), make_ram("DDR5")) is False

    def test_ddr5_mobo_ddr5_ram_compatible(self):
        assert mobo_ram(make_mobo("AM5", "DDR5"), make_ram("DDR5")) is True


class TestGpuPsu:
    def test_sufficient_psu_compatible(self):
        assert gpu_psu(make_gpu(200), make_psu(750)) is True

    def test_insufficient_psu_incompatible(self):
        assert gpu_psu(make_gpu(355), make_psu(600)) is False

    def test_exactly_at_limit_fails(self):
        assert gpu_psu(make_gpu(200), make_psu(437)) is False


class TestMoboCase:
    def test_atx_mobo_atx_case_compatible(self):
        assert mobo_case(make_mobo("LGA1700", "DDR4", "ATX"), make_case("ATX")) is True

    def test_matx_mobo_atx_case_compatible(self):
        assert mobo_case(make_mobo("LGA1700", "DDR4", "mATX"), make_case("ATX")) is True

    def test_atx_mobo_matx_case_incompatible(self):
        assert mobo_case(make_mobo("LGA1700", "DDR4", "ATX"), make_case("mATX")) is False

    def test_matx_mobo_matx_case_compatible(self):
        assert mobo_case(make_mobo("LGA1700", "DDR4", "mATX"), make_case("mATX")) is True


# ── AC-3 integration tests ─────────────────────────────────────────────────────

class TestAC3:
    def test_consistent_domains_returns_true(self):
        domains = {
            "cpu":         [make_cpu("LGA1700")],
            "motherboard": [make_mobo("LGA1700", "DDR4", "ATX")],
            "ram":         [make_ram("DDR4")],
            "gpu":         [make_gpu(200)],
            "psu":         [make_psu(750)],
            "case":        [make_case("ATX")],
        }
        assert ac3(domains) is True

    def test_socket_mismatch_wipes_domain(self):
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

    def test_pruning_reduces_domain(self):
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