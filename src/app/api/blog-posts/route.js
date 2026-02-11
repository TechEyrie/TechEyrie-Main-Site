// Proxy WordPress blog posts so the /dark page (and other client pages) can fetch without CORS.
import { fetchWordPressPosts } from '../../../../utils/wordpress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const posts = await fetchWordPressPosts();
    return Response.json(posts ?? []);
  } catch (error) {
    console.error('API blog-posts error:', error);
    return Response.json([], { status: 200 });
  }
}
