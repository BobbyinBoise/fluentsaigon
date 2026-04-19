"""
FluentSaigon - Vietnamese Numbers Audio Re-generator
Retries only the problem numbers with improved text inputs
"""

import os
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

OUTPUT_DIR = Path(r"C:\Users\bobby\Documents\fluentsaigon\audio")

# Voice ID for Southern Vietnamese male (voice #23 selected previously)
VOICE_ID = None

# Fetch voices and find the same one
HEADERS = {
    "xi-api-key": api_key,
    "Content-Type": "application/json",
}

resp = requests.get("https://api.elevenlabs.io/v1/voices", headers=HEADERS)
resp.raise_for_status()
voices = resp.json()["voices"]
VOICE_ID = voices[23]["voice_id"]
print(f"✅ Using voice: {voices[23]['name']} ({VOICE_ID})")

# ── Problem numbers with improved input text ─────────────────
# Strategies used:
# - Add "số" (number) before the word to give context
# - Use punctuation/pauses to slow delivery
# - Spell out phonetically where ElevenLabs struggles with tones
# - Try multiple variants per number

RETRIES = [
    ("0",  [
        "số không.",
        "không.",
        "không, không, không.",
    ]),
    ("2",  [
        "số hai.",
        "hai.",
        "hai, hai.",
    ]),
    ("5",  [
        "số năm.",
        "năm.",
        "năm, năm, năm.",
    ]),
    ("8",  [
        "số tám.",
        "tám.",
        "tám, tám.",
    ]),
    ("9",  [
        "số chín.",
        "chín.",
        "chín, chín.",
    ]),
    ("10", [
        "số mười.",
        "mười.",
        "mười, mười.",
    ]),
]

URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

VOICE_SETTINGS = {
    "stability": 0.80,
    "similarity_boost": 0.85,
    "style": 0.15,
    "use_speaker_boost": True
}

print(f"\n🎙️  Regenerating {len(RETRIES)} problem numbers with multiple variants...\n")

for num, variants in RETRIES:
    print(f"\n  Number {num}:")
    for i, text in enumerate(variants):
        variant_label = f"v{i+1}"
        filename = f"number_{num}_{variant_label}.mp3"
        filepath = OUTPUT_DIR / filename

        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": VOICE_SETTINGS
        }

        resp = requests.post(URL, headers=HEADERS, json=payload)

        if resp.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(resp.content)
            size_kb = len(resp.content) // 1024
            print(f"    ✅ [{variant_label}] \"{text}\" → {filename} ({size_kb}KB)")
        else:
            print(f"    ❌ [{variant_label}] FAILED: {resp.status_code} {resp.text[:80]}")

print(f"""
🎉 Done! Variant files saved to: {OUTPUT_DIR}

Next steps:
  1. Open each number's variants in Windows Media Player and compare
  2. Note which variant sounds best for each number  
  3. Tell me (e.g. "0=v2, 2=v1, 5=v3...") and I'll rename the winners
     to replace the originals (number_0.mp3, number_2.mp3, etc.)
""")
