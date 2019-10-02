export class Product {
    constructor(
        public id: number,
        public productName: string,
        public category: string,
        public brand: string,
        public price: number,
        public description: string) {}

    iconClass() : string {
        let result = "fas fa-question-circle";
        switch(this.category) {
            case "Beer":
                result = result.replace("question-circle", "beer");
                break;
            case "Appliances":
                result = result.replace("question-circle", "blender");
                break;
            case "Coffee":
                result = result.replace("question-circle", "coffee");
                break;
            case "Books":
                result = result.replace("question-circle", "book-open");
                break;
            case "Music":
                result = result.replace("question-circle", "music");
                break;
        }
        return result;
    }

    searchTerms() : string[] {
        return this.description.match(/\b(\w+)\b/g);
    }
}