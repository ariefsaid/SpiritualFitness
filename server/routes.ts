import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import {
  insertUserSchema,
  insertPrayerSchema,
  insertFastingSchema,
  insertQuranReadingSchema,
  insertAchievementSchema,
  insertCommunityGroupSchema,
  insertUserGroupMembershipSchema,
  insertChallengeSchema,
  insertOfflineSyncSchema
} from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "spiritualfit-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Handle validation errors
  const handleValidation = (schema: any) => {
    return (req: Request, res: Response, next: any) => {
      try {
        schema.parse(req.body);
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          res.status(400).json({ message: validationError.message });
        } else {
          next(err);
        }
      }
    };
  };

  // API routes
  const router = express.Router();

  // Auth routes
  router.post("/auth/register", handleValidation(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({ id: user.id, username: user.username });
      });
    } catch (err) {
      res.status(500).json({ message: "Error registering user" });
    }
  });

  router.post("/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({ id: user.id, username: user.username });
  });

  router.post("/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  router.get("/auth/me", isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({ id: user.id, username: user.username });
  });

  // Prayer routes
  router.post("/prayers", isAuthenticated, handleValidation(insertPrayerSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const prayer = await storage.createPrayer({
        ...req.body,
        userId: user.id,
      });
      res.status(201).json(prayer);
    } catch (err) {
      res.status(500).json({ message: "Error creating prayer" });
    }
  });

  router.get("/prayers", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const prayers = await storage.getPrayersByUserId(user.id);
      res.json(prayers);
    } catch (err) {
      res.status(500).json({ message: "Error fetching prayers" });
    }
  });

  router.get("/prayers/daily", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const prayers = await storage.getPrayersByUserIdAndDate(user.id, date);
      res.json(prayers);
    } catch (err) {
      res.status(500).json({ message: "Error fetching daily prayers" });
    }
  });

  router.put("/prayers/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const prayer = await storage.updatePrayer(id, req.body);
      
      if (!prayer) {
        return res.status(404).json({ message: "Prayer not found" });
      }
      
      if (prayer.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(prayer);
    } catch (err) {
      res.status(500).json({ message: "Error updating prayer" });
    }
  });

  // Fasting routes
  router.post("/fastings", isAuthenticated, handleValidation(insertFastingSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const fasting = await storage.createFasting({
        ...req.body,
        userId: user.id,
      });
      res.status(201).json(fasting);
    } catch (err) {
      res.status(500).json({ message: "Error creating fasting record" });
    }
  });

  router.get("/fastings", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const fastings = await storage.getFastingsByUserId(user.id);
      res.json(fastings);
    } catch (err) {
      res.status(500).json({ message: "Error fetching fasting records" });
    }
  });

  router.get("/fastings/range", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const fastings = await storage.getFastingsByUserIdAndDateRange(user.id, startDate, endDate);
      res.json(fastings);
    } catch (err) {
      res.status(500).json({ message: "Error fetching fasting records" });
    }
  });

  router.put("/fastings/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const fasting = await storage.updateFasting(id, req.body);
      
      if (!fasting) {
        return res.status(404).json({ message: "Fasting record not found" });
      }
      
      if (fasting.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(fasting);
    } catch (err) {
      res.status(500).json({ message: "Error updating fasting record" });
    }
  });

  // Quran reading routes
  router.post("/quran/readings", isAuthenticated, handleValidation(insertQuranReadingSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const reading = await storage.createQuranReading({
        ...req.body,
        userId: user.id,
      });
      res.status(201).json(reading);
    } catch (err) {
      res.status(500).json({ message: "Error creating Quran reading record" });
    }
  });

  router.get("/quran/readings", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const readings = await storage.getQuranReadingsByUserId(user.id);
      res.json(readings);
    } catch (err) {
      res.status(500).json({ message: "Error fetching Quran reading records" });
    }
  });

  router.get("/quran/readings/latest", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const reading = await storage.getLatestQuranReadingByUserId(user.id);
      
      if (!reading) {
        return res.status(404).json({ message: "No Quran reading record found" });
      }
      
      res.json(reading);
    } catch (err) {
      res.status(500).json({ message: "Error fetching latest Quran reading record" });
    }
  });

  router.put("/quran/readings/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const reading = await storage.updateQuranReading(id, req.body);
      
      if (!reading) {
        return res.status(404).json({ message: "Quran reading record not found" });
      }
      
      if (reading.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(reading);
    } catch (err) {
      res.status(500).json({ message: "Error updating Quran reading record" });
    }
  });

  // Achievement routes
  router.post("/achievements", isAuthenticated, handleValidation(insertAchievementSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const achievement = await storage.createAchievement({
        ...req.body,
        userId: user.id,
      });
      res.status(201).json(achievement);
    } catch (err) {
      res.status(500).json({ message: "Error creating achievement" });
    }
  });

  router.get("/achievements", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const achievements = await storage.getAchievementsByUserId(user.id);
      res.json(achievements);
    } catch (err) {
      res.status(500).json({ message: "Error fetching achievements" });
    }
  });

  router.put("/achievements/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const achievement = await storage.updateAchievement(id, req.body);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      if (achievement.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(achievement);
    } catch (err) {
      res.status(500).json({ message: "Error updating achievement" });
    }
  });

  // Community group routes
  router.post("/community/groups", isAuthenticated, handleValidation(insertCommunityGroupSchema), async (req, res) => {
    try {
      const group = await storage.createCommunityGroup(req.body);
      res.status(201).json(group);
    } catch (err) {
      res.status(500).json({ message: "Error creating community group" });
    }
  });

  router.get("/community/groups", async (req, res) => {
    try {
      const groups = await storage.getCommunityGroups();
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: "Error fetching community groups" });
    }
  });

  router.get("/community/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getCommunityGroupById(id);
      
      if (!group) {
        return res.status(404).json({ message: "Community group not found" });
      }
      
      res.json(group);
    } catch (err) {
      res.status(500).json({ message: "Error fetching community group" });
    }
  });

  // User group membership routes
  router.post("/community/memberships", isAuthenticated, handleValidation(insertUserGroupMembershipSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const membership = await storage.createUserGroupMembership({
        ...req.body,
        userId: user.id,
      });
      
      // Update group member count
      const group = await storage.getCommunityGroupById(req.body.groupId);
      if (group) {
        await storage.updateCommunityGroup(group.id, {
          memberCount: group.memberCount + 1,
        });
      }
      
      res.status(201).json(membership);
    } catch (err) {
      res.status(500).json({ message: "Error creating group membership" });
    }
  });

  router.get("/community/memberships/user", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const memberships = await storage.getUserGroupMembershipsByUserId(user.id);
      res.json(memberships);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user group memberships" });
    }
  });

  router.get("/community/memberships/group/:groupId", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const memberships = await storage.getUserGroupMembershipsByGroupId(groupId);
      res.json(memberships);
    } catch (err) {
      res.status(500).json({ message: "Error fetching group memberships" });
    }
  });

  router.delete("/community/memberships/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const membership = await storage.getUserGroupMembershipsByUserId(user.id)
        .then(memberships => memberships.find(m => m.id === id));
      
      if (!membership) {
        return res.status(404).json({ message: "Membership not found or not authorized" });
      }
      
      await storage.deleteUserGroupMembership(id);
      
      // Update group member count
      const group = await storage.getCommunityGroupById(membership.groupId);
      if (group && group.memberCount > 0) {
        await storage.updateCommunityGroup(group.id, {
          memberCount: group.memberCount - 1,
        });
      }
      
      res.json({ message: "Membership deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting membership" });
    }
  });

  // Challenge routes
  router.post("/challenges", isAuthenticated, handleValidation(insertChallengeSchema), async (req, res) => {
    try {
      const challenge = await storage.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (err) {
      res.status(500).json({ message: "Error creating challenge" });
    }
  });

  router.get("/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (err) {
      res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  router.get("/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallengeById(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (err) {
      res.status(500).json({ message: "Error fetching challenge" });
    }
  });

  router.put("/challenges/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.updateChallenge(id, req.body);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (err) {
      res.status(500).json({ message: "Error updating challenge" });
    }
  });

  // Offline sync routes
  router.post("/sync", isAuthenticated, handleValidation(insertOfflineSyncSchema), async (req, res) => {
    try {
      const user = req.user as any;
      const sync = await storage.createOfflineSync({
        ...req.body,
        userId: user.id,
      });
      res.status(201).json(sync);
    } catch (err) {
      res.status(500).json({ message: "Error creating sync record" });
    }
  });

  router.get("/sync/pending", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const syncs = await storage.getPendingOfflineSyncsByUserId(user.id);
      res.json(syncs);
    } catch (err) {
      res.status(500).json({ message: "Error fetching pending sync records" });
    }
  });

  router.put("/sync/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const sync = await storage.updateOfflineSync(id, {
        ...req.body,
        syncedAt: new Date(),
      });
      
      if (!sync) {
        return res.status(404).json({ message: "Sync record not found" });
      }
      
      if (sync.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(sync);
    } catch (err) {
      res.status(500).json({ message: "Error updating sync record" });
    }
  });

  // Quote routes
  router.get("/quotes/random", async (req, res) => {
    try {
      const quote = await storage.getRandomQuote();
      
      if (!quote) {
        return res.status(404).json({ message: "No quotes found" });
      }
      
      res.json(quote);
    } catch (err) {
      res.status(500).json({ message: "Error fetching random quote" });
    }
  });

  router.get("/quotes/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const quotes = await storage.getQuotesByCategory(category);
      res.json(quotes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching quotes by category" });
    }
  });

  // Mount the API routes
  app.use("/api", router);

  const httpServer = createServer(app);

  return httpServer;
}
