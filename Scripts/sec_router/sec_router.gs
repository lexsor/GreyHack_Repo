//////////////////////////////////////////////////////////
// Script Name: sec_router
// Author: Lexsor
// Created: 20 AUG 2025
// Version: 1.0
// Purpose: Secures router by locking down filesystem and removing unnecessary files
// Credits: maho_citrus
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

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
dirsToRemove = ["/usr", "/home", "/usr"]
for d in dirsToRemove
    f = routerShell.File(d)
    if f then
        f.delete
    end if
end for
print("<b>[+] Directories removed.</b>")

print("<b>Filesystem locked down.</b>")

print("ssh root@" + password + " " + routerIP + " 22")