# NTRUEncrypt for in game SSH encryption, indev 0.0.1 version tutorial

Algorith made by Reo, guide by rocketorbit.

This tutorial is for windows, and it includes a python venv

1. run gen_key.bat to generate a key pair.
2. open encode.gs, scroll down to the bottom, find a commend with `COPY YOUR PUBLIC KEY HERE`, replace the comment with public key from the output.
3. open decode.gs, scroll down to the bottom, find a commend with `COPY YOUR PRIVATE KEY HERE`, replace the comment with private key from the output.
4. in game, replace encode.src and decode.bin with them.