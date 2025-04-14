export   interface Product {
    _id: string;
    sellerId: string; // Reference to User
    type: "concert_ticket" | "movie_ticket" | "gaming_account" | "social_media_account";
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    status: "available" | "sold" | "cancelled";
    category?: string; // Optional
  
    metadata?: {
      concertTicket?: {
        eventName?: string;
        eventDate?: string;
        seat?: string;
      };
      movieTicket?: {
        movieName?: string;
        showtime?: string;
      };
      gamingAccount?: {
        game?: string;
        rank?: string;
        skins?: string[];
        platform?: string;
      };
      socialMediaAccount?: {
        platform?: string;
        followers?: number;
      };
    };
  }
  