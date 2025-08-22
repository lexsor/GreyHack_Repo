//////////////////////////////////////////////////////////
// Script Name: aes256
// Author: Lexsor
// Created: 20 AUG 2025
// Version: 0.2
// Purpose: algorithm for AES-256 encryption and decryption
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

// /opt/crypto/aes256.src
// Single-file AES-256 for Grey Hack (CBC & CTR modes) + helpers + wrappers
// Returns AESLIB object.
//
// Public quick wrappers:
//   ct_hex = AESLIB.encrypt_text_cbc("hello", "password", iv16)
//   pt     = AESLIB.decrypt_text_cbc(AESLIB.BYTES.from_hex(ct_hex), "password", iv16)
//   ct_hex = AESLIB.encrypt_text_ctr("hello", "password", nonce16)
//   pt     = AESLIB.decrypt_text_ctr(AESLIB.BYTES.from_hex(ct_hex), "password", nonce16)

AESLIB = {}
AESLIB.BYTES = {}
AESLIB.AES256 = {}
AESLIB.MODES = {}

// -------------------- Small utils --------------------
slice = function(arr, start, end_exclusive)
    out = []
    i = start
    while i < end_exclusive
        out.push(arr[i])
        i = i + 1
    end while
    return out
end function

append_inplace = function(dst, src)
    i = 0
    while i < len(src)
        dst.push(src[i])
        i = i + 1
    end while
    return dst
end function

// -------------------- BYTES helpers --------------------
AESLIB.BYTES.str_to_bytes = function(s)
    out = []
    i = 0
    while i < len(s)
        out.push(ord(s[i]) % 256)
        i = i + 1
    end while
    return out
end function

AESLIB.BYTES.bytes_to_str = function(b)
    s = ""
    i = 0
    while i < len(b)
        s = s + chr(b[i])
        i = i + 1
    end while
    return s
end function

// printable hex (for storing/printing ciphertext safely)
_hexmap = "0123456789abcdef"
AESLIB.BYTES.to_hex = function(b)
    s = ""
    i = 0
    while i < len(b)
        v = b[i]
        hi = (v / 16) % 16
        lo = v % 16
        s = s + _hexmap[hi] + _hexmap[lo]
        i = i + 1
    end while
    return s
end function

hex_val = function(ch)
    // '0'..'9' => 48..57 ; 'a'..'f' => 97..102 ; 'A'..'F' => 65..70
    c = ord(ch)
    if c >= 48 and c <= 57 then return c - 48 end if
    if c >= 97 and c <= 102 then return c - 87 end if
    if c >= 65 and c <= 70 then return c - 55 end if
    return 0
end function

AESLIB.BYTES.from_hex = function(h)
    out = []
    i = 0
    n = len(h)
    while i + 1 < n
        hi = hex_val(h[i])
        lo = hex_val(h[i+1])
        out.push((hi * 16 + lo) % 256)
        i = i + 2
    end while
    return out
end function

// Derive 32-byte key from password using repeated md5() (hex string -> bytes)
AESLIB.BYTES.key32_from_password = function(password)
    key = []
    prev = password
    while len(key) < 32
        h = md5(prev) // returns hex string length 32
        hb = AESLIB.BYTES.from_hex(h)
        // append up to remaining bytes
        i = 0
        while i < len(hb) and len(key) < 32
            key.push(hb[i])
            i = i + 1
        end while
        prev = h
    end while
    return key
end function

// -------------------- PKCS#7 for CBC --------------------
AESLIB.MODES.pkcs7_pad = function(bytes, block)
    rem = len(bytes) % block
    pad = block - rem
    if pad == 0 then pad = block end if
    out = []
    append_inplace(out, bytes)
    i = 0
    while i < pad
        out.push(pad)
        i = i + 1
    end while
    return out
end function

AESLIB.MODES.pkcs7_unpad = function(bytes, block)
    if len(bytes) == 0 then return [] end if
    pad = bytes[len(bytes)-1]
    if pad <= 0 or pad > block then
        // bad pad: return original (or empty)
        return []
    end if
    // check pad consistency
    i = 0
    while i < pad
        if bytes[len(bytes)-1 - i] <> pad then
            return []
        end if
        i = i + 1
    end while
    return slice(bytes, 0, len(bytes)-pad)
end function

// -------------------- AES-256 CORE --------------------
A = AESLIB.AES256

