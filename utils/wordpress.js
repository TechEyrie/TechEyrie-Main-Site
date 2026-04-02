// WordPress API utility functions — set NEXT_PUBLIC_WORDPRESS_URL to your site origin (no trailing slash)
function normalizeWordPressSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://app.thetecheyrie.com';
  return String(raw).trim().replace(/\/$/, '');
}

const WORDPRESS_SITE_URL = normalizeWordPressSiteUrl();
const WORDPRESS_API_URL = `${WORDPRESS_SITE_URL}/wp-json/wp/v2`;
const WORDPRESS_GRAPHQL_URL = `${WORDPRESS_SITE_URL}/graphql`;

function wordPressPermalinkFromUri(uri) {
  if (!uri || typeof uri !== 'string') return '';
  const path = uri.startsWith('/') ? uri : `/${uri}`;
  return `${WORDPRESS_SITE_URL}${path}`;
}

// Try GraphQL first, fallback to REST
const USE_GRAPHQL = true;

/**
 * Transform WordPress post data to our app's format
 */
export function transformWordPressPost(wpPost, featuredMedia = null) {
  // Extract category name (default to "Other" if no category)
  let category = "Other";
  if (wpPost._embedded && wpPost._embedded['wp:term'] && wpPost._embedded['wp:term'][0]) {
    // Get category from embedded terms
    const categories = wpPost._embedded['wp:term'][0];
    if (categories && categories.length > 0) {
      category = categories[0].name || "Other";
    }
  } else if (wpPost.categories && wpPost.categories.length > 0) {
    // Fallback: map category IDs to names (you may need to adjust this based on your WordPress setup)
    const categoryId = wpPost.categories[0];
    // Common WordPress category IDs - adjust based on your setup
    category = categoryId === 8 ? "Demand Generation" : "Other";
  }

  // Calculate read time from content (rough estimate: 200 words per minute)
  const wordCount = wpPost.content?.rendered 
    ? wpPost.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length 
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get featured image URL
  let imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"; // Default fallback
  if (featuredMedia && featuredMedia.source_url) {
    imageUrl = featuredMedia.source_url;
  } else if (wpPost._embedded && wpPost._embedded['wp:featuredmedia'] && wpPost._embedded['wp:featuredmedia'][0]) {
    imageUrl = wpPost._embedded['wp:featuredmedia'][0].source_url;
  }

  // Format date
  const date = new Date(wpPost.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    id: wpPost.id,
    title: wpPost.title?.rendered || wpPost.title || '',
    category: category,
    author: wpPost._embedded?.author?.[0]?.name || 'Admin',
    readTime: `${readTime} min read`,
    date: formattedDate,
    slug: wpPost.slug,
    image: imageUrl,
    content: wpPost.content?.rendered || wpPost.content || '',
    excerpt: wpPost.excerpt?.rendered || wpPost.excerpt || '',
    link: wpPost.link || '',
  };
}

/**
 * Fetch all posts from WordPress using GraphQL
 */
