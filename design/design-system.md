# Design System

## Typography

Primary Font: Geist

Philosophy:
- Clear over decorative
- Confident over loud
- Readability first
- Large editorial headings
- Minimal font family

# Spacing Philosophy

Whitespace is not empty space.

Whitespace creates focus.

Spacing should feel intentional.

Users should never feel visually overwhelmed.

Large sections breathe.

Small elements stay close to their related content.

---

## 8px Spacing System

4px

8px

12px

16px

24px

32px

48px

64px

96px

128px

160px

192px

# Border Radius
 ### Reference
 0px     → Industrial
4px     → Corporate
8px     → Modern
12px    → Friendly
16px    → Soft
24px    → Playful
9999px  → Pills

Buttons: 12px

Cards: 20px

Inputs: 12px

Floating Panels: 24px

Never exceed 28px(for small buttons but can exceed but large icons or clickthroughs).

# COLOR Pallete
Background:
#050505

Surface:
#101010

Primary Text:
#FFFFFF

Secondary Text:
#BEBEBE

Accent:
#E63946

# Grid system
Grid
↓

Buttons
↓

Cards
↓

Motion

↓

Scroll

↓

Lighting

↓

Accessibility

↓

Responsive


# Buttons

## Philosophy

Buttons should communicate confidence, not urgency.

They should feel premium, precise, and effortless.

A button should invite interaction, never demand attention.

The primary CTA should always be the visual focus.

---

## Primary Button

Background:
Crimson Red (#E63946)

Text:
White

Radius:
12px

Padding:
Generous horizontal spacing

Shadow:
Very subtle

Hover:
- Slight elevation
- Slight brightness increase
- Soft shadow
- Cursor becomes magnetic

Transition:
Smooth
Never snappy.

---

## Secondary Button

Transparent background

1px subtle border

White text

Hover:
Background becomes Surface (#101010)

---

## Rules

Only one Primary CTA per major section.

Never use more than two button styles.

Never use glowing buttons.

Never use heavy shadows.

Never animate button colors aggressively.

Buttons should feel tactile.



# Cards/surfaces

## Philosophy

Cards are containers for information.

They should feel sculpted, not boxed.

Cards should never compete with the content inside them.

Whitespace is more important than decoration.

---

## Appearance

Background:
Surface (#101010)

Border:
1px subtle border

Radius:
20px (small)
32px (medium)
40px (large)

Shadow:
Very soft

No harsh outlines.

---

## Hover

Lift upward slightly.

Very small scale increase.

Soft lighting shift.

Subtle border highlight.

Never bounce.

Never rotate dramatically.

---

## Glass Cards

Used only for floating UI.

Backdrop blur.

Very low opacity.

Subtle reflection.

Never overuse glassmorphism.

---

## Rules

Cards must have generous padding.

Cards should breathe.

Never overcrowd information.

Every card must have a clear focal point.

Large cards may use more rounded corners than small cards.


# Motion Language

## Philosophy

Motion is communication.

Every animation should have a purpose.

Motion should guide attention, reinforce hierarchy, and create emotion.

Users should feel that every movement is intentional.

The interface should never feel rushed.

---

## Motion Personality

Calm.

Confident.

Elegant.

Cinematic.

Smooth.

Premium.

Precise.

Never flashy.

Never distracting.

Never chaotic.

---

## Motion Rules

Animation should feel physically believable.

Objects should have weight.

Nothing should suddenly appear.

Nothing should suddenly disappear.

Everything enters with intention.

Everything exits gracefully.

Motion should support the story, not interrupt it.

---

## Timing

Fast
150ms

Medium
300ms

Slow
500ms

Hero Reveal
800–1200ms

Scene Transition
1000–1500ms

Scroll Storytelling
Controlled by scroll progress.

---

## Easing Philosophy

No linear motion.

No bounce.

No elastic effects.

Use smooth ease-in-out curves.

Motion should accelerate naturally and slow down naturally.

---

## Scroll Philosophy

Scrolling should feel like moving through a film.

Sections should transform into each other.

Avoid obvious "section jumps."

Transitions should feel continuous.

The user should feel like they are travelling through one experience.

---

## Reveal Philosophy

Text reveals before supporting elements.

Large headlines reveal first.

Supporting content follows.

Buttons appear last.

Never reveal everything at once.

Guide the user's eye.

---

## Hover Philosophy

Hover should confirm interaction.

Hover should never become the attraction.

Small elevation.

Soft lighting.

Minor scale.

Subtle movement.

---

## Lighting Motion

Crimson is treated as light.

Light fades naturally.

Light moves slowly.

Lighting should feel atmospheric.

Lighting should never overpower typography.

---

## Performance Rules

Always prioritize smoothness over complexity.

60 FPS whenever possible.

Use GPU-accelerated transforms.

Avoid layout shifts.

Avoid unnecessary animation.

Respect users who prefer reduced motion.

---

## Things We Never Use

Bounce animations.

Rubber-band effects.

Fast flashing.

Random floating objects.

Infinite distracting motion.

Overly dramatic rotations.

Cheap easing.

Animations without purpose.
---


# Cursor

## Philosophy

The cursor is an extension of the user's intention.

It should provide subtle feedback without becoming a gimmick.

---

## Rules

Cursor interactions should feel smooth.

Magnetic interactions should be subtle.

Interactive elements should gently attract the cursor.

Never replace the native cursor.

Never create oversized cursor blobs.

Cursor effects should reinforce interaction, not become entertainment.
# Icons


## Philosophy

Icons support content.

Typography always comes first.

Icons should simplify understanding.

---

## Rules

Use one icon family throughout the website.

Minimal stroke style.

Consistent visual weight.

Never mix outline and filled icons.

Icons should never dominate headlines.

Icons should always align to the spacing system.

---
# Accessibility


## Philosophy

Beautiful design should be usable by everyone.

Accessibility is not optional.

---

## Rules

Maintain sufficient color contrast.

Support keyboard navigation.

Provide meaningful alt text where appropriate.

Respect reduced-motion preferences.

Animations should never block interaction.

Typography should remain readable on all screen sizes.

Focus states should always be visible.

---
# Responsive Design

## Philosophy

The experience should adapt, not shrink.

Every layout should feel intentionally designed for its screen size.

---

## Rules

Desktop is the primary experience.

Tablet layouts should preserve hierarchy.

Mobile layouts should prioritize readability.

Avoid horizontal scrolling.

Avoid tiny touch targets.

Spacing should scale proportionally.

Typography should scale smoothly.

Motion should be simplified on smaller devices when necessary.