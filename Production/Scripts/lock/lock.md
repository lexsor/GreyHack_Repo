# Grey Hack Scripts Index

## Script Name: lock.src
**Author:** Lexsor  
**Created:** 19 AUG 2025  
**Version:** 1.0  
**Credits:** Plu70  

### Description
Locks down the home server by securing directories, removing sensitive files, setting proper permissions, and hardening the filesystem.  
⚠️ **Warning:** Do **not** use this script on a Proxy! It can potentially brick your machine.

### Usage Example
```typescript
lock
```

### Features
- Deletes `/etc/passwd` to remove stored credentials.
- Deletes `/home/guest` if it exists.
- Ensures `/opt` and its subdirectories exist (`seclibs`, `unseclibs`, `scripts`).
- Locks down the root filesystem permissions.
- Ensures critical executables remain accessible (`sudo`, `ssh`, `Terminal.exe`, `Mail.exe`, `Chat.exe`).
- Deletes sensitive files such as `Mail.txt` and `Bank.txt` from `/root/Config/`.

### Example Output
```
[-] Password file deleted.
[-] Guest directory deleted.
[+] /opt checked/created.
[+] seclibs checked/created.
[+] unseclibs checked/created.
[+] scripts checked/created.
Finished checking all directories.
Filesystem locked down.
[-] Mail file deleted.
[-] Bank file deleted.
<b>Home server secured.</b>
```
