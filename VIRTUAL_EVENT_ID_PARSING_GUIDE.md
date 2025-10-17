# Virtual Event ID Parsing Guide & Rules

## 🚨 CRITICAL RULE: UUID Parsing with Hyphens

**NEVER use simple string splitting (`split('-')`) when parsing IDs that contain UUIDs with hyphens!**

### ❌ WRONG Approach (What Caused the Bug)
```javascript
// DON'T DO THIS - It breaks UUIDs!
const parts = eventId.split('-');
const habitId = parts[1]; // Only gets first part of UUID
const eventDate = parts.slice(2).join('-'); // Gets wrong date
```

### ✅ CORRECT Approach (Regex Pattern Matching)
```javascript
// DO THIS - Use regex to find date pattern
const yearPattern = /-\d{4}-\d{2}-\d{2}$/;
const match = withoutPrefix.match(yearPattern);

let habitId, eventDate;
if (match) {
  const dateStartIndex = withoutPrefix.lastIndexOf(match[0]);
  habitId = withoutPrefix.substring(0, dateStartIndex);
  eventDate = withoutPrefix.substring(dateStartIndex + 1);
} else {
  // Fallback logic
  habitId = withoutPrefix.substring(0, withoutPrefix.length - 11);
  eventDate = withoutPrefix.substring(withoutPrefix.length - 10);
}
```

## 📋 Virtual Event ID Format

### Structure
```
virtual-{UUID}-{YYYY-MM-DD}
```

### Examples
- `virtual-0cb25ca9-c2e5-4a8a-ad3a-d3eb55a4a23b-2025-10-08`
- `virtual-e99c2c82-ccb9-47b1-8de6-0c1f6b957f3b-2025-12-25`

### Components
- **Prefix:** `virtual-` (8 characters)
- **UUID:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (36 characters with hyphens)
- **Date:** `YYYY-MM-DD` (10 characters with hyphens)

## 🔧 Parsing Algorithm

### Step 1: Remove Prefix
```javascript
const withoutPrefix = eventId.substring(8); // Remove 'virtual-'
```

### Step 2: Find Date Pattern
```javascript
const yearPattern = /-\d{4}-\d{2}-\d{2}$/;
const match = withoutPrefix.match(yearPattern);
```

### Step 3: Extract Components
```javascript
if (match) {
  const dateStartIndex = withoutPrefix.lastIndexOf(match[0]);
  habitId = withoutPrefix.substring(0, dateStartIndex);
  eventDate = withoutPrefix.substring(dateStartIndex + 1);
}
```

## 🧪 Testing Checklist

### Before Implementing Any ID Parsing:
1. **Test with Real UUIDs:** Use actual UUIDs from your database
2. **Test Edge Cases:** Different date formats, special characters
3. **Add Console Logs:** Log the parsed components to verify correctness
4. **Validate Results:** Ensure habitId is a valid UUID and eventDate is a valid date

### Debug Logging Template
```javascript
console.log('Original Event ID:', eventId);
console.log('Without Prefix:', withoutPrefix);
console.log('Date Pattern Match:', match);
console.log('Parsed habitId:', habitId);
console.log('Parsed eventDate:', eventDate);
```

## 🚨 Common Pitfalls

### 1. Simple String Splitting
```javascript
// ❌ WRONG - Breaks UUIDs
const parts = eventId.split('-');
```

### 2. Assuming Fixed Positions
```javascript
// ❌ WRONG - UUIDs have variable lengths
const habitId = eventId.substring(8, 44);
```

### 3. Not Handling Edge Cases
```javascript
// ❌ WRONG - No fallback logic
if (!match) {
  throw new Error('Invalid format');
}
```

## 📚 Related Patterns

### Other ID Formats to Watch For
- **Physical Events:** `event-{UUID}-{timestamp}`
- **User Sessions:** `session-{UUID}-{date}`
- **Notifications:** `notif-{UUID}-{type}`

### Universal Parsing Rule
**When parsing any ID that contains UUIDs:**
1. Use regex pattern matching
2. Never rely on simple string splitting
3. Always include fallback logic
4. Add comprehensive logging
5. Test with real data

## 🔄 Maintenance

### When to Review This Guide
- Adding new ID formats
- Changing UUID generation
- Modifying date formats
- Adding new parsing logic

### Code Review Checklist
- [ ] Uses regex pattern matching
- [ ] Has fallback logic
- [ ] Includes debug logging
- [ ] Tested with real UUIDs
- [ ] Handles edge cases

## 📝 Quick Reference

### Regex Patterns
```javascript
// Date pattern (YYYY-MM-DD)
const datePattern = /-\d{4}-\d{2}-\d{2}$/;

// UUID pattern (for validation)
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Virtual event ID pattern
const virtualEventPattern = /^virtual-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-\d{4}-\d{2}-\d{2}$/i;
```

### Safe Parsing Function Template
```javascript
function parseVirtualEventId(eventId) {
  if (!eventId.startsWith('virtual-')) {
    throw new Error('Invalid virtual event ID format');
  }
  
  const withoutPrefix = eventId.substring(8);
  const yearPattern = /-\d{4}-\d{2}-\d{2}$/;
  const match = withoutPrefix.match(yearPattern);
  
  let habitId, eventDate;
  
  if (match) {
    const dateStartIndex = withoutPrefix.lastIndexOf(match[0]);
    habitId = withoutPrefix.substring(0, dateStartIndex);
    eventDate = withoutPrefix.substring(dateStartIndex + 1);
  } else {
    // Fallback
    habitId = withoutPrefix.substring(0, withoutPrefix.length - 11);
    eventDate = withoutPrefix.substring(withoutPrefix.length - 10);
  }
  
  // Validate results
  if (!habitId || !eventDate) {
    throw new Error('Failed to parse virtual event ID');
  }
  
  return { habitId, eventDate };
}
```

---

**Remember: UUIDs contain hyphens, so simple string splitting will ALWAYS break them!**
