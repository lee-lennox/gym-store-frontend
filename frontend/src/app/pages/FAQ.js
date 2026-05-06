export function FAQ() {
  const faqs = [
    {
      q: "Do you offer professional installation?",
      a: "Yes! For large items like cable machines and functional trainers, we offer white-glove assembly services in most major cities. You can add this during the checkout process."
    },
    {
      q: "Can I cancel my order?",
      a: "Orders can be canceled within 12 hours of placement. After that, the item enters the fulfillment cycle and may already be prepared for shipping."
    },
    {
      q: "What weight increments do your adjustable dumbbells have?",
      a: "Our standard adjustable dumbbells range from 5 lbs to 52.5 lbs in 2.5 lb increments, perfect for progressive overload."
    },
    {
      q: "Are your power racks compatible with standard attachments?",
      a: "Our racks use standard 2x2 or 3x3 uprights with 1-inch holes, making them compatible with most market-standard J-cups and spotter arms."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">Frequently Asked Questions</h1>
      <div className="grid gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-gray-800">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}