import { Types } from 'mongoose';

interface ConcertTicketMetadata {
  eventName?: string;
  eventDate?: Date;
  seat?: string;
}

interface MovieTicketMetadata {
  movieName?: string;
  showtime?: Date;
}

interface GamingAccountMetadata {
  game?: string;
  rank?: string;
  skins?: string[];
  platform?: string;
}

interface SocialMediaAccountMetadata {
  platform?: string;
  followers?: number;
}

interface ProductMetadata {
  concertTicket?: ConcertTicketMetadata;
  movieTicket?: MovieTicketMetadata;
  gamingAccount?: GamingAccountMetadata;
  socialMediaAccount?: SocialMediaAccountMetadata;
}

export interface Product {
  _id?: Types.ObjectId;
  sellerId: Types.ObjectId;
  type: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'available' | 'sold' | 'cancelled';
  category?: string;
  metadata?: ProductMetadata;
}