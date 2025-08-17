/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/jobspy/:path*",
                destination: "http://18.207.112.172:5000/jobs/:path*",
                // destination: "https://api.diggilabs.diggisys.com/jobs/:path*",
                // destination: "http://localhost:5000/jobs/:path*",
            },
        ];
    },
};

export default nextConfig;
