import React, {ReactNode, useState, createContext, useContext} from 'react';
import { ColumnClass } from './models';
import { fetchData } from './data';


//Definição da interface de context do app
interface ContextInterface {
    columns: ColumnClass[],
    setColumns: React.Dispatch<React.SetStateAction<ColumnClass[]>>,
    draggedCardkey: number | null,
    setDraggedCardId: React.Dispatch<React.SetStateAction<number | null>>,
    dragSourceColumnKey: number | null,
    setDragSourceColumnKey: React.Dispatch<React.SetStateAction<number | null>>,
    showCardModal: boolean,
    setShowCardModal: React.Dispatch<React.SetStateAction<boolean>>,
    openCard: { cardKey: number, columnKey: number } | null,
    setOpenCard: React.Dispatch<React.SetStateAction<{ cardKey: number, columnKey: number } | null>>,
    cardModalType: 'add' | 'edit' | null,
    setCardModalType: React.Dispatch<React.SetStateAction<'add' | 'edit' | null>>,
    newCardColumnKey: number | null,
    setNewCardColumnKey: React.Dispatch<React.SetStateAction<number | null>>
}

const Context = createContext<ContextInterface | undefined>(undefined);
const Provider: React.FC<{ children: ReactNode }> = ({children}) =>{
    //Carregamento dos dados do JSON
    const data = fetchData();

    //Inicialização dos hooks com os dados que compõem a página
    const [columns, setColumns] = useState<ColumnClass[]>(data.columns);
    // const [cards, setCards] = useState<CardClass[]>(data.cards);
    // const [users] = useState<UserClass[]>(data.users);

    //Hook para controle do drag & drop
    const [draggedCardkey, setDraggedCardId] = useState<number | null>(null);
    const [dragSourceColumnKey, setDragSourceColumnKey] = useState<number | null>(null);

    //Hooks para controle do modal do card
    const [showCardModal, setShowCardModal] = useState<boolean>(false);
    const [openCard, setOpenCard] = useState<{ cardKey: number, columnKey: number } | null>(null)
    const [cardModalType, setCardModalType] = useState<'add' | 'edit' | null>(null)
    const [newCardColumnKey, setNewCardColumnKey] = useState<number | null>(null)

    //Componente provider do context, para encapsular o app
    return (
        <Context.Provider value={{ 
            columns, setColumns,
            draggedCardkey, setDraggedCardId,
            dragSourceColumnKey, setDragSourceColumnKey,
            showCardModal, setShowCardModal,
            openCard, setOpenCard,
            cardModalType, setCardModalType,
            newCardColumnKey, setNewCardColumnKey
        } }>
            {children}
        </Context.Provider>
    )
}
const GetContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('Context não encontrado');
    }
    return context;
};
export {Provider, GetContext as getContext};