/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL || 'https://your-app.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*', '/onboard/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/onboard/']
      }
    ]
  }
};
