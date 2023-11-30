function Operate(wareHouseData, shopshelf) {
  this.getWarehouse = () => {
    return wareHouseData;
  };

  this.getShopItems = () => {
    return shopshelf;
  };

  this.clearWarehouse = () => {
    wareHouseData = [];
  };

  //Transfers items from warehouse shelf to store shelf
  this.fromShelfToStore = async (id) => {
    const shelfItem = await this.getWarehouse().find(
      (element) => element.id === id
    );
    await this.getShopItems().push(shelfItem);
    //function used to filter found item from the original array - based on it's first matching index
    const deleteFoundItem = (value, index, arr) => {
      if (value === shelfItem) {
        arr.splice(index, 1);
        return true;
      }
      return false;
    };
    await this.getWarehouse().filter(deleteFoundItem);
    return this.getShopItems();
  };

  this.disposeDefectedItem = async (id) => {
    const defectedItem = await this.getWarehouse().find(
      (item) => item.id === id
    );
    await this.getWarehouse().filter((element) => element !== defectedItem);
  };

  this.sendBackToWarehouse = async (productName, productCategory) => {
    const surplus = await this.getWarehouse().findLast(
      (element) =>
        element.product_category === productCategory &&
        element.product_name === productName
    );

    //Assigns a special label to returned inventory
    surplus.specialStatus = "Returned";
    await this.showReceivedGoods().shift(surplus);

    const deleteFoundItem = (value, index, arr) => {
      if (value === surplus) {
        arr.splice(index, 1);
        return true;
      }
      return false;
    };

    await this.getWarehouse().filter(deleteFoundItem);
    return this.getWarehouse();
  };
}

export { Operate };
