# Prep Machine

1. Start the game and begin with singleplayer. Finish tutorials and the first mission in it so that when you join multiplayer for the first time, you have gift.txt and hackshop ip instantly.
2. Compile the following code as `passgen`, and run `passgen 20` to generate a 20 digit alphanumeric password. Copy the password to the GH_Login.txt.
    
    ```tsx
    if not params then exit("Usage: " + program_path.split("/")[-1] + " [length]")
    length = to_int(params[0])
    if typeof(length) != "number" or length <= 0 then exit("Length must be a positive integer.")
    pass = ""
    while length > 0
        pass = pass + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[floor(rnd * 62)]
        length = length - 1
    end while
    print(pass)
    ```
    
3. Reboot to menu. Select delete computer and join multiplayer. This wipes your current multiplayer system.
4. Set the username, os name to what you want, set the password to the one you saved in the text file.
5. Repeat step 2, compile the code in multiplayer as `passgen` as well. You will use this script to generate any password you set. For now run `passgen 15` twice to generate two password for mail and bank, save both to the GH_Login.txt