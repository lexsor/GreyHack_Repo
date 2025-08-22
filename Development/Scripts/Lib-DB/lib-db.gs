// ////////////////////////////////////////////////////////
// Script Name: lib-db
// Author: Lexsor
// Created: 22 AUG 2025
// Version: 0.1
// Purpose: Scan libraries, extract versions via Metaxploit, and build/search a local vulnerability DB.
// Credits: Plu70
// Changelog: 2025-08-22 v0.1 - Initial scaffold and header
// ////////////////////////////////////////////////////////

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
    for lib in libs
        lib_path = "/lib/" + lib
        lib_file = computer.File(lib_path)
        if lib_file then
            found_libs.push(lib_path)
        end if
    end for
    // found_libs now contains all libraries that exist in /lib/
    return found_libs
end function

// Function to pull names from the list of found libraries
get_lib_names = function(found_libs)
    lib_names = []
    for lib in found_libs
        lib_names.push(lib.split("/")[-1])
    end for
    return lib_names
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

// Function to load the library into metalib
load_lib = function(found_lib)
    mx = include_lib("/lib/metaxploit.so")
    lib_db = []
    for lib in found_lib
        mx_lib = mx.load(lib)
        if mx_lib != null then
            lib_db.push(mx_lib)
        end if
    end for
    return lib_db
end function

// Function to scan a loaded metaLib and return vulnerable memory areas
scanMetaLib = function(metaLib)
    metax = include_lib("/lib/metaxploit.so")
    if not metaLib then
        print("[!] Invalid metaLib object.")
        return []
    end if

    scanResult = metax.scan(metaLib)
    if not scanResult then
        print("[+] No vulnerabilities found for this library.")
        return []
    end if

    for area in scanResult
        print("[!] Vulnerable memory area: " + area)
    end for

    return scanResult
end function





scan(MetaLib)
Scans a MetaLib for vulnerable memory addresses and returns them in a list

Returns either the memory addresses (list), or null on failure



scan(metaLib: metaLib): 
list<string>ornull

Returns a list where each item is a string representing a memory area which has vulnerabilities related to the 
provided library. These memory areas can be used to make further scans via scan_address. 
In case of failure, this method returns null instead. An example of a memory area would be "0x7BFC1EAA". 
Using this method within a SSH encryption process will throw a runtime exception.

metax = include_lib("/lib/metaxploit.so")
metaLib = metax.load("/lib/init.so")
scanResult = metax.scan(metaLib)
for area in scanResult
   print("Memory area containg vulnerability: " + area)
end for