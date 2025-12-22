# What Are Git Branches? (Simple Explanation)

## Think of Branches Like Different Versions of Your Website

Imagine you're writing a book:
- **Main branch** = The final, published version that everyone reads
- **Other branches** = Different drafts or experimental versions you're working on

## In Your Project:

### 🌟 **main** branch
- This is your **production website** - the one users see
- It's the stable, working version
- Deployed to: `app.humancatalystbeacon.com`

### 🧪 **Other branches** (like `stellar-map`, `feature-ux`, etc.)
- These are **different features or experiments** you're working on
- They might have new features that aren't ready yet
- Each one is like a separate version of your website

## Why Use Branches?

1. **Test new features** without breaking the main site
2. **Work on multiple things** at the same time
3. **Keep the main site stable** while you experiment

## What We're Doing:

We're deploying **each branch to its own subdomain** so you can:
- See the main site at: `app.humancatalystbeacon.com`
- Test the stellar-map feature at: `stellar-map.humancatalystbeacon.com`
- Test UX improvements at: `feature-ux.humancatalystbeacon.com`
- etc.

## Simple Analogy:

Think of it like having multiple copies of your house:
- **main** = Your actual house (where you live)
- **stellar-map** = A model house to test new furniture
- **feature-ux** = Another model house to test different paint colors

You can test things in the model houses without affecting your real house!

## Do You Need All These Branches?

**Probably not!** You might only need:
- **main** branch → Your live website
- Maybe 1-2 other branches for testing

The other branches are just there if you want to test them separately.

## What Should We Do?

**Option 1**: Deploy only the **main** branch (simplest)
- Just have one website: `app.humancatalystbeacon.com`
- Ignore the other branches for now

**Option 2**: Deploy main + 1-2 branches you actually want to test
- Main site + maybe stellar-map for testing

**Option 3**: Deploy all branches (what we're doing now)
- Every branch gets its own subdomain
- Good if you want to test everything separately

Which do you prefer? Most people start with **Option 1** (just the main branch)!

