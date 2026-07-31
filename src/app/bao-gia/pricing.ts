export const pricing = {
  basePrice: {
    mo_quay: 5000000,
    cua_2_canh: 5200000,
    cua_4_canh: 5500000,
    truot: 4500000,
    truot_3_ray: 5300000,
    xep_truot: 5600000,
    cua_so_truot_ea70: 4000000,
    cua_so_quay_ea55: 4400000,
    cua_so_hat: 4600000,
    vach: 2600000,
    vach_mat_dung_noi_do: 5000000,
    vach_mat_dung_giau_do: 6000000,
  },
  glassExtra: {
    kinh_8: 0,
    hop_5_9_5: 400000,
    dan_11_52: 600000,
    solar_6_9_6: 800000,
    low_e_6_9_6: 1000000,
    dan_13_52: 1200000,
  },
  hardwareExtra: {
    eurowindow: { mo_quay: 0, cua_2_canh: 0, cua_4_canh: 0, truot: 0, truot_3_ray: 0, xep_truot: 0, cua_so_truot_ea70: 0, cua_so_quay_ea55: 0, cua_so_hat: 0, vach: 0, vach_mat_dung_noi_do: 0, vach_mat_dung_giau_do: 0 },
    cmech: { mo_quay: 1000000, cua_2_canh: 1000000, cua_4_canh: 1000000, truot: 1000000, truot_3_ray: 1000000, xep_truot: 1000000, cua_so_truot_ea70: 1000000, cua_so_quay_ea55: 1000000, cua_so_hat: 1000000, vach: 0, vach_mat_dung_noi_do: 0, vach_mat_dung_giau_do: 0 },
    roto: { mo_quay: 1500000, cua_2_canh: 1500000, cua_4_canh: 1500000, truot: 1500000, truot_3_ray: 1500000, xep_truot: 1500000, cua_so_truot_ea70: 1500000, cua_so_quay_ea55: 1500000, cua_so_hat: 1500000, vach: 0, vach_mat_dung_noi_do: 0, vach_mat_dung_giau_do: 0 },
  },
}

export const pricingEA60i = {
  basePrice: {
    mo_quay: 10000000,
    cua_2_canh: 10200000,
    cua_4_canh: 10500000,
    truot: 9500000,
    truot_3_ray: 10100000,
    nhac_truot: 10500000,
    xep_truot: 10600000,
    cua_so_truot_ea70i: 7500000,
    cua_so_quay_ea60i: 8500000,
    cua_so_hat_ea60i: 9200000,
    vach: 6600000,
  },
  glassExtra: {
    kinh_8: 0,
    hop_5_9_5: 400000,
    dan_11_52: 600000,
    solar_6_9_6: 800000,
    low_e_6_9_6: 1000000,
    dan_13_52: 1200000,
  },
}

export const pricingKommerling = {
  basePrice: {
    vach: 3600000,
    cua_so_truot: 4500000,
    cua_so_1_quay: 6000000,
    cua_so_2_quay: 6500000,
    cua_so_hat: 6600000,
    cua_di_truot: 6300000,
    cua_di_1_quay: 7000000,
    cua_di_2_quay: 7500000,
    cua_di_4_quay: 8500000,
    cua_di_xep_truot: 9000000,
  },
  glassExtra: {
    kinh_8: 0,
    kinh_876: 500000,
    hop_5_9_5: 400000,
    solar_6_9_6: 600000,
    low_e_6_9_6: 800000,
    hop_5_9_876: 700000,
  },
}

export const pricingAsia = {
  basePrice: {
    vach: 2200000,
    cua_so_truot: 3500000,
    cua_so_1_quay: 4000000,
    cua_so_2_quay: 4500000,
    cua_di_truot: 3800000,
    cua_di_1_quay: 4200000,
    cua_di_2_quay: 5000000,
  },
  glassExtra: {
    kinh_8: 0,
    kinh_876: 500000,
    hop_5_9_5: 400000,
    solar_6_9_6: 600000,
    low_e_6_9_6: 800000,
    hop_5_9_876: 700000,
  },
}

