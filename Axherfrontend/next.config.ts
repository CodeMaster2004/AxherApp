import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  
  images: {
    
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      
    ],
    dangerouslyAllowLocalIP: true,
  },
  
};

export default withNextIntl(nextConfig);
