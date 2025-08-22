//////////////////////////////////////////////////////////
// Script Name: rshell_install
// Author: Lexsor
// Created: 20 AUG 2025
// Version: 1.0
// Purpose: Installs a reverse shell client on the target
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

routerIP = get_router.public_ip

metax = include_lib("/lib/metaxploit.so")
metax.rshell_client(routerIP, 1222, "adminaccess")