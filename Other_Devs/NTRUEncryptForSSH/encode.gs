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
polyAdd = function(a, b)
    if a.len < b.len then minLen = a.len else minLen = b.len
    ret = [0] * minLen
    i = 0
    while i < minLen
        ret[i] = a[i] + b[i]
        i = i + 1
    end while
    ret = ret + a[minLen:] + b[minLen:]
    return ret
end function
polyMul = function(a, b)
    aLen = a.len
    bLen = b.len
    ret = [0] * (aLen + bLen - 1)
    i = 0
    while i < aLen
        j = 0
        while j < bLen
            ret[i + j] = ret[i + j] + a[i] * b[j]
            j = j + 1
        end while
        i = i + 1
    end while
    return ret
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
rndPoly = function(p)
    ret = [0] * (n)
    i = 0
    while i < ret.len
        ret[i] = floor(rnd * 3)-1
        i = i + 1
    end while
    return polyNormalize(ret)
end function

//h is public key



// COPY YOUR PUBLIC KEY HERE

NTRUEncode=function(m,p,q) //NTRU encryting
    phi=rndPoly(3)
    e=polyModp(polyAdd(PolyConv(polyModp(polyMul([p],phi),q),h,q),m),q)
    return e
end function

BinaryEncode = function(s)
    ret = []
    s = s.values
    s.reverse
    for c in s
        c = c.code
        lst = []
        while c > 0
            lst = [c % 2] + lst
            c = floor(c / 2)
        end while
        lst = [0] * (8 - lst.len) + lst
        ret = lst + ret
    end for
    return ret
end function

Encode = function(password)
    m = BinaryEncode(password)[:n] //string to binary
    m = m + [0] * (n - m.len) //append zeros
    e = NTRUEncode(m, p, q)
    return e.join("_")
end function