// GF helpers (decimal only; no hex literals)
A.xtime = function(a)
    a2 = bitwise("&", bitwise("<<", a, 1), 255)
    if bitwise("&", a, 128) != 0 then
        a2 = bitwise("^", a2, 27) // 0x1B
    end if
    return a2
end function

A.gmul = function(a, b)
    p = 0
    i = 0
    while i < 8
        if bitwise("&", b, 1) != 0 then
            p = bitwise("^", p, a)
        end if
        hi = bitwise("&", a, 128)
        a = bitwise("&", bitwise("<<", a, 1), 255)
        if hi != 0 then a = bitwise("^", a, 27) end if
        b = bitwise(">>", b, 1)
        i = i + 1
    end while
    return bitwise("&", p, 255)
end function

// Build S-box and inverse S-box at runtime
A.init_sboxes = function()
    if A.s_box then return end if

    s = []
    inv = []
    i = 0
    while i < 256
        s.push(0)
        inv.push(0)
        i = i + 1
    end while

    p = 1
    q = 1
    // Generate S-box per Rijndael spec (decimal)
    while true
        // p = p * 3 (in GF) => p ^= xtime(p)
        p = bitwise("^", p, A.xtime(p))

        // q = q / 3 == q * 0xF6; implemented via sequence of xtime/xors
        // Multiply by 0xF6 (246) = 11110110b:
        // q = q ^ xtime(q) ^ xtime(xtime(q)) ^ xtime(xtime(xtime(xtime(q))))
        t1 = A.xtime(q)
        t2 = A.xtime(t1)
        t4 = A.xtime(A.xtime(t2))
        q = bitwise("^", bitwise("^", q, t1), bitwise("^", t2, t4))

        // affine transform: x ^ rotl1(x) ^ rotl2(x) ^ rotl3(x) ^ rotl4(x) ^ 0x63
        // rotl within 8 bits
        rot1 = bitwise("^", bitwise("&", bitwise("<<", q, 1), 255), bitwise(">>", q, 7))
        rot2 = bitwise("^", bitwise("&", bitwise("<<", q, 2), 255), bitwise(">>", q, 6))
        rot3 = bitwise("^", bitwise("&", bitwise("<<", q, 3), 255), bitwise(">>", q, 5))
        rot4 = bitwise("^", bitwise("&", bitwise("<<", q, 4), 255), bitwise(">>", q, 4))
        xformed = bitwise("^", bitwise("^", bitwise("^", bitwise("^", q, rot1), rot2), rot3), rot4)
        s[p] = bitwise("^", xformed, 99) // 0x63

        if p == 1 then break end if
    end while
    s[0] = 99

    i = 0
    while i < 256
        inv[s[i]] = i
        i = i + 1
    end while

    A.s_box = s
    A.inv_s_box = inv
end function

// Byte-wise transforms
A.sub_bytes = function(st)
    i = 0
    while i < 16
        st[i] = A.s_box[st[i]]
        i = i + 1
    end while
    return st
end function

A.inv_sub_bytes = function(st)
    i = 0
    while i < 16
        st[i] = A.inv_s_box[st[i]]
        i = i + 1
    end while
    return st
end function

A.shift_rows = function(st)
    // row1 left rotate 1
    t = st[1]; st[1]=st[5]; st[5]=st[9]; st[9]=st[13]; st[13]=t
    // row2 left rotate 2
    t0 = st[2]; t1 = st[6]; st[2]=st[10]; st[6]=st[14]; st[10]=t0; st[14]=t1
    // row3 left rotate 3 (right rotate 1)
    t = st[15]; st[15]=st[11]; st[11]=st[7]; st[7]=st[3]; st[3]=t
    return st
end function

A.inv_shift_rows = function(st)
    // inverse of above
    t = st[13]; st[13]=st[9]; st[9]=st[5]; st[5]=st[1]; st[1]=t
    t0 = st[10]; t1 = st[14]; st[10]=st[2]; st[14]=st[6]; st[2]=t0; st[6]=t1
    t = st[3]; st[3]=st[7]; st[7]=st[11]; st[11]=st[15]; st[15]=t
    return st
end function

