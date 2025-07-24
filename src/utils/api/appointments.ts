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
  return response.json();
}