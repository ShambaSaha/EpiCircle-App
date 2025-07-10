'use server';

/**
 * @fileOverview Scrap item price suggestion AI agent.
 *
 * - suggestEstimatedPrices - A function that suggests estimated prices for scrap items.
 * - SuggestEstimatedPricesInput - The input type for the suggestEstimatedPrices function.
 * - SuggestEstimatedPricesOutput - The return type for the suggestEstimatedPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEstimatedPricesInputSchema = z.object({
  itemNames: z
    .array(z.string())
    .describe('A list of scrap item names to estimate prices for.'),
});
export type SuggestEstimatedPricesInput = z.infer<typeof SuggestEstimatedPricesInputSchema>;

const SuggestEstimatedPricesOutputSchema = z.object({
  suggestedPrices: z
    .record(z.string(), z.number())
    .describe('A map of scrap item names to their estimated prices.'),
});
export type SuggestEstimatedPricesOutput = z.infer<typeof SuggestEstimatedPricesOutputSchema>;

export async function suggestEstimatedPrices(input: SuggestEstimatedPricesInput): Promise<SuggestEstimatedPricesOutput> {
  return suggestEstimatedPricesFlow(input);
}

const getEstimatedPrices = ai.defineTool({
  name: 'getEstimatedPrices',
  description: 'Returns the estimated prices for a list of scrap items.',
  inputSchema: z.object({
    itemNames: z.array(z.string()).describe('A list of scrap item names.'),
  }),
  outputSchema: z.record(z.string(), z.number()).describe('A map of scrap item names to their estimated prices.'),
}, async (input) => {
  // TODO: Implement the logic to fetch estimated prices from reliable external sources.
  // This is a placeholder implementation.
  const estimatedPrices: Record<string, number> = {};
  input.itemNames.forEach(itemName => {
    estimatedPrices[itemName] = Math.random() * 10; // Random price for now
  });
  return estimatedPrices;
});

const prompt = ai.definePrompt({
  name: 'suggestEstimatedPricesPrompt',
  tools: [getEstimatedPrices],
  input: {schema: SuggestEstimatedPricesInputSchema},
  output: {schema: SuggestEstimatedPricesOutputSchema},
  prompt: `You are an assistant that suggests estimated prices for scrap items. Use the getEstimatedPrices tool to fetch prices for the following items: {{itemNames}}.

Return a JSON object mapping each item name to its estimated price.

Ensure all items in itemNames has an estimated price. If external tool cannot find the price, return a price of -1 for it.

For example, if given itemNames of ["iron", "copper"], a valid response would be {"iron": 2.50, "copper": 5.00}.`,
});

const suggestEstimatedPricesFlow = ai.defineFlow(
  {
    name: 'suggestEstimatedPricesFlow',
    inputSchema: SuggestEstimatedPricesInputSchema,
    outputSchema: SuggestEstimatedPricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
