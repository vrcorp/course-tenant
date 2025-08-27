import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface TenantFooterProps {
  tenant: any;
}

export default function TenantFooter({ tenant }: TenantFooterProps) {
  const { tenantSlug } = useParams();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tenant Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {tenant.branding?.logo ? (
                <img 
                  src={tenant.branding.logo} 
                  alt={tenant.name} 
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="font-bold text-lg">{tenant.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {tenant.description || 'Platform pembelajaran online terpercaya untuk mengembangkan skill dan karir Anda.'}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>{tenant.domain?.type === 'custom' ? tenant.domain.value : `${tenant.slug}.videmyhub.io`}</p>
              {tenant.contact?.email && <p>Email: {tenant.contact.email}</p>}
              {tenant.contact?.phone && <p>Telepon: {tenant.contact.phone}</p>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={`/t/${tenantSlug}`} className="text-muted-foreground hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/courses`} className="text-muted-foreground hover:text-foreground">
                  Semua Kursus
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/about`} className="text-muted-foreground hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/contact`} className="text-muted-foreground hover:text-foreground">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Links */}
          <div>
            <h4 className="font-semibold mb-4">Untuk Siswa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={`/t/${tenantSlug}/login`} className="text-muted-foreground hover:text-foreground">
                  Masuk
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/register`} className="text-muted-foreground hover:text-foreground">
                  Daftar
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/my-courses`} className="text-muted-foreground hover:text-foreground">
                  Kursus Saya
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/certificates`} className="text-muted-foreground hover:text-foreground">
                  Sertifikat
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold mb-4">Bantuan & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={`/t/${tenantSlug}/help`} className="text-muted-foreground hover:text-foreground">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/faq`} className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/privacy`} className="text-muted-foreground hover:text-foreground">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to={`/t/${tenantSlug}/terms`} className="text-muted-foreground hover:text-foreground">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {tenant.name}. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {tenant.social?.facebook && (
              <a 
                href={tenant.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Facebook
              </a>
            )}
            {tenant.social?.twitter && (
              <a 
                href={tenant.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
            )}
            {tenant.social?.instagram && (
              <a 
                href={tenant.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Instagram
              </a>
            )}
            {tenant.social?.linkedin && (
              <a 
                href={tenant.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
