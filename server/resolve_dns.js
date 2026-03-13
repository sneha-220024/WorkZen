const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.mri7fow.mongodb.net', (err, addresses) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(addresses, null, 2));
});
