# FlowDeck Page Builder - Complete Documentation

## 🎨 Overview

The FlowDeck Page Builder is a professional, no-code visual editor that allows you to create and edit pages through drag-and-drop, real-time styling, and instant preview - similar to Webflow, Framer, or WordPress page builders.

## ✨ Features

### Core Functionality
- ✅ **Drag & Drop** - Click and drag elements anywhere on the canvas
- ✅ **Real-Time Preview** - See changes instantly as you edit
- ✅ **Auto-Save** - Automatic saving every 3 seconds
- ✅ **Undo/Redo** - Full history with keyboard shortcuts
- ✅ **Multi-Element Support** - Text, Headings, Buttons, Images, Containers
- ✅ **Template Library** - Pre-made designs to start quickly
- ✅ **Layer Management** - Organize, lock, hide, and duplicate elements
- ✅ **Advanced Styling** - Colors, fonts, shadows, opacity, and more
- ✅ **Zoom Controls** - 25% to 200% canvas zoom
- ✅ **Grid Overlay** - Visual alignment grid
- ✅ **Keyboard Shortcuts** - Professional workflow shortcuts

### Advanced Features
- ✅ **Version History** - Every change is tracked
- ✅ **Draft/Publish** - Safe editing before going live
- ✅ **Responsive Canvas** - Scale and preview at different sizes
- ✅ **Touch Optimized** - Works perfectly on iPad
- ✅ **Visual Feedback** - Hover states, drag handles, selection rings
- ✅ **Element Locking** - Lock elements to prevent accidental edits
- ✅ **Visibility Toggle** - Show/hide elements without deleting
- ✅ **Copy/Paste Ready** - Infrastructure in place

## 🚀 Getting Started

### 1. Access the Page Builder

Navigate to: **Admin Panel → Page Builder** (or `/admin/page-builder`)

### 2. Select a Page

From the left sidebar, click on any page:
- Intro Presentation
- What We Guarantee
- Products Main
- Category Pages (LS, LL, GL, GS)
- Knowledge Base

### 3. Start Editing

**Add Elements:**
Click the element buttons in the toolbar:
- **Text** - Regular paragraphs
- **Heading** - Large titles
- **Button** - Interactive buttons
- **Image** - Pictures and graphics
- **Container** - Group elements together

**Or use a template:**
Click the "Templates" button to start with a pre-made design.

## 🎯 How to Use

### Drag & Drop Elements

1. **Select an Element** - Click on any element to select it
2. **Drag Handle Appears** - Hover over selected element to see drag handle at top
3. **Drag to Move** - Click and hold the drag handle, then drag anywhere
4. **Drop** - Release to place element at new position

### Edit Element Properties

**Two Ways to Edit:**

1. **Layers Panel** (Right sidebar, "Layers" tab)
   - Click any element to select it
   - Quick actions: Show/hide, lock/unlock, duplicate, delete

2. **Properties Panel** (Right sidebar, "Properties" tab)
   - Edit content (text, image URLs)
   - Position (X, Y coordinates)
   - Size (Width, Height)
   - Typography (font size, weight, alignment)
   - Colors (background, text with color picker)
   - Effects (border radius, opacity, box shadow)
   - Spacing (padding)
   - Layering (z-index)

### Style Controls

**Typography:**
- Font Size (in pixels)
- Font Weight (Normal, Medium, Semibold, Bold)
- Text Alignment (Left, Center, Right)

**Colors:**
- Background Color (click to open color picker)
- Text Color (click to open color picker)
- Visual color picker with hex, RGB, HSL support

**Effects:**
- Border Radius (rounded corners)
- Opacity (transparency slider 0-100%)
- Box Shadow (None, Small, Medium, Large, XL)

**Layout:**
- Padding (spacing inside element)
- Z-Index (layer order, higher = on top)

### Canvas Controls

**Zoom:**
- Click **-** to zoom out (min 25%)
- Click **+** to zoom in (max 200%)
- Current zoom displayed in toolbar

**Grid:**
- Click grid icon to toggle alignment grid on/off
- Helps align elements visually

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo (alternative) |
| `Delete` | Delete selected element |
| `Ctrl+D` / `Cmd+D` | Duplicate selected element |
| `Ctrl+S` / `Cmd+S` | Save changes |

## 📚 Element Types

### Text
- Regular paragraph text
- Supports multi-line content
- Configurable font size, color, alignment
- Default: 16px, black text

### Heading
- Large title text
- Bold by default
- Configurable font size (default 32px)
- Use for page titles, section headers

### Button
- Interactive button element
- Configurable background and text colors
- Border radius for rounded corners
- Default: Blue background, white text

### Image
- Display images on your page
- Enter image URL or upload
- Configurable size and border radius
- Supports external URLs and uploaded images

### Container
- Group multiple elements
- Add background color
- Apply padding and shadows
- Useful for cards and sections

## 🎨 Templates

Pre-made designs to start quickly:

### 1. Hero Section
- Large heading
- Subtext paragraph
- Call-to-action button
- Use for: Landing pages, intro screens

### 2. Feature Grid
- Three column layout
- White cards with shadows
- Use for: Feature lists, benefits, services

### 3. CTA Banner
- Bold background color
- Centered heading and button
- Use for: Calls-to-action, promotions

