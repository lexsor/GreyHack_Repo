//////////////////////////////////////////////////////////
// Script Name: store
// Author: Lexsor
// Created: 20 AUG 2025
// Version: 1.0
// Purpose: generate a new bank and shop IP
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////


// Constants
MAX_ATTEMPTS = 500  // Prevent infinite loops

// Function to generate a random public IP
randomIp = function()
    return floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1)
end function

// Function to find a Hack Shop by searching for "repository"
findHackShop = function()
    print("Scanning for Hack Shop...")

    for attempt in range(1, MAX_ATTEMPTS)
        ip = randomIp()
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue

        router = get_router(ip)
        if not router then continue

        // Check if any device on the router has "repository" (Hack Shop indicator)
        for lanIp in router.devices_lan_ip
            for port in router.device_ports(lanIp)
                if router.port_info(port).split(" ")[0] == "repository" then
                    print("Hack Shop Found: " + ip)
                    return ip
                end if
            end for
        end for
    end for

    print("Hack Shop not found in " + MAX_ATTEMPTS + " attempts.")
    return null
end function

// Function to find a Bank by searching for "bank_account"
findBank = function()
    print("Scanning for Bank...")

    for attempt in range(1, MAX_ATTEMPTS)
        ip = randomIp()
        if not is_valid_ip(ip) or is_lan_ip(ip) then continue

        router = get_router(ip)
        if not router then continue

        // Check if any device on the router has "bank_account"
        for lanIp in router.devices_lan_ip
            for port in router.device_ports(lanIp)
                if router.port_info(port).split(" ")[0] == "bank_account" then
                    print("Bank Found: " + ip)
                    return ip
                end if
            end for
        end for
    end for

    print("Bank not found in " + MAX_ATTEMPTS + " attempts.")
    return null
end function

// Start scanning for Hack Shop and Bank
hackShopIP = findHackShop()
bankIP = findBank()

print("\n--- FOUND SERVICES ---")
if hackShopIP then print("Hack Shop -> " + hackShopIP)
if bankIP then print("Bank -> " + bankIP)
