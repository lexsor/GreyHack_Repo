//////////////////////////////////////////////////////////
// Script Name: sec_proxy
// Author: Lexsor
// Created: 19 AUG 2025
// Version: 1.0
// Purpose: lock down the proxy server and connect to it securely
// Credits: Plu70
// Notes: no g+x on proxy servers, that's only for home!
//        Don't use THIS script on Home! it will brick it!
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

// connect to proxy -> change x.x.x.x and password to the info received from the proxy server rental email
proxy_shell = get_shell.connect_service("x.x.x.x", 22, "root", "password", "ssh")

// password file
pwf = function(shell_object)
    location = shell_object.host_computer.File("/etc/passwd")
    if location then location.delete
    print("[-] Password file deleted.")
end function

// home directory
dir = function(shell_object) 
    home = shell_object.host_computer.File("/home")
    if home then 
        home.delete
        print("[-] Home directory deleted.")
    else
        print("[x] Could not find home directory.")
    end if
end function

// create /opt directory 
opt_dir = function(shell_object)
    opt = shell_object.host_computer.File("/opt")
	if not opt then
		shell_object.host_computer.create_folder("/", "opt")	
    	print("[+] /opt checked/created.")
	else
        print("[*] /opt directory exist.")
    end if
end function

// create subdirectories in /opt
sub_dir = function(shell_object)
    // Subdirectories to ensure
    subdirs = ["seclibs", "unseclibs", "scripts"]

    for subdir in subdirs
		shell_object.host_computer.create_folder("/opt", subdir)
        print("[+] " + subdir + " checked/created.")
    end for

    print("<b>Finished checking all directories.</b>")
end function

// get the root file object
rootfs = function(shell_object)
    fs = shell_object.host_computer.File("/")
    // set owner and group to root
    fs.set_owner("root",1)
    fs.set_group("root",1)
    //lock down permissions
    fs.chmod("o-rwx",1)
    fs.chmod("g-rwx",1)
    fs.chmod("u-rwx",1)
    print ("<b>Filesystem locked down.</b>")
end function

// check for mail.txt and bank.txt
check_Pii = function(shell_object)
    mail = shell_object.host_computer.File("/root/Config/Mail.txt")
    if mail then
        mail.delete
        print("[-] Mail file deleted.")
    else
        print("[x] Could not find mail.txt.")
    end if

    bank = shell_object.host_computer.File("/root/Config/Bank.txt")
    if bank then
        bank.delete
        print("[-] Bank file deleted.")
    else
        print("[x] Could not find bank.txt.")
    end if
end function

lock = function(shell_object)
    // remove password file
    pwf(shell_object)
    // remove home directory
    dir(shell_object)
    // create /opt directory
    opt_dir(shell_object)
    // create subdirectories in /opt
    sub_dir(shell_object)
    // get the root file object and lock it down
    rootfs(shell_object)
    // check for PII files and delete them
    check_Pii(shell_object)
    print("<b>Proxy server locked down successfully.</b>")
end function

// connect to proxy and lock it down
if typeof(proxy_shell) == "shell" then 
    lock(proxy_shell) 
else 
    exit("Failed to connect to proxy shell")
end if

proxy_shell.start_terminal