// The site is served at https://bhavipriyanka.com/reception. Set this to '' if it
// ever moves to the root of its domain.
const basePath = '/reception';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath,
    // Next prefixes its own files with basePath, but not plain <img>/<audio> src
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
