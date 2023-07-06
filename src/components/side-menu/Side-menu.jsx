import { ListGroup } from 'react-bootstrap';

let menuData = require('../../assets/data/menu.json');

export default function SideMenu() {
    const menuItems = [];

    menuData.data.forEach(menuItemData => {
        menuItems.push(
            <ListGroup.Item key={menuItemData.title} action href={menuItemData.url}>
                {menuItemData.title}
            </ListGroup.Item>
        );  
    });

    return (
        <ListGroup className="flex-fill">
            {menuItems}
        </ListGroup>
    );
}