import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const apiKey = process.env.AESO_API_KEY;
 

  // Validate API key
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key is missing' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Validate query parameters: Check if both startDate and endDate are present
  if (!startDate || !endDate) {
    return new Response(
      JSON.stringify({ error: 'startDate and endDate query parameters are required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Optional: Validate date format (YYYY-MM-DD)
  const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Basic regex to check for YYYY-MM-DD format
    return regex.test(date);
  };

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return new Response(
      JSON.stringify({ error: 'startDate and endDate must be in YYYY-MM-DD format' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await axios.get(`https://apimgw.aeso.ca/public/poolprice-api/v1.1/price/poolPrice?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'API-Key': apiKey,
      },
    }
  );

    const data = response.data?.return?.['Pool Price Report'] || [];

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error fetching data from AESO API',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}