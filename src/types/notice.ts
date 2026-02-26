export interface NoticeListItem {
  notice_id: number;
  title: string;
  view_count: number;
}

export interface PageInfo {
  current_page: number;
  total_pages: number;
  total_elements: number;
  size: number;
}

export interface NoticeListResponse {
  notices: NoticeListItem[];
  page_info: PageInfo;
}

export interface NoticeDetail {
  notice_id: number;
  title: string;
  content: string;
  view_count: number;
}