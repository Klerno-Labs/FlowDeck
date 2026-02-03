import { groq } from 'next-sanity';

// Get all categories with product lines
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    code,
    "icon": icon.asset->url,
    backgroundColor,
    description,
    order
  }
`;

// Get product lines by category
export const productLinesByCategoryQuery = groq`
  *[_type == "productLine" && category._ref == $categoryId] | order(order asc) {
    _id,
    title,
    slug,
    "logo": logo.asset->url,
    "logoColor": logoColor.asset->url,
    backgroundColor,
    description,
    order
  }
`;

// Get products by product line
export const productsByLineQuery = groq`
  *[_type == "product" && productLine._ref == $productLineId] | order(order asc) {
    _id,
    title,
    slug,
    sku,
    "image": image.asset->url,
    "imageColor": imageColor.asset->url,
    order
  }
`;

// Get product detail with all specifications
export const productDetailQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    sku,
    "image": image.asset->url,
    "imageColor": imageColor.asset->url,
    "imageBW": imageBW.asset->url,
    commonMarkets,
    applications,
    flowDirection,
    micronRatings,
    standardEfficiency,
    mediaOptions,
    hardwareOptions,
    diameter,
    standardLengths,
    flowRateMin,
    flowRateMax,
    dirtLoadingMin,
    dirtLoadingMax,
    surfaceArea,
    maxDifferentialPressure,
    vesselTechnology,
    pdfContent[]-> {
      _id,
      title,
      description,
      "fileUrl": file.asset->url,
      "fileRef": file.asset._ref,
      order,
      category
    },
    productLine-> {
      title,
      slug,
      category-> {
        title,
        code,
        slug
      }
    }
  }
`;

// Get all presentation slides
export const slidesQuery = groq`
  *[_type == "slide"] | order(order asc) {
    _id,
    title,
    slug,
    order,
    layout,
    "backgroundImage": backgroundImage.asset->url,
    backgroundColor,
    content,
    videoUrl
  }
`;

// Get single slide
export const slideBySlugQuery = groq`
  *[_type == "slide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    order,
    layout,
    "backgroundImage": backgroundImage.asset->url,
    backgroundColor,
    content,
    videoUrl
  }
`;

// Get knowledge base articles
export const articlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    "featuredImage": featuredImage.asset->url,
    publishedAt
  }
`;

// Get single article
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    "featuredImage": featuredImage.asset->url,
    content,
    relatedPdfs[]-> {
      _id,
      title,
      description,
      "fileUrl": file.asset->url,
      "fileRef": file.asset._ref,
      category
    },
    publishedAt
  }
`;
