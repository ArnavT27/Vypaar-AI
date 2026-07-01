export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  emoji: string;
};

export const products: Product[] = [
  { id: "p1", name: "Parle-G Biscuit", category: "Snacks", price: 10, stock: 48, minStock: 20, unit: "pkt", emoji: "🍪" },
  { id: "p2", name: "Amul Milk 500ml", category: "Dairy", price: 30, stock: 12, minStock: 25, unit: "pkt", emoji: "🥛" },
  { id: "p3", name: "Coca-Cola 750ml", category: "Beverages", price: 40, stock: 6, minStock: 15, unit: "btl", emoji: "🥤" },
  { id: "p4", name: "Lays Classic", category: "Snacks", price: 20, stock: 75, minStock: 30, unit: "pkt", emoji: "🥔" },
  { id: "p5", name: "Maggi 70g", category: "Grocery", price: 14, stock: 0, minStock: 20, unit: "pkt", emoji: "🍜" },
  { id: "p6", name: "Surf Excel 1kg", category: "Household", price: 165, stock: 22, minStock: 10, unit: "pkt", emoji: "🧺" },
  { id: "p7", name: "Colgate 100g", category: "Personal Care", price: 55, stock: 34, minStock: 15, unit: "pcs", emoji: "🪥" },
  { id: "p8", name: "Tata Salt 1kg", category: "Grocery", price: 28, stock: 9, minStock: 20, unit: "pkt", emoji: "🧂" },
  { id: "p9", name: "Britannia Bread", category: "Bakery", price: 45, stock: 18, minStock: 15, unit: "pkt", emoji: "🍞" },
  { id: "p10", name: "Dairy Milk 50g", category: "Snacks", price: 50, stock: 60, minStock: 25, unit: "pcs", emoji: "🍫" },
  { id: "p11", name: "Bingo Mad Angles", category: "Snacks", price: 20, stock: 40, minStock: 20, unit: "pkt", emoji: "🌶️" },
  { id: "p12", name: "Bisleri 1L", category: "Beverages", price: 20, stock: 88, minStock: 30, unit: "btl", emoji: "💧" },
  { id: "p13", name: "Kurkure Masala", category: "Snacks", price: 20, stock: 52, minStock: 25, unit: "pkt", emoji: "🌽" },
  { id: "p14", name: "Haldiram Bhujia", category: "Snacks", price: 60, stock: 28, minStock: 15, unit: "pkt", emoji: "🥜" },
  { id: "p15", name: "Good Day Cookies", category: "Snacks", price: 30, stock: 36, minStock: 20, unit: "pkt", emoji: "🍪" },
  { id: "p16", name: "Oreo Biscuits", category: "Snacks", price: 30, stock: 44, minStock: 20, unit: "pkt", emoji: "🍫" },
  { id: "p17", name: "Marie Gold", category: "Snacks", price: 25, stock: 30, minStock: 15, unit: "pkt", emoji: "🍪" },
  { id: "p18", name: "Amul Butter 100g", category: "Dairy", price: 56, stock: 18, minStock: 12, unit: "pkt", emoji: "🧈" },
  { id: "p19", name: "Amul Cheese Slice", category: "Dairy", price: 125, stock: 14, minStock: 10, unit: "pkt", emoji: "🧀" },
  { id: "p20", name: "Mother Dairy Curd 400g", category: "Dairy", price: 45, stock: 22, minStock: 15, unit: "pkt", emoji: "🥛" },
  { id: "p21", name: "Amul Lassi 200ml", category: "Dairy", price: 25, stock: 30, minStock: 20, unit: "btl", emoji: "🥤" },
  { id: "p22", name: "Pepsi 750ml", category: "Beverages", price: 40, stock: 24, minStock: 15, unit: "btl", emoji: "🥤" },
  { id: "p23", name: "Sprite 750ml", category: "Beverages", price: 40, stock: 26, minStock: 15, unit: "btl", emoji: "🥤" },
  { id: "p24", name: "Frooti 250ml", category: "Beverages", price: 20, stock: 50, minStock: 25, unit: "btl", emoji: "🥭" },
  { id: "p25", name: "Real Mixed Fruit 1L", category: "Beverages", price: 110, stock: 12, minStock: 8, unit: "btl", emoji: "🧃" },
  { id: "p26", name: "Red Bull 250ml", category: "Beverages", price: 125, stock: 18, minStock: 10, unit: "btl", emoji: "⚡" },
  { id: "p27", name: "Tata Tea Gold 500g", category: "Grocery", price: 280, stock: 16, minStock: 10, unit: "pkt", emoji: "🍵" },
  { id: "p28", name: "Bru Coffee 100g", category: "Grocery", price: 195, stock: 14, minStock: 8, unit: "btl", emoji: "☕" },
  { id: "p29", name: "Aashirvaad Atta 5kg", category: "Grocery", price: 285, stock: 20, minStock: 12, unit: "pkt", emoji: "🌾" },
  { id: "p30", name: "Fortune Sunflower Oil 1L", category: "Grocery", price: 165, stock: 18, minStock: 10, unit: "btl", emoji: "🛢️" },
  { id: "p31", name: "Daawat Basmati 1kg", category: "Grocery", price: 130, stock: 24, minStock: 12, unit: "pkt", emoji: "🍚" },
  { id: "p32", name: "Tata Sampann Dal 1kg", category: "Grocery", price: 145, stock: 22, minStock: 12, unit: "pkt", emoji: "🫘" },
  { id: "p33", name: "MDH Garam Masala", category: "Grocery", price: 85, stock: 30, minStock: 15, unit: "pkt", emoji: "🌶️" },
  { id: "p34", name: "Catch Black Pepper", category: "Grocery", price: 95, stock: 18, minStock: 10, unit: "pkt", emoji: "⚫" },
  { id: "p35", name: "Madhur Sugar 1kg", category: "Grocery", price: 48, stock: 26, minStock: 15, unit: "pkt", emoji: "🍬" },
  { id: "p36", name: "Saffola Honey 250g", category: "Grocery", price: 180, stock: 12, minStock: 8, unit: "btl", emoji: "🍯" },
  { id: "p37", name: "Kissan Mixed Fruit Jam", category: "Grocery", price: 130, stock: 16, minStock: 10, unit: "btl", emoji: "🍓" },
  { id: "p38", name: "Maggi Ketchup 1kg", category: "Grocery", price: 145, stock: 14, minStock: 8, unit: "btl", emoji: "🍅" },
  { id: "p39", name: "Vim Bar 200g", category: "Household", price: 20, stock: 60, minStock: 25, unit: "pcs", emoji: "🧼" },
  { id: "p40", name: "Harpic 500ml", category: "Household", price: 95, stock: 22, minStock: 12, unit: "btl", emoji: "🚽" },
  { id: "p41", name: "Lizol 500ml", category: "Household", price: 110, stock: 18, minStock: 10, unit: "btl", emoji: "🧴" },
  { id: "p42", name: "Good Knight Refill", category: "Household", price: 75, stock: 26, minStock: 15, unit: "pcs", emoji: "🦟" },
  { id: "p43", name: "Tide 1kg", category: "Household", price: 155, stock: 20, minStock: 10, unit: "pkt", emoji: "🧺" },
  { id: "p44", name: "Lifebuoy Soap", category: "Personal Care", price: 30, stock: 70, minStock: 30, unit: "pcs", emoji: "🧼" },
  { id: "p45", name: "Dove Soap 100g", category: "Personal Care", price: 65, stock: 38, minStock: 20, unit: "pcs", emoji: "🛁" },
  { id: "p46", name: "Head & Shoulders 180ml", category: "Personal Care", price: 195, stock: 16, minStock: 10, unit: "btl", emoji: "💆" },
  { id: "p47", name: "Clinic Plus 175ml", category: "Personal Care", price: 110, stock: 22, minStock: 12, unit: "btl", emoji: "🧴" },
  { id: "p48", name: "Pepsodent 150g", category: "Personal Care", price: 65, stock: 28, minStock: 15, unit: "pcs", emoji: "🪥" },
  { id: "p49", name: "Gillette Razor", category: "Personal Care", price: 145, stock: 14, minStock: 8, unit: "pcs", emoji: "🪒" },
  { id: "p50", name: "Nivea Cream 100ml", category: "Personal Care", price: 175, stock: 16, minStock: 10, unit: "btl", emoji: "🧴" },
  { id: "p51", name: "Whisper Pads 15s", category: "Personal Care", price: 95, stock: 24, minStock: 12, unit: "pkt", emoji: "🌸" },
  { id: "p52", name: "Pampers Diapers", category: "Personal Care", price: 299, stock: 12, minStock: 8, unit: "pkt", emoji: "👶" },
  { id: "p53", name: "Britannia Cake", category: "Bakery", price: 30, stock: 28, minStock: 15, unit: "pcs", emoji: "🧁" },
  { id: "p54", name: "Modern Brown Bread", category: "Bakery", price: 50, stock: 14, minStock: 10, unit: "pkt", emoji: "🍞" },
  { id: "p55", name: "Veeba Mayo 250g", category: "Grocery", price: 110, stock: 18, minStock: 10, unit: "btl", emoji: "🥪" },

  // ===== Electronics =====
  { id: "p56", name: "boAt Rockerz 450 Headphones", category: "Electronics", price: 1499, stock: 8, minStock: 5, unit: "pcs", emoji: "🎧" },
  { id: "p57", name: "Mi Power Bank 10000mAh", category: "Electronics", price: 999, stock: 14, minStock: 6, unit: "pcs", emoji: "🔋" },
  { id: "p58", name: "Realme Buds Wireless", category: "Electronics", price: 1799, stock: 6, minStock: 5, unit: "pcs", emoji: "🎧" },
  { id: "p59", name: "USB-C Cable 1m", category: "Electronics", price: 199, stock: 40, minStock: 20, unit: "pcs", emoji: "🔌" },
  { id: "p60", name: "Mobile Charger 20W", category: "Electronics", price: 599, stock: 18, minStock: 10, unit: "pcs", emoji: "⚡" },
  { id: "p61", name: "LED Bulb 9W Philips", category: "Electronics", price: 120, stock: 36, minStock: 20, unit: "pcs", emoji: "💡" },
  { id: "p62", name: "Extension Board 4-Plug", category: "Electronics", price: 449, stock: 10, minStock: 6, unit: "pcs", emoji: "🔌" },
  { id: "p63", name: "Duracell AA Battery 4pk", category: "Electronics", price: 180, stock: 28, minStock: 15, unit: "pkt", emoji: "🔋" },
  { id: "p64", name: "Bluetooth Speaker Mini", category: "Electronics", price: 899, stock: 9, minStock: 5, unit: "pcs", emoji: "🔊" },
  { id: "p65", name: "Smart Watch Fire-Boltt", category: "Electronics", price: 1599, stock: 5, minStock: 4, unit: "pcs", emoji: "⌚" },
  { id: "p66", name: "Earphones Wired boAt", category: "Electronics", price: 399, stock: 24, minStock: 12, unit: "pcs", emoji: "🎧" },
  { id: "p67", name: "Memory Card 32GB", category: "Electronics", price: 349, stock: 16, minStock: 8, unit: "pcs", emoji: "💾" },

  // ===== Clothing =====
  { id: "p68", name: "Men's Cotton T-Shirt", category: "Clothing", price: 349, stock: 22, minStock: 12, unit: "pcs", emoji: "👕" },
  { id: "p69", name: "Women's Kurti", category: "Clothing", price: 599, stock: 14, minStock: 8, unit: "pcs", emoji: "👗" },
  { id: "p70", name: "Kids Shorts", category: "Clothing", price: 249, stock: 18, minStock: 10, unit: "pcs", emoji: "🩳" },
  { id: "p71", name: "Men's Jeans", category: "Clothing", price: 899, stock: 10, minStock: 6, unit: "pcs", emoji: "👖" },
  { id: "p72", name: "Cotton Socks 3-pair", category: "Clothing", price: 199, stock: 30, minStock: 15, unit: "pkt", emoji: "🧦" },
  { id: "p73", name: "Bath Towel", category: "Clothing", price: 299, stock: 16, minStock: 8, unit: "pcs", emoji: "🛁" },
  { id: "p74", name: "Bedsheet Double", category: "Clothing", price: 749, stock: 8, minStock: 5, unit: "pcs", emoji: "🛏️" },
  { id: "p75", name: "School Uniform Shirt", category: "Clothing", price: 399, stock: 20, minStock: 10, unit: "pcs", emoji: "👔" },
  { id: "p76", name: "Saree Cotton Print", category: "Clothing", price: 1299, stock: 6, minStock: 4, unit: "pcs", emoji: "🥻" },
  { id: "p77", name: "Winter Cap Wool", category: "Clothing", price: 199, stock: 24, minStock: 12, unit: "pcs", emoji: "🧢" },
  { id: "p78", name: "Inner Vest Pack of 3", category: "Clothing", price: 299, stock: 18, minStock: 10, unit: "pkt", emoji: "👕" },
  { id: "p79", name: "Handkerchief Set", category: "Clothing", price: 99, stock: 40, minStock: 20, unit: "pkt", emoji: "🧻" },

  // ===== Toys =====
  { id: "p80", name: "Hot Wheels Car", category: "Toys", price: 149, stock: 28, minStock: 12, unit: "pcs", emoji: "🚗" },
  { id: "p81", name: "Lego Building Blocks", category: "Toys", price: 599, stock: 10, minStock: 6, unit: "pkt", emoji: "🧱" },
  { id: "p82", name: "Barbie Doll", category: "Toys", price: 799, stock: 8, minStock: 5, unit: "pcs", emoji: "👸" },
  { id: "p83", name: "Teddy Bear Medium", category: "Toys", price: 449, stock: 12, minStock: 6, unit: "pcs", emoji: "🧸" },
  { id: "p84", name: "Cricket Bat Plastic", category: "Toys", price: 249, stock: 16, minStock: 8, unit: "pcs", emoji: "🏏" },
  { id: "p85", name: "Football Size 5", category: "Toys", price: 399, stock: 10, minStock: 6, unit: "pcs", emoji: "⚽" },
  { id: "p86", name: "Carrom Board Mini", category: "Toys", price: 899, stock: 6, minStock: 4, unit: "pcs", emoji: "🎯" },
  { id: "p87", name: "Ludo Board Game", category: "Toys", price: 199, stock: 18, minStock: 10, unit: "pcs", emoji: "🎲" },
  { id: "p88", name: "Puzzle 100 Pieces", category: "Toys", price: 299, stock: 14, minStock: 8, unit: "pcs", emoji: "🧩" },
  { id: "p89", name: "Remote Control Car", category: "Toys", price: 1299, stock: 5, minStock: 3, unit: "pcs", emoji: "🚙" },
  { id: "p90", name: "Coloring Book Set", category: "Toys", price: 149, stock: 32, minStock: 15, unit: "pcs", emoji: "🎨" },
  { id: "p91", name: "Stuffed Unicorn", category: "Toys", price: 499, stock: 9, minStock: 5, unit: "pcs", emoji: "🦄" },
  { id: "p92", name: "Yo-Yo Pro", category: "Toys", price: 99, stock: 24, minStock: 12, unit: "pcs", emoji: "🪀" },
  { id: "p93", name: "Skipping Rope", category: "Toys", price: 149, stock: 20, minStock: 10, unit: "pcs", emoji: "🪢" },
  { id: "p94", name: "Magic Slate", category: "Toys", price: 179, stock: 22, minStock: 10, unit: "pcs", emoji: "📝" },

  // ===== Stationery / Misc =====
  { id: "p95", name: "Classmate Notebook", category: "Stationery", price: 60, stock: 50, minStock: 25, unit: "pcs", emoji: "📓" },
  { id: "p96", name: "Reynolds Pen 5pk", category: "Stationery", price: 50, stock: 40, minStock: 20, unit: "pkt", emoji: "🖊️" },
  { id: "p97", name: "Camlin Pencil Box", category: "Stationery", price: 199, stock: 18, minStock: 10, unit: "pcs", emoji: "✏️" },
  { id: "p98", name: "Geometry Box", category: "Stationery", price: 149, stock: 16, minStock: 8, unit: "pcs", emoji: "📐" },
  { id: "p99", name: "A4 Paper Ream", category: "Stationery", price: 320, stock: 12, minStock: 6, unit: "pkt", emoji: "📄" },
  { id: "p100", name: "Sticky Notes", category: "Stationery", price: 80, stock: 30, minStock: 15, unit: "pkt", emoji: "🗒️" },
  { id: "p101", name: "Glue Stick Fevistik", category: "Stationery", price: 35, stock: 44, minStock: 20, unit: "pcs", emoji: "🩹" },
  { id: "p102", name: "Stapler with Pins", category: "Stationery", price: 199, stock: 14, minStock: 8, unit: "pcs", emoji: "📎" },
];

