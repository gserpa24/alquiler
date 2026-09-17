-- ==========================================
-- SEED: Datos de ejemplo — 12 vehículos
-- Ejecutar: npx supabase db reset (incluye seed)
-- O manualmente en Supabase Studio > SQL Editor
-- ==========================================

INSERT INTO vehicles (
  slug, brand, model, year, category, transmission, fuel,
  seats, daily_rate, sale_price, mileage, color,
  features, images, thumbnail, description, status, is_featured, sort_order
) VALUES

-- 1. Toyota Hilux 4x4 — Featured
(
  'toyota-hilux-2024-blanco',
  'Toyota', 'Hilux', 2024, 'pickup_4x4', 'automatic', 'diesel',
  5, 85.00, NULL, 8500, 'Blanco Perlado',
  ARRAY['GPS', 'Cámara 360°', 'Control de tracción', 'Climatizador dual', 'Apple CarPlay', 'Asientos de cuero'],
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'],
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'La Toyota Hilux 2024 en su versión más completa. Motor 2.8L TDi de 204 HP, suspensión reforzada y tracción 4x4 selectiva. Lista para la ciudad y el campo.',
  'available', TRUE, 1
),

-- 2. BMW Serie 3 — Featured
(
  'bmw-serie-3-2023-gris',
  'BMW', 'Serie 3', 2023, 'sedan', 'automatic', 'gasoline',
  5, 120.00, NULL, 12000, 'Gris Mineral',
  ARRAY['GPS Premium', 'Pantalla iDrive 8.5"', 'Head-up display', 'Techo solar', 'Harman Kardon', 'Sensores 360°'],
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'Sedán ejecutivo por excelencia. Motor 2.0L TwinPower Turbo de 258 HP. Tecnología BMW ConnectedDrive de última generación.',
  'available', TRUE, 2
),

-- 3. Ford Bronco Sport — SUV
(
  'ford-bronco-sport-2023-azul',
  'Ford', 'Bronco Sport', 2023, 'suv', 'automatic', 'gasoline',
  5, 95.00, NULL, 18000, 'Azul Velociraptor',
  ARRAY['GPS', 'Apple CarPlay', 'Android Auto', 'SYNC 4A', 'Tracción AWD', 'Modos off-road'],
  ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
  'Adventure-ready SUV con capacidades off-road reales. Motor EcoBoost 2.0L con 250 HP y 8 modos de conducción terrain.',
  'available', FALSE, 3
),

-- 4. Mercedes-Benz C 200 — Sedan premium
(
  'mercedes-benz-c200-2022-negro',
  'Mercedes-Benz', 'C 200', 2022, 'sedan', 'automatic', 'hybrid',
  5, 150.00, NULL, 22000, 'Negro Obsidiana',
  ARRAY['MBUX', 'Pantalla 11.9"', 'Burmester Audio', 'Techo panorámico', 'Asistente conducción', 'Carga inalámbrica'],
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
  'Lujo redefinido. El C 200 híbrido combina un motor 1.5L EQ-Boost con 204 HP totales. Interior de cuero Nappa con MBUX de última generación.',
  'available', TRUE, 4
),

-- 5. Toyota RAV4 — SUV (Occupado)
(
  'toyota-rav4-2023-plata',
  'Toyota', 'RAV4', 2023, 'suv', 'automatic', 'hybrid',
  5, 90.00, NULL, 15000, 'Plata Lunar',
  ARRAY['GPS Toyota', 'Safety Sense 2.0', 'Tracción E-AWD', 'Apple CarPlay', 'Cámara trasera'],
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'],
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  'SUV híbrido con tecnología Toyota Safety Sense 2.0. Sistema eléctrico de tracción trasera independiente para máxima eficiencia.',
  'rented', FALSE, 5
),

