import TopBar from '@/components/TopBar';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer';
import StickyJoinButton from '@/components/StickyJoinButton';

export default function MarketingLayout({ children }) {
  return (
    <>
      <TopBar />
      <HeaderNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyJoinButton />
    </>
  );
}
