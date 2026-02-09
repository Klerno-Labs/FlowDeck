import { getAllKnowledgeSlides } from '@/lib/db/presentation-content';
import { KnowledgeBaseCarousel } from '@/components/knowledge-base/KnowledgeBaseCarousel';

export default async function KnowledgeBasePage() {
  // Fetch slides from database
  const slides = await getAllKnowledgeSlides();

  return <KnowledgeBaseCarousel slides={slides} />;
}
