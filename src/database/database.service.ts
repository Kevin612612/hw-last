import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DatabaseService {
    abstract findOne(collection: string, id: string): Promise<any>;
    abstract findAll(collection: string): Promise<any[]>;
    abstract create(collection: string, data: any): Promise<any>;
    abstract update(collection: string, id: string, data: any): Promise<any>;
    abstract delete(collection: string, id: string): Promise<void>;
}
