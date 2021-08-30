export default function App() {
  return (
    <figure className="bg-gray-100 rounded-xl p-8">
      <img
        className="w-32 h-32 rounded-full mx-auto"
        src="/react-finland.jpg"
        alt="React Finland Logo"
      />
      <div className="pt-6 text-center space-y-4">
        <blockquote>
          <p className="text-lg font-semibold">
            “React makes it painless to create interactive UIs.”
          </p>
        </blockquote>
        <figcaption className="font-medium">
          <div className="text-cyan-600">React</div>
          <div className="text-gray-500">
            A JavaScript library for building user interfaces
          </div>
        </figcaption>
      </div>
    </figure>
  )
}
