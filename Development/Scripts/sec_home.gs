//////////////////////////////////////////////////////////
// Script Name: sec_home
// Author: Lexsor
// Created: 19 AUG 2025
// Version: 1.0
// Purpose: lock down the home server
// Credits: Plu70
// Notes: do not use THIS script on Proxy!
//        this will help prevent bricking your machine!
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

    local = get_shell.host_computer
    // pwf
    pwf = local.File("/etc/passwd")
    if pwf then pwf.delete
    // guest directory
    guest = local.File("/home/guest")
    if guest then guest.delete
    // get the root file object
    fs = local.File("/")
    // set owner and group to root
    fs.set_owner("root",1)
    fs.set_group("root",1)
    //lock down permissions
    fs.chmod("o-rwx",1)
    fs.chmod("g-rwx",1)
    fs.chmod("u-rwx",1)
    // g+x on critical files
    local.File("/bin/sudo").chmod("g+x")
    local.File("/bin/ssh").chmod("g+x")
    local.File("/usr/bin/Terminal.exe").chmod("g+x")
    local.File("/usr/bin/Mail.exe").chmod("g+x")
    // For multiplayer version to allow chat
    chat = local.File("/usr/bin/Chat.exe")
    if chat then chat.chmod("g+x")

    print "<b>Filesystem locked down.</b>"