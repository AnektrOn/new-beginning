#!/usr/bin/env python3
"""Parse CSV data and extract batch 3 (entries 40-59)"""
import csv
import sys
import io
import re

# Read all input
csv_data = sys.stdin.read()

# Split by newlines and parse
lines = csv_data.strip().split('\n')
if not lines:
    print("No data found", file=sys.stderr)
    sys.exit(1)

# Parse header
header = lines[0].split(',')
if header[0] != 'id':
    print(f"Unexpected header: {header[0]}", file=sys.stderr)
    sys.exit(1)

# Parse CSV rows (handling quoted fields with commas)
reader = csv.DictReader(io.StringIO(csv_data))
entries = list(reader)

print(f"Total entries parsed: {len(entries)}", file=sys.stderr)

# Extract batch 3 (entries 40-59, indices 40-59)
if len(entries) < 60:
    print(f"Warning: Only {len(entries)} entries found, need at least 60 for batch 3", file=sys.stderr)
    batch = entries[40:] if len(entries) > 40 else []
else:
    batch = entries[40:60]

print(f"Batch 3 entries: {len(batch)}", file=sys.stderr)
if batch:
    print(f"First entry ID: {batch[0]['id']}", file=sys.stderr)
    print(f"Last entry ID: {batch[-1]['id']}", file=sys.stderr)

# Output as JSON for further processing
import json
print(json.dumps(batch))

