export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read?: boolean;
};

export type Conversation = {
  id: string;
  name?: string;
  participantIds: string[];
  lastUpdatedAt?: string;
};
