export type StudyGroupItem = {
  group_id: number;
  category: string;
  verify_methods: string[];
  title: string;
  member_count: number;
  max_members: number;
  verify_time: string;
  period: string;
  hashtags: string[];
  thumbnail_url: string;
};

export type StudyGroupResponse = {
  isSuccess: boolean;
  data: {
    page: number;
    size: number;
    total: number;
    items: StudyGroupItem[];
  };
};

export const studyGroupMock: StudyGroupResponse = {
  isSuccess: true,
  data: {
    page: 1,
    size: 20,
    total: 3,
    items: [
      {
        group_id: 101,
        category: 'WAKE',
        verify_methods: ['PHOTO', 'GPS'],
        title: '매일 6시 기상 인증',
        member_count: 7,
        max_members: 10,
        verify_time: '05:00~08:00',
        period: '2026-02-01~2026-02-28',
        hashtags: ['기상', '아침루틴'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail.png',
      },
      {
        group_id: 102,
        category: 'LANGUAGE',
        verify_methods: ['TODO'],
        title: '영어 회화 루틴',
        member_count: 4,
        max_members: 8,
        verify_time: '19:00~21:00',
        period: '2026-02-03~2026-03-10',
        hashtags: ['언어', '회화'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail2.png',
      },
      {
        group_id: 103,
        category: 'CODING_TEST',
        verify_methods: ['GITHUB', 'PHOTO'],
        title: '코테 30분 챌린지',
        member_count: 5,
        max_members: 10,
        verify_time: '21:00~23:00',
        period: '2026-02-05~2026-03-05',
        hashtags: ['코딩', '알고리즘'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail3.png',
      },
    ],
  },
};

const categoryMap: Record<string, string> = {
  WAKE: '기상',
  LANGUAGE: '언어',
  CODING_TEST: '코테',
  LICENSE: '자격증',
  SEATED: '착석',
  ETC: '기타',
};

const methodMap: Record<string, string> = {
  PHOTO: '사진',
  GPS: 'GPS',
  TODO: 'TODO',
  GITHUB: 'GitHub',
};

export const categoryOptions = Object.values(categoryMap);
export const methodOptions = Object.values(methodMap);

export const getStudyGroups = () => studyGroupMock.data.items;

export const formatCategory = (category: string) => categoryMap[category] ?? category;

export const formatMethods = (methods: string[]) =>
  methods.map((method) => methodMap[method] ?? method);

export const formatMembers = (count: number, max: number) => `${count}/${max}`;

export const formatVerifyTime = (timeRange: string) =>
  timeRange.replace('~', ' - ');

export const formatPeriod = (period: string) =>
  period.replace('~', ' - ').replace(/-/g, '. ');
