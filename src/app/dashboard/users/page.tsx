
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserFormDialog, type UserFormData } from "@/components/dashboard/user-form-dialog";
import { UserDetailsDialog } from "@/components/dashboard/user-details-dialog";
import { Users, PlusCircle, Edit3, Trash2, UserCircle2 } from "lucide-react";
import { mockUsers, mockTickets, mockEquipment } from "@/lib/placeholder-data"; 
import type { User, Ticket, Equipment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null);
  const [userToDeleteId, setUserToDeleteId] = React.useState<string | null>(null);
  
  const [selectedUserForDetails, setSelectedUserForDetails] = React.useState<User | null>(null);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = React.useState(false);

  const handleAddUserClick = () => {
    setUserToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleEditUserClick = (user: User) => {
    setUserToEdit(user);
    setIsFormDialogOpen(true);
  };

  const handleDeleteUserClick = (userId: string) => {
    setUserToDeleteId(userId);
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUserForDetails(user);
    setIsUserDetailsDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDeleteId) {
      const userBeingDeleted = users.find(u => u.id === userToDeleteId);
      setUsers(users.filter((user) => user.id !== userToDeleteId));
      toast({
        title: "User Deleted",
        description: `${userBeingDeleted?.name || 'The user'} has been successfully removed.`,
      });
      setUserToDeleteId(null);
    }
  };

  const handleSaveUser = (data: UserFormData) => {
    if (userToEdit) {
      // Edit existing user
      setUsers(
        users.map((user) =>
          user.id === userToEdit.id ? { ...user, ...data } : user
        )
      );
      toast({
        title: "User Updated",
        description: `${data.name}'s details have been successfully updated.`,
      });
    } else {
      // Add new user
      const newUser: User = {
        id: `user-${Date.now()}`, // Simple ID generation for mock
        ...data,
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: `${data.name} has been successfully added.`,
      });
    }
    setIsFormDialogOpen(false);
    setUserToEdit(null);
  };

  const userToDeleteDetails = users.find(u => u.id === userToDeleteId);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage users and their roles within the HelpDesk Lite system. Click a user row to view details.
            </CardDescription>
          </div>
          <Button onClick={handleAddUserClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      onClick={() => handleViewUserDetails(user)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.role === "IT_Support" ? "default" : "secondary"}>
                          {user.role === "IT_Support" ? "IT Support" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleEditUserClick(user);}}
                          className="mr-2 hover:text-primary"
                          aria-label={`Edit user ${user.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleDeleteUserClick(user.id);}}
                          className="hover:text-destructive"
                          aria-label={`Delete user ${user.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-md">
              <UserCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No Users Found</p>
              <p className="text-muted-foreground">Click "Add User" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setUserToEdit(null);
        }}
        userToEdit={userToEdit}
        onSave={handleSaveUser}
      />

      {selectedUserForDetails && (
        <UserDetailsDialog
          isOpen={isUserDetailsDialogOpen}
          onClose={() => {
            setIsUserDetailsDialogOpen(false);
            setSelectedUserForDetails(null);
          }}
          user={selectedUserForDetails}
          tickets={mockTickets}
          equipment={mockEquipment}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDeleteId} onOpenChange={(open) => !open && setUserToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user <span className="font-semibold">{userToDeleteDetails?.name}</span> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
