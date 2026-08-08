// Mock data used only when logged in with the demo account (token === "demo-token").
// Safe to delete this whole file once a real backend is connected.

export const mockSuits = [
  {
    _id: "s1",
    name: "Classic Navy Suit",
    category: "Formal",
    size: "M",
    color: "Navy",
    rentalPrice: 45,
    availability: true,
    condition: "Good",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsWuQwRmiJOZnzTd7rv4rvGn2Pb8P97NKAABWmerngMloUUsPC6LwHfzQ&s=10",
  },
  {
    _id: "s2",
    name: "Charcoal Wedding Suit",
    category: "Wedding",
    size: "L",
    color: "Charcoal",
    rentalPrice: 65,
    availability: false,
    condition: "New",
    image:
      "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/N54855s.jpg",
  },
  {
    _id: "s3",
    name: "Black Tuxedo",
    category: "Tuxedo",
    size: "XL",
    color: "Black",
    rentalPrice: 80,
    availability: true,
    condition: "Good",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLEI-bVANLd2tRUgxujg4q0BmAmEc321wmbo6BAKeejoEfMh4RUTzpnMA&s=10",
  },
  {
    _id: "s4",
    name: "Beige Casual Blazer",
    category: "Casual",
    size: "S",
    color: "Beige",
    rentalPrice: 30,
    availability: true,
    condition: "Fair",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRa4Qc2_-K-5dFwMw3BPGzesbya4C4w3FvlE56nnNEA&s",
  },
];

export const mockCustomers = [
  {
    _id: "c1",
    fullName: "khaalid mahamed ",
    phone: "063-4567890",
    email: "khaalid@example.com",
    address: "maslaha",
    nationalId: "A1234567",
    rentalHistory: [{ suitName: "Classic Navy Suit", status: "Returned" }],
  },
  {
    _id: "c2",
    fullName: "Ahmed Yusuf",
    phone: "2345678901",
    email: "ahmed@example.com",
    address: "45 Oak Ave",
    nationalId: "B7654321",
    rentalHistory: [],
  },
  {
    _id: "c3",
    fullName: "ahmed Ali",
    phone: "063-33884450",
    email: "ahmed@example.com",
    address: " macalin haaruun",
    nationalId: "C9988776",
    rentalHistory: [{ suitName: "Black Tuxedo", status: "Active" }],
  },
];
export const mockRentals = [
  {
    _id: "r1",
    customer: { _id: "c1", fullName: "khaalid mahamed " },
    suit: { _id: "s2", name: "Charcoal Wedding Suit" },
    rentalDate: "2026-07-20",
    returnDate: "2026-07-27",
    status: "Active",
    paymentStatus: "Paid",
  },
  {
    _id: "r2",
    customer: { _id: "c3", fullName: "Sara Ali" },
    suit: { _id: "s3", name: "Black Tuxedo" },
    rentalDate: "2026-07-15",
    returnDate: "2026-07-22",
    status: "Active",
    paymentStatus: "Pending",
  },
  {
    _id: "r3",
    customer: { _id: "c2", fullName: "Ahmed Yusuf" },
    suit: { _id: "s5", name: "Grey Pinstripe Suit" },
    rentalDate: "2026-07-01",
    returnDate: "2026-07-05",
    status: "Returned",
    paymentStatus: "Paid",
  },
];

export const mockStaff = [
  {
    _id: "st1",
    name: "Demo Admin",
    email: "admin@demo.com",
    phone: "1112223333",
    role: "Admin",
  },
  {
    _id: "st2",
    name: "Fatima Noor",
    email: "fatima@example.com",
    phone: "4445556666",
    role: "Staff",
  },
];

export const mockBookings = [
  {
    _id: "bk1",
    customerName: "Khadar Mohamed",
    phone: "0611223344",
    suit: { _id: "s1", name: "Classic Navy Suit" },
    size: "M",
    price: 45,
    bookingDate: "2026-08-10",
    status: "Reserved",
    notes: "Called for a wedding, will confirm size on pickup.",
  },
  {
    _id: "bk2",
    customerName: "Deeqa Hassan",
    phone: "0622334455",
    suit: { _id: "s3", name: "Black Tuxedo" },
    size: "L",
    price: 80,
    bookingDate: "2026-08-15",
    status: "Confirmed",
    notes: "",
  },
];

export const mockStats = {
  totalSuits: mockSuits.length,
  availableSuits: mockSuits.filter((s) => s.availability).length,
  rentedSuits: mockSuits.filter((s) => !s.availability).length,
  totalCustomers: mockCustomers.length,
  activeRentals: mockRentals.filter((r) => r.status === "Active").length,
  returnedRentals: mockRentals.filter((r) => r.status === "Returned").length,
  totalStaff: mockStaff.length,
  totalRevenue: 1250,
  newCustomers: 2,
  utilizationRate: 60,
};
