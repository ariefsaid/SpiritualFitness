import { pgTable, text, uuid, varchar, timestamp, boolean, integer, serial, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// PROFILES TABLE
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  clerk_id: text('clerk_id').notNull().unique(),
  email: text('email'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  avatar_url: text('avatar_url'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  clerk_id: true,
  email: true,
  first_name: true,
  last_name: true,
  avatar_url: true,
  bio: true
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

// PRAYERS TABLE
export const prayers = pgTable('prayers', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  date: timestamp('date').notNull(),
  prayer_name: text('prayer_name').notNull(),
  completed: boolean('completed').default(false),
  on_time: boolean('on_time').default(false),
  in_congregation: boolean('in_congregation').default(false),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertPrayerSchema = createInsertSchema(prayers).pick({
  user_id: true,
  date: true,
  prayer_name: true,
  completed: true,
  on_time: true,
  in_congregation: true,
  notes: true
});

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;

// FASTINGS TABLE
export const fastings = pgTable('fastings', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  date: timestamp('date').notNull(),
  completed: boolean('completed').default(false),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertFastingSchema = createInsertSchema(fastings).pick({
  user_id: true,
  date: true,
  completed: true,
  notes: true
});

export type Fasting = typeof fastings.$inferSelect;
export type InsertFasting = z.infer<typeof insertFastingSchema>;

// QURAN READINGS TABLE
export const quranReadings = pgTable('quran_readings', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  date: timestamp('date').notNull(),
  surah: integer('surah').notNull(),
  ayah: integer('ayah').notNull(),
  completions: integer('completions').default(1),
  progress: integer('progress').default(0),
  time_spent: integer('time_spent'),
  bookmark: boolean('bookmark').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertQuranReadingSchema = createInsertSchema(quranReadings).pick({
  user_id: true,
  date: true,
  surah: true,
  ayah: true,
  completions: true,
  progress: true,
  time_spent: true,
  bookmark: true
});

export type QuranReading = typeof quranReadings.$inferSelect;
export type InsertQuranReading = z.infer<typeof insertQuranReadingSchema>;

// ACHIEVEMENTS TABLE
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  progress: integer('progress'),
  unlocked_at: timestamp('unlocked_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  user_id: true,
  title: true,
  description: true,
  icon: true,
  category: true,
  status: true,
  progress: true,
  unlocked_at: true
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// COMMUNITY GROUPS TABLE
export const communityGroups = pgTable('community_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatar_url: text('avatar_url'),
  created_by: text('created_by').notNull().references(() => profiles.clerk_id),
  private: boolean('private').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertCommunityGroupSchema = createInsertSchema(communityGroups).pick({
  name: true,
  description: true,
  avatar_url: true,
  created_by: true,
  private: true
});

export type CommunityGroup = typeof communityGroups.$inferSelect;
export type InsertCommunityGroup = z.infer<typeof insertCommunityGroupSchema>;

// USER GROUP MEMBERSHIPS TABLE
export const userGroupMemberships = pgTable('user_group_memberships', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  group_id: integer('group_id').notNull().references(() => communityGroups.id),
  role: text('role').default('member'),
  joined_at: timestamp('joined_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertUserGroupMembershipSchema = createInsertSchema(userGroupMemberships).pick({
  user_id: true,
  group_id: true,
  role: true
});

export type UserGroupMembership = typeof userGroupMemberships.$inferSelect;
export type InsertUserGroupMembership = z.infer<typeof insertUserGroupMembershipSchema>;

// CHALLENGES TABLE
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  created_by: text('created_by').notNull().references(() => profiles.clerk_id),
  group_id: integer('group_id').references(() => communityGroups.id),
  type: text('type').notNull(),
  target: integer('target').notNull(),
  private: boolean('private').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  start_date: true,
  end_date: true,
  created_by: true,
  group_id: true,
  type: true,
  target: true,
  private: true
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

// OFFLINE SYNCS TABLE
export const offlineSyncs = pgTable('offline_syncs', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => profiles.clerk_id),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id'),
  operation: text('operation').notNull(),
  data: jsonb('data').notNull(),
  synced: boolean('synced').default(false),
  created_at: timestamp('created_at').defaultNow(),
  synced_at: timestamp('synced_at')
});

export const insertOfflineSyncSchema = createInsertSchema(offlineSyncs).pick({
  user_id: true,
  entity_type: true,
  entity_id: true,
  operation: true,
  data: true
});

export type OfflineSync = typeof offlineSyncs.$inferSelect;
export type InsertOfflineSync = z.infer<typeof insertOfflineSyncSchema>;

// QUOTES TABLE
export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  author: text('author'),
  source: text('source'),
  category: text('category'),
  created_at: timestamp('created_at').defaultNow()
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  text: true,
  author: true,
  source: true,
  category: true
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;