// ===== Bills store (in-memory) =====
export type BillItem = { productId: string; name: string; emoji: string; price: number; qty: number };
export type Bill = {
  id: string;
  date: string; // ISO
  items: BillItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
};

const initialBills: Bill[] = [
  {
    id: "BILL-2024-0001",
    date: "2024-11-23T12:00:00.000Z",
    items: [
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 3 },
      { productId: "p7", name: "Colgate 100g", emoji: "🪥", price: 55, qty: 3 },
      { productId: "p50", name: "Nivea Cream 100ml", emoji: "🧴", price: 175, qty: 1 },
    ],
    subtotal: 490, gst: 25, discount: 0, total: 515,
  },
  {
    id: "BILL-2024-0002",
    date: "2024-01-16T12:00:00.000Z",
    items: [
      { productId: "p2", name: "Amul Milk 500ml", emoji: "🥛", price: 30, qty: 1 },
      { productId: "p13", name: "Kurkure Masala", emoji: "🌽", price: 20, qty: 1 },
      { productId: "p41", name: "Lizol 500ml", emoji: "🧴", price: 110, qty: 1 },
      { productId: "p34", name: "Catch Black Pepper", emoji: "⚫", price: 95, qty: 2 },
      { productId: "p14", name: "Haldiram Bhujia", emoji: "🥜", price: 60, qty: 1 },
      { productId: "p36", name: "Saffola Honey 250g", emoji: "🍯", price: 180, qty: 1 },
    ],
    subtotal: 590, gst: 30, discount: 0, total: 620,
  },
  {
    id: "BILL-2024-0003",
    date: "2024-06-21T12:00:00.000Z",
    items: [
      { productId: "p65", name: "Smart Watch Fire-Boltt", emoji: "⌚", price: 1599, qty: 1 },
      { productId: "p37", name: "Kissan Mixed Fruit Jam", emoji: "🍓", price: 130, qty: 1 },
      { productId: "p55", name: "Veeba Mayo 250g", emoji: "🥪", price: 110, qty: 1 },
      { productId: "p49", name: "Gillette Razor", emoji: "🪒", price: 145, qty: 1 },
    ],
    subtotal: 1984, gst: 99, discount: 0, total: 2083,
  },
  {
    id: "BILL-2024-0004",
    date: "2024-10-09T12:00:00.000Z",
    items: [
      { productId: "p46", name: "Head & Shoulders 180ml", emoji: "💆", price: 195, qty: 1 },
      { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", price: 40, qty: 1 },
      { productId: "p15", name: "Good Day Cookies", emoji: "🍪", price: 30, qty: 1 },
    ],
    subtotal: 265, gst: 13, discount: 0, total: 278,
  },
  {
    id: "BILL-2024-0005",
    date: "2024-02-21T12:00:00.000Z",
    items: [
      { productId: "p23", name: "Sprite 750ml", emoji: "🥤", price: 40, qty: 3 },
      { productId: "p14", name: "Haldiram Bhujia", emoji: "🥜", price: 60, qty: 1 },
      { productId: "p17", name: "Marie Gold", emoji: "🍪", price: 25, qty: 3 },
    ],
    subtotal: 255, gst: 13, discount: 0, total: 268,
  },
  {
    id: "BILL-2024-0006",
    date: "2024-09-30T12:00:00.000Z",
    items: [
      { productId: "p17", name: "Marie Gold", emoji: "🍪", price: 25, qty: 1 },
      { productId: "p88", name: "Puzzle 100 Pieces", emoji: "🧩", price: 299, qty: 1 },
      { productId: "p45", name: "Dove Soap 100g", emoji: "🛁", price: 65, qty: 1 },
      { productId: "p14", name: "Haldiram Bhujia", emoji: "🥜", price: 60, qty: 2 },
      { productId: "p21", name: "Amul Lassi 200ml", emoji: "🥤", price: 25, qty: 2 },
    ],
    subtotal: 559, gst: 28, discount: 0, total: 587,
  },
  {
    id: "BILL-2024-0007",
    date: "2024-04-18T12:00:00.000Z",
    items: [
      { productId: "p76", name: "Saree Cotton Print", emoji: "🥻", price: 1299, qty: 1 },
      { productId: "p40", name: "Harpic 500ml", emoji: "🚽", price: 95, qty: 2 },
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 3 },
      { productId: "p50", name: "Nivea Cream 100ml", emoji: "🧴", price: 175, qty: 1 },
    ],
    subtotal: 1814, gst: 91, discount: 0, total: 1905,
  },
  {
    id: "BILL-2024-0008",
    date: "2024-07-23T12:00:00.000Z",
    items: [
      { productId: "p6", name: "Surf Excel 1kg", emoji: "🧺", price: 165, qty: 1 },
      { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", price: 40, qty: 3 },
      { productId: "p8", name: "Tata Salt 1kg", emoji: "🧂", price: 28, qty: 2 },
      { productId: "p39", name: "Vim Bar 200g", emoji: "🧼", price: 20, qty: 3 },
      { productId: "p54", name: "Modern Brown Bread", emoji: "🍞", price: 50, qty: 3 },
    ],
    subtotal: 551, gst: 28, discount: 0, total: 579,
  },
  {
    id: "BILL-2024-0009",
    date: "2024-10-10T12:00:00.000Z",
    items: [
      { productId: "p19", name: "Amul Cheese Slice", emoji: "🧀", price: 125, qty: 1 },
      { productId: "p11", name: "Bingo Mad Angles", emoji: "🌶️", price: 20, qty: 3 },
    ],
    subtotal: 185, gst: 9, discount: 0, total: 194,
  },
  {
    id: "BILL-2024-0010",
    date: "2024-05-14T12:00:00.000Z",
    items: [
      { productId: "p40", name: "Harpic 500ml", emoji: "🚽", price: 95, qty: 2 },
      { productId: "p37", name: "Kissan Mixed Fruit Jam", emoji: "🍓", price: 130, qty: 1 },
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 1 },
      { productId: "p52", name: "Pampers Diapers", emoji: "👶", price: 299, qty: 1 },
      { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", price: 85, qty: 2 },
      { productId: "p53", name: "Britannia Cake", emoji: "🧁", price: 30, qty: 1 },
      { productId: "p1", name: "Parle-G Biscuit", emoji: "🍪", price: 10, qty: 3 },
    ],
    subtotal: 899, gst: 45, discount: 0, total: 944,
  },
  {
    id: "BILL-2024-0011",
    date: "2024-07-25T12:00:00.000Z",
    items: [
      { productId: "p8", name: "Tata Salt 1kg", emoji: "🧂", price: 28, qty: 3 },
      { productId: "p5", name: "Maggi 70g", emoji: "🍜", price: 14, qty: 4 },
      { productId: "p42", name: "Good Knight Refill", emoji: "🦟", price: 75, qty: 2 },
      { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", price: 85, qty: 4 },
      { productId: "p41", name: "Lizol 500ml", emoji: "🧴", price: 110, qty: 1 },
      { productId: "p37", name: "Kissan Mixed Fruit Jam", emoji: "🍓", price: 130, qty: 2 },
    ],
    subtotal: 1000, gst: 50, discount: 0, total: 1050,
  },
  {
    id: "BILL-2024-0012",
    date: "2024-09-27T12:00:00.000Z",
    items: [
      { productId: "p21", name: "Amul Lassi 200ml", emoji: "🥤", price: 25, qty: 2 },
      { productId: "p1", name: "Parle-G Biscuit", emoji: "🍪", price: 10, qty: 2 },
      { productId: "p18", name: "Amul Butter 100g", emoji: "🧈", price: 56, qty: 4 },
      { productId: "p100", name: "Sticky Notes", emoji: "🗒️", price: 80, qty: 2 },
      { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", price: 85, qty: 2 },
    ],
    subtotal: 624, gst: 31, discount: 0, total: 655,
  },
  {
    id: "BILL-2024-0013",
    date: "2024-02-26T12:00:00.000Z",
    items: [
      { productId: "p90", name: "Coloring Book Set", emoji: "🎨", price: 149, qty: 1 },
      { productId: "p42", name: "Good Knight Refill", emoji: "🦟", price: 75, qty: 2 },
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 3 },
    ],
    subtotal: 449, gst: 22, discount: 0, total: 471,
  },
  {
    id: "BILL-2024-0014",
    date: "2024-07-25T12:00:00.000Z",
    items: [
      { productId: "p54", name: "Modern Brown Bread", emoji: "🍞", price: 50, qty: 4 },
      { productId: "p53", name: "Britannia Cake", emoji: "🧁", price: 30, qty: 2 },
      { productId: "p60", name: "Mobile Charger 20W", emoji: "⚡", price: 599, qty: 1 },
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 4 },
    ],
    subtotal: 1059, gst: 53, discount: 0, total: 1112,
  },
  {
    id: "BILL-2024-0015",
    date: "2024-04-29T12:00:00.000Z",
    items: [
      { productId: "p6", name: "Surf Excel 1kg", emoji: "🧺", price: 165, qty: 2 },
      { productId: "p24", name: "Frooti 250ml", emoji: "🥭", price: 20, qty: 3 },
      { productId: "p41", name: "Lizol 500ml", emoji: "🧴", price: 110, qty: 1 },
      { productId: "p5", name: "Maggi 70g", emoji: "🍜", price: 14, qty: 3 },
      { productId: "p18", name: "Amul Butter 100g", emoji: "🧈", price: 56, qty: 1 },
      { productId: "p32", name: "Tata Sampann Dal 1kg", emoji: "🫘", price: 145, qty: 2 },
      { productId: "p54", name: "Modern Brown Bread", emoji: "🍞", price: 50, qty: 1 },
      { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", price: 85, qty: 3 },
      { productId: "p30", name: "Fortune Sunflower Oil 1L", emoji: "🛢️", price: 165, qty: 2 },
      { productId: "p7", name: "Colgate 100g", emoji: "🪥", price: 55, qty: 4 },
      { productId: "p66", name: "Earphones Wired boAt", emoji: "🎧", price: 399, qty: 1 },
      { productId: "p79", name: "Handkerchief Set", emoji: "🧻", price: 99, qty: 4 },
      { productId: "p48", name: "Pepsodent 150g", emoji: "🪥", price: 65, qty: 4 },
    ],
    subtotal: 2798, gst: 140, discount: 0, total: 2938,
  },
  {
    id: "BILL-2024-0016",
    date: "2024-11-08T12:00:00.000Z",
    items: [
      { productId: "p99", name: "A4 Paper Ream", emoji: "📄", price: 320, qty: 2 },
      { productId: "p45", name: "Dove Soap 100g", emoji: "🛁", price: 65, qty: 1 },
      { productId: "p34", name: "Catch Black Pepper", emoji: "⚫", price: 95, qty: 2 },
      { productId: "p31", name: "Daawat Basmati 1kg", emoji: "🍚", price: 130, qty: 2 },
      { productId: "p68", name: "Men's Cotton T-Shirt", emoji: "👕", price: 349, qty: 1 },
      { productId: "p29", name: "Aashirvaad Atta 5kg", emoji: "🌾", price: 285, qty: 2 },
      { productId: "p47", name: "Clinic Plus 175ml", emoji: "🧴", price: 110, qty: 2 },
      { productId: "p92", name: "Yo-Yo Pro", emoji: "🪀", price: 99, qty: 4 },
      { productId: "p17", name: "Marie Gold", emoji: "🍪", price: 25, qty: 3 },
      { productId: "p15", name: "Good Day Cookies", emoji: "🍪", price: 30, qty: 1 },
      { productId: "p44", name: "Lifebuoy Soap", emoji: "🧼", price: 30, qty: 3 },
      { productId: "p49", name: "Gillette Razor", emoji: "🪒", price: 145, qty: 1 },
      { productId: "p61", name: "LED Bulb 9W Philips", emoji: "💡", price: 120, qty: 2 },
      { productId: "p19", name: "Amul Cheese Slice", emoji: "🧀", price: 125, qty: 2 },
    ],
    subtotal: 3520, gst: 176, discount: 0, total: 3696,
  },
  {
    id: "BILL-2024-0017",
    date: "2024-11-16T12:00:00.000Z",
    items: [
      { productId: "p101", name: "Glue Stick Fevistik", emoji: "🩹", price: 35, qty: 2 },
    ],
    subtotal: 70, gst: 4, discount: 0, total: 74,
  },
  {
    id: "BILL-2024-0018",
    date: "2024-12-21T12:00:00.000Z",
    items: [
      { productId: "p34", name: "Catch Black Pepper", emoji: "⚫", price: 95, qty: 4 },
      { productId: "p59", name: "USB-C Cable 1m", emoji: "🔌", price: 199, qty: 1 },
    ],
    subtotal: 579, gst: 29, discount: 0, total: 608,
  },
  {
    id: "BILL-2024-0019",
    date: "2024-09-29T12:00:00.000Z",
    items: [
      { productId: "p78", name: "Inner Vest Pack of 3", emoji: "👕", price: 299, qty: 1 },
      { productId: "p12", name: "Bisleri 1L", emoji: "💧", price: 20, qty: 1 },
      { productId: "p74", name: "Bedsheet Double", emoji: "🛏️", price: 749, qty: 1 },
      { productId: "p1", name: "Parle-G Biscuit", emoji: "🍪", price: 10, qty: 1 },
    ],
    subtotal: 1078, gst: 54, discount: 0, total: 1132,
  },
  {
    id: "BILL-2024-0020",
    date: "2024-09-18T12:00:00.000Z",
    items: [
      { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", price: 50, qty: 2 },
      { productId: "p77", name: "Winter Cap Wool", emoji: "🧢", price: 199, qty: 2 },
      { productId: "p38", name: "Maggi Ketchup 1kg", emoji: "🍅", price: 145, qty: 1 },
      { productId: "p31", name: "Daawat Basmati 1kg", emoji: "🍚", price: 130, qty: 1 },
      { productId: "p69", name: "Women's Kurti", emoji: "👗", price: 599, qty: 1 },
    ],
    subtotal: 1372, gst: 69, discount: 0, total: 1441,
  },
  {
    id: "BILL-2024-0021",
    date: "2024-03-11T12:00:00.000Z",
    items: [
      { productId: "p16", name: "Oreo Biscuits", emoji: "🍫", price: 30, qty: 2 },
      { productId: "p97", name: "Camlin Pencil Box", emoji: "✏️", price: 199, qty: 1 },
      { productId: "p91", name: "Stuffed Unicorn", emoji: "🦄", price: 499, qty: 2 },
      { productId: "p87", name: "Ludo Board Game", emoji: "🎲", price: 199, qty: 1 },
      { productId: "p93", name: "Skipping Rope", emoji: "🪢", price: 149, qty: 2 },
      { productId: "p86", name: "Carrom Board Mini", emoji: "🎯", price: 899, qty: 1 },
    ],
    subtotal: 2653, gst: 133, discount: 0, total: 2786,
  },
  {
    id: "BILL-2024-0022",
    date: "2024-02-19T12:00:00.000Z",
    items: [
      { productId: "p97", name: "Camlin Pencil Box", emoji: "✏️", price: 199, qty: 1 },
      { productId: "p15", name: "Good Day Cookies", emoji: "🍪", price: 30, qty: 2 },
      { productId: "p98", name: "Geometry Box", emoji: "📐", price: 149, qty: 1 },
    ],
    subtotal: 408, gst: 20, discount: 0, total: 428,
  },
  {
    id: "BILL-2024-0023",
    date: "2024-10-11T12:00:00.000Z",
    items: [
      { productId: "p82", name: "Barbie Doll", emoji: "👸", price: 799, qty: 1 },
      { productId: "p5", name: "Maggi 70g", emoji: "🍜", price: 14, qty: 1 },
      { productId: "p17", name: "Marie Gold", emoji: "🍪", price: 25, qty: 3 },
      { productId: "p70", name: "Kids Shorts", emoji: "🩳", price: 249, qty: 2 },
      { productId: "p87", name: "Ludo Board Game", emoji: "🎲", price: 199, qty: 1 },
      { productId: "p68", name: "Men's Cotton T-Shirt", emoji: "👕", price: 349, qty: 2 },
      { productId: "p83", name: "Teddy Bear Medium", emoji: "🧸", price: 449, qty: 1 },
    ],
    subtotal: 2732, gst: 137, discount: 0, total: 2869,
  },
  {
    id: "BILL-2024-0024",
    date: "2024-11-27T12:00:00.000Z",
    items: [
      { productId: "p58", name: "Realme Buds Wireless", emoji: "🎧", price: 1799, qty: 1 },
      { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", price: 40, qty: 2 },
      { productId: "p21", name: "Amul Lassi 200ml", emoji: "🥤", price: 25, qty: 1 },
      { productId: "p92", name: "Yo-Yo Pro", emoji: "🪀", price: 99, qty: 4 },
    ],
    subtotal: 2300, gst: 115, discount: 0, total: 2415,
  },
  {
    id: "BILL-2024-0025",
    date: "2024-02-07T12:00:00.000Z",
    items: [
      { productId: "p9", name: "Britannia Bread", emoji: "🍞", price: 45, qty: 2 },
      { productId: "p81", name: "Lego Building Blocks", emoji: "🧱", price: 599, qty: 1 },
      { productId: "p7", name: "Colgate 100g", emoji: "🪥", price: 55, qty: 3 },
      { productId: "p40", name: "Harpic 500ml", emoji: "🚽", price: 95, qty: 1 },
      { productId: "p28", name: "Bru Coffee 100g", emoji: "☕", price: 195, qty: 1 },
      { productId: "p43", name: "Tide 1kg", emoji: "🧺", price: 155, qty: 1 },
      { productId: "p27", name: "Tata Tea Gold 500g", emoji: "🍵", price: 280, qty: 2 },
    ],
    subtotal: 1859, gst: 93, discount: 0, total: 1952,
  },
  {
    id: "BILL-2024-0026",
    date: "2024-09-25T12:00:00.000Z",
    items: [
      { productId: "p51", name: "Whisper Pads 15s", emoji: "🌸", price: 95, qty: 3 },
      { productId: "p32", name: "Tata Sampann Dal 1kg", emoji: "🫘", price: 145, qty: 2 },
      { productId: "p24", name: "Frooti 250ml", emoji: "🥭", price: 20, qty: 3 },
      { productId: "p54", name: "Modern Brown Bread", emoji: "🍞", price: 50, qty: 2 },
      { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", price: 40, qty: 4 },
      { productId: "p5", name: "Maggi 70g", emoji: "🍜", price: 14, qty: 3 },
    ],
    subtotal: 937, gst: 47, discount: 0, total: 984,
  },
  {
    id: "BILL-2024-0027",
    date: "2024-05-13T12:00:00.000Z",
    items: [
      { productId: "p58", name: "Realme Buds Wireless", emoji: "🎧", price: 1799, qty: 1 },
      { productId: "p76", name: "Saree Cotton Print", emoji: "🥻", price: 1299, qty: 1 },
      { productId: "p88", name: "Puzzle 100 Pieces", emoji: "🧩", price: 299, qty: 1 },
    ],
    subtotal: 3397, gst: 170, discount: 0, total: 3567,
  },
  {
    id: "BILL-2024-0028",
    date: "2024-03-31T12:00:00.000Z",
    items: [
      { productId: "p84", name: "Cricket Bat Plastic", emoji: "🏏", price: 249, qty: 2 },
      { productId: "p21", name: "Amul Lassi 200ml", emoji: "🥤", price: 25, qty: 4 },
      { productId: "p1", name: "Parle-G Biscuit", emoji: "🍪", price: 10, qty: 3 },
    ],
    subtotal: 628, gst: 31, discount: 0, total: 659,
  },
  {
    id: "BILL-2024-0029",
    date: "2024-12-30T12:00:00.000Z",
    items: [
      { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", price: 40, qty: 3 },
      { productId: "p2", name: "Amul Milk 500ml", emoji: "🥛", price: 30, qty: 4 },
      { productId: "p19", name: "Amul Cheese Slice", emoji: "🧀", price: 125, qty: 1 },
      { productId: "p35", name: "Madhur Sugar 1kg", emoji: "🍬", price: 48, qty: 4 },
      { productId: "p21", name: "Amul Lassi 200ml", emoji: "🥤", price: 25, qty: 4 },
    ],
    subtotal: 657, gst: 33, discount: 0, total: 690,
  },
  {
    id: "BILL-2024-0030",
    date: "2024-06-13T12:00:00.000Z",
    items: [
      { productId: "p53", name: "Britannia Cake", emoji: "🧁", price: 30, qty: 1 },
      { productId: "p4", name: "Lays Classic", emoji: "🥔", price: 20, qty: 1 },
      { productId: "p83", name: "Teddy Bear Medium", emoji: "🧸", price: 449, qty: 2 },
      { productId: "p27", name: "Tata Tea Gold 500g", emoji: "🍵", price: 280, qty: 1 },
      { productId: "p29", name: "Aashirvaad Atta 5kg", emoji: "🌾", price: 285, qty: 1 },
      { productId: "p101", name: "Glue Stick Fevistik", emoji: "🩹", price: 35, qty: 4 },
      { productId: "p5", name: "Maggi 70g", emoji: "🍜", price: 14, qty: 3 },
    ],
    subtotal: 1695, gst: 85, discount: 0, total: 1780,
  },
];

type Listener = () => void;
class BillStore {
  private bills: Bill[] = [...initialBills];
  private listeners = new Set<Listener>();
  getAll() { return this.bills; }
  add(bill: Bill) { this.bills = [bill, ...this.bills]; this.emit(); }
  subscribe(l: Listener) { this.listeners.add(l); return () => this.listeners.delete(l); }
  private emit() { this.listeners.forEach((l) => l()); }
}
export const billStore = new BillStore();

export type SalesPoint = { day: string; sales: number; profit: number };

export const salesData: SalesPoint[] = [
  { day: "Mon", sales: 4800, profit: 1120 },
  { day: "Tue", sales: 5300, profit: 1350 },
  { day: "Wed", sales: 4100, profit: 940 },
  { day: "Thu", sales: 6800, profit: 1780 },
  { day: "Fri", sales: 8100, profit: 2150 },
  { day: "Sat", sales: 9800, profit: 2840 },
  { day: "Sun", sales: 8900, profit: 2420 },
];

export const predictionData = [
  { day: "W-3", actual: 240, predicted: null as number | null },
  { day: "W-2", actual: 280, predicted: null },
  { day: "W-1", actual: 265, predicted: null },
  { day: "Now", actual: 310, predicted: 310 },
  { day: "W+1", actual: null, predicted: 345 },
  { day: "W+2", actual: null, predicted: 380 },
  { day: "W+3", actual: null, predicted: 435 },
];

export const topProducts = [
  { name: "Dairy Milk 50g", sold: 156 },
  { name: "Coca-Cola 750ml", sold: 148 },
  { name: "Maggi 70g", sold: 112 },
  { name: "Amul Lassi 200ml", sold: 98 },
  { name: "Haldiram Bhujia", sold: 82 },
];

export type Insight = {
  id: string;
  title: string;
  detail: string;
  priority: "Urgent" | "Important" | "Opportunity";
  icon: string;
};

export const insights: Insight[] = [
  {
    id: "i1",
    title: "Maggi is out of stock",
    detail: "High volume of Maggi 70g noticed in recent bills. Restock at least 40 packets immediately.",
    priority: "Urgent",
    icon: "⚠️",
  },
  {
    id: "i2",
    title: "Dairy Milk 50g soaring",
    detail: "Based on the 30 processed bills, Dairy Milk 50g is the top seller. Increase stock buffer by 30%.",
    priority: "Opportunity",
    icon: "📈",
  },
  {
    id: "i3",
    title: "Weekend Sales Spike Predicted",
    detail: "Historical bill patterns indicate a 15% surge this coming weekend. Prepare extra stock for cold beverages.",
    priority: "Important",
    icon: "📊",
  },
  {
    id: "i4",
    title: "Slow moving: Surf Excel",
    detail: "Surf Excel 1kg appeared rarely in the latest batch of 30 bills. Consider a small discount to clear.",
    priority: "Important",
    icon: "🧊",
  },
  {
    id: "i5",
    title: "Combo suggestion: Beverages + Snacks",
    detail: "Coca-Cola 750ml is frequently bought with Haldiram Bhujia. Bundle them for a 5% discount to boost AOV.",
    priority: "Opportunity",
    icon: "🤝",
  },
];

export const trending = [
  { name: "Chocolates", change: "+45%", reason: "Recent trend in new bills" },
  { name: "Cold Beverages", change: "+38%", reason: "Consistent high volume" },
  { name: "Quick Snacks", change: "+28%", reason: "Frequent pairing with drinks" },
  { name: "Stationery", change: "+12%", reason: "School reopening soon" },
];
