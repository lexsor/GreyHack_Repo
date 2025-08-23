# Grey Hack Scripts Index

## Script Name: rshell_install.src
**Author:** Lexsor  
**Created:** 20 AUG 2025  
**Version:** 1.0  

### Description
Installs a reverse shell client on the target system using the `metaxploit.so` library.  
This is a **utility code block** meant for establishing remote access via a reverse shell.

### Usage Example
```typescript
rshell_install
```

### Features
- Retrieves the router's public IP using `get_router.public_ip`.  
- Uses the `metaxploit.so` library to execute `rshell_client` with the following parameters:  
  - Target IP: `routerIP`  
  - Port: `1222`  
  - Username: `adminaccess`  

### Example Code Block
```greyscript
routerIP = get_router.public_ip

metax = include_lib("/lib/metaxploit.so")
metax.rshell_client(routerIP, 1222, "adminaccess")
```
