# FTC FlowDeck - CMS User Guide

## Introduction

Welcome to the FTC FlowDeck Content Management System! This guide will help you edit products, upload PDFs, and manage presentations without touching any code.

## Accessing the CMS

### Option 1: Local Development
```
http://localhost:3333
```

### Option 2: Production
```
https://ftc-flowdeck.sanity.studio
```

**Login with your Sanity account credentials.**

## Dashboard Overview

The CMS is organized into sections:

- **Products** - Manage filtration products and specifications
- **Intro Presentation** - Edit presentation slides
- **Knowledge Base** - Create and edit articles
- **PDF Content Library** - Upload and organize PDF files

## Managing Products

### Adding a New Product

1. **Navigate to Products** → **All Products**
2. Click **"Create"** button (top-right)
3. Fill in the product information:

#### Basic Information
- **Product Title**: E.g., "CLARIFY 740 Premium"
- **Slug**: Auto-generated URL (click "Generate")
- **Product Line**: Select parent line (CLARIFY, SIEVA, etc.)
- **SKU**: Product code (e.g., "CLF-740-PRM")
- **Display Order**: Number for sorting (e.g., 1, 2, 3...)

#### Images
- **Product Image**: Main image shown in grids
- **Product Image (Color)**: Color version for detail page
- **Product Image (Black & White)**: B&W version (optional)

**To upload an image:**
1. Click "Select image"
2. Choose "Upload" tab
3. Drag & drop or click to browse
4. Adjust focal point (hotspot) if needed
5. Click "Upload"

#### Specifications (from PDF)

Fill in all the technical specifications:

- **Common Markets**: Click "Add item" for each market
  - General Industrial
  - Oil & Gas
  - Chemical Production
  - Power Generation
  - Water Treatment

- **Common Applications**: Full text description
- **Flow Direction**: E.g., "Outside-to-Inside"
- **Micron Ratings**: E.g., "0.5 - 150 micron"
- **Standard Efficiency Rating**: E.g., "99.98%"
- **Media Options**: Add multiple options
- **Hardware Options**: Add multiple options
- **Diameter**: E.g., "6.25""
- **Standard Lengths**: E.g., "30" & 40""
- **Flow Rate Min/Max**: Enter numbers
- **Dirt Loading Min/Max**: Enter numbers
- **Surface Area**: Text description
- **Max Differential Pressure**: E.g., "35 PSID (2.4 bar)"
- **Vessel Technology**: E.g., "Clarify™"

#### PDF Content
1. Click "Add item" under **PDF Content**
2. Select existing PDFs from the list
3. Add multiple PDFs (spec sheets, brochures, etc.)

**Click "Publish"** when done!

### Editing an Existing Product

1. **Navigate to Products** → **All Products**
2. Find the product in the list (use search if needed)
3. Click on the product name
4. Make your changes
5. **Click "Publish"** to save

**Changes appear live immediately** for all connected users!

### Deleting a Product

1. Open the product
2. Click the **"..."** menu (top-right)
3. Select **"Delete"**
4. Confirm deletion

## Managing PDFs

### Uploading a New PDF

1. **Navigate to PDF Content Library**
2. Click **"Create"**
3. Fill in information:
   - **Title**: E.g., "CLARIFY 740 Technical Spec"
   - **Description**: Short summary
   - **PDF File**: Click "Select file" → Upload
   - **Display Order**: Number for sorting
   - **Category**: Select type (Spec Sheet, Sales Sheet, etc.)
4. **Click "Publish"**

### Linking PDFs to Products

After uploading PDFs:
1. Go to the product
2. Scroll to **PDF Content** section
3. Click "Add item"
4. Search and select the PDF
5. Add multiple PDFs if needed
6. **Click "Publish"**

These PDFs will appear as checkboxes in the "Send Files To" section on the product detail page.

## Managing Presentations

### Adding a New Slide

1. **Navigate to Intro Presentation**
2. Click **"Create"**
3. Fill in slide information:
   - **Slide Title**: E.g., "Company Overview"
   - **Slug**: Auto-generated
   - **Slide Order**: 1, 2, 3... (determines sequence)
   - **Layout**: Full Width, Split, or Custom
   - **Background Image**: Upload background photo
   - **Background Color**: Or use solid color (hex code)

#### Adding Content
1. Click in the **Content** area
2. Use the toolbar to format:
   - **Normal**: Body text
   - **H1, H2, H3**: Headings
   - **Bold / Italic**: Text styling
   - **Bullet list / Numbered list**

