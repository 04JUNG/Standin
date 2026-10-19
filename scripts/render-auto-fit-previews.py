"""Render illustrative body variants from the actual Standin male library mesh.

Run with Blender --background --python this-file -- --server <Standin-server>.
This is editorial 3D authoring, not a recording of automatic shape inference.
The source FBX and the server's library lighting are read-only.
"""
import argparse
import sys
from pathlib import Path
import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument('--server', type=Path, required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
sys.path.insert(0, str(args.server))
from converter.preview_style import configure_workbench

root = Path(__file__).resolve().parents[1]
out = root / 'public/assets/open-beta/source'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(args.server / 'data/curation/characters/standin-master-v2.fbx'))
arm = next(o for o in bpy.context.scene.objects if o.type == 'ARMATURE')
arm.animation_data_clear()
arm.data.pose_position = 'REST'
mesh = next(o for o in bpy.context.scene.objects if o.type == 'MESH')
base = [mesh.matrix_world @ v.co for v in mesh.data.vertices]
inverse = mesh.matrix_world.inverted()
scene = bpy.context.scene
configure_workbench(scene)
scene.render.resolution_x = scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.display.render_aa = '32'
camera_data = bpy.data.cameras.new('Fixed library camera')
camera = bpy.data.objects.new('Fixed library camera', camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 2.08
camera.location = (0, -5, .875)
camera.rotation_euler = (Vector((0, 0, .875)) - camera.location).to_track_quat('-Z', 'Y').to_euler()

def smooth(lo, hi, value):
    t = max(0, min(1, (value-lo)/(hi-lo)))
    return t*t*(3-2*t)

for index in range(9):
    amount = index/8
    for vertex, original in zip(mesh.data.vertices, base):
        p = original.copy()
        x, y, z = p
        # Widen the shoulder girdle and move the intact arms out with it.
        upper = smooth(1.02, 1.38, z) * (1-smooth(1.46, 1.55, z))
        p.x += (1 if x >= 0 else -1) * .070 * smooth(.025, .19, abs(x)) * upper * amount
        # Shrink the head in 3D, blending smoothly through the neck.
        head = smooth(1.47, 1.54, z) * amount
        p.x *= 1 - .19 * head
        p.y = .028 + (y-.028) * (1-.19*head)
        p.z = 1.49 + (z-1.49) * (1-.19*head)
        vertex.co = inverse @ p
    mesh.data.update()
    scene.render.filepath = str(out / f'auto-fit-male-{index:02d}.png')
    bpy.ops.render.render(write_still=True)
print('Rendered nine male library previews with a shared camera and lighting.')
