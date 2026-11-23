/**
 * ============================  PHOTOS  ============================
 * Run  npm run photos  once: it saves all photos inside the app (assets/images/menu) and the app
 * then uses those local files. Without them it falls back to the web links in photo-sources.json.
 * The web links live in photo-sources.json (one line per menu item, id on the left).
 * Or save your own photo as assets/images/menu/<item-id>.jpg and run  npm run photos.
 *
 * ===================================================================
 */
import sources from './photo-sources.json';
import { LOCAL_PHOTOS } from './localPhotos';

export type PhotoSource = string | number;

const pick = (key: string, web: string): PhotoSource => LOCAL_PHOTOS[key] ?? web;

export const PRODUCT_PHOTOS: Record<string, PhotoSource | undefined> = Object.fromEntries(
  Object.entries(sources.products).map(([id, url]) => [id, pick(id, url)]),
);

// Big background photos for the welcome and login/signup screens.
export const HERO_PHOTO: PhotoSource = pick('hero', sources.hero);
export const AUTH_PHOTO: PhotoSource = pick('auth', sources.auth);
export const CAFE_PHOTO: PhotoSource = pick('cafe', sources.cafe);

// If an item's own photo link fails, show the photo of a similar item instead.
const SUBSTITUTES: Record<string, string> = {
  americano: 'espresso',
  'iced-matcha': 'matcha-latte',
  kashmiri: 'chai',
  croissant: 'almond-croissant',
  'blueberry-muffin': 'cookie',
};
export const backupPhoto = (id: string): PhotoSource | undefined => {
  const sub = SUBSTITUTES[id];
  return sub ? PRODUCT_PHOTOS[sub] : undefined;
};

/** Turns a link or a local file into something <Image> understands. */
export const toSource = (p: PhotoSource) => (typeof p === 'string' ? { uri: p } : p);
