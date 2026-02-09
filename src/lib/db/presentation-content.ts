/**
 * Presentation Content Database Access Layer
 * Functions for managing presentation slides and knowledge base content
 */

import { query, queryOne } from './client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PresentationSlide {
  id: string;
  slide_key: string;
  title: string;
  heading: string;
  paragraph: string;
  image_path: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  items: SlideItem[];
}

export interface SlideItem {
  id: string;
  slide_id: string;
  content: string;
  bullet_color: string | null;
  display_order: number;
  created_at: string;
}

export interface KnowledgeSlide {
  id: string;
  slide_key: string;
  title: string;
  subtitle: string | null;
  layout: 'content-left' | 'content-right';
  image_path: string;
  quote: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  items: KnowledgeSlideItem[];
}

export interface KnowledgeSlideItem {
  id: string;
  slide_id: string;
  content: string;
  display_order: number;
  created_at: string;
}

// ============================================================================
// INTRO SLIDES FUNCTIONS
// ============================================================================

/**
 * Get a single slide by its key with all items
 */
export async function getSlideByKey(key: string): Promise<PresentationSlide | null> {
  try {
    const slide = await queryOne<PresentationSlide>(
      'SELECT * FROM presentation_slides WHERE slide_key = $1 AND is_active = true',
      [key]
    );

    if (!slide) {
      return null;
    }

    const items = await query<SlideItem>(
      'SELECT * FROM slide_items WHERE slide_id = $1 ORDER BY display_order ASC',
      [slide.id]
    );

    return { ...slide, items };
  } catch (error) {
    console.error(`Error fetching slide ${key}:`, error);
    return null;
  }
}

/**
 * Get all active intro slides with items
 */
export async function getAllIntroSlides(): Promise<PresentationSlide[]> {
  try {
    const slides = await query<PresentationSlide>(
      'SELECT * FROM presentation_slides WHERE is_active = true ORDER BY display_order ASC'
    );

    for (let slide of slides) {
      slide.items = await query<SlideItem>(
        'SELECT * FROM slide_items WHERE slide_id = $1 ORDER BY display_order ASC',
        [slide.id]
      );
    }

    return slides;
  } catch (error) {
    console.error('Error fetching intro slides:', error);
    return [];
  }
}

/**
 * Update slide content (heading, paragraph, image)
 */
