import React, {useEffect, useRef, useState} from 'react';
import styles from './../styles/CardModal.module.css'
import { getContext } from './../data/Context'
import Tag from './Tag';
import { fetchData } from './../data/data';
import { CardClass, UserClass } from './../data/models';
import TrashIcon from './icons/TrashIcon';

const CardModal: React.FC = () => {
    //Definição do state para controle do modo do input/span do titulo do modal
    const [titleState, setTitleState] = useState<'text'|'input'>('text')
    
    //Obtendo hooks do contexto
    const { columns, setColumns, showCardModal, setShowCardModal, openCard, setOpenCard, cardModalType, setCardModalType, newCardColumnKey, setNewCardColumnKey } = getContext();


    //Definição de state para os valores de novo card
    const [newCard, setNewCard] = useState<CardClass>(new CardClass('', '', [] as UserClass[], false))
    
    //Obtenção do objeto do card. Caso editando, procura o card que foi clicado para ser aberto. Usa um novo card como fallback
    const [currentCard, setCurrentCard] = useState<CardClass>(cardModalType === 'edit' && openCard ? columns[openCard.columnKey].Cards[openCard.cardKey] : newCard);
    
    
    //Garante que o currentCard sempre estará atualizado
    useEffect(() => {
        setCurrentCard(cardModalType === 'edit' && openCard ? columns[openCard.columnKey].Cards[openCard.cardKey] : newCard)
    }, [openCard, cardModalType, columns, newCard])

    //Definição de hook customizado para identificar evento de click/touch disparado fora do modal, para fechar ao clicar fora
    const useOutsideClick = (cb: () => void) => {
        //Definição da ref do modal
        const modalref = useRef<HTMLDivElement>(null);
        useEffect(() => {
            //Função para lidar com o click fora do modal, chamando o callback somente quando o alvo do click não for o modal referenciado
            const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
                if (modalref.current && !modalref.current.contains(event.target as Node)){
                    cb();
                    //Resetando as propiedades de novo card
                    setNewCard(() => (new CardClass('', '', [] as UserClass[], false)));
                    //Resetando a chave da coluna do novo card
                    setNewCardColumnKey(() => null);
                    //Resetando o tipo de card
                    setCardModalType(() => null);
                }
            }
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('touchstart', handleOutsideClick);
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
                document.removeEventListener('touchstart', handleOutsideClick);
            }
        }, [cb]);
        return modalref;
    }
    //Callback disparado quando for dado o comando para fechar o modal
    const closeModalCb = () => {
        setShowCardModal(false)
        if (cardModalType === 'add' && typeof newCardColumnKey === 'number'){
            setColumns((prev) => {
                const cols = prev;
                cols[newCardColumnKey].Cards.push(new CardClass(newCard.title, newCard.tag, newCard.users, newCard.completed))
                return cols;
            })
            //Resetando as propiedades de novo card
            setNewCard(() => (new CardClass('', '', [] as UserClass[], false)));
        }
        //Reseta o campo de busca de usuários
        setUserSearchParam('');
        //
        setSelectedUsers([]);
        //Resetando a chave da coluna do novo card
        setNewCardColumnKey(() => null);
        //Resetando o tipo de card
        setCardModalType(() => null);
        //Reseta o dropdown
        setTagDropdownOpen(false);
        //Reseta a tag selecionada no modal
        setSelectedTag(undefined);
        //Reseta o valor de openCard
        setOpenCard(null)
    }
    //Handler para lidar com a mudança de elemento quando se está editando/visualizando o titulo do card no modal
    const handleTitleStateChange = (e: React.MouseEvent<HTMLSpanElement> | React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        if(titleState === 'text'){
            setTitleState('input')
            return;
        } 
        setTitleState('text')
    }
    //Função para lidar com a atualização de valor do input de titulo
    const handleTitleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.stopPropagation()
        if (cardModalType === 'edit' && openCard) {
            setColumns((prev) => {
                const cols = prev;
                cols[openCard.columnKey].Cards[openCard.cardKey].setTitle(e.currentTarget.value);
                currentCard?.setTitle(e.currentTarget.value);
                return cols;
            });
            return;
        }
        //Fallback, executado caso esteja criando um novo card
        const v = e.currentTarget.value;
        setNewCard((prev) => {            
            const card = prev;
            card.setTitle(v);
            return card;
        })
    }
    
    //Definição de Ref de textarea de titulo (exibido quando editando o titulo)
    const titleTextAreaRef = useRef<HTMLTextAreaElement>(null)

    //Definição de hook para ajustar a altura do textarea de titulo
    const autoResizeTitleTextArea = () => {
        if (titleTextAreaRef.current){
            titleTextAreaRef.current.style.height = "inherit";
            titleTextAreaRef.current.style.height = `${titleTextAreaRef.current.scrollHeight}px`;
        }
    }
    
    //Aplicando o hook para resize do textarea
    useEffect(autoResizeTitleTextArea);

    //Aplicando o hook para atualizar a tag selecionada
    useEffect(() => { setSelectedTag(currentCard?.tag) }, [currentCard?.tag])

    //Definição de State para o dropdown de tags
    const [selectedTag, setSelectedTag] = useState<string | undefined>(currentCard?.tag);
    const [tagDropdownOpen, setTagDropdownOpen] = useState<boolean>(false);

    //Função usada ao selecionar um item no dropdown
    const handleDropdownOptionClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, value: string) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedTag(value);
        setTagDropdownOpen(false);
        if(cardModalType === 'edit' && openCard){
            setColumns((prev) => {
                const cols = prev;
                cols[openCard.columnKey].Cards[openCard.cardKey].setTag(value);
                currentCard?.setTag(value);
                return cols;
            });
            return;
        }
        setNewCard(prev => {
            const card = prev;
            card.setTag(value)
            return card
        })
        
    }
    
    const [selectedUsers, setSelectedUsers] = useState<UserClass[]>(currentCard.users)
    
    //Aplicando o hook para atualizar os usuarios do card
    useEffect(() => {setSelectedUsers(currentCard?.users)}, [currentCard.users])
    
    //Função para lidar com o click para deletar o usuario do card
    const handleUserDelete = (e: React.MouseEvent | React.TouchEvent, user: UserClass) => {
        e.stopPropagation();
        e.preventDefault();
        const users = currentCard.users.filter((usr) => usr!==user)
        setCurrentCard(prev => {
            const card = prev
            card.setUsers(users);
            return card
        })
        setSelectedUsers(users)
    }
    
    //Definição dos states para o parametro de busca e resultados da busca
    const [userSearchResults, setUserSearchResults] = useState<UserClass[]>([] as UserClass[])
    const [userSearchParam, setUserSearchParam] = useState<string>('');

    //Função para lidar quando o usuário é selecionado para fazer parte do card
    const handleUserSelect = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, selected: UserClass) => {
        e.stopPropagation();
        e.preventDefault();
        const cardUsers = currentCard.users;
        cardUsers.push(selected);
        currentCard.setUsers(cardUsers);
        setSelectedUsers(cardUsers);
        setUserSearchParam('');
    }

    
   
    //Definição de hook para realizar a busca quando o parametro for atualizado
    useEffect(() => {
        const { users } = fetchData();
        const results = [] as UserClass[];

        setUserSearchResults(() => {
            users.forEach(u => {
                //Só retorna o usuário pra ser selecionado se for digitado algo na busca,
                //se for encontrado o trecho no nome do usuário e se o usuário não estiver selecionado no card
                if (userSearchParam && (u.name.toLowerCase().includes(userSearchParam.toLowerCase()) && selectedUsers.filter((usr) => (usr.name === u.name)).length === 0)) {
                    results.push(u)
                }
            });
            return results
        })
     }, [userSearchParam, selectedUsers])   //Hook executado sempre que a busca ou os usuários selecionados forem atualizados


    // const [isComplete, setIsComplete] = useState<boolean>(false);

    // useEffect(()=>{
    //     console.log(currentCard.completed)
    //     setIsComplete(currentCard.completed)
    // },[currentCard])
    //Função para lidar com o click de completar o card
    // const handleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     e.preventDefault();
    //     setCurrentCard(prev => {
    //         const card = prev;
    //         card.setCompleted(!card.completed);
    //         return card
    //     })
    // }

    //Handler disparado ao clicar para deletar o card
    const handleDelete = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, card: {cardKey: number, columnKey:number} | null) => {
        e.preventDefault();
        e.stopPropagation();
        if(card){
            setColumns(prevColumns => {
                const cols = [...prevColumns]
                cols[card.columnKey].deleteCard(card.cardKey);
                return cols;
            })
            closeModalCb()
        }
    }

    //Definição do componente do modal
    return (
        <div className={`${showCardModal ? styles.modalBackground : styles.closedModal}`}>
            <div className={styles.cardModal} ref={useOutsideClick(closeModalCb)}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle} onClick={(e) => { if (titleState === 'text')handleTitleStateChange(e) }}>
                        {titleState === 'text'? (
                            <span className={styles.titleSpan}>{(cardModalType === 'add' || !currentCard.title)? <span className={styles.mutedTitle}>Insira aqui um título...</span> : currentCard?.title}</span>
                        ):(
                            <textarea ref={titleTextAreaRef} autoFocus spellCheck={false} className={styles.modalTitleInput}
                            defaultValue={cardModalType === 'add' ? newCard.title : currentCard?.title}
                            onBlur={(e) => { handleTitleStateChange(e); handleTitleUpdate(e) }}
                            onChange={(e) => { handleTitleUpdate(e)}} 
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter'){
                                    handleTitleUpdate(e); handleTitleStateChange(e)
                                }
                                autoResizeTitleTextArea()
                            }}
                                
                            />
                        )}
                    </div>
                    {
                        (cardModalType === 'edit')?(
                            <div className={styles.trashIcon} onClick={(e) => handleDelete(e, openCard)}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="16px" height="16px" viewBox="0 0 490.646 490.646"
                                    xmlSpace="preserve">
                                    <g>
                                        <g>
                                            <path d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285zM198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z" />
                                            <path d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372zM237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        ):''
                    }
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.tagSelectorWrap}>
                        <div className={styles.tagSelector}>
                            <div className={(tagDropdownOpen || !selectedTag) ? `${styles.selectedTag} ${styles.dropdownActive}` : styles.selectedTag} onClick={(e) => { (tagDropdownOpen) ? setTagDropdownOpen(false) : setTagDropdownOpen(true) }}>
                                <Tag type={(selectedTag)?selectedTag:''}></Tag>
                            </div>
                            <div className={tagDropdownOpen ? `${styles.tagOptions} ${styles.dropdownActive}` : styles.tagOptions}>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'pending')}}><Tag type='pending'></Tag></div>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'bug')}}><Tag type='bug'></Tag></div>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'error')}}><Tag type='error'></Tag></div>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'update')}}><Tag type='update'></Tag></div>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'review')}}><Tag type='review'></Tag></div>
                                <div onClick={(e) => { handleDropdownOptionClick(e, 'finished')}}><Tag type='finished'></Tag></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.userSelector}>
                        <div className={styles.selectedUsers}>
                            {
                                selectedUsers.map((usr, idx) => (
                                    <div key={idx} className={styles.userSelectorWrapper} onClick={(e) => { handleUserDelete(e, usr)}}>
                                        <div className={styles.userProfilePicture}>
                                            {usr.name[0]}
                                        </div>
                                        <div className={styles.userName}>
                                            {usr.name}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.userList}>
                            <input type="text" value={userSearchParam} placeholder='Pesquisar um usuário' onChange={(e) => { setUserSearchParam(e.currentTarget.value) }} className={styles.userSearch}/>
                        </div>
                        <div className={styles.searchList}>
                            {
                                userSearchResults.map((res, idx) => (
                                    <div key={idx} className={styles.userSelectorWrapper} onClick={(e) => { handleUserSelect(e, res) }}>
                                        <div className={styles.userProfilePicture}>
                                            {res.name[0]}
                                        </div>
                                        <div className={styles.userName}>
                                            {res.name}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {CardModal};