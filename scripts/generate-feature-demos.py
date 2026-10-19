"""Edit actual body-control footage and author labeled search/auto-fit storyboards.

Requires Pillow, numpy, imageio-ffmpeg, and Windows Malgun Gothic.
Search candidates are curated examples, not measured search/inference results.
"""
from pathlib import Path
import argparse
import json
import subprocess
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp/media-tools.local"))
import imageio_ffmpeg

W, H, FPS = 1120, 700, 12
OUT = ROOT / "public/assets/open-beta"
SOURCE = OUT / "source"
INK, CORAL, MUTED = "#152238", "#ff6b57", "#667085"
FONTS = {}
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def font(size=18, bold=False):
    key = (size, bold)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf", size)
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
    if press:
        d.ellipse((x-13, y-13, x+13, y+13), outline=CORAL, width=3)
    d.polygon([(x,y),(x+5,y+26),(x+12,y+18),(x+22,y+20)], fill="white", outline=INK)


def place(im, sprite, bounds, opacity=1):
    x,y,w,h = bounds
    ratio = min(w/sprite.width, h/sprite.height)
    spr = sprite.resize((round(sprite.width*ratio), round(sprite.height*ratio)), Image.Resampling.LANCZOS)
    if opacity < 1:
        spr.putalpha(spr.getchannel("A").point(lambda value: int(value*opacity)))
    im.alpha_composite(spr,(round(x+(w-spr.width)/2),round(y+(h-spr.height)/2)))


def base(background, step):
    im = background.copy()
    ImageDraw.Draw(im).rectangle((0,654,W,H),fill=INK)
    text(im,(22,667),step,18,"white",True)
    text(im,(874,670),"화면·동작 연출 예시",13,"#bcc9da")
    return im


def window(im, title, x, y, w, h):
    box(im,(x+3,y+5,x+w+4,y+h+7),fill="#69717e",radius=15)
    box(im,(x,y,x+w,y+h),fill="white",radius=15,outline="#d5dce7",width=2)
    box(im,(x+1,y+1,x+w-1,y+43),fill="#f4f6fa",radius=14)
    ImageDraw.Draw(im).rectangle((x+2,y+28,x+w-2,y+43),fill="#f4f6fa")
    box(im,(x+15,y+11,x+38,y+34),INK,7)
    text(im,(x+21,y+10),"S",16,CORAL,True)
    text(im,(x+49,y+11),"Standin",14,INK,True)
    text(im,(x+155,y+10),title,17,INK,True)
    text(im,(x+w-39,y+9),"—",18,MUTED)