export async function updateSlide(
  slideId: string,
  data: Partial<Pick<PresentationSlide, 'heading' | 'paragraph' | 'image_path'>>,
  userId: string
): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.heading !== undefined) {
    updates.push(`heading = $${paramIndex++}`);
    values.push(data.heading);
  }

  if (data.paragraph !== undefined) {
    updates.push(`paragraph = $${paramIndex++}`);
    values.push(data.paragraph);
  }

  if (data.image_path !== undefined) {
    updates.push(`image_path = $${paramIndex++}`);
    values.push(data.image_path);
  }

  if (updates.length === 0) {
    return; // Nothing to update
  }

  updates.push(`updated_at = NOW()`);
  updates.push(`updated_by = $${paramIndex++}`);
  values.push(userId);

  values.push(slideId);

  await query(
    `UPDATE presentation_slides SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  // Track change for real-time sync
  await query(
    'INSERT INTO content_changes (table_name, record_id, action, changed_by) VALUES ($1, $2, $3, $4)',
    ['presentation_slides', slideId, 'update', userId]
  );
}

/**
 * Update a slide item (bullet point)
 */
export async function updateSlideItem(
  itemId: string,
  content: string,
  bulletColor: string | null
): Promise<void> {
  await query(
    'UPDATE slide_items SET content = $1, bullet_color = $2 WHERE id = $3',
    [content, bulletColor, itemId]
  );
}

/**
 * Add a new slide item (bullet point)
 */
export async function addSlideItem(
  slideId: string,
  content: string,
  bulletColor: string | null,
  displayOrder: number
): Promise<SlideItem> {
  const result = await queryOne<SlideItem>(
    'INSERT INTO slide_items (slide_id, content, bullet_color, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
    [slideId, content, bulletColor, displayOrder]
  );

  if (!result) {
    throw new Error('Failed to create slide item');
  }

  return result;
}

/**
 * Delete a slide item
 */
export async function deleteSlideItem(itemId: string): Promise<void> {
  await query('DELETE FROM slide_items WHERE id = $1', [itemId]);
}

/**
 * Reorder slide items
 */
export async function reorderSlideItems(items: { id: string; display_order: number }[]): Promise<void> {
  for (const item of items) {
    await query(
      'UPDATE slide_items SET display_order = $1 WHERE id = $2',
      [item.display_order, item.id]
    );
  }
}

// ============================================================================
// KNOWLEDGE BASE FUNCTIONS
// ============================================================================

/**
 * Get a single knowledge slide by its key with all items
 */
export async function getKnowledgeSlideByKey(key: string): Promise<KnowledgeSlide | null> {
  try {
    const slide = await queryOne<KnowledgeSlide>(
      'SELECT * FROM knowledge_slides WHERE slide_key = $1 AND is_active = true',
      [key]
    );

    if (!slide) {
      return null;
    }

    const items = await query<KnowledgeSlideItem>(
      'SELECT * FROM knowledge_slide_items WHERE slide_id = $1 ORDER BY display_order ASC',
      [slide.id]
    );

    return { ...slide, items };
  } catch (error) {
    console.error(`Error fetching knowledge slide ${key}:`, error);
    return null;
  }
}

/**
 * Get all active knowledge slides with items
 */
export async function getAllKnowledgeSlides(): Promise<KnowledgeSlide[]> {
  try {
    const slides = await query<KnowledgeSlide>(
      'SELECT * FROM knowledge_slides WHERE is_active = true ORDER BY display_order ASC'
    );

    for (let slide of slides) {
      slide.items = await query<KnowledgeSlideItem>(
        'SELECT * FROM knowledge_slide_items WHERE slide_id = $1 ORDER BY display_order ASC',
        [slide.id]
      );
    }

    return slides;
  } catch (error) {
    console.error('Error fetching knowledge slides:', error);
    return [];
  }
}

/**
 * Update knowledge slide content
 */
export async function updateKnowledgeSlide(
  slideId: string,
  data: Partial<Pick<KnowledgeSlide, 'title' | 'subtitle' | 'layout' | 'image_path' | 'quote'>>,
  userId: string
): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }

  if (data.subtitle !== undefined) {
    updates.push(`subtitle = $${paramIndex++}`);
    values.push(data.subtitle);
  }

  if (data.layout !== undefined) {
    updates.push(`layout = $${paramIndex++}`);
    values.push(data.layout);
  }

  if (data.image_path !== undefined) {
    updates.push(`image_path = $${paramIndex++}`);
    values.push(data.image_path);
  }

  if (data.quote !== undefined) {
    updates.push(`quote = $${paramIndex++}`);
    values.push(data.quote);
  }

  if (updates.length === 0) {
    return; // Nothing to update
  }

  updates.push(`updated_at = NOW()`);
  updates.push(`updated_by = $${paramIndex++}`);
  values.push(userId);

  values.push(slideId);

  await query(
    `UPDATE knowledge_slides SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  // Track change for real-time sync
  await query(
    'INSERT INTO content_changes (table_name, record_id, action, changed_by) VALUES ($1, $2, $3, $4)',
    ['knowledge_slides', slideId, 'update', userId]
  );
}

/**
 * Update a knowledge slide item
 */
export async function updateKnowledgeSlideItem(
  itemId: string,
  content: string
): Promise<void> {
  await query(
    'UPDATE knowledge_slide_items SET content = $1 WHERE id = $2',
    [content, itemId]
  );
}

/**
 * Add a new knowledge slide item
 */
export async function addKnowledgeSlideItem(
  slideId: string,
  content: string,
  displayOrder: number
): Promise<KnowledgeSlideItem> {
  const result = await queryOne<KnowledgeSlideItem>(
    'INSERT INTO knowledge_slide_items (slide_id, content, display_order) VALUES ($1, $2, $3) RETURNING *',
    [slideId, content, displayOrder]
  );

  if (!result) {
    throw new Error('Failed to create knowledge slide item');
  }

  return result;
}

/**
 * Delete a knowledge slide item
 */
export async function deleteKnowledgeSlideItem(itemId: string): Promise<void> {
  await query('DELETE FROM knowledge_slide_items WHERE id = $1', [itemId]);
}

/**
 * Reorder knowledge slide items
 */
export async function reorderKnowledgeSlideItems(items: { id: string; display_order: number }[]): Promise<void> {
  for (const item of items) {
    await query(
      'UPDATE knowledge_slide_items SET display_order = $1 WHERE id = $2',
      [item.display_order, item.id]
    );
  }
}
