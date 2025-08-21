//////////////////////////////////////////////////////////
// Script Name: lib_check
// Author: Lexsor
// Created: 21 AUG 2025
// Version: 0.1
// Purpose: Checks versions of libraries
// Credits: Plu70
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

computer = get_shell.host_computer

// Function to check all libraries can be imported
checklib = function()
    libs = [
        "libssh.so",
        "libhttp.so",
        "librshell.so",
        "aptclient.so",
        "net.so",
        "init.so",
        "kernel_module.so",
        "kernel_router.so"]
    
    found_libs = []
    for i in 0; i < libs.len(); i = i + 1
        lib_path = "/lib/" + libs[i]
        lib_file = computer.File(lib_path)
        if lib_file then
            found_libs.push(libs[i])
        end if
    end for
    // found_libs now contains all libraries that exist in /lib/
    return found_libs
end function

// Function to take the list of found libraries and return their versions
get_loaded_lib_versions = function(found_libs)
    mx = include_lib("/lib/metaxploit.so")
    lib_versions = []
    for i in 0; i < found_libs.len(); i = i + 1
        mx_lib = mx.load(found_libs[i])
        if mx_lib then
            lib_versions.push(mx_lib.version)
        end if
    end for
    return lib_versions
end function

main = function()
    found_libs = checklib()
    lib_versions = get_loaded_lib_versions(found_libs)

    data = "Library Version" // column headers
    for i in 0; i < found_libs.len(); i = i + 1
        data = data + "\n" + found_libs[i] + " " + lib_versions[i]
    end for

    print(format_columns(data))
end function

main()