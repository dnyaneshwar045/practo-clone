import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const doctors = [
  {
    name: "Anita Deshmukh",
    email: "anita@practoclone.dev",
    specialty: "Dermatologist",
    city: "Pune",
    clinicName: "SkinGlow Clinic",
    experienceYears: 12,
    consultationFee: 700,
    rating: 4.8,
    about:
      "MD Dermatology with 12 years of experience in acne, pigmentation and hair-loss treatments.\nSpecial interest in paediatric skin conditions.",
  },
  {
    name: "Rahul Mehta",
    email: "rahul@practoclone.dev",
    specialty: "General Physician",
    city: "Mumbai",
    clinicName: "CityCare Polyclinic",
    experienceYears: 8,
    consultationFee: 500,
    rating: 4.6,
    about: "MBBS, MD (Internal Medicine). Diabetes, hypertension and preventive health check-ups.",
  },
  {
    name: "Sneha Kulkarni",
    email: "sneha@practoclone.dev",
    specialty: "Pediatrician",
    city: "Pune",
    clinicName: "Little Steps Child Clinic",
    experienceYears: 10,
    consultationFee: 600,
    rating: 4.9,
    about: "Newborn care, vaccinations and childhood nutrition counselling.",
  },
  {
    name: "Imran Shaikh",
    email: "imran@practoclone.dev",
    specialty: "Cardiologist",
    city: "Bengaluru",
    clinicName: "HeartFirst Institute",
    experienceYears: 15,
    consultationFee: 1200,
    rating: 4.7,
    about: "DM Cardiology. Interventional cardiology, angioplasty and heart-failure management.",
  },
  {
    name: "Priya Nair",
    email: "priya@practoclone.dev",
    specialty: "Gynecologist",
    city: "Kochi",
    clinicName: "Aster Women's Care",
    experienceYears: 9,
    consultationFee: 800,
    rating: 4.5,
    about: "Pregnancy care, PCOS management and fertility counselling.",
  },
  {
    name: "Vikram Singh",
    email: "vikram@practoclone.dev",
    specialty: "Orthopedist",
    city: "Delhi",
    clinicName: "BoneWell Ortho Centre",
    experienceYears: 14,
    consultationFee: 900,
    rating: 4.4,
    about: "Knee and shoulder arthroscopy, sports injuries and joint replacement.",
  },
];

const plans = [
  {
    slug: "care-basic",
    name: "Care Basic",
    description: "Great for occasional consultations and free health articles.",
    priceInr: 299,
    intervalDays: 30,
    consultations: 2,
    features: "2 video consultations per month\n10% off in-clinic visits\nUnlimited chat follow-ups for 3 days",
  },
  {
    slug: "care-plus",
    name: "Care Plus",
    description: "Our most popular plan for families that consult regularly.",
    priceInr: 799,
    intervalDays: 30,
    consultations: 6,
    features:
      "6 video consultations per month\n20% off in-clinic visits\nPriority appointment slots\nFree annual health check-up",
  },
  {
    slug: "care-max-annual",
    name: "Care Max (Annual)",
    description: "Best value — full-year coverage for up to 4 family members.",
    priceInr: 6999,
    intervalDays: 365,
    consultations: 60,
    features:
      "Unlimited video consultations\n30% off in-clinic visits\nCovers 4 family members\nDedicated care manager\nFree lab test pick-up",
  },
];

