/*
Usage:
  compile split.src /bin/split
  split <full_path>

Example:
  split /home/Till/Img0013.jpg
Output:
  Img0013.jpg
*/

get_filename = function(path)
  if path == null then
    return ""
  end if

  parts = path.split("/")
  if parts == null or parts.len == 0 then
    return ""
  end if

  return parts[-1]
end function

main = function()
  if params == null or params.len == 0 then
    print("[!!] Usage: program <file_path>")
    return
  end if

  input_path = params[0]
  filename = get_filename(input_path)

  print(filename)
end function

main()
