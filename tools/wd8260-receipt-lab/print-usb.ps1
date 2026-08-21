param(
    [Parameter(Mandatory = $true)]
    [string]$PrinterName,
    [string]$Path
)

$ErrorActionPreference = 'Stop'

if (-not $Path) {
    $Path = Join-Path $PSScriptRoot 'out\receipt.bin'
}

$resolvedPath = (Resolve-Path -LiteralPath $Path).Path
if (-not (Get-Printer -Name $PrinterName -ErrorAction SilentlyContinue)) {
    throw "Printer queue '$PrinterName' was not found."
}

Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class RawPrinter
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private class DOC_INFO_1
    {
        public string pDocName;
        public string pOutputFile;
        public string pDataType;
    }

    [DllImport("winspool.drv", EntryPoint = "OpenPrinterW", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern bool OpenPrinter(string printerName, out IntPtr printer, IntPtr defaults);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool ClosePrinter(IntPtr printer);

    [DllImport("winspool.drv", EntryPoint = "StartDocPrinterW", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern int StartDocPrinter(IntPtr printer, int level, [In] DOC_INFO_1 docInfo);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndDocPrinter(IntPtr printer);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool StartPagePrinter(IntPtr printer);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndPagePrinter(IntPtr printer);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool WritePrinter(IntPtr printer, byte[] bytes, int count, out int written);

    private static void ThrowLastError(string operation)
    {
        throw new Win32Exception(Marshal.GetLastWin32Error(), operation);
    }

    public static void Send(string printerName, byte[] bytes)
    {
        IntPtr printer = IntPtr.Zero;
        bool documentStarted = false;
        bool pageStarted = false;

        if (!OpenPrinter(printerName, out printer, IntPtr.Zero)) ThrowLastError("OpenPrinter failed");

        try
        {
            var document = new DOC_INFO_1 {
                pDocName = "WD8260 ESC/POS Template V2",
                pDataType = "RAW"
            };

            if (StartDocPrinter(printer, 1, document) == 0) ThrowLastError("StartDocPrinter failed");
            documentStarted = true;
            if (!StartPagePrinter(printer)) ThrowLastError("StartPagePrinter failed");
            pageStarted = true;
            int written;
            if (!WritePrinter(printer, bytes, bytes.Length, out written)) ThrowLastError("WritePrinter failed");
            if (written != bytes.Length) throw new InvalidOperationException(string.Format("Only {0} of {1} bytes were written.", written, bytes.Length));
        }
        finally
        {
            if (pageStarted) EndPagePrinter(printer);
            if (documentStarted) EndDocPrinter(printer);
            if (printer != IntPtr.Zero) ClosePrinter(printer);
        }
    }
}
'@

$bytes = [System.IO.File]::ReadAllBytes($resolvedPath)
[RawPrinter]::Send($PrinterName, $bytes)
Write-Host "Sent $($bytes.Length) RAW ESC/POS bytes to '$PrinterName' through USB."
