# 🚨 CRITICAL CODING RULES

## Rule #1: UUID Parsing with Hyphens
**NEVER use `split('-')` when parsing IDs containing UUIDs!**

### ❌ WRONG
```javascript
const parts = eventId.split('-');
const habitId = parts[1]; // Breaks UUID!
```

### ✅ CORRECT
```javascript
const yearPattern = /-\d{4}-\d{2}-\d{2}$/;
const match = withoutPrefix.match(yearPattern);
// Use regex to find date boundary
```

## Rule #2: Virtual Event ID Format
**Format:** `virtual-{UUID}-{YYYY-MM-DD}`
**Example:** `virtual-0cb25ca9-c2e5-4a8a-ad3a-d3eb55a4a23b-2025-10-08`

## Rule #3: Always Add Debug Logging
```javascript
console.log('Original Event ID:', eventId);
console.log('Parsed habitId:', habitId);
console.log('Parsed eventDate:', eventDate);
```

## Rule #4: Test with Real Data
- Use actual UUIDs from database
- Test edge cases
- Validate results

## Rule #5: Include Fallback Logic
```javascript
if (match) {
  // Primary parsing logic
} else {
  // Fallback logic
}
```

---

**Remember: UUIDs contain hyphens, so simple string splitting will ALWAYS break them!**
