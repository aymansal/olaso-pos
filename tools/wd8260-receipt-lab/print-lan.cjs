const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

class LanProbeError extends Error {
  constructor(code, message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = 'LanProbeError';
    this.code = code;
  }
}

function readOption(args, name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new LanProbeError('INVALID_ARGUMENT', `${name} requires a value.`);
  }
  return value;
}

function parseInteger(value, name, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new LanProbeError(
      'INVALID_ARGUMENT',
      `${name} must be an integer from ${minimum} to ${maximum}.`,
    );
  }
  return parsed;
}

function parseArguments(args) {
  const host = readOption(args, '--host');
  if (!host || net.isIP(host) !== 4) {
    throw new LanProbeError('INVALID_ARGUMENT', '--host must be an IPv4 address.');
  }

  return {
    host,
    port: parseInteger(readOption(args, '--port'), '--port', 1, 65535),
    connectTimeoutMs: parseInteger(
      readOption(args, '--connect-timeout-ms', '2000'),
      '--connect-timeout-ms',
      100,
      30000,
    ),
    writeTimeoutMs: parseInteger(
      readOption(args, '--write-timeout-ms', '2000'),
      '--write-timeout-ms',
      100,
      30000,
    ),
    payloadPath: path.resolve(
      __dirname,
      readOption(args, '--path', 'fixtures/receipt.bin'),
    ),
  };
}

function sendRawTcp({ host, port, payload, connectTimeoutMs, writeTimeoutMs }) {
  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const socket = net.createConnection({ host, port });
    let connectedAt;
    let settled = false;

    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve(result);
    };

    const connectTimer = setTimeout(() => {
      finish(
        new LanProbeError(
          'CONNECT_TIMEOUT',
          `TCP connection to ${host}:${port} timed out after ${connectTimeoutMs} ms.`,
        ),
      );
    }, connectTimeoutMs);

    socket.setNoDelay(true);
    socket.once('connect', () => {
      clearTimeout(connectTimer);
      connectedAt = performance.now();
      socket.setTimeout(writeTimeoutMs);
      socket.end(payload, () => {
        finish(null, {
          host,
          port,
          bytesWritten: payload.length,
          connectMs: Math.round(connectedAt - startedAt),
          totalMs: Math.round(performance.now() - startedAt),
          paperConfirmed: false,
        });
      });
    });
    socket.once('timeout', () => {
      finish(
        new LanProbeError(
          connectedAt ? 'WRITE_TIMEOUT' : 'CONNECT_TIMEOUT',
          `TCP ${connectedAt ? 'write' : 'connection'} to ${host}:${port} timed out.`,
        ),
      );
    });
    socket.once('error', error => {
      clearTimeout(connectTimer);
      finish(
        new LanProbeError(
          error.code || 'SOCKET_ERROR',
          `TCP ${host}:${port} failed: ${error.message}`,
          error,
        ),
      );
    });
  });
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const payload = fs.readFileSync(options.payloadPath);
    const result = await sendRawTcp({ ...options, payload });
    console.log(JSON.stringify({ ...result, payloadPath: options.payloadPath }));
    console.log('TCP write completed. Confirm paper separately.');
  } catch (error) {
    console.error(`${error.code || 'UNKNOWN'}: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { LanProbeError, parseArguments, sendRawTcp };

if (require.main === module) main();
