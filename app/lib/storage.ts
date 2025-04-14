import {
  User, InsertUser,
  Prayer, InsertPrayer,
  Fasting, InsertFasting, 
  QuranReading, InsertQuranReading,
  Achievement, InsertAchievement,
  CommunityGroup, InsertCommunityGroup,
  UserGroupMembership, InsertUserGroupMembership,
  Challenge, InsertChallenge,
  OfflineSync, InsertOfflineSync,
  Quote, InsertQuote
} from './schema';
import { getDb } from './db';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Prayer methods
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  getPrayersByUserId(userId: number): Promise<Prayer[]>;
  getPrayersByUserIdAndDate(userId: number, date: Date): Promise<Prayer[]>;
  updatePrayer(id: number, prayer: Partial<Prayer>): Promise<Prayer | undefined>;
  deletePrayer(id: number): Promise<boolean>;

  // Fasting methods
  createFasting(fasting: InsertFasting): Promise<Fasting>;
  getFastingsByUserId(userId: number): Promise<Fasting[]>;
  getFastingsByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Fasting[]>;
  updateFasting(id: number, fasting: Partial<Fasting>): Promise<Fasting | undefined>;
  deleteFasting(id: number): Promise<boolean>;

  // Quran reading methods
  createQuranReading(reading: InsertQuranReading): Promise<QuranReading>;
  getQuranReadingsByUserId(userId: number): Promise<QuranReading[]>;
  getLatestQuranReadingByUserId(userId: number): Promise<QuranReading | undefined>;
  updateQuranReading(id: number, reading: Partial<QuranReading>): Promise<QuranReading | undefined>;
  deleteQuranReading(id: number): Promise<boolean>;

  // Achievement methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  updateAchievement(id: number, achievement: Partial<Achievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;

  // Community group methods
  createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup>;
  getCommunityGroups(): Promise<CommunityGroup[]>;
  getCommunityGroupsByType(type: string): Promise<CommunityGroup[]>;
  getCommunityGroupById(id: number): Promise<CommunityGroup | undefined>;
  updateCommunityGroup(id: number, group: Partial<CommunityGroup>): Promise<CommunityGroup | undefined>;
  deleteCommunityGroup(id: number): Promise<boolean>;
  getGroupMembers(groupId: number): Promise<UserGroupMembership[]>;
  getGroupAdmins(groupId: number): Promise<UserGroupMembership[]>;

  // User group membership methods
  createGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership>;
  getUserMemberships(userId: number): Promise<UserGroupMembership[]>;
  getGroupMembership(userId: number, groupId: number): Promise<UserGroupMembership | undefined>;
  getMembershipById(id: number): Promise<UserGroupMembership | undefined>;
  updateMembership(id: number, data: Partial<UserGroupMembership>): Promise<UserGroupMembership | undefined>;
  deleteMembership(id: number): Promise<boolean>;

  // Challenge methods
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  updateChallenge(id: number, challenge: Partial<Challenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;

  // Offline sync methods
  createOfflineSync(sync: InsertOfflineSync): Promise<OfflineSync>;
  getPendingOfflineSyncsByUserId(userId: number): Promise<OfflineSync[]>;
  updateOfflineSync(id: number, sync: Partial<OfflineSync>): Promise<OfflineSync | undefined>;
  deleteOfflineSync(id: number): Promise<boolean>;

  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getRandomQuote(): Promise<Quote | undefined>;
  getQuotesByCategory(category: string): Promise<Quote[]>;
}

