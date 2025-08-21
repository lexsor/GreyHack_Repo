AES256 = {}

// AES S-Box (Substitution Box) - Converted from hex to decimal
AES256.s_box = [
    99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
    202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192,
    183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21,
    4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117]

// **SubBytes Transformation**
AES256.sub_bytes = function(state)
    for i in range(0, state.len - 1)
        state[i] = AES256.s_box[state[i] % AES256.s_box.len] // Use modulus to prevent overflow
    end for
    return state
end function

// **ShiftRows Transformation**
AES256.shift_rows = function(state)
    temp = state[:]
    state[1] = temp[5]
    state[5] = temp[9]
    state[9] = temp[13]
    state[13] = temp[1]
    
    state[2] = temp[10]
    state[6] = temp[14]
    state[10] = temp[2]
    state[14] = temp[6]

    state[3] = temp[15]
    state[7] = temp[3]
    state[11] = temp[7]
    state[15] = temp[11]

    return state
end function

AES256.galois_mult = function(a, b)
    p = 0
    counter = 0
    while counter < 8
        if bitwise("&", b, 1) == 1 then
            p = bitwise("^", p, a)
        end if

        hi_bit = bitwise("&", a, 128)
        a = bitwise("&", bitwise("<<", a, 1), 255)
        if hi_bit == 128 then
            a = bitwise("^", a, 27)
        end if

        b = bitwise(">>", b, 1)
        counter = counter + 1
    end while
    return bitwise("&", p, 255)
end function

AES256.mix_columns = function(state)
    for c in range(0, 3)
        col = []
        for r in range(0, 3)
            col.push(state[c * 4 + r])
        end for

        state[c * 4 + 0] = bitwise("^", bitwise("^", bitwise("^",
            AES256.galois_mult(col[0], 2),
            AES256.galois_mult(col[1], 3)),
            col[2]),
            col[3]
        )

        state[c * 4 + 1] = bitwise("^", bitwise("^", bitwise("^",
            col[0],
            AES256.galois_mult(col[1], 2)),
            AES256.galois_mult(col[2], 3)),
            col[3]
        )

        state[c * 4 + 2] = bitwise("^", bitwise("^", bitwise("^",
            col[0],
            col[1]),
            AES256.galois_mult(col[2], 2)),
            AES256.galois_mult(col[3], 3)
        )

        state[c * 4 + 3] = bitwise("^", bitwise("^", bitwise("^",
            AES256.galois_mult(col[0], 3),
            col[1]),
            col[2]),
            AES256.galois_mult(col[3], 2)
        )
    end for

    return state
end function

// **AddRoundKey Transformation**
AES256.add_round_key = function(state, round_key)
    for i in range(0, 15)
        state[i] = bitwise("^", state[i], round_key[i])
    end for
    return state
end function

// **Key Expansion (Simplified)**
AES256.key_expansion = function(key)
    expanded_key = key[:]
    for i in range(16, 31)
        expanded_key.push(expanded_key[i - 16] ^ expanded_key[i - 1])
    end for
    return expanded_key
end function

// **AES-256 Encryption Function**
AES256.encrypt = function(plaintext, key)
    if plaintext.len != 16 or key.len != 32 then return "Invalid input size"

    round_keys = AES256.key_expansion(key)
    state = plaintext[:]

    state = AES256.add_round_key(state, round_keys[:16])

    for round in range(1, 13)
        state = AES256.sub_bytes(state)
        state = AES256.shift_rows(state)
        state = AES256.mix_columns(state)
        state = AES256.add_round_key(state, round_keys[round * 16:(round + 1) * 16])
    end for

    // Final round (No MixColumns)
    state = AES256.sub_bytes(state)
    state = AES256.shift_rows(state)
    state = AES256.add_round_key(state, round_keys[208:224]) // Last key

    return state
end function

// **AES-256 Decryption (Inverse Steps)**
AES256.decrypt = function(ciphertext, key)
    if ciphertext.len != 16 or key.len != 32 then return "Invalid input size"

    round_keys = AES256.key_expansion(key)
    state = ciphertext[:]

    state = AES256.add_round_key(state, round_keys[208:224])
    state = AES256.shift_rows(state) // Reverse shift
    state = AES256.sub_bytes(state) // Reverse substitution

    for round in range(12, 0, -1)
        state = AES256.add_round_key(state, round_keys[round * 16:(round + 1) * 16])
        state = AES256.mix_columns(state) // Reverse MixColumns
        state = AES256.shift_rows(state)
        state = AES256.sub_bytes(state)
    end for

    state = AES256.add_round_key(state, round_keys[:16]) // Initial key

    return state
end function

return AES256
