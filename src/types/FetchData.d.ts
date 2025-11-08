interface PageEntity<T> {
  totalSize: number;
  data: T[];
}

interface Account {
  accountId: number;
  username: string;
  nickname: string;
  avatarUrl: string;
  status: number;
}

interface Role {
  roleId: number;
  roleName: string;
  roleNick: string;
  topicId: number;
  topicName: string;
  priority: number;
}

interface Thread {
  threadId: number;
  title: string;
  createTime: Date;
  accountId: number;
  accountName: string;
  topicId: number;
  topicName: string;
}

interface Topic {
  topicId: number;
  title: string;
  coverUrl: string;
  description: string;
  createTime: Date;
  isDeleted: boolean;
}

interface Theme {
  themeId: number;
  title: string;
  isDeleted: boolean;
}
