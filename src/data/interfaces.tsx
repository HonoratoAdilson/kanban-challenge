export interface User {
    id: number,
    name: string
}

export interface Card {
    title: string,
    tag: string,
    users: User[],
    completed: boolean
}


export interface Column {
    title: string,
    Cards: Card[]
}