async function fetchWordPressPostsGraphQL() {
  try {
    const query = `
      query GetPosts {
        posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            date
            content
            excerpt
            author {
              node {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data.posts.nodes.map(post => ({
      id: post.id,
      title: post.title || '',
      category: post.categories?.nodes?.[0]?.name || 'Other',
      author: post.author?.node?.name || 'Admin',
      readTime: calculateReadTime(post.content || ''),
      date: formatDate(post.date),
      slug: post.slug,
      image: post.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      content: post.content || '',
      excerpt: post.excerpt || '',
      link: `https://app.thetecheyrie.com/${post.slug}/`,
    }));
  } catch (error) {
    console.error('Error fetching WordPress posts via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch all posts from WordPress API (REST fallback)
 */
async function fetchWordPressPostsREST() {
  try {
    // Fetch posts with embedded featured media and author
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&per_page=100&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();
    
    // Transform each post
    return posts.map(post => transformWordPressPost(post));
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return null; // Return null on error to trigger fallback
  }
}

/**
 * Fetch all posts from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressPosts() {
  if (USE_GRAPHQL) {
    const graphqlPosts = await fetchWordPressPostsGraphQL();
    if (graphqlPosts) {
      return graphqlPosts;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressPostsREST();
}

/**
 * Helper function to calculate read time
 */
function calculateReadTime(content) {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  return `${readTime} min read`;
}

/**
 * Helper function to format date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Fetch a single post by slug from WordPress using GraphQL
 */
async function fetchWordPressPostBySlugGraphQL(slug) {
  try {
    const query = `
      query GetPost($slug: String!) {
        postBy(slug: $slug) {
          id
          title
          slug
          date
          content
          excerpt
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        variables: { slug }
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data.postBy) {
      return null;
    }

    const post = result.data.postBy;

    return {
      id: post.id,
      title: post.title || '',
      category: post.categories?.nodes?.[0]?.name || 'Other',
      author: post.author?.node?.name || 'Admin',
      readTime: calculateReadTime(post.content || ''),
      date: formatDate(post.date),
      slug: post.slug,
      image: post.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      content: post.content || '',
      excerpt: post.excerpt || '',
      link: `https://app.thetecheyrie.com/${post.slug}/`,
    };
  } catch (error) {
    console.error('Error fetching WordPress post via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch a single post by slug from WordPress API (REST fallback)
 */
async function fetchWordPressPostBySlugREST(slug) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();
    
    if (posts.length === 0) {
      return null;
    }

    return transformWordPressPost(posts[0]);
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    return null; // Return null on error to trigger fallback
  }
}

/**
 * Fetch a single post by slug from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressPostBySlug(slug) {
  if (USE_GRAPHQL) {
    const graphqlPost = await fetchWordPressPostBySlugGraphQL(slug);
    if (graphqlPost) {
      return graphqlPost;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressPostBySlugREST(slug);
}

/**
 * Fetch featured media for a post
 */
export async function fetchFeaturedMedia(mediaId) {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/media/${mediaId}`);
    
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured media:', error);
    return null;
  }
}

/**
 * Transform WordPress page data to our app's format
 */
export function transformWordPressPage(wpPage, featuredMedia = null) {
  // Get featured image URL
  let imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"; // Default fallback
  if (featuredMedia && featuredMedia.source_url) {
    imageUrl = featuredMedia.source_url;
  } else if (wpPage._embedded && wpPage._embedded['wp:featuredmedia'] && wpPage._embedded['wp:featuredmedia'][0]) {
    imageUrl = wpPage._embedded['wp:featuredmedia'][0].source_url;
  }

  // Format date
  const date = new Date(wpPage.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    id: wpPage.id,
    title: wpPage.title?.rendered || wpPage.title || '',
    author: wpPage._embedded?.author?.[0]?.name || 'Admin',
    date: formattedDate,
    slug: wpPage.slug,
    image: imageUrl,
    content: wpPage.content?.rendered || wpPage.content || '',
    excerpt: wpPage.excerpt?.rendered || wpPage.excerpt || '',
    link: wpPage.link || '',
  };
}

/**
 * Fetch all pages from WordPress using GraphQL
 */
async function fetchWordPressPagesGraphQL() {
  try {
    const query = `
      query GetPages {
        pages(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            date
            content
            author {
              node {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data.pages.nodes.map(page => ({
      id: page.id,
      title: page.title || '',
      author: page.author?.node?.name || 'Admin',
      readTime: calculateReadTime(page.content || ''),
      date: formatDate(page.date),
      slug: page.slug,
      image: page.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      content: page.content || '',
      excerpt: '', // Pages don't have excerpt in GraphQL
      link: `https://app.thetecheyrie.com/${page.slug}/`,
    }));
  } catch (error) {
    console.error('Error fetching WordPress pages via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch all pages from WordPress API (REST fallback)
 */
async function fetchWordPressPagesREST() {
  try {
    // Fetch pages with embedded featured media and author
    const response = await fetch(
      `${WORDPRESS_API_URL}/pages?_embed&per_page=100&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const pages = await response.json();
    
    // Transform each page
    return pages.map(page => transformWordPressPage(page));
  } catch (error) {
    console.error('Error fetching WordPress pages:', error);
    return null; // Return null on error to trigger fallback
  }
}

/**
 * Fetch all pages from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressPages() {
  if (USE_GRAPHQL) {
    const graphqlPages = await fetchWordPressPagesGraphQL();
    if (graphqlPages) {
      return graphqlPages;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressPagesREST();
}

/**
 * Fetch a single page by slug from WordPress using GraphQL
 */
async function fetchWordPressPageBySlugGraphQL(slug) {
  try {
    const query = `
      query GetPage($slug: String!) {
        pageBy(slug: $slug) {
          id
          title
          slug
          date
          content
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        variables: { slug }
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data.pageBy) {
      return null;
    }

    const page = result.data.pageBy;

    return {
      id: page.id,
      title: page.title || '',
      author: page.author?.node?.name || 'Admin',
      readTime: calculateReadTime(page.content || ''),
      date: formatDate(page.date),
      slug: page.slug,
      image: page.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      content: page.content || '',
      excerpt: '', // Pages don't have excerpt in GraphQL
      link: `https://app.thetecheyrie.com/${page.slug}/`,
    };
  } catch (error) {
    console.error('Error fetching WordPress page via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch a single page by slug from WordPress API (REST fallback)
 */
async function fetchWordPressPageBySlugREST(slug) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pages?slug=${slug}&_embed`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const pages = await response.json();
    
    if (pages.length === 0) {
      return null;
    }

    return transformWordPressPage(pages[0]);
  } catch (error) {
    console.error('Error fetching WordPress page:', error);
    return null; // Return null on error to trigger fallback
  }
}

/**
 * Fetch a single page by slug from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressPageBySlug(slug) {
  if (USE_GRAPHQL) {
    const graphqlPage = await fetchWordPressPageBySlugGraphQL(slug);
    if (graphqlPage) {
      return graphqlPage;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressPageBySlugREST(slug);
}

/**
 * Helper function to extract image URL from ACF image field
 * Handles both object format (with url/source_url) and string format
 */
function extractImageUrl(imageData) {
  if (!imageData) return null;
  
  // If it's already a string URL, return it
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  // If it's an object, try to extract URL from common properties
  if (typeof imageData === 'object') {
    return imageData.url || 
           imageData.source_url || 
           imageData.sizes?.large?.url ||
           imageData.sizes?.full?.url ||
           imageData[0]?.url || // Array format
           imageData[0]?.source_url || // Array format with source_url
           null;
  }
  
  return null;
}

/**
 * Transform WordPress case study data to our app's format
 * Handles custom post type 'case_study' with ACF Pro fields
 */
export function transformWordPressCaseStudy(wpCaseStudy, featuredMedia = null) {
  // Get featured image URL
  let imageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"; // Default fallback
  if (featuredMedia && featuredMedia.source_url) {
    imageUrl = featuredMedia.source_url;
  } else if (wpCaseStudy._embedded && wpCaseStudy._embedded['wp:featuredmedia'] && wpCaseStudy._embedded['wp:featuredmedia'][0]) {
    imageUrl = wpCaseStudy._embedded['wp:featuredmedia'][0].source_url;
  } else if (wpCaseStudy.featured_media_url) {
    imageUrl = wpCaseStudy.featured_media_url;
  }

  // Extract ACF data from case_study_data object (exposed via REST API)
  const caseData = wpCaseStudy.case_study_data || {};
  
  // Get first testimonial if available
  const testimonials = caseData.testimonials || [];
  const testimonial = testimonials.length > 0 ? testimonials[0] : null;

  const listingImage =
    extractImageUrl(caseData.image) ||
    (typeof caseData.image === 'string' ? caseData.image : null) ||
    imageUrl;

  return {
    id: wpCaseStudy.id,
    slug: wpCaseStudy.slug || wpCaseStudy.post_name || '',
    title: wpCaseStudy.title?.rendered || wpCaseStudy.title || '',
    category: caseData.category || 'web-app',
    image: listingImage,
    tags: caseData.tags || [],
    badges: caseData.badges || [],
    techStack: caseData.techStack || '',
    timeline: caseData.timeline || '',
    results: caseData.results || [],
    testimonial: testimonial ? {
      avatar: extractImageUrl(testimonial.avatar) || (typeof testimonial.avatar === 'string' ? testimonial.avatar : '') || '',
      name: testimonial.name || '',
      position: testimonial.position || '',
      quote: testimonial.quote || '',
    } : null,
    buttonText: caseData.buttonText || 'VIEW PROJECT',
    buttonLink: caseData.buttonLink || `/case-studies/${wpCaseStudy.slug || wpCaseStudy.post_name || ''}`,
    wordpressUrl: wpCaseStudy.link || '',
    content: wpCaseStudy.content?.rendered || wpCaseStudy.content || '',
    excerpt: wpCaseStudy.excerpt?.rendered || wpCaseStudy.excerpt || '',
    // Detail page fields
    rating: caseData.rating || '',
    launchDate: caseData.launchDate || '',
    highlights: caseData.highlights || [],
    colorPalette: caseData.colorPalette || [],
    technologies: caseData.technologies || [],
    shortDescription: caseData.shortDescription || '',
    // Process insideLookImages - preserve structure, extract URLs if needed
    insideLookImages: (caseData.insideLookImages || []).map((img) => {
      // If image is already a string URL, use it directly
      // If it's an object, extract the URL
      const imageUrl = typeof img.image === 'string' 
        ? img.image 
        : extractImageUrl(img.image || img.url || img.screenshot);
      
      return {
        title: img.title || '',
        image: imageUrl || '', // Ensure we always return a string
      };
    }),
    overallScore: caseData.overallScore || '',
    evaluationMetrics: caseData.evaluationMetrics || [],
    juryMembers: caseData.juryMembers || [],
    collections: caseData.collections || [],
  };
}

/**
 * Fetch all case studies from WordPress using GraphQL
 * Note: GraphQL may not support custom post types by default, so this may return null
 */
async function fetchWordPressCaseStudiesGraphQL() {
  try {
    const query = `
      query GetCaseStudies {
        caseStudies(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            uri
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      // GraphQL might not have case_study post type registered, fall back to REST
      console.log('GraphQL case studies not available, will use REST API');
      return null;
    }

    // Transform GraphQL response (note: ACF fields may not be available in GraphQL)
    if (result.data.caseStudies && result.data.caseStudies.nodes) {
      return result.data.caseStudies.nodes.map(cs => ({
        id: cs.id,
        slug: cs.slug,
        title: cs.title || '',
        category: 'web-app',
        image: cs.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        tags: [],
        badges: [],
        techStack: '',
        timeline: '',
        results: [],
        testimonial: null,
        buttonText: 'VIEW PROJECT',
        buttonLink: `/case-studies/${cs.slug}`,
        wordpressUrl: wordPressPermalinkFromUri(cs.uri),
        content: cs.content || '',
      }));
    }

    return null;
  } catch (error) {
    console.error('Error fetching WordPress case studies via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch all case studies from WordPress API (REST)
 * Uses custom post type 'case_study' with rest_base 'case-studies'
 */
async function fetchWordPressCaseStudiesREST() {
  try {
    // Fetch case studies from custom post type endpoint
    const response = await fetch(
      `${WORDPRESS_API_URL}/case-studies?_embed&per_page=100&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const caseStudies = await response.json();
    
    // Transform each case study
    return caseStudies.map(cs => transformWordPressCaseStudy(cs));
  } catch (error) {
    console.error('Error fetching WordPress case studies:', error);
    return null;
  }
}

/**
 * Fetch all case studies from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressCaseStudies() {
  if (USE_GRAPHQL) {
    const graphqlCaseStudies = await fetchWordPressCaseStudiesGraphQL();
    if (graphqlCaseStudies) {
      return graphqlCaseStudies;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressCaseStudiesREST();
}

/**
 * Fetch a single case study by slug from WordPress using GraphQL
 * Note: GraphQL may not support custom post types by default
 */
async function fetchWordPressCaseStudyBySlugGraphQL(slug) {
  try {
    const query = `
      query GetCaseStudy($slug: String!) {
        caseStudyBy(slug: $slug) {
          id
          title
          slug
          uri
          date
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `;

    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        variables: { slug }
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      // GraphQL might not have case_study post type registered
      console.log('GraphQL case study not available, will use REST API');
      return null;
    }

    if (!result.data.caseStudyBy) {
      return null;
    }

    const cs = result.data.caseStudyBy;

    // Note: ACF fields may not be available in GraphQL, so we return basic data
    return {
      id: cs.id,
      slug: cs.slug,
      title: cs.title || '',
      category: 'web-app',
      image: cs.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      wordpressUrl: wordPressPermalinkFromUri(cs.uri),
      content: cs.content || '',
    };
  } catch (error) {
    console.error('Error fetching WordPress case study via GraphQL:', error);
    return null;
  }
}

/**
 * Fetch a single case study by slug from WordPress API (REST)
 * Uses custom post type 'case_study' with rest_base 'case-studies'
 */
async function fetchWordPressCaseStudyBySlugREST(slug) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/case-studies?slug=${slug}&_embed`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const caseStudies = await response.json();
    
    if (caseStudies.length === 0) {
      return null;
    }

    return transformWordPressCaseStudy(caseStudies[0]);
  } catch (error) {
    console.error('Error fetching WordPress case study:', error);
    return null;
  }
}

/**
 * Fetch a single case study by slug from WordPress API (tries GraphQL first, falls back to REST)
 */
export async function fetchWordPressCaseStudyBySlug(slug) {
  if (USE_GRAPHQL) {
    const graphqlCaseStudy = await fetchWordPressCaseStudyBySlugGraphQL(slug);
    if (graphqlCaseStudy) {
      return graphqlCaseStudy;
    }
    // Fallback to REST if GraphQL fails
    console.log('GraphQL failed, falling back to REST API');
  }
  return await fetchWordPressCaseStudyBySlugREST(slug);
}
