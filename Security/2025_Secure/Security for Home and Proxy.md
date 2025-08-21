# Security for Home and Proxy

## chmod users and groups -> The two scripts do step 2 and 3 for the home and proxy

- use the secure_proxy script to lock down the proxy box
    
    ```tsx
    // lock protocol:
    // secure permissions on proxy
    // remember, no g+x on proxy servers, that's only for home!
    // Don't use THIS script on Home! it will brick it!
    
    lock = function( shell_object )
    
        pwf = shell_object.host_computer.File("/etc/passwd")
        if pwf then pwf.delete
    
        home = shell_object.host_computer.File("/home")
        if home then home.delete
    
        fs = shell_object.host_computer.File("/")
        fs.set_owner("root",1)
        fs.set_group("root",1)
        fs.chmod("o-rwx",1)
        fs.chmod("g-rwx",1)
        fs.chmod("u-rwx",1)
    
    end function
    // connect to proxy -> change x.x.x.x and password to the info received from the proxy server rental email
    proxy_shell = get_shell.connect_service("x.x.x.x", 22, "root", "password", "ssh")
    //
    if typeof(proxy_shell) == "shell" then lock(proxy_shell) else exit("Failed to connect to proxy shell")
    proxy_shell.start_terminal
    ```
    
- use the secure_home script to lock down the home box
    
    ```tsx
    // lock protocol:
    // secure permissions on home
    // do not use THIS script on Proxy!
    // this will help prevent bricking your machine!
    
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
    ```
    
    - chmod -R o-rwx -> removes other read/write/execute
    - chmod -R g-rwx -> removes group read/write/execute
    - chmod -R u-rwx -> removes user read/write/execute
    - chown -R root / -> changes the owner to root
    - chgrp -R root / -> changes the group to root
    - chmod g+x /bin/sudo -> Prevents bricking your access
    - chmod g+x /bin/ssh -> Prevents bricking your access
    - chmod g+x /usr/bin/Terminal.exe -> Prevents bricking your access
    - chmod g+x /usr/bin/Chat.exe -> Prevents bricking your access
    - chmod g+x /usr/bin/Mail.exe -> Prevents bricking your access

## remove vectors: /home/guest and /etc/passwd

- rm -r /home/guest -> removes the guest directory
- rm /etc/passwd -> removes the password file

## Remove cookies: Bank.txt and Mail.txt

- rm /root/Config/Mail.txt -> removes the mail file
- rm /root/Config/Bank.txt -> removes the bank file