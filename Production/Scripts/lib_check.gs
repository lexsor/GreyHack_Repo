//////////////////////////////////////////////////////////
// Script Name: lib_check
// Author: Lexsor
// Created: 21 AUG 2025
// Version: 1.0
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
    lib_names = []
    for lib in libs
        lib_path = "/lib/" + lib
        lib_file = computer.File(lib_path)
        if lib_file then
            found_libs.push(lib_path)
            lib_names.push(lib_path.split("/")[-1])
        end if
    end for
    // found_libs now contains all libraries that exist in /lib/
    return [found_libs, lib_names]
end function

// Function to take the list of found libraries and return their versions
get_loaded_lib_versions = function(found_libs)
    mx = include_lib("/lib/metaxploit.so")
    lib_versions = []
    for lib in found_libs
        mx_lib = mx.load(lib)
        if mx_lib then
            lib_versions.push(mx_lib.version)
        end if
    end for
    return lib_versions
end function

main = function()
	result = checklib()
    found_libs = result[0]
	lib_names = result[1]
    lib_versions = get_loaded_lib_versions(found_libs)

    data = "<u><b>Library</b></u>     <u><b>Version</b></u>"
    idx = 0
    for lib in lib_names
        data = data + "\n" + lib + " " + lib_versions[idx]
        idx = idx + 1
    end for

    print(format_columns(data))
end function

main()