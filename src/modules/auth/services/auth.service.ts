import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "src/modules/admin/model/admin";
import { AdminRepository } from "src/modules/admin/services/admin.repository";

@Injectable()
export class AuthService{
    constructor(
        private adminRepository:AdminRepository,
        private jwtService:JwtService
        ){
    }

    async validateAdmin(login:string, pass:string):Promise<Admin>{
        const admin: Admin = await this.adminRepository.FindByLogin(login);

        if (admin && admin.password === pass) {
            const{password,...secureAdmin} = admin;
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