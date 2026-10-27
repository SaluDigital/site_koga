// Facts shared by both languages. Edit here, then run: node build/build.mjs

export const SITE = 'https://kogaortho.com'; // TODO: confirm the final production domain

export const BOOKING_URL =
  'https://book2.getweave.com/3cc168a2-25b1-4b16-838c-c9ad7da2e657/request-appointment';
export const REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ0zXJ61VHLoYRjOzBOj9pmI0';
export const PORTAL_URL = 'https://hummel.cloud9ortho.com/portal';
export const FACEBOOK_URL = 'https://www.facebook.com/KogaOrtho/';
export const INSTAGRAM_URL = 'https://www.instagram.com/kogaorthodontics/';
export const PRIVACY_URL = '#top'; // TODO: replace with the real Privacy Policy URL once confirmed

export const PHONE = { display: '(318) 388-4209', tel: '+13183884209' };

// TODO (client): confirm the practice email. Leave null to hide it everywhere.
export const EMAIL = null;

// Google Analytics / Tag Manager slot. Set an ID and main.js loads it after
// first interaction or idle time. Empty string = nothing is loaded.
export const ANALYTICS_ID = ''; // e.g. 'G-XXXXXXXXXX'

/**
 * Offices. `hours` is intentionally null everywhere: hours are NOT confirmed.
 * When confirmed, use e.g. hours: { en: 'Mon–Thu 8:00–5:00', es: 'Lun–Jue 8:00–5:00',
 * schema: [{ days: ['Monday','Tuesday'], opens: '08:00', closes: '17:00' }] }
 * and it will appear on the page and in the JSON-LD automatically.
 */
export const OFFICES = [
  {
    id: 'monroe',
    city: 'Monroe',
    color: 'teal',
    street: '2124 Forsythe Ave',
    locality: 'Monroe',
    region: 'LA',
    zip: '71201',
    lat: 32.5343337,
    lng: -92.1080624,
    image: 'office-monroe.webp',
    hours: null, // TODO: hours not confirmed
  },
  {
    id: 'west-monroe',
    city: 'West Monroe',
    color: 'yellow',
    street: '4900 Cypress Street, Unit 16',
    locality: 'West Monroe',
    region: 'LA',
    zip: null, // TODO: West Monroe ZIP code not confirmed
    lat: 32.5165552,
    lng: -92.1837237,
    image: 'office-west-monroe.webp',
    hours: null, // TODO: hours not confirmed
  },
  {
    id: 'rayville',
    city: 'Rayville',
    color: 'orange',
    street: '1107 Louisa Street #2',
    locality: 'Rayville',
    region: 'LA',
    zip: '71269',
    lat: 32.4720449,
    lng: -91.7578622,
    image: 'office-rayville.webp',
    hours: null, // TODO: hours not confirmed
  },
  {
    id: 'columbia',
    city: 'Columbia',
    color: 'crimson',
    street: '7915 US-165 (Highway 165 South)',
    locality: 'Columbia',
    region: 'LA',
    zip: '71418',
    lat: 32.0796054,
    lng: -92.0943337,
    image: 'office-columbia.webp',
    hours: null, // TODO: hours not confirmed
  },
];

export const GALLERY_COUNT = 6;
