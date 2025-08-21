# Wifi Step

### ensure you crack 3 wifis to start out with in order to use for starting

1. connect to first wifi
2. open 3 browsers and search bank, mail and internet
3. open each of the pages
4. swap to second wifi
5. create email
    - use the password created earlier
6. create bank
    - use the password created earlier
7. download configlan.exe from internet services
8. save personal hackshop IP in GH_Login.txt
9. Now compile the following code as `newHackshop`, run it and wait till it gives you a hackshop ip. You do not use the hackshop in your mail because that is permanent and you do not want to lose it.
    
    ```tsx
    randomIp = function()
        while true
            ip = floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1) + "." + floor((rnd * 255) + 1)
            if not is_valid_ip(ip) then continue
            if is_lan_ip(ip) then continue
            return ip
        end while
    end function
    
    getRouter = function(ip)
    	router = get_router(ip)
    	if not router then router = get_switch(ip)
    	if not router then return null
    	return router
    end function
    
    hasRepoService = function(router)
        for lanIp in router.devices_lan_ip
            ports = router.device_ports(lanIp)
            for port in ports
                if router.port_info(port).split(" ")[0] == "repository" then return true
            end for
        end for
        return null
    end function
    
    main = function()
        while true
            ip = randomIp
            router = getRouter(ip)
            if not router then continue
            if not hasRepoService(router) then continue
            exit(ip)
        end while
    end function
    main
    ```
    
    - This script gives you a temporary hackshop.
    - You should be very careful not to leak the hackshop ip in the mail because a player only have one permanent hackshop each reset.
10. Open Browser.exe, go to the hackshop you got from the script last step. Download metaxploit.so that we will need later. Then click on “credentials needed” missions, you want the one says “particular user”, accept 8 of them.
    - Use whois and Mail.exe social engineering to complete all of them. (You need to do this step quickly, preferably within a minute to reduce the chance of being found.)
    - After you finished all 8 missions, you should have enough money to pay for your own wifi.
11. Go to a ISP and buy the cheapest home network. For maximum security, do not set custom domain
12. Open Mail.exe and connect to the wifi it sends you.
13. Rent server from Internet Services