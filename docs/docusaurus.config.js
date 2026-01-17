module.exports = {
  title: 'CentaurTechnicalIndicators-JS',
  tagline: 'JavaScript Technical Indicator package',
  url: 'https://ChironMind.github.io',
  baseUrl: '/CentaurTechnicalIndicators-JS/',
//  favicon: 'img/favicon.ico',
  organizationName: 'ChironMind', 
  projectName: 'CentaurTechnicalIndicators-JS', 
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
		routeBasePath: '/',
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'CentaurTechnicalIndicators-JS',
//      logo: {
  //      alt: 'Site Logo',
    //    src: 'img/logo.svg',
      //},
      items: [
        {label: 'Tutorials', to: '/tutorials', position: 'left'},
        {label: 'How-To', to: '/howto', position: 'left'},
        {label: 'API', href: '/api', position: 'left'},
	{
          href: 'https://github.com/chironmind/CentaurTechnicalIndicators-JS',
          label: 'GitHub',
          position: 'right'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Tutorials', to: '/tutorials'},
            {label: 'How-To', to: '/howto'},
            {label: 'API', href: '/api'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/chironmind/CentaurTechnicalIndicators-JS'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CentaurTechnicalIndicators-JS.`,
    },
  },
};
