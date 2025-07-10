'use server';

import { suggestEstimatedPrices } from '@/ai/flows/suggest-estimated-prices';

export async function getPriceSuggestion(itemName: string) {
  try {
    const result = await suggestEstimatedPrices({ itemNames: [itemName] });
    if (result.suggestedPrices && result.suggestedPrices[itemName]) {
      const price = result.suggestedPrices[itemName];
      return { success: true, price: parseFloat(price.toFixed(2)) };
    }
    return { success: false, error: 'Could not suggest a price for this item.' };
  } catch (error) {
    console.error('AI Price Suggestion Error:', error);
    return { success: false, error: 'An error occurred while fetching price suggestion.' };
  }
}
