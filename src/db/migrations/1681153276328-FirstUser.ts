import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { UserEntity } from "src/modules/user/model/user.entity"

export class FirstUser1681153276328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository: Repository<UserEntity> = queryRunner.connection.getRepository(UserEntity);
        if (await userRepository.findOne({where: {mail: 'masjanja24122002@mail.ru'}})) {
            return;
        }

        const user: UserEntity = userRepository.create({
            mail: 'masjanja24122002@mail.ru',
            password: 'topg',
            name: 'Максим',
            secondname: 'Головин'
        });

        await userRepository.insert(user);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepository: Repository<UserEntity> = queryRunner.connection.getRepository(UserEntity);
        const user: UserEntity = await userRepository.findOne({where: {mail: 'masjanja241222002@mail.ru'}});
        if (!user) {
            return;
        }

        await userRepository.remove(user);


    }

}
