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