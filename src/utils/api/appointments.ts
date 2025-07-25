export async function createAppointment(appointmentData: any) {
  const appointmentUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
  const response = await fetch(appointmentUrl + '/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }
  
  // Safely parse JSON response
  try {
    const responseText = await response.text();
    if (responseText.trim() === '') {
      throw new Error('Empty response from appointment API');
    }
    return JSON.parse(responseText);
  } catch (jsonError) {
    const errorMessage = jsonError instanceof Error ? jsonError.message : 'Invalid response format';
    throw new Error(`Appointment API error: ${errorMessage}`);
  }
}