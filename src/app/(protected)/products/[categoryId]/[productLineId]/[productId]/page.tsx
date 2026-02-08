export default async function ProductDetailPage({
  params,
}: {
  params: { categoryId: string; productLineId: string; productId: string };
}) {
  const { categoryId, productLineId, productId } = params;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Product Detail Page</h1>
        <div className="space-y-2">
          <p><strong>Category:</strong> {categoryId}</p>
          <p><strong>Product Line:</strong> {productLineId}</p>
          <p><strong>Product:</strong> {productId}</p>
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-600">Minimal test version - checking if page renders</p>
        </div>
      </div>
    </div>
  );
}
