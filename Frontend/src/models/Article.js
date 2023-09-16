
export class Article  {
    type;
    name;
    price;
    description;
    imageName;
    imageSrc;
    imageFile;
    email;
    articleId;


    constructor(name, description, type, price,imageName, imageSrc, imageFile, email, id) {
        this.name = name
        this.type = type
        this.description=description
        this.price = price
        this.imageName = imageName
        this.imageSrc = imageSrc
        this.imageFile = imageFile
        this.email = email
        this.articleId = id
    }
}