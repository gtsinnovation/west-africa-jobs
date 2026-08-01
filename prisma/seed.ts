import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DIRECT_SOURCE = {
  sourceId: "direct",
  sourceName: "West Africa Impact Jobs",
  sourceHomepageUrl: "",
};

async function main() {
  // --- Default admin account -------------------------------------------
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    await prisma.admin.create({
      data: {
        username: "admin",
        passwordHash: bcrypt.hashSync("ImpactJobs2026!", 10),
      },
    });
    console.log("Seeded default admin (username: admin)");
  }

  // --- Sample jobs --------------------------------------------------------
  const jobCount = await prisma.job.count();
  if (jobCount === 0) {
    await prisma.job.createMany({
      data: [
        {
          title: "Program Officer, Youth Digital Skills",
          organization: "BuildUp Liberia Foundation",
          city: "Monrovia",
          country: "Liberia",
          sector: "Tech-for-Good",
          jobType: "Full-time",
          applicationUrl: "https://example.org/careers/program-officer-liberia",
          description:
            "Lead the rollout of digital-literacy bootcamps for out-of-school youth across Montserrado County, coordinating with local tech hubs and donors.",
          postedDate: "2026-07-24",
          closingDate: "2026-08-30",
          ...DIRECT_SOURCE,
        },
        {
          title: "Community Health Field Coordinator",
          organization: "Lofa Health Access Network",
          city: "Voinjama",
          country: "Liberia",
          sector: "Healthcare",
          jobType: "Contract",
          applicationUrl: "https://example.org/careers/health-field-coordinator",
          description:
            "Coordinate mobile health clinics and maternal-health outreach in Lofa County in partnership with district health teams.",
          postedDate: "2026-07-20",
          closingDate: "2026-09-05",
          ...DIRECT_SOURCE,
        },
        {
          title: "Monitoring & Evaluation Consultant",
          organization: "West Africa Development Alliance",
          city: "Accra",
          country: "Ghana",
          sector: "Capacity Building",
          jobType: "Consultancy",
          applicationUrl: "https://example.org/careers/me-consultant-ghana",
          description:
            "Design the M&E framework for a 3-year governance strengthening program spanning six regions of Ghana.",
          postedDate: "2026-07-27",
          closingDate: "2026-08-22",
          ...DIRECT_SOURCE,
        },
        {
          title: "Girls' Education Project Manager",
          organization: "Bright Futures Ghana",
          city: "Tamale",
          country: "Ghana",
          sector: "Youth & Education",
          jobType: "Full-time",
          applicationUrl: "https://example.org/careers/girls-education-pm",
          description:
            "Manage a scholarship and mentorship program for adolescent girls in the Northern Region, including donor reporting and school partnerships.",
          postedDate: "2026-07-18",
          closingDate: "2026-08-31",
          ...DIRECT_SOURCE,
        },
        {
          title: "Remote Grants & Compliance Officer",
          organization: "Niger Delta Impact Collective",
          city: "Port Harcourt",
          country: "Nigeria",
          sector: "Governance & Policy",
          jobType: "Remote",
          applicationUrl: "https://example.org/careers/grants-compliance-officer",
          description:
            "Support sub-grantee due diligence, donor compliance reporting, and financial monitoring for community-led NGOs across the Niger Delta.",
          postedDate: "2026-07-29",
          closingDate: "2026-09-15",
          ...DIRECT_SOURCE,
        },
      ],
    });
    console.log("Seeded 5 sample jobs");
  }

  // --- Sample webhook logs -------------------------------------------------
  const logCount = await prisma.webhookLog.count();
  if (logCount === 0) {
    await prisma.webhookLog.createMany({
      data: [
        {
          source: "ReliefWeb API Connector",
          status: "pending",
          receivedAt: new Date("2026-07-30T09:14:00Z"),
          detail:
            "Live endpoint wired; awaiting an approved ReliefWeb appname to go active.",
        },
        {
          source: "External Partner Sync",
          status: "success",
          receivedAt: new Date("2026-07-29T18:02:00Z"),
          detail:
            "Refreshed curated sample listings for 6 partner boards without public APIs.",
        },
        {
          source: "Devex Listings Import",
          status: "failed",
          receivedAt: new Date("2026-07-28T07:45:00Z"),
          detail: "No public API/RSS exposed — requires a dedicated scraper connector.",
        },
      ],
    });
    console.log("Seeded 3 sample webhook logs");
  }

  // --- Sample insights ------------------------------------------------------
  const insightCount = await prisma.insight.count();
  if (insightCount === 0) {
    await prisma.insight.createMany({
      data: [
        {
          slug: "hiring-trends-west-africa-2026",
          title: "Hiring Trends Across West Africa's Social-Impact Sector in 2026",
          summary:
            "Tech-for-good and climate-resilience roles are growing fastest, while NGO administrative hiring has plateaued. Here's what employers are prioritizing this year.",
          content:
            "Across Liberia, Ghana, Nigeria, and Senegal, we're seeing sustained demand for roles that blend technical skill with grassroots program delivery — data-for-development officers, digital-literacy trainers, and MEL (Monitoring, Evaluation & Learning) specialists top the list.\n\nDonor priorities are shifting too: climate adaptation and resilience funding has grown significantly, which is translating into new consultancy and project-management openings across the Sahel.\n\nFor job seekers, the clearest signal is this — pairing a technical skill (data analysis, GIS, digital tools) with sector expertise (health, education, governance) makes candidates dramatically more competitive than generalist profiles.",
          category: "Market Trends",
          coverImageUrl: null,
          published: true,
          publishedDate: "2026-07-20",
          updatedAt: "2026-07-20",
        },
        {
          slug: "writing-a-standout-ngo-cover-letter",
          title: "How to Write a Cover Letter That Gets Shortlisted for NGO Roles",
          summary:
            "Recruiters at development organizations read hundreds of applications. Here's the structure that consistently gets candidates to interview.",
          content:
            "1. Open with impact, not biography. Lead with a specific result you drove, not a summary of your career.\n\n2. Mirror the job description's language. Most NGOs use applicant tracking systems — using their exact terminology for sectors and skills matters.\n\n3. Address the local context directly. If you have experience in the specific country or region, say so in the first paragraph.\n\n4. Keep it to one page. Recruiters at organizations like WACSI and UNICEF report that concise, well-structured letters get read in full far more often than dense ones.\n\n5. Close with availability and flexibility — many roles need candidates who can start quickly or travel within the region.",
          category: "Career Advice",
          coverImageUrl: null,
          published: true,
          publishedDate: "2026-07-15",
          updatedAt: "2026-07-15",
        },
        {
          slug: "spotlight-wash-sector-guinea-sierra-leone",
          title: "Sector Spotlight: WASH Roles Are Surging in Guinea and Sierra Leone",
          summary:
            "New multi-year water-infrastructure funding is creating a wave of technical and community-engagement roles across the region.",
          content:
            "Water, Sanitation, and Hygiene (WASH) programming has seen a marked increase in funded positions this year, particularly technical coordinator and community engagement roles supporting rural water-systems rehabilitation.\n\nOrganizations are increasingly looking for candidates who combine engineering or public-health backgrounds with strong community-liaison skills, since these programs depend heavily on local buy-in and behavior-change work alongside the infrastructure itself.\n\nIf you have a WASH background, now is an especially strong time to be active in the West Africa job market.",
          category: "Sector Spotlight",
          coverImageUrl: null,
          published: true,
          publishedDate: "2026-07-10",
          updatedAt: "2026-07-10",
        },
      ],
    });
    console.log("Seeded 3 sample insights");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
