"use client";

import { useState, useEffect } from "react";
import AddMenuForm from "./AddMenuForm";
import EditMenuForm from "./EditMenuForm";
import MenuList from "./MenuList";


function MenuForm() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/menu");
      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }
      const data = await response.json();
      
      console.log("Fetched menu items:", data); // Debugging
  
      // Ensure that data is an array of valid menu items
      if (!Array.isArray(data)) {
        throw new Error("Invalid menu data format");
      }
  
      setMenuItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleMenuAdded = (newItem) => { // รับ newItem
    //  เพิ่ม item ใหม่เข้าไปใน state (optimistic update):
    console.log(newItem)
    // setMenuItems(prevItems => [...prevItems, newItem]);
    fetchMenuItems() // ไม่ต้อง fetch ใหม่แล้ว
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleMenuUpdated = (updatedItem) => {
    // Optimistic update:  Update state ทันที
    // setMenuItems(prevItems =>
    //   prevItems.map(item => (Number(item.menu_id) === Number(updatedItem.menu_id) ? updatedItem : item))
    // );
    setEditingItem(null); // Clear editing state
    fetchMenuItems(); // ไม่ต้อง fetch ใหม่แล้ว
  };


  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/menu/id/${Number(id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json(); // อ่าน error message
        throw new Error(errorData.message || "Failed to delete menu item");
      }

      // Optimistic update: ลบออกจาก state ทันที
      setMenuItems(prevItems => prevItems.filter(item => Number(item.menu_id) !== Number(id)));

    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <AddMenuForm onMenuAdded={handleMenuAdded} />

      {editingItem && (
        <EditMenuForm
          item={editingItem}
          onMenuUpdated={handleMenuUpdated}
          onCancel={handleCancelEdit}
        />
      )}

      <MenuList menuItems={menuItems} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default MenuForm;