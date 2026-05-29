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

export const CARD_SUGGESTIONS: Record<string, string[]> = {
  DBS: ['DBS Altitude Visa', 'DBS Altitude Amex', 'DBS Vantage', "DBS Woman's World"],
  OCBC: ['OCBC 90°N Visa', 'OCBC 90°N Mastercard', 'OCBC Titanium Rewards'],
  UOB: ['UOB PRVI Miles Visa', 'UOB PRVI Miles Amex', 'UOB Visa Signature'],
  Citibank: ['Citi PremierMiles', 'Citi Prestige', 'Citi Rewards'],
  'Standard Chartered': ['SC Journey Visa Infinite', 'SC Visa Infinite', 'SC X Card'],
  HSBC: ['HSBC TravelOne', 'HSBC Visa Infinite', 'HSBC Revolution'],
  'American Express': ['AMEX KrisFlyer', 'AMEX KrisFlyer Ascend', 'AMEX Platinum'],
  Maybank: ['Maybank Horizon Visa Signature', 'Maybank World Mastercard'],
};

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
