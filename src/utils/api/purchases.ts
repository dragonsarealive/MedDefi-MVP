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
    throw new Error('Failed to create appointment');
  }
  return response.json();
}