import https from 'https';

const cache = new Map<string, string>();

/**
 * Translates a single text string from one language to another using the Google Translate Single Client API.
 * Uses an in-memory cache to prevent redundant external network requests and stay rate-limit safe.
 */
export async function translateText(text: string | null | undefined, from = 'id', to = 'en'): Promise<string> {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  const cacheKey = `${from}-${to}:${trimmed}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed[0]) {
            const translated = parsed[0]
              .map((item: any) => item[0])
              .filter(Boolean)
              .join('');
            if (translated) {
              cache.set(cacheKey, translated);
              resolve(translated);
              return;
            }
          }
          resolve(trimmed);
        } catch (err) {
          console.error('[Translation Error] Failed to parse JSON:', err);
          resolve(trimmed);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[Translation Error] Connection failed:', err);
      resolve(trimmed);
    });

    // Set a timeout of 3 seconds so we don't hang the request forever
    req.setTimeout(3000, () => {
      req.destroy();
      console.warn('[Translation Warning] Request timed out, falling back to original');
      resolve(trimmed);
    });
  });
}

/**
 * Translates a single ingredient object's name, description, and source fields.
 */
export async function translateIngredient(ingredient: any, from = 'id', to = 'en'): Promise<any> {
  if (!ingredient) return ingredient;
  
  // Clone to avoid mutating database models
  const cloned = { ...ingredient };

  const [translatedName, translatedDesc, translatedSource] = await Promise.all([
    translateText(cloned.name, from, to),
    translateText(cloned.description, from, to),
    translateText(cloned.source, from, to)
  ]);

  cloned.name = translatedName;
  cloned.description = translatedDesc;
  cloned.source = translatedSource;

  return cloned;
}

/**
 * Translates an array of ingredient objects.
 */
export async function translateIngredients(ingredients: any[], from = 'id', to = 'en'): Promise<any[]> {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return ingredients;
  return Promise.all(ingredients.map(ing => translateIngredient(ing, from, to)));
}
