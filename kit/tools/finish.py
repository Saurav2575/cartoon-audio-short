import subprocess, sys, os

title = sys.argv[1] if len(sys.argv) > 1 else "napoleon-bunnies"
slug = title.replace(" ", "-")
out_mp4 = f"out/{slug}.mp4"
os.makedirs("out", exist_ok=True)

print("1. Loudness normalisation for audio mix...")
subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-i", "mix_raw.wav",
    "-af", "loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", "48000", "-ac", "2", "mix.wav"
], check=True)

print("2. Encoding video with H.264 + AAC...")
subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-framerate", "30",
    "-i", "frames/f%04d.jpg", "-i", "mix.wav",
    "-map", "0:v:0", "-map", "1:a:0",
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out_mp4
], check=True)

print("3. Generating QA contact sheet...")
subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-i", out_mp4,
    "-vf", "fps=2,scale=180:-1,tile=10x4", "-frames:v", "1", "out/qa_sheet.jpg"
], check=True)

print(f"Finished: {out_mp4}")
