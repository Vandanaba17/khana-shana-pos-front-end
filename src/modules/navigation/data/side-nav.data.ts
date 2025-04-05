import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: 'Sales',
        items: ['sales'],
    },
    {
        text: 'Catalog',
        items: ['products', 'categories'],
    },
];

export const sideNavItems: SideNavItems = {

    // Expenses
    purchase_orders: {
        icon: 'shopping-cart',
        text: 'Purchases',
        link: '/purchase_orders'
    },
    item_groups: {
        icon: 'cubes',
        text: 'Item Groups',
        link: '/item_groups'
    },
    items: {
        icon: 'cube',
        text: 'Items',
        link: '/items'
    },

    // Sales
    sales: {
        icon: 'cash-register',
        text: 'Sales',
        link: '/sales'
    },


    // Catalog

    products: {
        icon: 'clipboard-list',
        text: 'Menu Items',
        link: '/catalog/products',
    },
    categories: {
        icon: 'list-alt',
        text: 'Menu Categories',
        link: '/catalog/categories'
    },

    pages: {
        icon: 'book-open',
        text: 'Products',
        submenu: [
            {
                text: 'Authentication',
                submenu: [
                    {
                        text: 'Login',
                        link: '/auth/login',
                    },
                    {
                        text: 'Register',
                        link: '/auth/register',
                    },
                    {
                        text: 'Forgot Password',
                        link: '/auth/forgot-password',
                    },
                ],
            },
            {
                text: 'Error',
                submenu: [
                    {
                        text: '401 Page',
                        link: '/error/401',
                    },
                    {
                        text: '404 Page',
                        link: '/error/404',
                    },
                    {
                        text: '500 Page',
                        link: '/error/500',
                    },
                ],
            },
        ],
    },
};
