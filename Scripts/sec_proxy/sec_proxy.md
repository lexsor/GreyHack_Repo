# Grey Hack Scripts Index

## Script Name: sec_proxy.src
**Author:** Lexsor  
**Created:** 19 AUG 2025  
**Version:** 1.0  
**Credits:** Plu70  

### Description
Locks down a rented proxy server by securing directories, removing sensitive files, and enforcing strict permissions.  
⚠️ **Warning:** Do **not** use this script on your **home server** — it can brick it!  
This script is specifically designed for **proxy servers** and differs from the home `lock` script by **not applying g+x permissions**.

### Usage Example
```typescript
sec_proxy
```
> **Note:** Replace `x.x.x.x` and `password` in the script with your proxy server IP and password provided by the rental email before running.

### Features
- Connects to the proxy server via SSH (`get_shell.connect_service`).
- Deletes `/etc/passwd` to remove stored credentials.
- Deletes `/home` directory for security.
- Ensures `/opt` and its subdirectories exist (`seclibs`, `unseclibs`, `scripts`).
- Locks down the root filesystem permissions.
- Removes sensitive files (`Mail.txt`, `Bank.txt`) from `/root/Config/`.
- Starts an interactive terminal session after securing the proxy.

### Example Output
```
[-] Password file deleted.
[-] Home directory deleted.
[+] /opt checked/created.
[+] seclibs checked/created.
[+] unseclibs checked/created.
[+] scripts checked/created.
<b>Finished checking all directories.</b>
<b>Filesystem locked down.</b>
[-] Mail file deleted.
[-] Bank file deleted.
<b>Proxy server locked down successfully.</b>
```
