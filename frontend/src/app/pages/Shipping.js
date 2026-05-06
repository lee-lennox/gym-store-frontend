export function Shipping() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Shipping Information</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800">Delivery Times</h2>
          <p className="text-gray-600 leading-relaxed">
            Standard processing time for gym equipment is 1-3 business days. Once shipped, delivery usually takes 3-7 business days depending on your proximity to our distribution centers.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800">Shipping Costs</h2>
          <p className="text-gray-600 leading-relaxed">
            We offer flat-rate shipping on accessories and free shipping on all orders over $1,000. For large items like power racks or heavy plates, shipping is calculated based on weight and freight requirements.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800">Tracking</h2>
          <p className="text-gray-600 leading-relaxed">
            Once your order has been dispatched, you will receive an email with your tracking number and a link to track your package in real-time.
          </p>
        </section>
      </div>
    </div>
  );
}