/*
Usage:
  compile split_to_txt.src /bin/split_to_txt
  split_to_txt <full_path>

Description:
  Takes a full path string, extracts just the filename,
  and writes it to "output.txt" in the current working directory.

Example:
  split_to_txt /home/Till/Img0013.jpg

Result:
  Creates (or overwrites) ./output.txt with:
    Img0013.jpg
*/

get_filename = function(path)
  if path == null then
    return ""
  end if

  parts = path.split("/")
  if parts == null then
    return ""
  end if
  if parts.len == 0 then
    return ""
  end if

  return parts[-1]   // just the filename
end function

main = function()
  if params == null or params.len == 0 then
    print("[!!] Usage: program <file_path>")
    return
  end if

  input_path = params[0]
  filename = get_filename(input_path)
  if filename == "" then
    print("[!!] Could not extract filename")
    return
  end if

  sh = get_shell
  current_dir = current_path
  comp = sh.host_computer

  // ensure output.txt exists
  comp.touch(current_dir, "output.txt")

  f = comp.File(current_dir + "/output.txt")
  if f == null then
    print("[!!] Could not open output.txt")
    return
  end if

  // overwrite file with just the filename and newline
  res = f.set_content(filename)
  if res == 1 then
    print("[+] Wrote filename to " + current_dir + "/output.txt")
  else
    print(res)
  end if
end function

main()
