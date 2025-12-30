module.exports = {
  apps: [
    {
      name: 'nestjs-api',
      script: 'dist/main.js',
      cwd: '/var/www/api',

      exec_mode: 'fork',
      instances: 1,

      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        UPLOADS_DIR: '/var/www/uploads',
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 30303,
        UPLOADS_DIR: '/var/www/uploads',
      },

      autorestart: true,
      watch: false,
      max_memory_restart: '300M',

      error_file: '/var/log/pm2/nestjs-api-error.log',
      out_file: '/var/log/pm2/nestjs-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      kill_timeout: 5000,
      listen_timeout: 5000,
      node_args: '--enable-source-maps',
    },
  ],
};