3. To add images in content:
   - Click **"+"** icon
   - Select **"Image"**
   - Upload and adjust

4. **Video URL** (optional): Paste YouTube or Vimeo URL

**Click "Publish"** when done!

### Reordering Slides

1. Edit each slide
2. Change the **Slide Order** number
3. **Publish** each slide
4. Slides will appear in numerical order

## Managing Knowledge Base

### Creating an Article

1. **Navigate to Knowledge Base**
2. Click **"Create"**
3. Fill in:
   - **Article Title**: Clear, descriptive title
   - **Slug**: Auto-generated
   - **Category**: Technical, Application Guide, FAQ, etc.
   - **Featured Image**: Main article image
   - **Excerpt**: Short summary (2-3 sentences)

#### Writing Content
1. Use the rich text editor in **Content** section
2. Add headings, lists, bold text
3. Insert images inline
4. Add links:
   - Highlight text
   - Click link icon
   - Paste URL

#### Related PDFs
1. Scroll to **Related PDFs**
2. Click "Add item"
3. Select relevant PDFs
4. These will show as downloads at the bottom of the article

**Click "Publish"**!

## Tips & Best Practices

### Images
- **Format**: PNG or JPG
- **Size**: Max 5MB per image
- **Resolution**: 2000px wide is ideal
- **Naming**: Use descriptive names before uploading

### PDFs
- **File Size**: Keep under 10MB for email compatibility
- **Naming**: Clear, professional names (e.g., "CLARIFY-740-Spec-Sheet.pdf")
- **Version Control**: Include version numbers if needed

### Content Writing
- **Be Concise**: Short paragraphs (2-3 sentences)
- **Use Lists**: Bullet points for easy scanning
- **Check Spelling**: Proofread before publishing
- **Test Links**: Click links after publishing to verify

### Publishing Workflow
1. **Draft**: Make all your changes
2. **Review**: Double-check spelling, images, specs
3. **Publish**: Click the green "Publish" button
4. **Verify**: Check the live website to ensure it looks correct

## Real-Time Collaboration

Multiple team members can edit content simultaneously:

- **Yellow dot** next to a field = Someone else is editing
- **Blue border** around a field = You're editing
- **Auto-save**: Changes save automatically every few seconds
- **Publish**: Final step to make changes live

**Be careful not to overwrite each other's work!**

## Common Tasks

### Update Product Specifications

**Scenario**: Flow rate changed from 40 gpm to 45 gpm

1. Go to **Products** → Find the product
2. Scroll to **Flow Rate Min**
3. Change value to 45
4. **Click "Publish"**
5. Change appears live within 2 seconds!

### Replace a Product Image

**Scenario**: New product photo available

1. Open the product
2. Click current **Product Image**
3. Click "Remove" (trash icon)
4. Click "Select image"
5. Upload new image
6. **Click "Publish"**

### Add a New PDF to Multiple Products

**Scenario**: New brochure for all CLARIFY products

1. **Upload PDF** to PDF Content Library
2. **For each CLARIFY product**:
   - Open product
   - Add the new PDF to **PDF Content**
   - **Publish**

### Reorder Products in a Grid

**Scenario**: Move CLARIFY 740 to appear first

1. Open CLARIFY 740
2. Change **Display Order** to 1
3. **Publish**
4. Open the product that was #1
5. Change its order to 2
6. **Publish**

## Troubleshooting

### "Failed to publish"

**Cause**: Required fields are empty

**Solution**:
- Check for red asterisks (*) next to field names
- Fill in all required fields
- Try publishing again

### Image Won't Upload

**Cause**: File too large or wrong format

**Solution**:
- Check file size (must be under 10MB)
- Ensure it's JPG or PNG format
- Compress the image if needed
- Try again

### Changes Not Appearing Live

**Cause**: Page hasn't revalidated yet

**Solution**:
- Wait 5-10 seconds
- Refresh the website page
- Check if you clicked "Publish" (not just "Save draft")
- Clear your browser cache

### Can't Find a Product

**Solution**:
- Use the search bar at the top
- Try searching by SKU or partial name
- Check the correct Product Line category
- Verify it hasn't been deleted

## Support

### Need Help?

**Contact your development team** for:
- Technical issues with the CMS
- Permission problems
- Custom features or changes
- Urgent bugs

### Sanity Support

For Sanity-specific issues:
- [Sanity Documentation](https://sanity.io/docs)
- [Community Slack](https://slack.sanity.io)

---

**Remember**: All changes are live immediately after publishing. Always double-check before clicking "Publish"!
