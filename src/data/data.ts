import { UserClass as User, CardClass as Card, ColumnClass as Column } from './models';
import json from './data.json';

//Definição da tipagem dos dados vindo do JSON
export interface UserData {
    id: number;
    name: string;
    profilePicture: string;
}

export interface CardData {
    title: string;
    tag: string;
    users: number[];
    completed: boolean;
}

export interface ColumnData {
    title: string;
    cards: number[]; // Índices dos cartões
}

export interface Data {
    users: UserData[];
    cards: CardData[];
    columns: ColumnData[];
}


// Função para converter IDs de usuário em instâncias de UserClass
function fetchUsers(usersData: UserData[]): User[] {
    return usersData.map(user => new User(user.id, user.name));
}

// Função para converter dados de Card em instâncias de CardClass
function fetchCards(cardsData: CardData[],  users: User[]): Card[] {
    return cardsData.map(card => {
        const cardUsers: User[] = card.users.map((userId: number) => users.find(user => user.id === userId) as User);
        return new Card(card.title, card.tag, cardUsers, card.completed);
    });
}

// Função para converter dados de Column em instâncias de ColumnClass
function fetchColumns(columnsData: ColumnData[], cards: Card[]): Column[] {
    return columnsData.map(column => {
        const columnCards: Card[] = column.cards.map((cardIndex: number) => cards[cardIndex]);
        const columnClass = new Column(column.title);
        columnCards.forEach(card => columnClass.addCard(card));
        return columnClass;
    });
}

// Função principal para converter todo o JSON em instâncias de classes
export function fetchData() {
    const data: Data = json as Data;
    const users = fetchUsers(data.users);
    const cards = fetchCards(data.cards, users);
    const columns = fetchColumns(data.columns, cards);
    return { users, cards, columns };
}
