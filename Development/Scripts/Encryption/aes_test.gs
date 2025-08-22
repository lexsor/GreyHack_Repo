AES = import("/opt/crypto/aes256")

// --- CBC demo ---
iv = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] // use random 16 bytes in practice
pw = "super_secret_password_32bytes_long!"
msg = "GreyHackRocks!"

ct_hex = AES.encrypt_text_cbc(msg, pw, iv)
print("CBC CT(hex): " + ct_hex)

pt = AES.decrypt_text_cbc(AES.BYTES.from_hex(ct_hex), pw, iv)
print("CBC PT: " + pt)

// --- CTR demo ---
nonce = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2] // use random 16 bytes; keep with the ciphertext
ct_hex2 = AES.encrypt_text_ctr(msg, pw, nonce)
print("CTR CT(hex): " + ct_hex2)

pt2 = AES.decrypt_text_ctr(AES.BYTES.from_hex(ct_hex2), pw, nonce)
print("CTR PT: " + pt2)
