# Share Features Documentation

This document outlines the new sharing functionality implemented in Funnty.

## Overview

The copy button has been replaced with a comprehensive share system that provides three different ways to share your text designs:

1. **Share URL** - Generate a shareable link with your current settings
2. **Copy Image** - Copy the canvas as an image to clipboard
3. **Download** - Download the canvas as a PNG file

## Features

### Share URL

When you click "Share URL", the app will:

- Generate a URL containing all your current text configuration settings
- Only include parameters that differ from the default values to keep URLs clean
- Use the native Web Share API when available (mobile devices)
- Fall back to copying the URL to clipboard on desktop browsers

**Example URL:**
```
https://yourapp.com/?text=Hello%20World&font=Inter&size=32&weight=700&color=%23FF0000
```

### Copy Image

Copies the current canvas design as a PNG image to your clipboard. This feature:

- Uses the modern Clipboard API when available
- Falls back to copying a data URL if the primary method fails
- Provides user feedback through alerts
- Works with the exact canvas dimensions and quality

### Download

Downloads the current canvas design as a PNG file with the filename `funnty-design.png`.

## URL Parameters

The following parameters are supported in shared URLs:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `text` | string | The text content | `Hello%20World` |
| `font` | string | Font family name | `Montserrat` |
| `size` | number | Font size in pixels | `24` |
| `weight` | string | Font weight (100-900) | `700` |
| `color` | string | Text color (hex) | `%23FF0000` |
| `strokeWidth` | number | Outline width | `2` |
| `strokeColor` | string | Outline color (hex) | `%23000000` |
| `letterSpacing` | number | Letter spacing in pixels | `1.5` |
| `lineHeight` | number | Line height multiplier | `1.4` |
| `alignment` | string | Text alignment | `center` |

## Technical Implementation

### URL State Persistence

- Settings are automatically loaded from URL parameters on page load
- Only non-default values are included in generated URLs
- URL encoding/decoding is handled automatically
- State updates don't automatically update the URL (only on explicit share)

### Canvas Integration

The share functionality requires access to the HTML canvas element:

```tsx
<QuickActions 
  onCopy={legacyCallback} 
  canvas={canvasRef.current} 
/>
```

### Utilities

New utility functions added to `canvasTextUtils.ts`:

- `shareUrl(textConfig)` - Generate and share URL
- `downloadCanvasAsImage(canvas, filename?)` - Download canvas as PNG
- `getConfigFromUrl()` - Parse URL parameters into config object

## Browser Compatibility

- **Share URL**: Uses Web Share API when available, falls back to clipboard
- **Copy Image**: Uses Clipboard API with data URL fallback
- **Download**: Uses standard HTML5 download attribute

## User Experience

- Haptic feedback on mobile devices when adjusting settings
- Visual indicators for active font weights in the slider
- Smooth animations and transitions
- Accessible button labels and icons