-- 6. Mitsubishi L200 — Pickup 4x4
(
  'mitsubishi-l200-2024-negro',
  'Mitsubishi', 'L200 Triton', 2024, 'pickup_4x4', 'manual', 'diesel',
  5, 75.00, NULL, 5000, 'Negro Eclipse',
  ARRAY['GPS', 'Control de tracción', 'Frenos ABS', 'Airbags frontales y laterales'],
  ARRAY['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
  'Pickup trabajadora con motor 2.4L MIVEC Turbo Diésel de 181 HP. Tracción 4WD con bloqueo de diferencial trasero electrónico.',
  'available', FALSE, 6
),

-- 7. Audi A4 — Sedan (En venta también)
(
  'audi-a4-2022-blanco',
  'Audi', 'A4', 2022, 'sedan', 'automatic', 'gasoline',
  5, 130.00, 38000.00, 28000, 'Blanco Glaciar',
  ARRAY['Audi Virtual Cockpit', 'Bang & Olufsen', 'Techo solar eléctrico', 'Quattro AWD', 'Matrix LED'],
  ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  'El sedán de referencia en su segmento. Motor 2.0 TFSI de 201 HP con caja S-tronic de 7 velocidades. Disponible para alquiler o compra.',
  'available', FALSE, 7
),

-- 8. Jeep Wrangler — SUV Sport
(
  'jeep-wrangler-2023-rojo',
  'Jeep', 'Wrangler Rubicon', 2023, 'sport', 'automatic', 'gasoline',
  4, 110.00, NULL, 9000, 'Rojo Firecracker',
  ARRAY['Tracción Dana 44', 'Locker delantero y trasero', 'Sway Bar Disconnect', 'GPS', 'Apple CarPlay'],
  ARRAY['https://images.unsplash.com/photo-1563461661023-2da3e3b4b45f?w=800'],
  'https://images.unsplash.com/photo-1563461661023-2da3e3b4b45f?w=800',
  'La leyenda del off-road. Motor Pentastar V6 3.6L de 285 HP. Ejes Dana 44 con blocadores mecánicos delantero y trasero para superar cualquier terreno.',
  'available', TRUE, 8
),

-- 9. Ford Mustang — Sport (En mantenimiento)
(
  'ford-mustang-gt-2023-azul',
  'Ford', 'Mustang GT', 2023, 'sport', 'manual', 'gasoline',
  4, 180.00, NULL, 6000, 'Azul Grabber',
  ARRAY['V8 5.0L Coyote', 'Brembo 6 pistones', 'MagneRide', 'Ford Performance Pack', 'Launch Control'],
  ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'],
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
  'Icono americano con V8 5.0L de 450 HP. Performance Pack con amortiguadores MagneRide y frenos Brembo de 6 pistones. Pura adrenalina.',
  'maintenance', FALSE, 9
),

-- 10. Hyundai Tucson — SUV
(
  'hyundai-tucson-2024-gris',
  'Hyundai', 'Tucson', 2024, 'suv', 'automatic', 'hybrid',
  5, 80.00, NULL, 3000, 'Gris Magnetic',
  ARRAY['Bluelink connected car', 'Pantalla 10.25"', 'Carga inalámbrica', 'Krell Audio', 'HDA', 'FCA'],
  ARRAY['https://images.unsplash.com/photo-1600661653561-629509216228?w=800'],
  'https://images.unsplash.com/photo-1600661653561-629509216228?w=800',
  'SUV híbrido con diseño paramétrico vanguardista. Motor 1.6 T-GDI + motor eléctrico con 230 HP. Cero emisiones en modo eléctrico urbano.',
  'available', FALSE, 10
),

-- 11. Chevrolet Camaro — Sport
(
  'chevrolet-camaro-ss-2022-amarillo',
  'Chevrolet', 'Camaro SS', 2022, 'sport', 'automatic', 'gasoline',
  4, 160.00, 32000.00, 18000, 'Amarillo Rally',
  ARRAY['V8 6.2L LT1', 'Bose 9 parlantes', 'Head-Up Display', 'Magnetic Ride Control', 'Launch Control', 'Modo Track'],
  ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  'Músculo americano con V8 6.2L de 455 HP. Sistema Magnetic Ride Control para el máximo desempeño en circuito. También disponible para compra.',
  'available', FALSE, 11
),

-- 12. Volkswagen Tiguan — SUV
(
  'volkswagen-tiguan-2023-blanco',
  'Volkswagen', 'Tiguan', 2023, 'suv', 'automatic', 'gasoline',
  7, 85.00, NULL, 11000, 'Blanco Plata',
  ARRAY['Discover Pro 9.2"', 'Dynaudio', 'IQ.DRIVE', 'ACC', 'Lane Assist', 'Sensor fatiga', '7 asientos'],
  ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'],
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
  'El SUV familiar por excelencia. Motor 2.0 TSI de 190 HP con DSG de 7 marchas. 7 asientos y maletero de 760L. IQ.Drive con conducción autónoma nivel 2.',
  'available', FALSE, 12
);
