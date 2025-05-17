import Image from 'next/image';

function Header({ show }: { show: boolean }) {
  return (
    <header
      className={`z-50 w-full top-0 transition-transform duration-300 ${
        show ? 'fixed backdrop-blur-md bg-white/80 shadow-md' : 'absolute'
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center gap-3 px-6 py-3">
        {/* Logo */}
        <Image src="/images/icon.png" alt="EasyMarket logo" width={40} height={40} />
        <span className="font-extrabold text-xl text-blue-900">EasyMarket</span>
      </div>
    </header>
  );
}

export default Header;