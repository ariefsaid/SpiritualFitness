import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  location: text("location"),
  timezone: text("timezone").default("UTC"),
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  location: true,
  timezone: true,
});

// Prayer model
export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(), // fajr, dhuhr, asr, maghrib, isha
  scheduledTime: timestamp("scheduled_time").notNull(),
  completedTime: timestamp("completed_time"),
  status: text("status").notNull().default("upcoming"), // upcoming, completed, missed
  isJamaah: boolean("is_jamaah").default(false),
  isQadha: boolean("is_qadha").default(false),
  date: date("date").notNull(),
});

export const insertPrayerSchema = createInsertSchema(prayers).pick({
  userId: true,
  name: true,
  scheduledTime: true,
  completedTime: true,
  status: true,
  isJamaah: true,
  isQadha: true,
  date: true,
});

// Fasting model
export const fastings = pgTable("fastings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  type: text("type").notNull(), // ramadan, monday, thursday, ayyamBeed, etc.
  isCompleted: boolean("is_completed").default(false),
  notes: text("notes"),
});

export const insertFastingSchema = createInsertSchema(fastings).pick({
  userId: true,
  date: true,
  type: true,
  isCompleted: true,
  notes: true,
});

// Quran reading model
export const quranReadings = pgTable("quran_readings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  surahNumber: integer("surah_number").notNull(),
  lastReadVerse: integer("last_read_verse").notNull(),
  totalVerses: integer("total_verses").notNull(),
  date: date("date").notNull(),
  timeSpent: integer("time_spent").default(0), // in minutes
  bookmark: boolean("bookmark").default(false),
});

export const insertQuranReadingSchema = createInsertSchema(quranReadings).pick({
  userId: true,
  surahNumber: true,
  lastReadVerse: true,
  totalVerses: true,
  date: true,
  timeSpent: true,
  bookmark: true,
});

// Achievement model
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // prayer_streak, quran_completion, fasting, etc.
  level: integer("level").default(1),
  progress: integer("progress").default(0),
  goalThreshold: integer("goal_threshold").notNull(),
  isCompleted: boolean("is_completed").default(false),
  awardedAt: timestamp("awarded_at"),
  description: text("description").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  level: true,
  progress: true,
  goalThreshold: true,
  isCompleted: true,
  awardedAt: true,
  description: true,
});

// Community group model
export const communityGroups = pgTable("community_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // study, challenge, etc.
  memberCount: integer("member_count").default(0),
  meetingDay: text("meeting_day"), // monday, tuesday, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunityGroupSchema = createInsertSchema(communityGroups).pick({
  name: true,
  description: true,
  type: true,
  memberCount: true,
  meetingDay: true,
});

// User group membership model
export const userGroupMemberships = pgTable("user_group_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  groupId: integer("group_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: text("role").default("member"), // admin, member
});

export const insertUserGroupMembershipSchema = createInsertSchema(userGroupMemberships).pick({
  userId: true,
  groupId: true,
  role: true,
});

// Challenge model
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  challengeType: text("challenge_type").notNull(), // quran, prayer, fasting
  goal: integer("goal").notNull(),
  participants: integer("participants").default(0),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  challengeType: true,
  goal: true,
  participants: true,
});

// OfflineSync model
export const offlineSyncs = pgTable("offline_syncs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  payload: json("payload"),
  syncedAt: timestamp("synced_at"),
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfflineSyncSchema = createInsertSchema(offlineSyncs).pick({
  userId: true,
  endpoint: true,
  method: true,
  payload: true,
  status: true,
});

// Daily motivational quotes
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  arabic: text("arabic").notNull(),
  english: text("english").notNull(),
  source: text("source").notNull(),
  category: text("category").default("motivation"),
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  arabic: true,
  english: true,
  source: true,
  category: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;

export type Fasting = typeof fastings.$inferSelect;
export type InsertFasting = z.infer<typeof insertFastingSchema>;

export type QuranReading = typeof quranReadings.$inferSelect;
export type InsertQuranReading = z.infer<typeof insertQuranReadingSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type CommunityGroup = typeof communityGroups.$inferSelect;
export type InsertCommunityGroup = z.infer<typeof insertCommunityGroupSchema>;

export type UserGroupMembership = typeof userGroupMemberships.$inferSelect;
export type InsertUserGroupMembership = z.infer<typeof insertUserGroupMembershipSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type OfflineSync = typeof offlineSyncs.$inferSelect;
export type InsertOfflineSync = z.infer<typeof insertOfflineSyncSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;