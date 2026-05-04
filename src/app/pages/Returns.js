export function Returns() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Return & Refund Policy</h1>
      <div className="space-y-8">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <p className="text-blue-800 font-medium">We offer a 30-day money-back guarantee on all our products.</p>
        </div>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Return Eligibility</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Items must be in original packaging and condition.</li>
            <li>Product must include all original parts and manuals.</li>
            <li>Custom-built equipment may be subject to a 15% restocking fee.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">How to Start a Return</h2>
          <p className="text-gray-600">
            To begin a return, please contact our support team via the Contact page with your order number. We will provide you with a Return Merchandise Authorization (RMA) number and shipping instructions.
          </p>
        </section>
      </div>
    </div>
  );
}