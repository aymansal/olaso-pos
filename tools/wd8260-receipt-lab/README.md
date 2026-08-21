# Versioned WD8260 ESC/POS Receipt Baseline

Development-only USB receipt-template lab preserved from the accepted
`D:\Olaso-escpos-lab` working copy. It is not imported by Olaso or included in
the production APK.

The WD8260 profile uses its self-test values: 72 mm / 576 dots, Font A at 48
columns, CP858 page 19, stored NV logo 1, and partial cut.

## One-time printer setup

```powershell
npm run build:nv-logo
npm run install:nv-logo -- -PrinterName '<Windows USB queue>'
```

The install command replaces the printer's existing NV images. The normal
receipt recalls the stored OLASO logo and does not retransmit its pixels.

## Iterate

```powershell
npm run build
npm run check
npm run print:usb -- -PrinterName '<Windows USB queue>'
```

Generated preview, text, and RAW ESC/POS files are written to ignored `out/`.
`npm run check` regenerates them and compares every accepted binary/text result
with the reviewed fixtures in `fixtures/`.

The queue name is intentionally supplied at execution time and is not part of
the versioned baseline. USB remains the standalone desktop test path; the
production Android transport is LAN and lives outside this tool.

## Development LAN proof

After the printer address and raw TCP port are physically configured and
measured, send the reviewed golden receipt without involving application
checkout:

```powershell
npm run print:lan -- --host <printer-ipv4> --port <raw-port>
```

Optional bounds are `--connect-timeout-ms`, `--write-timeout-ms`, and `--path`.
The command reports only the TCP connection and bytes accepted by the socket.
It never claims the printer produced paper; inspect the receipt separately.
