# Grey Hack Scripts Index

## Script Name: newhackshop.src
**Author:** maho_citrus  
**Version:** 1.0  
**Credits:** maho_citrus  

### Description
Generates a random valid IP address that points to a hackshop with an active repository service.  
The script continuously generates random IPs, checks if they belong to valid routers or switches, and verifies if they are hosting a repository service. Once found, the IP is returned.

### Usage Example
```typescript
newhackshop
```

### Features
- **Random IP Generation**  
  Generates valid public IP addresses (ignores invalid and LAN IPs).

- **Router/Switch Detection**  
  Attempts to resolve the IP to a router (`get_router`) or a switch (`get_switch`).

- **Repository Service Check**  
  Iterates through connected LAN devices and checks open ports for a `repository` service.

- **Loop Until Success**  
  Runs continuously until it finds a valid hackshop IP, then exits with the result.

### Example Output
```
203.45.112.87
```
