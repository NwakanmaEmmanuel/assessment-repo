import type { DashboardPayload, PointsTransaction, Restaurant } from '../types';

/** The 5 restaurants from the repo's mock_data.json, mapped onto the Restaurant contract. */
const seed: Restaurant[] = [
  {
    id: 'buka_001',
    name: 'Mama Cass Kitchen',
    cuisineType: 'Nigerian',
    rating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60',
    tags: ['Jollof', 'Swallow', 'Spicy', 'Open Now'],
    isFavorited: false,
    priceRange: 2,
    address: 'Herbert Macaulay Way, Yaba, Lagos',
    isOpen: true,
  },
  {
    id: 'buka_002',
    name: 'White House Buka',
    cuisineType: 'Traditional Nigerian',
    rating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
    tags: ['Amala', 'Ewedu', 'Gbegiri', 'Open Now'],
    isFavorited: true,
    priceRange: 1,
    address: 'Chapel Street, Yaba, Lagos',
    isOpen: true,
  },
  {
    id: 'buka_003',
    name: 'Bukateria Supreme',
    cuisineType: 'Fast Food',
    rating: 4.2,
    photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=60',
    tags: ['Sharwama', 'Chicken', 'Fries'],
    isFavorited: false,
    priceRange: 3,
    address: 'Wuse II, Abuja',
    isOpen: false,
  },
  {
    id: 'buka_004',
    name: 'Calabar Kitchen',
    cuisineType: 'South-South Nigerian',
    rating: 4.7,
    photoUrl: '', // empty on purpose (as in mock_data.json) -> exercises the image fallback
    tags: ['Afang', 'Edikaikong', 'Seafood', 'Open Now'],
    isFavorited: false,
    priceRange: 2,
    address: 'Marian Road, Calabar',
    isOpen: true,
  },
  {
    id: 'buka_005',
    name: 'The London Buka',
    cuisineType: 'Afro-Fusion',
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=60',
    tags: ['Suya Tacos', 'Jollof Risotto', 'Open Now'],
    isFavorited: true,
    priceRange: 4,
    address: 'Peckham, London',
    isOpen: true,
  },
];

const EXTRA_NAMES = [
  'Iya Basira Canteen', 'Ofada Corner', 'Yaba Suya Spot', 'Lekki Grill House', 'Mama Put Express',
  'Ikeja Amala Hub', 'Surulere Pepper Soup', 'Ajegunle Jollof Place', 'Island Rice Bowl', 'Eko Akara Stop',
  'Mushin Moi-Moi Joint', 'Oshodi Buka', 'Victoria Island Bistro', 'Ikoyi Brunch Club', 'Badagry Seafood Shack',
  'Festac Fufu Palace', 'Maryland Pounded Yam', 'Ojuelegba Rice & Stew', 'Gbagada Grillz', 'Ajah Chicken Republic',
  'Ebute Metta Eatery', 'Apapa Dockside Kitchen', 'Yaba Tech Canteen', 'Unilag Buka Bar', 'Akoka Rice Point',
  'Bariga Bean Cakes', 'Ogba Soup Kitchen', 'Magodo Garden Grill', 'Lagos Island Pastries', 'Obalende Suya Stand',
  'Ketu Egusi House', 'Ikorodu Roast Fish', 'Alaba Pepper Pot', 'Idumota Rice Spot', 'Agege Bread & Stew',
  'Lagos Mainland Diner', 'Palmgrove Plantain Place', 'Ilupeju Jollof Lounge', 'Oniru Beach Bites', 'Sangotedo Smokehouse',
  'Jibowu Buka Stop', 'Fadeyi Fast Bites', 'Anthony Village Kitchen', 'Opebi Grill Room', 'Allen Avenue Eats',
  'Awolowo Road Bistro', 'Falomo Food Court', 'Lekki Phase 1 Cafe', 'Chevron Drive Kitchen', 'Admiralty Suya Co.',
];
const CUISINES = ['Nigerian', 'Traditional Nigerian', 'Fast Food', 'South-South Nigerian', 'Afro-Fusion', 'Continental'];
const TAG_POOL = ['Jollof', 'Delivery', 'Open Now', 'Spicy', 'Swallow', 'Seafood', 'Grill', 'Vegetarian', 'Fast', 'Amala'];
const PHOTO_POOL = [...seed.map((r) => r.photoUrl), '', ''];

/** Deterministic pseudo-random (no Math.random) so the mock data is identical on every load. */
const pick = <T,>(items: readonly T[], n: number): T => items[n % items.length] as T;

const generated: Restaurant[] = EXTRA_NAMES.map((name, i) => {
  const tagStart = (i * 3) % TAG_POOL.length;
  return {
    id: `buka_${String(i + 6).padStart(3, '0')}`,
    name,
    cuisineType: pick(CUISINES, i * 7 + 1),
    rating: Math.round((3 + ((i * 37) % 21) / 10) * 10) / 10, // 3.0 – 5.0
    photoUrl: pick(PHOTO_POOL, i * 5 + 2),
    tags: [pick(TAG_POOL, tagStart), pick(TAG_POOL, tagStart + 1), pick(TAG_POOL, tagStart + 4)],
    isFavorited: i % 9 === 0,
    priceRange: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    address: 'Lagos, Nigeria',
    isOpen: i % 5 !== 0,
  };
});

export const mockRestaurants: Restaurant[] = [...seed, ...generated];

/** Deliberately unsorted so the panel has to sort most-recent-first itself. */
export const mockPointsHistory: PointsTransaction[] = [
  { id: 't2', type: 'REVIEW', points: 20, restaurantName: 'Mama Cass Kitchen', createdAt: '2026-06-28T12:00:00Z' },
  { id: 't1', type: 'CHECK_IN', points: 50, restaurantName: 'White House Buka', createdAt: '2026-06-29T14:15:00Z' },
  { id: 't4', type: 'CHECK_IN', points: 50, restaurantName: 'Calabar Kitchen', createdAt: '2026-07-02T09:40:00Z' },
  { id: 't3', type: 'REVIEW', points: 20, restaurantName: 'The London Buka', createdAt: '2026-06-30T18:05:00Z' },
];

export const mockPayload: DashboardPayload = {
  restaurants: mockRestaurants,
  pointsBalance: 140,
  pointsHistory: mockPointsHistory,
};
