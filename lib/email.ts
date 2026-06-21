import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "PEPL Notifications <onboarding@resend.dev>";

function buildEmail(heading: string, bodyHtml: string): string {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="background:#1a3a52;padding:24px 32px;border-bottom:3px solid #d41f3d;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.05em;">PLANT ENGINEERING PEOPLE PVT. LTD.</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Nuclear &amp; Chemical Engineering Experts</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
        <h2 style="margin:0 0 20px;font-size:20px;color:#1a3a52;">${heading}</h2>
        ${bodyHtml}
      </div>
      <div style="background:#f9fafb;padding:16px 32px;border:1px solid #e5e7eb;border-top:none;text-align:center;font-size:11px;color:#9ca3af;">
        Plot No: G-52, Tarapur Industrial Area, Maharashtra 401506 &bull; pep.tarapur@gmail.com<br/>
        This is an automated message. Please do not reply directly to this email.
      </div>
    </div>`;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const body = `
    <p style="font-size:15px;color:#374151;margin:0 0 24px;">
      You requested a sign-in code for your <strong>PEPL Supplier Portal</strong>. Use the code below to complete sign-in.
    </p>
    <div style="background:#f0f4ff;border:2px dashed #1a3a52;border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.2em;color:#6b7280;text-transform:uppercase;">Your Sign-In Code</p>
      <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:0.3em;color:#1a3a52;font-family:monospace;">${code}</p>
      <p style="margin:10px 0 0;font-size:12px;color:#9ca3af;">Expires in <strong>10 minutes</strong></p>
    </div>
    <p style="font-size:13px;color:#6b7280;margin:0;">If you didn't request this, please ignore this email.</p>`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your PEPL Sign-In Code",
    html: buildEmail("Sign-In Verification Code", body),
  });
}

export async function sendOrderCreatedEmail(
  email: string,
  supplierName: string | null,
  orderId: number,
  whatNeeded: string,
  isTicket: boolean
): Promise<void> {
  const typeLabel = isTicket ? "Consultation Ticket" : "Fabrication Contract";
  const body = `
    <p style="font-size:15px;color:#374151;margin:0 0 16px;">Dear <strong>${supplierName || "Supplier"}</strong>,</p>
    <p style="font-size:15px;color:#374151;margin:0 0 24px;">Your <strong>${typeLabel}</strong> has been submitted to PEPL operations.</p>
    <div style="background:#f9fafb;border-left:4px solid #d41f3d;border-radius:4px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.15em;color:#6b7280;text-transform:uppercase;">Order Reference</p>
      <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#1a3a52;font-family:monospace;">#PEPL-O-${orderId}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#374151;"><strong>Scope:</strong> ${whatNeeded}</p>
    </div>
    <p style="font-size:14px;color:#374151;margin:0 0 16px;">Track your order anytime in the <strong>Supplier Portal</strong>. You'll receive email updates when the status changes.</p>`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed: #PEPL-O-${orderId}`,
    html: buildEmail("Order Submitted Successfully", body),
  });
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review", IN_PROGRESS: "In Production", APPROVED: "Approved & Scheduled",
  COMPLETED: "Fabrication Completed", REJECTED: "Declined", CANCELLED: "Cancelled",
  FORWARDED_TO_SENIOR: "Forwarded to Senior Engineer", CANNOT_BE_DONE: "Cannot Be Completed",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#d97706", IN_PROGRESS: "#2563eb", APPROVED: "#059669", COMPLETED: "#4f46e5",
  REJECTED: "#dc2626", CANCELLED: "#6b7280", FORWARDED_TO_SENIOR: "#7c3aed", CANNOT_BE_DONE: "#be123c",
};

export async function sendOrderUpdateEmail(
  email: string,
  supplierName: string | null,
  orderId: number,
  newStatus: string,
  employeeNotes?: string | null
): Promise<void> {
  const statusLabel = STATUS_LABELS[newStatus] || newStatus;
  const statusColor = STATUS_COLORS[newStatus] || "#1a3a52";
  const notesSection = employeeNotes
    ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.15em;color:#1e40af;text-transform:uppercase;">📢 Update from PEPL Operations</p>
        <p style="margin:0;font-size:14px;color:#1e3a8a;font-style:italic;">"${employeeNotes}"</p>
       </div>` : "";

  const body = `
    <p style="font-size:15px;color:#374151;margin:0 0 16px;">Dear <strong>${supplierName || "Supplier"}</strong>,</p>
    <p style="font-size:15px;color:#374151;margin:0 0 24px;">There has been an update on your PEPL order.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:0 0 24px;border:1px solid #e5e7eb;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.15em;color:#6b7280;text-transform:uppercase;">Order Reference</p>
      <p style="margin:0 0 12px;font-size:18px;font-weight:800;color:#1a3a52;font-family:monospace;">#PEPL-O-${orderId}</p>
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.15em;color:#6b7280;text-transform:uppercase;">New Status</p>
      <span style="display:inline-block;background:${statusColor}18;color:${statusColor};border:1px solid ${statusColor}40;border-radius:999px;padding:6px 16px;font-size:14px;font-weight:700;">${statusLabel}</span>
      ${notesSection}
    </div>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://plantengineeringpeople.com"}/supplier" style="display:inline-block;background:#d41f3d;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:6px;text-decoration:none;">View in Supplier Portal →</a>`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order Update: #PEPL-O-${orderId} — ${statusLabel}`,
    html: buildEmail("Order Status Updated", body),
  });
}
