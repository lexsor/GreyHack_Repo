# How-To

https://www.youtube.com/watch?v=sLJKucxaGOQ

# Macro Manual

## Macro command

- use command macro -h to see general info and a few other command of macro system.

## **Creating macro files**

- Use Notepad.exe to create your macro files, as macros are simple text files where each line is a command.
- Macros files need to be saved in ../dfiles/macros folder
- Name the file with the name you want to use to run the macro

## **Running a macro**

- To run a macro you simply use @ followed by your macro file name.
- Ex: @mymacro (it runs macro file ../dfiles/macros/mymacro),

## Macro File Structure

- A macro file consist of a text file where each line is a command, either a doom command or a macro only command.

```tsx
hack -shell -any 170.110.50.20 0
escalate
dfile /home/user/file.txt /root
```

- What this macro does it, try to get a shell on the target, then escalate to root on that target then download a file.

## **Macro Params $**

- You can use params on your macro when you're running it. Ex: @mymarco param1 param 2 ...
- For each param you use, in your macros commands you use the character $ followed by the param order number. Ex: $1 (to refer first param), $2 (to refer to second param), etc...

```tsx
hack -shell -any $1 0
escalate
dfile /var/$2
echo File $2 downloaded from $1
clean 
```

- First param used is a IP (170.110.50.20), so all $1 present in the macro will be replaced by that IP, in this case on the hack command
- Second param is 'system.log' and in the macro the $2 is in dfile command like /var/$2. So the $2 will be replaced by 'system.log' resulting in '/var/system.log' and that way, dfile command will try to download the system.log file
- The echo command uses again both params, $1 and $2, forming the message 'File system.log downloaded from 170.110.50.20' to be printed by the echo command

## Macro Break Points

- Some commands when used in macros may break the macro and prevent it to continue executing commands in the wrong target or situation.
- Current commands that if fail to obtain it results will break the macro are:
    - hack
    - hacklib
    - escalate
    - rshell
    - find (when used with -b param),
    - Any command that display a select option menu,
    - Any command that takes you to a different target object
    
    ```tsx
    hack -shell -any 170.110.50.20 0
    escalate
    dfile /home/user/file.txt /root
    ```
    
- In this example. if hack command fail to get any shell, or escalate fail to get root access, the macro will break, a message telling you that a break happened will be printed and the rest of the macro commands will not be executed.

# Macro Special Commands

Macro system have a few specials commands specific to be used in macros only.

## Jump

- You can use #jump command in your macro to create a jump point in your code IF a break occur.
- If in any point of your macro exist a #jump command, then if any command trigger a break, your macro will not completely stop and a few thing will happen:
    - First, as soon the break happen the default #onbreak command will be executed. This command is: backc. So if a break happen when you have a #jump point, macro will close all targets connections (not proxies).
    - Second, the macro will ignore all commands until it reach the next #jump point, and continue from there.
    
    ```tsx
    hack -shell -any 170.110.50.20 0
    escalate
    dfile /home/user/file.txt /root
    rm /home/user/file.txt
    clean
    #jump
    proxy -clean
    ```
    
- In this case. If 'escalate' fail, macro will not completely break. It will stop, run a auto backc then will continue from the next #jump.
- So it will not execute dfile, rm and clean commands, and will resume from #jump line and ti will run 'proxy -clean' command
- But if no breaks happen, the #jump line is just ignored as it does nothing else.

## [#] command

- You can use # before any command, and that command will only be executed IF the command right before it cause a break. If the break do not happen, this command marked with # will just be ignored.

```tsx
hack -shell -root 170.110.50.20 0
#hack -shell -any 170.110.50.20 0
escalate
dfile /home/user/file.txt /root
rm /home/user/file.txt
clean
#jump
proxy -clean
```

- In this case, the first command is 'hack -shell -root',  so the macro will first try to get a root shell. Next command is #hack -shell -any, so IF hack -shell -root fails, and ONLY IF it fails, the #hack -shell -any, will be executed, so the macro will first get a root shell, then if it fails try to get any shell. If it not fail, #hack -shell -any is just ignored and macro continues normally.
- Note that the macro also have a #jump point. So if both, 'hack -shell -root' and 'hack -shell -any' fails and a break happen then the #jump point will be used

## hold

```tsx
#hold
```

- A user input will be prompted and from it you can either choose to continue or stop the macro.
- Hold may be useful when in some point of your macro you need to wait until you execute another action (like send a funny game email), and then continue (or stop if needed)

## @macro

- Yes, you can call new macro inside a macro. Like:
@mymacro1 param1

```tsx
hack -shell -root 170.110.50.20 0
escalate
@mymacro2 $1
clean
#jump
proxy -clean
```

- Limitations are, a macro can't call itself again, and a nested macro call can't call a macro already used, must be a new macro.
So inside @mymacro2 I can't call @mymacro1 again.
    
    

## onbreak

```tsx
#onbreak
```

- Manual breaks don't auto call backc as auto breaks does. If you not do put a #onbreak when doing a manual break, next #jump will be used.
- Loops automatically add a #onbreak at the end of loop macro.

## if and endif

```tsx
#if
```

- This way you can put each command inside the if block for better organization of the macro commands.

```tsx
#endif
```

- If the statement is false the commands will be ignored and continue from the next #endif
If you don't close the block and the statement result false the macro will break.
- Right now it is not possible to put a #if inside another #if block as when jumping to next #endif may conflict. But you can still use regular if command

```tsx
clip a blue
#if $a == blue
echo The statement was true so this is executed
#endif

#if $a == red
echo The statement was false so this is NOT executed
#endif
```

## comments

- You can add commented lines in the macro text file starting it with //

```tsx
// try to get a root shell on the target router
hack -shell -root 170.110.50.20 0
escalate
clean

// if the hack or escalate fail the macro break and jump here to #jump
#jump
proxy -clean
```

## loop

- Use #loop to create a loop block, instead of using the regular loop command
- This way you can create more complex loop without needing to create a new macro file with it, or using a loop command too long.
- At the end of the block close it with #endloop.

```tsx
// this macro here...
echo CMD1
#loop 2
  echo Loop index $n
#endloop
echo CMD2

//would be the same as...
echo CMD1
loop 2 echo Loop index $n
echo CMD2

// but with #loop block you can organize and create more complex loops
```

Example