// src/app/Admin/Menu/page.js
import MenuForm from "../../components/MenuForm/MenuForm";

export default function AdminMenuPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Menu Management</h1>
      <MenuForm />
    </div>
  );
}