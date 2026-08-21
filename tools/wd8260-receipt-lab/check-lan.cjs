const assert = require('node:assert/strict');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { parseArguments, sendRawTcp } = require('./print-lan.cjs');

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server.address().port;
}

async function close(server) {
  await new Promise((resolve, reject) => {
    server.close(error => (error ? reject(error) : resolve()));
  });
}

async function main() {
  assert.throws(() => parseArguments([]), /--host must be an IPv4 address/);
  assert.throws(
    () => parseArguments(['--host', 'printer.local', '--port', '9100']),
    /--host must be an IPv4 address/,
  );
  assert.throws(
    () => parseArguments(['--host', '127.0.0.1', '--port', '0']),
    /--port must be an integer from 1 to 65535/,
  );

  const payload = fs.readFileSync(path.join(__dirname, 'fixtures', 'receipt.bin'));
  let received = Buffer.alloc(0);
  const server = net.createServer(socket => {
    socket.on('data', chunk => {
      received = Buffer.concat([received, chunk]);
    });
    socket.on('end', () => socket.end());
  });
  const port = await listen(server);
  const result = await sendRawTcp({
    host: '127.0.0.1',
    port,
    payload,
    connectTimeoutMs: 1000,
    writeTimeoutMs: 1000,
  });
  await close(server);

  assert.deepEqual(received, payload, 'LAN probe must preserve every golden byte');
  assert.equal(result.bytesWritten, payload.length);
  assert.equal(result.paperConfirmed, false);

  const closedServer = net.createServer();
  const closedPort = await listen(closedServer);
  await close(closedServer);
  await assert.rejects(
    sendRawTcp({
      host: '127.0.0.1',
      port: closedPort,
      payload,
      connectTimeoutMs: 1000,
      writeTimeoutMs: 1000,
    }),
    error => error.code === 'ECONNREFUSED',
  );

  console.log('WD8260 LAN probe validation, byte, and connection checks passed');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
