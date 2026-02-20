/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "mrhalwai.in",
            "backend.mrhalwai.in",
            "localhost",
        ],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "192.168.29.98",
                port: "8000",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;