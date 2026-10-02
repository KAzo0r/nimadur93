export default function Cosmos() {
  return (
    <div className="w-full h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800 animate-fade-in -mt-4 bg-black">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
        <h1 className="text-white font-bold tracking-widest uppercase">NASA Eyes on the Solar System</h1>
        <p className="text-gray-400 text-xs">Интерактивная 3D-модель (Официальный ресурс NASA)</p>
      </div>
      
      <iframe
        src="https://eyes.nasa.gov/apps/solar-system/#/home?rel=0"
        title="NASA Eyes on the Solar System"
        className="w-full h-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
