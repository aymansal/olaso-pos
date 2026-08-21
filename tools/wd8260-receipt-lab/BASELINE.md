# Accepted baseline

The source and fixtures in this directory were copied from the unchanged
`D:\Olaso-escpos-lab` reference on 21 August 2026.

The accepted receipt is 80 mm on the WDLink WD8260: 72 mm / 576 dots, Font A
at 48 columns, CP858 page 19, four normal full-width separators, one `MAD`
heading, French/English footer, no QR or example URL, stored logo recall, and
partial cut.

## Reviewed golden fixture SHA-256

| Fixture | Bytes | SHA-256 |
| --- | ---: | --- |
| `receipt.bin` | 1814 | `3906AA93B1C60BBE876BA2B1040E51A49301B17B0DF905CC52889C3636B279C7` |
| `receipt.txt` | 840 | `76031E05D4A134E8F4299EE8DD28A2DF13B9E96140A0D04B775685EE10C5BCCC` |
| `logo-size-test.bin` | 7992 | `036145AB15103A399D0069B5710332E08B9EA98BB4DCFDD6972FFACE21B018BC` |
| `nv-logo-write.bin` | 2441 | `D5D3B835800970D7F81BD188311EC766DCF4F0867F2E9B697C227AD9F9818C76` |
| `nv-logo-recall.bin` | 16 | `7C46D82303050D0A12EBC29B73C5E13CB8055B5658CEE752E6EC3E815B0AF324` |

The physical baseline also established that the 300-dot logo in WD8260 NV
image slot 1 remains available after printer power cycling. The printer cannot
truthfully report stored-image integrity through this USB RAW path; proof is a
successful recall print and paper inspection.
