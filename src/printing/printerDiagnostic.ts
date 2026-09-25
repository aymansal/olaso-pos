const encoder = new TextEncoder();

export function createPrinterTestBytes() {
  return Uint8Array.from([
    0x1b, 0x40,
    0x1b, 0x74, 0x13,
    0x1b, 0x61, 0x01,
    ...encoder.encode('ATELIKA PRINTER TEST\nNOT A SALE\nLAN SETTINGS CONNECTION\n'),
    0x1b, 0x61, 0x00,
    ...encoder.encode('\nTest data sent - confirm paper\n\n\n'),
    0x1d, 0x56, 0x42, 0x00,
  ]);
}
