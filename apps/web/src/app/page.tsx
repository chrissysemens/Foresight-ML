export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-12">
      <h1 className="text-5xl font-bold">Foresight ML</h1>
      <p className="mt-3 text-lg text-gray-500">
        Machine learning experiments without writing code.
      </p>

      <a
        href="/dashboard"
        className="mt-8 inline-block rounded-lg bg-white px-5 py-3 font-medium text-black"
      >
        Open Dashboard →
      </a>
    </main>
  );
}