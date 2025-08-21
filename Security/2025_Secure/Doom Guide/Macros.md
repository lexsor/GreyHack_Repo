# Macros

[How-To](Macros%202538db8841f980a3b1cedeb18cc829aa/How-To%202538db8841f980b39266d8017b28667a.md)

## From GSQ

### Find Computer_Bounce lib

**How to use:**

- Get to your proxy first.
- run like this @findbounce user (to find the first lib with at least a user bounce) or @findbounce root (to search only root bounce).
- Running like this will auto search in one random target. several targets use a loop like loop 3 @findbounce user
- Here is a macro I build to auto find you a lib with a bounce exploit.
- Note 1:  this is more useful when most of local libs already have a few different versions, if every target is getting always the same lib versions you can do it manually in only one target.
- Note 2: Before using it, you can check first some of your libs that are not found in targets usually, like [crypto.so](http://crypto.so/), [metaxpoit.so](http://metaxpoit.so/), [aptclient.so](http://aptclient.so/).

```tsx
clipa | clipb | clipc | clip d | clip e
rnd -ip | clipa $p
echo ATTACKING TARGET $a
hack -shell -any $a 0
escalate
ls /lib | clipb $p
grep -r *[a-z]+(_[a-z]+)?\.so+ -v $b | clipa $p
grep -c -v $a | clipc $p
map | clip d $p
grep -c -v $d | clip e $p
grep -i $e -v $d | clip e $p
grep -s 1 -v $e | clip e $p
clip z null
loop $c @hackbounce $n $e $1
if $z != null : grep -i $z -v $b | clip z $p
if $z != null : echo DOWNLOADING $z | dlib -a $z | clean | break
#jump
clean
backc
```

```tsx
clip x null | clip y null
grep -i $1 -v $a | clip x $p
echo ATTACKING LIB $x with lan $2
hacklib -computer -$3 $x $2
#break
echo LIB FOUND $x
clip z $1
back
#onbreak
if $z != null : break
```

### Find New Repository

```tsx
libfind -fr *1 librepository.so | clip a $p
grep -s 1 -v $a | clip b $p
print $b
```

- Libfind will stop as soon it finds a repo lib, then put the result on $a
- grep -s will get the first string on $a
- that is the public IP on the response of libfind
- Then add this IP to the sources.

### Mail Auto read for missions

- Here's a macro example on how you can read your emails and build a target list to use with jobs macros.
- This one will read Corrupt job mails and build a list with PublicIP LanIP in each line for all the targets.

```tsx
mail -a ObscureVortex10@wuhideyaj.net qqpWihrOE8Hll04qcP1I
```

```tsx
regex -a ipregex \b(?:25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(?:25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(?:25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(?:25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\b
```

```tsx
mail -n ObscureVortex10@wuhideyaj.net | loop $p @wiperead $n
```

```tsx
touch -l /root/targetlist.txt
```

```tsx
clip a null | clip b null | clip c null | clip j null
mail -read mymail $1 | clip a $p
clip y The client wants the remote machine to stop working.
grep -r1 *$y -v $a | clip j $p
if $j == null : break
grep -r *ipregex -v $a | clip b $p
grep -i 1 -v $b | clip c $p
grep -i 2 -v $b | clip c -s $p
editl /root/targetlist.txt $c -e
#onbreak
```

- The loop will read each email and extract the ips and save the public and la ip on each line of targetlist.txt file.
- Then use with a macro that reads this file and run an auto complete job macro.

### Corrupt job autocomplete

**Corrupt system job**

1. First accept as many corrupt system jobs you want.
2. Use the mailread macro posted to read the emails and have a file with all the targets like this:
    
    ```tsx
    201.40.20.30 192.168.0.2
    202.50.60.70 172.10.10.2
    203.60.50.70 192.168.0.10
    ```
    
3. With that set up, Now you prepare your first macro, lets call it @wipeloop

    
    ```tsx
    clip a | clip b | clip c
    grep -i $1 -l targetlist.txt | clip a $p
    grep -s 1 -v $a | clip b $p
    grep -s 2 -v $a | clip c $p
    if $b == null : break -jump
    if $c == null : break -jump
    @wipejob $b $c
    ```
    
    - Note: make sure the file with the Ips don't have any empty lines after populated.
    
    ```tsx
    hack -shell -any $1 0
    escalate
    dlib -u aptclient.so
    hacklib -computer -root aptclient.so $2
    corrupt -y
    #jump
    clean -c
    backc
    proxy -clean
    ```
    
    - Note: here I use [aptclient.so](http://aptclient.so/) as my lib stored in dlib command that have a bounce exploit. **You need to edit this name lib to the lib you have with it.**
    
    ```tsx
    grep -c -l targetlist.txt | loop $p @wipeloop $n
    ```
    
    - It will get the number of lines in the file and run a loop that will get each line and extract the public and lan ip and run @wipejob with it.
    - In case the hack or escalate fails it will jump that target and continue to next one. Change the [aptclient.so](http://aptclient.so/) for your lib with bounce.
    

### Find and Delete Remote File

```tsx
//Remote Mission (Find and Delete encrypted file)
//rmission [IP_Address]

hack -shell -any $1 0
escalate
@router

doomsday -m | clip m $p
grep -c -v $m | clip c $p

clip f null
#loop $c
    clip s
    grep -i $n -v $m | clip i $p
    grep -s 1 -v $I | clip s $p
    rcache $1 $s
    find -print *encrypted | clip f $p
    back
    if $f != null : break
#endloop
#onbreak

#if $f != null
    grep -n1 *$s -v $m | clip t $p
    grep -n1 * -v $m | echo User 1: $p
    echo Target User: $t
    echo SEND FUNNY GAME
    hold
    rshell $1 $s
    escalate
    rm $f
    clean
    #jump
#endif

#jump
```

## Custom Built

### @vuln

```tsx
libfind -ar 100 kernel_router.so
libfind -ar 100 libssh.so
libfind -ar 100 libhttp.so
libfind -ar 100 libsql.so
libfind -ar 100 libsmtp.so
libfind -ar 100 libftp.so
```

### @loop_vuln

```tsx
loop $1 @vuln
```

### @wipe

```tsx
hack -shell -any $1 0
echo  Becoming Root
escalate
echo  Checking Libs
scan -a
echo  Uploading Exploit
dlib -u net.so
echo  Pivoting
hacklib -computer -root net.so $2
echo  Wiping
corrupt -y
echo  Cleaning Logs
clean -c
backc
proxy -clean
clear
echo  |
echo  |
echo  |
echo  |
echo  Job Completed
echo  Check /root For Logs
echo  Dont Worry Logs Has Been Cleaned
```

### @filejob

```tsx
ack -shell -root $1 0
#hack -shell -any $1 0
echo  Becoming Root
escalate
echo  Checking Libs
scan -a
echo  Uploading Exploit
dlib -u net.so
echo  Reverse Shell
rshell -i
echo  Scraping
doomsday -m
echo SEND FUNNY GAME TO $2
#hold
rshell $1 $2
escalate
scan -a
find -dfile $3
clean -c
backc
#jump
proxy -clean
echo  |
echo  |
echo  |
echo  |
echo  Job Completed
echo  Check /root For Logs
echo  Dont Worry Logs Has Been Cleaned
```

### @test

```tsx
clipa | clipb | clipc | clip d | clip e // clear those clip var each loop
rnd -ip | clipa $p // generate random ip
echo ATTACKING TARGET $a //echo print
hack -shell -any $a 0 // try get shell on random ip, if fail it will jump
escalate // try get root, if fail it will jump
ls /lib | clipb $p // pipe ls /lib in a var
grep -r *[a-z]+(_[a-z]+)?\.so+ -v $b | clipa $p // extract the lib names from full path
grep -c -v $a | clipc $p // set number of libs from previous var with lib names
map | clip d $p // map network to a var
grep -c -v $d | clip e $p // get number of targets mapped
grep -i $e -v $d | clip e $p // set last lan from the list to a var
grep -w1 * -v $e | clip e $p // extract only the ip from it
clip z null // set z to null
loop $c @hackbounce $n $e $1 // run second macro that attack the libs
if $z != null : grep -i $z -v $b | clip z $p //if macro have a return get lib  full path
if $z != null : echo DOWNLOADING $z | dlib -a $z | clean | break // download lib
#jump
clean
backc
```