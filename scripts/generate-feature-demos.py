"""Render storyboard animations from the real library previews and existing CSP frame.

These are edited feature demonstrations, not recordings or measured search results.
Requires Pillow, numpy and imageio-ffmpeg. Paths are authoring inputs, never production dependencies.
"""
from pathlib import Path
import argparse
import json
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp/media-tools.local"))
import imageio_ffmpeg

W, H, FPS, SECONDS = 1120, 700, 12, 10
OUT = ROOT / "public/assets/open-beta"
INK, CORAL, MUTED = "#152238", "#ff6b57", "#667085"
FONT = Path("C:/Windows/Fonts/malgun.ttf")
BOLD = Path("C:/Windows/Fonts/malgunbd.ttf")
FONTS = {}
ROUGH_CACHE = {}

def font(size=18, bold=False):
    key = (size, bold)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(str(BOLD if bold else FONT), size)
    return FONTS[key]

def text(im, xy, value, size=18, color=INK, bold=False):
    ImageDraw.Draw(im).text(xy, value, font=font(size, bold), fill=color)

def box(im, bounds, fill="white", radius=12, outline=None, width=1):
    ImageDraw.Draw(im).rounded_rectangle(bounds, radius=radius, fill=fill, outline=outline, width=width)

def ease(t):
    t = min(1, max(0, t))
    return t*t*(3-2*t)

def cursor(im, x, y, press=False):
    d = ImageDraw.Draw(im)
    if press: d.ellipse((x-13, y-13, x+13, y+13), outline=CORAL, width=3)
    d.polygon([(x,y),(x+5,y+26),(x+12,y+18),(x+22,y+20)], fill="white", outline=INK)

def cutout(image):
    im = image.convert("RGBA")
    arr = np.array(im)
    # Library thumbnails have a uniform gray background. Keep the actual rendered mesh.
    bg = arr[0, 0, :3].astype(float)
    dist = np.max(np.abs(arr[:,:,:3].astype(float)-bg), axis=2)
    arr[:,:,3] = np.clip((dist-6)*30, 0, 255).astype(np.uint8)
    result = Image.fromarray(arr)
    bbox = result.getbbox()
    return result.crop(bbox) if bbox else result

def place(im, sprite, center, height, width_factor=1, opacity=1):
    size = (int(sprite.width*height/sprite.height*width_factor), int(height))
    spr = sprite.resize(size, Image.Resampling.LANCZOS)
    if opacity < 1: spr.putalpha(spr.getchannel("A").point(lambda x:int(x*opacity)))
    im.alpha_composite(spr, (int(center[0]-size[0]/2), int(center[1]-size[1]/2)))

def silhouette(sprite):
    key = (sprite.size, sprite.getchannel("A").tobytes())
    if key in ROUGH_CACHE:
        return ROUGH_CACHE[key]
    # Fill mesh shading holes and draw an antialiased outline at larger resolution.
    mask = ImageOps.expand(sprite.getchannel("A").point(lambda p: 255 if p > 30 else 0), border=2)
    ImageDraw.floodfill(mask, (0, 0), 128)
    mask = mask.point(lambda p: 0 if p == 128 else 255).crop((2,2,sprite.width+2,sprite.height+2))
    mask = mask.resize((sprite.width*3,sprite.height*3),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(2))
    mask = mask.point(lambda p: 255 if p > 100 else 0)
    edge = Image.fromarray(np.maximum(0, np.array(mask.filter(ImageFilter.MaxFilter(5))).astype(int)-np.array(mask.filter(ImageFilter.MinFilter(5))).astype(int)).astype(np.uint8))
    edge = edge.filter(ImageFilter.GaussianBlur(.6)).point(lambda p:int(p*.72))
    result = Image.new("RGBA", mask.size, (85,139,204,0))
    result.putalpha(edge)
    ROUGH_CACHE[key] = result
    return result