export const doorTypes = [
  { key: 'mo_quay', label: 'Cửa 1 Cánh Mở Quay', icon: '🚪', desc: 'Cửa 1 cánh mở quay', image: '/images/bao-gia/cua-di-1-canh-mo-quat-ea55.jpg' },
  { key: 'cua_2_canh', label: 'Cửa 2 Cánh', icon: '🚪', desc: 'Cửa 2 cánh mở quay', image: '/images/bao-gia/cua-di_2_canh-ea55.jpg' },
  { key: 'cua_4_canh', label: 'Cửa 4 Cánh', icon: '🪟', desc: 'Cửa 4 cánh lớn', image: '/images/bao-gia/cua_4_canh.jpg' },
  { key: 'truot', label: 'Cửa Trượt 2 Cánh EA95', icon: '↔️', desc: 'Cửa kéo trượt ngang EA95', image: '/images/bao-gia/cua-truot-2-canh-ea95.jpg' },
  { key: 'truot_3_ray', label: 'Cửa Trượt EA95 3 Ray', icon: '↔️', desc: 'Cửa trượt 3 ray EA95', image: '/images/bao-gia/truot_3_ray.png' },
  { key: 'xep_truot', label: 'Cửa Xếp Trượt', icon: '🪗', desc: 'Cửa mở xếp trượt', image: '/images/bao-gia/cua-di-xep-truot.jpg' },
  { key: 'cua_so_truot_ea70', label: 'Cửa Sổ Mở Trượt EA70', icon: '🔲', desc: 'Cửa sổ mở trượt', image: '/images/bao-gia/cua_so_truot_ea70.jpg' },
  { key: 'cua_so_quay_ea55', label: 'Cửa Sổ Mở Quay EA55', icon: '🔲', desc: 'Cửa sổ mở quay', image: '/images/bao-gia/cua_so_quay_ea55.jpg' },
  { key: 'cua_so_hat', label: 'Cửa Sổ Mở Hất', icon: '🔲', desc: 'Cửa sổ mở hất', image: '/images/bao-gia/cua_so_hat.jpg' },
  { key: 'vach', label: 'Vách Thông Thường', icon: '🏢', desc: 'Vách ngăn nhôm kính', image: '/images/bao-gia/vach-kinh-ea55.jpg' },
  { key: 'vach_mat_dung_noi_do', label: 'Vách Dựng Nổi Đố', icon: '🏙️', desc: 'Kính 8mm cường lực', image: '/images/bao-gia/vach_mat_dung_noi_do.jpg' },
  { key: 'vach_mat_dung_giau_do', label: 'Vách Dựng Giấu Đố', icon: '🏙️', desc: 'Kính 8mm cường lực', image: '/images/bao-gia/vach_mat_dung_giau_do.png' },
]

export const doorTypesEA60i = [
  { key: 'mo_quay', label: 'Cửa 1 Cánh Mở Quay', icon: '🚪', desc: 'Cửa 1 cánh mở quay', image: '/images/bao-gia/cua-di-1-canh-mo-quat-ea55.jpg' },
  { key: 'cua_2_canh', label: 'Cửa 2 Cánh', icon: '🚪', desc: 'Cửa 2 cánh mở quay', image: '/images/bao-gia/cua-di_2_canh-ea55.jpg' },
  { key: 'cua_4_canh', label: 'Cửa 4 Cánh', icon: '🪟', desc: 'Cửa 4 cánh lớn', image: '/images/bao-gia/cua_4_canh.jpg' },
  { key: 'truot', label: 'Cửa Trượt EA95i 2 Cánh', icon: '↔️', desc: 'Cửa trượt 2 cánh EA95i', image: '/images/bao-gia/cua-truot-2-canh-ea95.jpg' },
  { key: 'truot_3_ray', label: 'Cửa Trượt EA95i 3 Ray', icon: '↔️', desc: 'Cửa trượt 3 ray EA95i', image: '/images/bao-gia/truot_3_ray.png' },
  { key: 'nhac_truot', label: 'Cửa Nhấc Trượt', icon: '🚪', desc: 'Cửa nhấc trượt cao cấp', image: '/images/bao-gia/cua-di-1-canh-mo-quat-ea55.jpg' },
  { key: 'xep_truot', label: 'Cửa Xếp Trượt', icon: '🪗', desc: 'Cửa mở xếp trượt', image: '/images/bao-gia/cua-di-xep-truot.jpg' },
  { key: 'cua_so_truot_ea70i', label: 'Cửa Sổ Mở Trượt EA70i', icon: '🔲', desc: 'Cửa sổ mở trượt', image: '/images/bao-gia/cua_so_truot_ea70.jpg' },
  { key: 'cua_so_quay_ea60i', label: 'Cửa Sổ Mở Quay EA60i', icon: '🔲', desc: 'Cửa sổ mở quay', image: '/images/bao-gia/cua_so_quay_ea55.jpg' },
  { key: 'cua_so_hat_ea60i', label: 'Cửa Sổ Mở Hất', icon: '🔲', desc: 'Cửa sổ mở hất', image: '/images/bao-gia/cua_so_hat.jpg' },
  { key: 'vach', label: 'Vách Kính', icon: '🏢', desc: 'Vách ngăn nhôm kính', image: '/images/bao-gia/vach-kinh-ea55.jpg' },
]

