# Grey Hack Scripts Index

## Script Name: sec_router.src
**Author:** Lexsor  
**Created:** 20 AUG 2025  
**Version:** 1.0  
**Credits:** maho_citrus  

### Description
Secures a router by generating a strong random root password, verifying it, locking down the filesystem, and removing unnecessary files and directories.  
This script is specialized for router hardening and differs from the `lock` and `sec_proxy` scripts.

### Usage Example
```typescript
sec_router
```
> **Note:** The script auto-generates a random 15-character root password and applies it to the router.

### Features
- **Random Password Generation**  
  Creates a secure 15-character alphanumeric password for the root account and verifies the stored MD5 hash against the generated password.  

- **Filesystem Lockdown**  
  - Sets root ownership and permissions on `/`.  
  - Revokes unnecessary permissions for users, groups, and others.  

- **Directory Cleanup**  
  Removes critical directories no longer needed for router security:  
  - `/usr`  
  - `/home`  
  - `/Public`  

- **Binary Cleanup**  
  Deletes common utilities from `/bin` such as:  
  `ln, man, apt-get, whoami, passwd, touch, userdel, useradd, sudo, chmod, rmdir, mkdir, cp, mv, rm, cat, pwd, ping, ifconfig`  

- **Miscellaneous Cleanup**  
  Removes additional potentially exploitable files:  
  - `/lib/libhttp.so`  
  - `/server/httpd`  
  - `/server/conf/httpd.conf`  
  - `/root/sshd_setup`  
  - `/root/sec_router`  

### Example Output
```
[*] Generated random password: A7tX9YqLp2mBc3D
[*] Setting root password...
[+] Root password verified successfully.
[+] Root filesystem permissions locked down.
[+] Directories removed.
[+] Deleted /bin/ln
[+] Deleted /bin/man
...
[+] Deleted /bin/ifconfig
[+] Unused programs removed.
[+] Deleted /lib/libhttp.so
[+] Deleted /server/httpd
[+] Deleted /server/conf/httpd.conf
[+] Deleted /root/sshd_setup
[+] Deleted /root/sec_router
Filesystem locked down.
ssh root@<generated_password> <routerIP> 22
```
