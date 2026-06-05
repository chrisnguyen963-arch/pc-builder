-- ── Categories ────────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug) VALUES
  ('11111111-0000-0000-0000-000000000001', 'CPU',         'cpu'),
  ('11111111-0000-0000-0000-000000000002', 'Motherboard', 'motherboard'),
  ('11111111-0000-0000-0000-000000000003', 'RAM',         'ram'),
  ('11111111-0000-0000-0000-000000000004', 'GPU',         'gpu'),
  ('11111111-0000-0000-0000-000000000005', 'PSU',         'psu'),
  ('11111111-0000-0000-0000-000000000006', 'Case',        'case');

-- ── CPUs ──────────────────────────────────────────────────────────────────────
-- specs: socket, tdp, mem_gen (what RAM gen it supports), cores, price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001',
   'Intel Core i5-13600K', 'Intel', 'i5-13600K',
   '{"socket":"LGA1700","tdp":125,"mem_gen":"DDR4","cores":14,"price":299}'),

  ('aaaaaaaa-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000001',
   'Intel Core i7-13700K', 'Intel', 'i7-13700K',
   '{"socket":"LGA1700","tdp":125,"mem_gen":"DDR4","cores":16,"price":409}'),

  ('aaaaaaaa-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000001',
   'Intel Core i9-13900K', 'Intel', 'i9-13900K',
   '{"socket":"LGA1700","tdp":253,"mem_gen":"DDR4","cores":24,"price":589}'),

  ('aaaaaaaa-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000001',
   'Intel Core i5-12600K', 'Intel', 'i5-12600K',
   '{"socket":"LGA1700","tdp":125,"mem_gen":"DDR4","cores":10,"price":199}'),

  ('aaaaaaaa-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000001',
   'AMD Ryzen 5 7600X', 'AMD', 'Ryzen 5 7600X',
   '{"socket":"AM5","tdp":105,"mem_gen":"DDR5","cores":6,"price":249}'),

  ('aaaaaaaa-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000001',
   'AMD Ryzen 7 7700X', 'AMD', 'Ryzen 7 7700X',
   '{"socket":"AM5","tdp":105,"mem_gen":"DDR5","cores":8,"price":349}'),

  ('aaaaaaaa-0000-0000-0000-000000000007',
   '11111111-0000-0000-0000-000000000001',
   'AMD Ryzen 9 7900X', 'AMD', 'Ryzen 9 7900X',
   '{"socket":"AM5","tdp":170,"mem_gen":"DDR5","cores":12,"price":449}'),

  ('aaaaaaaa-0000-0000-0000-000000000008',
   '11111111-0000-0000-0000-000000000001',
   'AMD Ryzen 9 7950X', 'AMD', 'Ryzen 9 7950X',
   '{"socket":"AM5","tdp":170,"mem_gen":"DDR5","cores":16,"price":699}');