/**
 * In-memory storage implementation for SpiritualFit
 * This will be used when no database connection is available
 * or for testing purposes
 */
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayers: Map<number, Prayer>;
  private fastings: Map<number, Fasting>;
  private quranReadings: Map<number, QuranReading>;
  private achievements: Map<number, Achievement>;
  private communityGroups: Map<number, CommunityGroup>;
  private userGroupMemberships: Map<number, UserGroupMembership>;
  private challenges: Map<number, Challenge>;
  private offlineSyncs: Map<number, OfflineSync>;
  private quotes: Map<number, Quote>;

  private userCurrentId = 1;
  private prayerCurrentId = 1;
  private fastingCurrentId = 1;
  private quranReadingCurrentId = 1;
  private achievementCurrentId = 1;
  private communityGroupCurrentId = 1;
  private userGroupMembershipCurrentId = 1;
  private challengeCurrentId = 1;
  private offlineSyncCurrentId = 1;
  private quoteCurrentId = 1;

  constructor() {
    this.users = new Map();
    this.prayers = new Map();
    this.fastings = new Map();
    this.quranReadings = new Map();
    this.achievements = new Map();
    this.communityGroups = new Map();
    this.userGroupMemberships = new Map();
    this.challenges = new Map();
    this.offlineSyncs = new Map();
    this.quotes = new Map();
    
    // Seed initial quotes
    this.seedQuotes();
    
    // Add a demo user
    this.createUser({
      username: "demouser",
      password: "password123",
      displayName: "Demo User",
      email: "demo@example.com",
      location: "Global",
      timezone: "UTC"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, lastSyncedAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
    const id = this.prayerCurrentId++;
    const newPrayer: Prayer = { ...prayer, id };
    this.prayers.set(id, newPrayer);
    return newPrayer;
  }

  async getPrayersByUserId(userId: number): Promise<Prayer[]> {
    return Array.from(this.prayers.values()).filter(prayer => prayer.userId === userId);
  }

  async getPrayersByUserIdAndDate(userId: number, date: Date): Promise<Prayer[]> {
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(this.prayers.values()).filter(prayer => {
      const prayerDateStr = prayer.date instanceof Date 
        ? prayer.date.toISOString().split('T')[0]
        : prayer.date;
      return prayer.userId === userId && prayerDateStr === dateStr;
    });
  }

  async updatePrayer(id: number, prayerData: Partial<Prayer>): Promise<Prayer | undefined> {
    const prayer = this.prayers.get(id);
    if (!prayer) {
      return undefined;
    }
    
    const updatedPrayer = { ...prayer, ...prayerData };
    this.prayers.set(id, updatedPrayer);
    return updatedPrayer;
  }

  async deletePrayer(id: number): Promise<boolean> {
    return this.prayers.delete(id);
  }

  async createFasting(fasting: InsertFasting): Promise<Fasting> {
    const id = this.fastingCurrentId++;
    const newFasting: Fasting = { ...fasting, id };
    this.fastings.set(id, newFasting);
    return newFasting;
  }

  async getFastingsByUserId(userId: number): Promise<Fasting[]> {
    return Array.from(this.fastings.values()).filter(fasting => fasting.userId === userId);
  }

  async getFastingsByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Fasting[]> {
    return Array.from(this.fastings.values()).filter(fasting => {
      const fastingDate = fasting.date instanceof Date 
        ? fasting.date 
        : new Date(fasting.date);
      return fasting.userId === userId && 
             fastingDate >= startDate && 
             fastingDate <= endDate;
    });
  }

  async updateFasting(id: number, fastingData: Partial<Fasting>): Promise<Fasting | undefined> {
    const fasting = this.fastings.get(id);
    if (!fasting) {
      return undefined;
    }
    
    const updatedFasting = { ...fasting, ...fastingData };
    this.fastings.set(id, updatedFasting);
    return updatedFasting;
  }

  async deleteFasting(id: number): Promise<boolean> {
    return this.fastings.delete(id);
  }

  async createQuranReading(reading: InsertQuranReading): Promise<QuranReading> {
    const id = this.quranReadingCurrentId++;
    const newReading: QuranReading = { ...reading, id };
    this.quranReadings.set(id, newReading);
    return newReading;
  }

  async getQuranReadingsByUserId(userId: number): Promise<QuranReading[]> {
    return Array.from(this.quranReadings.values())
      .filter(reading => reading.userId === userId)
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });
  }

  async getLatestQuranReadingByUserId(userId: number): Promise<QuranReading | undefined> {
    const readings = await this.getQuranReadingsByUserId(userId);
    return readings.length > 0 ? readings[0] : undefined;
  }

  async updateQuranReading(id: number, readingData: Partial<QuranReading>): Promise<QuranReading | undefined> {
    const reading = this.quranReadings.get(id);
    if (!reading) {
      return undefined;
    }
    
    const updatedReading = { ...reading, ...readingData };
    this.quranReadings.set(id, updatedReading);
    return updatedReading;
  }

  async deleteQuranReading(id: number): Promise<boolean> {
    return this.quranReadings.delete(id);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementCurrentId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async updateAchievement(id: number, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) {
      return undefined;
    }
    
    const updatedAchievement = { ...achievement, ...achievementData };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievements.delete(id);
  }

  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    const id = this.communityGroupCurrentId++;
    const newGroup: CommunityGroup = { ...group, id, createdAt: new Date() };
    this.communityGroups.set(id, newGroup);
    return newGroup;
  }

  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return Array.from(this.communityGroups.values());
  }
  
  async getCommunityGroupsByType(type: string): Promise<CommunityGroup[]> {
    return Array.from(this.communityGroups.values())
      .filter(group => group.type.toLowerCase() === type.toLowerCase());
  }

  async getCommunityGroupById(id: number): Promise<CommunityGroup | undefined> {
    return this.communityGroups.get(id);
  }

  async updateCommunityGroup(id: number, groupData: Partial<CommunityGroup>): Promise<CommunityGroup | undefined> {
    const group = this.communityGroups.get(id);
    if (!group) {
      return undefined;
    }
    
    const updatedGroup = { ...group, ...groupData };
    this.communityGroups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteCommunityGroup(id: number): Promise<boolean> {
    return this.communityGroups.delete(id);
  }
  
  async getGroupMembers(groupId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values())
      .filter(membership => membership.groupId === groupId);
  }
  
  async getGroupAdmins(groupId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values())
      .filter(membership => membership.groupId === groupId && membership.role === 'admin');
  }

  async createGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership> {
    return this.createUserGroupMembership(membership);
  }
  
  async getUserMemberships(userId: number): Promise<UserGroupMembership[]> {
    return this.getUserGroupMembershipsByUserId(userId);
  }
  
  async getGroupMembership(userId: number, groupId: number): Promise<UserGroupMembership | undefined> {
    return Array.from(this.userGroupMemberships.values())
      .find(membership => membership.userId === userId && membership.groupId === groupId);
  }
  
  async getMembershipById(id: number): Promise<UserGroupMembership | undefined> {
    return this.userGroupMemberships.get(id);
  }
  
  async updateMembership(id: number, data: Partial<UserGroupMembership>): Promise<UserGroupMembership | undefined> {
    const membership = this.userGroupMemberships.get(id);
    if (!membership) {
      return undefined;
    }
    
    const updatedMembership = { ...membership, ...data };
    this.userGroupMemberships.set(id, updatedMembership);
    return updatedMembership;
  }
  
  async deleteMembership(id: number): Promise<boolean> {
    return this.deleteUserGroupMembership(id);
  }

  async createUserGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership> {
    const id = this.userGroupMembershipCurrentId++;
    const newMembership: UserGroupMembership = { ...membership, id, joinedAt: new Date() };
    this.userGroupMemberships.set(id, newMembership);
    return newMembership;
  }

  async getUserGroupMembershipsByUserId(userId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values()).filter(membership => membership.userId === userId);
  }

  async getUserGroupMembershipsByGroupId(groupId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values()).filter(membership => membership.groupId === groupId);
  }

  async deleteUserGroupMembership(id: number): Promise<boolean> {
    return this.userGroupMemberships.delete(id);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeCurrentId++;
    const newChallenge: Challenge = { ...challenge, id };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async updateChallenge(id: number, challengeData: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) {
      return undefined;
    }
    
    const updatedChallenge = { ...challenge, ...challengeData };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }

  async createOfflineSync(sync: InsertOfflineSync): Promise<OfflineSync> {
    const id = this.offlineSyncCurrentId++;
    const newSync: OfflineSync = { ...sync, id, createdAt: new Date() };
    this.offlineSyncs.set(id, newSync);
    return newSync;
  }

  async getPendingOfflineSyncsByUserId(userId: number): Promise<OfflineSync[]> {
    return Array.from(this.offlineSyncs.values()).filter(sync => 
      sync.userId === userId && sync.status === "pending"
    );
  }

  async updateOfflineSync(id: number, syncData: Partial<OfflineSync>): Promise<OfflineSync | undefined> {
    const sync = this.offlineSyncs.get(id);
    if (!sync) {
      return undefined;
    }
    
    const updatedSync = { ...sync, ...syncData };
    this.offlineSyncs.set(id, updatedSync);
    return updatedSync;
  }

  async deleteOfflineSync(id: number): Promise<boolean> {
    return this.offlineSyncs.delete(id);
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = this.quoteCurrentId++;
    const newQuote: Quote = { ...quote, id };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const quotes = Array.from(this.quotes.values());
    if (quotes.length === 0) {
      return undefined;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  async getQuotesByCategory(category: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(quote => 
      quote.category.toLowerCase() === category.toLowerCase()
    );
  }

  private seedQuotes() {
    // Sample quotes
    const sampleQuotes = [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.",
        source: "Quran 2:201",
        category: "dua"
      },
      {
        arabic: "لا إله إلا الله محمد رسول الله",
        english: "There is no deity except Allah, Muhammad is the messenger of Allah.",
        source: "Shahada",
        category: "faith"
      },
      {
        arabic: "الصبر مفتاح الفرج",
        english: "Patience is the key to relief.",
        source: "Islamic Proverb",
        category: "patience"
      },
      {
        arabic: "إنما الأعمال بالنيات",
        english: "Actions are judged by intentions.",
        source: "Hadith, Sahih Bukhari",
        category: "intention"
      },
      {
        arabic: "من عرف نفسه فقد عرف ربه",
        english: "Whoever knows himself knows his Lord.",
        source: "Islamic Proverb",
        category: "reflection"
      }
    ];
    
    // Add quotes to storage
    for (const quote of sampleQuotes) {
      this.createQuote(quote);
    }
  }
}

