//////////////////////////////////////////////////////////
// Script Name: passgen
// Author: maho_citrus
// Version: 1.0
// Purpose: Generates a random password of specified length
// Credits: maho_citrus
// Parameters: length (integer) - Length of the password to generate
//////////////////////////////////////////////////////////

if not params then exit("Usage: " + program_path.split("/")[-1] + " [length]")
length = to_int(params[0])
if typeof(length) != "number" or length <= 0 then exit("Length must be a positive integer.")
pass = ""
while length > 0
    pass = pass + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[floor(rnd * 62)]
    length = length - 1
end while
print(pass)