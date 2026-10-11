// Mapping for non-standard country codes and names to proper country names
export const COUNTRY_MAPPING = {
  // Non-standard codes
  'CD': 'Democratic Republic of the Congo',
  'CG': 'Republic of the Congo',
  'XK': 'Kosovo',
  'PS': 'Palestine',
  'TW': 'Taiwan',
  
  // Common variations from M3U data
  'Congo - Kinshasa': 'Democratic Republic of the Congo',
  'Congo - Brazzaville': 'Republic of the Congo',
  'Congo': 'Democratic Republic of the Congo',
  'DR Congo': 'Democratic Republic of the Congo',
  'Democratic Republic of Congo': 'Democratic Republic of the Congo',
  'Republic of Congo': 'Republic of the Congo',
  'Kosovo': 'Kosovo',
  'Taiwan': 'Taiwan',
  'Taiwan, Province of China': 'Taiwan',
  'Palestine': 'Palestine',
  'State of Palestine': 'Palestine',
  
  // Other common variations
  'UK': 'United Kingdom',
  'USA': 'United States',
  'UAE': 'United Arab Emirates',
  'Hong Kong': 'Hong Kong',
  'Macau': 'Macau',
  'South Korea': 'South Korea',
  'North Korea': 'North Korea',
  'Vietnam': 'Vietnam',
  'Laos': 'Laos',
  'Myanmar': 'Myanmar',
  'Burma': 'Myanmar',
  'Czech Republic': 'Czech Republic',
  'Czechia': 'Czech Republic',
  'Macedonia': 'North Macedonia',
  'FYROM': 'North Macedonia',
  'Swaziland': 'Eswatini',
  'Cape Verde': 'Cabo Verde',
  'Ivory Coast': "Côte d'Ivoire",
  'East Timor': 'Timor-Leste',
  'Brunei': 'Brunei Darussalam',
  'Iran': 'Iran',
  'Syria': 'Syria',
  'Russia': 'Russia',
  'Turkey': 'Türkiye',
  'Vatican': 'Vatican City',
  'Holy See': 'Vatican City',
};

export function getFullCountryName(country) {
  if (!country) return '';
  
  const normalizedCountry = country.trim();
  
  // Check if it's already in our mapping
  if (COUNTRY_MAPPING[normalizedCountry]) {
    return COUNTRY_MAPPING[normalizedCountry];
  }
  
  // Try to convert 2-letter code using Intl.DisplayNames
  try {
    if (typeof normalizedCountry === 'string' && normalizedCountry.length === 2) {
      if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
        const dn = new Intl.DisplayNames(['en'], { type: 'region' });
        const name = dn.of(normalizedCountry);
        if (name && name !== normalizedCountry) {
          return name;
        }
      }
    }
  } catch (e) {
    // Fall through
  }
  
  // Return original if no mapping found
  return normalizedCountry;
}
