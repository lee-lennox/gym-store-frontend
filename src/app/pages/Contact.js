export function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input type="text" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input type="email" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
              <textarea className="w-full border rounded p-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium">
              Send Message
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>Address:</strong> 123 Fitness Ave, Iron City, IC 54321
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Hours:</strong> Mon-Fri: 9am - 6pm EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}