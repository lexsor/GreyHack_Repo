from Util import *
from sympy import ZZ, Poly,symbols
from collections import Counter
def Reverse(lst): 
    return list(reversed(lst))
f=None
fp=None
fq=None
x=symbols('x')
#N=input("input N:")
#p=input("input p:")
#q=input("q")
N=509
p=3
q=2048
R_coef=[1]+(N-1)*[0]+[-1]
R = Poly(R_coef, x).set_domain(ZZ)
g=random_poly(N,int(math.sqrt(q)))
while True:
    f=random_poly(N,N//3,neg_ones_diff=-1)
    try:
        fp=invert_poly(f,R,p)
        fq=invert_poly(f,R,q)
        break
    except:
        pass

h=(fq*p).trunc(q)
print("//PUBLIC KEY")
print(f"h = {Reverse(h.all_coeffs())}")
print()
print("//PRIVATE KEY")
print(f"f = {Reverse(f.all_coeffs())}")
print(f"fp = {Reverse(fp.all_coeffs())}")