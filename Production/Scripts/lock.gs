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
    print("[-] Password file deleted.")
end function

// guest directory
guest_dir = function() 
    guest = computer.File("/home/guest")
    if guest then 
        guest.delete
        print("[-] Guest directory deleted.")
    else
        print("[x] Could not find Guest directory.")
    end if
end function

// create /opt directory 
opt_dir = function()
    
	opt = computer.File("/opt")
	if not opt then
		computer.create_folder("/", "opt")	
    	print("[+] /opt checked/created.")
	else
        print("[*] /opt directory exist.")
    end if
end function

// create subdirectories in /opt
sub_dir = function()
    // Subdirectories to ensure
    subdirs = ["seclibs", "unseclibs", "scripts"]

    for subdir in subdirs
		computer.create_folder("/opt", subdir)
        print("[+] " + subdir + " checked/created.")
    end for

    print("Finished checking all directories.")
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
        print("[-] Mail file deleted.")
    else
        print("[x] Could not find mail.txt.")
    end if

    bank = computer.File("/root/Config/Bank.txt")
    if bank then
        bank.delete
        print("[-] Bank file deleted.")
    else
        print("[x] Could not find bank.txt.")
    end if
end function

main = function()
    pwf()
    guest_dir()
    opt_dir()
	sub_dir()
    rootfs()
    check_Pii()
    print ("<b>Home server secured.</b>")
end function

main()