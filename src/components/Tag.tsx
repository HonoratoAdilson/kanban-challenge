import styles from './../styles/Tag.module.css';

const tagDescriptions: { [key in TagProps['type']]: string } = {
    pending: 'PENDENTE',
    bug: 'BUG',
    error: 'ERRO',
    update: 'ATUALIZAÇÃO',
    review: 'REVISÃO',
    finished: 'FINALIZADO'
}

interface TagProps {
    type: string;
}


const Tag: React.FC<TagProps> = (props) => {
    return(
        <div className={`${styles.tag} ${styles[props.type]}`}>
            <span>{tagDescriptions[props.type]}</span>
        </div>
    )
}

export default Tag;

