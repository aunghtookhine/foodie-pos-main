import { CartItem } from "@/types/cart";
import { OrderAddon } from "@/types/order";
import { Addon, Menu, Order, Table } from "@prisma/client";

export const getTotalAmount = (cart: CartItem[]) => {
  return cart.reduce((prev, curr) => {
    const menuPrice = curr.menu.price;
    const totalAddonPrice = curr.addons.reduce(
      (prev, curr) => (prev += curr.price),
      0
    );
    return (prev += (menuPrice + totalAddonPrice) * curr.quantity);
  }, 0);
};

export const formatOrders = (
  orders: Order[],
  addons: Addon[],
  menus: Menu[],
  tables: Table[]
) => {
  /* 
  orderItem format
  orderItems = [
    {
      itemId: asdasdsad,
      status: PENDING,
      orderAddons: [
        {
          addonCategoryId: 1,
          addons: [
            {},{}
          ]
        }
      ]
    }
  ]
  */
  const orderItemIds: string[] = [];
  orders.map((order) => {
    const isExist = orderItemIds.includes(order.itemId);
    if (!isExist) orderItemIds.push(order.itemId);
  });
  const orderItem = orderItemIds.map((orderItemId) => {
    const currentOrders = orders.filter(
      (order) => order.itemId === orderItemId
    );
    const addonIds = currentOrders.map((currentOrder) => currentOrder.addonId);
    let orderAddons: OrderAddon[] = [];
    addonIds.map((addonId) => {
      const addon = addons.find((addon) => addon.id === addonId) as Addon;
      const isExist = orderAddons.find(
        (orderAddon) => orderAddon.addonCategoryId === addon.addonCategoryId
      );
      if (isExist) {
        orderAddons = orderAddons.map((orderAddon) => {
          const isSameParent =
            orderAddon.addonCategoryId === addon.addonCategoryId;
          if (isSameParent) {
            return {
              addonCategoryId: orderAddon.addonCategoryId,
              addons: [...orderAddon.addons, addon],
            };
          } else {
            return orderAddon;
          }
        });
      } else {
        orderAddons = [
          ...orderAddons,
          { addonCategoryId: addon.addonCategoryId, addons: [addon] },
        ];
      }
    });
    return {
      itemId: orderItemId,
      status: currentOrders[0].status,
      orderAddons,
      menu: menus.find((menu) => menu.id === currentOrders[0].menuId) as Menu,
      table: tables.find(
        (table) => table.id === currentOrders[0].tableId
      ) as Table,
    };
  });
  return orderItem.sort((a, b) => a.itemId.localeCompare(b.itemId));
};
