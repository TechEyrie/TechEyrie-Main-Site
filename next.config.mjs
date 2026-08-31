/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent /eagle-project-1/ ⇄ /eagle-project-1 redirect fights (stuck loader)
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // Noomo storytelling SPA entry + client routes
      { source: "/eagle-project", destination: "/eagle-project/index.html" },
      { source: "/eagle-project/", destination: "/eagle-project/index.html" },
      {
        source: "/eagle-project/contacts",
        destination: "/eagle-project/index.html",
      },
      {
        source: "/eagle-project/contacts/",
        destination: "/eagle-project/index.html",
      },

      // Copy of eagle-project for experiments
      {
        source: "/eagle-project-1",
        destination: "/eagle-project-1/index.html",
      },
      {
        source: "/eagle-project-1/",
        destination: "/eagle-project-1/index.html",
      },
      {
        source: "/eagle-project-1/contacts",
        destination: "/eagle-project-1/index.html",
      },
      {
        source: "/eagle-project-1/contacts/",
        destination: "/eagle-project-1/index.html",
      },

      // Isolated eagle on white — no UI
      {
        source: "/eagle-project-2",
        destination: "/eagle-project-2/index.html",
      },
      {
        source: "/eagle-project-2/",
        destination: "/eagle-project-2/index.html",
      },
      {
        source: "/eagle-project-2/models/:path*",
        destination: "/eagle-project/models/:path*",
      },
      {
        source: "/eagle-project-2/textures/:path*",
        destination: "/eagle-project/textures/:path*",
      },
      {
        source: "/eagle-project-2/audio/:path*",
        destination: "/eagle-project/audio/:path*",
      },
      {
        source: "/eagle-project-2/timelines/:path*",
        destination: "/eagle-project/timelines/:path*",
      },
      {
        source: "/eagle-project-2/libs/:path*",
        destination: "/eagle-project/libs/:path*",
      },
      {
        source: "/eagle-project-2/images/svg/:path*",
        destination: "/eagle-project/images/svg/:path*",
      },
      {
        source: "/eagle-project-2/images/text_icons/:path*",
        destination: "/eagle-project/images/text_icons/:path*",
      },
      {
        source: "/eagle-project-2/images/loader.gif",
        destination: "/eagle-project/images/loader.gif",
      },

      // eagle-project-3 — white background eagle
      {
        source: "/eagle-project-3",
        destination: "/eagle-project-3/index.html",
      },
      {
        source: "/eagle-project-3/",
        destination: "/eagle-project-3/index.html",
      },
      {
        source: "/eagle-project-3/models/:path*",
        destination: "/eagle-project/models/:path*",
      },
      {
        source: "/eagle-project-3/textures/:path*",
        destination: "/eagle-project/textures/:path*",
      },
      {
        source: "/eagle-project-3/audio/:path*",
        destination: "/eagle-project/audio/:path*",
      },
      {
        source: "/eagle-project-3/timelines/:path*",
        destination: "/eagle-project/timelines/:path*",
      },
      {
        source: "/eagle-project-3/libs/:path*",
        destination: "/eagle-project/libs/:path*",
      },
      {
        source: "/eagle-project-3/images/svg/:path*",
        destination: "/eagle-project/images/svg/:path*",
      },
      {
        source: "/eagle-project-3/images/text_icons/:path*",
        destination: "/eagle-project/images/text_icons/:path*",
      },
      {
        source: "/eagle-project-3/images/loader.gif",
        destination: "/eagle-project/images/loader.gif",
      },

      // eagle-project-4 — full Noomo hero clone (same assets via rewrites below)
      {
        source: "/eagle-project-4",
        destination: "/eagle-project-4/index.html",
      },
      {
        source: "/eagle-project-4/",
        destination: "/eagle-project-4/index.html",
      },
      {
        source: "/eagle-project-4/models/:path*",
        destination: "/eagle-project/models/:path*",
      },
      {
        source: "/eagle-project-4/textures/:path*",
        destination: "/eagle-project/textures/:path*",
      },
      {
        source: "/eagle-project-4/audio/:path*",
        destination: "/eagle-project/audio/:path*",
      },
      {
        source: "/eagle-project-4/timelines/:path*",
        destination: "/eagle-project/timelines/:path*",
      },
      {
        source: "/eagle-project-4/libs/:path*",
        destination: "/eagle-project/libs/:path*",
      },
      {
        source: "/eagle-project-4/images/svg/:path*",
        destination: "/eagle-project/images/svg/:path*",
      },
      {
        source: "/eagle-project-4/images/text_icons/:path*",
        destination: "/eagle-project/images/text_icons/:path*",
      },
      {
        source: "/eagle-project-4/images/loader.gif",
        destination: "/eagle-project/images/loader.gif",
      },
      {
        source: "/eagle-project-4/images/menu_back.jpg",
        destination: "/eagle-project/images/menu_back.jpg",
      },

      // Original absolute asset roots → isolated public/eagle-project tree
      { source: "/_nuxt/:path*", destination: "/eagle-project/_nuxt/:path*" },
      {
        source: "/textures/:path*",
        destination: "/eagle-project/textures/:path*",
      },
      { source: "/audio/:path*", destination: "/eagle-project/audio/:path*" },
      {
        source: "/timelines/:path*",
        destination: "/eagle-project/timelines/:path*",
      },
      { source: "/libs/:path*", destination: "/eagle-project/libs/:path*" },
      {
        source: "/wasm---wasm/:path*",
        destination: "/eagle-project/wasm---wasm/:path*",
      },
      { source: "/fav.png", destination: "/eagle-project/fav.png" },

      // Eagle-only image paths (do not blanket-rewrite /images — app uses it)
      {
        source: "/images/svg/:path*",
        destination: "/eagle-project/images/svg/:path*",
      },
      {
        source: "/images/text_icons/:path*",
        destination: "/eagle-project/images/text_icons/:path*",
      },
      {
        source: "/images/loader.gif",
        destination: "/eagle-project/images/loader.gif",
      },
      {
        source: "/images/menu_back.jpg",
        destination: "/eagle-project/images/menu_back.jpg",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
 
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.datocms-assets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "app.thetecheyrie.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "app.thetecheyrie.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wearebrain.com",
        port: "",
        pathname: "/**",
      },
      {
        
        protocol: "https",
        hostname: "stream.mux.com",
        port: "",
        pathname: "/**",
      },
       {
        
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        port: "",
        pathname: "/**",
      },

      {
        
        protocol: "https",
        hostname: "icomat.cdn.prismic.io",
        port: "",
        pathname: "/**",
      },



  
    
      
     
     
    ],
  },
};

export default nextConfig;