A.mix_columns = function(st)
    c = 0
    while c < 4
        i0 = 4*c+0; i1 = 4*c+1; i2 = 4*c+2; i3 = 4*c+3
        a0 = st[i0]; a1 = st[i1]; a2 = st[i2]; a3 = st[i3]
        st[i0] = bitwise("^", bitwise("^", A.gmul(a0,2), A.gmul(a1,3)), bitwise("^", a2, a3))
        st[i1] = bitwise("^", bitwise("^", a0, A.gmul(a1,2)), bitwise("^", A.gmul(a2,3), a3))
        st[i2] = bitwise("^", bitwise("^", a0, a1), bitwise("^", A.gmul(a2,2), A.gmul(a3,3)))
        st[i3] = bitwise("^", bitwise("^", A.gmul(a0,3), a1), bitwise("^", a2, A.gmul(a3,2)))
        c = c + 1
    end while
    return st
end function

A.inv_mix_columns = function(st)
    c = 0
    while c < 4
        i0 = 4*c+0; i1 = 4*c+1; i2 = 4*c+2; i3 = 4*c+3
        a0 = st[i0]; a1 = st[i1]; a2 = st[i2]; a3 = st[i3]
        st[i0] = bitwise("^", bitwise("^", A.gmul(a0,14), A.gmul(a1,11)), bitwise("^", A.gmul(a2,13), A.gmul(a3,9)))
        st[i1] = bitwise("^", bitwise("^", A.gmul(a0,9),  A.gmul(a1,14)), bitwise("^", A.gmul(a2,11), A.gmul(a3,13)))
        st[i2] = bitwise("^", bitwise("^", A.gmul(a0,13), A.gmul(a1,9)),  bitwise("^", A.gmul(a2,14), A.gmul(a3,11)))
        st[i3] = bitwise("^", bitwise("^", A.gmul(a0,11), A.gmul(a1,13)), bitwise("^", A.gmul(a2,9),  A.gmul(a3,14)))
        c = c + 1
    end while
    return st
end function

A.add_round_key = function(st, rk)
    i = 0
    while i < 16
        st[i] = bitwise("^", st[i], rk[i])
        i = i + 1
    end while
    return st
end function

// Rcon (first 15) decimal
A.rcon = [1,2,4,8,16,32,64,128,27,54,108,216,171,77,154]

A.rot_word = function(w) // [b0,b1,b2,b3]
    return [w[1], w[2], w[3], w[0]]
end function

A.sub_word = function(w)
    return [A.s_box[w[0]], A.s_box[w[1]], A.s_box[w[2]], A.s_box[w[3]]]
end function

A.key_expansion_256 = function(key32)
    // W: 60 words (4 bytes each)
    W = []
    i = 0
    while i < 8
        W.push([key32[4*i+0], key32[4*i+1], key32[4*i+2], key32[4*i+3]])
        i = i + 1
    end while

    i = 8
    rci = 0
    while i < 60
        temp = W[i-1][:]
        if i % 8 == 0 then
            temp = A.sub_word(A.rot_word(temp))
            temp[0] = bitwise("^", temp[0], A.rcon[rci])
            rci = rci + 1
        elseif i % 8 == 4 then
            temp = A.sub_word(temp)
        end if
        wp = W[i-8]
        W.push([ bitwise("^", wp[0], temp[0]),
                 bitwise("^", wp[1], temp[1]),
                 bitwise("^", wp[2], temp[2]),
                 bitwise("^", wp[3], temp[3]) ])
        i = i + 1
    end while

    // flatten 60*4 = 240 bytes
    out = []
    i = 0
    while i < len(W)
        append_inplace(out, W[i])
        i = i + 1
    end while
    return out
end function

A.encrypt_block = function(pt16, key32)
    if len(pt16) <> 16 or len(key32) <> 32 then return null end if
    if not A.s_box then A.init_sboxes() end if

    rk = A.key_expansion_256(key32)
    st = pt16[:]

    // round 0
    st = A.add_round_key(st, slice(rk, 0, 16))

    // rounds 1..13
    r = 1
    while r <= 13
        st = A.sub_bytes(st)
        st = A.shift_rows(st)
        st = A.mix_columns(st)
        st = A.add_round_key(st, slice(rk, 16*r, 16*(r+1)))
        r = r + 1
    end while

    // final (no MixColumns)
    st = A.sub_bytes(st)
    st = A.shift_rows(st)
    st = A.add_round_key(st, slice(rk, 224, 240))
    return st
end function

