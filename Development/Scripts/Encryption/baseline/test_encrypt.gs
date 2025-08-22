//////////////////////////////////////////////////////////
// Script Name: test_encrypt
// Author: Lexsor
// Created: 21 AUG 2025
// Version: 0.1
// Purpose: Test script for AES encryption using aes256.gs
// Changelog: [YYYY-MM-DD] v[VERSION] - [Changes made]
//////////////////////////////////////////////////////////

import_code("/opt/AES256.bin")

AES = AES256.bin

plaintext = [1, 35, 69, 103, 137, 171, 205, 239, 18, 52, 86, 120, 154, 188, 222, 255]
key = []
for i in range(0, 31)
    key.push(i)
end for

enc = AES.encrypt(plaintext, key)
print("Encrypted: " + str(enc))

dec = AES.decrypt(enc, key)
print("Decrypted: " + str(dec))

