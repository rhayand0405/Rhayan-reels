#!/usr/bin/env bash
# Put a clip or photo into public/clips/ under the name the props file expects.
#
#   ./scripts/add-clip.sh day0-front ~/Desktop/IMG_4821.MOV
#   ./scripts/add-clip.sh day0-side  ~/Downloads/photo.HEIC
#
# iPhone footage is usually HEVC in a .MOV, which the renderer cannot decode.
# When ffmpeg is installed those get transcoded to H.264 mp4 automatically.

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <name-without-extension> <source-file>" >&2
  echo "example: $0 day0-front ~/Desktop/IMG_4821.MOV" >&2
  exit 1
fi

name="$1"
source="$2"

if [ ! -f "$source" ]; then
  echo "error: no such file: $source" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
dest_dir="$root/public/clips"
mkdir -p "$dest_dir"

ext="${source##*.}"
lower_ext="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"

case "$lower_ext" in
  jpg|jpeg|png)
    dest="$dest_dir/$name.$lower_ext"
    cp "$source" "$dest"
    ;;
  heic)
    dest="$dest_dir/$name.jpg"
    if command -v sips >/dev/null 2>&1; then
      sips -s format jpeg "$source" --out "$dest" >/dev/null
    else
      echo "error: HEIC needs macOS sips or a manual conversion to jpg" >&2
      exit 1
    fi
    ;;
  mp4|mov|m4v)
    dest="$dest_dir/$name.mp4"
    if command -v ffmpeg >/dev/null 2>&1; then
      # Re-encode to H.264 + AAC, strip rotation metadata into real pixels.
      ffmpeg -loglevel error -y -i "$source" \
        -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
        -c:a aac -b:a 160k -movflags +faststart "$dest"
    elif [ "$lower_ext" = "mp4" ]; then
      cp "$source" "$dest"
      echo "note: copied as-is. Install ffmpeg (brew install ffmpeg) if it fails to render."
    else
      echo "error: .$ext needs ffmpeg to convert. Run: brew install ffmpeg" >&2
      exit 1
    fi
    ;;
  *)
    echo "error: unsupported file type .$ext" >&2
    exit 1
    ;;
esac

echo "-> $dest"
echo "   reference it in props as: \"clips/$(basename "$dest")\""
