from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp" / "opencv"))

import cv2
import numpy as np
from PIL import Image


ASSET_DIR = ROOT / "public" / "assets" / "hero-poses"
PREVIEW_DIR = ROOT / "tmp" / "cutout-previews"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

POSES = ("action", "run", "spin", "volleyball")


def extract(pose: str) -> tuple[Path, Path]:
    mannequin_path = ASSET_DIR / f"pose-showcase-{pose}-mannequin.png"
    rough_path = ASSET_DIR / f"pose-showcase-{pose}-rough-cutout.png"
    output_path = ASSET_DIR / f"pose-showcase-{pose}-mannequin-cutout.png"
    preview_path = PREVIEW_DIR / f"pose-showcase-{pose}-overlay-preview.png"

    source = cv2.imdecode(np.fromfile(mannequin_path, dtype=np.uint8), cv2.IMREAD_COLOR)
    rough = cv2.imdecode(np.fromfile(rough_path, dtype=np.uint8), cv2.IMREAD_UNCHANGED)
    if source is None or rough is None or rough.shape[2] < 4:
        raise RuntimeError(f"Could not load source pair for {pose}")

    rough_alpha = rough[:, :, 3]
    silhouette = np.where(rough_alpha > 20, 255, 0).astype(np.uint8)
    probable = cv2.dilate(silhouette, np.ones((25, 25), np.uint8), iterations=1)
    certain = cv2.erode(silhouette, np.ones((19, 19), np.uint8), iterations=1)

    grab_mask = np.full(silhouette.shape, cv2.GC_BGD, dtype=np.uint8)
    grab_mask[probable > 0] = cv2.GC_PR_BGD
    grab_mask[silhouette > 0] = cv2.GC_PR_FGD
    grab_mask[certain > 0] = cv2.GC_FGD

    background_model = np.zeros((1, 65), np.float64)
    foreground_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(
        source,
        grab_mask,
        None,
        background_model,
        foreground_model,
        6,
        cv2.GC_INIT_WITH_MASK,
    )

    foreground = np.where(
        (grab_mask == cv2.GC_FGD) | (grab_mask == cv2.GC_PR_FGD),
        255,
        0,
    ).astype(np.uint8)
    foreground = cv2.morphologyEx(
        foreground, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=1
    )
    foreground = cv2.GaussianBlur(foreground, (0, 0), 0.8)

    rgba = cv2.cvtColor(source, cv2.COLOR_BGR2RGBA)
    rgba[:, :, 3] = foreground
    encoded, buffer = cv2.imencode(".png", cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    if not encoded:
        raise RuntimeError(f"Could not encode cutout for {pose}")
    buffer.tofile(output_path)

    rough_layer = Image.open(rough_path).convert("RGBA")
    model_layer = Image.open(output_path).convert("RGBA")
    canvas = Image.new("RGBA", rough_layer.size, "white")
    canvas.alpha_composite(rough_layer)
    canvas.alpha_composite(model_layer)
    canvas.convert("RGB").save(preview_path, quality=95)
    return output_path, preview_path


for pose_name in POSES:
    output, preview = extract(pose_name)
    print(output)
    print(preview)


def replace_action_with_chroma_cutout() -> None:
    generated_path = ROOT / "tmp" / "imagegen" / "action-mannequin-transparent.png"
    rough_path = ASSET_DIR / "pose-showcase-action-rough-cutout.png"
    output_path = ASSET_DIR / "pose-showcase-action-mannequin-cutout.png"
    preview_path = PREVIEW_DIR / "pose-showcase-action-overlay-preview.png"

    generated = Image.open(generated_path).convert("RGBA")
    source_bbox = generated.getchannel("A").getbbox()
    if source_bbox is None:
        raise RuntimeError("Generated action cutout has no visible subject")
    subject = generated.crop(source_bbox)

    rough_layer = Image.open(rough_path).convert("RGBA")
    target_bbox = rough_layer.getchannel("A").getbbox()
    if target_bbox is None:
        raise RuntimeError("Action rough cutout has no visible subject")

    target_width = target_bbox[2] - target_bbox[0]
    target_height = target_bbox[3] - target_bbox[1]
    scale = min(target_width / subject.width, target_height / subject.height)
    fitted = subject.resize(
        (round(subject.width * scale), round(subject.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = round((target_bbox[0] + target_bbox[2] - fitted.width) / 2)
    top = round((target_bbox[1] + target_bbox[3] - fitted.height) / 2)

    cutout = Image.new("RGBA", rough_layer.size, (0, 0, 0, 0))
    cutout.alpha_composite(fitted, (left, top))
    cutout.save(output_path)

    preview = Image.new("RGBA", rough_layer.size, "white")
    preview.alpha_composite(rough_layer)
    preview.alpha_composite(cutout)
    preview.convert("RGB").save(preview_path, quality=95)


replace_action_with_chroma_cutout()
