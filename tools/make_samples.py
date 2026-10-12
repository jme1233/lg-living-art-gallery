"""Rebuild original geometric test artwork. Requires Pillow and numpy.
This script is optional; committed JPEGs are all the browser needs.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artwork'
OUT.mkdir(exist_ok=True)
W, H = 3840, 2160
y, x = np.mgrid[0:H, 0:W]

def background(top, bottom, glow=None):
    t = (y / (H - 1))[:, :, None]
    pixels = np.array(top) * (1 - t) + np.array(bottom) * t
    if glow:
        cx, cy, color, spread = glow
        weight = np.exp(-((x-cx)**2 + (y-cy)**2) / spread**2)[:, :, None]
        pixels = pixels * (1-weight*.55) + np.array(color)*weight*.55
    return Image.fromarray(np.clip(pixels, 0, 255).astype('uint8'))

def save(im, name):
    im.save(OUT / name, 'JPEG', quality=92, optimize=True, progressive=False, subsampling=0)

im = background((5, 12, 24), (40, 65, 71), (2800, 580, (85, 96, 108), 1100))
d = ImageDraw.Draw(im)
d.ellipse((2670, 355, 3120, 805), fill=(198, 175, 132))
d.polygon([(0,1700),(620,800),(1200,1520),(1950,610),(2700,1560),(3340,900),(3840,1540),(3840,H),(0,H)], fill=(10,22,33))
d.polygon([(0,1930),(780,1360),(1560,1860),(2200,1240),(3200,1760),(3840,1530),(3840,H),(0,H)], fill=(17,39,47))
d.polygon([(0,2030),(1100,1790),(2390,2070),(3840,1850),(3840,H),(0,H)], fill=(25,53,55))
save(im, 'moonlit-ridge.jpg')

im = background((5,12,18), (18,41,43), (1900,950,(34,63,68),1600))
d = ImageDraw.Draw(im)
for offset, color, stroke in [(0,(150,119,69),64),(210,(35,99,106),80),(460,(82,70,110),70)]:
    points = [(i,int(1050+600*np.sin(i/870.0+0.65)+offset)) for i in range(-100,W+101,8)]
    d.line(points, fill=color, width=stroke, joint='curve')
save(im, 'tidal-ribbons.jpg')

im = background((26,43,52), (156,125,92), (2500,950,(203,169,114),1000))
d = ImageDraw.Draw(im)
d.ellipse((2390,670,2650,930), fill=(218,187,133))
d.polygon([(0,1260),(500,1090),(1000,1250),(1900,1160),(2900,1300),(3840,1100),(3840,H),(0,H)], fill=(64,87,88))
d.polygon([(0,1570),(900,1460),(1950,1600),(2900,1440),(3840,1610),(3840,H),(0,H)], fill=(36,60,65))
d.polygon([(0,1930),(730,1790),(1810,1900),(3040,1760),(3840,1940),(3840,H),(0,H)], fill=(16,33,41))
save(im, 'quiet-horizon.jpg')
print('Created three 3840 x 2160 baseline JPEG samples.')