def make_text(t, bg, candidates):
    step = "01  러프 없이, 원하는 자세를 문장으로" if t < 3 else "02  검을 든 전투 포즈를 스크롤하며 비교" if t < 8 else "03  마음에 드는 포즈 선택"
    im = base(bg,step)
    if t < .6:
        return im.convert("RGB")
    # Only this search window sits over the blank canvas, with no capture bar.
    window(im,"문장으로 포즈 찾기",306,65,740,566)
    box(im,(326,125,1026,176),fill="#f5f7fa",outline="#d6dde7")
    query="검을 들고 싸우는 전투 자세"
    typed=query[:int(len(query)*ease((t-.8)/1.5))]
    text(im,(343,140),typed,20,INK,True)
    box(im,(948,133,1018,168),CORAL,9)
    text(im,(967,139),"검색",16,"white",True)
    if t >= 2.6:
        text(im,(329,188),"전투 · 검술 포즈",16,INK,True)
        text(im,(838,190),"후보를 직접 비교하세요",13,MUTED)
        grid=Image.new("RGBA",(700,359),"white")
        offset=round(228*ease((t-5)/1.7))
        for n,item in enumerate(candidates):
            x=(n%3)*235
            y=(n//3)*228-offset
            grid.paste(item["image"],(x,y))
            text(grid,(x+7,y+190),item["label"],14,INK,True)
            text(grid,(x+7,y+211),item["angle"]+" · 전투",11,MUTED)
            if n == 3 and t >= 8:
                ImageDraw.Draw(grid).rounded_rectangle((x+1,y+1,x+223,y+185),radius=7,outline=CORAL,width=4)
                box(grid,(x+157,y+9,x+215,y+33),CORAL,12)
                text(grid,(x+168,y+13),"선택",12,"white",True)
        im.alpha_composite(grid,(326,219))
        box(im,(1033,223+round(offset*.4),1037,317+round(offset*.4)),"#bbc4d2",2)
    text(im,(328,599),"개편 예정 화면 · 전투 포즈를 선별한 시연 예시",13,MUTED)
    if t < 2.6:
        cursor(im,984,155,2.3<t<2.6)
    elif t < 8:
        cursor(im,998,439)
    else:
        cursor(im,454,337,8<t<8.25)
    return im.convert("RGB")


def fit_variant(sprite, amount):
    # Illustration only; final pose is the existing matched rough/3D concept pair.
    split=round(sprite.height*.49)
    top=sprite.crop((0,0,sprite.width,split))
    bottom=sprite.crop((0,split,sprite.width,sprite.height))
    top=top.resize((round(top.width*(1.16-.16*amount)),top.height),Image.Resampling.LANCZOS)
    bottom=bottom.resize((round(bottom.width*(1.06-.06*amount)),round(bottom.height*(.82+.18*amount))),Image.Resampling.LANCZOS)
    result=Image.new("RGBA",(top.width,top.height+bottom.height))
    result.alpha_composite(top,(0,0))
    result.alpha_composite(bottom,((top.width-bottom.width)//2,top.height))
    return result


def make_auto(t,bg,rough,mannequin):
    amount=ease((t-2.5)/2.8)
    step="01  웹툰 러프의 인물 확인" if t<2.5 else "02  러프에 맞춰 체형 변경" if t<6.8 else "03  비율을 비교하고 필요한 부분만 조절"
    im=base(bg,step)
    # Existing blue-pencil webtoon rough including anatomical construction lines.
    place(im,rough,(246,112,345,501))
    window(im,"러프에 맞춘 체형",606,76,488,556)
    text(im,(626,137),"같은 포즈, 내 캐릭터의 비율로",20,INK,True)
    box(im,(625,187,844,491),"#f3f5f8",12)
    box(im,(857,187,1075,491),"#f3f5f8",12,outline=CORAL if t>4.7 else "#dce2e9",width=2)
    text(im,(640,202),"기본 체형",14,MUTED,True)
    text(im,(869,202),"러프에 맞춘 체형",14,INK,True)
    place(im,fit_variant(mannequin,0),(636,243,198,226))
    place(im,fit_variant(mannequin,amount),(866,243,198,226))
    box(im,(626,514,1075,575),"#edf5f5",10)
    text(im,(643,526),"러프의 비율을 살펴보는 중" if t<5.1 else "체형 확인 후, 직접 세부 조절",18,"#286f70",True)
    text(im,(643,553),"러프 입력 → 체형 확인 → 작가의 최종 선택",12,MUTED)
    text(im,(627,598),"러프·체형 비교 연출 예시",13,MUTED)
    if t>6.8:
        place(im,mannequin,(246,112,345,501),.78*ease((t-6.8)/.9))
    cursor(im,993,545,6.8<t<7.1)
    return im.convert("RGB")


def ffmpeg(*args):
    result=subprocess.run([FFMPEG,"-y","-hide_banner","-loglevel","error",*map(str,args)],capture_output=True,text=True)
    if result.returncode:
        raise RuntimeError(result.stderr)


def gif_from_mp4(kind):
    filters="fps=10,scale=896:560:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4"
    ffmpeg("-i",OUT/f"{kind}.mp4","-filter_complex",filters,"-loop","0",OUT/f"{kind}.gif")


def export(kind,frames,poster):
    frames[round(poster*FPS)].save(OUT/f"{kind}-poster.jpg",quality=92)
    writer=imageio_ffmpeg.write_frames(str(OUT/f"{kind}.mp4"),(W,H),fps=FPS,codec="libx264",quality=8,macro_block_size=2,output_params=["-movflags","+faststart","-pix_fmt","yuv420p"])
    writer.send(None)
    for frame in frames:
        writer.send(np.asarray(frame))
    writer.close()
    gif_from_mp4(kind)
    print(kind,{s:(OUT/f"{kind}.{s}").stat().st_size for s in ("gif","mp4")},flush=True)


def manual_recording(path):
    # Only Standin's actual controls, live shape changes and saved card. No audio.
    temporary=ROOT/"tmp/media-tools.local/body-manual-edit.mp4"
    temporary.parent.mkdir(parents=True,exist_ok=True)
    ffmpeg("-i",path,"-vf","trim=start=0.8:end=31.8,setpts=(PTS-STARTPTS)/1.8,fps=15,scale=1120:700:flags=lanczos","-t",str(31/1.8),"-an","-c:v","libx264","-crf","18","-pix_fmt","yuv420p",temporary)
    reader=imageio_ffmpeg.read_frames(str(temporary),pix_fmt="rgb24")
    next(reader)
    writer=imageio_ffmpeg.write_frames(str(OUT/"body-manual.mp4"),(W,H),fps=15,codec="libx264",quality=8,macro_block_size=2,output_params=["-movflags","+faststart"])
    writer.send(None)
    for index,pixels in enumerate(reader):
        frame=Image.frombytes("RGB",(W,H),pixels)
        if index >= 218:
            # Focus the final saved card, excluding unrelated model-library filters.
            frame=frame.crop((0,0,944,590)).resize((W,H),Image.Resampling.LANCZOS)
        writer.send(np.asarray(frame))
    writer.close()
    ffmpeg("-ss","6","-i",OUT/"body-manual.mp4","-frames:v","1","-q:v","2",OUT/"body-manual-poster.jpg")
    gif_from_mp4("body-manual")
    print("body-manual: edited actual app recording",flush=True)


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--body-recording",type=Path,help="User-supplied Standin recording; omit to retain its current edit")
    args=parser.parse_args()
    choices=json.loads((SOURCE/"sword-candidates.json").read_text(encoding="utf-8"))
    candidates=[]
    for item in choices:
        card=Image.new("RGB",(225,186),"#999999")
        photo=Image.open(SOURCE/item["file"]).convert("RGB").resize((186,186),Image.Resampling.LANCZOS)
        card.paste(photo,(19,0))
        candidates.append({**item,"image":card})
    background=Image.open(SOURCE/"clip-studio-blank.png").convert("RGBA").resize((W,661),Image.Resampling.LANCZOS)
    bg=Image.new("RGBA",(W,H),INK);bg.alpha_composite(background)
    rough=Image.open(ROOT/"public/assets/hero-poses/pose-showcase-run-rough-cutout.png").convert("RGBA")
    mannequin=Image.open(ROOT/"public/assets/hero-poses/pose-showcase-run-mannequin-cutout.png").convert("RGBA")
    export("text-search",[make_text(i/FPS,bg,candidates) for i in range(FPS*12)],4.2)
    export("body-auto",[make_auto(i/FPS,bg,rough,mannequin) for i in range(FPS*10)],5.8)
    if args.body_recording:
        manual_recording(args.body_recording)
    manifest=json.loads((OUT/"sources.json").read_text(encoding="utf-8"))
    for key in ("libraryPreviews","bodyPreview","bodyInterpolation","workspace"):
        manifest.pop(key,None)
    manifest.update({
        "kind":"Actual body-control recording plus explicitly reconstructed search/auto-fit demonstrations",
        "manual":{"source":"User-supplied Standin screen recording, 2026-10-19 174044","trimSeconds":[0.8,31.8],"speed":1.8,"audio":False,"finalShot":"Cropped to focus the saved card, excluding unrelated model-library filters"},
        "workspace":"source/clip-studio-blank.png — user-supplied blank Clip Studio canvas, 2026-10-19",
        "search":{"candidates":choices,"selection":"Curated authored sword-pose previews, not a live search or ranking measurement","attribution":"Standin-authored body poses, hand shapes and primitive sword guides; source rig from Quaternius Universal Animation Library (CC0)"},
        "autoFit":{"rough":"assets/hero-poses/pose-showcase-run-rough-cutout.png","mannequin":"assets/hero-poses/pose-showcase-run-mannequin-cutout.png","method":"Existing matched webtoon rough and 3D concept assets, with illustrative body-proportion interpolation; not an inference recording"}
    })
    (OUT/"sources.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
