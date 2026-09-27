// Real products from the API don't ship an emoji, and many won't have a
// photo either — this gives every card a sensible visual regardless.
const RULES = [
  [/produce|vegetable|fruit|veg/i, '🥬'],
  [/dairy|egg|milk/i, '🥛'],
  [/fish|meat|chicken|poultry|beef/i, '🍗'],
  [/bakery|bread/i, '🍞'],
  [/pantry|grain|rice|oil/i, '🧺'],
  [/drink|beverage/i, '🥤'],
  [/snack/i, '🍪'],
  [/household|cleaning/i, '🧽']
];

export function categoryEmoji(category) {
  if (!category) return '🛒';
  const match = RULES.find(([pattern]) => pattern.test(category));
  return match ? match[1] : '🛒';
}

// Product "images" comes back from the API as a plain string. Treat it as a
// usable photo only if it actually looks like a URL — otherwise fall back
// to the category emoji rather than showing a broken image icon.
export function firstImageUrl(images) {
  if (!images || typeof images !== 'string') return null;
  const first = images.split(',')[0].trim();
  return /^https?:\/\//i.test(first) ? first : null;
}
