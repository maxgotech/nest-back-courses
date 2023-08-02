import { UserEntity } from '../model/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { toUserDto } from 'src/shared/mapper';
import { LoginUserDto } from '../dto/user-login.dto';
import { CreateUserDto } from '../dto/user-create.dto';
import { comparePasswords } from 'src/shared/utils';
import { CreateUserFolderDto } from '../dto/user-folder.dto';

@Injectable()
export class UserService {
constructor( @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity> ) {}

    async findOne(options?: object): Promise<UserDto> {
        const user =  await this.userRepo.findOne(options);    
        return toUserDto(user);  
    }

    async findByMail({ mail, password }: LoginUserDto): Promise<UserDto> {    
        const user = await this.userRepo.findOne({ where: { mail } });
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
        }
        
        // compare passwords    
        const areEqual = await comparePasswords(user.password, password);
        
        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
        }
        
        return toUserDto(user);  
    }

    async findByPayload({ mail }: any): Promise<UserDto> {
        return await this.findOne({ 
            where:  { mail } });  
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {    
        const { mail, password, name, secondname  } = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({ 
            where: { mail } 
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: UserEntity = await this.userRepo.create({ mail, password, name, secondname });
        await this.userRepo.save(user);
        return toUserDto(user);  
    }

    async UserDatabyMail({ mail }: UserDto): Promise<UserDto> {    
        const user = await this.userRepo.findOne({ where: { mail } });
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
        }
        
        return toUserDto(user);  
    }

    async createUserFolder(createUserFolder:CreateUserFolderDto){
        const fs = require('fs');
        const folderName = "users/" + createUserFolder.name;

        try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        } catch (err) {
        console.error(err);
        }
        return folderName
    }

}
