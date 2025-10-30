import { Collaboration, News, Post, Subscriber } from "@prisma/client";

export type CollaborationDto = Omit<Collaboration, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type PostDto = Omit<Post, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type NewsDto = Omit<News, "createdAt" | "updatedAt" | "publishedAt"> & {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type SubscriberDto = Omit<Subscriber, "createdAt"> & {
  createdAt: string;
};
