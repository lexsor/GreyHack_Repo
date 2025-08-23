# Grey Hack Scripts Index

## Script Name: lib_check.src
**Author:** Lexsor  
**Created:** 21 AUG 2025  
**Version:** 1.0  
**Credits:** Plu70  

### Description
Checks if required libraries exist in `/lib/` and displays their versions using `metaxploit.so`.

### Usage Example
```typescript
lib_check
```

### Dependencies
- `/lib/metaxploit.so` *(required for version checking)*
- Libraries checked:
  - libssh.so
  - libhttp.so
  - librshell.so
  - aptclient.so
  - net.so
  - init.so
  - kernel_module.so
  - kernel_router.so

### Example Output
```
Library          Version
libssh.so       v1.2.0
libhttp.so      v2.4.1
librshell.so    v1.1.3
aptclient.so    v3.0.0
net.so          v1.0.2
init.so         v1.0.0
kernel_module.so v2.1.5
kernel_router.so v2.2.0
```
