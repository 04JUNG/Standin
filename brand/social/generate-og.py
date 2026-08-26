"""Generate the 1200x630 Open Graph / X card from current hero assets."""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont


ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets" / "hero-poses"
OUTPUT = PUBLIC / "standin-social-card.png"

INK = "#152238"
CORAL = "#ff6b57"
SKY = "#8ed8e8"
PAPER = "#f8f5ef"
MUTED = "#667085"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default(size=size)


def contain(image: Image.Image, width: int, height: int) -> Image.Image:
    image = image.convert("RGBA")
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    image.thumbnail((width, height), Image.Resampling.LANCZOS)
    return image


canvas = Image.new("RGB", (1200, 630), PAPER)
draw = ImageDraw.Draw(canvas)

# Paper grid used throughout the landing page.
for x in range(0, 1201, 48):
    draw.line((x, 0, x, 630), fill="#e8e3da", width=1)
for y in range(0, 631, 48):
    draw.line((0, y, 1200, y), fill="#e8e3da", width=1)

# Product visual panel.
panel = (698, 34, 1164, 596)
draw.rounded_rectangle(panel, radius=34, fill=INK)
for x in range(panel[0] + 30, panel[2], 42):
    draw.line((x, panel[1] + 1, x, panel[3] - 1), fill="#23334b", width=1)
for y in range(panel[1] + 30, panel[3], 42):
    draw.line((panel[0] + 1, y, panel[2] - 1, y), fill="#23334b", width=1)

rough = contain(Image.open(ASSETS / "pose-showcase-action-rough-cutout.png"), 430, 500)
mannequin = contain(
    Image.open(ASSETS / "pose-showcase-action-mannequin-cutout.png"), 430, 500
)
rough = ImageEnhance.Brightness(rough).enhance(1.12)

visual_x = panel[0] + (panel[2] - panel[0] - rough.width) // 2
visual_y = panel[1] + (panel[3] - panel[1] - rough.height) // 2 + 10
canvas.paste(rough, (visual_x, visual_y), rough)

# Reveal the 3D result on the right half, mirroring the landing interaction.
mannequin_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
mannequin_x = panel[0] + (panel[2] - panel[0] - mannequin.width) // 2
mannequin_y = panel[1] + (panel[3] - panel[1] - mannequin.height) // 2 + 10
mannequin_layer.paste(mannequin, (mannequin_x, mannequin_y), mannequin)
reveal = Image.new("L", canvas.size, 0)
ImageDraw.Draw(reveal).rounded_rectangle(
    (923, panel[1] + 24, panel[2] - 22, panel[3] - 24), radius=22, fill=255
)
mannequin_layer.putalpha(
    ImageChops.multiply(mannequin_layer.getchannel("A"), reveal)
)
canvas.paste(mannequin_layer, (0, 0), mannequin_layer)

draw = ImageDraw.Draw(canvas)
draw.line((923, panel[1] + 38, 923, panel[3] - 38), fill=CORAL, width=4)
draw.rounded_rectangle((889, 60, 957, 96), radius=18, fill=CORAL)
draw.text((923, 78), "3D", font=font(15, True), fill=INK, anchor="mm")

# Copy block.
draw.text((66, 72), "WEBTOON 3D POSE TOOL", font=font(16, True), fill=CORAL)
draw.rounded_rectangle((66, 111, 166, 116), radius=3, fill=CORAL)
draw.text((66, 150), "원하는 자세를,", font=font(56, True), fill=INK)
draw.text((66, 224), "3D 인형으로.", font=font(56, True), fill=INK)
draw.text((68, 324), "러프 한 장에서 찾는", font=font(23, True), fill=INK)
draw.text((68, 360), "웹툰 3D 포즈의 시작점", font=font(23, True), fill=INK)

draw.rounded_rectangle((66, 426, 280, 472), radius=23, fill="#ffffff", outline="#d8dde5")
draw.ellipse((84, 444, 94, 454), fill=CORAL)
draw.text((108, 449), "2026. 9. 4. CLOSED BETA", font=font(14, True), fill=INK, anchor="lm")

draw.text((66, 548), "Stand", font=font(30, True), fill=INK)
stand_width = draw.textlength("Stand", font=font(30, True))
draw.text((66 + stand_width, 548), "in.", font=font(30, True), fill=CORAL)
draw.text((68, 588), "ROUGH POSE TO 3D", font=font(11, True), fill=MUTED)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.save(OUTPUT, format="PNG", optimize=True)
print(f"generated {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")
