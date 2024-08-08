import { User, Card, Column } from './interfaces';

export class UserClass implements User {
    constructor(
        public id: number,
        public name: string
    ) { }
}

export class CardClass implements Card {
    constructor(
        public title: string,
        public tag: string,
        public users: User[],
        public completed: boolean
    ) { }

    setTitle(title: string) {
        this.title = title
    }

    setTag(tag: string){
        this.tag = tag
    }

    setUsers(users: User[]){
        this.users = users;
    }

    setCompleted(completed: boolean){
        this.completed = completed
    }
}

export class ColumnClass implements Column {
    public Cards: CardClass[] = [];
    constructor(
        public title: string
    ) { }

    addCard(card: CardClass) {
        this.Cards.push(card);
    }

    moveCard(card: CardClass, targetColumn: ColumnClass) {
        //Atualiza os cards das colunas, ignorando o card passado no parâmetro
        this.Cards = this.Cards.filter(c => c !== card);
        if(card) targetColumn.addCard(card);
    }

    deleteCard(cardKey: number){
        this.Cards.splice(cardKey, 1)
    }

    toggleCardComplete(cardKey: number){
        const card = this.Cards[cardKey];
        card.completed = !card.completed;
    }
}
