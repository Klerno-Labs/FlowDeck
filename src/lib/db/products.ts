/**
 * Database access layer for products system
 * Provides CRUD operations for categories, product lines, products, and specifications
 */

import { query, queryOne } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface Category {
  id: string;
  code: string;
  title: string;
  slug: string;
  background_color: string;
  subtitle?: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface ProductLine {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  logo_path?: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface Product {
  id: string;
  product_line_id: string;
  name: string;
  slug: string;
  image_path?: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
  display_order: number;
  created_at: Date;
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getAllCategories(): Promise<Category[]> {
  return query<Category>('SELECT * FROM categories ORDER BY display_order ASC');
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return queryOne<Category>('SELECT * FROM categories WHERE id = $1', [id]);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return queryOne<Category>('SELECT * FROM categories WHERE slug = $1', [slug]);
}

export async function createCategory(
  data: Omit<Category, 'id' | 'created_at' | 'updated_at'>,
  userId?: string
): Promise<Category> {
  const result = await queryOne<Category>(
    `INSERT INTO categories (code, title, slug, background_color, subtitle, display_order, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [data.code, data.title, data.slug, data.background_color, data.subtitle, data.display_order, userId]
  );

  if (!result) throw new Error('Failed to create category');

  await logChange('categories', result.id, 'create', userId);
  return result;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>,
  userId?: string
): Promise<Category> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.code !== undefined) {
    updates.push(`code = $${paramIndex++}`);
    values.push(data.code);
  }
  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  if (data.slug !== undefined) {
    updates.push(`slug = $${paramIndex++}`);
    values.push(data.slug);
  }
  if (data.background_color !== undefined) {
    updates.push(`background_color = $${paramIndex++}`);
    values.push(data.background_color);
  }
  if (data.subtitle !== undefined) {
    updates.push(`subtitle = $${paramIndex++}`);
    values.push(data.subtitle);
  }
  if (data.display_order !== undefined) {
    updates.push(`display_order = $${paramIndex++}`);
    values.push(data.display_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  updates.push(`updated_by = $${paramIndex++}`);
  values.push(userId);

  values.push(id);

  const result = await queryOne<Category>(
    `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (!result) throw new Error('Category not found');

  await logChange('categories', id, 'update', userId);
  return result;
}

export async function deleteCategory(id: string, userId?: string): Promise<void> {
  await query('DELETE FROM categories WHERE id = $1', [id]);
  await logChange('categories', id, 'delete', userId);
}

// ============================================================================
// PRODUCT LINES
// ============================================================================

export async function getAllProductLines(): Promise<ProductLine[]> {
  return query<ProductLine>('SELECT * FROM product_lines ORDER BY display_order ASC');
}

export async function getProductLinesByCategory(categoryId: string): Promise<ProductLine[]> {
  return query<ProductLine>(
    'SELECT * FROM product_lines WHERE category_id = $1 ORDER BY display_order ASC',
    [categoryId]
  );
}

export async function getProductLineByCategorySlug(categorySlug: string): Promise<ProductLine[]> {
  return query<ProductLine>(
    `SELECT pl.* FROM product_lines pl
     JOIN categories c ON pl.category_id = c.id
     WHERE c.slug = $1
     ORDER BY pl.display_order ASC`,
    [categorySlug]
  );
}

export async function getProductLineById(id: string): Promise<ProductLine | null> {
  return queryOne<ProductLine>('SELECT * FROM product_lines WHERE id = $1', [id]);
}

export async function getProductLineBySlug(slug: string): Promise<ProductLine | null> {
  return queryOne<ProductLine>('SELECT * FROM product_lines WHERE slug = $1', [slug]);
}

export async function createProductLine(
  data: Omit<ProductLine, 'id' | 'created_at' | 'updated_at'>,
  userId?: string
): Promise<ProductLine> {
  const result = await queryOne<ProductLine>(
    `INSERT INTO product_lines (category_id, title, slug, logo_path, display_order, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.category_id, data.title, data.slug, data.logo_path, data.display_order, userId]
  );

  if (!result) throw new Error('Failed to create product line');

  await logChange('product_lines', result.id, 'create', userId);
  return result;
}

export async function updateProductLine(
  id: string,
  data: Partial<Omit<ProductLine, 'id' | 'created_at' | 'updated_at'>>,
  userId?: string
): Promise<ProductLine> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.category_id !== undefined) {
    updates.push(`category_id = $${paramIndex++}`);
    values.push(data.category_id);
  }
  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  if (data.slug !== undefined) {
    updates.push(`slug = $${paramIndex++}`);
    values.push(data.slug);
  }
  if (data.logo_path !== undefined) {
    updates.push(`logo_path = $${paramIndex++}`);
    values.push(data.logo_path);
  }
  if (data.display_order !== undefined) {
    updates.push(`display_order = $${paramIndex++}`);
    values.push(data.display_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  updates.push(`updated_by = $${paramIndex++}`);
  values.push(userId);

  values.push(id);

  const result = await queryOne<ProductLine>(
    `UPDATE product_lines SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (!result) throw new Error('Product line not found');

  await logChange('product_lines', id, 'update', userId);
  return result;
}

export async function deleteProductLine(id: string, userId?: string): Promise<void> {
  await query('DELETE FROM product_lines WHERE id = $1', [id]);
  await logChange('product_lines', id, 'delete', userId);
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getAllProducts(): Promise<Product[]> {
  return query<Product>('SELECT * FROM products ORDER BY display_order ASC');
}

export async function getProductsByLine(productLineId: string): Promise<Product[]> {
  return query<Product>(
    'SELECT * FROM products WHERE product_line_id = $1 ORDER BY display_order ASC',
    [productLineId]
  );
}

export async function getProductsByLineSlug(lineSlug: string): Promise<Product[]> {
  return query<Product>(
    `SELECT p.* FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE pl.slug = $1
     ORDER BY p.display_order ASC`,
    [lineSlug]
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  return queryOne<Product>('SELECT * FROM products WHERE id = $1', [id]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return queryOne<Product>('SELECT * FROM products WHERE slug = $1', [slug]);
}

export async function getProductWithSpecs(productId: string): Promise<(Product & { specs: ProductSpecification[] }) | null> {
  const product = await getProductById(productId);
  if (!product) return null;

  const specs = await query<ProductSpecification>(
    'SELECT * FROM product_specifications WHERE product_id = $1 ORDER BY display_order ASC',
    [productId]
  );

  return { ...product, specs };
}

export async function getProductWithSpecsBySlug(slug: string): Promise<(Product & { specs: ProductSpecification[] }) | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const specs = await query<ProductSpecification>(
    'SELECT * FROM product_specifications WHERE product_id = $1 ORDER BY display_order ASC',
    [product.id]
  );

  return { ...product, specs };
}

export async function createProduct(
  data: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  userId?: string
): Promise<Product> {
  const result = await queryOne<Product>(
    `INSERT INTO products (product_line_id, name, slug, image_path, display_order, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.product_line_id, data.name, data.slug, data.image_path, data.display_order, userId]
  );

  if (!result) throw new Error('Failed to create product');

  await logChange('products', result.id, 'create', userId);
  return result;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>,
  userId?: string
): Promise<Product> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.product_line_id !== undefined) {
    updates.push(`product_line_id = $${paramIndex++}`);
    values.push(data.product_line_id);
  }
  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.slug !== undefined) {
    updates.push(`slug = $${paramIndex++}`);
    values.push(data.slug);
  }
  if (data.image_path !== undefined) {
    updates.push(`image_path = $${paramIndex++}`);
    values.push(data.image_path);
  }
  if (data.display_order !== undefined) {
    updates.push(`display_order = $${paramIndex++}`);
    values.push(data.display_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  updates.push(`updated_by = $${paramIndex++}`);
  values.push(userId);

  values.push(id);

  const result = await queryOne<Product>(
    `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (!result) throw new Error('Product not found');

  await logChange('products', id, 'update', userId);
  return result;
}

export async function deleteProduct(id: string, userId?: string): Promise<void> {
  await query('DELETE FROM products WHERE id = $1', [id]);
  await logChange('products', id, 'delete', userId);
}

// ============================================================================
// PRODUCT SPECIFICATIONS
// ============================================================================

export async function getSpecificationsByProduct(productId: string): Promise<ProductSpecification[]> {
  return query<ProductSpecification>(
    'SELECT * FROM product_specifications WHERE product_id = $1 ORDER BY display_order ASC',
    [productId]
  );
}

export async function createSpecification(
  data: Omit<ProductSpecification, 'id' | 'created_at'>,
  userId?: string
): Promise<ProductSpecification> {
  const result = await queryOne<ProductSpecification>(
    `INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.product_id, data.spec_key, data.spec_value, data.display_order]
  );

  if (!result) throw new Error('Failed to create specification');

  await logChange('product_specifications', result.id, 'create', userId);
  return result;
}

export async function updateSpecification(
  id: string,
  data: Partial<Omit<ProductSpecification, 'id' | 'created_at'>>,
  userId?: string
): Promise<ProductSpecification> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.spec_key !== undefined) {
    updates.push(`spec_key = $${paramIndex++}`);
    values.push(data.spec_key);
  }
  if (data.spec_value !== undefined) {
    updates.push(`spec_value = $${paramIndex++}`);
    values.push(data.spec_value);
  }
  if (data.display_order !== undefined) {
    updates.push(`display_order = $${paramIndex++}`);
    values.push(data.display_order);
  }

  values.push(id);

  const result = await queryOne<ProductSpecification>(
    `UPDATE product_specifications SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  if (!result) throw new Error('Specification not found');

  await logChange('product_specifications', id, 'update', userId);
  return result;
}

export async function deleteSpecification(id: string, userId?: string): Promise<void> {
  await query('DELETE FROM product_specifications WHERE id = $1', [id]);
  await logChange('product_specifications', id, 'delete', userId);
}

export async function deleteAllSpecificationsByProduct(productId: string, userId?: string): Promise<void> {
  await query('DELETE FROM product_specifications WHERE product_id = $1', [productId]);
  await logChange('product_specifications', productId, 'delete_all', userId);
}

// ============================================================================
// CHANGE TRACKING (for real-time updates)
// ============================================================================

async function logChange(
  tableName: string,
  recordId: string,
  action: string,
  userId?: string
): Promise<void> {
  await query(
    `INSERT INTO content_changes (table_name, record_id, action, changed_by)
     VALUES ($1, $2, $3, $4)`,
    [tableName, recordId, action, userId]
  );
}

export async function getLastChangeTimestamp(): Promise<Date | null> {
  const result = await queryOne<{ last_changed: Date }>(
    'SELECT MAX(changed_at) as last_changed FROM content_changes'
  );

  return result?.last_changed || null;
}

export async function getRecentChanges(limit: number = 100): Promise<any[]> {
  return query(
    'SELECT * FROM content_changes ORDER BY changed_at DESC LIMIT $1',
    [limit]
  );
}