const articles = [
  {
    slug: "5-signs-you-should-see-a-dermatologist",
    title: "5 signs you should see a dermatologist",
    category: "Dermatology",
    excerpt: "Persistent acne, sudden hair loss or a changing mole — here is when a skin specialist should step in.",
    content:
      "Skin problems are common, but some need professional attention rather than home remedies.\nPersistent acne that does not respond to over-the-counter products may need prescription retinoids.\nSudden or patchy hair loss can point to hormonal or autoimmune causes that need lab tests.\nA mole that changes in size, colour or shape should always be evaluated to rule out skin cancer.\nChronic itching or rashes lasting more than two weeks deserve a diagnosis, not guesswork.\nFinally, if a skin condition is affecting your sleep or confidence, that alone is reason enough to book a consultation.",
  },
  {
    slug: "how-to-prepare-for-your-first-video-consultation",
    title: "How to prepare for your first video consultation",
    category: "Telemedicine",
    excerpt: "A few minutes of preparation makes an online doctor visit as effective as an in-clinic one.",
    content:
      "Write down your symptoms with dates before the call so nothing is forgotten.\nKeep your previous prescriptions, lab reports and a list of current medicines within reach.\nSit in a well-lit, quiet room — good lighting matters if the doctor needs to look at a rash or a wound.\nTest your internet connection, camera and microphone five minutes early.\nAt the end of the call, repeat the plan back to the doctor to confirm dosages and follow-up dates.",
  },
  {
    slug: "diabetes-diet-what-indian-kitchens-should-change",
    title: "Diabetes diet: what Indian kitchens should change",
    category: "General Physician",
    excerpt: "Small, sustainable swaps beat crash diets when managing blood sugar long term.",
    content:
      "Replace refined flour with whole grains such as jowar, bajra or hand-pounded rice to slow glucose spikes.\nAdd a protein source to every meal — dal, curd, eggs or paneer — so carbohydrates are absorbed more slowly.\nEat vegetables first, then protein, then carbohydrates; the order genuinely changes post-meal sugar levels.\nWalk for 10 minutes after each major meal instead of one long workout only on weekends.\nMonitor fasting and post-meal sugars weekly and share the log with your physician at every visit.",
  },
  {
    slug: "childhood-vaccination-schedule-explained",
    title: "Childhood vaccination schedule explained",
    category: "Pediatrics",
    excerpt: "A parent-friendly walkthrough of which vaccines are due at which age and why.",
    content:
      "Vaccines are scheduled to match the age at which a child becomes vulnerable to a particular infection.\nBirth doses of BCG, OPV and Hepatitis B protect during the earliest, most fragile weeks.\nAt 6, 10 and 14 weeks, the pentavalent, rotavirus and pneumococcal doses build core immunity.\nMeasles-rubella, typhoid and hepatitis A boosters follow between 9 months and 2 years.\nIf a dose is delayed, it does not need to be restarted — your paediatrician will simply catch it up.",
  },
  {
    slug: "when-chest-pain-is-an-emergency",
    title: "When chest pain is an emergency",
    category: "Cardiology",
    excerpt: "Not every chest pain is a heart attack, but these signs mean you should call for help immediately.",
    content:
      "Pressure or heaviness in the centre of the chest lasting more than a few minutes needs emergency care.\nPain spreading to the left arm, jaw, back or accompanied by cold sweat and breathlessness is a red flag.\nWomen and people with diabetes often present with unusual symptoms such as extreme fatigue or nausea.\nDo not drive yourself — call an ambulance and chew an aspirin if you are not allergic and no one advised otherwise.\nSharp pain that changes with breathing or posture is more often muscular, but should still be evaluated if it recurs.",
  },
];

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.demoRequest.deleteMany();
  await prisma.article.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@practoclone.dev",
      phone: "9800000000",
      role: "ADMIN",
      passwordHash,
    },
  });

  const patient = await prisma.user.create({
    data: {
      name: "Dnyaneshwar Jadhav",
      email: "patient@practoclone.dev",
      phone: "9811111111",
      role: "PATIENT",
      passwordHash,
    },
  });

  const createdDoctors = [];
  for (const [index, doctor] of doctors.entries()) {
    const created = await prisma.doctor.create({
      data: {
        specialty: doctor.specialty,
        city: doctor.city,
        clinicName: doctor.clinicName,
        experienceYears: doctor.experienceYears,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        about: doctor.about,
        status: index === doctors.length - 1 ? "PENDING" : "APPROVED",
        user: {
          create: {
            name: doctor.name,
            email: doctor.email,
            phone: `98222222${index}0`,
            role: "DOCTOR",
            passwordHash,
          },
        },
        availabilities: {
          create: [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
            dayOfWeek,
            startTime: dayOfWeek % 2 === 0 ? "10:00" : "17:00",
            endTime: dayOfWeek % 2 === 0 ? "13:00" : "20:00",
            slotMinutes: 30,
          })),
        },
      },
    });
    createdDoctors.push(created);
  }

  const createdPlans = [];
  for (const plan of plans) {
    createdPlans.push(await prisma.plan.create({ data: plan }));
  }

  for (const article of articles) {
    await prisma.article.create({ data: { ...article, published: true, authorId: admin.id } });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: createdDoctors[0].id,
      scheduledAt: tomorrow,
      mode: "VIDEO",
      status: "CONFIRMED",
      reason: "Recurring acne breakouts for the last 3 months",
    },
  });

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(18, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: createdDoctors[1].id,
      scheduledAt: lastWeek,
      mode: "IN_CLINIC",
      status: "COMPLETED",
      reason: "Annual health check-up",
      notes: "Vitals normal. Repeat HbA1c in 3 months.",
    },
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await prisma.subscription.create({
    data: { userId: patient.id, planId: createdPlans[1].id, expiresAt },
  });

  const preferredAt = new Date();
  preferredAt.setDate(preferredAt.getDate() + 2);
  preferredAt.setHours(19, 30, 0, 0);
  await prisma.demoRequest.create({
    data: {
      name: "Sunita Patil",
      email: "sunita@example.com",
      phone: "9899999999",
      topic: "Need guidance on which specialist to consult for persistent back pain",
      preferredAt,
    },
  });

  console.log("Seeded:", {
    users: await prisma.user.count(),
    doctors: await prisma.doctor.count(),
    articles: await prisma.article.count(),
    plans: await prisma.plan.count(),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
