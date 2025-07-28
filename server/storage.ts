import { 
  users, 
  bookings, 
  flights, 
  passengers, 
  chatMessages, 
  reviews,
  type User, 
  type InsertUser,
  type Booking,
  type InsertBooking,
  type Flight,
  type Passenger,
  type InsertPassenger,
  type ChatMessage,
  type InsertChatMessage,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lt, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Flight operations
  getFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  searchFlights(from: string, to: string, date: string): Promise<Flight[]>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking>;
  
  // Passenger operations
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  getBookingPassengers(bookingId: number): Promise<Passenger[]>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getGlobalChatMessages(limit?: number): Promise<ChatMessage[]>;
  getUserChatHistory(userId1: number, userId2: number): Promise<ChatMessage[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviews(limit?: number): Promise<Review[]>;
  getAverageRating(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Flight operations
  async getFlights(): Promise<Flight[]> {
    return await db.select().from(flights).orderBy(desc(flights.departureTime));
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const [flight] = await db.select().from(flights).where(eq(flights.id, id));
    return flight || undefined;
  }

  async searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return await db
      .select()
      .from(flights)
      .where(
        and(
          eq(flights.fromAirport, from),
          eq(flights.toAirport, to),
          and(
            gte(flights.departureTime, searchDate),
            lt(flights.departureTime, nextDay)
          )
        )
      )
      .orderBy(flights.departureTime);
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingReference, reference));
    return booking || undefined;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking> {
    const updates: any = { status, updatedAt: new Date() };
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Passenger operations
  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    const [newPassenger] = await db
      .insert(passengers)
      .values(passenger)
      .returning();
    return newPassenger;
  }

  async getBookingPassengers(bookingId: number): Promise<Passenger[]> {
    return await db
      .select()
      .from(passengers)
      .where(eq(passengers.bookingId, bookingId));
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values({
        ...message,
        createdAt: new Date(),
      })
      .returning();
    return chatMessage;
  }

  async getGlobalChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.isGlobal, true))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async getUserChatHistory(userId1: number, userId2: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.isGlobal, false),
          or(
            and(eq(chatMessages.userId, userId1), eq(chatMessages.recipientId, userId2)),
            and(eq(chatMessages.userId, userId2), eq(chatMessages.recipientId, userId1))
          )
        )
      )
      .orderBy(chatMessages.createdAt);
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values({
        ...review,
        createdAt: new Date(),
      })
      .returning();
    return newReview;
  }

  async getReviews(limit: number = 20): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.isVerified, true))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  async getAverageRating(): Promise<number> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.isVerified, true));
    
    if (result.length === 0) return 4.8; // Default high rating
    
    const total = result.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / result.length) * 10) / 10;
  }
}

export const storage = new DatabaseStorage();
