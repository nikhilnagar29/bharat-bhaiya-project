#!/usr/bin/env tsx
/**
 * Seed script — run once to create the admin user and default content.
 * Usage: npx tsx lib/seed.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_USERNAME = process.env.ADMIN_INITIAL_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@123';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  // --- Admin ---
  const { default: Admin } = await import('./models/Admin');
  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!existing) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ username: ADMIN_USERNAME, passwordHash: hash });
    console.log(`Admin user "${ADMIN_USERNAME}" created.`);
  } else {
    console.log(`Admin user "${ADMIN_USERNAME}" already exists.`);
  }

  // --- Services ---
  const { default: Service } = await import('./models/Service');
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Term Insurance',
        description:
          "Your income is your family's strength. Even if you're not around tomorrow, that strength can continue to protect them through Term Insurance.",
        subDescription: 'Term Plan: Low Premium, High Coverage.',
        buttonText: 'Check Your Premium',
        order: 1,
        slug: 'term-insurance',
      },
      {
        title: 'Health Insurance',
        description:
          'Illness does not come with a warning, but Health Insurance is always ready to protect you.',
        subDescription: 'Health Insurance: Protecting your health, safeguarding your savings.',
        buttonText: 'Inquire Now',
        order: 2,
        slug: 'health-insurance',
      },
      {
        title: 'Emergency Fund & Secure Investment',
        description:
          'Be prepared for emergencies today and stay invested for your dreams tomorrow.',
        subDescription:
          'Emergency Fund & Secure Investments — Protection for today, Growth for tomorrow.',
        buttonText: 'Know More',
        order: 3,
        slug: 'emergency-fund',
      },
      {
        title: 'Financial Products',
        description:
          'From managing daily expenses to achieving big financial goals — the right financial products help you stay ahead at every stage of life.',
        subDescription: 'One Platform. Multiple Financial Solutions.',
        buttonText: 'Inquire Now',
        order: 4,
        slug: 'financial-products',
      },
      {
        title: 'Mutual Funds Investment',
        description:
          'Mutual Fund investment is an excellent option for individuals who want to achieve their financial goals in a disciplined and systematic manner. Through SIP, STP, SWP, or Lumpsum investments, you can benefit from long-term wealth creation. Regular investing, financial discipline, and the power of compounding help your money grow steadily over time, making it easier to build wealth and achieve your future financial goals.',
        subDescription: 'SIP / SWP / STP / Lumpsum',
        buttonText: 'Start Investing',
        order: 5,
        slug: 'mutual-funds',
      },
      {
        title: 'HNI Investments',
        description:
          'The goal is not just to earn more, but to manage, protect, and grow wealth efficiently.',
        subDescription:
          'Customized Strategies | Wealth Preservation | Long-Term Growth. Connect with us to explore exclusive HNI investment opportunities.',
        buttonText: 'Inquire Now',
        order: 6,
        slug: 'hni-investments',
      },
    ]);
    console.log('Default services seeded.');
  }

  // --- Testimonials ---
  const { default: Testimonial } = await import('./models/Testimonial');
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    await Testimonial.insertMany([
      {
        clientName: 'Rajesh Sharma',
        designation: 'Business Owner',
        city: 'Mumbai',
        text: 'GrowNsure helped me understand mutual fund investments in a way no one had before. My SIP portfolio has grown steadily over the last three years. The guidance has been exceptional.',
        rating: 5,
      },
      {
        clientName: 'Priya Mehta',
        designation: 'IT Professional',
        city: 'Pune',
        text: 'I was confused about term insurance options. Bharat ji explained everything clearly and helped me choose the right plan for my family. I feel much more financially secure now.',
        rating: 5,
      },
      {
        clientName: 'Amit Verma',
        designation: 'Retired Professional',
        city: 'Delhi',
        text: 'The retirement planning advice I received was thorough and realistic. The recommended SIP strategy is working exactly as planned. I highly recommend GrowNsure to anyone serious about their financial future.',
        rating: 5,
      },
    ]);
    console.log('Default testimonials seeded.');
  }

  // --- Credit Cards ---
  const { default: CreditCard } = await import('./models/CreditCard');
  const cardCount = await CreditCard.countDocuments();
  if (cardCount === 0) {
    await CreditCard.insertMany([
      {
        name: 'HDFC Regalia Credit Card',
        bank: 'HDFC Bank',
        features: [
          '4 reward points per Rs. 150 spent',
          'Complimentary airport lounge access',
          '15% discount at premium restaurants',
          'Travel insurance up to Rs. 1 crore',
          'Fuel surcharge waiver',
        ],
        annualFee: 'Rs. 2,500 + GST (waived on Rs. 3 lakh annual spend)',
        eligibility: 'Minimum annual income Rs. 12 lakh. Age 21–60 years.',
        order: 1,
      },
      {
        name: 'SBI SimplyCLICK Credit Card',
        bank: 'State Bank of India',
        features: [
          '10X rewards on online spends with partners',
          '5X rewards on all other online spends',
          'Amazon, BookMyShow, Cleartrip tie-ups',
          'E-vouchers worth Rs. 2,000 on milestone spends',
          'Fuel surcharge waiver',
        ],
        annualFee: 'Rs. 499 + GST (waived on Rs. 1 lakh annual spend)',
        eligibility: 'Minimum annual income Rs. 3 lakh. Age 21–65 years.',
        order: 2,
      },
      {
        name: 'Axis Bank ACE Credit Card',
        bank: 'Axis Bank',
        features: [
          '5% cashback on bill payments & recharges via Google Pay',
          '4% cashback on Swiggy, Zomato, and Ola',
          '2% cashback on all other spends',
          'No capping on cashback earned',
          'Fuel surcharge waiver',
        ],
        annualFee: 'Rs. 499 + GST (waived on Rs. 2 lakh annual spend)',
        eligibility: 'Minimum annual income Rs. 3 lakh. Age 18–70 years.',
        order: 3,
      },
    ]);
    console.log('Default credit cards seeded.');
  }

  // --- Site Content ---
  const { default: SiteContent } = await import('./models/SiteContent');
  const contentCount = await SiteContent.countDocuments();
  if (contentCount === 0) {
    await SiteContent.insertMany([
      { key: 'hero_title', value: 'GrowNsure' },
      { key: 'hero_tagline', value: 'Financial Solutions For A Secure Future' },
      {
        key: 'hero_subtagline',
        value: 'Helping Families Achieve Short-Term Financial Security & Long-Term Wealth Creation',
      },
      {
        key: 'about_content',
        value: `Hello, I am Bharat Rathore. I am committed to helping individuals, families, and businesses make informed financial decisions through suitable investment and protection solutions. My focus is on creating long-term value by offering guidance across Mutual Funds, Fixed Deposits, Bonds, Insurance, PMS, AIFs, GIFT City Investments, and other wealth management solutions.\n\nI believe that financial planning is not just about investing money — it is about building security, achieving goals, and creating a better future. My approach is based on transparency, trust, and client-centric advice tailored to individual needs and objectives.\n\nMy Vision: To empower people with the right financial knowledge and solutions so they can invest with confidence, protect their families, and achieve long-term financial freedom. My goal is to build lasting relationships based on trust while helping clients grow, preserve, and transfer wealth effectively across generations.`,
      },
      {
        key: 'about_quote',
        value: 'Growing Wealth. Protecting Futures. Building Trust.',
      },
      {
        key: 'disclaimer',
        value:
          'Disclaimer: All investments are subject to market, credit, liquidity, and other associated risks. Returns are not guaranteed, and past performance is not indicative of future results. Before making any investment decision, please assess your financial goals, risk appetite, and investment objectives carefully. Investors are advised to consult a qualified financial advisor and read all relevant documents, terms, and conditions before investing.',
      },
    ]);
    console.log('Default site content seeded.');
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