A.decrypt_block = function(ct16, key32)
    if len(ct16) <> 16 or len(key32) <> 32 then return null end if
    if not A.s_box then A.init_sboxes() end if

    rk = A.key_expansion_256(key32)
    st = ct16[:]

    // inverse final
    st = A.add_round_key(st, slice(rk, 224, 240))
    st = A.inv_shift_rows(st)
    st = A.inv_sub_bytes(st)

    // rounds 13..1
    r = 13
    while r >= 1
        st = A.add_round_key(st, slice(rk, 16*r, 16*(r+1)))
        st = A.inv_mix_columns(st)
        st = A.inv_shift_rows(st)
        st = A.inv_sub_bytes(st)
        r = r - 1
    end while

    // round 0
    st = A.add_round_key(st, slice(rk, 0, 16))
    return st
end function

// -------------------- Modes: CBC & CTR --------------------
M = AESLIB.MODES

M.xor_block = function(a, b)
    out = []
    i = 0
    while i < 16
        out.push(bitwise("^", a[i], b[i]))
        i = i + 1
    end while
    return out
end function

M.cbc_encrypt = function(plain_bytes, key32, iv16)
    // PKCS#7 pad
    data = AESLIB.MODES.pkcs7_pad(plain_bytes, 16)
    out = []
    prev = iv16[:]
    i = 0
    while i < len(data)
        blk = slice(data, i, i+16)
        x = M.xor_block(blk, prev)
        c = A.encrypt_block(x, key32)
        append_inplace(out, c)
        prev = c
        i = i + 16
    end while
    return out
end function

M.cbc_decrypt = function(cipher_bytes, key32, iv16)
    out = []
    prev = iv16[:]
    i = 0
    while i < len(cipher_bytes)
        cblk = slice(cipher_bytes, i, i+16)
        x = A.decrypt_block(cblk, key32)
        pblk = M.xor_block(x, prev)
        append_inplace(out, pblk)
        prev = cblk
        i = i + 16
    end while
    // unpad
    return AESLIB.MODES.pkcs7_unpad(out, 16)
end function

// CTR keystream: nonce||counter (16 bytes)
// We’ll treat bytes 12..15 as a uint32 counter.
M.ctr_xcrypt = function(bytes, key32, nonce16)
    out = []
    counter = 0
    i = 0
    while i < len(bytes)
        // build counter block
        block = nonce16[:]
        c0 = bitwise("&", counter, 255)
        c1 = bitwise("&", bitwise(">>", counter, 8), 255)
        c2 = bitwise("&", bitwise(">>", counter, 16), 255)
        c3 = bitwise("&", bitwise(">>", counter, 24), 255)
        block[12] = c3; block[13] = c2; block[14] = c1; block[15] = c0  // big-endian

        ks = A.encrypt_block(block, key32)
        j = 0
        while j < 16 and (i + j) < len(bytes)
            out.push(bitwise("^", bytes[i+j], ks[j]))
            j = j + 1
        end while

        counter = (counter + 1) % 4294967296
        i = i + 16
    end while
    return out
end function

// -------------------- Friendly text wrappers --------------------
// CBC: returns hex string by default (easy to store)
AESLIB.encrypt_text_cbc = function(text, password, iv16)
    key32 = AESLIB.BYTES.key32_from_password(password)
    pt    = AESLIB.BYTES.str_to_bytes(text)
    ct    = AESLIB.MODES.cbc_encrypt(pt, key32, iv16)
    return AESLIB.BYTES.to_hex(ct)
end function

AESLIB.decrypt_text_cbc = function(cipher_bytes, password, iv16)
    key32 = AESLIB.BYTES.key32_from_password(password)
    pt    = AESLIB.MODES.cbc_decrypt(cipher_bytes, key32, iv16)
    return AESLIB.BYTES.bytes_to_str(pt)
end function

// CTR: returns hex string by default (no padding used)
AESLIB.encrypt_text_ctr = function(text, password, nonce16)
    key32 = AESLIB.BYTES.key32_from_password(password)
    pt    = AESLIB.BYTES.str_to_bytes(text)
    ct    = AESLIB.MODES.ctr_xcrypt(pt, key32, nonce16)
    return AESLIB.BYTES.to_hex(ct)
end function

AESLIB.decrypt_text_ctr = function(cipher_bytes, password, nonce16)
    key32 = AESLIB.BYTES.key32_from_password(password)
    pt    = AESLIB.MODES.ctr_xcrypt(cipher_bytes, key32, nonce16)
    return AESLIB.BYTES.bytes_to_str(pt)
end function

return AESLIB
