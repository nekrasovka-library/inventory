module.exports = {
  apps: [
    {
      name: "extranet.inventory",
      script: "serve",
      log_date_format: "DD-MM-YYYY hh:mm",
      env_production: {
        PM2_SERVE_PATH: "build",
        PM2_SERVE_PORT: 3012,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
    },
  ],
  deploy: {
    test: {
      user: "superuser",
      host: "10.10.0.37",
      ref: "origin/main",
      path: "/var/www/extranet.inventory",
      repo: "git@github.com:nekrasovka-library/inventory.git",
      "post-deploy":
        "npm i && npm run build && pm2 reload ecosystem.config.js --env production",
    },
  },
};
