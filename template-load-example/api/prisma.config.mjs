export default {
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: 'prisma/schema.prisma',
  },
  datasources: [
    {
      provider: 'sqlite',
      url: process.env.DATABASE_URL,
    },
  ],
};

