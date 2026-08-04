module.exports = {
  siteUrl: process.env.SITE_URL || 'https://flashfx.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
