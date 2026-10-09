// Curated Pune place dataset. Kept separate from UI so it can later feed search/AI.
// Coordinates are WGS84 lat/lng from public map listings (OpenStreetMap / Wikipedia);
// they are accurate to roughly street level — always confirm on the directions link.
// Fields that could not be verified are null and shown as "unavailable".

export type Category = "attraction" | "food" | "hotel" | "heritage" | "park" | "budget";

export interface Place {
  id: string;
  name: string;
  category: Category;
  /** Secondary categories, e.g. a free heritage site is also budget-friendly */
  alsoIn?: Category[];
  lat: number;
  lng: number;
  locality: string;
  description: string;
  /** Verified price/entry info, or null when unavailable */
  price: string | null;
  /** Reliable photo URL, or null to show placeholder */
  image: string | null;
  tags: string[];
}

export const CITY = { name: "Pune", region: "Maharashtra, India", center: [18.5204, 73.8567] as [number, number], zoom: 12 };

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "attraction", label: "Attractions", emoji: "🎡" },
  { id: "food", label: "Local food", emoji: "🍛" },
  { id: "hotel", label: "Hotels", emoji: "🏨" },
  { id: "heritage", label: "Heritage", emoji: "🏛️" },
  { id: "park", label: "Parks", emoji: "🌳" },
  { id: "budget", label: "Budget-friendly", emoji: "💸" },
];

