module.exports = {
    apps : [
        {
          name: "main",
          script: "./dist/main",
          watch: true,
          env: {
              "NODE_ENV": "development"
          },
          env_production: {
              "NODE_ENV": "production",
          }
        }
    ]
  }