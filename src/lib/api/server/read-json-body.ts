export async function readJsonBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (!text || text.trim().length === 0) {
    throw new Error('Empty request body');
  }
  return JSON.parse(text) as unknown;
}
