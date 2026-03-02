export interface BadgeAdminRes {
  badgeId: number;
  name: string;
  description: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface BadgeAdminReq {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface BadgeDeleteRes {
  badgeId: number;
  deletedBy: string;
  deletedAt: string;
}

export interface MyBadgeItem {
  badgeId: number;
  name: string;
  description: string;
  imageUrl: string;
  isEquipped: boolean;
  acquiredAt: string;
}

export interface MyBadgeListResponse {
  badges: MyBadgeItem[];
}