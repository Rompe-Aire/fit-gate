import Link from 'next/link';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-svh pt-14 bg-gray-900 relative overflow-hidden">
      <h1 className="text-4xl font-bold text-white mb-4 z-10">Bienvenido a Fit Gate</h1>
      <Link href="/checkin" className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition">
        Hacer Check-in
      </Link>
      <Link href="/admin" className="mt-4 bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition">
        Administración
      </Link>
    </main>
  );
};

export default Home;
