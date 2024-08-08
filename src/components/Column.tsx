import React from 'react';
import styles from './../styles/Column.module.css';
import Card from './Card';
import {Card as CardInt} from '../data/interfaces';
import { getContext } from '../data/Context';
import AddIcon from './icons/AddIcon';

interface ColumnProps {
    title: string,
    Cards: CardInt[],
    ColumnKey: number
}


const Column: React.FC<ColumnProps> = (props) => {
    const { draggedCardkey, setColumns, dragSourceColumnKey, setDraggedCardId, setDragSourceColumnKey, setOpenCard, setCardModalType, setNewCardColumnKey, setShowCardModal } = getContext();
    //Hook disparado ao dropar o card na coluna
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnKey: number) => {
        e.preventDefault();
        if (draggedCardkey === null) return;

        setColumns(prevColumns => {

            if (dragSourceColumnKey === null) return prevColumns;
            const sourceColumn = prevColumns[dragSourceColumnKey]
            sourceColumn.moveCard(sourceColumn.Cards[draggedCardkey], prevColumns[columnKey])
            return prevColumns;
        });
        setDraggedCardId(null);
        setDragSourceColumnKey(null);

    };
    //Hook disparado para permitir que o card não fique travado e possa ser movido no drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    //Hook disparado para abrir a janela para criação de novo card
    const handleAdd = (e: React.MouseEvent<HTMLDivElement>, columnKey: number) => {
        e.stopPropagation();
        e.preventDefault();
        setCardModalType('add');
        setOpenCard(null);
        setNewCardColumnKey(columnKey);
        setShowCardModal(true);
    }

    //Definição do componente de Column
    return (
        <div className={styles.column} onDrop={(e) => handleDrop(e, props.ColumnKey)} onDragOver={handleDragOver}>
            <div className={styles.columnHeader}>
                <h3 className={styles.title}>{props.title}</h3>
                <div className={styles.addIcon} onClick={(e) => { handleAdd(e, props.ColumnKey) }}>
                    <AddIcon></AddIcon>
                </div>
            </div>
            <div className={styles.columnBody}>
                {
                    props.Cards.map((card, index) => (card)? (
                            <Card ColumnKey={props.ColumnKey} cardKey={index} key={index} title={card.title} tag={card.tag} completed={card.completed} users={card.users}></Card>
                        ):null
                    )
                }
            </div>
        </div>
    )
}


export default Column;