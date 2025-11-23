#!/usr/bin/env python3
"""Extract batch 3 entries (40-59) from CSV data"""
import csv
import sys
import io

# Read CSV from stdin
csv_data = sys.stdin.read()

# Parse CSV
reader = csv.DictReader(io.StringIO(csv_data))
all_entries = list(reader)

print(f"Total entries: {len(all_entries)}", file=sys.stderr)

# Extract batch 3 (entries 40-59)
if len(all_entries) >= 60:
    batch3 = all_entries[40:60]
    print(f"Extracted batch 3: {len(batch3)} entries", file=sys.stderr)
    print(f"First ID: {batch3[0]['id']}, Last ID: {batch3[-1]['id']}", file=sys.stderr)
    
    # Output as CSV
    if batch3:
        writer = csv.DictWriter(sys.stdout, fieldnames=batch3[0].keys())
        writer.writeheader()
        writer.writerows(batch3)
else:
    print(f"Error: Need at least 60 entries, got {len(all_entries)}", file=sys.stderr)
    sys.exit(1)

