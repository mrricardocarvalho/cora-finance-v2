/**
 * Database Seed Script
 *
 * Seeds default data for master tables:
 * - EUR currency (base currency with rate 1.0)
 * - 20 default categories (15 Expense, 5 Income)
 * - Default settings record
 *
 * Run with: tsx server/db/seed.ts
 *
 * @module server/db/seed
 */

import { DEFAULT_CATEGORIES } from '@/lib/constants/default-categories';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { categories, currencies, settings } from './schema';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // 1. Seed EUR currency (base currency)
    console.log('💶 Creating EUR currency...');
    const [eurCurrency] = await db
      .insert(currencies)
      .values({
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        exchangeRate: '1.0',
        lastUpdated: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    if (eurCurrency) {
      console.log(`✅ EUR currency created (ID: ${eurCurrency.id})`);
    } else {
      console.log('ℹ️  EUR currency already exists');
      // Fetch existing EUR
      const [existing] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.code, 'EUR'))
        .limit(1);
      if (existing) {
        console.log(`   Using existing EUR (ID: ${existing.id})`);
      }
    }

    // Get EUR ID for settings
    const [eur] = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, 'EUR'))
      .limit(1);

    if (!eur) {
      throw new Error('EUR currency not found after insert');
    }

    // 2. Seed default categories
    console.log('\n📂 Creating default categories...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const category of DEFAULT_CATEGORIES) {
      try {
        await db
          .insert(categories)
          .values({
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon,
          })
          .onConflictDoNothing();
        createdCount++;
      } catch (error) {
        skippedCount++;
      }
    }

    console.log(`✅ Created ${createdCount} categories`);
    if (skippedCount > 0) {
      console.log(`ℹ️  Skipped ${skippedCount} existing categories`);
    }

    // 3. Seed default settings
    console.log('\n⚙️  Creating default settings...');
    const [settingsRecord] = await db
      .insert(settings)
      .values({
        defaultCurrencyId: eur.id,
        theme: 'light',
        aiEnabled: true,
      })
      .onConflictDoNothing()
      .returning();

    if (settingsRecord) {
      console.log(`✅ Settings created (ID: ${settingsRecord.id})`);
    } else {
      console.log('ℹ️  Settings already exist');
    }

    console.log('\n✅ Database seeding complete!');
    console.log('\nSeeded data summary:');
    console.log('- 1 currency (EUR)');
    console.log(`- ${DEFAULT_CATEGORIES.length} categories (15 Expense, 5 Income)`);
    console.log('- 1 settings record');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run seed
seed();
