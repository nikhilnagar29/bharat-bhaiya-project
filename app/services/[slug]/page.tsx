import { notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const service = await Service.findOne({ slug, isActive: true }).lean();
  if (!service) return { title: 'Service Not Found' };
  return {
    title: `${(service as { title: string }).title} — GrowNsure`,
    description: (service as { description: string }).description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const service = await Service.findOne({ slug, isActive: true }).lean() as {
    title: string;
    description: string;
    detailHtml?: string;
    detailCss?: string;
  } | null;

  if (!service) notFound();

  const hasContent = !!(service.detailHtml && service.detailHtml.trim());

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Back bar */}
        <div className={styles.backBar}>
          <div className="container">
            <Link href="/#services" className={styles.backBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Services
            </Link>
            <h1 className={styles.pageTitle}>{service.title}</h1>
          </div>
        </div>

        {/* Content area */}
        <div className={styles.contentArea}>
          <div className="container">
            {hasContent ? (
              <div className={styles.htmlWrapper}>
                {/* Inject admin CSS scoped inside the wrapper */}
                {service.detailCss && (
                  <style
                    dangerouslySetInnerHTML={{
                      __html: service.detailCss
                        .split('\n')
                        .map((line) => line.trim())
                        .join(' '),
                    }}
                  />
                )}
                {/* Render admin HTML */}
                <div
                  className={styles.htmlContent}
                  dangerouslySetInnerHTML={{ __html: service.detailHtml! }}
                />
              </div>
            ) : (
              /* No content fallback */
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className={styles.emptyTitle}>Details Coming Soon</h2>
                <p className={styles.emptyDesc}>
                  Detailed information about <strong>{service.title}</strong> is being prepared.
                  Please check back soon, or contact us directly.
                </p>
                <Link href="/#contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