def shaped(sprite, value):
    # Illustrative interpolation of body proportions, not a model-inference output.
    split = int(sprite.height*.48)
    top = sprite.crop((0,0,sprite.width,split))
    legs = sprite.crop((0,split,sprite.width,sprite.height))
    top = top.resize((int(top.width*(1-.12*value)), top.height),Image.Resampling.LANCZOS)
    legs = legs.resize((int(legs.width*(1-.07*value)), int(legs.height*(1+.20*value))),Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (sprite.width,top.height+legs.height))
    canvas.alpha_composite(top,((sprite.width-top.width)//2,0))
    canvas.alpha_composite(legs,((sprite.width-legs.width)//2,top.height))
    return canvas

def base(background, step):
    im = background.copy()
    # Replace only the drawing canvas with a storyboard example; preserve CSP chrome.
    ImageDraw.Draw(im).rectangle((236,77,644,634),fill="#fffefa")
    for y in range(110,630,46): ImageDraw.Draw(im).line((244,y,636,y),fill="#eff2f7")
    box(im,(262,94,457,126),fill="#edf2fa",radius=8)
    text(im,(275,100),"작업 중인 러프",15,MUTED,True)
    ImageDraw.Draw(im).rectangle((0,654,W,H),fill=INK)
    text(im,(24,668),step,18,"white",True)
    text(im,(864,671),"화면·동작 재구성 예시",13,"#bcc9da")
    return im

def window(im, title, badge=""):
    box(im,(505,75,1095,632),fill="#ffffff",radius=16,outline="#d5dce7",width=2)
    box(im,(506,76,1094,119),fill="#f4f6fa",radius=15)
    ImageDraw.Draw(im).rectangle((507,104,1093,119),fill="#f4f6fa")
    box(im,(520,86,543,109),INK,7)
    text(im,(526,85),"S",16,CORAL,True)
    text(im,(553,87),"Standin",14,INK,True)
    text(im,(651,86),title,17,INK,True)
    text(im,(1055,85),"—",18,MUTED)
    if badge: text(im,(524,600),badge,13,MUTED)

def make_text(t, bg, photos, posed):
    if t < 2.2: step="01  원하는 자세를 문장으로 검색"
    elif t < 6.3: step="02  결과를 아래로 넘기며 포즈 비교"
    else: step="03  원하는 포즈를 선택해 작화 화면으로"
    im=base(bg,step)
    place(im,silhouette(posed),(376,378),330)
    window(im,"문장으로 포즈 찾기","검색 화면 개편 예정 · 상단 검색 + 스크롤 결과 예시")
    box(im,(524,135,1076,188),fill="#f5f7fa",radius=12,outline="#d6dde7")
    q="역동적으로 팔을 뻗은 스포츠 자세"
    shown=q[:int(len(q)*ease(t/1.65))]
    text(im,(540,150),shown,18,INK,True)
    box(im,(1009,143,1068,180),CORAL,9)
    text(im,(1021,149),"검색",16,"white",True)
    if t > 1.8:
        text(im,(528,201),"포즈 라이브러리에서 살펴보기",15,MUTED)
        grid=Image.new("RGBA",(552,360),(255,255,255,255))
        offset=int(194*ease((t-3.4)/1.5))
        for n in range(12):
            x=(n%4)*140;y=(n//4)*194-offset
            # The selected fifth tile must match the pose placed on the canvas.
            ph=photos[(n-4)%len(photos)].resize((130,148),Image.Resampling.LANCZOS)
            grid.paste(ph,(x,y))
            text(grid,(x+7,y+153),f"포즈 {n+1:02}",14,INK,True)
            text(grid,(x+7,y+174),"스포츠 · 동작",11,MUTED)
            if n==4 and t>5.9:
                ImageDraw.Draw(grid).rectangle((x+1,y+1,x+128,y+147),outline=CORAL,width=4)
        im.alpha_composite(grid,(524,227))
        ImageDraw.Draw(im).rounded_rectangle((1082,234+int(98*ease((t-3.4)/1.5)),1086,324+int(98*ease((t-3.4)/1.5))),radius=2,fill="#bbc4d2")
    if t<2.2: cursor(im,1039,161,1.8<t<2.2)
    elif t<6.3: cursor(im,950,404)
    else:
        p=ease((t-6.3)/1.3)
        cursor(im,582+(376-582)*p,350+(400-350)*p,6.3<t<6.5)
        if p>0: place(im,posed,(582+(376-582)*p,350+(378-350)*p),190+140*p,opacity=.35+.65*p)
        if p>.95:
            box(im,(270,550,474,589),fill="#e6f2ed",radius=9)
            text(im,(287,559),"선택한 포즈로 시작",16,"#287052",True)
    return im.convert("RGB")

def make_manual(t,bg,body,posed):
    value=ease((t-2)/3.3)
    im=base(bg,"01  시작 체형 선택" if t<2 else "02  러프를 보며 비율 조절" if t<6.6 else "03  내 체형으로 저장하고 적용")
    target=shaped(posed,1)
    place(im,silhouette(target),(376,380),350)
    if t>6.6: place(im,shaped(posed,value),(376,380),350,opacity=ease((t-6.6)/.8))
    window(im,"새 체형 만들기","키·등신·어깨·팔다리 비율을 조절하는 시연 예시")
    box(im,(526,140,758,546),fill="#eef1f4",radius=12)
    text(im,(541,153),"미리보기",15,INK,True)
    place(im,shaped(body,value),(641,351),310+value*22)
    text(im,(779,144),"카드 이름",14,MUTED)
    box(im,(779,174,1073,218),fill="white",radius=8,outline="#d6dde7")
    text(im,(792,185),"주인공 A",17,INK,True)
    text(im,(779,242),"체형 조절",19,INK,True)
    params=[("키",178+8*value,"cm",.48+.22*value),("등신",7.2+.8*value,"",.43+.25*value),("어깨",.2*value,"",.48-.08*value),("다리 길이",.35*value,"",.5+.3*value)]
    for i,(name,num,unit,progress) in enumerate(params):
        y=287+i*63
        text(im,(780,y),name,15,INK,True)
        label=f"{num:.0f}{unit}" if unit else f"{num:.2f}"
        text(im,(1018,y),label,14,MUTED)
        ImageDraw.Draw(im).line((783,y+35,1062,y+35),fill="#d9dfe7",width=7)
        ImageDraw.Draw(im).line((783,y+35,783+279*progress,y+35),fill=CORAL,width=7)
        ImageDraw.Draw(im).ellipse((775+279*progress,y+27,791+279*progress,y+43),fill=CORAL)
    box(im,(883,554,1074,588),fill=CORAL if t<7 else "#287052",radius=9)
    text(im,(915,561),"내 체형 저장" if t<7 else "저장 완료",15,"white",True)
    if t<6.6: cursor(im,783+279*(.43+.25*value),385,2<t<2.3)
    else: cursor(im,976,573,6.6<t<7)
    return im.convert("RGB")

def make_auto(t,bg,body,posed):
    value=ease((t-2.5)/2.7)
    target=shaped(posed,1)
    im=base(bg,"01  러프의 인물 확인" if t<2.5 else "02  러프에 맞춘 체형으로 자동 변경" if t<6.8 else "03  결과를 확인하고 필요한 부분만 조절")
    place(im,silhouette(target),(376,380),350)
    window(im,"러프에 맞춘 체형","결과는 입력 이미지에 따라 달라집니다 · 기능 시연 예시")
    text(im,(528,139),"러프와 맞춰보고, 직접 결정하세요.",20,INK,True)
    box(im,(527,190,784,500),fill="#f1f3f6",radius=12)
    box(im,(801,190,1075,500),fill="#f1f3f6",radius=12,outline=CORAL if t>4.7 else "#d9dfe7",width=2)
    text(im,(548,203),"기본 체형",15,MUTED,True)
    text(im,(820,203),"러프에 맞춘 체형",15,INK,True)
    place(im,body,(654,365),235)
    place(im,shaped(body,value),(935,365),235+20*value)
    if t<5.2:
        y=int(230+235*((t*.45)%1))
        ImageDraw.Draw(im).line((811,y,1065,y),fill="#8ed8e8",width=3)
    if t>2.5: place(im,shaped(posed,value),(376,380),310+40*value,opacity=.75*value)
    box(im,(528,518,1075,580),fill="#edf5f5",radius=10)
    text(im,(546,531),"러프의 비율을 살펴보는 중" if t<4.9 else "자동 체형에서 시작 · 필요하면 직접 조절",18,"#286f70",True)
    text(im,(546,557),"분석 → 체형 확인 → 작가의 최종 선택",12,MUTED)
    cursor(im,960,545,t>6.8 and t<7.1)
    return im.convert("RGB")

def export(kind, frames):
    poster_index={"text-search":66,"body-manual":71,"body-auto":75}[kind]
    frames[poster_index].save(OUT/f"{kind}-poster.jpg",quality=92)
    writer=imageio_ffmpeg.write_frames(str(OUT/f"{kind}.mp4"),(W,H),fps=FPS,codec="libx264",quality=8,macro_block_size=2,output_params=["-movflags","+faststart","-pix_fmt","yuv420p"])
    writer.send(None)
    for frame in frames: writer.send(np.asarray(frame))
    writer.close()
    # GIF is the portable editing/share master; MP4 keeps the landing lightweight.
    small=[frame.resize((896,560),Image.Resampling.LANCZOS).quantize(colors=128) for frame in frames]
    small[0].save(OUT/f"{kind}.gif",save_all=True,append_images=small[1:],duration=round(1000/FPS),loop=0,optimize=False)
    print(kind, {s:(OUT/f"{kind}.{s}").stat().st_size for s in ("gif","mp4")},flush=True)

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--library-root",type=Path,required=True)
    parser.add_argument("--body-image",type=Path,required=True)
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    names=["UAL2__OverhandThrow__p01_f0010__three_quarter.jpg","UAL2__OverhandThrow__p02_f0021__three_quarter.jpg","Baseball Hit_00033__three_quarter.jpg","Baseball Hit_00054__three_quarter.jpg","Baseball Hit_00111__three_quarter.jpg","Boxing_01__three_quarter.jpg","Boxing_02__three_quarter.jpg","Boxing_03__three_quarter.jpg","Arm Stretching_00054__three_quarter.jpg","Arm Stretching_00129__three_quarter.jpg"]
    photos=[Image.open(args.library_root/n).convert("RGB") for n in names]
    body=Image.open(args.body_image).convert("RGBA")
    body=body.crop(body.getbbox())
    posed=cutout(photos[0])
    background=Image.open(ROOT/"public/assets/workspace/clip-studio-reference.png").convert("RGBA").resize((W,661),Image.Resampling.LANCZOS)
    bg=Image.new("RGBA",(W,H),INK);bg.alpha_composite(background)
    for kind,renderer in [("text-search",lambda t:make_text(t,bg,photos,posed)),("body-manual",lambda t:make_manual(t,bg,body,posed)),("body-auto",lambda t:make_auto(t,bg,body,posed))]:
        export(kind,[renderer(i/FPS) for i in range(FPS*SECONDS)])
    (OUT/"sources.json").write_text(json.dumps({"kind":"reconstructed feature demonstration; not a screen recording", "libraryPreviews":names,"bodyPreview":args.body_image.name,"workspace":"assets/workspace/clip-studio-reference.png","plannedUi":"Text search top search bar and scrolling results; proposed by product owner 2026-10-19","bodyInterpolation":"Illustrative proportion interpolation, not measured inference output","giftcard":{"source":"https://www.biz-con.co.kr/bizconshop/productDetail.do?categoryId=&productId=S0226973","image":"https://www.biz-con.co.kr/upload/images/202507/400_20250722133038387_10000.jpg","retrieved":"2026-10-19"}},ensure_ascii=False,indent=2),encoding="utf-8")
