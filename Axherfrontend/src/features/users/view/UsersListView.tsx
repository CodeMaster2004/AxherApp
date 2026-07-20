"use client";

import {  UserList } from "@/entities/types";
import { useSystemRoles } from "@/features/systemRoles/hooks";
import UserRoleAssignmentModal from "@/features/userRoleAssignments/components/UserRoleAssignmentModal";
import { useUserRoleAssignments, useUserRoleAssignmentsActions } from "@/features/userRoleAssignments/hooks";
import UsersList from "@/features/users/components/UsersList";
import { useUsers } from "@/features/users/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";


export default function UsersListView (){
    const {
        users,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = useUsers();

    

    //---------------------------------
    // Estados para modal de roles
    //---------------------------------
    const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const userId = selectedUser?.userId ; // siempre pasa un número
    const { roles: userRoles, loading: loadingRoles } = useUserRoleAssignments(userId);
    const { systemRoles: allRoles, loading: loadingAllRoles } = useSystemRoles(); // <-- agregar esto
    const {
        assignRoles,
        removeRoles,
        saving: savingRoles,
        removing: removingRoles,
        error: roleError,
    } = useUserRoleAssignmentsActions({
        onSuccess: refetch, // o recarga de roles si prefieres
    });

    const handleManageRoles = (user: UserList) => {
        setSelectedUser(user);
        setModalOpen(true);
    };;

    return (
    <div className={layoutStyles.pageContainer}>
      <div className={layoutStyles.header}>
        <h1>Usuarios</h1>
        <Button variant="animated" onClick={() => console.log("Crear usuario")}>
          Crear Usuario
        </Button>
      </div>

      <UsersList
        users={users}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        onSearchChange={(term: string) => {
            console.log("Buscando:", term);
            setSearchTerm(term);
            goToPage(0);
        }}
        onManageRoles={handleManageRoles}
      />


      {/* Modal para gestionar roles */}
            {modalOpen && selectedUser && (
                <UserRoleAssignmentModal
                    isOpen={modalOpen}
                    user={selectedUser}
                    allRoles={allRoles}
                    userCurrentRoles={userRoles.map(r => r.roleName)}
                    loading={loadingRoles}
                    saving={savingRoles}
                    removing={removingRoles}
                    onAssignRoles={assignRoles}
                    onRemoveRoles={removeRoles}
                    onClose={() => setModalOpen(false)}
                    
                />
            )}
    </div>
  );
}