export const doorTypesKommerling = [
  { key: 'vach', label: 'Vách kính cố định', icon: '🏢', desc: 'Vách kính cố định', image: '/images/bao-gia/upvc/vach.jpg' },
  { key: 'cua_so_truot', label: 'Cửa sổ mở trượt', icon: '↔️', desc: 'Cửa sổ mở trượt', image: '/images/bao-gia/upvc/cua_so_truot.jpg' },
  { key: 'cua_so_1_quay', label: 'Cửa sổ 1 cánh mở quay', icon: '🔲', desc: 'Cửa sổ 1 cánh mở quay', image: '/images/bao-gia/upvc/cua_so_1_quay.jpg' },
  { key: 'cua_so_2_quay', label: 'Cửa sổ 2 cánh mở quay', icon: '🔲', desc: 'Cửa sổ 2 cánh mở quay', image: '/images/bao-gia/upvc/cua_so_2_quay.jpg' },
  { key: 'cua_so_hat', label: 'Cửa sổ mở hất', icon: '🔲', desc: 'Cửa sổ mở hất', image: '/images/bao-gia/upvc/cua-so-hat.jpg' },
  { key: 'cua_di_truot', label: 'Cửa đi mở trượt', icon: '↔️', desc: 'Cửa đi mở trượt', image: '/images/bao-gia/upvc/cua_di_truot.jpg' },
  { key: 'cua_di_1_quay', label: 'Cửa đi 1 cánh mở quay', icon: '🚪', desc: 'Cửa đi 1 cánh mở quay', image: '/images/bao-gia/upvc/cua_di_1_quay.jpg' },
  { key: 'cua_di_2_quay', label: 'Cửa đi 2 cánh mở quay', icon: '🚪', desc: 'Cửa đi 2 cánh mở quay', image: '/images/bao-gia/upvc/cua_di_2_quay.jpg' },
  { key: 'cua_di_4_quay', label: 'Cửa đi 4 cánh mở quay', icon: '🪟', desc: 'Cửa đi 4 cánh mở quay', image: '/images/bao-gia/upvc/cua_di_4_quay.jpg' },
  { key: 'cua_di_xep_truot', label: 'Cửa đi xếp trượt', icon: '🪗', desc: 'Cửa đi xếp trượt', image: '/images/bao-gia/upvc/cua_di_xep_truot.jpg' },
]

export const doorTypesAsia = [
  { key: 'vach', label: 'Vách kính cố định', icon: '🏢', desc: 'Vách kính cố định', image: '/images/bao-gia/upvc/vach.jpg' },
  { key: 'cua_so_truot', label: 'Cửa sổ mở trượt', icon: '↔️', desc: 'Cửa sổ mở trượt', image: '/images/bao-gia/upvc/cua_so_truot.jpg' },
  { key: 'cua_so_1_quay', label: 'Cửa sổ 1 cánh mở quay', icon: '🔲', desc: 'Cửa sổ 1 cánh mở quay', image: '/images/bao-gia/upvc/cua_so_1_quay.jpg' },
  { key: 'cua_so_2_quay', label: 'Cửa sổ 2 cánh mở quay', icon: '🔲', desc: 'Cửa sổ 2 cánh mở quay', image: '/images/bao-gia/upvc/cua_so_2_quay.jpg' },
  { key: 'cua_di_truot', label: 'Cửa đi mở trượt', icon: '↔️', desc: 'Cửa đi mở trượt', image: '/images/bao-gia/upvc/cua_di_truot.jpg' },
  { key: 'cua_di_1_quay', label: 'Cửa đi 1 cánh mở quay', icon: '🚪', desc: 'Cửa đi 1 cánh mở quay', image: '/images/bao-gia/upvc/cua_di_1_quay.jpg' },
  { key: 'cua_di_2_quay', label: 'Cửa đi 2 cánh mở quay', icon: '🚪', desc: 'Cửa đi 2 cánh mở quay', image: '/images/bao-gia/upvc/cua_di_2_quay.jpg' },
]

