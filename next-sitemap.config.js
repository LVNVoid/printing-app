/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fomanprint.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/api*'], // Exclude admin and api routes from sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
      },
    ],
  },
}
