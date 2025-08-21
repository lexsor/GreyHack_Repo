//////////////////////////////////////////////////////////
// Script Name: newhackshop
// Author: maho_citrus
// Version: 1.0
// Purpose: Generates a random IP address for a hackshop
// Credits: maho_citrus
// Parameters: None
//////////////////////////////////////////////////////////

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