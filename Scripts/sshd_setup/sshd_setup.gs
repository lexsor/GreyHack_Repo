//////////////////////////////////////////////////////////
// Script Name: sshd_setup
// Author: Lexsor
// Created: 20 AUG 2025
// Version: 1.0
// Purpose: Installs and starts the SSH service
// Credits: [Developer1, Developer2, etc.]
// Note: Make sure /lib/libssh.so is present on the target system
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

main = function()
    print("[*] Starting SSHD setup...")

    // Load the SSH service library
    sshd = include_lib("/lib/libssh.so")
    if not sshd then
        exit("[-] Failed to load /lib/libssh.so. Ensure the library is present.")
    end if

    // Install the SSH service
    print("[*] Installing SSH service...")
    result = sshd.install_service()
    if typeof(result) == "string" and result != "" then
        print("[-] install_service() returned: " + result)
        exit("[-] SSH service installation failed.")
    else
        print("[+] SSH service installed successfully.")
    end if

    // Start the SSH service
    print("[*] Starting SSH service...")
    result = sshd.start_service()
    if typeof(result) == "string" and result != "" then
        print("[-] start_service() returned: " + result)
        exit("[-] SSH service failed to start.")
    else
        print("[+] SSH service started successfully.")
    end if

    // Verify SSH service by checking if port 22 is active
    print("[*] Verifying SSH service on port 22...")
    router = get_router
    ports = get_shell.host_computer.get_ports
    ssh_active = false

    for port in ports
        if port.port_number == 22 then
            ssh_active = true
            break
        end if
    end for

    if ssh_active then
        print("<b>[+] SSH service is active and listening on port 22.</b>")
    else
        print("<b>[x] Warning: Could not verify SSH service on port 22. Check manually.</b>")
    end if

    print("<b>[+] SSHD setup complete.</b>")
end function

main()
