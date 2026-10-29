"""Recompose the existing landing video layout using the corrected pose artwork.

Usage: python scripts/refresh-pose-videos.py --ffmpeg PATH
These are illustrated workflow previews, not recordings of new product output.
"""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--ffmpeg", required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
videos = root / "public/assets/videos"
poses = root / "public/assets/hero-poses/realistic-v2"
scratch = root / "tmp/pose-refresh"
scratch.mkdir(parents=True, exist_ok=True)

def run(*cmd):
    subprocess.run([args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *map(str, cmd)], check=True)

rough = poses / "volleyball-rough-v4.webp"
model = poses / "volleyball-mannequin-v4.webp"
codec = ["-an", "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]

run("-i", videos / "input-demo-webtoon-v5.mp4", "-loop", 1, "-i", rough,
    "-filter_complex", "[0:v]drawbox=x=307:y=100:w=503:h=690:color=white:t=fill[base];[1:v]scale=480:640[rough];[base][rough]overlay=317:120:shortest=1[out]",
    "-map", "[out]", *codec, videos / "input-demo-natural-v8.mp4")

# Retain the original app chrome, candidate card, and success badge.
frame = scratch / "result-chrome.png"
run("-ss", 6, "-i", videos / "result-demo-rough-v3.mp4", "-frames:v", 1, frame)
filters = (
    "[0:v]drawbox=x=310:y=110:w=510:h=694:color=white:t=fill[base];"
    "[1:v]scale=480:640[rough];"
    "[2:v]split=3[m1][m2][m3];[m1]scale=480:640[model];[m2]scale=60:80[thumb];[m3]scale=96:128[drag];"
    "[3:v]split=2[c][s];[c]crop=368:289:1072:2,drawbox=x=18:y=148:w=72:h=76:color=0xf5f5f7:t=fill[card];"
    "[card][thumb]overlay=23:147[updatedcard];[s]crop=200:60:620:756[success];"
    "[base][rough]overlay=320:132:enable='lt(t,4.8)'[a];"
    "[a][model]overlay=320:132:enable='gte(t,4.8)'[b];"
    "[b][updatedcard]overlay=1072:2:enable='gte(t,1)'[c1];"
    "color=white:s=102x134:r=30:d=8[ghost];[ghost][drag]overlay=3:3,drawbox=x=0:y=0:w=iw:h=ih:color=0xe76b59:t=2[g];"
    "[c1][g]overlay=x='1090-200*(t-2)':y='165+65*(t-2)':enable='between(t,2,4.6)'[d];"
    "[d][success]overlay=620:756:enable='gte(t,5)'[out]"
)
run("-loop", 1, "-i", videos / "result-demo-rough-v3-poster.jpg",
    "-loop", 1, "-i", rough, "-loop", 1, "-i", model, "-loop", 1, "-i", frame,
    "-filter_complex", filters, "-map", "[out]", "-t", 8, "-r", 30, *codec, videos / "result-demo-natural-v6.mp4")

for name in ["input-demo-natural-v8", "result-demo-natural-v6"]:
    run("-ss", 0, "-i", videos / (name + ".mp4"), "-frames:v", 1, "-q:v", 2, videos / (name + "-poster.jpg"))
print("Updated input/result artwork while preserving video dimensions, app frame, and drag-to-canvas sequence.")
