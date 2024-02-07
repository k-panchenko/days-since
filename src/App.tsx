import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonAvatar, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonRouterOutlet, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { pencil, pin, refresh, share, trash, trashBinOutline } from 'ionicons/icons';

import WebApp from '@twa-dev/sdk';
import { MainButton } from '@twa-dev/sdk/react';
import { useCallback, useEffect, useState } from 'react';
import eruda from 'eruda';
import EventItem, { ItemProps } from './components/EventItem';
import {v4 as uuidv4} from 'uuid';

setupIonicReact();
WebApp.ready();
WebApp.expand();
eruda.init();

const App: React.FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    WebApp.CloudStorage.getKeys((error, result) => {
      WebApp.CloudStorage.getItems(result!, (error, result) => {
        setItems(Array.from(Object.entries(result!)).map(([key, value])  => {
          const {title, date} = JSON.parse(value);
          const parsedValue = {title, date: new Date(date), id: key}
          return parsedValue;
        }).sort((left, right) => left.date.getTime() - right.date.getTime()));
      });
    });
  }, []);

  const handleAddItem = () => {
    const title = prompt("Input item title:");
    if (!title) {
      return;
    }

    const id = uuidv4();
    const date = new Date();
    WebApp.CloudStorage.setItem(id, JSON.stringify({
      title: title,
      date: date
    }));

    setItems((prevData) => ([
      ...prevData,
      {
        id: id,
        title: title,
        date: date
      }
    ]));
  };

  const onDelete = useCallback((item: ItemProps) => {
    WebApp.CloudStorage.removeItem(item.id, (error, result) => {
      if (!error) {
        setItems(prev => {
          const arr = [...prev];
          arr.splice(prev.indexOf(item), 1);
          return arr;
        });
      }
    });
  }, [setItems]);

  const onEdit = useCallback((item: ItemProps) => {
    WebApp.CloudStorage.setItem(item.id, JSON.stringify({
      title: item.title,
      date: item.date
    }));
  }, [setItems]);

  return (
    <IonApp>
      <IonContent color="light">
        <IonList inset={true}>
          {
            items.map(({id, title, date}) => <EventItem key={id} id={id} title={title} date={date} onDelete={onDelete} onEdit={onEdit}/>)
          }
        </IonList>
      </IonContent>
      <MainButton text="Add new item" onClick={handleAddItem} />
    </IonApp>
  );
};

export default App;
