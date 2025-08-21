# Zero Day

### Zero Day Timer

```tsx
months = {
"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
"May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
"Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}

is_leap_year = function(year)
return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
end function

days_in_month = function(month, year)
if month == 2 then
if is_leap_year(year) then return 29 else return 28
else if [4, 6, 9, 11].indexOf(month) != null then
return 30
end if
return 31
end function

time_to_next_cycle = function()
raw = current_date
splitDateTime = raw.split(" - ")
dmy = splitDateTime[0].split("/")
hm = splitDateTime[1].split(":")

day = dmy[0].to_int
monthStr = dmy[1]
month = months[monthStr]
year = dmy[2].to_int

hour = hm[0].to_int
minute = hm[1].to_int
second = 0

if month % 2 == 0 and day >= 1 and day <= 14 then
return "0-Day Cycle Active"
end if

next_month = month + 1
next_year = year
if next_month > 12 then
next_month = 1
next_year = year + 1
end if

if next_month % 2 != 0 then
next_month = next_month + 1
if next_month > 12 then
next_month = 2
next_year = next_year + 1
end if
end if

days_remaining = days_in_month(month, year) - day

curr_month = month + 1
y = year
while curr_month != next_month or y != next_year
if curr_month > 12 then
curr_month = 1
y = y + 1
end if
days_remaining = days_remaining + days_in_month(curr_month, y)
curr_month = curr_month + 1
end while

days_remaining = days_remaining + 1
total_seconds = days_remaining * 86400 - (hour * 3600 + minute * 60 + second)

real_seconds = total_seconds / 14.0
hrs = floor(real_seconds / 3600)
mins = floor((real_seconds % 3600) / 60)
secs = floor(real_seconds % 60)

return "Time until next 0-Day cycle (real-time) <color=white>" + hrs + "</color>h:<color=white>" + mins + "</color>m:<color=white>" + secs + "</color>s"
end function

print(time_to_next_cycle())
```

## 0day - debuglib - payload

- Doom have the tools you need to use 0day mechanics and debug libs for the new 0day exploit each cycle.

### debuglib

- Use the current cycle 0day credential to be able access the debug mode of the lib, doom command for that is debuglib
- While debugging a lib you can Scan, Patch, Test and Pyalod. Check usage to see more about it.

### Payload

- Once you discover the new 0day exploit solving the code Test puzzle (doom will help to auto solve it for you) you can use that new exploit to payload the lib, and new type of attack.
- Payloading a lib will give you partial objects with limited functions. In doom you will interact with it as a PCOMPUTER target.
- PCOMPUTER is similar to a regular computer but limited. Just a few functions work on it.
- The use of this partial objects is to open a breach on the target with what you got, like chmoding files, creating new user to make other vulnerability exploitable, etc...

```tsx
partial
```

- one key difference here with pcomputer is that you are able to use HACKLIB command with it, so you gonna be able to hacklib the local libs too from inside, which will have more exploits to attack and get a regular shell object.
- So the purpose of using this partial computer is create breaches and be able to hacklib the local libs too and make you able to escalate to a root shell from it.