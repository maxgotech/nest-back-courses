import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/modules/user/model/user.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
    private userRepository: Repository<User>;
    constructor(
        private jwtService:JwtService,
        @InjectDataSource() private dataSource: DataSource
        ){
            this.userRepository = this.dataSource.getRepository(User)
    }
    async validateUser(login:string, pass:string):Promise<User>{
        const user: User = await this.userRepository.findOne({
            where:{
                login
            }
        });

        if (user && await bcrypt.compare(pass,user.passwordHash)) {
            const{passwordHash,...secureUser} = user;
            return secureUser;
        }
        return null;
    }
    async login(user:User){
        const payload = {id:user.id};
        return{
           accessToken: this.jwtService.sign(payload)
        }
    }
}