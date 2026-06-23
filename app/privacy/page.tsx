import { Container } from "@/components/ui/Container";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto surface p-8 md:p-12">
          <h1 className="text-3xl font-black text-[#1a3a52] mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-8">Plant Engineering People Pvt. Ltd. (PEPPL)</p>

          <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
            <p>This policy explains what information we collect through the PEPPL Careers Portal and how we use it.</p>

            <Block n="1" title="Information We Collect">
              Account details (name, email, phone), authentication data (passwords are stored only as salted, hashed values — never in plain text), and the content of your job applications.
            </Block>
            <Block n="2" title="How We Use It">
              To operate your account, verify your email, process job applications, and communicate with you about opportunities at PEPPL.
            </Block>
            <Block n="3" title="Security">
              We use industry-standard measures including hashed passwords, server-side sessions over secure cookies, and human-verification (captcha) on sensitive forms. No method of transmission is 100% secure, but we work to protect your data.
            </Block>
            <Block n="4" title="Sharing">
              We do not sell your data. Application information is accessible only to authorised PEPPL staff involved in recruitment.
            </Block>
            <Block n="5" title="Your Rights">
              You may request access to, correction of, or deletion of your personal data by contacting us at pep.tarapur@gmail.com.
            </Block>

            <p className="text-slate-400 text-xs pt-4">This is a general template. For a compliant privacy notice, please consult your legal advisor before launch.</p>
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