export const glassTypes = [
  { key: 'kinh_8', label: 'Kính đơn 8mm (CL)', badge: 'Cơ bản' },
  { key: 'hop_5_9_5', label: 'Kính hộp 5+9+5 (CL)', badge: 'Phổ biến' },
  { key: 'dan_11_52', label: 'Kính dán 11.52 (CL)', badge: 'An toàn' },
  { key: 'solar_6_9_6', label: 'Kính solar 6+9+6 (CL)', badge: 'Tiết kiệm điện' },
  { key: 'low_e_6_9_6', label: 'Kính Low E 6+9+6 (CL)', badge: 'Cách nhiệt tốt' },
  { key: 'dan_13_52', label: 'Kính dán solar 13.52 (CL)', badge: 'Cao cấp' },
]

export const glassTypesEA60i = [
  { key: 'hop_5_9_5', label: 'Kính hộp 5+9+5 (CL)', badge: 'Cách nhiệt' },
  { key: 'solar_6_9_6', label: 'Kính solar 6+9+6 (CL)', badge: 'Tiết kiệm điện' },
  { key: 'low_e_6_9_6', label: 'Kính Low E 6+9+6 (CL)', badge: 'Cách nhiệt tốt' },
]

export const glassTypesKommerling = [
  { key: 'kinh_8', label: 'Kính đơn 8mm (CL)', badge: 'Tiêu chuẩn' },
  { key: 'kinh_876', label: 'Kính 8.76mm cường lực', badge: 'An toàn' },
  { key: 'hop_5_9_5', label: 'Kính hộp 5+9+5 (CL)', badge: 'Cách nhiệt' },
  { key: 'solar_6_9_6', label: 'Kính hộp Solar 6+9+6 (CL)', badge: 'Chống nóng' },
  { key: 'low_e_6_9_6', label: 'Kính hộp Low-E 6+9+6 (CL)', badge: 'Cao cấp' },
  { key: 'hop_5_9_876', label: 'Kính hộp 5+9+8.76 (CL)', badge: 'Siêu bền' },
]

export const glassTypesAsia = [
  { key: 'kinh_8', label: 'Kính đơn 8mm (CL)', badge: 'Tiêu chuẩn' },
  { key: 'kinh_876', label: 'Kính 8.76mm cường lực', badge: 'An toàn' },
  { key: 'hop_5_9_5', label: 'Kính hộp 5+9+5 (CL)', badge: 'Cách nhiệt' },
  { key: 'solar_6_9_6', label: 'Kính hộp Solar 6+9+6 (CL)', badge: 'Chống nóng' },
  { key: 'low_e_6_9_6', label: 'Kính hộp Low-E 6+9+6 (CL)', badge: 'Cao cấp' },
  { key: 'hop_5_9_876', label: 'Kính hộp 5+9+8.76 (CL)', badge: 'Siêu bền' },
]

export const glassMatDungTypes = [
  { key: 'kinh_8', label: 'Kính 8mm (CL)', badge: 'Tiêu chuẩn', extra: 0 },
  { key: 'hop_5_9_5', label: 'Kính hộp 5+9+5 (CL)', badge: 'Cách nhiệt', extra: 400000 },
  { key: 'dan_11_52', label: 'Kính dán 11.52 (CL)', badge: 'An toàn', extra: 600000 },
  { key: 'solar_6_9_6', label: 'Kính solar 6+9+6 (CL)', badge: 'Tiết kiệm điện', extra: 800000 },
  { key: 'low_e_6_9_6', label: 'Kính Low E 6+9+6 (CL)', badge: 'Cách nhiệt tốt', extra: 1000000 },
  { key: 'dan_13_52', label: 'Kính dán solar 13.52 (CL)', badge: 'Cao cấp', extra: 1200000 },
]