// Create DB Storage class if database is available
export class DbStorage implements IStorage {
  // Implement with actual database queries when ready
  // For now, we'll use a stub implementation that delegates to MemStorage
  
  private memStorage = new MemStorage();
  
  async getUser(id: number): Promise<User | undefined> {
    // TODO: Implement with actual database
    return this.memStorage.getUser(id);
  }
  
  // ... implement all other methods similarly
  // This placeholder delegates to MemStorage for now
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }
  
  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    return this.memStorage.updateUser(id, user);
  }
  
  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
    return this.memStorage.createPrayer(prayer);
  }
  
  async getPrayersByUserId(userId: number): Promise<Prayer[]> {
    return this.memStorage.getPrayersByUserId(userId);
  }
  
  async getPrayersByUserIdAndDate(userId: number, date: Date): Promise<Prayer[]> {
    return this.memStorage.getPrayersByUserIdAndDate(userId, date);
  }
  
  async updatePrayer(id: number, prayer: Partial<Prayer>): Promise<Prayer | undefined> {
    return this.memStorage.updatePrayer(id, prayer);
  }
  
  async deletePrayer(id: number): Promise<boolean> {
    return this.memStorage.deletePrayer(id);
  }
  
  async createFasting(fasting: InsertFasting): Promise<Fasting> {
    return this.memStorage.createFasting(fasting);
  }
  
  async getFastingsByUserId(userId: number): Promise<Fasting[]> {
    return this.memStorage.getFastingsByUserId(userId);
  }
  
  async getFastingsByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Fasting[]> {
    return this.memStorage.getFastingsByUserIdAndDateRange(userId, startDate, endDate);
  }
  
  async updateFasting(id: number, fasting: Partial<Fasting>): Promise<Fasting | undefined> {
    return this.memStorage.updateFasting(id, fasting);
  }
  
  async deleteFasting(id: number): Promise<boolean> {
    return this.memStorage.deleteFasting(id);
  }
  
  async createQuranReading(reading: InsertQuranReading): Promise<QuranReading> {
    return this.memStorage.createQuranReading(reading);
  }
  
  async getQuranReadingsByUserId(userId: number): Promise<QuranReading[]> {
    return this.memStorage.getQuranReadingsByUserId(userId);
  }
  
  async getLatestQuranReadingByUserId(userId: number): Promise<QuranReading | undefined> {
    return this.memStorage.getLatestQuranReadingByUserId(userId);
  }
  
  async updateQuranReading(id: number, reading: Partial<QuranReading>): Promise<QuranReading | undefined> {
    return this.memStorage.updateQuranReading(id, reading);
  }
  
  async deleteQuranReading(id: number): Promise<boolean> {
    return this.memStorage.deleteQuranReading(id);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    return this.memStorage.createAchievement(achievement);
  }
  
  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return this.memStorage.getAchievementsByUserId(userId);
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    return this.memStorage.getAchievementById(id);
  }
  
  async updateAchievement(id: number, achievement: Partial<Achievement>): Promise<Achievement | undefined> {
    return this.memStorage.updateAchievement(id, achievement);
  }
  
  async deleteAchievement(id: number): Promise<boolean> {
    return this.memStorage.deleteAchievement(id);
  }
  
  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    return this.memStorage.createCommunityGroup(group);
  }
  
  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return this.memStorage.getCommunityGroups();
  }
  
  async getCommunityGroupById(id: number): Promise<CommunityGroup | undefined> {
    return this.memStorage.getCommunityGroupById(id);
  }
  
  async updateCommunityGroup(id: number, group: Partial<CommunityGroup>): Promise<CommunityGroup | undefined> {
    return this.memStorage.updateCommunityGroup(id, group);
  }
  
  async deleteCommunityGroup(id: number): Promise<boolean> {
    return this.memStorage.deleteCommunityGroup(id);
  }
  
  async createUserGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership> {
    return this.memStorage.createUserGroupMembership(membership);
  }
  
  async getUserGroupMembershipsByUserId(userId: number): Promise<UserGroupMembership[]> {
    return this.memStorage.getUserGroupMembershipsByUserId(userId);
  }
  
  async getUserGroupMembershipsByGroupId(groupId: number): Promise<UserGroupMembership[]> {
    return this.memStorage.getUserGroupMembershipsByGroupId(groupId);
  }
  
  async deleteUserGroupMembership(id: number): Promise<boolean> {
    return this.memStorage.deleteUserGroupMembership(id);
  }
  
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    return this.memStorage.createChallenge(challenge);
  }
  
  async getChallenges(): Promise<Challenge[]> {
    return this.memStorage.getChallenges();
  }
  
  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.memStorage.getChallengeById(id);
  }
  
  async updateChallenge(id: number, challenge: Partial<Challenge>): Promise<Challenge | undefined> {
    return this.memStorage.updateChallenge(id, challenge);
  }
  
  async deleteChallenge(id: number): Promise<boolean> {
    return this.memStorage.deleteChallenge(id);
  }
  
  async createOfflineSync(sync: InsertOfflineSync): Promise<OfflineSync> {
    return this.memStorage.createOfflineSync(sync);
  }
  
  async getPendingOfflineSyncsByUserId(userId: number): Promise<OfflineSync[]> {
    return this.memStorage.getPendingOfflineSyncsByUserId(userId);
  }
  
  async updateOfflineSync(id: number, sync: Partial<OfflineSync>): Promise<OfflineSync | undefined> {
    return this.memStorage.updateOfflineSync(id, sync);
  }
  
  async deleteOfflineSync(id: number): Promise<boolean> {
    return this.memStorage.deleteOfflineSync(id);
  }
  
  async createQuote(quote: InsertQuote): Promise<Quote> {
    return this.memStorage.createQuote(quote);
  }
  
  async getRandomQuote(): Promise<Quote | undefined> {
    return this.memStorage.getRandomQuote();
  }
  
  async getQuotesByCategory(category: string): Promise<Quote[]> {
    return this.memStorage.getQuotesByCategory(category);
  }
}

// Determine which storage to use based on whether the database is available
export const storage = getDb() ? new DbStorage() : new MemStorage();