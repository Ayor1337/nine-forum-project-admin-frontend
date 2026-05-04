interface PageEntity<T> {
  totalSize: number;
  data: T[];
}

// AccountVO - 用户详情
interface AccountVO {
  accountId: number;
  username: string;
  nickname: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  status: number;
  isDeleted: boolean;
}

// AccountDTO - 更新用户
interface AccountDTO {
  accountId: number;
  status?: number;
  roleId?: number;
  isDeleted?: boolean;
}

// 创建用户
interface CreateAccountPayload {
  username: string;
  password: string;
  nickname: string;
  avatarUrl?: string;
  bannerUrl?: string;
  status?: number;
  roleId?: number;
  email?: string;
}

interface UserBroadcastPayload {
  title: string;
  message: string;
  sendTo: number;
}

// RoleDTO
interface Role {
  roleId: number;
  roleName: string;
  roleNick: string;
  priority: number;
  topicId: number;
}

// ThreadTableVO - 帖子列表
interface ThreadTableVO {
  threadId: number;
  title: string;
  createTime: Date;
  tagName: string;
  accountId: number;
  accountName: string;
  topicId: number;
  topicName: string;
  isDeleted: boolean;
}

// ThreadDTO - 帖子详情
interface ThreadDTO {
  threadId: number;
  title: string;
  content: string;
  createTime: Date;
  updateTime: Date;
  viewCount: number;
  postCount: number;
  likeCount: number;
  collectCount: number;
  topicId: number;
  tagId: number;
  accountId: number;
  isMuted: boolean;
  isSelected: boolean;
  isDeleted: boolean;
  isAnnouncement: boolean;
}

// TopicDTO
interface Topic {
  topicId: number;
  title: string;
  coverUrl: string;
  description: string;
  createTime: Date;
  themeId: number;
  isDeleted: boolean;
}

// ThemeDTO
interface Theme {
  themeId: number;
  title: string;
  isDeleted: boolean;
}

// PermissionVO
interface Permission {
  permissionId: number;
  roleId: number;
  permission: string;
}

// TagVO
interface Tag {
  tagId: number;
  tag: string;
  createTime: Date;
  topicId: number;
}

// Post - 回复
interface Post {
  postId: number;
  content: string;
  accountId: number;
  createTime: Date;
  updateTime: Date;
  threadId: number;
  topicId: number;
  isDeleted: boolean;
}

// LikeThreadVO
interface Like {
  likeId: number;
  accountId: number;
  threadId: number;
}

// CollectVO
interface Collect {
  collectId: number;
  accountId: number;
  threadId: number;
}

// ConversationVO
interface Conversation {
  conversationId: number;
  alphaAccountId: number;
  betaAccountId: number;
  createTime: Date;
  updateTime: Date;
  isDeleted: boolean;
  hidden: number;
}

// ConversationMessageVO
interface ConversationMessage {
  conversationMessageId: number;
  conversationId: number;
  content: string;
  accountId: number;
  createTime: Date;
  updateTime: Date;
  isDeleted: boolean;
  isEdit: boolean;
}

// TopicChatVO
interface TopicChat {
  topicChatId: number;
  topicId: number;
  accountId: number;
  content: string;
  createTime: Date;
}

// ChatboardHistoryVO
interface ChatboardHistory {
  chatboardHistoryId: number;
  accountId: number;
  topicId: number;
  content: string;
  createTime: Date;
}

// HistoryVO
interface History {
  historyId: number;
  threadId: number;
  accountId: number;
  createTime: Date;
}

// ReportVO - 举报详情
interface ReportVO {
  reportId: number;
  reporterAccountId: number;
  reportedAccountId: number;
  targetType: string;
  targetId: number;
  reportType: string;
  description: string;
  status: string;
  handlerAccountId: number | null;
  handleNote: string | null;
  handledAt: string | null;
  reportedUsernameSnapshot: string | null;
  targetSummarySnapshot: string | null;
  createTime: string;
  updateTime: string;
}

// ReportHandleDTO - 举报处理请求体
interface ReportHandleDTO {
  status: string;
  handleNote?: string;
  accountAction?: string;
}

// AccountStatVO
interface AccountStat {
  userStatId: number;
  threadCount: number;
  postCount: number;
  replyCount: number;
  likedCount: number;
  collectedCount: number;
  followingCount: number;
  followerCount: number;
  accountId: number;
}

// TopicStatVO
interface TopicStat {
  topicStatId: number;
  topicId: number;
  threadCount: number;
  viewCount: number;
}

export type {
  PageEntity,
  AccountVO,
  AccountDTO,
  CreateAccountPayload,
  UserBroadcastPayload,
  Role,
  ThreadTableVO,
  ThreadDTO,
  Topic,
  Theme,
  Permission,
  Tag,
  Post,
  Like,
  Collect,
  Conversation,
  ConversationMessage,
  TopicChat,
  ChatboardHistory,
  History,
  AccountStat,
  TopicStat,
  ReportVO,
  ReportHandleDTO,
};
