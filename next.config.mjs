/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/daz08hbas/**',
        },
      ],
    },
    // Otras configuraciones...
  };
  
  export default nextConfig;