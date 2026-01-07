/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fomanprint.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/api*', '/checkout', '/login', '/register', '/orders*', '/profile*'], // Exclude non-SEO pages
  additionalPaths: async (config) => {
    const result = []
    // Explicitly include dynamic pages that might be missed
    result.push(await config.transform(config, '/products'))
    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private', '/checkout', '/orders', '/profile'],
      },
    ],
  },
}
