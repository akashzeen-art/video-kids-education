module.exports = {
  apps: [
    {
      name: "videokidseducation",
      cwd: "/var/www/vasnumero/videokidseducation",
      script: "dist/server/node-build.mjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
