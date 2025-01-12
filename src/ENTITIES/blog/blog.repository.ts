import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Blog as BlogObject } from './blog.class';
import { BlogDataType, BlogDataViewType } from '../../types/blog';
import { BlogDTO, BlogUserBanDTO } from './dto/blogInputDTO';
import { SortDirectionEnum } from '../../dto/query.dto';

@Injectable()
export class BlogRepository {
	constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

	async createBlogId() {
		let blogId = 1;
		while (blogId) {
			const blog = await this.blogModel.findOne({ id: blogId.toString() });
			if (!blog) {
				break;
			}
			blogId++;
		}
		return blogId.toString();
	}

	async findAll(filter, sortBy: string, sortDirection: SortDirectionEnum): Promise<BlogDataViewType[]> {
		const order = sortDirection == SortDirectionEnum.asc ? 1 : -1;
		return await this.blogModel
			.find(filter)
			.sort({ [sortBy]: order })
			.select({ _id: 0, __v: 0 })
			.lean();
	}

	async countAllBlogs(filter) {
		return await this.blogModel.countDocuments(filter);
	}

	async createBlog(blogObject: BlogObject): Promise<BlogDataType> {
		const createdBlog = new this.blogModel(blogObject);
		return await createdBlog.save();
	}

	async getBlogById(blogId: string): Promise<BlogDataViewType | undefined> {
		return await this.blogModel.findOne({ id: blogId }).select({ _id: 0, __v: 0 }).lean();
	}

	async getBannedUsersOfBlogById(blogId: string): Promise<BlogDataType | undefined> {
		return await this.blogModel.findOne({ id: blogId }).lean();
	}

	async updateBlogById(blogId: string, blog: BlogDTO): Promise<number> {
		const result = await this.blogModel.updateOne(
			{ id: blogId },
			{
				$set: {
					name: blog.name,
					description: blog.description,
					websiteUrl: blog.websiteUrl,
				},
			},
		);
		return result.modifiedCount;
	}

	async deleteBlogById(blogId: string): Promise<number> {
		const result = await this.blogModel.deleteOne({ id: blogId });
		return result.deletedCount;
	}

	async deleteAll(): Promise<number> {
		const result = await this.blogModel.deleteMany({});
		return result.deletedCount;
	}

	async addOwner(blogId: string, userLogin: string, userId: string): Promise<number> {
		const result = await this.blogModel.updateOne(
			{ id: blogId },
			{
				$set: {
					'blogOwnerInfo.userId': userId,
					'blogOwnerInfo.userLogin': userLogin,
				},
			},
		);
		return result.modifiedCount;
	}

	async banBlog(blogId: string): Promise<boolean> {
		const result = await this.blogModel.findOneAndUpdate(
			{ id: blogId },
			{
				'banInfo.isBanned': true,
				'banInfo.banDate': new Date().toISOString(),
			},
		);
		return true;
	}

	async unbanBlog(blogId: string): Promise<boolean> {
		const result = await this.blogModel.findOneAndUpdate(
			{ id: blogId },
			{
				'banInfo.isBanned': false,
				'banInfo.banDate': null,
			},
		);
		return true;
	}

	async banUser(userId: string, userLogin: string, banDTO: BlogUserBanDTO): Promise<boolean> {
		console.log(banDTO);
		const result = await this.blogModel.findOneAndUpdate(
			{ id: banDTO.blogId },
			{
				$push: {
					usersBanInfo: {
						id: userId,
						login: userLogin,
						banInfo: {
							isBanned: true,
							banDate: new Date(),
							banReason: banDTO.banReason,
						},
					},
				},
			},
		);
		return true;
	}

	async unbanUser(userId: string, blogId: string): Promise<boolean> {
		const result = await this.blogModel.findOneAndUpdate(
			{ id: blogId },
			{
				$pull: { usersBanInfo: { id: userId } },
			},
		);
		return true;
	}
}
