export default function SubmissionSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 flex flex-col">
      {/* Header with Logo */}
      <div className="pt-8 pb-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <img
            src="/assets/toughday-logo.png"
            alt="Tough Day Logo"
            className="h-20 object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="max-w-2xl w-full text-center">
          {/* Thank You Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Your registration has been received successfully.
            <br />
            We'll be in touch soon!
          </p>

          {/* Divider */}
          <div className="my-8 border-t border-gray-300 max-w-md mx-auto"></div>

          {/* Visit Tough Day Button */}
          <a
            href="http://tough.day"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
          >
            Visit Tough Day
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Tough Day. All rights reserved.</p>
      </div>
    </div>
  );
}
