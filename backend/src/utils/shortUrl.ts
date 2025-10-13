// TDY Shortener API integration
// https://tdy.one/api/urls

interface TdyShortUrlResponse {
  short_url: string;
  original_url: string;
  custom_code?: string;
  title?: string;
}

export async function createShortUrl(longUrl: string, title?: string): Promise<string> {
  const TDY_API_KEY = '5cb1356e-2d0f-4c49-9883-500784b7de65';
  const TDY_API_ENDPOINT = 'https://tdy.one/api/urls';

  try {
    const requestBody: { original_url: string; title?: string } = {
      original_url: longUrl,
    };

    // Add title if provided (e.g., event name)
    if (title) {
      requestBody.title = title;
    }

    const response = await fetch(TDY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TDY_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`TDY API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json() as TdyShortUrlResponse;
    console.log(`[TDY] Created short URL: ${data.short_url} for ${longUrl}`);
    return data.short_url;
  } catch (error) {
    console.error('Error creating short URL with TDY API:', error);
    // Fallback to original URL if shortening fails
    return longUrl;
  }
}
