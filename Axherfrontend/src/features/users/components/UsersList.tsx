import { UserList } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import MoreMenu from "../../../shared/components/ui/MoreMenu";

interface Props {
    users: UserList[];
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onManageRoles: (user: UserList) => void;
}

export default function UsersList({
    users, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange, onManageRoles
}: Props) {

    return (

        <div className={layoutStyles.section}>
            <h2>Usuarios</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar por email o username..."
                    value={searchTerm} // controlado desde el hook padre
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>
            {users.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay usuarios para mostrar."}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                                <th className={tableStyles.headCell}>Email</th>
                                <th className={tableStyles.headCell}>Username</th>
                                <th className={tableStyles.headCell}>Roles</th>
                                <th className={tableStyles.headCell}>Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} className={tableStyles.rowHover}>
                                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{user.userId}</td>
                                    <td className={tableStyles.cell}>{user.email}</td>
                                    <td className={tableStyles.cell}>{user.username || "-"}</td>
                                    <td className={tableStyles.cell}>{user.roles.join(", ") || "-"}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                        <MoreMenu
                                            items={[
                                                {label: "Gestionar Roles", onClick: () => onManageRoles(user)},
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}
            {users.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}

        </div>
    );
}