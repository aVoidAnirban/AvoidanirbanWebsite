export async function parseApiResponse(response) {
  const text = await response.text()

  if (!text || !text.trim()) {
    throw new Error(
      'Server returned an empty response. Stop the terminal (Ctrl+C), then run npm run dev again.'
    )
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      'Server returned an invalid response. Make sure npm run dev is running (both client and server).'
    )
  }
}
