import styles from './../styles/Card.module.css';
import Tag from './Tag';
import {User as UserProps} from './../data/interfaces';
import { getContext } from './../data/Context';
import TrashIcon from './icons/TrashIcon';
export interface CardProps {
    cardKey: number,
    title: string,
    tag: string,
    users: UserProps[],
    ColumnKey: number,
    completed: boolean
}
const Card: React.FC<CardProps> = (props) =>{
    const { setDraggedCardId, setDragSourceColumnKey, setColumns, setShowCardModal, setOpenCard, setCardModalType } = getContext();
    //Handler disparado ao começar a arrastar
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number, sourceColumnKey: number) => {
        setDraggedCardId(id);
        setDragSourceColumnKey(sourceColumnKey);
    };
    const handleComplete = (e: React.ChangeEvent<HTMLInputElement>, columnKey: number, cardKey: number) => {
        setColumns(prevColumns => {
            const cols = [...prevColumns]
            cols[columnKey].toggleCardComplete(cardKey);
            return cols
        })
    }
    //Handler disparado ao clicar para deletar um card
    const handleDelete = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, cardKey: number, columnKey: number) => {
        e.preventDefault();
        e.stopPropagation();
        setColumns(prevColumns => {
            const cols = [...prevColumns]
            cols[columnKey].deleteCard(cardKey);
            return cols;
        })
    }
    //Handler disparado para abrir o card em questão
    const handleOpen = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, cardKey:number, columnKey: number) => {
        e.preventDefault();
        setShowCardModal(true);
        setCardModalType('edit');
        setOpenCard({cardKey, columnKey})
    }
    return(
        <div className={`${styles.card} ${(props.completed) ? styles.completed : ''}`} draggable onDragStart={(e) => handleDragStart(e, props.cardKey, props.ColumnKey)} onClick={(e) => handleOpen(e, props.cardKey, props.ColumnKey)}>
            <div className={styles.cardHeader}>
                <Tag type={props.tag}></Tag>
                <div className={styles.trashIcon} onClick={(e) => handleDelete(e, props.cardKey, props.ColumnKey)}>
                    <TrashIcon></TrashIcon>
                </div>
            </div>
            <input type="checkbox" className={styles.completeChk} checked={props.completed} onChange={(e) => { handleComplete(e, props.ColumnKey, props.cardKey) }} onClick={(e) => {e.stopPropagation();}} />
            <span className={styles.title}>{props.title}</span>
            <div className={styles.cardFooter}>
                <div className={styles.users}>
                    {
                        props.users.map((user, index) => (
                            <div className={styles.userIcon} key={index}>
                                {user.name[0]}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Card;