/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fomanprint.vercel.app',
  generateRobotsTxt: true,

  exclude: [
    '/admin*',
    '/api*',
    '/checkout',
    '/login',
    '/register',
    '/orders*',
    '/profile*',
  ],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(), 
    }
  },

  additionalPaths: async (config) => {
    const result = []
    result.push(
      await config.transform(config, '/products')
    )

    return result
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/checkout',
          '/orders',
          '/profile',
        ],
      },
    ],
  },
}
