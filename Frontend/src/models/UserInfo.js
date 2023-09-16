import {formatDate} from "../services/actions/common"
export class UserInfo  {
   username;
   fullName;
   email;
   password;
   imageSrc;
   imageName;
   birthday;
   address;
   role;
   token;
   verified;
   userId;


   constructor(username,name,email,password,image,birthday,address, role, token, verified, id) {
       this.username = username;
       this.fullName = name;
       this.email = email;
       this.password = password;
       this.imageSrc = image;
       this.birthday = formatDate(birthday);
       this.address = address;
       this.role = role;
       this.token= token;
       this.verified = verified;
       this.userId = id
   }


}


