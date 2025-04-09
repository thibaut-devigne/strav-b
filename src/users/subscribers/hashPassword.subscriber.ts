import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    beforeInsert(event: InsertEvent<User>) {
        const user = event.entity
        let hashedPassWord = bcrypt.hashSync(user.password, 10)
        user.password = hashedPassWord
    }
}