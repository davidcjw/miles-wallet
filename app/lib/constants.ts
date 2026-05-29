export const SUGGESTED_BANKS = [
  'DBS',
  'OCBC',
  'UOB',
  'Citibank',
  'Standard Chartered',
  'HSBC',
  'Maybank',
  'American Express',
];

export const SUGGESTED_LOYALTY_PROGRAMMES = [
  'KrisFlyer',
  'Asia Miles',
  'Enrich Miles',
  'Avios',
  'Qantas Frequent Flyer',
  'AirAsia BIG Points',
  'Garuda Miles',
  'Flying Blue',
];

// Suggested conversion rates: points per 1 mile
export const SUGGESTED_RATES: Record<string, Record<string, number>> = {
  DBS: { KrisFlyer: 3, 'Asia Miles': 3 },
  Citibank: { KrisFlyer: 3.25, 'Asia Miles': 3.25 },
  UOB: { KrisFlyer: 2, 'Asia Miles': 2 },
  OCBC: { KrisFlyer: 1.6 },
  'Standard Chartered': { KrisFlyer: 2.5 },
  HSBC: { KrisFlyer: 2.5 },
  'American Express': { KrisFlyer: 2.5 },
  Maybank: { KrisFlyer: 5 },
};
