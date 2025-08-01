module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: '/home/macuna/ubb-eventapp-backend',
      script: 'java',
      args: '-jar target/eventappbackend-0.0.1-SNAPSHOT.jar'
    },
    {
      name: 'frontend',
      script: process.env.SERVE_BIN || '/usr/bin/serve',
      interpreter: 'none',
      args: '-l 1403 -s /home/macuna/ubb-eventapp-frontend/dist'
    }
  ]
}
