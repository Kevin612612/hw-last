import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from 'mongoose';
import { DatabaseService } from './database.service';

// @Injectable()
// export class MongooseDatabaseService {
//     constructor(@InjectConnection() private connection: Connection) {}

//     getConnection() {
//         return this.connection;
//     }
// }

@Injectable()
export class MongooseDatabaseService implements DatabaseService {
    constructor(private readonly models: { [key: string]: Model<any> }) {}

    async findOne(collection: string, id: string): Promise<any> {
        const model = this.models[collection];
        if (!model) {
            throw new Error(`Model not found for collection: ${collection}`);
        }
        return model.findById(id).exec();
    }

    async findAll(collection: string): Promise<any[]> {
        const model = this.models[collection];
        if (!model) {
            throw new Error(`Model not found for collection: ${collection}`);
        }
        return model.find().exec();
    }

    async create(collection: string, data: any): Promise<any> {
        const model = this.models[collection];
        if (!model) {
            throw new Error(`Model not found for collection: ${collection}`);
        }
        return new model(data).save();
    }

    async update(collection: string, id: string, data: any): Promise<any> {
        const model = this.models[collection];
        if (!model) {
            throw new Error(`Model not found for collection: ${collection}`);
        }
        return model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(collection: string, id: string): Promise<void> {
        const model = this.models[collection];
        if (!model) {
            throw new Error(`Model not found for collection: ${collection}`);
        }
        await model.findByIdAndDelete(id).exec();
    }
}
