#!/usr/bin/env python3
"""
Breathing Metronome Video Generator
Generates 1-minute YouTube videos: black bg + concentric circles + your voice cues.
"""

import subprocess
import math
import os
import sys
import json
from PIL import Image, ImageDraw, ImageFont

# === CONFIG ===
WIDTH, HEIGHT = 1920, 1080
FPS = 30
VIDEO_DURATION = 60
CENTER_X, CENTER_Y = WIDTH // 2, HEIGHT // 2

PATTERNS = [
    {'id': '4-7-8',   'timing': [4, 7, 8, 0], 'en': '4-7-8 Breathing',        'hi': '4-7-8 श्वास'},
    {'id': '4-4-4-4', 'timing': [4, 4, 4, 4], 'en': '4-4-4-4 Box Breathing',   'hi': '4-4-4-4 बॉक्स ब्रीदिंग'},
    {'id': '6-2-6-2', 'timing': [6, 2, 6, 2], 'en': '6-2-6-2 Breathing',       'hi': '6-2-6-2 श्वास'},
    {'id': '5-5-5-5', 'timing': [5, 5, 5, 5], 'en': '5-5-5-5 Breathing',       'hi': '5-5-5-5 श्वास'},
    {'id': '4-4-6-2', 'timing': [4, 4, 6, 2], 'en': '4-4-6-2 Breathing',       'hi': '4-4-6-2 श्वास'},
    {'id': '3-12-6-0','timing': [3,12, 6, 0], 'en': '3-12-6-0 Breathing',      'hi': '3-12-6-0 श्वास'},
    {'id': '4-0-4-0', 'timing': [4, 0, 4, 0], 'en': '4-0-4-0 Coherent',        'hi': '4-0-4-0 सुसंगत श्वास'},
    {'id': '6-0-6-0', 'timing': [6, 0, 6, 0], 'en': '6-0-6-0 Resonance',       'hi': '6-0-6-0 रेज़ोनेंस श्वास'},
]

PHASE_NAMES = {
    'en': ['INHALE', 'HOLD', 'EXHALE', 'HOLD'],
    'hi': ['सांस लें', 'रोकें', 'सांस छोड़ें', 'रोकें'],
}

AUDIO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'videos')

MIN_RADIUS = 60
MAX_RADIUS = 360


def get_non_zero_phases(timing):
    return [(i, s) for i, s in enumerate(timing) if s > 0]


def get_phase_at_time(timing, t):
    non_zero = get_non_zero_phases(timing)
    cycle_duration = sum(s for _, s in non_zero)
    if cycle_duration == 0:
        return 0, 0, 0
    t_in_cycle = t % cycle_duration
    elapsed = 0
    for phase_i, phase_dur in non_zero:
        if t_in_cycle < elapsed + phase_dur:
            phase_elapsed = t_in_cycle - elapsed
            progress = phase_elapsed / phase_dur
            seconds_left = phase_dur - phase_elapsed
            return phase_i, progress, seconds_left
        elapsed += phase_dur
    return non_zero[0][0], 0, non_zero[0][1]


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def get_breathing_radius(phase_index, progress):
    if phase_index == 0:
        return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * ease_in_out(progress)
    elif phase_index == 1:
        pulse = math.sin(progress * math.pi * 2) * 8
        return MAX_RADIUS + pulse
    elif phase_index == 2:
        return MAX_RADIUS - (MAX_RADIUS - MIN_RADIUS) * ease_in_out(progress)
    else:
        pulse = math.sin(progress * math.pi * 2) * 5
        return MIN_RADIUS + pulse


