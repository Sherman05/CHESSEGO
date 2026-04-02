# Game Pieces Pack

This folder contains ready-to-use transparent PNG assets extracted from the generated piece sheet.

## Files
- `pieces_atlas.png` — single transparent sprite atlas (2 columns x 7 rows)
- `pieces_manifest.json` — JSON metadata with exact pixel coordinates for every sprite
- `*_white.png`, `*_black.png` — separate transparent PNG files for each piece
- `source_sheet.png` — original generated sheet from the chat

## Piece IDs
- `king_white`, `king_black`
- `connet_white`, `connet_black`
- `prince_white`, `prince_black`
- `ritter_white`, `ritter_black`
- `knet_white`, `knet_black`
- `ver_knet_white`, `ver_knet_black`
- `scout_white`, `scout_black`

## JSON usage
Use `pieces_manifest.json`, read the `pieces` array, and slice `pieces_atlas.png` by the `frame` object:
```json
{
  "id": "king_white",
  "frame": { "x": 24, "y": 13, "width": 113, "height": 174 }
}
```

## Example (JavaScript / Canvas)
```js
import manifest from "./pieces_manifest.json";
const atlas = new Image();
atlas.src = "./pieces_atlas.png";

function drawPiece(ctx, id, dx, dy) {
  const piece = manifest.pieces.find(p => p.id === id);
  const { x, y, width, height } = piece.frame;
  ctx.drawImage(atlas, x, y, width, height, dx, dy, width, height);
}
```

## Example (Python / Pillow)
```python
import json
from PIL import Image

atlas = Image.open("pieces_atlas.png")
manifest = json.load(open("pieces_manifest.json", "r", encoding="utf-8"))

piece = next(p for p in manifest["pieces"] if p["id"] == "king_white")
x = piece["frame"]["x"]
y = piece["frame"]["y"]
w = piece["frame"]["width"]
h = piece["frame"]["height"]

sprite = atlas.crop((x, y, x + w, y + h))
sprite.save("king_white_copy.png")
```