export const hardwareTypes = [
  { key: 'eurowindow', label: 'EW', desc: 'Phụ kiện tiêu chuẩn' },
  { key: 'cmech', label: 'C-Mech', desc: 'Phụ kiện Đức cao cấp' },
  { key: 'roto', label: 'Roto', desc: 'Phụ kiện Đức premium' },
]

export type DoorKey = keyof typeof pricing.basePrice
export type GlassKey = keyof typeof pricing.glassExtra
export type HardwareKey = keyof typeof pricing.hardwareExtra

export type DoorKeyEA60i = keyof typeof pricingEA60i.basePrice
export type GlassKeyEA60i = keyof typeof pricingEA60i.glassExtra

export type DoorKeyKommerling = keyof typeof pricingKommerling.basePrice
export type GlassKeyKommerling = keyof typeof pricingKommerling.glassExtra

export type DoorKeyAsia = keyof typeof pricingAsia.basePrice
export type GlassKeyAsia = keyof typeof pricingAsia.glassExtra

export interface QuoteItem {
  id: string
  system: 'ea55' | 'ea60i' | 'kommerling' | 'asia'
  code: string
  doorLabel: string
  glassLabel: string
  hardwareLabel: string
  doorKey: DoorKey | DoorKeyEA60i | DoorKeyKommerling | DoorKeyAsia
  glassKey: GlassKey | GlassKeyEA60i | GlassKeyKommerling | GlassKeyAsia
  hardwareKey: HardwareKey
  width: number
  height: number
  qty: number
  area: number
  pricePerM2: number
  unitTotal: number
  total: number
}

export function calcPrice(door: DoorKey, glass: GlassKey, hardware: HardwareKey, w: number, h: number, qty: number) {
  const base = pricing.basePrice[door]
  const glassP = (door === 'vach_mat_dung_noi_do' || door === 'vach_mat_dung_giau_do')
    ? (glassMatDungTypes.find(g => g.key === glass)?.extra ?? 0)
    : pricing.glassExtra[glass]
  const hwP = pricing.hardwareExtra[hardware][door]
  const pricePerM2 = base + glassP + hwP
  const area = w * h
  const adj = area < 1 ? 1 : area
  const unitTotal = pricePerM2 * adj
  return { pricePerM2, area, unitTotal, total: unitTotal * qty }
}

export function calcPriceEA60i(door: DoorKeyEA60i, glass: GlassKeyEA60i, w: number, h: number, qty: number) {
  const base = pricingEA60i.basePrice[door]
  const glassP = pricingEA60i.glassExtra[glass]
  const pricePerM2 = base + glassP
  const area = w * h
  const adj = area < 1 ? 1 : area
  const unitTotal = pricePerM2 * adj
  return { pricePerM2, area, unitTotal, total: unitTotal * qty }
}

export function calcPriceKommerling(door: DoorKeyKommerling, glass: GlassKeyKommerling, w: number, h: number, qty: number) {
  const base = pricingKommerling.basePrice[door]
  const glassP = pricingKommerling.glassExtra[glass]
  const pricePerM2 = base + glassP
  const area = w * h
  const adj = area < 1 ? 1 : area
  const unitTotal = pricePerM2 * adj
  return { pricePerM2, area, unitTotal, total: unitTotal * qty }
}

export function calcPriceAsia(door: DoorKeyAsia, glass: GlassKeyAsia, w: number, h: number, qty: number) {
  const base = pricingAsia.basePrice[door]
  const glassP = pricingAsia.glassExtra[glass]
  const pricePerM2 = base + glassP
  const area = w * h
  const adj = area < 1 ? 1 : area
  const unitTotal = pricePerM2 * adj
  return { pricePerM2, area, unitTotal, total: unitTotal * qty }
}

export function fmt(n: number) {
  if (typeof n !== 'number' || isNaN(n)) return '0 ₫'
  return n.toLocaleString('vi-VN') + ' ₫'
}
