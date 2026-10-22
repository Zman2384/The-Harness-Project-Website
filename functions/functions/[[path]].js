// Keeps the Pages Functions source (including Lil Z's persona) from being
// downloaded as static files at /functions/...: this route answers first.
export const onRequest = () => new Response('Not found', { status: 404 });
