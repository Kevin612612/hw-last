import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { DatabaseService } from './database.service';

@Injectable()
export class FirestoreService implements DatabaseService {
    private firestore: Firestore;

    constructor() {
        this.firestore = new Firestore();
    }

    async findOne(collection: string, id: string): Promise<any> {
        const doc = await this.firestore.collection(collection).doc(id).get();
        return doc.exists ? doc.data() : null;
    }

    async findAll(collection: string): Promise<any[]> {
        const snapshot = await this.firestore.collection(collection).get();
        return snapshot.docs.map((doc) => doc.data());
    }

    async create(collection: string, data: any): Promise<any> {
        const docRef = await this.firestore.collection(collection).add(data);
        return { id: docRef.id, ...data };
    }

    async update(collection: string, id: string, data: any): Promise<any> {
        await this.firestore.collection(collection).doc(id).set(data, { merge: true });
        return { id, ...data };
    }

    async delete(collection: string, id: string): Promise<void> {
        await this.firestore.collection(collection).doc(id).delete();
    }
}
