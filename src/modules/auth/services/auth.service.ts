import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "src/modules/admin/model/admin.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
    private adminRepository: Repository<Admin>;
    constructor(
        private jwtService:JwtService,
        @InjectDataSource() private dataSource: DataSource
        ){
            this.adminRepository = this.dataSource.getRepository(Admin)
    }
    async validateAdmin(login:string, pass:string):Promise<Admin>{
        const admin: Admin = await this.adminRepository.findOne({
            where:{
                login
            }
        });

        if (admin && await bcrypt.compare(pass,admin.passwordHash)) {
            const{passwordHash,...secureAdmin} = admin;
            return secureAdmin;
        }
        return null;
    }
    async login(admin:Admin){
        const payload = {id:admin.id};
        return{
           accessToken: this.jwtService.sign(payload)
        }
    }
}