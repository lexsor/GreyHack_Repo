# Grey Hack Scripts Index

## Script Name: sshd_setup.src
**Author:** Lexsor  
**Created:** 20 AUG 2025  
**Version:** 1.0  
**Credits:** [Developer1, Developer2, etc.]  

### Description
Installs and starts the SSH service on the target system.  
This script ensures the SSH daemon is properly installed, started, and verified.  

⚠️ **Note:** Make sure `/lib/libssh.so` is present on the target system before running this script.

### Usage Example
```typescript
sshd_setup
```

### Features
- Loads the SSH library from `/lib/libssh.so`.  
- Installs the SSH service via `install_service()`.  
- Starts the SSH service via `start_service()`.  
- Verifies the SSH service is running by checking if **port 22** is active.  
- Provides clear success/failure messages at each step.  

### Example Output
```
[*] Starting SSHD setup...
[*] Installing SSH service...
[+] SSH service installed successfully.
[*] Starting SSH service...
[+] SSH service started successfully.
[*] Verifying SSH service on port 22...
[+] SSH service is active and listening on port 22.
[+] SSHD setup complete.
```
