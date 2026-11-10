import subprocess, sys, os, time

total_frames = 1355
num_workers = int(sys.argv[1]) if len(sys.argv) > 1 else 6
out_dir = sys.argv[2] if len(sys.argv) > 2 else "frames"
os.makedirs(out_dir, exist_ok=True)

chunk_size = (total_frames + num_workers - 1) // num_workers
procs = []
t0 = time.time()

print(f"Starting parallel render: {total_frames} frames across {num_workers} workers...")
env = dict(os.environ, RESUME="1")

for w in range(num_workers):
    start = w * chunk_size
    end = min(total_frames - 1, (w + 1) * chunk_size - 1)
    if start > end:
        continue
    spec = f"{start}-{end}"
    cmd = ["node", "render.mjs", out_dir, spec]
    p = subprocess.Popen(cmd, env=env)
    procs.append((w, p, start, end))
    print(f"Worker {w}: frames {start}-{end} started")

# Monitor loop
try:
    while True:
        alive = [p for _, p, _, _ in procs if p.poll() is None]
        rendered = len([f for f in os.listdir(out_dir) if f.startswith("f") and f.endswith(".jpg")])
        elapsed = time.time() - t0
        rate = rendered / max(elapsed, 0.1)
        remaining = (total_frames - rendered) / max(rate, 0.01)
        print(f"Progress: {rendered}/{total_frames} frames ({rendered*100//total_frames}%) - {rate:.2f} fps - ~{remaining/60:.1f}m remaining", flush=True)
        if not alive:
            break
        time.sleep(10)
except KeyboardInterrupt:
    for _, p, _, _ in procs:
        p.terminate()

print("All workers finished!")
