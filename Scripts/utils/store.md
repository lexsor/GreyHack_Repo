# Grey Hack Scripts Index

## Script Name: store.src
**Author:** Lexsor  
**Created:** 20 AUG 2025  
**Version:** 1.0  

### Description
Scans random public IP addresses to locate:  
- **Hack Shops** (identified by the `repository` service)  
- **Banks** (identified by the `bank_account` service)  

The script attempts up to 500 random IPs and outputs discovered services. Currently it looks for bank and shop services.

### Usage Example
```typescript
store
```

### Features
- **Random IP Generation**  
  Generates valid public IP addresses, skipping invalid and LAN IPs.  

- **Hack Shop Finder**  
  Searches for routers hosting devices with the `repository` service.  

- **Bank Finder**  
  Searches for routers hosting devices with the `bank_account` service.  

- **Loop Limit**  
  Prevents infinite loops by limiting to `MAX_ATTEMPTS` (default: 500).  

- **End Summary**  
  Displays Hack Shop and Bank IPs found during execution.  

### Example Output
```
Scanning for Hack Shop...
Hack Shop Found: 203.45.112.87

Scanning for Bank...
Bank Found: 198.76.54.12

--- FOUND SERVICES ---
Hack Shop -> 203.45.112.87
Bank -> 198.76.54.12
```
