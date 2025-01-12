import { SortDirectionEnum } from '../../../dto/query.dto';

export const arrayOfBlogsDataType = [
	{
		_id: {
			$oid: '64f792cf7c31f8b290a12955',
		},
		id: '2',
		name: 'qqq',
		description: 'Anton',
		websiteUrl: 'https://samurai.it-incubator',
		createdAt: '2023-09-05T20:42:55.324Z',
		isMembership: false,
		blogOwnerInfo: {
			userId: '14',
			userLogin: 'anton',
		},
		banInfo: {
			isBanned: false,
			banDate: null,
		},
		usersBanInfo: [],
		__v: 0,
	},
	{
		_id: {
			$oid: '64f792cf7c31f8b290a12955',
		},
		id: '3',
		name: 'qqq',
		description: 'Anton',
		websiteUrl: 'https://samurai.it-incubator',
		createdAt: '2023-09-05T20:42:55.324Z',
		isMembership: false,
		blogOwnerInfo: {
			userId: '12',
			userLogin: 'anton',
		},
		banInfo: {
			isBanned: false,
			banDate: null,
		},
		usersBanInfo: [],
		__v: 0,
	},
	{
		_id: {
			$oid: '64f792cf7c31f8b290a12955',
		},
		id: '6',
		name: 'qqq',
		description: 'Anton',
		websiteUrl: 'https://samurai.it-incubator',
		createdAt: '2023-09-05T20:42:55.324Z',
		isMembership: false,
		blogOwnerInfo: {
			userId: '0',
			userLogin: 'anton',
		},
		banInfo: {
			isBanned: false,
			banDate: null,
		},
		usersBanInfo: [],
		__v: 0,
	},
];

export const defaultQuery = {
	sortBy: 'createdAt',
	sortDirection: SortDirectionEnum.desc,
	pageNumber: '1',
	pageSize: '10',
	searchNameTerm: null,
};
