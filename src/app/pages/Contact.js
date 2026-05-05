export function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Get in Touch</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Name</label>
              <input type="text" className="w-full border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded p-2 focus:ring-2 focus:ring-zinc-500 outline-none" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Email</label>
              <input type="email" className="w-full border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded p-2 focus:ring-2 focus:ring-zinc-500 outline-none" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Message</label>
              <textarea className="w-full border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded p-2 h-32 focus:ring-2 focus:ring-zinc-500 outline-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2 rounded hover:bg-black dark:hover:bg-zinc-200 transition-colors font-medium">
              Send Message
            </button>
          </form>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Customer Support</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
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