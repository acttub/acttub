"""
캐릭터 PNG 배경 누끼 처리.

전략:
1. RGBA 로드 (이미 RGBA면 그대로, RGB면 알파 추가)
2. 4모서리에서 flood-fill 로 흰색 근처(허용오차 내) 픽셀만 알파=0 으로
   -> 캐릭터 안쪽 흰색(눈 빛 등)은 보존됨
3. 출력은 원본 덮어쓰기 (백업은 .bak 폴더에)
"""

from pathlib import Path
from PIL import Image
from collections import deque
import shutil
import sys

# 흰색으로 간주할 허용오차 (255 기준, R/G/B 각각)
TOLERANCE = 18

# 모서리에서 시작할 좌표 비율 (이미지 크기 대비)
SEED_OFFSETS = [
    (0.0, 0.0),
    (1.0, 0.0),
    (0.0, 1.0),
    (1.0, 1.0),
    (0.5, 0.0),
    (0.5, 1.0),
    (0.0, 0.5),
    (1.0, 0.5),
]


def is_white(px, tol=TOLERANCE):
    r, g, b = px[0], px[1], px[2]
    return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol


def flood_remove_bg(image: Image.Image) -> Image.Image:
    image = image.convert('RGBA')
    width, height = image.size
    pixels = image.load()

    visited = [[False] * height for _ in range(width)]
    queue = deque()

    # seed: 모서리에서 흰색이면 큐에 추가
    for fx, fy in SEED_OFFSETS:
        sx = min(width - 1, max(0, int(fx * (width - 1))))
        sy = min(height - 1, max(0, int(fy * (height - 1))))
        if not visited[sx][sy] and is_white(pixels[sx, sy]):
            queue.append((sx, sy))
            visited[sx][sy] = True

    # BFS flood fill
    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)  # 투명

        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and not visited[nx][ny]:
                if is_white(pixels[nx, ny]):
                    visited[nx][ny] = True
                    queue.append((nx, ny))

    return image


def process_dir(input_dir: Path) -> None:
    backup_dir = input_dir.parent / 'characters.bak'
    backup_dir.mkdir(exist_ok=True)

    files = sorted(input_dir.glob('*.png'))
    print(f'Found {len(files)} PNG files in {input_dir}')

    for path in files:
        bak = backup_dir / path.name
        if not bak.exists():
            shutil.copy2(path, bak)

        img = Image.open(path)
        out = flood_remove_bg(img)
        out.save(path, 'PNG', optimize=True)
        print(f'  done: {path.name}  ({out.size[0]}x{out.size[1]})')

    print(f'Backups saved at: {backup_dir}')


if __name__ == '__main__':
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent / 'public' / 'characters'
    process_dir(target)
