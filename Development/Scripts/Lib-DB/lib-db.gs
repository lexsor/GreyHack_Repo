//////////////////////////////////////////////////////////
// Script Name: lib-db
// Author: Lexsor
// Created: 22 AUG 2025
// Version: 0.1.3
// Purpose: Scan libraries, extract versions via Metaxploit, and build/search a local vulnerability DB.
// Credits: Plu70
// Changelog: 
// 2025-08-22 v0.1   - Initial scaffold and header
// 2025-08-22 v0.1.1 - Fixes and formatting
// 2025-08-22 v0.1.2 - len() fixes, input/menu safety, centralized metaxploit include
// 2025-08-22 v0.1.3 - GreyScript compliance: no hanging brackets, str() conversion
//////////////////////////////////////////////////////////

computer = get_shell.host_computer
_mx = null

// Cache metaxploit loader (avoid repeated include)
get_mx = function()
    if _mx then 
        return _mx 
    end if
    _mx = include_lib("/lib/metaxploit.so")
    return _mx
end function

// Function to check all libraries can be imported
checklib = function()
    libs = ["libssh.so",
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
        if computer.File(lib_path) then
            found_libs.push(lib_path)
        end if
    end for
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
    mx = get_mx()
    lib_versions = []
    if not mx then
        print("[!] metaxploit library not available.")
        return lib_versions
    end if

    for lib in found_libs
        mx_lib = mx.load(lib)
        if mx_lib then
            ver = mx_lib.version
            if not ver then 
                ver = "unknown" 
            end if

            lib_versions.push(lib + " -> " + ver)
        else
            lib_versions.push(lib + " -> failed to load")
        end if
    end for
    return lib_versions
end function

// load a single library (lib_path) and return the loaded metaLib object or null
load_lib = function(lib_path)
    mx = get_mx()
    if not mx then
        print("[!] metaxploit library not available.")
        return null
    end if
    if not lib_path then
        print("[!] No library path provided to load_lib().")
        return null
    end if
    vul_lib = mx.load(lib_path)
    if vul_lib then
        print("[*] Loaded library: " + lib_path)
        return vul_lib
    else
        print("[!] Failed to load library: " + lib_path)
        return null
    end if
end function

// Print a 1-based menu, return chosen 0-based index or -1 on cancel/invalid
prompt_choice = function(items)
    if not items or items.len() == 0 then
        print("[-] No libraries available to choose from.")
        return -1
    end if

    print("\n[*] Available libraries:")
    for i in range(0, items.len()-1)
        print("  [" + str(i+1) + "] " + items[i])
    end for

    ans = user_input("\nSelect a library number (Enter to cancel): ")
    if ans == "" then 
        return -1 
    end if

    n = ans.to_int()
    if n <= 0 then
        print("[-] Invalid selection.")
        return -1
    end if
    idx = n - 1
    if idx < 0 or idx >= items.len() then
        print("[-] Selection out of range.")
        return -1
    end if
    return idx
end function

// Parse the scan_address() string into a list of vulnerability labels (strings)
parse_scan_address = function(scan_str)
    if not scan_str then
        return []
    end if

    // Split on the marker; the first piece before the first "Unsafe check: " is noise
    parts = scan_str.split("Unsafe check: ")
    vulns = []

    if parts.len() <= 1 then
        // No "Unsafe check: " found; nothing to extract
        return vulns
    end if

    // Start from index 1 to skip the preamble
    for i in range(1, parts.len() - 1)
        seg = parts[i]

        labelStart = seg.indexOf("<b>")
        labelEnd = seg.indexOf("</b>")

        if labelStart != -1 then
            labelStart = labelStart + 3
        end if

        if labelStart != -1 and labelEnd != -1 and labelEnd > labelStart then
            label = seg[labelStart:labelEnd]
            // Trim common whitespace artifacts if any
            label = label.trim()
            if label != "" then
                vulns.push(label)
            end if
        end if
    end for

    return vulns
end function

// Function to scan a loaded metaLib and return vulnerable memory addresses (strings)
scan_vuln_lib = function(metaLib)
    mx = get_mx()
    if not metaLib then
        print("[!] Invalid metaLib object.")
        return []
    end if
    if not mx then
        print("[!] metaxploit library not available.")
        return []
    end if

    scan_result = mx.scan(metaLib)  // returns list of strings (addresses) or []
    if not scan_result then
        print("[+] No vulnerabilities found for this library.")
        return []
    end if

    print("\n=== Vulnerable Memory Areas (addresses) ===")
    for area in scan_result
        print("- " + area)
    end for
    return scan_result
end function

// Minimal: call scan_address() for each addr and print debug output
scan_vuln_addresses = function(metaLib, addresses)
    mx = get_mx()
    if not mx then
        print("[!] metaxploit library not available.")
        return []
    end if

    infos = []  // parallel to addresses; each is string or null

    print("\n=== scan_address results ===")
    for addr in addresses
        info = mx.scan_address(metaLib, addr)  // string or null

        msg = "[dbg] " + addr + " -> "
        if info != null then
            msg = msg + info
            infos.push(info)
        else
            msg = msg + "null"
            infos.push(null)
        end if

        print(msg)
    end for

    return infos
end function

// Main execution flow
main = function()
    // 1) find libs
    found = checklib()
    print("[*] Found libraries:")
    if found.len() == 0 then
        print(" - none")
    else
        for f in found
            print(" - " + f)
        end for
    end if

    // 2) names
    names = get_lib_names(found)
    print("\n[*] Library names:")
    if names.len() == 0 then
        print(" - none")
    else
        for n in names
            print(" - " + n)
        end for
    end if

    // 3) versions
    versions = get_loaded_lib_versions(found)
    print("\n[*] Library versions:")
    if versions.len() == 0 then
        print(" - none")
    else
        for v in versions
            print(" - " + v)
        end for
    end if

    // 4) prompt user to choose
    idx = prompt_choice(found)
    if idx == -1 then
        print("[*] Aborted / no selection.")
        return {found:found, names:names, versions:versions, chosen:null}
    end if

    chosen_lib = found[idx]
    metaObj = load_lib(chosen_lib)
    if metaObj == null then
        print("[!] Could not load meta object; exiting.")
        return {found:found, names:names, versions:versions, chosen:chosen_lib}
    end if

    // After:
    scan_result = scan_vuln_lib(metaObj)
    if scan_result.len() > 0 then
        print("\n[*] scanResult count: " + str(scan_result.len()))
        // NEW: get per-address vulnerability info
        vuln_details = scan_vuln_addresses(metaObj, scan_result)
        // vuln_details is a list of {address, labels, raw}; keep it if you want a DB later
    end if
    return {found:found, names:names, versions:versions, chosen:chosen_lib}
end function

// Run main when the script is executed
main()
