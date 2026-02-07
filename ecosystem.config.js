module.exports = {
  apps: [{
    name: 'coolhub',
    script: '.next/standalone/server.js',
    cwd: '/home/appuser/coolhub',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/appuser/coolhub/logs/error.log',
    out_file: '/home/appuser/coolhub/logs/out.log',
    log_file: '/home/appuser/coolhub/logs/combined.log',
    time_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
