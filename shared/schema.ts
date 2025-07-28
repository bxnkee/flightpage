import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with enhanced fields for authentication and profile
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default("en"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Flights table for booking system
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  airline: text("airline").notNull(),
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  aircraft: text("aircraft").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR"),
  availableSeats: integer("available_seats").notNull(),
  class: text("class").notNull(), // economy, business, first
  duration: text("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  flightId: integer("flight_id").references(() => flights.id),
  bookingReference: text("booking_reference").notNull().unique(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, confirmed, cancelled
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
  paymentMethod: text("payment_method"), // card, paypal, klarna, cash
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Passengers table for booking details
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  title: text("title").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  nationality: text("nationality").notNull(),
  passportNumber: text("passport_number"),
  email: text("email").notNull(),
  phone: text("phone"),
});

// Chat messages for customer communication
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isGlobal: boolean("is_global").default(true), // true for global chat, false for direct messages
  recipientId: integer("recipient_id").references(() => users.id), // for direct messages
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews/ratings for trust indicators
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  chatMessages: many(chatMessages),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  flight: one(flights, {
    fields: [bookings.flightId],
    references: [flights.id],
  }),
  passengers: many(passengers),
  review: one(reviews),
}));

export const flightsRelations = relations(flights, ({ many }) => ({
  bookings: many(bookings),
}));

export const passengersRelations = relations(passengers, ({ one }) => ({
  booking: one(bookings, {
    fields: [passengers.bookingId],
    references: [bookings.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  recipient: one(users, {
    fields: [chatMessages.recipientId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Flight = typeof flights.$inferSelect;
export type Passenger = typeof passengers.$inferSelect;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