def draw_frame(t, timing, lang, pattern_name, font_phase, font_count, font_pattern):
    img = Image.new('RGB', (WIDTH, HEIGHT), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    phase_i, progress, seconds_left = get_phase_at_time(timing, t)
    breath_r = get_breathing_radius(phase_i, progress)

    # Concentric circles around the breathing radius
    num_circles = 8
    spacing = 50
    for i in range(num_circles):
        r = breath_r - (num_circles // 2 - i) * spacing
        if r < 10:
            continue
        dist = abs(i - num_circles // 2)
        alpha = max(0, int(180 - dist * 35))
        lw = max(1, 3 - dist)
        if alpha > 0:
            draw.ellipse(
                [CENTER_X - r, CENTER_Y - r, CENTER_X + r, CENTER_Y + r],
                outline=(alpha, alpha, alpha), width=lw
            )

    # Main breathing circle
    if breath_r > 0:
        draw.ellipse(
            [CENTER_X - breath_r, CENTER_Y - breath_r,
             CENTER_X + breath_r, CENTER_Y + breath_r],
            outline=(255, 255, 255), width=2
        )

    # Fading ripples expanding outward
    ripple_speed = 80
    for k in range(5):
        ripple_r = (t * ripple_speed + k * 120) % (MAX_RADIUS + 200)
        if ripple_r < 20 or ripple_r > MAX_RADIUS + 150:
            continue
        fade = max(0, 1.0 - ripple_r / (MAX_RADIUS + 150))
        alpha = int(fade * 60)
        if alpha > 0:
            draw.ellipse(
                [CENTER_X - ripple_r, CENTER_Y - ripple_r,
                 CENTER_X + ripple_r, CENTER_Y + ripple_r],
                outline=(alpha, alpha, alpha), width=1
            )

    # Phase name
    phase_name = PHASE_NAMES[lang][phase_i]
    countdown = str(math.ceil(seconds_left))

    bbox = draw.textbbox((0, 0), phase_name, font=font_phase)
    tw = bbox[2] - bbox[0]
    draw.text((CENTER_X - tw // 2, CENTER_Y - 60), phase_name,
              fill=(200, 200, 200), font=font_phase)

    bbox = draw.textbbox((0, 0), countdown, font=font_count)
    tw = bbox[2] - bbox[0]
    draw.text((CENTER_X - tw // 2, CENTER_Y - 20), countdown,
              fill=(255, 255, 255), font=font_count)

    # Pattern name at bottom
    timing_str = '-'.join(str(s) for s in timing)
    label = f"{pattern_name}  ({timing_str})"
    bbox = draw.textbbox((0, 0), label, font=font_pattern)
    tw = bbox[2] - bbox[0]
    draw.text((CENTER_X - tw // 2, HEIGHT - 60), label,
              fill=(100, 100, 100), font=font_pattern)

    return img


def get_phase_transitions(timing, duration):
    """Return list of (time_seconds, phase_index) for all phase transitions."""
    non_zero = get_non_zero_phases(timing)
    cycle_duration = sum(s for _, s in non_zero)
    if cycle_duration == 0:
        return []

    transitions = []
    t = 0
    while t < duration:
        elapsed = 0
        for pi, dur in non_zero:
            abs_time = t + elapsed
            if abs_time < duration:
                transitions.append((abs_time, pi))
            elapsed += dur
        t += cycle_duration
    return transitions


def generate_audio_ffmpeg(timing, lang, output_path):
    """Generate audio track using ffmpeg — fast, no Python sample processing."""
    transitions = get_phase_transitions(timing, VIDEO_DURATION)
    clip_names = ['inhale', 'hold', 'exhale', 'hold2']

    # Build ffmpeg command: silent base + overlaid voice clips
    # Start with a silent base track
    inputs = [
        '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono:d={VIDEO_DURATION}'
    ]
    filter_parts = []
    input_idx = 1
    valid_inputs = []

    for trans_time, pi in transitions:
        clip_path = os.path.join(AUDIO_DIR, lang, clip_names[pi] + '.mp3')
        if os.path.exists(clip_path):
            inputs.extend(['-i', clip_path])
            delay_ms = int(trans_time * 1000)
            filter_parts.append(
                f'[{input_idx}]adelay={delay_ms}|{delay_ms},volume=0.85[v{input_idx}]'
            )
            valid_inputs.append(f'[v{input_idx}]')
            input_idx += 1

    if not valid_inputs:
        # No voice clips found, just generate silence
        cmd = ['ffmpeg', '-y', '-f', 'lavfi', '-i',
               f'anullsrc=r=44100:cl=mono:d={VIDEO_DURATION}',
               '-c:a', 'aac', '-b:a', '128k', output_path]
        subprocess.run(cmd, capture_output=True)
        return

    # Mix all together
    mix_parts = '[0]' + ''.join(valid_inputs)
    n_inputs = 1 + len(valid_inputs)
    filter_str = ';'.join(filter_parts)
    filter_str += f';{mix_parts}amix=inputs={n_inputs}:duration=first:dropout_transition=0[out]'

    cmd = ['ffmpeg', '-y'] + inputs + [
        '-filter_complex', filter_str,
        '-map', '[out]',
        '-c:a', 'aac', '-b:a', '128k',
        '-ar', '44100',
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, timeout=60)
    if result.returncode != 0:
        print(f"    Audio error: {result.stderr[-200:]}")


def generate_video(pattern, lang):
    timing = pattern['timing']
    name = pattern[lang]
    pat_id = pattern['id']
    lang_suffix = lang.upper()

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    video_filename = f"{pat_id}_{lang_suffix}.mp4"
    video_path = os.path.join(OUTPUT_DIR, video_filename)

    print(f"  [{pat_id} {lang_suffix}] Generating: {video_filename}")

    # Step 1: Audio
    audio_path = os.path.join(OUTPUT_DIR, f"_temp_audio_{pat_id}_{lang_suffix}.m4a")
    print(f"    Audio track...")
    generate_audio_ffmpeg(timing, lang, audio_path)

    if not os.path.exists(audio_path):
        print(f"    ERROR: Audio generation failed")
        return None

    # Step 2: Render frames + pipe to ffmpeg
    print(f"    Rendering frames...")

    # Load fonts once
    try:
        font_phase = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        font_count = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_pattern = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    except (IOError, OSError):
        font_phase = ImageFont.load_default()
        font_count = ImageFont.load_default()
        font_pattern = ImageFont.load_default()

    cmd = [
        'ffmpeg', '-y',
        '-f', 'rawvideo', '-vcodec', 'rawvideo',
        '-s', f'{WIDTH}x{HEIGHT}', '-pix_fmt', 'rgb24',
        '-r', str(FPS), '-i', '-',
        '-i', audio_path,
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'copy',
        '-shortest',
        '-movflags', '+faststart',
        video_path
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

    total_frames = VIDEO_DURATION * FPS
    for frame_num in range(total_frames):
        t = frame_num / FPS
        img = draw_frame(t, timing, lang, name, font_phase, font_count, font_pattern)
        proc.stdin.write(img.tobytes())
        if frame_num % (FPS * 15) == 0:
            pct = int(frame_num / total_frames * 100)
            print(f"    {pct}% ({frame_num}/{total_frames} frames)")

    try:
        proc.stdin.close()
    except (BrokenPipeError, ValueError):
        pass
    proc.wait()
    if proc.returncode != 0:
        print(f"    Video encoding error")

    # Cleanup
    if os.path.exists(audio_path):
        os.remove(audio_path)

    if os.path.exists(video_path):
        size_mb = os.path.getsize(video_path) / (1024 * 1024)
        print(f"    Done: {video_filename} ({size_mb:.1f} MB)")
    return video_path


def main():
    pattern_filter = None
    lang_filter = None
    for arg in sys.argv[1:]:
        if arg in ('en', 'hi'):
            lang_filter = arg
        else:
            pattern_filter = arg

    languages = [lang_filter] if lang_filter else ['en', 'hi']
    patterns = PATTERNS
    if pattern_filter:
        patterns = [p for p in PATTERNS if p['id'] == pattern_filter]
        if not patterns:
            print(f"Unknown pattern: {pattern_filter}")
            sys.exit(1)

    total = len(patterns) * len(languages)
    print(f"Generating {total} videos ({len(patterns)} patterns × {len(languages)} languages)")
    print(f"Resolution: {WIDTH}x{HEIGHT} @ {FPS}fps, Duration: {VIDEO_DURATION}s\n")

    for pat in patterns:
        for lang in languages:
            generate_video(pat, lang)

    print(f"\nAll videos saved to: {OUTPUT_DIR}/")


if __name__ == '__main__':
    main()
