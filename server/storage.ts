import {
  users, type User, type InsertUser,
  prayers, type Prayer, type InsertPrayer,
  fastings, type Fasting, type InsertFasting,
  quranReadings, type QuranReading, type InsertQuranReading,
  achievements, type Achievement, type InsertAchievement,
  communityGroups, type CommunityGroup, type InsertCommunityGroup,
  userGroupMemberships, type UserGroupMembership, type InsertUserGroupMembership,
  challenges, type Challenge, type InsertChallenge,
  offlineSyncs, type OfflineSync, type InsertOfflineSync,
  quotes, type Quote, type InsertQuote
} from "@shared/schema";

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
  updateAchievement(id: number, achievement: Partial<Achievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;

  // Community group methods
  createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup>;
  getCommunityGroups(): Promise<CommunityGroup[]>;
  getCommunityGroupById(id: number): Promise<CommunityGroup | undefined>;
  updateCommunityGroup(id: number, group: Partial<CommunityGroup>): Promise<CommunityGroup | undefined>;
  deleteCommunityGroup(id: number): Promise<boolean>;

  // User group membership methods
  createUserGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership>;
  getUserGroupMembershipsByUserId(userId: number): Promise<UserGroupMembership[]>;
  getUserGroupMembershipsByGroupId(groupId: number): Promise<UserGroupMembership[]>;
  deleteUserGroupMembership(id: number): Promise<boolean>;

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

    // Add some initial quotes
    this.seedQuotes();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, lastSyncedAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Prayer methods
  async createPrayer(prayer: InsertPrayer): Promise<Prayer> {
    const id = this.prayerCurrentId++;
    const newPrayer: Prayer = { ...prayer, id };
    this.prayers.set(id, newPrayer);
    return newPrayer;
  }

  async getPrayersByUserId(userId: number): Promise<Prayer[]> {
    return Array.from(this.prayers.values()).filter(
      (prayer) => prayer.userId === userId,
    );
  }

  async getPrayersByUserIdAndDate(userId: number, date: Date): Promise<Prayer[]> {
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(this.prayers.values()).filter(
      (prayer) => prayer.userId === userId && prayer.date.toISOString().split('T')[0] === dateStr,
    );
  }

  async updatePrayer(id: number, prayerData: Partial<Prayer>): Promise<Prayer | undefined> {
    const prayer = this.prayers.get(id);
    if (!prayer) return undefined;

    const updatedPrayer = { ...prayer, ...prayerData };
    this.prayers.set(id, updatedPrayer);
    return updatedPrayer;
  }

  async deletePrayer(id: number): Promise<boolean> {
    return this.prayers.delete(id);
  }

  // Fasting methods
  async createFasting(fasting: InsertFasting): Promise<Fasting> {
    const id = this.fastingCurrentId++;
    const newFasting: Fasting = { ...fasting, id };
    this.fastings.set(id, newFasting);
    return newFasting;
  }

  async getFastingsByUserId(userId: number): Promise<Fasting[]> {
    return Array.from(this.fastings.values()).filter(
      (fasting) => fasting.userId === userId,
    );
  }

  async getFastingsByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Fasting[]> {
    return Array.from(this.fastings.values()).filter(
      (fasting) => fasting.userId === userId && fasting.date >= startDate && fasting.date <= endDate,
    );
  }

  async updateFasting(id: number, fastingData: Partial<Fasting>): Promise<Fasting | undefined> {
    const fasting = this.fastings.get(id);
    if (!fasting) return undefined;

    const updatedFasting = { ...fasting, ...fastingData };
    this.fastings.set(id, updatedFasting);
    return updatedFasting;
  }

  async deleteFasting(id: number): Promise<boolean> {
    return this.fastings.delete(id);
  }

  // Quran reading methods
  async createQuranReading(reading: InsertQuranReading): Promise<QuranReading> {
    const id = this.quranReadingCurrentId++;
    const newReading: QuranReading = { ...reading, id };
    this.quranReadings.set(id, newReading);
    return newReading;
  }

  async getQuranReadingsByUserId(userId: number): Promise<QuranReading[]> {
    return Array.from(this.quranReadings.values()).filter(
      (reading) => reading.userId === userId,
    );
  }

  async getLatestQuranReadingByUserId(userId: number): Promise<QuranReading | undefined> {
    const userReadings = await this.getQuranReadingsByUserId(userId);
    if (userReadings.length === 0) return undefined;

    return userReadings.reduce((latest, current) => {
      return latest.date > current.date ? latest : current;
    });
  }

  async updateQuranReading(id: number, readingData: Partial<QuranReading>): Promise<QuranReading | undefined> {
    const reading = this.quranReadings.get(id);
    if (!reading) return undefined;

    const updatedReading = { ...reading, ...readingData };
    this.quranReadings.set(id, updatedReading);
    return updatedReading;
  }

  async deleteQuranReading(id: number): Promise<boolean> {
    return this.quranReadings.delete(id);
  }

  // Achievement methods
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementCurrentId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId,
    );
  }

  async updateAchievement(id: number, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;

    const updatedAchievement = { ...achievement, ...achievementData };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievements.delete(id);
  }

  // Community group methods
  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    const id = this.communityGroupCurrentId++;
    const newGroup: CommunityGroup = { ...group, id, createdAt: new Date() };
    this.communityGroups.set(id, newGroup);
    return newGroup;
  }

  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return Array.from(this.communityGroups.values());
  }

  async getCommunityGroupById(id: number): Promise<CommunityGroup | undefined> {
    return this.communityGroups.get(id);
  }

  async updateCommunityGroup(id: number, groupData: Partial<CommunityGroup>): Promise<CommunityGroup | undefined> {
    const group = this.communityGroups.get(id);
    if (!group) return undefined;

    const updatedGroup = { ...group, ...groupData };
    this.communityGroups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteCommunityGroup(id: number): Promise<boolean> {
    return this.communityGroups.delete(id);
  }

  // User group membership methods
  async createUserGroupMembership(membership: InsertUserGroupMembership): Promise<UserGroupMembership> {
    const id = this.userGroupMembershipCurrentId++;
    const newMembership: UserGroupMembership = { ...membership, id, joinedAt: new Date() };
    this.userGroupMemberships.set(id, newMembership);
    return newMembership;
  }

  async getUserGroupMembershipsByUserId(userId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values()).filter(
      (membership) => membership.userId === userId,
    );
  }

  async getUserGroupMembershipsByGroupId(groupId: number): Promise<UserGroupMembership[]> {
    return Array.from(this.userGroupMemberships.values()).filter(
      (membership) => membership.groupId === groupId,
    );
  }

  async deleteUserGroupMembership(id: number): Promise<boolean> {
    return this.userGroupMemberships.delete(id);
  }

  // Challenge methods
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
    if (!challenge) return undefined;

    const updatedChallenge = { ...challenge, ...challengeData };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }

  // Offline sync methods
  async createOfflineSync(sync: InsertOfflineSync): Promise<OfflineSync> {
    const id = this.offlineSyncCurrentId++;
    const newSync: OfflineSync = { ...sync, id, createdAt: new Date() };
    this.offlineSyncs.set(id, newSync);
    return newSync;
  }

  async getPendingOfflineSyncsByUserId(userId: number): Promise<OfflineSync[]> {
    return Array.from(this.offlineSyncs.values()).filter(
      (sync) => sync.userId === userId && sync.status === 'pending',
    );
  }

  async updateOfflineSync(id: number, syncData: Partial<OfflineSync>): Promise<OfflineSync | undefined> {
    const sync = this.offlineSyncs.get(id);
    if (!sync) return undefined;

    const updatedSync = { ...sync, ...syncData };
    this.offlineSyncs.set(id, updatedSync);
    return updatedSync;
  }

  async deleteOfflineSync(id: number): Promise<boolean> {
    return this.offlineSyncs.delete(id);
  }

  // Quote methods
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = this.quoteCurrentId++;
    const newQuote: Quote = { ...quote, id };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const quotes = Array.from(this.quotes.values());
    if (quotes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  async getQuotesByCategory(category: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(
      (quote) => quote.category === category,
    );
  }

  // Seed some initial quotes
  private seedQuotes() {
    const quoteData: InsertQuote[] = [
      {
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا. إِنَّ مَعَ الْعُسْرِ يُسْرًا.",
        english: "Indeed, with hardship comes ease. Indeed, with hardship comes ease.",
        source: "Quran 94:5-6",
        category: "motivation",
      },
      {
        arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
        english: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
        source: "Quran 2:186",
        category: "prayer",
      },
      {
        arabic: "مَن كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
        english: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
        source: "Hadith, Bukhari and Muslim",
        category: "daily",
      },
      {
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
        english: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
        source: "Quran 2:183",
        category: "fasting",
      },
      {
        arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
        english: "So which of the favors of your Lord would you deny?",
        source: "Quran 55:13",
        category: "gratitude",
      }
    ];

    quoteData.forEach(quote => {
      const id = this.quoteCurrentId++;
      this.quotes.set(id, { ...quote, id });
    });
  }
}

export const storage = new MemStorage();
