require('../bootstrap')

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  storage: './__tests__/meetapp_testing.sqlite',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
