import type { NextConfig } from "next";

/*
  Product images are served by the Magento instance, whose host changes
  between staging and production. Deriving the allow-list from the same
  setting the GraphQL client uses keeps the two from drifting apart — a
  hard-coded hostname here would silently block every image the day the
  backend moves.

  `images.domains` is deprecated in Next 16; `remotePatterns` is the
  supported form. See
  node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md.
*/
function magentoImagePattern() {
  const raw = process.env.MAGENTO_BACKEND_URL?.trim();

  if (!raw) return [];

  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);

    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        /* Magento serves catalogue images from here and nothing else. */
        pathname: "/media/**",
      },
    ];
  } catch {
    /*
      A malformed value is reported by the GraphQL client at request time with
      a far better message. Failing the build here would only hide it.
    */
    return [];
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: magentoImagePattern(),
  },
};

export default nextConfig;
