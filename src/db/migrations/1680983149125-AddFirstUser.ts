import { MigrationInterface, QueryRunner, Repository } from "typeorm"
import { User } from "src/modules/user/model/user.entity";
import * as bcrypt from 'bcrypt';

export class AddFirstUser1680983149125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository: Repository<User> = queryRunner.connection.getRepository(User);

        if (await userRepository.findOne({where: {login: 'shoker'}})) {
            return;
        }

        const user: User = userRepository.create({
            login: 'shoker',
            passwordHash: await bcrypt.hash('secret', 10),
            Name: 'Maxim',
            SecondName:'Golovin'
        });

        await userRepository.insert(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepository: Repository<User> = queryRunner.connection.getRepository(User);
        const user: User = await userRepository.findOne({where: {login: 'shoker'}});
        if (!user) {
            return;
        }

        await userRepository.remove(user);
    }

}
