//NTRU parameters
n = 509
p = 3
q = 2048

//Polynomial wheels
mod = function(a, b)
    ret = a % b
    if ret >= 0 then return ret  else return ret+b
end function
polyNormalize = function(a)
    while a and a[-1] == 0
        a.pop
    end while
    if not a then a.push(0)
    return a
end function
polyModp=function(a,p)
    i=0
    b=a[:]
    while i<a.len
        b[i]=mod(a[i],p)
        i=i+1
    end while
    return polyNormalize(b)
end function
PolyConv=function(a,b,p)
    A=a[:]
    B=b[:]
    if a.len>b.len then
        max_n=a.len
        B=B+[0]*(a.len-b.len)
    else
        max_n=b.len
        A=A+[0]*(b.len-a.len)
    end if

    C=[0]*max_n
    i=0
    while i<max_n
        j=0
        while j<max_n
            C[(i+j)%max_n]=C[(i+j)%max_n]+A[i]*B[j]
            j=j+1
        end while
        i=i+1
    end while
    return polyNormalize(polyModp(C,p))
end function

//f, fp are private keys


// COPY YOUR PRIVATE KEY HERE

NTRUDecode=function(e,p,q) //NTRU decrypting
    a=PolyConv(f,e,q)
    i=0
    while i<a.len
        if a[i]>q/2 then
            a[i]=a[i]-q
        end if
        i=i+1
    end while
    c=PolyConv(fp,a,p)
    return c
end function

BinaryDecode = function(s)
    ret = ""
    for i in range(0, s.len - 1, 8)
        num = s[i] * 128 + s[i + 1] * 64 + s[i + 2] * 32 + s[i + 3] * 16 +  s[i + 4] * 8 + s[i + 5] * 4 + s[i + 6] * 2 + s[i + 7] * 1
        if num == 0 then continue
        ret = ret + char(num)
    end for
    return ret
end function

Decode = function(password)
    e = []
    for c in password.split("_")
        e.push(val(c))
    end for
    e = e[:n]
    e = e + [0] * (n - e.len)
    m = NTRUDecode(e, p, q)
    while m and m[-1] == 0
        m.pop
    end while
    m = m + [0] * (8 - (m.len % 8))
    return BinaryDecode(m)
end function