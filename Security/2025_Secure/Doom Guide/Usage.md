# Usage

https://www.youtube.com/watch?v=x-gpWiFEoms

### Basic usage

```tsx
hack [IP] [port]
```

```tsx
map [IP]
```

```tsx
escalate
```

```tsx
dlib -u
```

```tsx
hacklib
```

## How to find a library with a bounce exploit and use it with doom

- If you don't have a lib with that, here's how you can find
Get to one of your proxies, from it you will go to a new random proxy with
proxy -q
- In this target, use 'map' and get any lan ip of a computer  in this network (ex: 192.168.0.2)
- Now still in the router use
hacklib lan_ip (hacklib 192.168.0.2)
- Then select one of the libs that will be listed. It will try to exploit the lib
- If in the result you have any computer with that lan ip, then it's a bounce.
- Check what type of user, and get a copy of this lib for you, using dfile to download or dlib -a too
- If it doesn't have a bounce, try again selecting a new lib.
- If none have, clean you trace, close that target and go to another random proxy and try again until you found it.

## Why using hacklib for that?

- Doom save in DB what each exploit result is, but for that you need to hack that lib as least once so Doom can register that info.
- Scan command only scan the vulner values and show only what was already discovered once or it will show only unkown result.
- So you must exploit that lib once to discover what type of results it have.

## dcall and dpath

- Dcall is a "jump file" that doom use to execute some functions in the target system context. By default it will be uploaded to /home/guest folder in target system. But in some cases that is not possible.
When guest folder have no write permission or guest folder don't  exists on target doom will not be able to upload or inject dcall there, so what can be done?
- Step 1
- You need to find a folder in the target with write permission on it.
    
    ```tsx
    ls -d /
    ```
    
- Step 2 use a dpath

```tsx
dpath
```

```tsx
dpath -a /home/user
```

- Step 3

```
dpath -l
```

- selecting the paths you want to activate. After that when trying to upload dcall it will try first in a active dpath first instead of default guest.
- Remember to deactivate the dpath when not needed to be used anymore in this doom session.
- All dpaths are inactive by default when you start doom.