-- ── Motherboards ──────────────────────────────────────────────────────────────
-- specs: socket, mem_gen, form (ATX/mATX), chipset, price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000002',
   'ASUS ROG Strix Z690-A', 'ASUS', 'ROG Strix Z690-A',
   '{"socket":"LGA1700","mem_gen":"DDR4","form":"ATX","chipset":"Z690","price":289}'),

  ('bbbbbbbb-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000002',
   'MSI MAG B660 Tomahawk', 'MSI', 'MAG B660 Tomahawk',
   '{"socket":"LGA1700","mem_gen":"DDR4","form":"ATX","chipset":"B660","price":179}'),

  ('bbbbbbbb-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000002',
   'Gigabyte B660M DS3H', 'Gigabyte', 'B660M DS3H',
   '{"socket":"LGA1700","mem_gen":"DDR4","form":"mATX","chipset":"B660","price":109}'),

  ('bbbbbbbb-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000002',
   'ASUS ProArt Z790-Creator', 'ASUS', 'ProArt Z790-Creator',
   '{"socket":"LGA1700","mem_gen":"DDR4","form":"ATX","chipset":"Z790","price":399}'),

  ('bbbbbbbb-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000002',
   'MSI MEG X670E ACE', 'MSI', 'MEG X670E ACE',
   '{"socket":"AM5","mem_gen":"DDR5","form":"ATX","chipset":"X670E","price":499}'),

  ('bbbbbbbb-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000002',
   'Gigabyte B650 Aorus Elite', 'Gigabyte', 'B650 Aorus Elite',
   '{"socket":"AM5","mem_gen":"DDR5","form":"ATX","chipset":"B650","price":199}'),

  ('bbbbbbbb-0000-0000-0000-000000000007',
   '11111111-0000-0000-0000-000000000002',
   'ASUS ROG Crosshair X670E', 'ASUS', 'ROG Crosshair X670E',
   '{"socket":"AM5","mem_gen":"DDR5","form":"ATX","chipset":"X670E","price":599}'),

  ('bbbbbbbb-0000-0000-0000-000000000008',
   '11111111-0000-0000-0000-000000000002',
   'ASRock B650M Pro RS', 'ASRock', 'B650M Pro RS',
   '{"socket":"AM5","mem_gen":"DDR5","form":"mATX","chipset":"B650","price":149}');

-- ── RAM ───────────────────────────────────────────────────────────────────────
-- specs: mem_gen, speed_mhz, capacity_gb, sticks, price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('cccccccc-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000003',
   'Corsair Vengeance 16GB DDR4-3200', 'Corsair', 'Vengeance DDR4-3200',
   '{"mem_gen":"DDR4","speed_mhz":3200,"capacity_gb":16,"sticks":2,"price":45}'),

  ('cccccccc-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000003',
   'G.Skill Trident Z 32GB DDR4-3600', 'G.Skill', 'Trident Z DDR4-3600',
   '{"mem_gen":"DDR4","speed_mhz":3600,"capacity_gb":32,"sticks":2,"price":79}'),

  ('cccccccc-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000003',
   'Kingston Fury Beast 16GB DDR4-3200', 'Kingston', 'Fury Beast DDR4-3200',
   '{"mem_gen":"DDR4","speed_mhz":3200,"capacity_gb":16,"sticks":2,"price":39}'),

  ('cccccccc-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000003',
   'Corsair Dominator 32GB DDR5-5200', 'Corsair', 'Dominator DDR5-5200',
   '{"mem_gen":"DDR5","speed_mhz":5200,"capacity_gb":32,"sticks":2,"price":129}'),

  ('cccccccc-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000003',
   'G.Skill Trident Z5 32GB DDR5-6000', 'G.Skill', 'Trident Z5 DDR5-6000',
   '{"mem_gen":"DDR5","speed_mhz":6000,"capacity_gb":32,"sticks":2,"price":159}'),

  ('cccccccc-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000003',
   'Kingston Fury Beast 16GB DDR5-5200', 'Kingston', 'Fury Beast DDR5-5200',
   '{"mem_gen":"DDR5","speed_mhz":5200,"capacity_gb":16,"sticks":2,"price":69}');

-- ── GPUs ──────────────────────────────────────────────────────────────────────
-- specs: tdp (card only), vram_gb, brand, price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('dddddddd-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000004',
   'NVIDIA RTX 4060', 'NVIDIA', 'RTX 4060',
   '{"tdp":115,"vram_gb":8,"price":299}'),

  ('dddddddd-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000004',
   'NVIDIA RTX 4070', 'NVIDIA', 'RTX 4070',
   '{"tdp":200,"vram_gb":12,"price":599}'),

  ('dddddddd-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000004',
   'NVIDIA RTX 4070 Ti', 'NVIDIA', 'RTX 4070 Ti',
   '{"tdp":285,"vram_gb":12,"price":799}'),

  ('dddddddd-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000004',
   'NVIDIA RTX 4080', 'NVIDIA', 'RTX 4080',
   '{"tdp":320,"vram_gb":16,"price":1199}'),

  ('dddddddd-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000004',
   'AMD Radeon RX 7600', 'AMD', 'RX 7600',
   '{"tdp":165,"vram_gb":8,"price":269}'),

  ('dddddddd-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000004',
   'AMD Radeon RX 7700 XT', 'AMD', 'RX 7700 XT',
   '{"tdp":245,"vram_gb":12,"price":449}'),

  ('dddddddd-0000-0000-0000-000000000007',
   '11111111-0000-0000-0000-000000000004',
   'AMD Radeon RX 7900 XTX', 'AMD', 'RX 7900 XTX',
   '{"tdp":355,"vram_gb":24,"price":999}');

