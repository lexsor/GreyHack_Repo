//////////////////////////////////////////////////////////
// Script Name: lock
// Author: Lexsor
// Created: 19 AUG 2025
// Version: 1.0
// Purpose: lock down the home server
// Credits: Plu70
// Notes: do not use THIS script on Proxy!
//        this will help prevent bricking your machine!
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

computer = get_shell.host_computer
    
// password file
pwf = function()
    location = computer.File("/etc/passwd")
    if location then location.delete
end function

// guest directory
guest_dir = function() 
    guest = computer.File("/home/guest")
    if guest then guest.delete
end function

// check opt directory
opt_dir = function()
    opt = computer.File("/opt")
    if not opt then
        computer.mkdir("/opt")
        print("[*] Opt directory created.")
    else
        print("[+] Opt directory exist.")
    end if

    // Check subdirectories
    subdirs = ["Seclibs", "Unseclibs", "Scripts"]
    for i in 0 to subdirs.len() - 1
        path = "/opt/" + subdirs[i]
        subdir = computer.File(path)
        if not subdir then
            computer.mkdir(path)
            print("[*] " + subdirs[i] + " directory created.")
        else
            print("[+] " + subdirs[i] + " directory exists.")
        end if
    end for
end function

// get the root file object
rootfs = function()
    fs = computer.File("/")
    // set owner and group to root
    fs.set_owner("root",1)
    fs.set_group("root",1)
    //lock down permissions
    fs.chmod("o-rwx",1)
    fs.chmod("g-rwx",1)
    fs.chmod("u-rwx",1)
    // g+x on critical files
    computer.File("/bin/sudo").chmod("g+x")
    computer.File("/bin/ssh").chmod("g+x")
    computer.File("/usr/bin/Terminal.exe").chmod("g+x")
    computer.File("/usr/bin/Mail.exe").chmod("g+x")
    // For multiplayer version to allow chat
    chat = computer.File("/usr/bin/Chat.exe")
    if chat then chat.chmod("g+x")
    print ("<b>Filesystem locked down.</b>")
end function

// check for mail.txt and bank.txt
check_Pii = function()
    mail = computer.File("/root/Config/Mail.txt")
    if mail then
        mail.delete
        print("[$] Mail file deleted.")
    else
        print("[x] Could not find mail.txt.")
    end if

    bank = computer.File("/root/Config/Bank.txt")
    if bank then
        bank.delete
        print("[$] Bank file deleted.")
    else
        print("[x] Could not find bank.txt.")
    end if
end function

main = function()
    pwf()
    guest_dir()
    opt_dir()
    rootfs()
    check_Pii()
    print ("<b>Home server secured.</b>")
end function

main()