export const places: Place[] = [
  // Heritage
  { id: "shaniwar-wada", name: "Shaniwar Wada", category: "heritage", lat: 18.5195, lng: 73.8553, locality: "Shaniwar Peth", description: "Fortified seat of the Peshwas, built in 1732; its massive gates and gardens survive after the 1828 fire.", price: null, image: null, tags: ["Peshwa era", "Fort"] },
  { id: "aga-khan-palace", name: "Aga Khan Palace", category: "heritage", lat: 18.5524, lng: 73.9015, locality: "Kalyani Nagar / Nagar Road", description: "1892 palace where Mahatma Gandhi and Kasturba were interned (1942–44); Kasturba's samadhi is here.", price: null, image: null, tags: ["Freedom movement", "Museum"] },
  { id: "lal-mahal", name: "Lal Mahal", category: "heritage", lat: 18.5186, lng: 73.8566, locality: "Kasba Peth", description: "Reconstruction of the residence where young Shivaji Maharaj lived with Jijabai.", price: null, image: null, tags: ["Shivaji Maharaj"] },
  { id: "sinhagad", name: "Sinhagad Fort", category: "heritage", alsoIn: ["attraction"], lat: 18.3664, lng: 73.7559, locality: "Sinhagad, ~35 km SW of city", description: "Hill fort famed for Tanaji Malusare's 1670 battle; a popular trek with sweeping Sahyadri views.", price: null, image: null, tags: ["Trek", "Fort"] },
  { id: "pataleshwar", name: "Pataleshwar Cave Temple", category: "heritage", alsoIn: ["budget"], lat: 18.5268, lng: 73.8495, locality: "Jangli Maharaj Road, Shivajinagar", description: "8th-century rock-cut Shiva temple with a circular Nandi mandapa, right in the city centre.", price: "Free entry", image: null, tags: ["Rock-cut", "Temple"] },
  { id: "vishrambaug-wada", name: "Vishrambaug Wada", category: "heritage", lat: 18.5115, lng: 73.8536, locality: "Sadashiv Peth", description: "Early-19th-century mansion of Peshwa Bajirao II, known for its carved teak facade.", price: null, image: null, tags: ["Peshwa era", "Woodwork"] },
  { id: "dagdusheth", name: "Shreemant Dagdusheth Halwai Ganpati", category: "heritage", alsoIn: ["budget"], lat: 18.5164, lng: 73.8560, locality: "Budhwar Peth", description: "Pune's best-known Ganpati temple, at the heart of the city's Ganeshotsav celebrations.", price: "Free entry", image: null, tags: ["Temple", "Ganeshotsav"] },
  { id: "kasba-ganpati", name: "Kasba Ganpati", category: "heritage", alsoIn: ["budget"], lat: 18.5194, lng: 73.8580, locality: "Kasba Peth", description: "The city's presiding deity (gramadevata), associated with Jijabai and Shivaji's time.", price: "Free entry", image: null, tags: ["Temple"] },

  // Attractions
  { id: "kelkar-museum", name: "Raja Dinkar Kelkar Museum", category: "attraction", lat: 18.5103, lng: 73.8550, locality: "Shukrawar Peth", description: "One man's collection of everyday Indian art — lamps, musical instruments, nut-crackers and more.", price: null, image: null, tags: ["Museum"] },
  { id: "parvati", name: "Parvati Hill", category: "attraction", alsoIn: ["budget"], lat: 18.4970, lng: 73.8467, locality: "Parvati", description: "About 100 stone steps up to Peshwa-era temples and one of the best views over the city.", price: "Free to climb", image: null, tags: ["Viewpoint", "Temples"] },
  { id: "katraj-zoo", name: "Rajiv Gandhi Zoological Park", category: "attraction", lat: 18.4519, lng: 73.8649, locality: "Katraj", description: "Large zoo and snake park around Katraj lake, run by the Pune Municipal Corporation.", price: null, image: null, tags: ["Zoo", "Family"] },
  { id: "osho-garden", name: "Osho Teerth Park", category: "attraction", alsoIn: ["park"], lat: 18.5372, lng: 73.8879, locality: "Koregaon Park", description: "Quiet landscaped garden with bamboo groves and streams along a nala in Koregaon Park.", price: null, image: null, tags: ["Garden", "Quiet"] },
  { id: "tribal-museum", name: "Tribal Cultural Museum", category: "attraction", lat: 18.5279, lng: 73.8737, locality: "Koregaon Road", description: "Maharashtra government museum on the state's tribal communities, crafts and ornaments.", price: null, image: null, tags: ["Museum", "Culture"] },

  // Parks
  { id: "saras-baug", name: "Saras Baug", category: "park", alsoIn: ["budget"], lat: 18.5010, lng: 73.8524, locality: "Sadashiv Peth", description: "Lakeside garden around the Talyatla Ganpati temple; evening snack stalls line its edges.", price: "Free entry", image: null, tags: ["Garden", "Temple"] },
  { id: "okayama", name: "Pu La Deshpande Garden (Okayama Friendship Garden)", category: "park", lat: 18.4914, lng: 73.8366, locality: "Sinhagad Road", description: "Japanese-style garden modelled on Okayama's Korakuen, symbol of the Pune–Okayama twinning.", price: null, image: null, tags: ["Japanese garden"] },
  { id: "empress-garden", name: "Empress Garden", category: "park", lat: 18.5045, lng: 73.8955, locality: "Pune Cantonment", description: "Old botanical garden with huge tree canopy, run by the Agri-Horticultural Society of Western India.", price: null, image: null, tags: ["Botanical", "Trees"] },
  { id: "vetal-tekdi", name: "Vetal Tekdi", category: "park", alsoIn: ["budget"], lat: 18.5250, lng: 73.8200, locality: "Kothrud / Pashan", description: "The city's highest hill — a forested walking and running spot with open-air trails.", price: "Free", image: null, tags: ["Hike", "Nature"] },

  // Local food
  { id: "vaishali", name: "Vaishali", category: "food", lat: 18.5208, lng: 73.8414, locality: "FC Road, Shivajinagar", description: "Iconic South Indian restaurant and student hangout, famous for SPDP and dosas.", price: null, image: null, tags: ["Veg", "Iconic"] },
  { id: "bedekar", name: "Bedekar Misal", category: "food", lat: 18.5155, lng: 73.8505, locality: "Narayan Peth", description: "Long-running misal pav joint — the go-to for Pune-style spicy misal.", price: null, image: null, tags: ["Misal", "Breakfast"] },
  { id: "chitale", name: "Chitale Bandhu Mithaiwale", category: "food", lat: 18.5143, lng: 73.8536, locality: "Bajirao Road, Sadashiv Peth", description: "Pune's famous sweet shop, best known for bakarwadi and amba barfi.", price: null, image: null, tags: ["Sweets", "Snacks"] },
  { id: "kayani", name: "Kayani Bakery", category: "food", lat: 18.5163, lng: 73.8789, locality: "East Street, Camp", description: "1955 Irani bakery with queues for its Shrewsbury biscuits and mawa cakes.", price: null, image: null, tags: ["Bakery", "Irani"] },
  { id: "goodluck", name: "Good Luck Café", category: "food", lat: 18.5170, lng: 73.8408, locality: "Deccan Gymkhana", description: "Classic Irani café serving bun maska, chai and kheema since the 1930s.", price: null, image: null, tags: ["Irani café"] },

  // Budget-friendly
  { id: "tulshibaug", name: "Tulshibaug Market", category: "budget", lat: 18.5150, lng: 73.8560, locality: "Budhwar Peth", description: "Crowded old-city market for kitchenware, puja items, bangles and bargains.", price: null, image: null, tags: ["Shopping", "Bargain"] },
  { id: "fc-road", name: "FC Road street shopping", category: "budget", alsoIn: ["food"], lat: 18.5230, lng: 73.8410, locality: "Fergusson College Road", description: "Stretch of street stalls for clothes and accessories, plus cheap eats popular with students.", price: null, image: null, tags: ["Street shopping"] },
  { id: "phule-mandai", name: "Mahatma Phule Mandai", category: "budget", alsoIn: ["heritage"], lat: 18.5115, lng: 73.8565, locality: "Shukrawar Peth", description: "1886 octagonal market hall (Reay Market) — Pune's main vegetable and fruit market.", price: null, image: null, tags: ["Market", "Colonial-era"] },

  // Hotels
  { id: "jw-marriott", name: "JW Marriott Hotel Pune", category: "hotel", lat: 18.5323, lng: 73.8295, locality: "Senapati Bapat Road", description: "Large luxury hotel next to the Agriculture College grounds.", price: null, image: null, tags: ["Luxury"] },
  { id: "taj-blue-diamond", name: "Taj Blue Diamond", category: "hotel", lat: 18.5365, lng: 73.8840, locality: "Koregaon Road", description: "Taj group hotel close to Koregaon Park.", price: null, image: null, tags: ["Luxury"] },
  { id: "hyatt-regency", name: "Hyatt Regency Pune", category: "hotel", lat: 18.5600, lng: 73.9100, locality: "Nagar Road, Viman Nagar", description: "Business hotel on Nagar Road, convenient for Pune Airport.", price: null, image: null, tags: ["Near airport"] },
];

export const inCategory = (p: Place, c: Category) => p.category === c || !!p.alsoIn?.includes(c);
export const categoryLabel = (c: Category) => categories.find((x) => x.id === c)?.label ?? c;
export const directionsUrl = (p: Place) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
