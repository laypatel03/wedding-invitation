// The site is served at http://SERVER_IP/wedding. Set this to '' once it
// has its own domain and lives at the root.
const basePath = '/wedding';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Build to plain HTML/CSS/JS in out/ so any web server can host it (no Node needed)
    output: 'export',
    basePath,
    // Next prefixes its own files with basePath, but not plain <img>/<audio> src
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
