# Debugging Methodology Rules

## 🚨 CRITICAL DEBUGGING RULES

### Rule 1: Complete CSS Analysis
**NEVER** debug visual issues without checking ALL CSS rules affecting the element.

#### Required Steps:
1. **Search ALL CSS files** for the element's class:
   ```bash
   grep -r "class-name" src/styles/
   grep -r "\.class-name" src/styles/
   ```

2. **Check pseudo-elements** (::before, ::after, ::hover, etc.):
   ```bash
   grep -r "::before" src/styles/
   grep -r "::after" src/styles/
   ```

3. **Examine ALL properties** that could cause the issue:
   ```bash
   grep -r "padding" src/styles/
   grep -r "border" src/styles/
   grep -r "margin" src/styles/
   ```

### Rule 2: Browser Dev Tools First
**ALWAYS** use browser dev tools to inspect the actual rendered element before making changes.

#### Required Steps:
1. **Right-click** the problematic element
2. **Inspect Element** to see the actual CSS being applied
3. **Check Computed Styles** to see final values
4. **Look for pseudo-elements** in the Elements panel
5. **Take a screenshot** if needed for reference

### Rule 3: Systematic Investigation
**NEVER** jump to conclusions. Follow a systematic approach.

#### Investigation Order:
1. **HTML Structure** - Check for extra/missing tags
2. **CSS Classes** - Verify all classes are correct
3. **CSS Properties** - Check all relevant properties
4. **Pseudo-elements** - Examine ::before, ::after, etc.
5. **Parent Elements** - Check if parent styles are affecting it
6. **CSS Cascade** - Verify specificity and inheritance

### Rule 4: Ask for Help Early
**IF** you can't find the issue after 3 attempts, ask the user for help.

#### When to Ask:
- After checking HTML structure
- After examining main CSS classes
- After checking pseudo-elements
- **BEFORE** making random changes

### Rule 5: Document the Process
**ALWAYS** document what you've checked and what you found.

#### Documentation Format:
```
## Debugging Process for [Issue Description]

### Step 1: HTML Structure Check
- [ ] Checked for extra/missing div tags
- [ ] Verified proper nesting
- [ ] Result: [What was found]

### Step 2: CSS Analysis
- [ ] Searched for class: [class-name]
- [ ] Checked pseudo-elements
- [ ] Result: [What was found]

### Step 3: Browser Dev Tools
- [ ] Inspected element
- [ ] Checked computed styles
- [ ] Result: [What was found]

### Conclusion: [What was the actual cause]
```

## 🔧 TROUBLESHOOTING METHODOLOGY

### Phase 1: Initial Assessment (5 minutes)
1. **Describe the issue** clearly
2. **Identify the affected element(s)**
3. **Take a screenshot** if visual
4. **Check browser console** for errors

### Phase 2: HTML Structure Check (5 minutes)
1. **Read the component file** completely
2. **Check for extra/missing tags**
3. **Verify proper nesting**
4. **Look for syntax errors**

### Phase 3: CSS Analysis (10 minutes)
1. **Search for the element's classes**:
   ```bash
   grep -r "element-class" src/styles/
   ```
2. **Check pseudo-elements**:
   ```bash
   grep -r "::before\|::after" src/styles/
   ```
3. **Search for problematic properties**:
   ```bash
   grep -r "padding\|border\|margin" src/styles/
   ```

### Phase 4: Browser Dev Tools (10 minutes)
1. **Inspect the element**
2. **Check computed styles**
3. **Look for pseudo-elements**
4. **Check parent elements**
5. **Verify CSS cascade**

### Phase 5: Targeted Fix (5 minutes)
1. **Make ONE specific change**
2. **Test the fix**
3. **Document what was changed**
4. **Commit with clear message**

### Phase 6: Verification (5 minutes)
1. **Test in browser**
2. **Check for side effects**
3. **Verify fix is complete**
4. **Update documentation**

## 🚨 ESCALATION RULES

### Escalate to User When:
- [ ] 3 attempts have failed
- [ ] Issue is not in HTML structure
- [ ] Issue is not in main CSS classes
- [ ] Issue is not in pseudo-elements
- [ ] Browser dev tools show unexpected behavior

### Escalation Message Format:
```
I've tried the following debugging steps but haven't found the issue:

1. ✅ HTML Structure: [What I checked]
2. ✅ CSS Classes: [What I checked]  
3. ✅ Pseudo-elements: [What I checked]
4. ✅ Browser Dev Tools: [What I found]

Could you please:
- Inspect the element in browser dev tools
- Check if there are any console errors
- Let me know what CSS properties you see applied
- Share any additional details about the issue

This will help me identify the root cause more effectively.
```

## 📋 DEBUGGING CHECKLIST

### Before Starting:
- [ ] Understand the issue clearly
- [ ] Identify the affected element(s)
- [ ] Have browser dev tools ready

### HTML Check:
- [ ] Read complete component file
- [ ] Check for extra/missing tags
- [ ] Verify proper nesting
- [ ] Look for syntax errors

### CSS Check:
- [ ] Search for element classes
- [ ] Check pseudo-elements
- [ ] Search for problematic properties
- [ ] Verify CSS cascade

### Browser Check:
- [ ] Inspect the element
- [ ] Check computed styles
- [ ] Look for pseudo-elements
- [ ] Check parent elements

### Fix Implementation:
- [ ] Make targeted change
- [ ] Test the fix
- [ ] Document the change
- [ ] Commit with clear message

## 🎯 SUCCESS METRICS

### Good Debugging:
- ✅ Found root cause within 3 attempts
- ✅ Used systematic approach
- ✅ Checked all relevant areas
- ✅ Made targeted fix
- ✅ Documented the process

### Bad Debugging:
- ❌ Made random changes
- ❌ Didn't check pseudo-elements
- ❌ Didn't use browser dev tools
- ❌ Jumped to conclusions
- ❌ Didn't document the process

## 📚 COMMON MISTAKES TO AVOID

1. **Don't assume** the issue is in the most obvious place
2. **Don't skip** pseudo-elements in CSS analysis
3. **Don't make** random changes without understanding
4. **Don't ignore** browser dev tools
5. **Don't forget** to check parent elements
6. **Don't assume** CSS specificity is correct
7. **Don't skip** documenting the process

---

**Remember: Systematic debugging saves time and prevents frustration!**
