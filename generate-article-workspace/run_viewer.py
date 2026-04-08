#!/usr/bin/env -S uv run --python 3.13
# /// script
# requires-python = ">=3.10"
# ///
"""Run the skill-creator eval viewer with a modern Python."""
import subprocess
import sys

sys.exit(subprocess.call([
    sys.executable,
    "/Users/user/.claude/plugins/cache/claude-plugins-official/skill-creator/55b58ec6e564/skills/skill-creator/eval-viewer/generate_review.py",
    "/Users/user/src/docs/generate-article-workspace/iteration-1",
    "--skill-name", "generate-article",
    "--benchmark", "/Users/user/src/docs/generate-article-workspace/iteration-1/benchmark.json",
    "--static", "/Users/user/src/docs/generate-article-workspace/iteration-1/review.html",
]))
