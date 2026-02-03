/** @type {import('next').NextConfig} */
const nextConfig = {
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
      }
      
     
     
    ],
  },
};

export default nextConfig;
