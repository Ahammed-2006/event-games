module.exports = {
  apps: [
    {
      name: 'debug-arena-server',
      script: './dist/server.js',
      cwd: './server',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
