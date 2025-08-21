# Security for Router

## Security Tips

- These tips are not only related to doom, but also in general
- Never, ever run any kind of service (rshell, HTTP, SSH) on your own home PC.
- To access site leave logs, please avoid using your home IP and instead use a proxy. If you need to access from home, change the WiFi network and use an IP address instead.
- Players often monitor multiple sites or act as honeypots, which is how they typically find you. Therefore, follow the previous tip.
- Get a private home network so you can secure the router with good libraries that have no exploitable vulnerabilities.
- /usr, /bin, /home, /root are non-essential folders on routers, and they can create vulnerabilities, so to secure the router, you can delete them (if you use a tool that can run commands without the need to use the router terminal directly).
- For local libs ([init.so](http://init.so/), [net.so](http://net.so/)), the lowest version possible, or a version that doesn't meet any exploit requirement for your remote libs.
- Secure your system's permissions so that only root-level operations are possible. However, grant run permission to other user types, such as Terminal.exe and sudo, to avoid locking yourself out and to allow for root escalation on the system.
- Check your bank balance with ConfigLan.exe to delete your Bank.txt file, eliminating the need to check from a bank site.
- Don't post screenshots of your screen during multiplayer without checking if they contain sensitive information (public IPs, domains, emails, etc.).

## Doom security tips

- Check proxy tip
- Use dtop on a different terminal to monitor your system (and even your router) for changes that may not be you making.
- If you corrupt your log or your router's log, Dtop can detect when the log is restored, either due to hacking or the triggering of a new connection. So when you're already on your proxies, you can corrupt the logs and monitor with dtop. Monitor your router that way, too.

It is essential to replace the Libraries with secure versions and set up an SSH service for future connections on the router.

## SSHD Install

```tsx
// File: sshd_setup.src
// Purpose: Installs and starts the SSH service using /lib/libssh.so
// Note: Make sure /lib/libssh.so is present on the target system

main = function()
    print("[*] Starting SSHD setup...")

    // Load the SSH service library
    sshd = include_lib("/lib/libssh.so")
    if not sshd then
        exit("[-] Failed to load /lib/libssh.so. Ensure the library is present.")
    end if

    // Install the SSH service
    print("[*] Installing SSH service...")
    result = sshd.install_service()
    if typeof(result) == "string" and result != "" then
        print("[-] install_service() returned: " + result)
        exit("[-] SSH service installation failed.")
    else
        print("[+] SSH service installed successfully.")
    end if

    // Start the SSH service
    print("[*] Starting SSH service...")
    result = sshd.start_service()
    if typeof(result) == "string" and result != "" then
        print("[-] start_service() returned: " + result)
        exit("[-] SSH service failed to start.")
    else
        print("[+] SSH service started successfully.")
    end if

    // Verify SSH service by checking if port 22 is active
    print("[*] Verifying SSH service on port 22...")
    router = get_router
    ports = get_shell.host_computer.get_ports
    ssh_active = false

    for port in ports
        if port.port_number == 22 then
            ssh_active = true
            break
        end if
    end for

    if ssh_active then
        print("<b>[+] SSH service is active and listening on port 22.</b>")
    else
        print("<b>[x] Warning: Could not verify SSH service on port 22. Check manually.</b>")
    end if

    print("<b>[+] SSHD setup complete.</b>")
end function

main()

```

## Secure Router Automated script

```tsx
// =======================================================
// secure_router
// - Secure permissions on root filesystem
// - Do NOT run this on Proxy or PC to Prevent accidental bricking
// - Thanks to: @rocketorbit
// =======================================================

routerIP = get_router.local_ip
routerShell = get_shell.host_computer

if not routerShell then
    exit("Could not get host_computer shell")
end if

// =======================================================
// Generate a random 15-character password
// =======================================================
generate_password = function()
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    pass = ""
    length = 15
    
    while length > 0
        pass = pass + charset[floor(rnd * 62)]
        length = length - 1
    end while
    
    return pass
end function

// =======================================================
// 1) Set deterministic root password
// =======================================================
password = generate_password()
print("[*] Generated random password: " + password)
expectedHash = md5(str(password))

print("[*] Setting root password...")
routerShell.change_password("root", password)

// Verify password by reading /etc/passwd
pwf = routerShell.File("/etc/passwd")

if pwf != null then
		content = get_content(pwf)

// Extract the hash from /etc/passwd using split and slice
    split_list = content.split(":")
    pwf_hash = split_list[1]

    // Compare expected vs stored hash
    if pwf_hash == expectedHash then
        print("<b>[+] Root password verified successfully.</b>")
        pwf.delete
    else
        print("[x] Root password hash does not match expected value!")
    end if
else
    print("[x] /etc/passwd not found!")
end if

// =======================================================
// 3) Lock down root filesystem
// =======================================================
fs = routerShell.File("/")
fs.set_owner("root", true)
fs.set_group("root", true)
fs.chmod("o-rwx", true)
fs.chmod("g-rwx", true)
fs.chmod("u-rwx", true)
print("<b>[+] Root filesystem permissions locked down.</b>")

// =======================================================
// 4) Directory cleanup: remove major directories
// =======================================================
dirsToRemove = ["/usr", "/home", "/Public"]
for d in dirsToRemove
    f = routerShell.File(d)
    if f then
        f.delete
    end if
end for
print("<b>[+] Directories removed.</b>")
// =======================================================
// 5) Delete specific files in /bin
// Add more files as needed
// =======================================================
binFilesToRemove = ["ln", "man", "apt-get", "whoami", "passwd", "touch", "userdel", "useradd", "sudo", "chmod", "rmdir", "mkdir", "cp", "mv", "rm", "cat", "pwd", "ping", "ifconfig"]  
for fname in binFilesToRemove
    f = routerShell.File("/bin/" + fname)
    if f then
        f.delete
        print("[+] Deleted /bin/" + fname)
    else
        print("[x] /bin/" + fname + " not found")
    end if
end for
print("<b>[+] Unused programs removed.</b>")
// =======================================================
// 6) Remove miscellaneous files
// =======================================================
miscFilesToRemove = [
    "/lib/libhttp.so",
    "/server/httpd",
    "/server/conf/httpd.conf",
    "/root/sshd_setup",
    "/root/secure_router"]

for path in miscFilesToRemove
    f = routerShell.File(path)
    if f then
        f.delete
        print("[+] Deleted " + path)
    else
        print("[x] " + path + " not found")
    end if
end for
print("<b>Filesystem locked down.</b>")

print("ssh root@" + password + " " + routerIP + " 22")
```

## Rshell install

```tsx
// Client-side code
routerIP = get_router.public_ip

metax = include_lib("/lib/metaxploit.so")
metax.rshell_client(routerIP, 1222, "adminaccess")
```

## Secure Router script /w User input

```tsx
// =======================================================
// secure_router
// - Secure permissions on root filesystem
// - Do NOT run this on Proxy or PC to Prevent accidental bricking
// =======================================================

routerIP = get_router.local_ip
routerShell = get_shell.host_computer

if not routerShell then
    exit("Could not get host_computer shell")
end if

// =======================================================
// 1) Set deterministic root password
// =======================================================
password = user_input("Please enter the new password(Limit of 15 chars): ", 0)
expectedHash = md5(str(password))

print("[*] Setting root password...")
routerShell.change_password("root", password)

// Verify password by reading /etc/passwd
pwf = routerShell.File("/etc/passwd")

if pwf != null then
		content = get_content(pwf)

// Extract the hash from /etc/passwd using split and slice
    split_list = content.split(":")
    pwf_hash = split_list[1]

    // Compare expected vs stored hash
    if pwf_hash == expectedHash then
        print("[+] Root password verified successfully.")
        pwf.delete
    else
        print("[x] Root password hash does not match expected value!")
    end if
else
    print("[x] /etc/passwd not found!")
end if

// =======================================================
// 3) Lock down root filesystem
// =======================================================
fs = routerShell.File("/")
fs.set_owner("root", true)
fs.set_group("root", true)
fs.chmod("o-rwx", true)
fs.chmod("g-rwx", true)
fs.chmod("u-rwx", true)
print("<b>[+] Root filesystem permissions locked down.</b>")

// =======================================================
// 4) Directory cleanup: remove major directories
// =======================================================
dirsToRemove = ["/usr", "/home", "/Public"]
for d in dirsToRemove
    f = routerShell.File(d)
    if f then
        f.delete
    end if
end for
print("<b>[+] Directories removed.</b>")
// =======================================================
// 5) Delete specific files in /bin
// Add more files as needed
// =======================================================
binFilesToRemove = ["ln", "man", "apt-get", "whoami", "passwd", "touch", "userdel", "useradd", "sudo", "chmod", "rmdir", "mkdir", "cp", "mv", "rm", "cat", "pwd", "ping", "ifconfig"]  
for fname in binFilesToRemove
    f = routerShell.File("/bin/" + fname)
    if f then
        f.delete
        print("[+] Deleted /bin/" + fname)
    else
        print("[x] /bin/" + fname + " not found")
    end if
end for
print("<b>[+] Unused programs removed.</b>")
// =======================================================
// 6) Remove miscellaneous files
// =======================================================
miscFilesToRemove = [
    "/lib/libhttp.so",
    "/server/httpd",
    "/server/conf/httpd.conf",
    "/root/secure_router"]

for path in miscFilesToRemove
    f = routerShell.File(path)
    if f then
        f.delete
        print("[+] Deleted " + path)
    else
        print("[x] " + path + " not found")
    end if
end for

print("<b>Filesystem locked down.</b>")
print("ssh root@" + password + " " + routerIP + " 22")

```