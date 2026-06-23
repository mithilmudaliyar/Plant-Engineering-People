import { Container } from "@/components/ui/Container";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto surface p-8 md:p-12">
          <h1 className="text-3xl font-black text-[#1a3a52] mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-400 mb-8">Plant Engineering People Pvt. Ltd. (PEPPL)</p>

          <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
            <p>By creating an account or applying through the PEPPL Careers Portal, you agree to the terms below. Please read them carefully.</p>

            <Block n="1" title="Use of the Portal">
              You agree to provide accurate, current information when registering and applying. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
            </Block>
            <Block n="2" title="Applications">
              Submitting an application does not guarantee an interview or employment. Information you provide may be used solely to evaluate your candidacy and contact you regarding opportunities at PEPPL.
            </Block>
            <Block n="3" title="Acceptable Use">
              You may not misuse the portal, attempt unauthorised access, submit fraudulent information, or upload malicious content. We reserve the right to suspend accounts that violate these terms.
            </Block>
            <Block n="4" title="Data">
              Your personal data is handled in accordance with our Privacy Policy. We retain application data only as long as necessary for recruitment purposes.
            </Block>
            <Block n="5" title="Changes">
              We may update these terms from time to time. Continued use of the portal after changes constitutes acceptance of the revised terms.
            </Block>

            <p className="text-slate-400 text-xs pt-4">This is a general template. For binding legal terms, please consult your legal advisor before launch.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-bold text-[#1a3a52] mb-1.5">{n}. {title}</h2>
      <p>{children}</p>
    </div>
  );
}
