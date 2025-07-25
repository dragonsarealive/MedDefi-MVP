export async function createPurchase(purchaseData: any) {
const purchaseUrl = process.env.NEXT_PUBLIC_WALLET_DASH_URL as string;
  const response = await fetch(purchaseUrl + '/service/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(purchaseData),
  });
  if (!response.ok) {
    throw new Error('Failed to create purchase');
  }
  
  // Safely parse JSON response
  try {
    const responseText = await response.text();
    if (responseText.trim() === '') {
      throw new Error('Empty response from purchase API');
    }
    return JSON.parse(responseText);
  } catch (jsonError) {
    const errorMessage = jsonError instanceof Error ? jsonError.message : 'Invalid response format';
    throw new Error(`Purchase API error: ${errorMessage}`);
  }
}