### 4. Product Showcase
- Image on left
- Title and description on right
- Use for: Product pages, case studies

**To use a template:**
1. Click "Templates" button
2. Browse available templates
3. Click on any template to apply it
4. Customize elements to your needs

## 💾 Saving & Publishing

### Auto-Save
- Saves automatically every 3 seconds
- "Saving..." indicator appears during save
- "Saved" checkmark when complete
- No action needed!

### Manual Save
- Click "Save" button in toolbar
- Or use `Ctrl+S` / `Cmd+S`
- Saves current state as draft

### Publish
- Click "Publish" button to make changes live
- Published pages show "Live" badge
- Published changes appear on actual site

## 🔧 Advanced Features

### Layer Panel

**Element List:**
- Shows all elements on the page
- Displays element type (emoji icon)
- Shows element position (X, Y coordinates)
- Click to select element

**Quick Actions:**
- 👁️ **Show/Hide** - Toggle element visibility
- 🔒 **Lock/Unlock** - Prevent accidental edits
- 📋 **Duplicate** - Create a copy (offset by 20px)
- 🗑️ **Delete** - Remove element

### Undo/Redo System

**Full History:**
- Every change is tracked
- Unlimited undo levels
- Separate history per page

**How it Works:**
1. Make changes to your page
2. Click undo to revert last change
3. Click redo to re-apply undone change
4. History is preserved until you switch pages

### Version History

**Automatic Versioning:**
- Every save creates a new version
- Stored in `page_config_history` table
- Includes version number and timestamp
- Can be used for rollback (feature ready)

## 🎓 Best Practices

### Organization
- **Use Layers Panel** - Keep track of all elements
- **Name Elements** - Use descriptive content for easy identification
- **Lock Background Elements** - Prevent accidental moves
- **Use Containers** - Group related elements together

### Design
- **Use Grid** - Enable grid for better alignment
- **Consistent Spacing** - Use standard padding values (8px, 16px, 24px)
- **Color Harmony** - Stick to your brand colors
- **Typography Scale** - Use consistent font sizes (16px, 24px, 32px, 48px)

### Workflow
- **Start with Templates** - Faster than starting from scratch
- **Save Often** - Though auto-save is enabled, manual saves create checkpoints
- **Test Before Publishing** - Review all changes in preview mode
- **Use Undo Liberally** - Don't be afraid to experiment

## 🐛 Troubleshooting

### Element won't drag
- Check if element is locked (🔒 icon in layers panel)
- Make sure you're dragging from the drag handle (top of element)
- Try clicking element first to select it

### Changes not saving
- Check for "Saving..." or "Saved" indicator in toolbar
- Check browser console for errors
- Try manual save with Ctrl+S

### Element disappeared
- Check if element is hidden (👁️ icon in layers panel)
- Check if element is off-canvas (scroll or zoom out)
- Use undo to restore accidentally deleted elements

### Color picker not working
- Click directly on the color preview box
- Click outside to close picker
- Changes apply immediately

## 🔮 Future Enhancements

Planned features for future releases:

- [ ] Responsive breakpoints (mobile, tablet, desktop)
- [ ] Animation presets
- [ ] Custom fonts
- [ ] Component library
- [ ] Copy/paste between pages
- [ ] Export/import configurations
- [ ] Collaborative editing
- [ ] Design system integration
- [ ] A/B testing support

## 📊 Technical Details

### Database Schema

**page_configs table:**
```sql
- id: unique identifier
- page_key: page identifier (e.g., 'intro-presentation')
- page_title: display name
- config: JSONB (elements, styles)
- is_published: boolean
- created_at, updated_at: timestamps
- updated_by, published_by: user references
```

**page_config_history table:**
```sql
- id: unique identifier
- page_config_id: reference to page_configs
- config: JSONB snapshot
- version: integer (incremental)
- created_at: timestamp
- created_by: user reference
```

### Config Structure

```typescript
{
  elements: [
    {
      id: "el-123",
      type: "button",
      content: "Click Me",
      position: { x: 100, y: 200, width: 200, height: 60 },
      styles: {
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
        fontSize: "16px",
        borderRadius: "8px"
      },
      visible: true,
      locked: false
    }
  ],
  styles: {
    backgroundColor: "#FFFFFF"
  }
}
```

## 🎯 Tips & Tricks

1. **Duplicate for Consistency** - Create one perfect element, then duplicate it
2. **Use Templates as Starting Points** - Customize rather than create from scratch
3. **Layer Management** - Name elements by their content for easy finding
4. **Keyboard Shortcuts** - Learn them for faster editing
5. **Grid Snapping** - Enable grid for pixel-perfect alignment
6. **Z-Index for Overlays** - Use high z-index (999+) for modals and overlays
7. **Container First** - Create container, then add elements inside
8. **Preview at Different Zooms** - Check design at 50%, 100%, and 150%

## 📞 Support

For issues or questions:
- Check this documentation first
- Review the troubleshooting section
- Check browser console for errors
- Contact development team with:
  - Page you're editing
  - Element(s) affected
  - Steps to reproduce issue
  - Browser and version

---

**Version:** 1.0.0
**Last Updated:** 2026-02-08
**Status:** Production Ready ✅
