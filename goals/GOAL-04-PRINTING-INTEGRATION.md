# Goal 04 Planning Brief — Android ESC/POS Printing Integration

## Status

**Status:** queued for discovery; not activation-ready

Goal 04 will connect an already committed local sale to the accepted Olaso
ESC/POS receipt through the Android application boundary. It is scheduled
before management reporting because physical receipt production and recovery
are part of the critical cashier path.

## Confirmed boundary

- Printing starts only after the local sale commits.
- Reprinting uses the saved immutable receipt and never creates another sale or
  stock deduction.
- React calls one transport-independent `printReceipt` operation.
- Native Capacitor/Kotlin code owns ESC/POS bytes, connection handling, timeout,
  reconnect, and Android permissions.
- The accepted 80 mm receipt layout and printer-resident OLASO logo work remain
  inputs; the application does not recreate receipt design by trial and error.
- USB desktop tests do not prove Android LAN, USB, or Bluetooth transport.

## Discovery required before the execution plan

- Confirm the WDLink printer's actual raw-network protocol/port and static/DHCP
  configuration from the physical tablet network.
- Prove a minimal Android-to-printer raw-byte test without involving checkout.
- Locate and audit the accepted receipt-template source, binary asset format,
  printer-logo storage commands, and power-cycle evidence.
- Decide the supported production transport from measured hardware evidence;
  implement one transport, not speculative USB/Bluetooth/LAN abstractions.
- Define printer configuration ownership, validation, timeout, paper-out/error
  reporting, retry, reprint, and endurance acceptance.

After discovery, replace this brief with a card-by-card goal plan and start
prompt. Do not activate Goal 04 from this file.
