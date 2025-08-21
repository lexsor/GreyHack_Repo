// Function to pad strings to a fixed width
pad_string = function(text, width)
    text = str(text)  // Ensure text is a string
    while text.len < width
        text = text + " "  // Add spaces until it reaches the desired width
    end while
    return text
end function

// Function to fetch all running processes
get_processes = function()
    shell = get_shell
    computer = shell.host_computer
    raw_data = computer.show_procs()  

    lines = raw_data.split(char(10))  
    if lines.len < 2 then return [] end if 
    
    process_list = []
    
    for i in range(1, lines.len - 1)  
        parts = lines[i].split(" ")  

        if parts.len < 5 then continue end if  

        user = parts[0]  
        pid = parts[1].to_int  
        cpu = parts[2].remove("%").to_int  
        memory = parts[3].remove("%").to_int  
        name = parts[4]  

        process_data = {
            "user": user,
            "pid": pid,
            "cpu": cpu,
            "memory": memory,
            "name": name}
        process_list.push(process_data)
    end for
    
    return process_list
end function

// Function to display processes in a formatted table
display_processes = function(processes)
    clear_screen()
    print("\nHTOP - Grey Hack Edition (Auto-refresh every 5s, use Ctrl+C to exit)\n")
    print(pad_string("USER", 16) + pad_string("PID", 8) + pad_string("CPU%", 8) + pad_string("MEM%", 8) + pad_string("Process Name", 20))
    print("============================================================")
    
    for process in processes
        user_pad = pad_string(process.user, 16)
        pid_pad = pad_string(process.pid, 8)
        cpu_pad = pad_string(process.cpu + "%", 8)
        mem_pad = pad_string(process.memory + "%", 8)
        name_pad = pad_string(process.name, 20)

        print(user_pad + pid_pad + cpu_pad + mem_pad + name_pad)
    end for

    print("\nTotal Processes: " + processes.len)  // Display process count
end function

// Main loop for continuous refresh
main = function()
    print("DEBUG: Starting continuous htop... (Press Ctrl+C to exit)")

    while true
        processes = get_processes()  // Fetch latest process list
        display_processes(processes)  // Display updated list

        wait(5)  // Refresh every 5 seconds
    end while
end function

// Run the program
main()