-- ── PSUs ──────────────────────────────────────────────────────────────────────
-- specs: watts, rating (80+ tier), price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('eeeeeeee-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000005',
   'Corsair RM650x', 'Corsair', 'RM650x',
   '{"watts":650,"rating":"Gold","price":99}'),

  ('eeeeeeee-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000005',
   'Corsair RM750x', 'Corsair', 'RM750x',
   '{"watts":750,"rating":"Gold","price":119}'),

  ('eeeeeeee-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000005',
   'Seasonic Focus GX-850', 'Seasonic', 'Focus GX-850',
   '{"watts":850,"rating":"Gold","price":139}'),

  ('eeeeeeee-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000005',
   'be quiet! Dark Power 1000W', 'be quiet!', 'Dark Power 1000W',
   '{"watts":1000,"rating":"Platinum","price":199}'),

  ('eeeeeeee-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000005',
   'EVGA SuperNOVA 750 G6', 'EVGA', 'SuperNOVA 750 G6',
   '{"watts":750,"rating":"Gold","price":109}');

-- ── Cases ─────────────────────────────────────────────────────────────────────
-- specs: form (what mobo sizes fit), price
INSERT INTO parts (id, category_id, name, brand, model, specs) VALUES
  ('ffffffff-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000006',
   'Fractal Design Meshify 2', 'Fractal Design', 'Meshify 2',
   '{"form":"ATX","price":139}'),

  ('ffffffff-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000006',
   'Lian Li PC-O11 Dynamic', 'Lian Li', 'PC-O11 Dynamic',
   '{"form":"ATX","price":149}'),

  ('ffffffff-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000006',
   'NZXT H510', 'NZXT', 'H510',
   '{"form":"ATX","price":89}'),

  ('ffffffff-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000006',
   'Cooler Master MasterBox Q300L', 'Cooler Master', 'MasterBox Q300L',
   '{"form":"mATX","price":59}'),

  ('ffffffff-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000006',
   'Fractal Design Pop Mini', 'Fractal Design', 'Pop Mini',
   '{"form":"mATX","price":79}');

-- ── Compatibility rules ───────────────────────────────────────────────────────
-- rule_type: socket_match, mem_gen_match, psu_wattage, form_factor
INSERT INTO compatibility_rules (part_a_category, part_b_category, rule_type, rule_definition, description) VALUES
  ('11111111-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000002',
   'socket_match',
   '{"check": "parts[a].specs.socket == parts[b].specs.socket"}',
   'CPU socket must match motherboard socket'),

  ('11111111-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000003',
   'mem_gen_match',
   '{"check": "parts[a].specs.mem_gen == parts[b].specs.mem_gen"}',
   'Motherboard memory generation must match RAM generation'),

  ('11111111-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000005',
   'psu_wattage',
   '{"check": "parts[b].specs.watts * 0.8 >= parts[a].specs.tdp + 150"}',
   'PSU must cover GPU TDP plus 150W system overhead at 80% load'),

  ('11111111-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000006',
   'form_factor',
   '{"check": "parts[a].specs.form == parts[b].specs.form or parts[b].specs.form == ''ATX''"}',
   'Motherboard form factor must fit inside case');

-- ── Seed prices into price_history ────────────────────────────────────────────
INSERT INTO price_history (part_id, price, source, source_url)
SELECT id, (specs->>'price')::numeric, 'seed', 'https://example.com'
FROM parts;