import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from "@ionic/react";
import { pencil, refresh, trash } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";

export interface ItemProps {
    id: string; 
    title: string; 
    date: Date; 
}

interface EventItemProps extends ItemProps {
    onDelete: (props: ItemProps) => void
    onEdit: (props: ItemProps) => void
}

const EventItem: React.FC<EventItemProps> = ({id, title, date, onDelete, onEdit}) => {
    const getDateDiff = useCallback(
        () => Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)),
        [date]
    );
    
    const [dateDiff, setDateDiff] = useState(getDateDiff());

    useEffect(() => {
        const interval = setInterval(
            () => setDateDiff(getDateDiff()),
            1000
        );

        return () => clearInterval(interval);
    }, [getDateDiff, setDateDiff]);

    const onEditCallback = useCallback(() => {
        setDateDiff(0);
        onEdit({id, title, date: new Date()})
    }, [setDateDiff, onEdit]);

    return (
        <IonItemSliding>
            <IonItem button={true}>
                <IonLabel>{title}</IonLabel>
                <IonNote slot="end">{dateDiff}</IonNote>
            </IonItem>
            <IonItemOptions slot="end">
                <IonItemOption color="warning">
                    <IonIcon slot="icon-only" icon={refresh} onClick={() => onEditCallback()}></IonIcon>
                </IonItemOption>
                <IonItemOption color="tertiary">
                    <IonIcon slot="icon-only" icon={pencil}></IonIcon>
                </IonItemOption>
                <IonItemOption color="danger" expandable={true} onClick={() => onDelete({id, title, date})}>
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
}

export default EventItem;