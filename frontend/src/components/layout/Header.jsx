// frontend/src/components/layout/Header.jsx

function Header() {
  return (
    <header className="bg-red-300">
      <div className="container mx-auto max-w-4xl p-4 text-left">
        <h1 className=" font-story text-slate-900 ">BookVibe</h1>
        <p className="mt-1 text-md text-slate-600">
          Mood Based Book Discovery App
        </p>
      </div>
    </header>
  );
}

export default Header;
