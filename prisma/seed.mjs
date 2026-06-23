// Idempotent seed: admin staff account + sample news posts + sample job openings.
// Run with: node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

// MUST match lib/auth.ts hashPassword (scrypt, 16-byte hex salt, keylen 64).
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return { hash: derived.toString("hex"), salt };
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@peppl.in").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Peppl@2026";

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80) || "post";
}

async function main() {
  // --- Admin employee ---
  const existingAdmin = await prisma.employee.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!existingAdmin) {
    const { hash, salt } = await hashPassword(ADMIN_PASSWORD);
    await prisma.employee.create({
      data: {
        name: "PEPPL Administrator",
        email: ADMIN_EMAIL,
        role: "ADMIN",
        status: "active",
        passwordHash: hash,
        passwordSalt: salt,
        mustChangePassword: true,
        canManageContent: true,
      },
    });
    console.log(`✅ Created admin employee: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}  (change this password!)`);
  } else {
    console.log(`ℹ️  Admin employee already exists (${ADMIN_EMAIL}) — left unchanged.`);
  }

  // --- Sample news ---
  const newsCount = await prisma.newsPost.count();
  if (newsCount === 0) {
    const posts = [
      {
        title: "PEPPL Secures Major Nuclear Fabrication Contract at Tarapur",
        category: "Project Win",
        excerpt: "A new DAE-aligned contract for stainless steel process piping and structural fabrication.",
        body: "Plant Engineering People Pvt. Ltd. has been awarded a significant contract for the fabrication and erection of stainless steel process piping at the Tarapur complex.\n\nThe scope includes precision welding to ASME standards, NDT inspection, and on-site erection. Work begins next quarter and reinforces PEPPL's position as a trusted partner for India's nuclear sector.",
      },
      {
        title: "We're Hiring: Welders, QA Engineers & Project Managers",
        category: "Hiring",
        excerpt: "PEPPL is expanding its fabrication team across multiple roles. Apply through our Careers portal.",
        body: "As our project pipeline grows, we are looking for skilled professionals to join our team in Tarapur MIDC.\n\nOpen roles span certified welding, quality assurance, piping design, and project management. Visit the Careers section to view all current openings and apply online.",
      },
      {
        title: "PEPPL Achieves 5,000+ MT Annual Fabrication Capacity",
        category: "Announcement",
        excerpt: "A milestone in our fabrication facility's capacity and capability.",
        body: "We are proud to announce that our Tarapur facility has crossed 5,000 MT of annual structural and process piping fabrication capacity.\n\nThis expansion, backed by upgraded machinery and a growing skilled workforce, enables us to take on larger and more complex projects across the nuclear, chemical, and energy sectors.",
      },
    ];
    for (const p of posts) {
      await prisma.newsPost.create({
        data: {
          ...p,
          slug: slugify(p.title),
          published: true,
          publishedAt: new Date(),
          authorName: "PEPPL Communications",
        },
      });
    }
    console.log(`✅ Created ${posts.length} sample news posts.`);
  } else {
    console.log(`ℹ️  News posts already exist (${newsCount}) — skipped sample posts.`);
  }

  // --- Sample jobs ---
  const jobCount = await prisma.jobOpening.count();
  if (jobCount === 0) {
    const jobs = [
      {
        title: "Certified Welder (TIG/MIG)",
        department: "Fabrication",
        location: "Tarapur, Maharashtra",
        employmentType: "Full-time",
        experience: "3–6 years",
        description: "Perform precision TIG/MIG welding on stainless and carbon steel piping and structures to ASME standards.",
        responsibilities: "Execute welds per WPS and drawings\nSupport NDT and QA inspections\nMaintain weld logs and traceability",
        requirements: "ITI/Trade certification in welding\nValid welder qualification (ASME IX preferred)\nExperience with SS and CS materials",
      },
      {
        title: "Quality Assurance Engineer",
        department: "Quality",
        location: "Tarapur, Maharashtra",
        employmentType: "Full-time",
        experience: "4–8 years",
        description: "Own QA/QC for fabrication projects, ensuring compliance with ASME, IS:2062, and DAE specifications.",
        responsibilities: "Prepare and review QA documentation\nCoordinate NDT (RT, UT, PT, MT)\nLiaise with client and third-party inspectors",
        requirements: "B.E. Mechanical or equivalent\nCSWIP/ASNT certification preferred\nStrong knowledge of welding and inspection codes",
      },
      {
        title: "Piping Design Engineer",
        department: "Engineering",
        location: "Tarapur, Maharashtra",
        employmentType: "Full-time",
        experience: "3–5 years",
        description: "Develop piping layouts, isometrics, and P&I diagrams for chemical and nuclear process plants.",
        responsibilities: "Produce GA drawings and isometrics\nSupport material take-offs\nCoordinate with fabrication and site teams",
        requirements: "B.E. Mechanical\nProficiency in AutoCAD / CADWorx / equivalent\nUnderstanding of piping codes and standards",
      },
      {
        title: "Project Manager — Plant Erection",
        department: "Projects",
        location: "Pan-India (site-based)",
        employmentType: "Full-time",
        experience: "8–12 years",
        description: "Lead end-to-end execution of plant erection and commissioning projects across critical sectors.",
        responsibilities: "Own project schedule, budget, and safety\nManage site teams and subcontractors\nInterface with clients and ensure timely delivery",
        requirements: "B.E. Mechanical/Civil\nProven EPC project delivery track record\nStrong leadership and stakeholder management",
      },
    ];
    for (const j of jobs) {
      await prisma.jobOpening.create({ data: j });
    }
    console.log(`✅ Created ${jobs.length} sample job openings.`);
  } else {
    console.log(`ℹ️  Job openings already exist (${jobCount}) — skipped sample jobs.`);
  }
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
