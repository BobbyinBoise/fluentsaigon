"""
FluentSaigon - Vietnamese Numbers Audio Generator
Generates individual MP3 files for numbers 0-10 using ElevenLabs API
Reads API key from .env file in the fluentsaigon project folder
"""

import os
import json
import requests
from pathlib import Path

# ── Load .env ────────────────────────────────────────────────
env_path = Path(r"C:\Users\bobby\Documents\fluentsaigon\.env")
api_key = None

with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("ELEVENLABS_API_KEY="):
            api_key = line.split("=", 1)[1].strip()
            break

if not api_key:
    raise ValueError("ELEVENLABS_API_KEY not found in .env file")

print(f"✅ API key loaded ({api_key[:8]}...)")

# ── Config ───────────────────────────────────────────────────
OUTPUT_DIR = Path(r"C:\Users\bobby\Documents\fluentsaigon\audio")
OUTPUT_DIR.mkdir(exist_ok=True)

# Vietnamese numbers 0-10
NUMBERS = [
    ("0", "không"),
    ("1", "một"),
    ("2", "hai"),
    ("3", "ba"),
    ("4", "bốn"),
    ("5", "năm"),
    ("6", "sáu"),
    ("7", "bảy"),
    ("8", "tám"),
    ("9", "chín"),
    ("10", "mười"),
]

HEADERS = {
    "xi-api-key": api_key,
    "Content-Type": "application/json",
}

# ── Step 1: Fetch available voices ───────────────────────────
print("\n📋 Fetching available voices from your account...")
resp = requests.get("https://api.elevenlabs.io/v1/voices", headers=HEADERS)
resp.raise_for_status()
voices = resp.json()["voices"]

print(f"\nFound {len(voices)} voices:\n")
for i, v in enumerate(voices):
    labels = v.get("labels", {})
    lang = labels.get("language", "unknown")
    accent = labels.get("accent", "")
    print(f"  [{i}] {v['name']:<30} ID: {v['voice_id']}   language: {lang} {accent}")

print("\n" + "="*60)
print("Enter the NUMBER of the voice you want to use (e.g. 0, 1, 2...)")
print("Tip: Look for Vietnamese or pick one to test with")
choice = int(input("Your choice: ").strip())
selected = voices[choice]
VOICE_ID = selected["voice_id"]
print(f"\n✅ Selected: {selected['name']} ({VOICE_ID})")

# ── Step 2: Generate audio for each number ───────────────────
print(f"\n🎙️  Generating {len(NUMBERS)} audio files...\n")

URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

for num, viet in NUMBERS:
    filename = f"number_{num}.mp3"
    filepath = OUTPUT_DIR / filename

    payload = {
        "text": viet,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.85,
            "style": 0.2,
            "use_speaker_boost": True
        }
    }

    resp = requests.post(URL, headers=HEADERS, json=payload)

    if resp.status_code == 200:
        with open(filepath, "wb") as f:
            f.write(resp.content)
        size_kb = len(resp.content) // 1024
        print(f"  ✅ {num:>3} · {viet:<10} → {filename} ({size_kb}KB)")
    else:
        print(f"  ❌ {num:>3} · {viet:<10} → FAILED: {resp.status_code} {resp.text[:80]}")

print(f"\n🎉 Done! Files saved to: {OUTPUT_DIR}")
print("\nNext step: upload these files to Cloudflare R2")
