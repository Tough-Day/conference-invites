// Short URL service integration
// This will be customized based on the API you provide

interface ShortUrlResponse {
  shortUrl: string;
  originalUrl: string;
}

export async function createShortUrl(longUrl: string): Promise<string> {
  const apiKey = process.env.SHORT_URL_API_KEY;
  const apiEndpoint = process.env.SHORT_URL_API_ENDPOINT;

  if (!apiKey || !apiEndpoint) {
    console.warn('Short URL API not configured, returning original URL');
    return longUrl;
  }

  try {
    // This is a placeholder - will be customized based on your API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: longUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Short URL API returned ${response.status}`);
    }

    const data = await response.json() as ShortUrlResponse;
    return data.shortUrl;
  } catch (error) {
    console.error('Error creating short URL:', error);
    // Fallback to original URL if shortening fails
    return longUrl;
  }
}
