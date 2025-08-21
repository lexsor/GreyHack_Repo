# Setup

## From GSQ

> I, personally, when hacking use doom from a rented proxy server, just to have another layer of security, so of the ip e discovered, it's from the server.
So my server have doom and have the DB there, using locally.
And from my home I set it to use the remote DB from the server
> 

## Notes to first video: First Install of Doom

- **do not access the site or use the repository ip from the video, open a ticket and request a personal repository IP.,**
- **In the install video it is showed how to populate your password DB with some files shared here. In current doom version this is no longer required to do when you install doom as now it have a built in dictionary and other means to brute force against targets. Your DB dictionary will be built automatically as you hack targets, So for new user you can skip that part.**
- **It is showed how to setup a remote server to use as a remote DB. That part is optional, do only if you want to use DB as remote otherwise you can skip it and use DB as local.**

https://www.youtube.com/watch?v=s2TNhDctt4s

- Request doom Repo from Discord

```tsx
apt-get addrepo x.x.x.x
apt-get update
apt-get install doom
```

### Create Remote DB

- After proxy has been secured, setup ssh within doom

```tsx
sshlist -a Server root@passwd x.x.x.x 22
```

- Now lets setup the config in doom

```tsx
config
```

- select option 5 to enable remote data base
- select option 6, then select the server added from the favorites
- copy the doomDB to the remote server

```tsx
sys -b local
```

## Notes for Second  Video

- **Different from what it's said on the video, libfind do not download the lib. It just find, scan or attack the lib on random npc targets.**
- **Do not use libfind to speedup populate your lib DB, this will be done automatically when you're hacking targets. Constantly scan libs will speed up cpu health loss. -fr option here is more safe to find specific lib versions.,**
- **libinfo command now is called 'libdata'**
- **Proxy and dvar commands showed here are important.**

https://www.youtube.com/watch?v=2J9NS3lezl8

```tsx
proxy -a 5
```

```tsx
proxy -c
```

### Dvars - shortcuts

```tsx
dvar -l
```

```tsx
dvar -a [variable] [command]
```

```tsx
dvar -a q dfile /var/system.log
dvar -a w hacklib -l
dvar -a e dlib -u
dvar -a r doomsday -m
dvar -a c cleanlog
dvar -a pc proxy -clean
dvar -a wipe corrupt -y
dvar -a home ls -d /home
dvar -a root ls -d /
dvar -a rsi rshell -i
dvar -a rsl rshell -l
dvar -a sa scan -a
dvar -a pm pass -m
```

## Proxy Tip

- Always use proxies to hack, or any command that make connections against the target, like hack, ssh, debuglib (remote) etc.
- When using proxies you can connect to couple of proxies on you list, like 2 or 3 with 'proxy -c 2', the  from this proxy you can connect to few more random proxies with 'proxy -q'.
- This way, the last proxy on your chain is a random proxy that after using it you will never be there again, so even of someone get this proxy ip from a log, they can't trace back to you.
- Remember to always clean your proxies with proxy -clean