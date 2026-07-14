export interface TaskStatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  COMPLETED: number;
}

export interface TaskPriorityCounts {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}

export interface ProjectStatusCounts {
  PLANNING: number;
  ACTIVE: number;
  ON_HOLD: number;
  COMPLETED: number;
}

export interface UserRoleCount {
  role: string;
  count: number;
}

export interface RecentProject {
  id: string;
  name: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  createdAt?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    members: number;
    tasks: number;
  };
}

export interface RecentTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  project: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface DashboardNotification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: {
    summary: {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      totalProjects: number;
      activeProjects: number;
      completedProjects: number;
      totalTasks: number;
      activeTasks: number;
      completedTasks: number;
      completedToday: number;
      pendingTasks: number;
      overdueTasks: number;
      taskCompletionPercentage: number;
    };

    charts: {
      usersByRole: UserRoleCount[];
      projectsByStatus: ProjectStatusCounts;
      tasksByStatus: TaskStatusCounts;
      tasksByPriority: TaskPriorityCounts;
    };

    recentProjects: RecentProject[];

    recentUsers: Array<{
      id: string;
      name: string;
      email: string;
      status: string;
      createdAt: string;
      role: {
        id: string;
        name: string;
      };
    }>;
  };
}

export interface ManagerDashboardResponse {
  success: boolean;
  data: {
    summary: {
      totalProjects: number;
      activeProjects: number;
      completedProjects: number;
      totalTeamMembers: number;
      totalTasks: number;
      activeTasks: number;
      completedTasks: number;
      completedToday: number;
      inProgressTasks: number;
      overdueTasks: number;
      taskCompletionPercentage: number;
    };

    charts: {
      projectsByStatus: ProjectStatusCounts;
      tasksByStatus: TaskStatusCounts;
      tasksByPriority: TaskPriorityCounts;
    };

    recentProjects: RecentProject[];
    recentTasks: RecentTask[];
  };
}

export interface MemberDashboardResponse {
  success: boolean;
  data: {
    summary: {
      assignedProjects: number;
      totalTasks: number;
      activeTasks: number;
      todoTasks: number;
      inProgressTasks: number;
      inReviewTasks: number;
      completedTasks: number;
      completedToday: number;
      overdueTasks: number;
      unreadNotifications: number;
      taskCompletionPercentage: number;
    };

    charts: {
      tasksByStatus: TaskStatusCounts;
      tasksByPriority: TaskPriorityCounts;
    };

    upcomingTasks: RecentTask[];
    recentNotifications: DashboardNotification[];
  };
}